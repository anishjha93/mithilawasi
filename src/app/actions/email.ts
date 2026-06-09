'use server';

import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/mail';
import { getSubscribersForAdmin } from './subscribe';
import { initAdmin } from '@/lib/firebase-admin';

export interface EmailLog {
    id: string;
    sentAt: string;
    recipientCount: number;
    subject: string;
    status: 'sent' | 'failed' | 'partial';
}

const COLLECTION = 'email_logs';

async function getLogs(): Promise<EmailLog[]> {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return [];
        const db = adminApp.firestore();
        const snapshot = await db.collection(COLLECTION).orderBy('sentAt', 'desc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as EmailLog[];
    } catch {
        return [];
    }
}

async function saveLog(log: EmailLog) {
    const adminApp = await initAdmin();
    if (!adminApp) throw new Error('Firebase not initialized');
    const db = adminApp.firestore();
    await db.collection(COLLECTION).doc(log.id).set(log);
}

export async function getEmailLogsAction() {
    return await getLogs();
}

export async function sendEmailCampaign(subject: string, body: string, testEmail?: string) {
    if (!subject || !body) {
        return { success: false, message: 'Subject and body are required' };
    }

    try {
        // Test Mode
        if (testEmail) {
            const success = await sendEmail(testEmail, `[TEST] ${subject}`, body);
            return success
                ? { success: true, message: `Test email sent to ${testEmail}` }
                : { success: false, message: 'Failed to send test email' };
        }

        // Campaign Mode
        const subscribers = await getSubscribersForAdmin();
        const activeSubscribers = subscribers.filter(s => s.status !== 'unsubscribed');
        
        if (activeSubscribers.length === 0) {
            return { success: false, message: 'No active subscribers found' };
        }

        // Send to all (Sequential to avoid rate limits on free plans)
        let successCount = 0;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mithilawasi.com';

        for (const sub of activeSubscribers) {
            try {
                const unsubscribeLink = `${baseUrl}/en/unsubscribe?email=${encodeURIComponent(sub.email)}`;

                // Replace unsubscribe placeholder if it exists in the template
                const personalizedBody = body.replace(/\[UNSUBSCRIBE_LINK\]/g, unsubscribeLink);

                const result = await sendEmail(sub.email, subject, personalizedBody);
                if (result) successCount++;
                // Add tiny delay
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {
                console.error(`Failed to send to ${sub.email}`, e);
            }
        }

        // Log
        const newLog: EmailLog = {
            id: crypto.randomUUID(),
            sentAt: new Date().toISOString(),
            recipientCount: successCount,
            subject,
            status: successCount === activeSubscribers.length ? 'sent' : 'partial'
        };
        
        await saveLog(newLog);

        revalidatePath('/[lang]/admin/emails', 'page');
        return {
            success: true,
            message: `Campaign sent to ${successCount} of ${activeSubscribers.length} subscribers`
        };

    } catch (error) {
        console.error('Campaign error:', error);
        return { success: false, message: 'Critical error sending campaign' };
    }
}

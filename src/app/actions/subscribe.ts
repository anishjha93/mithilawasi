'use server';

import { revalidatePath } from 'next/cache';
// import { sendWelcomeEmail } from '@/lib/mail';
import { getDb } from '@/lib/db';

export interface Subscriber {
    email: string;
    date: string;
    source: string;
    status?: 'active' | 'unsubscribed';
}

async function getSubscribersFromD1(): Promise<Subscriber[]> {
    try {
        const db = getDb();
        if (!db) return [];
        
        const { results } = await db.prepare('SELECT * FROM subscribers ORDER BY date DESC').all();
        return results as unknown as Subscriber[];
    } catch (error) {
        console.error('Error fetching subscribers from D1:', error);
        return [];
    }
}

async function getSubscriber(email: string): Promise<Subscriber | null> {
    const db = getDb();
    if (!db) return null;

    try {
        const result = await db.prepare('SELECT * FROM subscribers WHERE email = ?')
            .bind(email.toLowerCase())
            .first();
        
        return result as Subscriber | null;
    } catch (e) {
        // If table doesn't exist, treat as subscriber not found
        return null;
    }
}

async function saveSubscriberToD1(subscriber: Subscriber) {
    const db = getDb();
    if (!db) throw new Error('D1 Database not initialized');
    
    console.log('Saving subscriber to D1:', subscriber.email);
    try {
        await db.prepare(
            'INSERT INTO subscribers (email, date, source, status) VALUES (?, ?, ?, ?)'
        ).bind(
            subscriber.email.toLowerCase(),
            subscriber.date,
            subscriber.source,
            subscriber.status || 'active'
        ).run();
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            console.log('Table "subscribers" missing. Creating it now...');
            await db.prepare(`
                CREATE TABLE IF NOT EXISTS subscribers (
                    email TEXT PRIMARY KEY,
                    date TEXT NOT NULL,
                    source TEXT NOT NULL,
                    status TEXT DEFAULT 'active'
                )
            `).run();
            // Retry
            await db.prepare(
                'INSERT INTO subscribers (email, date, source, status) VALUES (?, ?, ?, ?)'
            ).bind(
                subscriber.email.toLowerCase(),
                subscriber.date,
                subscriber.source,
                subscriber.status || 'active'
            ).run();
        } else {
            throw error;
        }
    }
}

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const source = (formData.get('source') as string) || 'website';

    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
        console.log('Starting newsletter subscription for:', email);
        const existing = await getSubscriber(email);

        if (existing) {
            if (existing.status === 'unsubscribed') {
                // Reactivate
                const updated: Subscriber = {
                    ...existing,
                    status: 'active',
                    date: new Date().toISOString()
                };
                await saveSubscriberToD1(updated);
                return { success: true, message: 'Welcome back! You have been resubscribed.' };
            }
            return { success: true, message: 'You correspond directly with our hearts! (Already subscribed)' };
        }

        const newSubscriber: Subscriber = {
            email: email.toLowerCase(),
            date: new Date().toISOString(),
            source,
            status: 'active'
        };

        await saveSubscriberToD1(newSubscriber);
        console.log('Subscriber saved to D1 successfully.');

        /*
        try {
            revalidatePath('/[lang]/admin/subscribers', 'page');
        } catch (revalidateError) {
            console.warn('Revalidation failed (non-critical):', revalidateError);
        }
        */

        return { success: true, message: 'Welcome to the Mithila family!' };
    } catch (error: any) {
        console.error('Subscription error details:', error.message || error);
        return { success: false, message: `Something went wrong: ${error.message || 'Please try again'}` };
    }
}

export async function getSubscribersForAdmin(): Promise<Subscriber[]> {
    return await getSubscribersFromD1();
}

export async function addSubscriberManually(email: string, source: string = 'admin_manual') {
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Invalid email' };
    }

    try {
        const existing = await getSubscriber(email);
        if (existing && existing.status === 'active') {
            return { success: false, message: 'Already subscribed' };
        }

        const newSubscriber: Subscriber = {
            email: email.toLowerCase(),
            date: new Date().toISOString(),
            source,
            status: 'active'
        };

        await saveSubscriberToD1(newSubscriber);
        revalidatePath('/[lang]/admin/subscribers', 'page');

        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to save' };
    }
}

export async function deleteSubscriber(email: string) {
    try {
        const db = getDb();
        if (!db) return { success: false, message: 'Database not initialized' };
        
        await db.prepare('DELETE FROM subscribers WHERE email = ?').bind(email.toLowerCase()).run();
        revalidatePath('/[lang]/admin/subscribers', 'page');
        return { success: true, message: 'Subscriber removed' };
    } catch (error) {
        return { success: false, message: 'Failed to delete' };
    }
}

export async function unsubscribeSubscriber(email: string) {
    try {
        const existing = await getSubscriber(email);
        if (!existing) {
            return { success: false, message: 'Subscriber not found' };
        }

        existing.status = 'unsubscribed';
        await saveSubscriberToD1(existing);
        revalidatePath('/[lang]/admin/subscribers', 'page');
        return { success: true, message: 'Unsubscribed successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to unsubscribe' };
    }
}


import { revalidatePath } from 'next/cache';
import { initAdmin } from '@/lib/firebase-admin';

export interface PanchangDayData {
    tithi: string;
    tithi_start_time: string;
    tithi_end_time: string;
    next_tithi: string;
}

export type PanchangDataMap = Record<string, PanchangDayData>;

export async function getPanchangData() {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return {};
        
        const db = adminApp.firestore();
        const snapshot = await db.collection('panchang').get();
        
        const data: PanchangDataMap = {};
        snapshot.forEach(doc => {
            data[doc.id] = doc.data() as PanchangDayData;
        });
        
        return data;
    } catch (error) {
        console.error('Error reading panchang data:', error);
        return {};
    }
}

export async function getPanchangDay(date: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        
        const db = adminApp.firestore();
        const doc = await db.collection('panchang').doc(date).get();
        return doc.exists ? (doc.data() as PanchangDayData) : null;
    } catch (error) {
        console.error('Error reading panchang day:', error);
        return null;
    }
}

export async function savePanchangDay(date: string, dayData: PanchangDayData) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('panchang').doc(date).set(dayData);

        revalidatePath('/[lang]/panchang', 'page');
        revalidatePath('/[lang]/admin/panchang', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Panchang updated successfully' };
    } catch (error) {
        console.error('Error saving panchang data:', error);
        return { success: false, message: 'Failed to update panchang' };
    }
}

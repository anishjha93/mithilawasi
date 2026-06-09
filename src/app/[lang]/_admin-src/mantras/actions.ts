import { revalidatePath } from 'next/cache';
import { initAdmin } from '@/lib/firebase-admin';
import { getCollectionData } from '@/lib/data-service';

// Interface definition matching the new structure
export interface MantraLocale {
    title: string;
    meaning: string;
    transliteration?: string;
}

export interface Mantra {
    slug: string;
    category: string;
    tags: string[];
    mantra: string; // Sanskrit text
    locales: {
        en: MantraLocale;
        hi: MantraLocale;
        mai: MantraLocale;
    };
    externalLink?: string;
}

export async function getAllMantrasForAdmin() {
    return getCollectionData<Mantra>('mantras', 'slug');
}

export async function getMantraBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        
        const db = adminApp.firestore();
        const doc = await db.collection('mantras').doc(slug).get();
        return doc.exists ? (doc.data() as Mantra) : null;
    } catch (error) {
        console.error('Error reading mantra by slug:', error);
        return null;
    }
}

export async function saveMantra(mantra: Mantra, isNew: boolean) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        
        if (isNew) {
            const existing = await db.collection('mantras').doc(mantra.slug).get();
            if (existing.exists) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection('mantras').doc(mantra.slug).set(mantra);

        revalidatePath('/[lang]/mantras', 'page');
        revalidatePath('/[lang]/admin/mantras', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Mantra saved successfully' };
    } catch (error) {
        console.error('Error saving mantra:', error);
        return { success: false, message: 'Failed to save mantra' };
    }
}

export async function deleteMantra(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('mantras').doc(slug).delete();

        revalidatePath('/[lang]/mantras', 'page');
        revalidatePath('/[lang]/admin/mantras', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Mantra deleted successfully' };
    } catch (error) {
        console.error('Error deleting mantra:', error);
        return { success: false, message: 'Failed to delete mantra' };
    }
}

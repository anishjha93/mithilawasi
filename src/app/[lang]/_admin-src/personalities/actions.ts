import { revalidatePath } from 'next/cache';
import { initAdmin } from '@/lib/firebase-admin';
import { getCollectionData } from '@/lib/data-service';

export interface PersonalityLocale {
    name: string;
    description: string;
    achievements: string[]; // List of key contributions
    period?: string; // e.g. "14th Century"
}

export interface Personality {
    slug: string;
    image?: string;
    born?: string;
    died?: string;
    profession: string[]; // Poet, Philosopher, etc.
    locales: {
        en: PersonalityLocale;
        hi: PersonalityLocale;
        mai: PersonalityLocale;
    };
    featured?: boolean;
}

export async function getAllPersonalities() {
    return getCollectionData<Personality>('personalities', 'slug');
}

export async function getPersonalityBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        
        const db = adminApp.firestore();
        const doc = await db.collection('personalities').doc(slug).get();
        return doc.exists ? (doc.data() as Personality) : null;
    } catch (error) {
        console.error('Error reading personality by slug:', error);
        return null;
    }
}

export async function savePersonality(personality: Personality, isNew: boolean) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        
        if (isNew) {
            const existing = await db.collection('personalities').doc(personality.slug).get();
            if (existing.exists) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection('personalities').doc(personality.slug).set(personality);

        revalidatePath('/[lang]/personalities', 'page');
        revalidatePath('/[lang]/admin/personalities', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Saved successfully' };
    } catch (error) {
        console.error('Error saving personality:', error);
        return { success: false, message: 'Failed to save' };
    }
}

export async function deletePersonality(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('personalities').doc(slug).delete();

        revalidatePath('/[lang]/personalities', 'page');
        revalidatePath('/[lang]/admin/personalities', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Deleted successfully' };
    } catch (error) {
        console.error('Error deleting personality:', error);
        return { success: false, message: 'Failed to delete' };
    }
}

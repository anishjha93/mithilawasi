'use server';

import { revalidatePath } from 'next/cache';

export interface PlaceLocale {
    name: string;
    description: string;
    location: string; // e.g. "Madhubani, Bihar"
    significance: string; // "Historical", "Religious", etc.
}

export interface Place {
    slug: string;
    images: string[];
    coordinates?: string; // "lat,lng"
    mapEmbedUrl?: string; // Google Maps embed URL
    locales: {
        en: PlaceLocale;
        hi: PlaceLocale;
        mai: PlaceLocale;
    };
    featured?: boolean;
}

import { initAdmin } from '@/lib/firebase-admin';

const COLLECTION = 'places';

export async function getAllPlaces() {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return [];
        const db = adminApp.firestore();
        const snapshot = await db.collection(COLLECTION).get();
        return snapshot.docs.map(doc => doc.data() as Place);
    } catch (error) {
        console.error('Error reading places from Firestore:', error);
        return [];
    }
}

export async function getPlaceBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        const db = adminApp.firestore();
        const doc = await db.collection(COLLECTION).doc(slug).get();
        return doc.exists ? (doc.data() as Place) : null;
    } catch (error) {
        console.error('Error getting place from Firestore:', error);
        return null;
    }
}

export async function savePlace(place: Place, isNew: boolean) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, message: 'Firebase not initialized' };
        const db = adminApp.firestore();

        if (isNew) {
            const existing = await getPlaceBySlug(place.slug);
            if (existing) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection(COLLECTION).doc(place.slug).set(place, { merge: true });

        revalidatePath('/[lang]/places', 'page');
        revalidatePath('/[lang]/admin/places', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Saved successfully' };
    } catch (error) {
        console.error('Error saving place:', error);
        return { success: false, message: 'Failed to save' };
    }
}

export async function deletePlace(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, message: 'Firebase not initialized' };
        const db = adminApp.firestore();

        await db.collection(COLLECTION).doc(slug).delete();

        revalidatePath('/[lang]/places', 'page');
        revalidatePath('/[lang]/admin/places', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Deleted successfully' };
    } catch (error) {
        console.error('Error deleting place:', error);
        return { success: false, message: 'Failed to delete' };
    }
}

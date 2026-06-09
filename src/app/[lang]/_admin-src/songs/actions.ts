import { revalidatePath } from 'next/cache';
import { Song } from '@/data/songs';
import { initAdmin } from '@/lib/firebase-admin';

const COLLECTION = 'songs';

export async function getAllSongsForAdmin() {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return [];
        const db = adminApp.firestore();
        const snapshot = await db.collection(COLLECTION).get();
        return snapshot.docs.map(doc => doc.data() as Song);
    } catch (error) {
        console.error('Error reading songs from Firestore:', error);
        return [];
    }
}

export async function getSongBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        const db = adminApp.firestore();
        const doc = await db.collection(COLLECTION).doc(slug).get();
        return doc.exists ? (doc.data() as Song) : null;
    } catch (error) {
        console.error('Error getting song by slug from Firestore:', error);
        return null;
    }
}

export async function saveSong(song: Song, isNew: boolean) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, message: 'Firebase not initialized' };
        const db = adminApp.firestore();
        
        if (isNew) {
            const existing = await getSongBySlug(song.slug);
            if (existing) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection(COLLECTION).doc(song.slug).set(song, { merge: true });

        revalidatePath('/[lang]/songs', 'page');
        revalidatePath('/[lang]/admin/songs', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Song saved successfully' };
    } catch (error) {
        console.error('Error saving song:', error);
        return { success: false, message: 'Failed to save song' };
    }
}

export async function deleteSong(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, message: 'Firebase not initialized' };
        const db = adminApp.firestore();
        
        await db.collection(COLLECTION).doc(slug).delete();

        revalidatePath('/[lang]/songs', 'page');
        revalidatePath('/[lang]/admin/songs', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Song deleted successfully' };
    } catch (error) {
        console.error('Error deleting song:', error);
        return { success: false, message: 'Failed to delete song' };
    }
}

import { revalidatePath } from 'next/cache';
import { initAdmin } from '@/lib/firebase-admin';
import { getCollectionData } from '@/lib/data-service';

export interface IconData {
    id: string; // Unique ID
    name: string;
    url: string;
    tags: string[];
    category: string;
}

export async function getAllIcons() {
    return getCollectionData<IconData>('icons', 'id');
}

export async function saveIcon(icon: IconData) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        // Use icon.id as the document ID
        await db.collection('icons').doc(icon.id).set(icon);
        
        revalidatePath('/[lang]/admin/icons', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Saved successfully' };
    } catch (error) {
        console.error('Error saving icon:', error);
        return { success: false, message: 'Failed to save' };
    }
}

export async function deleteIcon(id: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('icons').doc(id).delete();
        
        revalidatePath('/[lang]/admin/icons', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Deleted successfully' };
    } catch (error) {
        console.error('Error deleting icon:', error);
        return { success: false, message: 'Failed to delete' };
    }
}

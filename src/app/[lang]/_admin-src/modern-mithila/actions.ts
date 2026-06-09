"use server";

import { revalidatePath } from 'next/cache';
import { initAdmin } from '@/lib/firebase-admin';
import { ModernPost, ModernPostLocale, getAllModernPosts, getModernPostBySlug } from '@/data/modern-mithila';

export { getAllModernPosts, getModernPostBySlug };
export type { ModernPost, ModernPostLocale };

export async function saveModernPost(post: ModernPost, isNew: boolean) {
    try {
        const adminApp = await await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        
        if (isNew) {
            const existing = await db.collection('modern_mithila').doc(post.slug).get();
            if (existing.exists) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection('modern_mithila').doc(post.slug).set(post);

        revalidatePath('/[lang]/modern-mithila', 'page');
        revalidatePath('/[lang]/admin/modern-mithila', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Saved successfully' };
    } catch (error) {
        console.error('Error saving modern post:', error);
        return { success: false, message: 'Failed to save' };
    }
}

export async function deleteModernPost(slug: string) {
    try {
        const adminApp = await await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('modern_mithila').doc(slug).delete();

        revalidatePath('/[lang]/modern-mithila', 'page');
        revalidatePath('/[lang]/admin/modern-mithila', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Deleted successfully' };
    } catch (error) {
        console.error('Error deleting modern post:', error);
        return { success: false, message: 'Failed to delete' };
    }
}

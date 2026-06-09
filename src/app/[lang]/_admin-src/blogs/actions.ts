import { revalidatePath } from 'next/cache';
import { BlogPost } from '@/lib/blogs';
import { initAdmin } from '@/lib/firebase-admin';

const COLLECTION = 'blogs';

export async function getBlog(slug: string, lang: string): Promise<BlogPost | null> {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        const db = adminApp.firestore();
        const docId = `${slug}-${lang}`;
        const doc = await db.collection(COLLECTION).doc(docId).get();
        return doc.exists ? (doc.data() as BlogPost) : null;
    } catch (error) {
        console.error('Failed to get blog:', error);
        return null;
    }
}

export async function saveBlog(blog: BlogPost) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, error: 'Firebase not initialized' };
        
        const db = adminApp.firestore();
        const docId = `${blog.slug}-${blog.lang}`;
        
        await db.collection(COLLECTION).doc(docId).set(blog, { merge: true });

        revalidatePath('/[lang]/blog', 'page');
        revalidatePath('/[lang]/blog/[slug]', 'page');
        revalidatePath('/[lang]/admin/blogs', 'page');
        revalidatePath('/[lang]/admin', 'page');

        return { success: true };
    } catch (error) {
        console.error('Failed to save blog:', error);
        return { success: false, error: 'Failed to save blog' };
    }
}

export async function deleteBlog(slug: string, lang: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return { success: false, error: 'Firebase not initialized' };
        
        const db = adminApp.firestore();
        const docId = `${slug}-${lang}`;
        
        await db.collection(COLLECTION).doc(docId).delete();

        revalidatePath('/[lang]/blog', 'page');
        revalidatePath('/[lang]/admin/blogs', 'page');
        revalidatePath('/[lang]/admin', 'page');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return { success: false, error: 'Failed to delete blog' };
    }
}
export async function getAllBlogsForAdminAction(): Promise<BlogPost[]> {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return [];
        const db = adminApp.firestore();
        const snapshot = await db.collection(COLLECTION).get();
        const blogs = snapshot.docs.map(doc => doc.data() as BlogPost);
        return blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to get all blogs for admin:', error);
        return [];
    }
}

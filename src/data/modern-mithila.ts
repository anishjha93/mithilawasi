import { getCollectionData, getDocumentByField } from '../lib/data-service';
import { initAdmin } from '@/lib/firebase-admin';

export interface ModernPostLocale {
    title: string;
    excerpt: string;
    content: string; // Markdown supported
    author: string;
}

export interface ModernPost {
    slug: string;
    image: string;
    category: string; // "Tech", "Art", "News", "Business"
    date: string;
    locales: {
        en: ModernPostLocale;
        hi: ModernPostLocale;
        mai: ModernPostLocale;
    };
    published: boolean;
    tags: string[];
}

export async function getAllModernPosts() {
    return getCollectionData<ModernPost>('modern_mithila', 'slug');
}

export async function getModernPostBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) {
            // Fallback to local JSON via data-service if firebase isn't available
            return getDocumentByField<ModernPost>('modern_mithila', 'slug', slug);
        }
        
        const db = adminApp.firestore();
        const doc = await db.collection('modern_mithila').doc(slug).get();
        return doc.exists ? (doc.data() as ModernPost) : null;
    } catch (error) {
        console.error('Error reading modern post by slug:', error);
        return getDocumentByField<ModernPost>('modern_mithila', 'slug', slug);
    }
}

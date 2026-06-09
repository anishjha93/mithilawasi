import { getCollectionData } from './data-service';

export interface ModernPostLocale {
    title: string;
    excerpt: string;
    content: string;
    author: string;
}

export interface ModernPost {
    slug: string;
    image: string;
    category: string;
    date: string;
    locales: {
        en: ModernPostLocale;
        hi: ModernPostLocale;
        mai: ModernPostLocale;
    };
    published: boolean;
    tags: string[];
}

export async function getModernPosts(): Promise<ModernPost[]> {
    return getCollectionData<ModernPost>('modern_mithila');
}

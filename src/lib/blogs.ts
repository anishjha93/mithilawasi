
import { getCollectionData } from './data-service';

export interface BlogPost {
    slug: string;
    lang: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    image: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
}

// --- DATA ACCESS LAYER ---

async function getAllRawBlogs(): Promise<BlogPost[]> {
    return getCollectionData<BlogPost>('blogs');
}

// --- PUBLIC API ---

export async function getBlogPosts(lang: string = 'en'): Promise<BlogPost[]> {
    const blogs = await getAllRawBlogs();
    const now = new Date();
    return blogs
        .filter(post =>
            post.lang === lang &&
            post.status === 'published' &&
            new Date(post.date) <= now
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string, lang: string = 'en'): Promise<BlogPost | null> {
    const blogs = await getAllRawBlogs();
    const post = blogs.find(p => p.slug === slug && p.lang === lang);
    if (!post) return null;

    const now = new Date();
    const isPublished = post.status === 'published';
    const isPast = new Date(post.date) <= now;

    if (!isPublished || !isPast) return null;

    return post;
}

// For Admin use (no filters)
export async function getAllBlogsForAdmin(): Promise<BlogPost[]> {
    const blogs = await getAllRawBlogs();
    return [...blogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostForAdmin(slug: string, lang: string): Promise<BlogPost | null> {
    const blogs = await getAllRawBlogs();
    const post = blogs.find(p => p.slug === slug && p.lang === lang);
    return post || null;
}

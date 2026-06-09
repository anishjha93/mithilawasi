import { getAllBlogsForAdmin } from "@/lib/blogs";
import { getPersonalities } from "@/lib/personalities";
import { getPlaces } from "@/lib/places";
import { getMantras } from "@/lib/mantras";
import { getRecipes } from "@/data/recipes";

export interface EmailImportContent {
    type: 'blog' | 'personality' | 'place' | 'recipe' | 'mantra';
    slug: string;
    lang: string;
    title: string;
    date?: string;
    image: string;
    excerpt: string;
}

const BASE_URL = "https://mithilawasi.com";

function ensureAbsoluteUrl(url: string | undefined): string {
    if (!url) return 'https://cdn.mithilawasi.com/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `${BASE_URL}/${cleanPath}`;
}

export async function resolveLocalImageToBase64(url: string | undefined): Promise<string> {
    return ensureAbsoluteUrl(url);
}

export async function getEmailContentImports(): Promise<EmailImportContent[]> {
    try {
        const [blogs, personalities, places, mantras, recipes] = await Promise.all([
            getAllBlogsForAdmin(),
            getPersonalities(),
            getPlaces(),
            getMantras(),
            getRecipes()
        ]);

        const imports: EmailImportContent[] = [];

        // Add Blogs
        blogs.forEach(b => imports.push({
            type: 'blog',
            slug: b.slug,
            lang: b.lang,
            title: b.title,
            date: b.date,
            image: ensureAbsoluteUrl(b.image),
            excerpt: b.excerpt || ''
        }));

        // Add Personalities
        personalities.forEach(p => {
            ['en', 'hi', 'mai'].forEach(lang => {
                const locale = p.locales[lang as keyof typeof p.locales];
                if (locale) {
                    imports.push({
                        type: 'personality',
                        slug: p.slug,
                        lang: lang,
                        title: locale.name,
                        image: ensureAbsoluteUrl(p.image),
                        excerpt: locale.description
                    });
                }
            });
        });

        // Add Places
        places.forEach(p => {
            ['en', 'hi', 'mai'].forEach(lang => {
                const locale = p.locales[lang as keyof typeof p.locales];
                if (locale) {
                    imports.push({
                        type: 'place',
                        slug: p.slug,
                        lang: lang,
                        title: locale.name,
                        image: ensureAbsoluteUrl(p.images?.[0]),
                        excerpt: locale.description
                    });
                }
            });
        });

        // Add Recipes
        recipes.forEach(r => {
            ['en', 'hi', 'mai'].forEach(lang => {
                const locale = r.locales[lang as keyof typeof r.locales];
                if (locale) {
                    imports.push({
                        type: 'recipe',
                        slug: r.slug,
                        lang: lang,
                        title: locale.title,
                        image: 'https://cdn.mithilawasi.com/placeholder.jpg',
                        excerpt: locale.description
                    });
                }
            });
        });

        // Add Mantras
        mantras.forEach(m => {
            ['en', 'hi', 'mai'].forEach(lang => {
                const locale = m.locales[lang as keyof typeof m.locales];
                if (locale) {
                    imports.push({
                        type: 'mantra',
                        slug: m.slug,
                        lang: lang,
                        title: locale.title,
                        image: 'https://cdn.mithilawasi.com/placeholder.jpg',
                        excerpt: locale.meaning
                    });
                }
            });
        });

        return imports;
    } catch (error) {
        console.error("Failed to fetch content for import:", error);
        return [];
    }
}

export interface BlogImportParams extends EmailImportContent { }
export async function getBlogsForEmailImport(): Promise<BlogImportParams[]> {
    return getEmailContentImports();
}

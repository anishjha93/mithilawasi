
import { getAllBlogsForAdmin } from '../blogs';
import { getRecipes } from '../../data/recipes';
import { getSongs } from '../../data/songs';
import { getPersonalities } from '../../lib/personalities';

export type SearchResult = {
    type: 'Blog' | 'Recipe' | 'Song' | 'Mantra' | 'Personality' | 'Place' | 'Modern';
    title: string;
    description: string;
    slug: string;
    url: string;
    matchScore?: number;
};

// Simple fuzzy matching helper
function calculateMatchScore(text: string, query: string): number {
    const t = text ? text.toLowerCase() : '';
    const q = query.toLowerCase();

    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 50;

    // Check for word matches
    const queryWords = q.split(' ');
    let matches = 0;
    queryWords.forEach(word => {
        if (t.includes(word)) matches++;
    });

    return matches > 0 ? (matches / queryWords.length) * 40 : 0;
}

export async function searchContent(query: string, lang: 'en' | 'hi' | 'mai' = 'en'): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    const results: SearchResult[] = [];

    // 1. Search Blogs
    const blogs = await getAllBlogsForAdmin();
    blogs.forEach(item => {
        if (item.lang !== lang) return;

        const score = Math.max(
            calculateMatchScore(item.title, query),
            calculateMatchScore(item.excerpt, query)
        );
        if (score > 0) {
            results.push({
                type: 'Blog',
                title: item.title,
                description: item.excerpt,
                slug: item.slug,
                url: `/${lang}/blog/${item.slug}`,
                matchScore: score
            });
        }
    });

    // 2. Recipes
    const recipes = await getRecipes();
    recipes.forEach(item => {
        const rawLocale = item.locales[lang] || item.locales['en'];
        const enLocale = item.locales['en'];
        const title = rawLocale.title || enLocale.title;
        const description = rawLocale.description || enLocale.description;
        const score = Math.max(
            calculateMatchScore(title, query),
            calculateMatchScore(description, query),
            calculateMatchScore(item.category, query)
        );
        if (score > 0) {
            results.push({
                type: 'Recipe',
                title: title,
                description: description,
                slug: item.slug,
                url: `/${lang}/food/${item.slug}`,
                matchScore: score
            });
        }
    });

    // 3. Songs
    const songs = await getSongs();
    songs.forEach(item => {
        const locale = item.locales[lang] || item.locales['en'];
        const score = Math.max(
            calculateMatchScore(locale.title, query),
            calculateMatchScore(item.category, query)
        );
        if (score > 0) {
            results.push({
                type: 'Song',
                title: locale.title,
                description: item.category,
                slug: item.slug || item.id || "",
                url: `/${lang}/folklore/songs/${item.slug || item.id}`,
                matchScore: score
            });
        }
    });

    // 4. Personalities
    const people = await getPersonalities();
    people.forEach(item => {
        const locale = item.locales[lang] || item.locales['en'];
        const score = Math.max(
            calculateMatchScore(locale.name, query), // 'name' in interface
            calculateMatchScore(locale.description, query)
        );
        if (score > 0) {
            results.push({
                type: 'Personality',
                title: locale.name,
                description: locale.description.substring(0, 100) + '...',
                slug: item.slug,
                url: `/${lang}/personalities/${item.slug}`,
                matchScore: score
            });
        }
    });

    // Sort by relevance
    return results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 10);
}

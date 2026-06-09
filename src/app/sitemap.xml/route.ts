export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDictionary } from '@/get-dictionary';
// import { getBlogPosts } from '@/lib/blogs';
import { getRecipes } from '@/data/recipes';
import { getSongs } from '@/data/songs';
import { getFestivals } from '@/data/festivals';
import { getMantras } from '@/lib/mantras';
import { getPlaces } from '@/lib/places';
import { getPersonalities } from '@/lib/personalities';

export const dynamic = 'force-dynamic';

interface SitemapUrl {
    path: string;
    lastModified: Date;
    changeFrequency: string;
    priority: number;
}

export async function GET() {
    const baseUrl = 'https://mithilawasi.com';
    const langs = ['en', 'hi', 'mai'];

    // Collect all URLs grouped by path (without language)
    const urlGroups: Map<string, SitemapUrl> = new Map();

    for (const lang of langs) {
        const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');

        // Static pages
        const staticPages = [
            { path: '', priority: 1, changeFrequency: 'yearly' },
            { path: 'about', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'culture', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'culture/festivals', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'culture/sanskars', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'culture/dictionary', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'places', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'places/rivers', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'art', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'blog', priority: 0.9, changeFrequency: 'weekly' },
            { path: 'history', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'food', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'calendar', priority: 0.8, changeFrequency: 'weekly' },
            { path: 'calendar/lagan', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'calendar/panchang-pages', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'kundli', priority: 0.9, changeFrequency: 'weekly' },
            { path: 'personalities', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'folklore', priority: 0.7, changeFrequency: 'monthly' },
            { path: 'songs', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'philosophy', priority: 0.7, changeFrequency: 'monthly' },
            { path: 'learning', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'agriculture', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'modern-mithila', priority: 0.8, changeFrequency: 'weekly' },
            { path: 'vrat-katha', priority: 0.8, changeFrequency: 'monthly' },
            { path: 'search', priority: 0.5, changeFrequency: 'monthly' },
            { path: 'community/share', priority: 0.7, changeFrequency: 'monthly' },
        ];

        staticPages.forEach(page => {
            if (!urlGroups.has(page.path)) {
                urlGroups.set(page.path, {
                    path: page.path,
                    lastModified: new Date(),
                    changeFrequency: page.changeFrequency,
                    priority: page.priority,
                });
            }
        });

        // Blog posts
        // Use getAllBlogsForAdmin to get ALL posts, then unique by slug (since they might appear multiple times for different langs in the raw list)
        // Actually, we want to generate a URL if it exists in ANY language, and let the hreflang handle the specific language variants.
        // But our unique key is 'path' (without lang).
        const { getAllBlogsForAdmin } = await import('@/lib/blogs');
        const posts = await getAllBlogsForAdmin();
        posts.forEach((post) => {
            if (post.status !== 'published') return;
            const path = `blog/${post.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(post.date),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        });

        // Place detail pages
        const allPlaces = await getPlaces();
        allPlaces.forEach((place) => {
            const path = `places/${place.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.75,
                });
            }
        });

        // Personality detail pages
        const allPersonalities = await getPersonalities();
        allPersonalities.forEach((person) => {
            const path = `personalities/${person.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            }
        });

        // Food detail pages
        const recipes = await getRecipes();
        recipes.forEach((recipe) => {
            const path = `food/${recipe.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.65,
                });
            }
        });

        // Art detail pages
        const { artStyles } = await import('@/data/art');
        artStyles.forEach((style) => {
            const path = `art/${style.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            }
        });

        // Song detail pages
        const songs = await getSongs();
        songs.forEach((song) => {
            // Correct path based on Navbar/folder structure: /songs/[slug]
            const path = `songs/${song.slug || song.id}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        });

        // Festival detail pages
        const festivals = await getFestivals();
        festivals.forEach((festival) => {
            const path = `culture/festivals/${festival.slug}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.75,
                });
            }
        });

        // Mantra detail pages (Source: Static Data)
        const mantras = await getMantras();

        // Add main mantras page if not already present
        const mantrasPath = 'mantras';
        if (!urlGroups.has(mantrasPath)) {
            urlGroups.set(mantrasPath, {
                path: mantrasPath,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            });
        }

        // Add individual mantra pages
        mantras.forEach((mantra: any) => {
            const path = `mantras/${mantra.slug || mantra.id}`;
            if (!urlGroups.has(path)) {
                urlGroups.set(path, {
                    path,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.75,
                });
            }
        });
    } // This closes the `for (const lang of langs)` loop.

    // Generate XML sitemap with hreflang
    const xml = generateSitemapXml(Array.from(urlGroups.values()), langs, baseUrl);

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
} // This closes the `GET` function.

function generateSitemapXml(urls: SitemapUrl[], langs: string[], baseUrl: string): string {
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    const xmlFooter = `</urlset>`;

    const urlEntries = urls.map(urlData => {
        // Generate entries for all languages
        return langs.map(lang => {
            const fullUrl = urlData.path
                ? `${baseUrl}/${lang}/${urlData.path}`
                : `${baseUrl}/${lang}`;

            // Generate hreflang alternate links
            const alternates = langs.map(alternateLang => {
                const alternateUrl = urlData.path
                    ? `${baseUrl}/${alternateLang}/${urlData.path}`
                    : `${baseUrl}/${alternateLang}`;

                return `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${alternateUrl}" />`;
            }).join('\n');

            // Add x-default pointing to English
            const xDefaultUrl = urlData.path
                ? `${baseUrl}/en/${urlData.path}`
                : `${baseUrl}/en`;
            const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`;

            return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${urlData.lastModified.toISOString()}</lastmod>
    <changefreq>${urlData.changeFrequency}</changefreq>
    <priority>${urlData.priority}</priority>
${alternates}
${xDefault}
  </url>`;
        }).join('\n');
    }).join('\n');

    return `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
}

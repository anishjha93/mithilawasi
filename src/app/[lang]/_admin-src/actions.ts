"use server";

import { initAdmin } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { listObjects } from './storage/actions';
import { getCollectionData } from '@/lib/data-service';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = 'mithila_admin_session';

export async function verifyPassword(password: string): Promise<{ success: boolean; error?: string }> {
    // Simulate delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
        (await cookies()).set(COOKIE_NAME, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return { success: true };
    }

    return { success: false, error: 'Incorrect password' };
}

export async function checkAuth(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME);
    return session?.value === 'authenticated';
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME);
}

// Helper to get today's panchang
export async function getTodayPanchang() {
    try {
        const panchangData = await getCollectionData<any>('panchang', 'id');

        // Map current real-world date to 2026 data
        const adminApp = await initAdmin();
        const now = new Date();
        // Format: 2026-MM-DD
        const today = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const data = panchangData.find(d => d.id === today);

        if (!data) return null;

        return {
            title: "🪔 आजुक पंचांग (Today's Panchang)",
            body: `📅 तिथि: ${data.tithi}\n⏰ समय: ${data.tithi_start_time} - ${data.tithi_end_time}\n✨ अगला: ${data.next_tithi}`
        };
    } catch (e) {
        console.error("Error fetching panchang", e);
        return null;
    }
}

export async function getDashboardStats() {
    try {
        const [blogs, songs, recipes, mantras, people, places, modern] = await Promise.all([
            getCollectionData('blogs', 'slug-lang'),
            getCollectionData('songs', 'slug'),
            getCollectionData('recipes', 'slug'),
            getCollectionData('mantras', 'slug'),
            getCollectionData('personalities', 'slug'),
            getCollectionData('places', 'slug'),
            getCollectionData('modern_mithila', 'slug')
        ]);

        // Storage Stats
        const storage = await listObjects();
        const unusedStorageCount = storage.success ? storage.objects.filter(o => !o.isUsed).length : 0;
        const totalStorageSize = storage.success ? storage.objects.reduce((acc, o) => acc + o.size, 0) : 0;

        return {
            success: true,
            counts: {
                blogs: blogs.length,
                songs: songs.length,
                recipes: recipes.length,
                mantras: mantras.length,
                people: people.length,
                places: places.length,
                modern: modern.length
            },
            storage: {
                unusedCount: unusedStorageCount,
                totalSize: totalStorageSize
            },
            recentActivity: [
                ...blogs.slice(-2).map((b: any) => ({ type: 'Blog', title: b.title, date: b.date })),
                ...modern.slice(-2).map((m: any) => ({ type: 'Modern', title: m.locales?.en?.title, date: m.date })),
                ...recipes.slice(-1).map((r: any) => ({ type: 'Recipe', title: r.locales?.en?.title, date: '' }))
            ].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5)
        };
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return { success: false, error: "Failed to load stats" };
    }
}

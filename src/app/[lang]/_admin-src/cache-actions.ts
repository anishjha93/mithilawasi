'use server';

import { revalidatePath } from 'next/cache';

export async function purgeAllCaches() {
    try {
        // Revalidate everything from the root
        // In Next.js, revalidating the root layout with 'layout' type effectively clears most of the router/data cache
        revalidatePath('/', 'layout');

        // Specifically revalidate list pages that are often cached
        revalidatePath('/[lang]/blog', 'page');
        revalidatePath('/[lang]/food', 'page');
        revalidatePath('/[lang]/mantras', 'page');
        revalidatePath('/[lang]/folklore/songs', 'page');
        revalidatePath('/[lang]/personalities', 'page');
        revalidatePath('/[lang]/places', 'page');
        revalidatePath('/[lang]/modern-mithila', 'page');

        return { success: true, message: 'All caches purged successfully. Data should be fresh now.' };
    } catch (error) {
        console.error('Error purging cache:', error);
        return { success: false, message: 'Failed to purge cache. Please check server logs.' };
    }
}

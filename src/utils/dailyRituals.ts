import { getTodaysPanchang } from './panchang';
import panchangDataRaw from '../data/panchang_2026.json';
import mantrasData from '../data/mantras.json';

const panchangDataJson = panchangDataRaw as Record<string, { tithi: string; tithi_start_time: string; tithi_end_time: string; next_tithi: string }>;

export interface DailyRitualData {
    mantra: {
        slug: string;
        title: string;
        description: string; // Or meaning excerpt
    };
    upcomingVrat: {
        id: string;
        title: string;
        date: string; // Formatted date
        tithi: string;
    } | null;
}

export function getDailyRituals(date: Date, lang: 'en' | 'hi' | 'mai'): DailyRitualData {
    // 1. Get Daily Mantra based on Day of Week
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...
    let mantraId = 'gayatri'; // Default

    switch (dayOfWeek) {
        case 0: mantraId = 'gayatri'; break; // Sunday
        case 1: mantraId = 'maha_mrityunjay'; break; // Monday
        case 2: mantraId = 'vakratunda'; break; // Tuesday
        case 3: mantraId = 'saraswati_vandana'; break; // Wednesday
        case 4: mantraId = 'shanti_mantra'; break; // Thursday
        case 5: mantraId = 'durvakshat'; break; // Friday
        case 6: mantraId = 'navgraha'; break; // Saturday
    }

    const mantraObj = mantrasData.find(m => m.slug === mantraId);

    // Fallback if not found
    const safeMantra = mantraObj || mantrasData[0];

    // 2. Get Upcoming Vrat (Scan next 15 days)
    let upcomingVrat = null;
    const checkDate = new Date(date);

    // Vrat Mapping
    // Tithi -> Mantra ID
    const vratMap: Record<string, string> = {
        'Trayodashi': 'pradosh_vrat_katha',
        'Purnima': 'satyanarayan_vrat_katha',
        // 'Chaturdashi': 'anant_vrat_katha', // Only specific ones usually, but for now maybe skip to avoid confusion with Monthly Shivratri etc.
        // 'Tritiya': 'haritalika_vrat_katha' // Too specific
    };

    for (let i = 0; i < 15; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayData = panchangDataJson[dateStr];

        if (dayData) {
            const tithi = dayData.tithi;
            const vratId = vratMap[tithi];

            if (vratId) {
                const vratObj = mantrasData.find(m => m.slug === vratId);
                if (vratObj) {
                    upcomingVrat = {
                        id: vratObj.slug,
                        title: (vratObj.locales[lang] || vratObj.locales['en']).title,
                        date: checkDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }),
                        tithi: tithi // You might want to localize this too using the helper if needed
                    };
                    break; // Found the next one
                }
            }
        }
        checkDate.setDate(checkDate.getDate() + 1);
    }

    return {
        mantra: {
            slug: safeMantra.slug,
            title: (safeMantra.locales[lang] || safeMantra.locales['en']).title,
            description: (safeMantra.locales[lang] || safeMantra.locales['en']).meaning,
        },
        upcomingVrat
    };
}

import { getCollectionData } from '../lib/data-service';

export interface SongLocale {
    title: string;
    meaning: string;
    meaning_full?: string;
}

export interface Song {
    id?: string;
    slug: string; // Required for routing and as primary key in actions
    category: 'Ritual' | 'Devotional' | 'Seasonal' | 'Social' | 'Festival' | string;
    occasion?: string;
    authorSlug?: string; // Slug of the personality (e.g., 'vidyapati')
    lyrics: string;
    youtubeUrl?: string;
    locales: {
        en: SongLocale;
        hi: SongLocale;
        mai: SongLocale;
    };
}

export async function getSongs(): Promise<Song[]> {
    return getCollectionData<Song>('songs', 'id');
}

import { getCollectionData } from './data-service';

export interface MantraLocale {
    title: string;
    meaning: string;
    transliteration?: string;
}

export interface Mantra {
    slug: string;
    category: string;
    tags: string[];
    mantra: string; // Sanskrit text
    locales: {
        en: MantraLocale;
        hi: MantraLocale;
        mai: MantraLocale;
    };
    externalLink?: string;
}

export async function getMantras(): Promise<Mantra[]> {
    return getCollectionData<Mantra>('mantras');
}

import { getCollectionData } from './data-service';

export interface PersonalityLocale {
    name: string;
    description: string;
    achievements: string[];
    period?: string;
}

export interface Personality {
    slug: string;
    image?: string;
    born?: string;
    died?: string;
    profession: string[];
    locales: {
        en: PersonalityLocale;
        hi: PersonalityLocale;
        mai: PersonalityLocale;
    };
    featured?: boolean;
}

export async function getPersonalities(): Promise<Personality[]> {
    return getCollectionData<Personality>('personalities');
}

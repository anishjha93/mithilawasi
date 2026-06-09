import { getCollectionData } from './data-service';

export interface PlaceLocale {
    name: string;
    description: string;
    location: string;
    significance: string;
}

export interface Place {
    slug: string;
    images: string[];
    coordinates?: string;
    mapEmbedUrl?: string;
    locales: {
        en: PlaceLocale;
        hi: PlaceLocale;
        mai: PlaceLocale;
    };
    featured?: boolean;
}

export async function getPlaces(): Promise<Place[]> {
    return getCollectionData<Place>('places');
}

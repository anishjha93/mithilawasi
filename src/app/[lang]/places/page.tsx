import { getDictionary } from '@/get-dictionary';
import PlacesContent from './PlacesContent';
import { getPlaces } from '@/lib/places';

import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export default async function PlacesPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const places = await getPlaces();
    const { placesPage } = dict;

    // We manually merge the dynamic disk data into the placesPage object for the component
    // This allows the existing UI to work while being backed by the dynamic JSON file
    const mergedPlacesPage = {
        ...placesPage,
        places: places.filter(p => !p.slug.includes('-shakti-peeth') && !p.slug.includes('-heritage')).map(p => ({
            ...p.locales[lang] || p.locales.en,
            slug: p.slug,
            image: p.images[0]
        }))
    };

    const schemaData = {
        name: placesPage.title,
        description: placesPage.lead,
        url: `https://mithilawasi.com/${lang}/places`
    };

    return (
        <>
            <JsonLd type="CollectionPage" data={schemaData} />
            <PlacesContent placesPage={mergedPlacesPage} />
        </>
    );
}

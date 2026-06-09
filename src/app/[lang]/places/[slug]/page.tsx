import { getDictionary } from '@/get-dictionary';
import { getPlaces } from '@/lib/places';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ReadNext from '@/components/ReadNext';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string; slug: string }>;
};

async function getPlaceBySlug(slug: string, lang: string) {
    const allPlaces = await getPlaces();
    const dbPlace = allPlaces.find(p => p.slug === slug);
    if (dbPlace) {
        return dbPlace;
    }

    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { placesPage } = dict;

    if (placesPage) {
        // Search in heritage sites
        const heritageSite: any = placesPage.heritage?.sites?.find((s: any) => s.slug === slug);
        if (heritageSite) {
            return {
                slug: heritageSite.slug,
                images: heritageSite.image ? [heritageSite.image] : [],
                locales: {
                    [lang]: {
                        name: heritageSite.name,
                        description: heritageSite.desc || heritageSite.description || '',
                        location: heritageSite.location || 'Mithila',
                        significance: heritageSite.significance || ''
                    }
                }
            };
        }

        // Search in shaktiPeethas
        const shaktiPeetha: any = placesPage.shaktiPeethas?.list?.find((p: any) => p.slug === slug);
        if (shaktiPeetha) {
            return {
                slug: shaktiPeetha.slug,
                images: shaktiPeetha.image ? [shaktiPeetha.image] : [],
                locales: {
                    [lang]: {
                        name: shaktiPeetha.name,
                        description: shaktiPeetha.desc || shaktiPeetha.description || '',
                        location: shaktiPeetha.location || 'Mithila',
                        significance: shaktiPeetha.significance || ''
                    }
                }
            };
        }

        // Search in villages
        const village: any = placesPage.villages?.list?.find((v: any) => v.slug === slug);
        if (village) {
            return {
                slug: village.slug,
                images: village.image ? [village.image] : [],
                locales: {
                    [lang]: {
                        name: village.name,
                        description: village.desc || village.description || '',
                        location: village.location || 'Mithila',
                        significance: village.significance || ''
                    }
                }
            };
        }

        // Search in main places list in the dictionary as ultimate fallback
        const dictPlace: any = placesPage.places?.find((p: any) => p.slug === slug);
        if (dictPlace) {
            return {
                slug: dictPlace.slug,
                images: dictPlace.image ? [dictPlace.image] : (dictPlace.images || []),
                locales: {
                    [lang]: {
                        name: dictPlace.name,
                        description: dictPlace.desc || dictPlace.description || '',
                        location: dictPlace.location || 'Mithila',
                        significance: dictPlace.significance || ''
                    }
                }
            };
        }
    }

    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const place = await getPlaceBySlug(slug, lang);

    if (!place) {
        return {
            title: 'Place Not Found'
        };
    }

    const locale = place.locales[lang as 'en' | 'hi' | 'mai'] || place.locales.en;
    const author = 'Mithilawasi Team';
    const description = `${locale.description.substring(0, 140)}... | Contributed by: ${author}`;
    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/places/${slug}`;
    const firstImage = place.images?.[0] || '';
    const imageUrl = firstImage.startsWith('http') ? firstImage : `${baseUrl}${firstImage || '/logo.webp'}`;

    return {
        title: `${locale.name} - Mithilawasi`,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/places/${slug}`,
                'hi-IN': `${baseUrl}/hi/places/${slug}`,
                'mai-IN': `${baseUrl}/mai/places/${slug}`,
                'x-default': `${baseUrl}/en/places/${slug}`,
            },
        },
        openGraph: {
            title: `${locale.name} - Mithilawasi`,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: locale.name,
                }
            ],
            type: 'article',
            url: canonicalUrl,
            siteName: 'Mithilawasi',
            authors: [author],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${locale.name} - Mithilawasi`,
            description,
            images: [imageUrl],
            creator: '@mithilawasi',
        }
    };
}

export default async function PlaceDetailPage({ params }: Props) {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { placesPage } = dict;
    const allPlaces = await getPlaces();
    const place = await getPlaceBySlug(slug, lang);

    if (!place) {
        notFound();
    }

    const locale = place.locales[lang as 'en' | 'hi' | 'mai'] || place.locales.en;

    // Determine category based on which list it was found in or by slug
    let category = 'places';
    if (placesPage.heritage?.sites?.some((s: any) => s.slug === slug)) category = 'heritage';
    else if (placesPage.shaktiPeethas?.list?.some((p: any) => p.slug === slug)) category = 'shaktiPeethas';
    else if (placesPage.villages?.list?.some((v: any) => v.slug === slug)) category = 'villages';
    else if (slug.includes('-shakti-peeth')) category = 'shaktiPeethas';
    else if (slug.includes('-heritage')) category = 'heritage';

    // Get category title
    let categoryTitle = '';
    switch (category) {
        case 'places':
            categoryTitle = placesPage.title;
            break;
        case 'heritage':
            categoryTitle = placesPage.heritage.title;
            break;
        case 'shaktiPeethas':
            categoryTitle = placesPage.shaktiPeethas.title;
            break;
        case 'villages':
            categoryTitle = placesPage.villages?.title || 'Villages';
            break;
        default:
            categoryTitle = placesPage.title;
    }

    const placeSchema = {
        '@context': 'https://schema.org',
        '@type': category === 'shaktiPeethas' ? 'HinduTemple' : 'TouristAttraction',
        name: locale.name,
        description: locale.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: locale.location,
            addressRegion: 'Mithila',
            addressCountry: 'IN'
        },
        image: place.images?.[0] ? (place.images[0].startsWith('http') ? place.images[0] : `https://mithilawasi.com${place.images[0]}`) : undefined,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: lang === 'en' ? 'Home' : lang === 'hi' ? 'होम' : 'घर',
                item: `https://mithilawasi.com/${lang}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: placesPage.title,
                item: `https://mithilawasi.com/${lang}/places`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: locale.name,
                item: `https://mithilawasi.com/${lang}/places/${slug}`,
            },
        ],
    };

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-16">
            <JsonLd override={true} data={placeSchema} />
            <JsonLd override={true} data={breadcrumbSchema} />
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-[0.9rem] text-gray-600">
                <Link href={`/${lang}`} className="text-[#d35400] hover:text-[#e67e22] hover:underline transition-colors">
                    {lang === 'en' ? 'Home' : lang === 'hi' ? 'होम' : 'घर'}
                </Link>
                <span className="text-gray-400">›</span>
                <Link href={`/${lang}/places`} className="text-[#d35400] hover:text-[#e67e22] hover:underline transition-colors">
                    {placesPage.title}
                </Link>
                <span className="text-gray-400">›</span>
                <span className="text-gray-800 font-medium">{locale.name}</span>
            </nav>

            {/* Main Content */}
            <article className="max-w-[900px] mx-auto">
                <header className="mb-8">
                    <div className="inline-block px-4 py-1.5 bg-linear-to-br from-[#ff9966] to-[#ff5e62] text-white rounded-full text-[0.85rem] font-semibold uppercase tracking-wide mb-4">
                        {categoryTitle}
                    </div>
                    <h1 className="text-[2.5rem] font-bold text-[#2c3e50] mb-2 leading-tight">{locale.name}</h1>
                    <p className="text-[1.1rem] text-[#7f8c8d]">📍 {locale.location}</p>
                </header>

                {/* Image */}
                {place.images?.[0] && (
                    <div className="relative w-full h-[300px] md:h-[500px] my-8 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <Image
                            src={place.images[0]}
                            alt={locale.name}
                            width={1200}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                )}

                {/* Description */}
                <div className="my-8">
                    <p className="text-[1.1rem] leading-relaxed text-[#34495e] text-justify whitespace-pre-line md:text-left">{locale.description}</p>
                </div>

                {/* Author Section */}
                <div className="my-8 p-6 bg-[#f8f9fa] rounded-xl border-l-4 border-[#3498db]">
                    <p className="text-[0.85rem] uppercase text-[#7f8c8d] mb-2 tracking-widest font-semibold">{lang === 'en' ? 'Contributed by' : lang === 'hi' ? 'योगदानकर्ता' : 'योगदानकर्ता'}</p>
                    <div className="text-[1.1rem] font-bold text-[#2c3e50] flex items-center gap-2">
                        <span className="text-[1.2rem]">✍️</span>
                        {'Mithilawasi Team'}
                    </div>
                </div>

                {/* Read Next Section */}
                <ReadNext
                    currentSlug={slug}
                    places={allPlaces.map(p => ({
                        ...(p.locales[lang as 'en' | 'hi' | 'mai'] || p.locales.en),
                        slug: p.slug,
                        image: p.images?.[0]
                    }))}
                    lang={lang}
                />

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t-2 border-[#ecf0f1] pb-20">
                    <Link href={`/${lang}/places`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-lg font-bold transition-all duration-300 shadow-[0_4px_6px_rgba(52,152,219,0.3)] hover:bg-[#2980b9] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(52,152,219,0.4)]">
                        ← {lang === 'en' ? 'Back to Places' : lang === 'hi' ? 'स्थानों पर वापस जाएं' : 'स्थान सभ पर वापस जाउ'}
                    </Link>
                </div>
            </article>
        </div>
    );
}

import { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Locale = 'en' | 'hi' | 'mai';

interface Props {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;
    const festival = dict.calendarPage.festivalDetails?.[slug];

    if (!festival) {
        return {
            title: 'Festival Not Found',
        };
    }

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/calendar/festivals/${slug}`;

    return {
        title: `${festival.title} - Mithilawasi`,
        description: festival.fullDesc,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/calendar/festivals/${slug}`,
                'hi-IN': `${baseUrl}/hi/calendar/festivals/${slug}`,
                'mai-IN': `${baseUrl}/mai/calendar/festivals/${slug}`,
                'x-default': `${baseUrl}/en/calendar/festivals/${slug}`,
            },
        },
        keywords: festival.keywords.join(', '),
        openGraph: {
            title: festival.title,
            description: festival.fullDesc,
            url: canonicalUrl,
            siteName: 'Mithilawasi',
            images: [
                {
                    url: `${baseUrl}${festival.image}`,
                    width: 1200,
                    height: 630,
                    alt: festival.title,
                },
            ],
            locale: lang === 'en' ? 'en_US' : (lang === 'hi' ? 'hi_IN' : 'mai_IN'),
            type: 'article',
        },
    };
}

export default async function FestivalDetailPage({ params }: Props) {
    const { lang, slug } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;
    const festival = dict.calendarPage.festivalDetails?.[slug];

    if (!festival) {
        notFound();
    }

    // Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': festival.title,
        'description': festival.fullDesc,
        'image': `https://mithilawasi.com${festival.image}`,
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'location': {
            '@type': 'Place',
            'name': 'Mithila Region',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Mithila',
                'addressRegion': 'Bihar/Madhesh',
                'addressCountry': 'IN/NP'
            }
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'Mithilawasi',
            'url': 'https://mithilawasi.com'
        }
    };

    return (
        <main className="min-h-screen bg-[#fffaf0] pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-[1000px] mx-auto px-4 py-8">
                <Link href={`/${lang}/calendar`} className="inline-block text-[#8b4513] font-medium mb-8 transition-transform hover:-translate-x-1 hover:text-[#d2691e]">
                    ← {lang === 'en' ? 'Back to Calendar' : (lang === 'hi' ? 'कैलेंडर पर वापस जाएं' : 'पंचांग पर वापस जाउ')}
                </Link>

                <header className="mb-8">
                    <h1 className="text-[3rem] text-[#4a1a0f] font-extrabold leading-tight">{festival.title}</h1>
                </header>

                <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative w-full aspect-2/1">
                        <Image
                            src={festival.image}
                            alt={festival.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
                    <article className="bg-white p-8 rounded-2xl shadow-sm">
                        <section className="mb-10 last:mb-0">
                            <h2 className="text-[1.5rem] text-[#b22222] mb-4 border-b-2 border-[#fff5ee] pb-2 font-bold">
                                {lang === 'en' ? 'Why it is celebrated' : (lang === 'hi' ? 'क्यों मनाया जाता है' : 'किएल मनाओल जाइत अछि')}
                            </h2>
                            <p className="text-[1.1rem] leading-[1.8] text-gray-700">{festival.why}</p>
                        </section>

                        <section className="mb-10 last:mb-0">
                            <h2 className="text-[1.5rem] text-[#b22222] mb-4 border-b-2 border-[#fff5ee] pb-2 font-bold">
                                {lang === 'en' ? 'History and Legend' : (lang === 'hi' ? 'इतिहास और कथा' : 'इतिहास आ कथा')}
                            </h2>
                            <p className="text-[1.1rem] leading-[1.8] text-gray-700">{festival.history}</p>
                        </section>

                        <section className="mb-10 last:mb-0">
                            <h2 className="text-[1.5rem] text-[#b22222] mb-4 border-b-2 border-[#fff5ee] pb-2 font-bold">
                                {lang === 'en' ? 'When it is celebrated' : (lang === 'hi' ? 'कब मनाया जाता है' : 'कखनि मनाओल जाइत अछि')}
                            </h2>
                            <p className="text-[1.1rem] leading-[1.8] text-gray-700">{festival.when}</p>
                        </section>

                        <section className="mb-10 last:mb-0">
                            <h2 className="text-[1.5rem] text-[#b22222] mb-4 border-b-2 border-[#fff5ee] pb-2 font-bold">
                                {lang === 'en' ? 'How it is celebrated' : (lang === 'hi' ? 'कैसे मनाया जाता है' : 'कोना मनाओल जाइत अछि')}
                            </h2>
                            <p className="text-[1.1rem] leading-[1.8] text-gray-700">{festival.how}</p>
                        </section>

                        <section className="mb-10 last:mb-0">
                            <h2 className="text-[1.5rem] text-[#b22222] mb-4 border-b-2 border-[#fff5ee] pb-2 font-bold">
                                {lang === 'en' ? 'About the Festival' : (lang === 'hi' ? 'त्योहार के बारे में' : 'पावनि क बारे मे')}
                            </h2>
                            <p className="text-[1.1rem] leading-[1.8] text-gray-700">{festival.fullDesc}</p>
                        </section>
                    </article>

                    <aside className="relative">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:static">
                            <h3 className="text-[1.2rem] text-[#4a1a0f] mb-4 font-bold">
                                {lang === 'en' ? 'Quick Info' : (lang === 'hi' ? 'त्वरित जानकारी' : 'त्वरित जानकारी')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {festival.keywords.map((kw: string, i: number) => (
                                    <span key={i} className="bg-[#fff5ee] text-[#8b4513] px-3.5 py-1.5 rounded-full text-[0.85rem] font-medium border border-[#ffe4e1] transition-colors hover:bg-[#ffe4e1]">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}


import dynamic from 'next/dynamic';
export const runtime = 'edge';
import { BannerSkeleton, CardSkeleton, Skeleton } from '@/components/ui/Skeleton';

const HeroSection = dynamic(() => import('@/components/HeroSection'), { 
    ssr: true,
    loading: () => <div className="min-h-[70vh] bg-[var(--color-background)] animate-pulse" />
});
const TodaysPanchang = dynamic(() => import('@/components/TodaysPanchang'), {
    loading: () => <BannerSkeleton />
});
const TodaysChoghadiya = dynamic(() => import('@/components/TodaysChoghadiya'), {
    loading: () => <BannerSkeleton />
});
const DailyRituals = dynamic(() => import('@/components/DailyRituals'), {
    loading: () => <BannerSkeleton />
});
const QuickAstrologySuite = dynamic(() => import('@/components/QuickAstrologySuite'), {
    loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
});
const UpcomingFestivals = dynamic(() => import('@/components/UpcomingFestivals'), {
    loading: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
});
const FeaturedContent = dynamic(() => import('@/components/FeaturedContent'), {
    loading: () => <div className="h-96 bg-primary-red/5 rounded-3xl animate-pulse" />
});
const QuickStats = dynamic(() => import('@/components/QuickStats'));
const DidYouKnow = dynamic(() => import('@/components/DidYouKnow'));
const ShareStorySection = dynamic(() => import('@/components/ShareStorySection'));
const NewsLetterCTA = dynamic(() => import('@/components/blog/NewsLetterCTA'));
const InstallBanner = dynamic(() => import('@/components/InstallBanner'));
const SectionCard = dynamic(() => import('@/components/SectionCard'), {
    loading: () => <CardSkeleton />
});
const WeatherRiverDashboard = dynamic(() => import('@/components/WeatherRiverDashboard'), {
    loading: () => <BannerSkeleton />
});

import { Suspense } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { getDailyRituals } from '@/utils/dailyRituals';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';
import type { Metadata } from 'next';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}`;

    const keywordsMap = {
        en: [
            'Mithilawasi', 'Mithila culture', 'Mithila history', 'Madhubani painting',
            'Maithili songs', 'Vedic Calendar', 'Janam Kundli', 'Kundli Milan',
            'Tirhuta script', 'Shubh Muhurat', 'Panchang 2026',
            'Choghadiya today', 'Rahu Kaal today', 'auspicious time today'
        ],
        hi: [
            'मिथिला लेगसी', 'मिथिला संस्कृति', 'मिथिला इतिहास', 'मधुबनी पेंटिंग',
            'मैथिली गीत', 'वैदिक कैलेंडर', 'जन्म कुंडली', 'कुंडली मिलान',
            'तिरहुता लिपि', 'शुभ मुहूर्त', 'पंचांग २०२६',
            'आज का चोघड़िया', 'राहु काल आज', 'शुभ समय आज'
        ],
        mai: [
            'मिथिला लेगसी', 'मिथिलाक संस्कृति', 'मिथिलाक इतिहास', 'मधुबनी चित्रकला',
            'मैथिली गीत', 'वैदिक कैलेंडर', 'जन्म कुंडली', 'गुण मिलान',
            'तिरहुता लिपि', 'शुभ मुहूर्त', 'पंचांग २०२६',
            'आजुक चोघड़िया', 'राहु काल आज', 'शुभ समय आजु'
        ]
    };

    return {
        title: `${dict.home.welcome} ${dict.home.highlight}`,
        description: dict.home.subtitle,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en`,
                'hi-IN': `${baseUrl}/hi`,
                'mai-IN': `${baseUrl}/mai`,
                'x-default': `${baseUrl}/en`,
            },
        },
        keywords: keywordsMap[lang] || keywordsMap.en,
    };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const history = dict.historyPage;

    const sections = [
        {
            id: 'history',
            title: dict.navigation.history,
            description: dict.home.sections.history,
            link: `/${resolvedParams.lang}/history`,
            imageColor: 'var(--color-primary-yellow)',
            image: 'https://cdn.mithilawasi.com/history-card.webp'
        },
        {
            id: 'art',
            title: dict.navigation.art,
            description: dict.home.sections.art,
            link: `/${resolvedParams.lang}/art`,
            imageColor: 'var(--color-terracotta)',
            image: 'https://cdn.mithilawasi.com/art-card.webp'
        },
        {
            id: 'culture',
            title: dict.navigation.culture,
            description: dict.home.sections.culture,
            link: `/${resolvedParams.lang}/culture`,
            imageColor: 'var(--color-primary-green)',
            image: 'https://cdn.mithilawasi.com/culture-card.webp'
        },
        {
            id: 'food',
            title: dict.navigation.food,
            description: dict.home.sections.food,
            link: `/${resolvedParams.lang}/food`,
            imageColor: 'var(--color-primary-red)',
            image: 'https://cdn.mithilawasi.com/food-card.webp'
        },
        {
            id: 'blog',
            title: dict.navigation.blog,
            description: dict.home.sections.blog,
            link: `/${resolvedParams.lang}/blog`,
            imageColor: 'var(--color-mithila-indigo)',
            image: 'https://cdn.mithilawasi.com/places/darbhanga_raj_campus.webp'
        },
        {
            id: 'mantras',
            title: dict.navigation.mantras || 'Mantras',
            description: dict.home.sections.mantras,
            link: `/${resolvedParams.lang}/mantras`,
            imageColor: 'var(--color-accent-gold)',
            image: 'https://cdn.mithilawasi.com/places/amneshwar.webp'
        },
        {
            id: 'vrat-katha',
            title: dict.navigation.vrat || 'Vrat Katha',
            description: dict.home.sections.vrat,
            link: `/${resolvedParams.lang}/vrat-katha`,
            imageColor: 'var(--color-primary-red)',
            image: 'https://cdn.mithilawasi.com/places/sitamarhi_punaura_dham.webp'
        },
        {
            id: 'shop',
            title: dict.navigation.shop || 'Shop',
            description: dict.home.sections.shop,
            link: `/${resolvedParams.lang}/shop`,
            imageColor: 'var(--color-primary-green)',
            image: 'https://cdn.mithilawasi.com/places/madhubani_art_village.webp'
        },
        {
            id: 'modern-mithila',
            title: dict.navigation['modern-mithila'] || 'Modern Mithila',
            description: dict.home.sections.modern_mithila,
            link: `/${resolvedParams.lang}/modern-mithila`,
            imageColor: 'var(--color-mithila-indigo)',
            image: 'https://cdn.mithilawasi.com/places/darbhanga_fort_red_walls.webp'
        },
        {
            id: 'villages',
            title: dict.navigation.villages || 'Village Directory',
            description: dict.home.sections.villages,
            link: `/${resolvedParams.lang}/villages`,
            imageColor: 'var(--color-primary-yellow)',
            image: 'https://cdn.mithilawasi.com/places/madhubani_art_village.webp'
        }
    ];

    return (
        <div>
            <HeroSection dict={dict.home} lang={resolvedParams.lang} />

            <section className="relative">
                {/* Global Background Elements */}
                <div className="absolute inset-0 bg-[var(--color-background)] pointer-events-none -z-20"></div>
                <div className="absolute top-0 w-full h-[1000px] bg-[var(--mesh-gradient-1)] opacity-20 pointer-events-none -z-10"></div>

                <div className="container section-padding pb-32">
                    <InstallBanner dict={dict.home} />

                    {/* Live Agricultural Weather & River Safety Monitor */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
                        <Suspense fallback={<BannerSkeleton />}>
                            <WeatherRiverDashboard lang={lang} />
                        </Suspense>
                    </div>

                    {/* Today's Panchang Widget */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
                        <Suspense fallback={<BannerSkeleton />}>
                            <TodaysPanchang
                                lang={lang}
                                dict={dict.home.todaysPanchang}
                            />
                        </Suspense>
                    </div>

                    {/* Today's Choghadiya & Rahu Kaal Widget */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up delay-100">
                        <Suspense fallback={<BannerSkeleton />}>
                            <TodaysChoghadiya lang={lang} />
                        </Suspense>
                    </div>

                    {/* Daily Rituals (Mantras & Vrat) */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up delay-100">
                        <Suspense fallback={<BannerSkeleton />}>
                            <DailyRituals
                                lang={lang}
                                dict={dict}
                                dailyData={getDailyRituals(new Date(), lang)}
                            />
                        </Suspense>
                    </div>

                    {/* Quick Astrology & Heritage Tools Suite */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up delay-150">
                        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}>
                            <QuickAstrologySuite
                                lang={lang}
                                dict={dict.home.astrologySuite}
                            />
                        </Suspense>
                    </div>

                    {/* Upcoming Festivals */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up delay-200">
                        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}>
                            <UpcomingFestivals
                                lang={resolvedParams.lang}
                                dict={dict.home.upcomingFestivals}
                                festivals={dict.calendarPage.festivals2026.list}
                            />
                        </Suspense>
                    </div>

                    {/* Featured Content */}
                    <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in-up delay-300">
                        <Suspense fallback={<div className="h-96 bg-primary-red/5 rounded-3xl animate-pulse" />}>
                            <FeaturedContent
                                lang={resolvedParams.lang}
                                dict={dict.home.featured}
                            />
                        </Suspense>
                    </div>

                    {/* Quick Stats */}
                    <div className="mb-16 sm:mb-24 md:mb-32 animate-fade-in-up delay-400">
                        <QuickStats dict={dict.home.stats} />
                    </div>

                    {/* Engagement Section: Did You Know */}
                    <div className="mb-16 sm:mb-24 md:mb-32 relative">
                        <div className="absolute inset-0 bg-primary-yellow/5 rounded-[4rem] -z-10 blur-3xl opacity-50"></div>
                        <Suspense fallback={<div className="h-64 bg-primary-red/5 animate-pulse rounded-3xl" />}>
                            <DidYouKnow lang={resolvedParams.lang} />
                        </Suspense>
                    </div>

                    {/* Explore Sections */}
                    <div className="space-y-20 sm:space-y-32 md:space-y-40">
                        {/* Category 1: Roots & Heritage */}
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
                                <HeritageHeading as="h2" center className="mb-6 uppercase italic">{dict.navigation.history || 'Roots & Heritage'}</HeritageHeading>
                                <p className="text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed opacity-80">{dict.home.heritage.rootsDesc}</p>
                                <div className="h-1.5 w-24 bg-primary-red mx-auto mt-10 rounded-full opacity-60"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-12 px-4">
                                {Object.entries(history.eras.medieval)
                                    .filter(([key]) => !['marker', 'title'].includes(key))
                                    .map(([key, dynasty]: [string, any], index) => (
                                        <MithilaCard key={key} className="p-5 sm:p-8 md:p-10 group/card animate-fade-in-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="h-14 w-14 rounded-2xl bg-primary-red/5 flex items-center justify-center mb-8 group-hover/card:bg-primary-red transition-all duration-500 shadow-sm">
                                                <span className="text-3xl filter drop-shadow-sm group-hover/card:scale-110 transition-transform">🔱</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-black mb-4 text-mithila-ink font-heading group-hover/card:text-primary-red transition-colors italic tracking-tighter uppercase">{dynasty.title}</h3>
                                            <p className="text-lg text-text-muted leading-relaxed font-serif italic group-hover/card:text-mithila-ink transition-colors duration-500">{dynasty.desc}</p>
                                        </MithilaCard>
                                    ))}
                            </div>
                        </div>

                        {/* Category 2: Art & Culture */}
                        <div className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-8 rounded-3xl sm:rounded-[4rem] md:rounded-[5rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-red/5 opacity-40 -z-10 rounded-[5rem] group-hover:bg-primary-red/10 transition-colors duration-1000"></div>
                            <div className="absolute inset-0 madhubani-pattern-bg opacity-5 -z-10"></div>

                            <div className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10">
                                <HeritageHeading as="h2" center className="mb-6 uppercase italic">{dict.navigation.art || 'Art & Culture'}</HeritageHeading>
                                <p className="text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed opacity-80">{dict.home.heritage.artDesc}</p>
                                <div className="h-1.5 w-24 bg-primary-yellow mx-auto mt-10 rounded-full opacity-60"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-12 relative z-10">
                                {sections.filter(s => ['art', 'culture', 'shop'].includes(s.id)).map((section, index) => (
                                    <Suspense key={index} fallback={<CardSkeleton />}>
                                        <SectionCard {...section} />
                                    </Suspense>
                                ))}
                            </div>
                        </div>

                        {/* Category 3: Spiritual Journey */}
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
                                <HeritageHeading as="h2" center className="mb-6 uppercase italic">{dict.navigation.mantras || 'Spiritual Journey'}</HeritageHeading>
                                <p className="text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed opacity-80">{dict.home.heritage.spiritualDesc}</p>
                                <div className="h-1.5 w-24 bg-primary-red mx-auto mt-10 rounded-full opacity-60"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-12 max-w-5xl mx-auto px-4">
                                {sections.filter(s => ['mantras', 'vrat-katha'].includes(s.id)).map((section, index) => (
                                    <Suspense key={index} fallback={<CardSkeleton />}>
                                        <SectionCard {...section} />
                                    </Suspense>
                                ))}
                            </div>
                        </div>

                        {/* Category 4: Taste & Tales */}
                        <div className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-8 rounded-3xl sm:rounded-[4rem] md:rounded-[5rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-yellow/5 opacity-40 -z-10 rounded-[5rem] group-hover:bg-primary-yellow/10 transition-colors duration-1000"></div>

                            <div className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10">
                                <HeritageHeading as="h2" center className="mb-6 uppercase italic">{dict.navigation.food || 'Adventures & Flavors'}</HeritageHeading>
                                <p className="text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed opacity-80">{dict.home.heritage.tasteDesc}</p>
                                <div className="h-1.5 w-24 bg-primary-red mx-auto mt-10 rounded-full opacity-60"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-12 max-w-5xl mx-auto relative z-10">
                                {sections.filter(s => ['food', 'blog'].includes(s.id)).map((section, index) => (
                                    <Suspense key={index} fallback={<CardSkeleton />}>
                                        <SectionCard {...section} />
                                    </Suspense>
                                ))}
                            </div>
                        </div>

                        {/* Category 5: People & Places */}
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
                                <HeritageHeading as="h2" center className="mb-6 uppercase italic">{dict.navigation.villages || 'People & Places'}</HeritageHeading>
                                <p className="text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed opacity-80">{dict.home.heritage.placesDesc || 'Explore the directory of villages and the modern evolution of Mithila.'}</p>
                                <div className="h-1.5 w-24 bg-mithila-indigo mx-auto mt-10 rounded-full opacity-60"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-12 max-w-5xl mx-auto px-4">
                                {sections.filter(s => ['villages', 'modern-mithila'].includes(s.id)).map((section, index) => (
                                    <Suspense key={index} fallback={<CardSkeleton />}>
                                        <SectionCard {...section} />
                                    </Suspense>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12" id="share-story">
                    <Suspense fallback={<div className="h-96 bg-primary-red/5 rounded-3xl animate-pulse" />}>
                        <ShareStorySection dictionary={dict} />
                    </Suspense>
                </div>

                <div className="mt-12">
                    <Suspense fallback={<div className="h-40 bg-primary-red/5 rounded-full animate-pulse" />}>
                        <NewsLetterCTA />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}

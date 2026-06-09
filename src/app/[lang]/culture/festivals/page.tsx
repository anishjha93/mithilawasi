import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import { getFestivals } from '@/data/festivals';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');

    // Default titles if not in dictionary yet
    const titles = {
        en: "Festivals of Mithila",
        hi: "मिथिला के पर्व-त्योहार",
        mai: "मिथिलाक पावनि-तिहार"
    };

    const descriptions = {
        en: "Explore the vibrant festivals of Mithila, from Chhath Puja to Sama Chakeva. Discover the rituals, dates, and cultural significance.",
        hi: "छठ पूजा से लेकर सामा चकेवा तक, मिथिला के प्रमुख त्योहारों के बारे में जानें।",
        mai: "मिथिलाक पावनि-तिहार, छठि सँ लऽ कऽ सामा चकेवा धरि, सभक महत्व आओर विधि जानू।"
    };

    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';

    return {
        title: titles[lang],
        description: descriptions[lang],
    };
}

export default async function FestivalsPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const { festivalsPage } = dict;
    const festivals = await getFestivals();

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": festivalsPage.title,
        "description": festivalsPage.subtitle,
        "url": `https://mithilawasi.com/${lang}/culture/festivals`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": festivals.map((f, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": f.locales[lang].name,
                "url": `https://mithilawasi.com/${lang}/culture/festivals/${f.slug}`
            }))
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-16">
            <JsonLd type="CollectionPage" data={schemaData} />

            <header className="text-center mb-16">
                <Link href={`/${lang}/culture`} className="text-primary-red hover:underline font-medium mb-4 inline-block transition-colors" aria-label={festivalsPage.backToCulture}>
                    ← {festivalsPage.backToCulture}
                </Link>
                <h1 className="text-[2.5rem] font-bold text-mithila-ink mb-4">{festivalsPage.title}</h1>
                <p className="text-[1.25rem] text-text-muted max-w-2xl mx-auto">
                    {festivalsPage.subtitle}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {festivals.map((festival) => {
                    const locale = festival.locales[lang];
                    return (
                        <Link
                            href={`/${lang}/culture/festivals/${festival.slug}`}
                            key={festival.slug}
                            className="bg-card-bg rounded-xl shadow-sm border border-border-color overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
                            aria-label={`${locale.name} - ${festivalsPage.readMore}`}
                        >
                            <div className="h-48 bg-primary-yellow/10 dark:bg-primary-yellow/5 flex items-center justify-center relative overflow-hidden">
                                <span className="text-4xl" role="img" aria-hidden="true">🎉</span>
                                {/* Placeholder for real image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-4 text-paper-white font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm text-sm">
                                    {festival.month} • {festival.date_2026.split('-')[0]}
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary-red transition-colors">{locale.name}</h2>
                                <p className="text-text-muted line-clamp-2 text-sm leading-relaxed mb-4">
                                    {locale.description}
                                </p>
                                <span className="inline-block text-primary-red text-sm font-semibold uppercase tracking-wider">
                                    {festivalsPage.readMore} →
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';
import { getFestivals } from '@/data/festivals';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const festivals = await getFestivals();
    const langs = ['en', 'hi', 'mai'];
    const params = [];

    for (const lang of langs) {
        for (const festival of festivals) {
            params.push({ lang, slug: festival.slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await Promise.resolve(params);
    const festivals = await getFestivals();
    const festival = festivals.find((f) => f.slug === slug);

    if (!festival) return { title: 'Festival Not Found' };

    const locale = festival.locales[lang as 'en' | 'hi' | 'mai'];

    return {
        title: `${locale.name} - Mithila Festivals`,
        description: locale.description,
    };
}

export default async function FestivalDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await Promise.resolve(params);
    const festivals = await getFestivals();
    const festival = festivals.find((f) => f.slug === slug);

    if (!festival) notFound();

    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { festivalsPage } = dict;
    const locale = festival.locales[lang as 'en' | 'hi' | 'mai'];

    // Schema for Event or Festival
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Festival",
        "name": locale.name,
        "description": locale.description,
        "startDate": festival.date_2026,
        "location": {
            "@type": "Place",
            "name": "Mithila Region"
        },
        "image": `https://mithilawasi.com${festival.image}`
    };

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-16">
            <JsonLd type="Event" data={schemaData} />

            <div className="mb-8">
                <Link href={`/${lang}/culture/festivals`} className="text-primary-red hover:underline font-medium inline-flex items-center gap-2 transition-colors">
                    ← <span>{festivalsPage.backToFestivals}</span>
                </Link>
            </div>

            <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color overflow-hidden">
                <div className="h-64 sm:h-80 bg-orange-50 dark:bg-orange-900/10 relative flex items-center justify-center">
                    <span className="text-8xl opacity-20">🕉️</span>
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/60 to-transparent">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{locale.name}</h1>
                        <div className="flex items-center gap-4 text-white/90">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30">
                                {festival.month} Month
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30">
                                {festival.date_2026}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary-red mb-3">
                            {festivalsPage.significance}
                        </h2>
                        <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed italic border-l-4 border-primary-red pl-6">
                            "{locale.significance}"
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            {festivalsPage.aboutFestival}
                        </h2>
                        <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                            {locale.description}
                        </p>
                    </div>

                    <div className="mt-12 p-6 bg-primary-red/5 dark:bg-primary-red/10 rounded-xl border border-primary-red/10">
                        <h3 className="text-mithila-ink font-bold mb-2 flex items-center gap-2">
                            <span>📅</span> 2026 Date
                        </h3>
                        <p className="text-text-muted">
                            {festivalsPage.dateDetail.replace('%date%', festival.date_2026)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

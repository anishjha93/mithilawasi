import { getDictionary } from '@/get-dictionary';
import MantraCard from '@/components/MantraCard';
import { getMantras } from '@/lib/mantras';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const mantrasData = await getMantras();
    const params = [];
    const locales: Locale[] = ['en', 'hi', 'mai'];

    for (const lang of locales) {
        for (const mantra of mantrasData) {
            params.push({ lang, slug: mantra.slug });
        }
    }

    return params;
}

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const params = await props.params;
    const { lang, slug } = params;
    const mantrasData = await getMantras();
    const mantra = mantrasData.find((m) => m.slug === slug);
    const dictionary = await getDictionary(lang);

    if (!mantra) {
        return {
            title: 'Mantra Not Found',
        };
    }

    const locale = mantra.locales[lang] || mantra.locales.en;
    const title = `${locale.title} - Mithilawasi`;
    const description = locale.meaning.substring(0, 160);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
        },
    };
}

export default async function MantraPage(props: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const params = await props.params;
    const { lang, slug } = params;
    const mantrasData = await getMantras();
    const mantra = mantrasData.find((m) => m.slug === slug);
    const dictionary = await getDictionary(lang);
    const { mantrasPage } = dictionary;

    if (!mantra) {
        return (
            <div className="min-h-screen bg-white pb-20">
                <div className="max-w-[1280px] mx-auto px-6 py-16">
                    <h1 className="text-3xl font-bold mb-4">Mantra not found</h1>
                    <Link href={`/${lang}/mantras`} className="text-amber-600 hover:underline">
                        Return to Mantras
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-4xl mx-auto p-4 md:p-8 pt-20">
                <Link
                    href={mantra.category === 'vrat_katha' ? `/${lang}/vrat-katha` : `/${lang}/mantras`}
                    className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>
                        {mantra.category === 'vrat_katha'
                            ? (lang === 'mai' ? 'पाछाँ (व्रत कथा)' : (lang === 'hi' ? 'वापस (व्रत कथा)' : 'Back to Vrat Kathas'))
                            : (lang === 'mai' ? 'पाछाँ' : (lang === 'hi' ? 'वापस' : 'Back to Mantras'))}
                    </span>
                </Link>

                <MantraCard
                    mantra={mantra}
                    lang={lang === 'hi' || lang === 'mai' || lang === 'en' ? lang : 'en'}
                    dictionary={mantrasPage}
                    isDetailsPage={true}
                />
            </div>
        </div>
    );
}

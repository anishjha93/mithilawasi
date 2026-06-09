import { getDictionary } from '@/get-dictionary';
import MantraCard from '@/components/MantraCard';
import { getMantras } from '@/lib/mantras';
import { Locale } from '@/i18n-config';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Maithili Mantras | Mithilawasi',
    description: 'Collection of powerful Vedic and Maithili mantras for daily life.',
};

export default async function MantrasPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const params = await props.params;
    const { lang } = params;
    const dictionary = await getDictionary(lang);
    const mantrasData = await getMantras();
    const { mantrasPage } = dictionary;

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-16">
            <header className="text-center mb-12">
                <h1 className="text-[3.5rem] font-bold text-primary-red mb-4 font-heading">{dictionary.mantrasPage.title}</h1>
                <p className="text-[1.25rem] text-gray-500 dark:text-gray-400 max-w-[600px] mx-auto line-clamp-2 md:line-clamp-none">{dictionary.mantrasPage.subtitle}</p>
            </header>

            {/* Mantras Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 max-w-[1240px] mx-auto mb-16">
                {mantrasData.filter((m: any) => !m.category || m.category === 'mantra').map((mantra: any) => (
                    <MantraCard
                        key={mantra.slug}
                        mantra={mantra}
                        lang={lang === 'hi' || lang === 'mai' || lang === 'en' ? lang : 'en'}
                        dictionary={mantrasPage}
                    />
                ))}
            </div>

            {/* Footer Note */}
            <div className="text-center mt-12 bg-linear-to-b from-primary-yellow/10 to-transparent pt-8 pb-12">
                <div className="inline-block px-8 py-4 bg-paper-texture border border-madhubani rounded-full text-mithila-ink text-[1rem] font-bold shadow-md animate-fade-in-up">
                    {mantrasPage.regularUpdates}
                </div>
            </div>
        </div>
    );
}

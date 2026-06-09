import { getDictionary } from '@/get-dictionary';
import MantraCard from '@/components/MantraCard';
import mantrasData from '@/data/mantras.json';
import { Locale } from '@/i18n-config';

export const metadata = {
    title: 'Vrat Katha | Mithilawasi',
    description: 'Read sacred Vrat Kathas in Maithili, including Satyanarayan, Jitiya, and more.',
};

export default async function VratKathaPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const params = await props.params;
    const { lang } = params;
    const dictionary = await getDictionary(lang);
    const { vratKathaPage } = dictionary;

    // Filter only Vrat Kathas
    const vratKathas = mantrasData.filter((m: any) => m.category === 'vrat_katha');

    return (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
            <header className="text-center mb-16 relative header-heritage">
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-mithila-ink mb-4 font-heading">{dictionary.vratKathaPage.title || 'Vrat Katha'}</h1>
                <p className="text-[1.25rem] text-gray-600 max-w-[800px] mx-auto line-clamp-2 md:line-clamp-none font-body">{vratKathaPage.subtitle}</p>
            </header>

            <section className="mb-20">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-10 max-w-[1280px] mx-auto">
                    {vratKathas.map((mantra: any) => (
                        <MantraCard
                            key={mantra.slug}
                            mantra={mantra}
                            lang={lang}
                            dictionary={{
                                ...dictionary.mantrasPage,
                                readStory: vratKathaPage.readStory
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Footer Note */}
            <div className="text-center mt-12 pt-12 border-t border-dashed border-primary-yellow relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#faf8f5] px-4 text-2xl text-primary-yellow">
                    🕉️
                </div>
                <div className="inline-block px-8 py-4 bg-paper-texture border border-madhubani rounded-full text-mithila-ink text-[1rem] font-bold shadow-md animate-fade-in-up">
                    {vratKathaPage.regularUpdates}
                </div>
            </div>
        </div>
    );
}

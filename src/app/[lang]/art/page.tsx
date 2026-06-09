
import { getDictionary } from '@/get-dictionary';
import { artStyles } from '@/data/art';
import Link from 'next/link';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

interface PageProps {
    params: Promise<{
        lang: 'en' | 'hi' | 'mai';
    }>;
}

export default async function ArtPage({ params }: PageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const getGradient = (slug: string) => {
        switch (slug) {
            case 'bharni': return 'from-[#FF9A9E] via-[#FECFEF] to-[#FF9A9E]';
            case 'katchni': return 'from-[#a18cd1] via-[#fbc2eb] to-[#a18cd1]';
            case 'godna': return 'from-[#84fab0] via-[#8fd3f4] to-[#84fab0]';
            case 'tantrik': return 'from-[#ff9a9e] via-[#fecfef] to-[#ff9a9e]';
            case 'kohbar': return 'from-[#f6d365] via-[#fda085] to-[#f6d365]';
            default: return 'from-primary-red/10 via-primary-yellow/10 to-primary-green/10';
        }
    };

    return (
        <div className="bg-paper-white min-h-screen">
            {/* Header section with mesh gradient */}
            <div className="relative py-24 md:py-32 overflow-hidden border-b border-primary-red/5">
                <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-40"></div>
                <div className="absolute inset-0 madhubani-pattern-bg opacity-5 pointer-events-none"></div>
                <div className="container relative z-10 text-center">
                    <HeritageHeading as="h1" center className="animate-fade-in-up">
                        {dictionary.artPage.title}
                    </HeritageHeading>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-serif italic animate-fade-in-up delay-100">
                        {dictionary.artPage.description}
                    </p>
                    <div className="h-1.5 w-24 mx-auto bg-primary-red rounded-full mt-8 shadow-sm animate-fade-in-up delay-200"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {artStyles.map((style, index) => (
                        <Link
                            href={`/${lang}/art/${style.slug}`}
                            key={style.slug}
                            className="group animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <MithilaCard padding="none" className="h-full border-primary-red/5 hover:border-primary-red/40 overflow-hidden group">
                                <div className="relative h-64 overflow-hidden">
                                     {/* Fallback to premium gradient */}
                                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(style.slug)} transition-all duration-700 group-hover:scale-110 flex items-center justify-center relative`}>
                                        <div className="absolute inset-0 madhubani-pattern-bg opacity-20"></div>
                                        <span className="text-6xl drop-shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">🎨</span>
                                    </div>

                                    {/* Overlay Badge */}
                                    <div className="absolute top-6 right-6 glass-morphism px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-mithila-ink border border-primary-red/10 group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                                        {style.englishTitle.split(' ')[0]}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-black mb-2 text-mithila-ink group-hover:text-primary-red transition-colors font-heading tracking-tight">
                                        {style.title}
                                    </h3>
                                    <div className="text-xs font-bold text-primary-red/60 mb-4 uppercase tracking-[0.2em] font-body">
                                        {style.englishTitle}
                                    </div>
                                    <p className="text-base text-text-muted leading-relaxed mb-8 font-serif italic line-clamp-3">
                                        {style.description}
                                    </p>

                                    <div className="flex items-center text-primary-red font-black text-sm tracking-widest uppercase group-hover:translate-x-2 transition-all duration-300">
                                        <span>{dictionary.artPage.viewStyle}</span>
                                        <span className="ml-2 text-xl">→</span>
                                    </div>
                                </div>
                            </MithilaCard>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return {
        title: `${dictionary.artPage.title} | Mithilawasi`,
        description: dictionary.artPage.description,
    };
}

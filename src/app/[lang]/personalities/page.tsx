import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import Image from 'next/image';
import { getPersonalities, type Personality } from '@/lib/personalities';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/personalities`;

    return {
        title: dict.personalitiesPage.title,
        description: dict.personalitiesPage.lead,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/personalities`,
                'hi-IN': `${baseUrl}/hi/personalities`,
                'mai-IN': `${baseUrl}/mai/personalities`,
                'x-default': `${baseUrl}/en/personalities`,
            },
        },
        keywords: [
            'Mithila Personalities', 'Famous Maithils', 'Vidyapati',
            'Maharshi Gautam', 'Yagyavalkya', 'Mandan Mishra',
            'Sharda Sinha', 'Udit Narayan', 'Gonu Jha',
            'Maithili Literature', 'Mithila Icons'
        ]
    };
}

export default async function PersonalitiesPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const allPersonalities = await getPersonalities();
    const { personalitiesPage } = dict;

    if (!personalitiesPage) {
        return <div className="container">Loading...</div>;
    }

    // Group personalities by profession for display, preserving the directory structure logic
    const professionsMap = new Map<string, Personality[]>();
    allPersonalities.forEach(p => {
        const profession = p.profession[0] || 'Famous Personalities';
        if (!professionsMap.has(profession)) professionsMap.set(profession, []);
        professionsMap.get(profession)!.push(p);
    });

    const categories = Array.from(professionsMap.entries()).map(([title, people]) => ({
        title,
        people: people.map(p => ({
            name: p.locales[lang]?.name || p.locales.en.name,
            desc: p.locales[lang]?.description || p.locales.en.description,
            image: p.image,
            slug: p.slug
        }))
    }));

    return (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
            <header className="text-center mb-16 relative header-heritage">
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-mithila-ink mb-4 font-bold tracking-tight font-heading">{personalitiesPage.title}</h1>
                <p className="text-text-muted text-[1.25rem] max-w-[800px] mx-auto leading-relaxed font-body">
                    {personalitiesPage.lead}
                </p>
            </header>

            {categories.map((category: any, catIndex: number) => (
                <div key={catIndex} className="mb-20 last:mb-0">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-grow bg-primary-red/20"></div>
                        <h2 className="text-3xl font-bold text-primary-red font-heading uppercase tracking-widest px-4 border border-primary-red/20 py-2 rounded-full bg-paper-texture">
                            {category.title}
                        </h2>
                        <div className="h-px flex-grow bg-primary-red/20"></div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
                        {category.people.map((person: any, pIndex: number) => (
                            <Link
                                key={pIndex}
                                href={`/${lang}/personalities/${person.slug}`}
                                className="bg-paper-texture rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer flex flex-col group relative border border-madhubani animate-fade-in-up"
                                style={{ animationDelay: `${pIndex * 100}ms` }}
                            >
                                {/* Decorative overlay */}
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />

                                {person.image && (
                                    <div className="w-full h-[280px] relative overflow-hidden border-b-4 border-primary-yellow">
                                        <Image
                                            src={person.image}
                                            alt={person.imageAlt || person.name}
                                            fill
                                            className="object-cover transition-transform duration-700 ease group-hover:scale-105 group-hover:sepia-[.2]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                    </div>
                                )}
                                <div className="p-8 flex-grow flex flex-col relative z-10 pt-6">
                                    <h3 className="text-2xl font-bold mb-3 text-mithila-ink font-heading group-hover:text-primary-red transition-colors">{person.name}</h3>
                                    <p className="text-text-muted leading-relaxed line-clamp-3 mb-6 font-body text-[1rem]">{person.desc}</p>
                                    <span className="mt-auto inline-flex items-center gap-2 text-primary-red font-bold uppercase tracking-wider text-[0.85rem] border-b border-primary-red/20 pb-1 self-start group-hover:gap-3 transition-all">
                                        {lang === 'en' ? 'Read Biography' : lang === 'hi' ? 'जीवनी पढ़ें' : 'जीवनी पढ़ू'} <span>→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

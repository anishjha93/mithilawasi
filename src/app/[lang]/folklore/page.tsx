import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import { getCollectionData } from '@/lib/data-service';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    return {
        title: dict.folklorePage.title,
        description: dict.folklorePage.description,
    };
}

export default async function Folklore({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const folkloreItems = await getCollectionData<any>('folklore');

    return (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
            <header className="text-center mb-16 relative header-heritage">
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] mb-4 font-bold tracking-tight font-heading text-mithila-ink">{dict.folklorePage.title}</h1>
                <p className="text-[1.25rem] text-center text-gray-600 mb-12 max-w-[800px] mx-auto leading-relaxed font-body">
                    {dict.folklorePage.description}
                </p>
            </header>

            {/* Cultural Legends & Dances from folklore.json */}
            {folkloreItems.length > 0 && (
                <div className="mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {folkloreItems.map((item: any) => {
                            const localeData = item.locales[lang] || item.locales['en'];
                            return (
                                <Link key={item.slug} href={`/${lang}/folklore/${item.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all hover:shadow-2xl flex flex-col md:flex-row">
                                    <div className="md:w-2/5 relative overflow-hidden">
                                        <img 
                                            src={item.image} 
                                            alt={localeData.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute top-4 left-4 bg-primary-red text-white px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                        <h3 className="text-[1.8rem] font-bold text-mithila-ink mb-4 font-heading leading-tight group-hover:text-primary-red transition-colors">
                                            {localeData.title}
                                        </h3>
                                        <p className="text-[1rem] text-gray-700 mb-4 line-clamp-3 font-body leading-relaxed">
                                            {localeData.description}
                                        </p>
                                        <div className="mt-4 p-4 bg-orange-50/50 rounded-lg border-l-4 border-primary-yellow">
                                            <p className="text-xs font-bold text-yellow-800 uppercase mb-1 tracking-wider">Rituals & Significance</p>
                                            <p className="text-sm text-gray-600 italic line-clamp-2">{localeData.significance}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Spotlight: Gonu Jha */}
            <div className="max-w-[1000px] mx-auto mb-20 p-8 md:p-12 bg-paper-texture rounded-xl border border-primary-yellow shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-yellow/10 rounded-bl-full -mr-12 -mt-12 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 mb-4 bg-primary-yellow/20 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-yellow/50">
                            Folk Hero Spotlight
                        </div>
                        <h2 className="text-primary-red mb-4 text-[2.5rem] font-bold font-heading">{dict.folklorePage.spotlight.title}</h2>
                        <p className="text-[1.15rem] leading-relaxed text-mithila-ink font-body italic border-l-4 border-primary-yellow pl-6">
                            "{dict.folklorePage.spotlight.intro}"
                        </p>
                        <Link href={`/${resolvedParams.lang}/personalities/gonu-jha`} className="mt-6 inline-flex items-center gap-2 text-primary-red font-bold hover:gap-3 transition-all uppercase tracking-wide text-sm">
                            Read Tales of Gonu Jha <span>→</span>
                        </Link>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="text-[5rem] w-32 h-32 bg-primary-yellow/20 rounded-full flex items-center justify-center border-2 border-dashed border-primary-yellow text-primary-yellow animate-pulse-slow">
                            🧠
                        </div>
                    </div>
                </div>
            </div>

            {/* Songs CTA */}
            <div className="max-w-[1000px] mx-auto mb-20 p-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl text-center shadow-inner border border-orange-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/motif.png')] bg-repeat" />
                <h2 className="text-[#e65100] text-[2.5rem] mb-6 font-bold font-heading relative z-10">{dict.songsPage.title}</h2>
                <p className="text-[1.2rem] text-gray-700 mb-10 leading-relaxed font-body max-w-2xl mx-auto relative z-10">
                    {dict.songsPage.description}
                </p>
                <Link href={`/${resolvedParams.lang}/songs`} className="relative z-10 inline-block px-10 py-4 bg-gradient-to-r from-[#e65100] to-[#f57c00] hover:from-[#bf360c] hover:to-[#e65100] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all uppercase tracking-wider text-sm border-2 border-white/20">
                    {resolvedParams.lang === 'en' ? 'Explore Songs & Lyrics' : (resolvedParams.lang === 'hi' ? 'गीत और भावार्थ देखें' : 'गीत आ भावार्थ देखू')}
                </Link>
            </div>

            {/* Sacred Legends */}
            {dict.folklorePage.legends && (
                <div className="mb-24 px-4">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-[2px] w-12 bg-purple-200"></div>
                        <h2 className="text-[2.5rem] text-center text-purple-900 font-bold font-heading">{dict.folklorePage.legends.title}</h2>
                        <div className="h-[2px] w-12 bg-purple-200"></div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
                        {dict.folklorePage.legends.items.map((legend: any, idx: number) => (
                            <div key={idx} className="p-8 bg-paper-texture rounded-xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden hover:-translate-y-1">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-600 group-hover:w-2 transition-all"></div>
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.02] pointer-events-none" />
                                <h3 className="text-purple-800 mb-4 text-[1.75rem] font-bold font-heading">{legend.title}</h3>
                                <p className="text-[1.1rem] leading-relaxed text-gray-700 font-body">{legend.story}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tales */}
            <div className="max-w-[1000px] mx-auto mb-24">
                <h2 className="text-[2.5rem] mb-12 text-center font-bold font-heading text-mithila-ink">Famous Folk Tales</h2>
                <div className="grid gap-8">
                    {dict.folklorePage.tales.map((tale: any, idx: number) => (
                        <div key={idx} className="p-8 md:p-10 bg-white rounded-xl shadow-md transition-all hover:shadow-lg border-b-4 border-gray-200 hover:border-mithila-ink group">
                            <h3 className="text-mithila-ink mb-4 text-[1.8rem] font-bold font-heading group-hover:text-primary-red transition-colors">{tale.title}</h3>
                            <p className="text-[1.15rem] leading-relaxed text-gray-700 font-body">{tale.story}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Folk Heroes */}
            {dict.folklorePage.heroes && (
                <div className="mt-20 pt-16 border-t border-gray-200 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                        <span className="text-3xl text-gray-300">❦</span>
                    </div>
                    <h2 className="text-[2.5rem] mb-4 text-center font-bold font-heading text-mithila-ink">
                        {dict.folklorePage.heroes.title}
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-[600px] mx-auto font-body italic">
                        {dict.folklorePage.heroes.intro}
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
                        {dict.folklorePage.heroes.list.map((hero: any, idx: number) => (
                            <div key={idx} className="p-8 bg-paper-texture rounded-xl shadow-lg border border-madhubani transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03]" />
                                <div className="relative z-10">
                                    <h3 className="text-primary-red mb-3 text-[1.6rem] font-bold font-heading border-b border-red-100 pb-2 inline-block">{hero.name}</h3>
                                    <p className="text-gray-700 leading-relaxed font-body">{hero.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

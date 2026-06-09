import { getDictionary } from '@/get-dictionary';
import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/culture`;

    return {
        title: dict.culturePage.title,
        description: dict.culturePage.lead,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/culture`,
                'hi-IN': `${baseUrl}/hi/culture`,
                'mai-IN': `${baseUrl}/mai/culture`,
                'x-default': `${baseUrl}/en/culture`,
            },
        },
    };
}

export default async function CulturePage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const { culturePage } = dict;

    const schemaData = {
        name: culturePage.title,
        description: culturePage.lead,
        url: `https://mithilawasi.com/${lang}/culture`
    };

    return (
        <div className="bg-paper-white min-h-screen">
            <JsonLd type="CollectionPage" data={schemaData} />

            {/* Immersive Header */}
            <header className="relative py-24 md:py-36 overflow-hidden border-b border-primary-red/5">
                <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-30"></div>
                <div className="absolute inset-0 madhubani-pattern-bg opacity-5 pointer-events-none"></div>
                <div className="container relative z-10 text-center">
                    <HeritageHeading as="h1" center className="mb-6">
                        {culturePage.title}
                    </HeritageHeading>
                    <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed font-serif italic">
                        {culturePage.lead}
                    </p>
                    <div className="h-1.5 w-32 mx-auto bg-primary-red rounded-full mt-10 shadow-sm"></div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Identity Section */}
                {culturePage.identity && (
                    <MithilaCard variant="madhubani" className="mb-24 text-center max-w-4xl mx-auto p-12 md:p-16">
                        <HeritageHeading as="h2" center className="mb-8 font-black">
                            {culturePage.identity.title}
                        </HeritageHeading>
                        <p className="text-xl leading-relaxed text-text-muted font-serif italic">
                            {culturePage.identity.text}
                        </p>
                    </MithilaCard>
                )}

                {/* Quick Interactive Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                    <Link href={`/${lang}/culture/sanskars`} className="group">
                        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-red to-[#80101b] text-white shadow-premium p-12 flex flex-col justify-between min-h-[320px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute inset-0 madhubani-pattern-bg opacity-10"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all duration-700" />
                            <div className="relative z-10">
                                <span className="glass px-4 py-1.5 rounded-full text-[0.6rem] font-black tracking-[0.3em] uppercase mb-8 inline-block shadow-sm">Interactive Experience</span>
                                <h3 className="text-4xl font-black mb-4 font-heading tracking-tight">{dict.sanskarsPage?.title || '16 Sanskars'}</h3>
                                <p className="text-white/80 text-xl leading-relaxed max-w-sm font-serif italic">Explore the sacred journey of life in Mithila from birth to death.</p>
                            </div>
                            <div className="relative z-10 flex items-center mt-10">
                                <span className="font-black inline-flex items-center px-8 py-4 bg-white/10 rounded-full group-hover:bg-white group-hover:text-primary-red transition-all duration-300 shadow-sm uppercase tracking-[0.2em] text-xs">
                                    View Timeline →
                                </span>
                            </div>
                        </div>
                    </Link>

                    <Link href={`/${lang}/culture/dictionary`} className="group">
                        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-premium p-12 flex flex-col justify-between min-h-[320px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute inset-0 madhubani-pattern-bg opacity-10"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all duration-700" />
                            <div className="relative z-10">
                                <span className="glass px-4 py-1.5 rounded-full text-[0.6rem] font-black tracking-[0.3em] uppercase mb-8 inline-block shadow-sm">Learning Tool</span>
                                <h3 className="text-4xl font-black mb-4 font-heading tracking-tight">{dict.dictionaryPage?.title || 'Maithili Dictionary'}</h3>
                                <p className="text-white/80 text-xl leading-relaxed max-w-sm font-serif italic">Learn essential words, phrases, and greetings of Mithila.</p>
                            </div>
                            <div className="relative z-10 flex items-center mt-10">
                                <span className="font-black inline-flex items-center px-8 py-4 bg-white/10 rounded-full group-hover:bg-white group-hover:text-orange-500 transition-all duration-300 shadow-sm uppercase tracking-[0.2em] text-xs">
                                    Start Learning →
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Social Structure & Customs */}
                {culturePage.social && (
                    <MithilaCard padding="none" className="mb-24 overflow-visible p-1">
                        <div className="p-10 md:p-20 border-border-color">
                            <header className="mb-16 text-center">
                                <HeritageHeading as="h2" center>{culturePage.social.title}</HeritageHeading>
                                <div className="h-1 w-20 bg-primary-yellow mx-auto rounded-full mt-4"></div>
                            </header>

                            {/* The Paag */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                                <div className="lg:col-span-3 text-center max-w-3xl mx-auto mb-12">
                                    <h3 className="text-4xl font-black text-primary-red mb-6 font-heading italic tracking-tighter uppercase">{culturePage.social.paag.title}</h3>
                                    <p className="text-2xl text-text-muted font-serif italic leading-relaxed">{culturePage.social.paag.intro}</p>
                                    <Link href={`/${lang}/blog/paag-not-a-cap-but-the-crown-of-mithila`} className="inline-block mt-10 text-primary-red font-black group transition-all duration-300 hover:rotate-1">
                                        <span className="border-b-4 border-primary-red/20 group-hover:border-primary-red pb-1 tracking-widest text-sm uppercase">{culturePage.social.paag.readMore} →</span>
                                    </Link>
                                </div>
                                {culturePage.social.paag.types.map((type: any, idx: number) => (
                                    <MithilaCard key={idx} className={`p-10 glass-morphism rounded-[2.5rem] border-t-8 ${idx === 0 ? 'border-primary-red' : idx === 1 ? 'border-primary-yellow' : 'border-gray-400'} shadow-premium hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                                        <h4 className="text-2xl font-black mb-5 text-mithila-ink font-heading">{type.color}</h4>
                                        <p className="text-lg text-text-muted leading-relaxed font-serif italic">{type.desc}</p>
                                    </MithilaCard>
                                ))}
                            </div>

                            {/* Village Life */}
                            <div className="glass-morphism p-12 rounded-[3.5rem] border-l-[16px] border-primary-yellow text-mithila-ink shadow-premium relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary-yellow/5 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black mb-8 flex items-center gap-6 uppercase tracking-widest font-heading">
                                        <span className="text-5xl animate-bounce-slow">🏡</span> {culturePage.social.village.title}
                                    </h3>
                                    <p className="leading-relaxed text-2xl font-serif italic opacity-90">{culturePage.social.village.desc}</p>
                                </div>
                            </div>
                        </div>
                    </MithilaCard>
                )}

                {/* Major Festivals */}
                <div className="mb-24">
                    <HeritageHeading as="h2" className="mb-16 pl-8 border-l-8 border-primary-red italic">
                        {culturePage.festivals.majorTitle}
                    </HeritageHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {culturePage.festivals.major.map((fest: any, idx: number) => (
                            <MithilaCard key={idx} variant="madhubani" className="h-full p-12 group hover:border-primary-red transition-all duration-700 hover:rotate-1">
                                <h3 className="text-3xl font-black text-primary-red mb-6 font-heading tracking-tighter italic uppercase group-hover:scale-105 transition-transform">{fest.name}</h3>
                                <p className="text-xl text-text-muted leading-relaxed font-serif italic">{fest.desc}</p>
                            </MithilaCard>
                        ))}
                    </div>
                </div>

                {/* Sacred Vrats */}
                <div className="mb-24">
                    <HeritageHeading as="h2" className="mb-16 pl-8 border-l-8 border-primary-yellow italic">
                        {culturePage.festivals.vratsTitle}
                    </HeritageHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {culturePage.festivals.vrats.map((fest: any, idx: number) => (
                            <div key={idx} className="group h-full">
                                <div className="h-full p-12 glass-morphism rounded-[3rem] border border-primary-red/5 hover:border-primary-red/40 transition-all duration-700 shadow-premium hover:shadow-2xl">
                                    <h3 className="text-3xl font-black text-mithila-ink mb-6 font-heading tracking-tighter italic group-hover:text-primary-red transition-colors">{fest.name}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic">{fest.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seasonal & Cultural */}
                <div className="mb-24">
                    <HeritageHeading as="h2" className="mb-16 pl-8 border-l-8 border-primary-green italic text-primary-green">
                        {culturePage.festivals.seasonalTitle}
                    </HeritageHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {culturePage.festivals.seasonal.map((fest: any, idx: number) => (
                            <div key={idx} className="group h-full">
                                <div className="h-full p-12 glass-morphism rounded-[3rem] border border-primary-green/5 hover:border-primary-green transition-all duration-700 shadow-premium hover:shadow-2xl">
                                    <h3 className="text-3xl font-black text-primary-green mb-6 font-heading tracking-tighter italic">{fest.name}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic">{fest.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Literature & Philosophy */}
                <div className="py-24 border-t border-primary-red/5">
                    <div className="max-w-4xl mb-20">
                        <HeritageHeading as="h2" className="mb-10 text-primary-red">
                            {culturePage.literature.title}
                        </HeritageHeading>
                        <p className="text-2xl text-text-muted leading-relaxed font-serif italic">
                            {culturePage.literature.text}
                        </p>
                    </div>

                    {/* Proverbs (Dak Vachan) */}
                    {culturePage.literature.proverbs && (
                        <div className="mb-24">
                            <HeritageHeading as="h3" className="mb-12 text-mithila-ink pl-8 border-l-8 border-primary-yellow italic text-3xl">
                                {culturePage.literature.proverbs.title}
                            </HeritageHeading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {culturePage.literature.proverbs.list.map((item: any, idx: number) => (
                                    <MithilaCard key={idx} className="p-10 border-l-[12px] border-l-primary-yellow bg-primary-yellow/5 hover:bg-white transition-all duration-500 shadow-premium hover:shadow-2xl">
                                        <p className="text-2xl font-black mb-6 text-mithila-ink font-heading leading-tight italic">
                                            "{item.text}"
                                        </p>
                                        <p className="text-xl text-text-muted font-serif italic opacity-80">
                                            {item.meaning}
                                        </p>
                                    </MithilaCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modern Literature */}
                    {culturePage.literature.modern && (
                        <div>
                            <HeritageHeading as="h3" className="mb-12 text-mithila-ink pl-8 border-l-8 border-mithila-ink italic text-3xl">
                                {culturePage.literature.modern.title}
                            </HeritageHeading>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {culturePage.literature.modern.list.map((item: any, idx: number) => (
                                    <MithilaCard key={idx} className="p-10 group hover:border-mithila-ink transition-all duration-500">
                                        <h3 className="text-2xl font-black text-mithila-ink mb-4 font-heading tracking-tight italic uppercase group-hover:text-primary-red transition-colors">{item.name}</h3>
                                        <p className="text-lg text-text-muted leading-relaxed font-serif italic">{item.desc}</p>
                                    </MithilaCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cinema of Mithila - Expanded */}
                <div className="py-24 border-t border-primary-red/5">
                    <HeritageHeading as="h2" className="mb-10 text-primary-red">
                        {culturePage.cinema?.title}
                    </HeritageHeading>
                    {culturePage.cinema?.intro && <p className="text-2xl mb-16 text-text-muted leading-relaxed font-serif italic max-w-4xl">{culturePage.cinema.intro}</p>}

                    {culturePage.cinema?.history && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                            {culturePage.cinema.history.map((era: any, idx: number) => (
                                <MithilaCard key={idx} className="p-10 border-l-8 border-l-primary-red bg-primary-red/5 hover:bg-white transition-all duration-700 group">
                                    <h3 className="text-xl font-black text-primary-red mb-6 uppercase tracking-[0.2em]">{era.era}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic opacity-90 group-hover:opacity-100">{era.text}</p>
                                </MithilaCard>
                            ))}
                        </div>
                    )}

                    {culturePage.cinema?.notableFilms && (
                        <MithilaCard className="p-12 md:p-16 border-primary-yellow bg-primary-yellow/5">
                            <HeritageHeading as="h3" className="mb-10 text-mithila-ink uppercase tracking-widest text-lg font-black italic">
                                Notable Films
                            </HeritageHeading>
                            <div className="flex flex-wrap gap-6">
                                {culturePage.cinema.notableFilms.map((film: string, idx: number) => (
                                    <span key={idx} className="glass-morphism px-8 py-4 rounded-full text-lg font-black shadow-premium border border-primary-red/10 flex items-center gap-4 hover:scale-105 transition-transform cursor-default">
                                        <span className="text-3xl">🎬</span> <span className="text-mithila-ink font-heading">{film}</span>
                                    </span>
                                ))}
                            </div>
                        </MithilaCard>
                    )}
                </div>

                {/* Performing Arts */}
                <div className="py-24 border-t border-primary-red/5">
                    <HeritageHeading as="h2" className="mb-10 text-primary-red">
                        {culturePage.performingArts.title}
                    </HeritageHeading>
                    <p className="text-2xl mb-16 text-text-muted leading-relaxed font-serif italic max-w-4xl">{culturePage.performingArts.text}</p>

                    {culturePage.performingArts.ragas && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                            {culturePage.performingArts.ragas.map((raga: any, idx: number) => (
                                <MithilaCard key={idx} className="p-10 group hover:border-primary-red transition-all duration-500">
                                    <h3 className="text-3xl font-black text-primary-red mb-4 font-heading tracking-tighter italic uppercase group-hover:scale-110 transition-transform origin-left">{raga.name}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic">{raga.desc}</p>
                                </MithilaCard>
                            ))}
                        </div>
                    )}

                    {/* Famous Songs */}
                    <MithilaCard variant="madhubani" className="p-12 md:p-20 mb-20 bg-primary-red/5">
                        <HeritageHeading as="h3" className="mb-12 text-primary-red uppercase tracking-widest font-black italic">
                            {culturePage.performingArts.famousSongs.title}
                        </HeritageHeading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                            {culturePage.performingArts.famousSongs.classics.map((song: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-6 py-4 border-b border-primary-red/10 group">
                                    <span className="text-4xl group-hover:rotate-12 transition-transform">🎵</span>
                                    <span className="text-2xl font-black text-mithila-ink font-heading leading-tight group-hover:text-primary-red transition-colors italic">{song}</span>
                                </div>
                            ))}
                        </div>
                    </MithilaCard>

                    {culturePage.performingArts.folk && (
                        <div>
                            <HeritageHeading as="h3" className="mb-12 text-mithila-ink pl-8 border-l-8 border-primary-yellow italic text-3xl">
                                {culturePage.performingArts.folk.title}
                            </HeritageHeading>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {culturePage.performingArts.folk.list.map((item: any, idx: number) => (
                                    <MithilaCard key={idx} className="p-10 border-l-8 border-l-primary-red group hover:-translate-y-2 transition-all duration-500 shadow-premium hover:shadow-2xl">
                                        <h3 className="text-2xl font-black text-mithila-ink mb-6 font-heading group-hover:text-primary-red transition-colors uppercase tracking-tight italic">{item.name}</h3>
                                        <p className="text-lg text-text-muted leading-relaxed font-serif italic">{item.desc}</p>
                                    </MithilaCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Folklore */}
                {culturePage.folklore && (
                    <div className="py-24 border-t border-primary-red/5">
                        <HeritageHeading as="h2" className="mb-10 text-primary-red">
                            {culturePage.folklore.title}
                        </HeritageHeading>
                        <p className="text-2xl mb-16 text-text-muted leading-relaxed font-serif italic max-w-4xl">{culturePage.folklore.intro}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {culturePage.folklore.list.map((item: any, idx: number) => (
                                <MithilaCard key={idx} className="p-10 group hover:border-primary-red transition-all duration-700 bg-white/50 backdrop-blur-sm">
                                    <h3 className="text-3xl font-black text-primary-red mb-6 font-heading tracking-tighter italic uppercase">{item.name}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic mb-8 opacity-90">{item.desc}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {item.keywords && item.keywords.map((k: string, i: number) => (
                                            <span key={i} className="text-[0.65rem] font-black px-4 py-1.5 glass-morphism text-primary-red/70 uppercase tracking-widest border border-primary-red/10">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </MithilaCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Wedding Rituals */}
                {culturePage.weddingRituals && (
                    <div className="py-24 border-t border-primary-red/5">
                        <HeritageHeading as="h2" className="mb-10 text-primary-red">
                            {culturePage.weddingRituals.title}
                        </HeritageHeading>
                        <p className="text-2xl mb-16 text-text-muted leading-relaxed font-serif italic max-w-4xl">{culturePage.weddingRituals.intro}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {culturePage.weddingRituals.highlights.map((item: any, idx: number) => (
                                <MithilaCard key={idx} className="p-10 border-l-12 border-l-primary-yellow hover:bg-primary-yellow/5 transition-all duration-500 shadow-premium hover:shadow-2xl">
                                    <h3 className="text-3xl font-black text-mithila-ink mb-6 font-heading tracking-tighter italic hover:text-primary-red transition-colors origin-left cursor-default">{item.name}</h3>
                                    <p className="text-xl text-text-muted leading-relaxed font-serif italic opacity-90">{item.desc}</p>
                                </MithilaCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tirhuta Script */}
                {culturePage.language && (
                    <div className="py-24 border-t border-primary-red/5">
                        <MithilaCard variant="madhubani" className="p-12 md:p-24 bg-gradient-to-br from-primary-red/5 to-primary-yellow/5 border-primary-red/20 shadow-premium">
                            <HeritageHeading as="h2" className="mb-12 text-primary-red italic animate-pulse-slow">
                                {culturePage.language.title}
                            </HeritageHeading>
                            <div className="space-y-12 max-w-4xl">
                                <p className="text-3xl text-mithila-ink leading-tight font-heading font-black italic">
                                    {culturePage.language.intro}
                                </p>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-primary-red font-black uppercase tracking-widest text-xs">History</h4>
                                        <p className="text-xl text-text-muted font-serif italic leading-relaxed opacity-90">{culturePage.language.history}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-primary-red font-black uppercase tracking-widest text-xs">Revival</h4>
                                        <p className="text-xl text-text-muted font-serif italic leading-relaxed opacity-90">{culturePage.language.revival}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-mithila-ink uppercase tracking-widest font-black pt-8 opacity-60">
                                    {culturePage.language.note}
                                </p>
                            </div>
                        </MithilaCard>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { slugify } from '@/utils/slugify';

interface PlacesContentProps {
    placesPage: any;
}

export default function PlacesContent({ placesPage }: PlacesContentProps) {
    const params = useParams();
    const lang = params.lang as string;

    return (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
            <header className="text-center mb-16 relative header-heritage">
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-mithila-ink mb-4 font-bold tracking-tight font-heading">{placesPage.title}</h1>
                <p className="text-text-muted text-[1.25rem] max-w-[800px] mx-auto leading-relaxed font-body">{placesPage.lead}</p>
            </header>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                {placesPage.places.map((place: any, index: number) => (
                    <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col border border-border-color hover:-translate-y-2 hover:shadow-xl group relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Decorative background pattern overlay */}
                        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />

                        <div className="relative w-full h-[240px] overflow-hidden border-b-4 border-primary-yellow">
                            {place.image ? (
                                <img src={place.image} alt={place.imageAlt || place.name} className="w-full h-full object-cover transition-transform duration-700 ease group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-[4rem] opacity-80">
                                    {place.type === 'spiritual' ? '🛕' : place.type === 'historical' ? '🏰' : '🎨'}
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-red rounded-full text-[0.7rem] font-bold uppercase tracking-wider border border-primary-red/20 shadow-sm">
                                    {place.type?.toUpperCase() || 'PLACE'}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col relative z-10">
                            <h2 className="text-[1.8rem] mb-3 font-bold text-mithila-ink dark:text-white font-heading leading-tight group-hover:text-primary-red transition-colors">{place.name}</h2>
                            <p className="text-[0.9rem] text-text-muted mb-4 flex items-center gap-2 font-bold uppercase tracking-wide">
                                <span className="text-primary-red">📍</span> {place.location}
                            </p>
                            <p className="text-[1rem] leading-relaxed text-foreground/80 dark:text-gray-300 line-clamp-3 mb-6 font-body">{place.desc}</p>
                            <Link href={`/${lang}/places/${place.slug || slugify(place.name)}`} className="mt-auto inline-block text-primary-red dark:text-red-400 font-bold cursor-pointer text-[0.95rem] hover:text-red-800 transition-colors uppercase tracking-wide border-b-2 border-primary-red/20 hover:border-primary-red pb-1 self-start">
                                Read Full History →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>


            {/* Villages of Art & Wisdom */}
            {placesPage.villages && (
                <div className="mt-24">
                    <header className="text-center mb-16 relative">
                        <div className="inline-block mb-2 px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-800/50">Rural Heritage</div>
                        <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] mb-4 font-bold tracking-tight text-mithila-ink font-heading">{placesPage.villages.title}</h2>
                        <p className="text-text-muted text-[1.1rem] max-w-[800px] mx-auto leading-relaxed font-body">{placesPage.villages.lead}</p>
                    </header>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                        {placesPage.villages.list.map((village: any, index: number) => (
                            <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-md flex flex-col border border-orange-200 dark:border-orange-900/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group relative">
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />
                                <div className="p-8 flex-grow flex flex-col relative z-10">
                                    <h3 className="text-[1.5rem] mb-2 font-bold text-orange-700 dark:text-orange-400 font-heading">{village.name}</h3>
                                    <span className="text-[0.85rem] text-text-muted mb-4 flex items-center gap-2 font-bold uppercase tracking-wide">📍 {village.location}</span>
                                    <p className="text-[0.95rem] leading-relaxed text-foreground/80 mb-4 line-clamp-4">{village.desc}</p>

                                    <div className="mt-auto pt-4 border-t border-orange-100 dark:border-orange-900/20">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {village.keywords && village.keywords.map((k: string, i: number) => (
                                                <span key={i} className="text-[0.7rem] px-2 py-0.5 bg-orange-50 dark:bg-orange-900/10 rounded-sm text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30">#{k}</span>
                                            ))}
                                        </div>
                                        <Link href={`/${lang}/places/${village.slug}`} className="text-orange-600 dark:text-orange-400 font-bold text-[0.9rem] flex items-center gap-1 hover:gap-2 transition-all">
                                            View Details <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shakti Peethas */}
            {placesPage.shaktiPeethas && (
                <div className="mt-24">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-[2px] w-12 bg-primary-red/30"></div>
                        <h2 className="text-[2.5rem] font-bold text-center text-primary-red font-heading">🪔 {placesPage.shaktiPeethas.title}</h2>
                        <div className="h-[2px] w-12 bg-primary-red/30"></div>
                    </div>
                    <p className="text-center max-w-[700px] mx-auto mb-12 text-text-muted text-[1.1rem] font-body">{placesPage.shaktiPeethas.desc}</p>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                        {placesPage.shaktiPeethas.list.map((place: any, index: number) => (
                            <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col border border-madhubani group hover:shadow-xl relative">
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />
                                <div className="relative w-full h-[220px] overflow-hidden p-2 pb-0">
                                    <div className="w-full h-full rounded-t-lg overflow-hidden relative">
                                        {place.image ? (
                                            <img src={place.image} alt={place.imageAlt || place.name} className="w-full h-full object-cover transition-transform duration-500 ease group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-red-50 flex items-center justify-center text-[3rem]">🪔</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                        <h3 className="absolute bottom-4 left-4 text-[1.5rem] font-bold text-white font-heading shadow-sm">{place.name}</h3>
                                    </div>
                                </div>
                                <div className="p-6 pt-4 flex-grow flex flex-col relative z-10">
                                    <span className="text-[0.85rem] mb-4 flex items-center gap-2 text-primary-red font-bold uppercase tracking-wider border-b border-red-100 dark:border-red-900/30 pb-2">📍 {place.location}</span>
                                    <p className="text-[1rem] leading-relaxed text-foreground/80 line-clamp-3 mb-6 font-body">{place.desc}</p>
                                    <Link href={`/${lang}/places/${place.slug || slugify(place.name)}`} className="mt-auto w-full text-center py-2 rounded border border-primary-red text-primary-red font-bold text-[0.9rem] hover:bg-primary-red hover:text-white transition-all">
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Mithila Heritage */}
            <div className="mt-24">
                <header className="text-center mb-16 relative">
                    <h1 className="text-[2.5rem] mb-4 font-bold tracking-tight text-mithila-ink font-heading">{placesPage.heritage.title}</h1>
                    <p className="text-text-muted text-[1.2rem] max-w-[800px] mx-auto leading-relaxed font-body">{placesPage.heritage.lead}</p>
                </header>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                    {placesPage.heritage.sites.map((site: any, index: number) => (
                        <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col border-l-4 border-l-accent-gold border-y border-r border-border-color hover:-translate-y-2 hover:shadow-xl group">
                            <div className="relative w-full h-[220px] overflow-hidden">
                                {site.image ? (
                                    <img src={site.image} alt={site.imageAlt || site.name} className="w-full h-full object-cover transition-transform duration-600 ease group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[3.5rem]">🏛️</div>
                                )}
                            </div>
                            <div className="p-8 flex-grow flex flex-col bg-opacity-50">
                                <h2 className="text-[1.75rem] mb-3 font-bold text-mithila-ink font-heading">{site.name}</h2>
                                <p className="text-[1rem] leading-relaxed text-foreground/80 line-clamp-3 mb-6 font-body">{site.desc}</p>
                                <Link href={`/${lang}/places/${site.slug || slugify(site.name)}`} className="mt-auto inline-flex items-center gap-2 text-accent-gold font-bold hover:text-amber-700 transition-colors">
                                    Explore Heritage <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Administrative Divisions */}
            {
                placesPage.administrative && (
                    <div className="mt-24">
                        <header className="text-center mb-16 relative">
                            <h2 className="text-[2.5rem] mb-4 font-bold tracking-tight text-purple-900 dark:text-purple-300 font-heading">{placesPage.administrative.title}</h2>
                            <p className="text-text-muted text-[1.2rem] max-w-[800px] mx-auto leading-relaxed font-body">{placesPage.administrative.lead}</p>
                        </header>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                            {placesPage.administrative.list.map((div: any, index: number) => (
                                <div key={index} className="bg-card-bg rounded-xl overflow-hidden shadow-md transition-all duration-300 flex flex-col border border-purple-100 dark:border-purple-900/30 hover:-translate-y-1 hover:shadow-lg group relative">
                                    <div className="p-8 flex-grow flex flex-col">
                                        <h3 className="text-[1.75rem] mb-2 font-bold text-purple-800 dark:text-purple-400 font-heading">{div.name}</h3>
                                        <p className="font-bold text-text-muted mb-4 text-sm uppercase tracking-wider">HQ: {div.hq}</p>
                                        <p className="text-[1rem] leading-relaxed text-foreground/80 line-clamp-3 mb-6 font-body">{div.desc}</p>
                                        <div className="mt-auto bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                                            <p className="text-[0.85rem] text-text-muted mb-2 font-bold">Districts:</p>
                                            <p className="text-[0.9rem] text-purple-900 dark:text-purple-300 font-medium">{div.districts}</p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {div.keywords && div.keywords.map((k: string, i: number) => (
                                                <span key={i} className="text-[0.75rem] px-2 py-0.5 bg-card-bg border border-purple-100 dark:border-purple-800/20 rounded-sm text-purple-700 dark:text-purple-300">#{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Geography Section */}
            {
                placesPage.geography && (
                    <div className="mt-24">
                        <header className="text-center mb-16 relative">
                            <h1 className="text-[clamp(2.5rem,5vw,4rem)] mb-4 font-bold tracking-tight text-teal-800 dark:text-teal-400 font-heading">{placesPage.geography.title}</h1>
                            <p className="text-text-muted text-[1.2rem] max-w-[800px] mx-auto leading-relaxed mb-8 font-body">{placesPage.geography.intro}</p>
                            <Link href={`/${lang}/places/rivers`} className="btn btn-primary bg-teal-700 hover:bg-teal-800 border-none shadow-lg hover:shadow-xl">
                                Explore Sacred Geography Narrative →
                            </Link>
                        </header>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                            {placesPage.geography.rivers.map((river: any, idx: number) => (
                                <div key={idx} className="bg-card-bg rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col border-b-4 border-b-teal-500 hover:-translate-y-2 hover:shadow-xl group relative">
                                    <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />
                                    <div className="relative w-full h-[200px] overflow-hidden">
                                        {river.image ? (
                                            <img src={river.image} alt={river.imageAlt || river.name} className="w-full h-full object-cover transition-transform duration-600 ease group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[3rem]">🌊</div>
                                        )}
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col relative z-10">
                                        <h3 className="text-[1.5rem] font-bold mb-3 text-teal-800 dark:text-teal-400 font-heading">{river.name}</h3>
                                        <p className="text-[1rem] leading-relaxed text-foreground/80 line-clamp-3 mb-6 font-body">{river.desc}</p>
                                        <Link href={`/${lang}/places/rivers`} className="mt-auto text-teal-700 dark:text-teal-300 font-bold cursor-pointer text-[0.95rem] hover:underline flex items-center gap-2">
                                            Read Narrative →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ponds Spotlight */}
                        {placesPage.geography.ponds && (
                            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/40 dark:to-emerald-900/40 p-8 md:p-14 rounded-2xl border border-teal-100 dark:border-teal-800/30 mt-16 flex flex-col lg:flex-row gap-12 items-center shadow-inner">
                                <div className="lg:flex-1 w-full text-center lg:text-left">
                                    <h2 className="text-teal-900 dark:text-teal-200 text-[2.2rem] mb-6 font-bold font-heading">💧 {placesPage.geography.ponds.title}</h2>
                                    <p className="text-teal-800 dark:text-teal-100 leading-relaxed text-[1.1rem] font-body">{placesPage.geography.ponds.desc}</p>
                                </div>
                                {placesPage.geography.ponds.image && (
                                    <img
                                        src={placesPage.geography.ponds.image}
                                        alt={placesPage.geography.ponds.imageAlt || "Mithila Ponds"}
                                        className="rounded-xl shadow-xl w-full lg:w-1/2 object-cover max-h-[400px] border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
}

import { getDictionary } from '@/get-dictionary';
import DailyWord from '@/components/DailyWord';
import TirhutaDrawingPad from '@/components/TirhutaDrawingPad';
import { getCollectionData } from '@/lib/data-service';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    return {
        title: dict.learningPage.title,
        description: dict.learningPage.description,
    };
}

export default async function LearningPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const { learningPage } = dict;
    const literatureItems = await getCollectionData<any>('literature');

    // Combine vowels and consonants for practice list
    const allCharacters = [
        ...learningPage.script.vowels,
        ...learningPage.script.consonants
    ];

    return (
        <div className="container section-padding">
            <header className="text-center mb-16">
                <h1 className="text-[3rem] mb-4 font-bold font-heading leading-tight">{learningPage.title}</h1>
                <p className="text-[1.2rem] text-foreground dark:text-gray-300 max-w-[700px] mx-auto leading-relaxed opacity-90">
                    {learningPage.description}
                </p>
            </header>

            {/* Featured Literature & Learning Modules */}
            {literatureItems.length > 0 && (
                <section className="mb-24">
                    <h2 className="text-[2.5rem] text-center mb-12 font-bold font-heading text-mithila-ink dark:text-white">New in 2026: Literature & Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {literatureItems.map((item: any) => {
                            const localeData = item.locales[lang] || item.locales['en'];
                            return (
                                <Link key={item.slug} href={`/${lang}/learning/${item.slug}`} className="group bg-paper-texture dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-primary-yellow/20 hover:border-primary-yellow transition-all duration-300 flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={item.image} alt={localeData.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-4 left-6">
                                            <span className="bg-primary-red text-white text-[0.65rem] font-bold px-2 py-1 rounded uppercase tracking-widest">{item.category}</span>
                                            <h3 className="text-white text-xl font-bold mt-1">{localeData.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 italic">
                                            "{localeData.description}"
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">By {localeData.author}</span>
                                            <div className="text-primary-red font-bold text-sm group-hover:translate-x-1 transition-transform">Explore Details →</div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Daily Word Section */}
            <DailyWord title={learningPage.dailyWordTitle} words={learningPage.dailyWords} />

            {/* Tirhuta Script Section */}
            <section className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-[2.5rem] text-[#8e44ad] dark:text-purple-400 mb-4 font-bold font-heading leading-tight">{learningPage.script.title}</h2>
                    <p className="text-[1.1rem] text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto leading-relaxed">
                        {learningPage.script.desc}
                    </p>
                </div>

                {/* Interactive Drawing Pad */}
                <TirhutaDrawingPad lang={lang} characters={allCharacters} />

                <div className="mt-16 p-8 md:p-12 bg-white dark:bg-card-bg rounded-2xl mb-8 border border-border-color dark:border-zinc-800 shadow-sm animate-in fade-in">
                    <h3 className="text-center mb-8 text-[#d35400] dark:text-orange-400 text-xl font-bold font-heading">Vowels (Sawar Varna)</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-6">
                        {learningPage.script.vowels.map((char: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl text-center transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30">
                                <div className="text-[3rem] mb-2 text-foreground font-heading leading-none">{char.char}</div>
                                <div className="text-[1.2rem] font-bold text-gray-900 dark:text-gray-100 leading-tight">{char.sound}</div>
                                <div className="text-gray-400 dark:text-gray-500 text-[0.85rem] mt-1 font-medium">({char.devanagari})</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 md:p-12 bg-white dark:bg-card-bg rounded-2xl border border-border-color dark:border-zinc-800 shadow-sm animate-in fade-in">
                    <h3 className="text-center mb-8 text-[#16a085] dark:text-teal-400 text-xl font-bold font-heading">Consonants (Vyanjan Varna)</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-6">
                        {learningPage.script.consonants.map((char: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl text-center transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md border border-transparent hover:border-teal-100 dark:hover:border-teal-900/30">
                                <div className="text-[3rem] mb-2 text-foreground font-heading leading-none">{char.char}</div>
                                <div className="text-[1.2rem] font-bold text-gray-900 dark:text-gray-100 leading-tight">{char.sound}</div>
                                <div className="text-gray-400 dark:text-gray-500 text-[0.85rem] mt-1 font-medium">({char.devanagari})</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-8 text-gray-400 italic text-sm">* Representative list. Tirhuta has a full set of consonants similar to Devanagari.</p>
                </div>
            </section>

            {/* Phrasebook Section */}
            <section className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-[2.5rem] text-[#c0392b] dark:text-red-400 mb-4 font-bold font-heading">{learningPage.phrases.title}</h2>
                </div>

                <div className="grid gap-12">
                    {learningPage.phrases.categories.map((cat: any, idx: number) => (
                        <div key={idx} className="bg-card-bg border border-border-color dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-[#c0392b] text-white px-8 py-4">
                                <h3 className="m-0 text-[1.5rem] font-bold font-heading">{cat.name}</h3>
                            </div>
                            <div className="p-8">
                                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 font-bold pb-4 border-b-2 border-border-color dark:border-zinc-800 text-gray-900 dark:text-gray-100 uppercase text-[0.75rem] tracking-widest">
                                    <div>Maithili</div>
                                    <div>Translation</div>
                                    <div className="italic">Context</div>
                                </div>
                                {cat.list.map((phrase: any, pIdx: number) => (
                                    <div key={pIdx} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr] gap-4 py-6 border-b border-border-color dark:border-zinc-800 last:border-0 items-center">
                                        <div className="text-[1.2rem] text-foreground font-bold leading-snug">{phrase.mai}</div>
                                        <div className="text-[1.1rem] opacity-90 font-medium">{phrase.trans}</div>
                                        <div className="text-gray-400 italic text-[0.95rem]">{phrase.context}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

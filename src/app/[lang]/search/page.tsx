
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';
import { searchContent } from '@/lib/search/search-service';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata = {
    title: 'Search | Mithilawasi',
    description: 'Search across stories, recipes, songs, and personalities of Mithila.',
};

export default async function SearchPage({ params, searchParams }: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ q: string }>
}) {
    const { lang } = await params;
    const { q } = await searchParams;

    // Type needs searchContent second arg to be specific
    const typedLang = (['en', 'hi', 'mai'].includes(lang) ? lang : 'en') as 'en' | 'hi' | 'mai';
    const results = await searchContent(q || '', typedLang);

    const searchSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://mithilawasi.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: `https://mithilawasi.com/${lang}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <JsonLd override={true} data={searchSchema} />
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Search Bar on Page */}
                <div className="bg-card-bg p-2 rounded-2xl shadow-lg border-2 border-mithila-gold/30 flex items-center transition-all focus-within:border-mithila-red ring-offset-4 focus-within:ring-2 focus-within:ring-mithila-red/20">
                    <form action={`/${lang}/search`} className="flex-1 flex items-center">
                        <span className="pl-4 text-2xl text-mithila-gold">🔍</span>
                        <input
                            type="text"
                            name="q"
                            defaultValue={q || ''}
                            placeholder="Explore Mithila's treasure..."
                            className="w-full p-4 text-xl bg-transparent outline-none font-serif text-foreground placeholder:text-text-muted"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-mithila-red text-white px-8 py-3 rounded-xl font-bold hover:bg-mithila-red/90 transition-colors shadow-md mr-1"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <HeritageHeading center as="h1">
                        Search Results
                    </HeritageHeading>
                    {q && (
                        <p className="text-center text-lg text-mithila-gold font-serif italic">
                            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{q}"
                        </p>
                    )}
                </div>

                <div className="min-h-[400px]">
                    {results.length === 0 ? (
                        <div className="bg-card-bg/50 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-mithila-gold/30 space-y-8">
                            <div className="space-y-2">
                                <p className="text-2xl font-serif text-text-muted">
                                    {q ? `No results found for "${q}"` : 'Your journey starts here.'}
                                </p>
                                <p className="text-text-muted/80">Try a different keyword or explore popular categories below.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
                                {[
                                    { label: 'Folklore', href: `/${lang}/folklore`, color: 'bg-mithila-red' },
                                    { label: 'Recipes', href: `/${lang}/food`, color: 'bg-mithila-gold' },
                                    { label: 'Songs', href: `/${lang}/culture`, color: 'bg-blue-600' },
                                    { label: 'Places', href: `/${lang}/places`, color: 'bg-green-700' }
                                ].map((cat) => (
                                    <Link
                                        key={cat.label}
                                        href={cat.href}
                                        className="p-4 rounded-xl bg-card-bg border border-border-color shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center group"
                                    >
                                        <div className={`w-10 h-10 rounded-full ${cat.color} mx-auto mb-2 opacity-10 group-hover:opacity-100 transition-opacity`}></div>
                                        <span className="font-bold text-foreground group-hover:text-mithila-red">{cat.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {results.map((result, idx) => (
                                <Link
                                    href={result.url}
                                    key={idx}
                                    className="block group bg-card-bg p-6 rounded-2xl border border-mithila-gold/10 shadow-sm hover:shadow-xl hover:border-mithila-red/30 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-mithila-red text-white">
                                                    {result.type}
                                                </span>
                                                {result.url.includes('/blog') && (
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-mithila-gold"></span>
                                                        Editorial
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-mithila-red transition-colors leading-tight">
                                                {result.title}
                                            </h3>
                                            <p className="text-text-muted line-clamp-2 font-serif italic text-lg opacity-80 leading-relaxed">
                                                {result.description}
                                            </p>
                                            <div className="pt-2 flex items-center gap-2 text-mithila-red font-bold text-sm">
                                                <span>Read more</span>
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

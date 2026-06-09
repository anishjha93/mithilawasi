import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { getAllModernPosts } from '@/data/modern-mithila';
import ShareStorySection from '@/components/ShareStorySection';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    return {
        title: dict.navigation['modern-mithila'] || "Modern Mithila",
        description: "News, Art, and Innovation from the new Mithila.",
    };
}

export default async function ModernMithilaPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    // Fetch dynamic posts
    const posts = await getAllModernPosts();
    const publishedPosts = posts.filter(p => p.published);

    // Fallback static labels
    const pageTitle = dict.navigation['modern-mithila'] || "Modern Mithila";
    const pageLead = "Exploring the intersection of tradition and modernity in Mithila.";

    return (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
            <header className="text-center mb-16 relative header-heritage">
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-mithila-ink mb-4 font-bold tracking-tight font-heading">{pageTitle}</h1>
                <p className="text-[1.25rem] text-gray-600 max-w-[800px] mx-auto leading-relaxed font-body">{pageLead}</p>
            </header>

            {publishedPosts.length === 0 ? (
                <div className="text-center py-20 bg-paper-texture rounded-2xl border border-dashed border-mithila-ink/20 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />
                    <p className="text-[1.5rem] text-mithila-ink font-heading mb-2">Coming Soon...</p>
                    <p className="text-gray-500 font-body">No updates published yet. Stay tuned for stories of innovation.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {publishedPosts.map((post) => {
                        // Resolve locale data
                        const localeData = post.locales[lang] || post.locales['en'];
                        if (!localeData) return null;

                        return (
                            <Link
                                key={post.slug}
                                href={`/${lang}/modern-mithila/${post.slug}`}
                                className="group bg-paper-texture rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-primary-red transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col relative animate-fade-in-up"
                            >
                                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />

                                <div className="aspect-video w-full overflow-hidden relative border-b-4 border-primary-yellow">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.image}
                                        alt={localeData.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[0.7rem] font-bold text-primary-red uppercase tracking-wider shadow-sm border border-primary-red/20">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span>{new Date(post.date).toLocaleDateString(lang)}</span>
                                        <span className="w-1 h-1 rounded-full bg-primary-red/40" />
                                        <span className="text-primary-red">{localeData.author}</span>
                                    </div>
                                    <h3 className="text-[1.75rem] font-bold text-mithila-ink mb-3 leading-tight group-hover:text-primary-red transition-colors font-heading">
                                        {localeData.title}
                                    </h3>
                                    <p className="text-[1rem] leading-relaxed text-gray-700 line-clamp-3 mb-6 flex-1 font-body">
                                        {localeData.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center text-primary-red font-bold text-sm tracking-wide group-hover:gap-2 transition-all uppercase">
                                        Explore Story <span>&rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <div className="mt-24">
                <ShareStorySection dictionary={dict} />
            </div>
        </div>
    );
}

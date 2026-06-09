import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { getBlogPosts } from '@/lib/blogs';
import type { Metadata } from 'next';
import BlogCard from '@/components/blog/BlogCard';
import NewsLetterCTA from '@/components/blog/NewsLetterCTA';
import { estimateReadingTime } from '@/utils/readingTime';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/blog`;

    return {
        title: `${dict.blogPage.title} | Mithilawasi`,
        description: dict.blogPage.subtitle,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/blog`,
                'hi-IN': `${baseUrl}/hi/blog`,
                'mai-IN': `${baseUrl}/mai/blog`,
                'x-default': `${baseUrl}/en/blog`,
            },
        },
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';

    const dict = await getDictionary(lang);
    const { blogPage } = dict;

    const allPosts = await getBlogPosts(lang);
    const featuredPost = allPosts[0];
    const otherPosts = allPosts.slice(1);

    return (
        <div className="bg-paper-white dark:bg-background min-h-screen">
            <header className="py-20 bg-gradient-to-b from-white to-red-50/30 dark:from-background dark:to-red-900/10">
                <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <h1 className="text-[3rem] md:text-[4.5rem] font-serif font-black text-mithila-ink leading-[1.1] mb-6">
                            {blogPage.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted font-medium leading-relaxed">
                            {blogPage.subtitle}
                        </p>
                    </div>
                </div>
            </header>

            <main className="container px-4 md:px-8 max-w-7xl mx-auto pb-32">
                {allPosts.length === 0 ? (
                    <div className="text-center py-32 bg-card-bg rounded-[3rem] border border-dashed border-border-color">
                        <div className="text-6xl mb-6">🖋️</div>
                        <h2 className="text-2xl font-bold text-mithila-ink mb-2">No stories yet</h2>
                        <p className="text-text-muted">We're sharpening our pens. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                        {allPosts.map((post) => (
                            <BlogCard
                                key={post.slug}
                                post={post}
                                lang={lang}
                                readMoreLabel={blogPage.readMore}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Newsletter Section */}
            <NewsLetterCTA />

        </div >
    );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getBlogPost, getBlogPosts } from '@/lib/blogs';
import { marked } from 'marked';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import BlogCard from '@/components/blog/BlogCard';

import TableOfContents from '@/components/blog/TableOfContents';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import NewsLetterCTA from '@/components/blog/NewsLetterCTA';
import ArticleFeedback from '@/components/blog/ArticleFeedback';
import { estimateReadingTime } from '@/utils/readingTime';
import { Tag } from 'lucide-react';
import { FAQSection } from '@/components/ui/heritage/FAQSection';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const post = await getBlogPost(slug, lang);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/blog/${slug}`;

    return {
        title: `${post.title} | Mithilawasi`,
        description: post.excerpt,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/blog/${slug}`,
                'hi-IN': `${baseUrl}/hi/blog/${slug}`,
                'mai-IN': `${baseUrl}/mai/blog/${slug}`,
                'x-default': `${baseUrl}/en/blog/${slug}`,
            },
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            url: canonicalUrl,
            images: [
                {
                    url: post.image || 'https://cdn.mithilawasi.com/hero-bg.webp',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { blogPage, navigation } = dict;

    const post = await getBlogPost(slug, lang);

    if (!post) {
        notFound();
    }

    const allPosts = await getBlogPosts(lang);
    const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 2);
    const readingTime = estimateReadingTime(post.title, post.content);

    // Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image || `https://cdn.mithilawasi.com/hero-bg.webp`,
        author: { '@type': 'Person', name: post.author },
        datePublished: post.date,
    };

    return (
        <div className="bg-paper-white dark:bg-background min-h-screen pt-24 pb-20 overflow-x-hidden">
            <ReadingProgressBar />
            <JsonLd override={true} data={articleSchema} />

            <article className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href={`/${lang}/blog`}
                    className="inline-flex items-center gap-2 text-text-muted hover:text-primary-red font-bold mb-6 md:mb-10 transition-colors group uppercase tracking-widest text-[0.7rem]"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> {blogPage.back}
                </Link>

                <Breadcrumbs
                    lang={lang}
                    items={[
                        { label: navigation.blog, href: `/${lang}/blog` },
                        { label: post.title }
                    ]}
                />

                <header className="mb-10 md:mb-16">
                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8 text-xs font-bold font-body uppercase tracking-widest">
                        <span className="px-4 py-1 bg-primary-red text-white rounded-full shadow-sm">
                            {dict.blogPage.category || 'Heritage'}
                        </span>
                        {["History", "Culture"].map((tag, i) => (
                            <span key={i} className="text-text-muted opacity-60">#{tag}</span>
                        ))}
                        <span className="text-border-color/40">/</span>
                        <div className="flex items-center gap-1.5 text-text-muted">
                            <Tag size={14} className="text-primary-red" /> {readingTime} {dict.blogPage.minRead}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-mithila-ink mb-8 md:mb-10 leading-[1.15] tracking-tight">
                        {post.title}
                    </h1>

                    {/* Author Bar with Share */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-primary-red/10">
                        <div className="flex items-center gap-5 group cursor-pointer">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-red/5 flex items-center justify-center text-primary-red text-2xl font-heading font-black border-2 border-primary-red/20 shadow-inner">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-mithila-ink text-base md:text-lg group-hover:text-primary-red transition-colors font-heading leading-tight">
                                    {post.author}
                                </p>
                                <p className="text-xs text-text-muted font-bold font-body uppercase tracking-widest mt-1">
                                    Mithila Heritage Expert
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 text-text-muted font-body">
                            <div className="flex flex-col items-end">
                                <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Published</span>
                                <span className="text-mithila-ink font-bold text-sm md:text-base">
                                    {new Date(post.date).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-[2.5rem] overflow-hidden mb-12 md:mb-20 shadow-2xl relative aspect-video w-full max-h-[600px]">
                    <img
                        src={post.image || 'https://cdn.mithilawasi.com/hero-bg.webp'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Layout - 2 Columns on Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Main Content */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <div className="blog-content prose prose-slate dark:prose-invert prose-base md:prose-lg max-w-none mb-12 md:mb-24
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-mithila-ink
                            prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:font-body
                            prose-a:text-primary-red prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-[2rem] prose-img:shadow-2xl
                            prose-blockquote:border-l-[6px] prose-blockquote:border-primary-red prose-blockquote:bg-primary-red/5 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-r-[2rem] prose-blockquote:not-italic prose-blockquote:font-heading prose-blockquote:text-xl prose-blockquote:font-medium
                        ">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: marked.parse(post.content
                                        .replace(/^\s*<ExternalImage\s+url="([^"]+)"\s*\/>/, (match, url) => {
                                            return url === post.image ? '' : match;
                                        })
                                        .replace(/<Spacer\s+height={?(?:"|')?([^}\s"'>]+)(?:"|'|})?\s*\/?>/g, '<div style="height: $1"></div>')
                                        .replace(/<ExternalImage\s+url="([^"]+)"\s*(?:alt="([^"]+)")?\s*\/>/g, '<figure class="my-12"><img src="$1" alt="$2" class="max-w-full h-auto rounded-[2rem] block mx-auto shadow-2xl border border-primary-red/5" />$2 ? <figcaption class="text-center text-text-muted text-sm mt-6 font-medium italic opacity-60">$2</figcaption> : ""</figure>')
                                        .replace(/\n\s*\n\s*\n+/g, (match: string) => {
                                            const count = match.split('\n').length - 2;
                                            return `\n\n<div style="height: ${count * 24}px"></div>\n\n`;
                                        })
                                    ) as string
                                }}
                            />
                        </div>

                        {/* FAQ Section (Expandable) */}
                        <div className="border-t border-primary-red/10 pt-12">
                            <FAQSection 
                                title={dict.blogPage.faqTitle || "Key Insights & Questions"}
                                items={[
                                    { 
                                        question: `What is the significance of this ${dict.blogPage.category || 'heritage'} topic?`, 
                                        answer: post.excerpt 
                                    },
                                    { 
                                        question: "How can I learn more about Mithila culture?", 
                                        answer: "You can explore our 'Learning' section or visit the 'Art' and 'Folklore' pages to dive deeper into our traditions." 
                                    }
                                ]} 
                            />
                        </div>

                        {/* Feedback Box */}
                        <div className="mt-12">
                            <ArticleFeedback
                                title={post.title}
                                url={`https://mithilawasi.com/${lang}/blog/${post.slug}`}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 order-1 lg:order-2 space-y-12">
                        {/* Sticky TOC */}
                        <div className="sticky top-32">
                            <TableOfContents title={dict.blogPage.toc || "On this page"} />
                            
                            {/* Sidebar Widget: Related Heritage */}
                            <div className="mt-12 p-8 rounded-3xl bg-primary-red/5 border border-primary-red/10 group">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary-red mb-4 font-body">
                                    Related Heritage
                                </h4>
                                <ul className="space-y-4">
                                    {relatedPosts.map((p) => (
                                        <li key={p.slug} className="group/item">
                                            <Link href={`/${lang}/blog/${p.slug}`} className="block">
                                                <p className="font-heading font-bold text-mithila-ink group-hover/item:text-primary-red transition-colors line-clamp-2">
                                                    {p.title}
                                                </p>
                                                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{new Date(p.date).toLocaleDateString(lang, { month: 'short', year: 'numeric' })}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bottom Related Section */}
                {relatedPosts.length > 0 && (
                    <div className="pt-16 border-t border-border-color mt-20">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-mithila-ink font-heading">
                                {dict.blogPage.moreStories || 'Read another story'}
                            </h2>
                            <Link
                                href={`/${lang}/blog`}
                                className="text-primary-red font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm font-body uppercase tracking-wider"
                            >
                                View All <span className="text-lg">→</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {relatedPosts.map((p) => (
                                <BlogCard
                                    key={p.slug}
                                    post={p}
                                    lang={lang}
                                    readMoreLabel={blogPage.readMore}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}

// Generate static params for all known posts in all languages
export async function generateStaticParams() {
    const langs = ['en', 'hi', 'mai'];
    const params = [];

    for (const lang of langs) {
        const posts = await getBlogPosts(lang);
        for (const post of posts) {
            params.push({ lang, slug: post.slug });
        }
    }

    return params;
}

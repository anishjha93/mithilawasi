import { getModernPostBySlug } from '@/data/modern-mithila';
import { getDictionary } from '@/get-dictionary';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const post = await getModernPostBySlug(slug);

    if (!post) {
        return {
            title: 'Not Found',
        };
    }

    const localeData = post.locales[lang as 'en' | 'hi' | 'mai'] || post.locales['en'];

    return {
        title: localeData.title,
        description: localeData.excerpt,
        openGraph: {
            title: localeData.title,
            description: localeData.excerpt,
            images: [post.image],
        },
    };
}

export default async function ModernPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const post = await getModernPostBySlug(slug);

    if (!post || !post.published) {
        notFound();
    }

    const localeData = post.locales[lang as 'en' | 'hi' | 'mai'] || post.locales['en'];
    const dict = await getDictionary(lang as any);

    return (
        <article className="max-w-[800px] mx-auto px-6 py-16">
            <Link
                href={`/${lang}/modern-mithila`}
                className="inline-flex items-center text-gray-500 hover:text-[#a01c29] mb-8 font-bold text-sm transition-colors"
            >
                &larr; {dict.navigation['modern-mithila'] || "Back to Modern Mithila"}
            </Link>

            <header className="mb-12">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                    <span className="text-[#a01c29]">{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{new Date(post.date).toLocaleDateString(lang)}</span>
                </div>

                <h1 className="text-[2.5rem] md:text-[3.5rem] font-extrabold text-[#2c3e50] leading-tight mb-8 font-serif">
                    {localeData.title}
                </h1>

                <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{localeData.author}</span>
                        <span className="text-xs text-gray-500">Author</span>
                    </div>
                </div>
            </header>

            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={post.image}
                    alt={localeData.title}
                    className="w-full h-auto object-cover"
                />
            </div>

            <div className="prose prose-lg prose-red max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed">
                <MarkdownRenderer>{localeData.content}</MarkdownRenderer>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wide">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}

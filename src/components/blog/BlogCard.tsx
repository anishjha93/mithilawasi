import Link from 'next/link';
import { estimateReadingTime } from '@/utils/readingTime';

interface BlogCardProps {
    post: {
        slug: string;
        title: string;
        excerpt: string;
        date: string;
        author: string;
        image?: string;
        content?: string;
    };
    lang: string;
    readMoreLabel: string;
}

export default function BlogCard({ post, lang, readMoreLabel }: BlogCardProps) {
    const readingTime = estimateReadingTime(post.title, post.content || post.excerpt || '');

    return (
        <Link
            href={`/${lang}/blog/${post.slug}`}
            className="group flex flex-col bg-white dark:bg-card-bg rounded-[2rem] border border-primary-red/5 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 overflow-hidden relative"
        >
            {/* Gloss Highlight Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

            {post.image && (
                <div className="aspect-video overflow-hidden relative">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category or Date Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest shadow-sm">
                            {new Date(post.date).toLocaleDateString(lang, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-8 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-body">
                        <span>{post.author}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-600" />
                        <span className="text-red-800/60 dark:text-red-400/60">{readingTime} min read</span>
                    </div>
                </div>

                <h3 className="text-lg md:text-2xl font-heading font-bold text-[var(--color-text-main)] mb-2 md:mb-4 leading-tight group-hover:text-primary-red transition-colors duration-300 line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 opacity-90 font-body">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-primary-red/5">
                    <span className="text-sm font-bold text-primary-red flex items-center gap-2 group/btn font-body uppercase tracking-wider">
                        {readMoreLabel}
                        <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </span>

                    <div className="w-8 h-8 rounded-full bg-[var(--color-gray-soft)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-sm">🪷</span>
                    </div>
                </div>
            </div>

            {/* Border Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-red via-primary-yellow to-primary-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </Link>
    );
}

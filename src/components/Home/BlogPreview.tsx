import Link from 'next/link';

export default function BlogPreview({ dict, lang }: { dict: any; lang: string }) {
    // Get the first 3 posts
    const posts = dict.posts.slice(0, 3);

    return (
        <section className="section-padding bg-gray-50">
            <div className="container">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-[#d35400] text-[0.9rem] font-bold uppercase tracking-wider block mb-2">Latest Updates</span>
                        <h2 className="text-[2.5rem] font-bold font-heading m-0 text-[#2c3e50]">From the Chronicles</h2>
                    </div>
                    <Link href={`/${lang}/blog`} className="btn btn-outline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                    {posts.map((post: any, idx: number) => (
                        <Link key={idx} href={`/${lang}/blog/${post.slug}`} className="card-hover block h-full">
                            <div className="bg-white rounded-xl overflow-hidden h-full shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md">
                                <div className="h-[200px] bg-gray-200 bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url(${post.image || 'https://cdn.mithilawasi.com/hero-bg.webp'})` }} />
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="text-[0.85rem] text-gray-400 mb-2 font-medium">{post.date}</div>
                                    <h3 className="text-[1.2rem] mb-3 leading-snug font-bold font-heading text-[#2c3e50]">{post.title}</h3>
                                    <p className="text-[0.95rem] text-gray-600 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

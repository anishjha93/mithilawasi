import Link from 'next/link';

export default function FeaturedSection({ lang }: { lang: string }) {
    const categories = [
        {
            title: 'Madhubani Art',
            image: 'https://cdn.mithilawasi.com/art-card.webp',
            link: `/${lang}/art`,
            desc: 'The world-renowned folk art.'
        },
        {
            title: 'Culture & Music',
            image: 'https://cdn.mithilawasi.com/culture-card.webp',
            link: `/${lang}/culture`,
            desc: 'Traditions, festivals, and songs.'
        },
        {
            title: 'Historical Sites',
            image: 'https://cdn.mithilawasi.com/history-card.webp',
            link: `/${lang}/places`,
            desc: 'Temples and ancient ruins.'
        },
        {
            title: 'Cuisine of Mithila',
            image: 'https://cdn.mithilawasi.com/food-card.webp',
            link: `/${lang}/food`,
            desc: 'Flavors from the heart.'
        }
    ];

    return (
        <section className="section-padding bg-white">
            <div className="container">
                <div className="text-center mb-12">
                    <span className="text-[#d35400] text-[0.9rem] font-bold uppercase tracking-wider block mb-2">Explore</span>
                    <h2 className="text-[2.5rem] font-bold font-heading m-0 text-[#2c3e50]">The Essence of Mithila</h2>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
                    {categories.map((cat, idx) => (
                        <Link key={idx} href={cat.link} className="card-hover block h-full">
                            <div className="bg-[#fdfdf8] rounded-xl overflow-hidden h-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col">
                                <div className="h-[250px] overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[1.25rem] mb-2 font-bold font-heading text-[#2c3e50]">{cat.title}</h3>
                                    <p className="text-gray-600 text-[0.95rem] leading-relaxed">{cat.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import React from 'react';
import Link from 'next/link';

interface FeaturedItem {
    title: string;
    description: string;
    link: string;
    category: string;
    emoji: string;
}

interface FeaturedContentProps {
    lang: string;
    dict: {
        title: string;
        learnMore: string;
    };
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ lang, dict }) => {
    const featuredItems: FeaturedItem[] = [
        {
            title: lang === 'mai' ? 'कोहबर - पवित्र विवाह कला' : 'Kohbar - Sacred Wedding Art',
            description: lang === 'mai'
                ? 'विवाह कक्ष कें सजावय लेल जटिल चित्रकला, जे उर्वरता आ समृद्धि क प्रतीक अछि।'
                : 'Intricate paintings adorning the bridal chamber, symbolizing fertility and prosperity.',
            link: `/${lang}/art`,
            category: lang === 'mai' ? 'कला' : 'Art',
            emoji: '🎨'
        },
        {
            title: lang === 'mai' ? 'छठि पूजा - महापर्व' : 'Chhath Puja - The Mahaparva',
            description: lang === 'mai'
                ? 'सूर्य आ छठी मैया कें समर्पित मिथिलाक सभसँ पैघ पावनि।'
                : 'Mithila\'s grandest festival dedicated to the Sun God and Chhathi Maiya.',
            link: `/${lang}/culture`,
            category: lang === 'mai' ? 'संस्कृति' : 'Culture',
            emoji: '🌅'
        },
        {
            title: lang === 'mai' ? 'मखान - मिथिलाक सुपरफूड' : 'Makhana - Mithila\'s Superfood',
            description: lang === 'mai'
                ? 'मिथिला दुनियाक 90% मखान उत्पादन करैत अछि।'
                : 'Mithila produces 90% of the world\'s Makhana, a nutritious superfood.',
            link: `/${lang}/food`,
            category: lang === 'mai' ? 'खान-पान' : 'Food',
            emoji: '🌾'
        },
        {
            title: lang === 'mai' ? 'विद्यापति - मैथिल कवि कोकिल' : 'Vidyapati - The Maithil Kokil',
            description: lang === 'mai'
                ? '600 वर्ष सँ मिथिलाक कण-कण मे बसल हुनकर गीत।'
                : 'His songs have echoed through Mithila for 600 years.',
            link: `/${lang}/blog/vidyapati-maithil-kokil`,
            category: lang === 'mai' ? 'ब्लॉग' : 'Blog',
            emoji: '📖'
        }
    ];

    return (
        <div className="py-12 my-8">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-12 flex items-center justify-center gap-3 header-heritage">
                <span className="text-4xl md:text-[2.5rem]">⭐</span>
                {dict.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.link}
                        className="group bg-card-bg border border-border-color rounded-2xl p-6 md:p-8 no-underline text-inherit transition-all duration-400 relative overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-xl hover:border-primary-yellow"
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-red via-primary-yellow to-accent-gold scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100"></div>

                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{item.emoji}</div>
                        <div className="text-[0.85rem] font-bold uppercase tracking-[1.5px] text-primary-yellow mb-3">{item.category}</div>
                        <h3 className="text-[1.35rem] font-bold text-foreground mb-4 font-heading leading-tight">{item.title}</h3>
                        <p className="text-base leading-relaxed text-foreground/80 mb-6 flex-grow">{item.description}</p>
                        <span className="text-[0.95rem] font-semibold text-primary-red transition-all duration-300 inline-block group-hover:translate-x-1 group-hover:text-primary-yellow">
                            {dict.learnMore} →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeaturedContent;

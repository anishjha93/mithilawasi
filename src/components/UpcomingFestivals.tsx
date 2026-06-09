'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarPlus } from 'lucide-react';
import { downloadFestivalICS } from '@/utils/icsGenerator';

interface Festival {
    date: string;
    name: string;
    desc: string;
    slug?: string;
}

interface UpcomingFestivalsProps {
    lang: string;
    dict: {
        title: string;
        viewAll: string;
    };
    festivals: Festival[];
}

const UpcomingFestivals: React.FC<UpcomingFestivalsProps> = ({ lang, dict, festivals }) => {
    // Get today's date (reset to start of day for accurate comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter and get next 4 upcoming festivals
    const upcomingFestivals = festivals
        .filter(festival => {
            const festivalDate = new Date(festival.date);
            festivalDate.setHours(0, 0, 0, 0);
            return festivalDate >= today;
        })
        .slice(0, 4)
        .map(festival => {
            const festivalDate = new Date(festival.date);
            festivalDate.setHours(0, 0, 0, 0);

            // Calculate difference in days
            const diffTime = festivalDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                ...festival,
                isHighlighted: diffDays <= 5 && diffDays >= 0
            };
        });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'mai' ? 'mai-IN' : 'en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="py-6 md:py-8 my-6 md:my-8 text-foreground">
            <div className="flex justify-between items-center mb-6 gap-2">
                <h2 className="font-heading text-[1.5rem] md:text-[2rem] text-foreground flex items-center gap-2 m-0 leading-none">
                    <span className="text-[1.75rem] md:text-[2.5rem]">🎉</span>
                    {dict.title}
                </h2>
                <Link href={`/${lang}/calendar`} className="text-accent-gold no-underline font-bold text-sm md:text-base transition-all duration-300 hover:text-[#ff9900] shrink-0">
                    {dict.viewAll} →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {upcomingFestivals.map((festival, index) => (
                    <Link
                        key={index}
                        href={`/${lang}/calendar/festivals/${festival.slug || ''}`}
                        className={`bg-card-bg border border-border-color dark:bg-white/5 dark:border-white/20 rounded-xl p-4 md:p-6 transition-all duration-300 relative overflow-hidden no-underline flex flex-col group before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-[#ff4d4d] before:to-[#ff9900] hover:-translate-y-1 hover:shadow-xl hover:border-[#ff9900] dark:hover:border-[#ff9900] ${festival.isHighlighted
                            ? 'bg-gradient-to-br from-card-bg to-orange-400/5 border-accent-gold shadow-[0_4px_15px_rgba(255,153,0,0.1)] before:w-1.5 dark:border-accent-gold'
                            : ''
                            }`}
                    >
                        <div className="text-[0.75rem] md:text-[0.9rem] font-bold text-[#ff4d4d] uppercase tracking-widest mb-2 flex justify-between items-center w-full z-10">
                            <span>{formatDate(festival.date)}</span>
                            <div className="flex items-center gap-2">
                                {festival.isHighlighted && (
                                    <span className="bg-[#ff4d4d] text-white text-[0.65rem] px-1.5 py-0.5 rounded animate-pulse">
                                        {lang === 'hi' ? 'शीघ्र' : lang === 'mai' ? 'शीघ्र' : 'Soon'}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    className="p-1 bg-transparent border-0 text-gray-400 hover:text-accent-gold transition-colors cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        downloadFestivalICS(festival.name, festival.date, festival.desc);
                                    }}
                                    title="Download .ics Calendar File"
                                >
                                    <CalendarPlus size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg md:text-[1.25rem] font-bold text-foreground mb-1.5 font-heading leading-tight">{festival.name}</h3>
                        <p className="text-[0.8rem] md:text-[0.95rem] leading-snug text-foreground opacity-80 mb-3 flex-grow line-clamp-2 md:line-clamp-none">{festival.desc}</p>
                        <span className="text-[0.75rem] md:text-[0.85rem] font-bold text-accent-gold block group-hover:translate-x-1 transition-transform">
                            {lang === 'hi' ? 'और पढ़ें' : lang === 'mai' ? 'आर पढ़ू' : 'Read More'} →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UpcomingFestivals;

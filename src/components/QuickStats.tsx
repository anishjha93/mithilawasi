'use client';

import React from 'react';

interface Stat {
    value: string;
    label: string;
    emoji: string;
}

interface QuickStatsProps {
    dict: {
        title: string;
        history: string;
        nakshatras: string;
        makhana: string;
        vidyapati: string;
    };
}

const QuickStats: React.FC<QuickStatsProps> = ({ dict }) => {
    const stats: Stat[] = [
        {
            value: '5000+',
            label: dict.history,
            emoji: '🏛️'
        },
        {
            value: '27',
            label: dict.nakshatras,
            emoji: '⭐'
        },
        {
            value: '90%',
            label: dict.makhana,
            emoji: '🌾'
        },
        {
            value: '600+',
            label: dict.vidyapati,
            emoji: '🎵'
        }
    ];

    return (
        <div className="py-12 my-8 bg-gradient-to-br from-accent-gold/5 to-orange-400/5 rounded-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground text-center mb-6 sm:mb-10 md:mb-12">{dict.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto px-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-5 sm:p-8 bg-card-bg rounded-xl border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold hover:shadow-lg">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{stat.emoji}</div>
                        <div className="text-3xl sm:text-4xl md:text-[2.5rem] font-extrabold text-[#ff4d4d] font-heading mb-2">{stat.value}</div>
                        <div className="text-[0.95rem] text-foreground opacity-80 leading-tight">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickStats;

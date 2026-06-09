'use client';

import React from 'react';
import Link from 'next/link';
import { MithilaCard } from './ui/heritage/MithilaCard';
import { HeritageHeading } from './ui/heritage/HeritageHeading';

interface QuickAstrologySuiteProps {
    lang: 'en' | 'hi' | 'mai';
    dict: {
        title: string;
        subtitle: string;
        kundli: {
            title: string;
            desc: string;
            btn: string;
        };
        milan: {
            title: string;
            desc: string;
            btn: string;
        };
        lagan: {
            title: string;
            desc: string;
            btn: string;
        };
        script: {
            title: string;
            desc: string;
            btn: string;
        };
        scans: {
            title: string;
            desc: string;
            btn: string;
        };
        calendar: {
            title: string;
            desc: string;
            btn: string;
        };
    };
}

export default function QuickAstrologySuite({ lang, dict }: QuickAstrologySuiteProps) {
    const tools = [
        {
            id: 'kundli',
            title: dict.kundli.title,
            desc: dict.kundli.desc,
            btn: dict.kundli.btn,
            link: `/${lang}/kundli`,
            icon: '🪐',
            color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-950/20 dark:to-orange-950/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            borderColor: 'group-hover:border-amber-500/30'
        },
        {
            id: 'milan',
            title: dict.milan.title,
            desc: dict.milan.desc,
            btn: dict.milan.btn,
            link: `/${lang}/kundli?tab=milan`,
            icon: '💖',
            color: 'from-rose-500/10 to-pink-500/10 dark:from-rose-950/20 dark:to-pink-950/20',
            iconColor: 'text-rose-600 dark:text-rose-400',
            borderColor: 'group-hover:border-rose-500/30'
        },
        {
            id: 'lagan',
            title: dict.lagan.title,
            desc: dict.lagan.desc,
            btn: dict.lagan.btn,
            link: `/${lang}/calendar/lagan`,
            icon: '💍',
            color: 'from-yellow-500/10 to-amber-500/10 dark:from-yellow-950/20 dark:to-amber-950/20',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'group-hover:border-yellow-500/30'
        },
        {
            id: 'scans',
            title: dict.scans.title,
            desc: dict.scans.desc,
            btn: dict.scans.btn,
            link: `/${lang}/calendar/panchang-pages`,
            icon: '📖',
            color: 'from-red-500/10 to-orange-500/10 dark:from-red-950/20 dark:to-orange-950/20',
            iconColor: 'text-primary-red',
            borderColor: 'group-hover:border-primary-red/30'
        },
        {
            id: 'script',
            title: dict.script.title,
            desc: dict.script.desc,
            btn: dict.script.btn,
            link: `/${lang}/learning`,
            icon: '✍️',
            color: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-950/20 dark:to-indigo-950/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'group-hover:border-purple-500/30'
        },
        {
            id: 'calendar',
            title: dict.calendar.title,
            desc: dict.calendar.desc,
            btn: dict.calendar.btn,
            link: `/${lang}/calendar`,
            icon: '📅',
            color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            borderColor: 'group-hover:border-emerald-500/30'
        }
    ];

    return (
        <div className="my-12 md:my-24">
            <header className="text-center mb-8 md:mb-16 max-w-2xl mx-auto px-4">
                <HeritageHeading as="h2" center className="mb-4 uppercase italic">
                    {dict.title}
                </HeritageHeading>
                <p className="text-lg text-text-muted font-serif italic leading-relaxed opacity-85">
                    {dict.subtitle}
                </p>
                <div className="h-1 w-16 bg-primary-red mx-auto mt-6 rounded-full opacity-60"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                {tools.map((tool) => (
                    <Link href={tool.link} key={tool.id} className="group no-underline block">
                        <MithilaCard
                            variant="default"
                            className={`p-5 md:p-8 h-full bg-gradient-to-br ${tool.color} border border-border-color transition-all duration-500 hover:-translate-y-2 hover:shadow-premium ${tool.borderColor} flex flex-col justify-between`}
                        >
                            <div>
                                <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 border border-border-color">
                                    <span className={`text-3xl ${tool.iconColor}`}>{tool.icon}</span>
                                </div>
                                <h3 className="text-xl font-black mb-3 font-heading text-mithila-ink group-hover:text-primary-red transition-colors italic tracking-tight uppercase">
                                    {tool.title}
                                </h3>
                                <p className="text-[0.92rem] text-text-muted leading-relaxed font-serif italic mb-6">
                                    {tool.desc}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[0.85rem] font-bold text-primary-red uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                                {tool.btn} →
                            </span>
                        </MithilaCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}

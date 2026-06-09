'use client';

import Link from 'next/link';
import { Flower, BookOpen, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { DailyRitualData } from '@/utils/dailyRituals';

export default function DailyRituals({ dict, lang, dailyData }: { dict: any, lang: string, dailyData: DailyRitualData }) {
    return (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 mt-2">
            {/* Mantra of the Day */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-950/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flower size={80} className="text-orange-600 rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 p-2 rounded-lg">
                            <Flower size={18} />
                        </span>
                        <h3 className="font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider text-xs">
                            {dict.home?.dailyRituals?.mantraTitle || "Mantra of the Day"}
                        </h3>
                    </div>

                    <h4 className="font-serif text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {dailyData.mantra.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {dailyData.mantra.description}
                    </p>

                    <Link
                        href={`/${lang}/mantras`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
                    >
                        {dict.home?.readMore || "Read Meaning"} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Upcoming Vrat */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={80} className="text-red-600 -rotate-6" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 p-2 rounded-lg">
                            <BookOpen size={18} />
                        </span>
                        <h3 className="font-bold text-red-900 dark:text-red-300 uppercase tracking-wider text-xs">
                            {dict.home?.dailyRituals?.vratTitle || "Upcoming Vrat"}
                        </h3>
                    </div>

                    {dailyData.upcomingVrat ? (
                        <>
                            <h4 className="font-serif text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {dailyData.upcomingVrat.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {dict.home?.dailyRituals?.observedOn || "Observed on"}: {dailyData.upcomingVrat.date} ({dailyData.upcomingVrat.tithi})
                            </p>
                        </>
                    ) : (
                        <>
                            <h4 className="font-serif text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {lang === 'mai' ? 'कोनो व्रत नहि' : (lang === 'hi' ? 'कोई व्रत नहीं' : 'No Vrat Coming Soon')}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                Check the Panchang for future festivals.
                            </p>
                        </>
                    )}

                    <Link
                        href={`/${lang}/vrat-katha`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    >
                        {dict.home?.readMore || "Read Katha"} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

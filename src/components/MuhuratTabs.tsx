'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarPlus, Download } from 'lucide-react';
import { downloadFestivalICS } from '@/utils/icsGenerator';

interface Tab {
    id: string;
    title: string;
    list: any[];
}

interface MuhuratTabsProps {
    tabs: Tab[];
    lang: string;
}

export default function MuhuratTabs({ tabs, lang }: MuhuratTabsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const activeTabData = tabs.find(tab => tab.id === activeTab);

    const activeBtnColors = [
        'bg-[#ff9900] shadow-[0_6px_15px_rgba(255,153,0,0.3)]',
        'bg-[#e91e63] shadow-[0_6px_15px_rgba(233,30,99,0.3)]',
        'bg-[#9c27b0] shadow-[0_6px_15px_rgba(156,39,176,0.3)]',
        'bg-[#3f51b5] shadow-[0_6px_15px_rgba(63,81,181,0.3)]',
        'bg-[#009688] shadow-[0_6px_15px_rgba(0,150,136,0.3)]',
    ];

    const dateGradients: Record<string, string> = {
        lagan: 'from-[#e91e63] to-[#c2185b]',
        mundan: 'from-[#9c27b0] to-[#7b1fa2]',
        upnayan: 'from-[#3f51b5] to-[#303f9f]',
        duragaman: 'from-[#009688] to-[#00796b]',
    };

    const generateGoogleCalendarUrl = (item: any) => {
        const dateStr = item.date; // YYYY-MM-DD
        if (!dateStr) return '#';

        const startDate = dateStr.replace(/-/g, '');
        // For all day event, end date is next day
        const dateObj = new Date(dateStr);
        dateObj.setDate(dateObj.getDate() + 1);
        const endDate = dateObj.toISOString().split('T')[0].replace(/-/g, '');

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `${item.name} (Mithila Calendar)`,
            details: `${item.desc || item.name} - Mithilawasi`,
            dates: `${startDate}/${endDate}`,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    return (
        <div className="w-full mt-4 animate-in fade-in duration-700">
            <div className="flex overflow-x-auto gap-2 p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl mx-auto mb-12 scrollbar-none border border-black/5 dark:border-white/5 max-w-fit shadow-xs max-md:max-w-none max-md:mb-8 max-md:rounded-none max-md:-mx-4 max-md:px-4 max-md:bg-transparent max-md:border-y max-md:border-black/5 dark:max-md:border-white/5">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.id}
                        className={`px-6 py-3 border-none font-bold cursor-pointer rounded-xl transition-all duration-400 ease-in-out whitespace-nowrap text-[0.85rem] md:text-[0.9rem] tracking-tight hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white max-md:px-5 max-md:py-2.5 ${activeTab === tab.id
                            ? `text-white ${activeBtnColors[idx % activeBtnColors.length]}`
                            : 'text-[#555] dark:text-gray-400 bg-transparent'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTabData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-md:gap-4">
                        {activeTabData.list.map((item, index) => {
                            const dateObj = new Date(item.date);
                            const cleanDesc = item.desc ? item.desc.replace(/Muhurat|मुहूर्त|Sanskar|संस्कार/gi, '').trim() : '';
                            const isClickable = !!item.slug;

                            const dateGradient = dateGradients[activeTab] || 'from-[#ff9900] to-[#ff6600]';
                            const calendarUrl = generateGoogleCalendarUrl(item);

                            const CardContent = (
                                <>
                                    <div className="w-[70px] h-[75px] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/10 flex-shrink-0">
                                        <div className={`bg-gradient-to-br ${dateGradient} text-white text-[0.7rem] font-extrabold py-1 text-center tracking-wider`}>
                                            {dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : 'mai-IN'), { month: 'short' }).toUpperCase()}
                                        </div>
                                        <div className="flex-1 flex items-center justify-center text-[1.4rem] font-extrabold text-[#333] dark:text-gray-100 bg-[#fdfdfd] dark:bg-zinc-800">
                                            {dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : 'mai-IN'), { day: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex-1 relative pr-8">
                                        <h3 className="m-0 text-[1.1rem] text-[#1a1a1a] dark:text-gray-100 font-bold leading-tight">{item.name}</h3>
                                        {cleanDesc && <p className="mt-1 text-[0.85rem] text-[#777] dark:text-gray-400 leading-relaxed capitalize">{cleanDesc}</p>}
                                        {isClickable ? (
                                            <span className="inline-block mt-3 text-[0.8rem] font-bold text-[#ff9900] transition-transform duration-200 group-hover:translate-x-1">
                                                {lang === 'en' ? 'Read More' : (lang === 'hi' ? 'और पढ़ें' : 'और पढ़ब')} →
                                            </span>
                                        ) : null}

                                         <div className="absolute -top-1 -right-2 flex gap-1 z-10">
                                             <button
                                                 type="button"
                                                 className="p-2 bg-transparent border-0 text-gray-400 hover:text-[#4285F4] transition-colors cursor-pointer"
                                                 onClick={(e) => {
                                                     e.preventDefault();
                                                     e.stopPropagation();
                                                     window.open(calendarUrl, '_blank');
                                                 }}
                                                 title="Add to Google Calendar"
                                             >
                                                 <CalendarPlus size={18} />
                                             </button>
                                             <button
                                                 type="button"
                                                 className="p-2 bg-transparent border-0 text-gray-400 hover:text-[#22c55e] transition-colors cursor-pointer"
                                                 onClick={(e) => {
                                                     e.preventDefault();
                                                     e.stopPropagation();
                                                     downloadFestivalICS(item.name, item.date, item.desc || item.name);
                                                 }}
                                                 title="Download .ics Calendar File"
                                             >
                                                 <Download size={18} />
                                             </button>
                                         </div>
                                    </div>
                                </>
                            );

                            return isClickable ? (
                                <Link
                                    key={index}
                                    href={`/${lang}/calendar/festivals/${item.slug}`}
                                    className="group bg-white dark:bg-card-bg p-6 rounded-[20px] flex gap-6 items-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-400 ease-out border border-black/2 dark:border-white/5 animate-in slide-in-from-bottom-5 fade-in duration-500 fill-mode-both hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:border-[#ff9900]/20 max-md:p-4 no-underline cursor-pointer"
                                >
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={index} className="bg-white dark:bg-card-bg p-6 rounded-[20px] flex gap-6 items-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-400 ease-out border border-black/2 dark:border-white/5 animate-in slide-in-from-bottom-5 fade-in duration-500 fill-mode-both max-md:p-4">
                                    {CardContent}
                                </div>
                            );
                        })}
                        {activeTabData.list.length === 0 && (
                            <div className="col-span-full text-center py-20 px-8 bg-[#fffdf9] dark:bg-white/5 rounded-[24px] color-[#c09d3b] dark:text-[#e0c060] font-semibold border-2 border-dashed border-[#f5e9c0] dark:border-white/10 text-xl">
                                No auspicious dates found for this category in 2026.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

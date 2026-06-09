'use client';

import React, { useState, useEffect } from 'react';
import { calculateChoghadiya, calculateHora, TimeSlot, getSunTimes } from '@/utils/astrology';

interface MuhuratTablesProps {
    date: Date;
    lang: 'en' | 'hi' | 'mai';
    rahuKaal?: string;
    yamagandaKaal?: string;
    gulikaKaal?: string;
}

export default function MuhuratTables({ date, lang, rahuKaal, yamagandaKaal, gulikaKaal }: MuhuratTablesProps) {
    const [activeTab, setActiveTab] = useState<'choghadiya' | 'hora' | 'kaal'>('choghadiya');
    const [isNight, setIsNight] = useState<boolean>(false);
    const [sunTimes, setSunTimes] = useState<{ sunrise: Date; sunset: Date; nextSunrise: Date } | null>(null);

    // Compute sunrise/sunset on client side using local coordinates
    useEffect(() => {
        const times = getSunTimes(date);
        setSunTimes(times);
    }, [date]);

    if (!sunTimes) {
        return <div className="animate-pulse bg-white/10 h-[250px] w-full rounded-2xl"></div>;
    }

    const { day: dayChoghadiya, night: nightChoghadiya } = calculateChoghadiya(
        date,
        sunTimes.sunrise,
        sunTimes.sunset,
        sunTimes.nextSunrise,
        lang
    );

    const { day: dayHora, night: nightHora } = calculateHora(
        date,
        sunTimes.sunrise,
        sunTimes.sunset,
        sunTimes.nextSunrise,
        lang
    );

    const activeChoghadiya = isNight ? nightChoghadiya : dayChoghadiya;
    const activeHora = isNight ? nightHora : dayHora;

    const formatTime = (d: Date): string => {
        try {
            return d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'hi-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            const h = d.getHours();
            const m = d.getMinutes();
            const p = h >= 12 ? 'PM' : 'AM';
            const dh = h % 12 === 0 ? 12 : h % 12;
            return `${String(dh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`;
        }
    };

    const t = {
        en: {
            choghadiya: "Choghadiya",
            hora: "Hora",
            kaal: "Inauspicious Timings",
            day: "Daytime (Sunrise to Sunset)",
            night: "Nighttime (Sunset to Sunrise)",
            thTime: "Time Slot",
            thNature: "Nature",
            thAuspicious: "Status",
            thRuler: "Ruling Graha",
            thHora: "Hora Slot",
            rahu: "Rahu Kaal",
            yamaganda: "Yamaganda",
            gulika: "Gulika Kaal",
            auspicious: "Auspicious",
            inauspicious: "Inauspicious",
            neutral: "Neutral / Char",
            kaalLead: "Avoid starting any new ventures, investments, or travel during these daily inauspicious periods."
        },
        hi: {
            choghadiya: "चोघड़िया",
            hora: "होरा",
            kaal: "अशुभ समय (राहुकाल आदि)",
            day: "दिन का समय (सूर्योदय से सूर्यास्त)",
            night: "रात का समय (सूर्यास्त से सूर्योदय)",
            thTime: "समय काल",
            thNature: "नाम",
            thAuspicious: "शुभता",
            thRuler: "स्वामी ग्रह",
            thHora: "होरा घंटा",
            rahu: "राहु काल",
            yamaganda: "यमगण्ड काल",
            gulika: "गुलिक काल",
            auspicious: "शुभ",
            inauspicious: "अशुभ",
            neutral: "सामान्य / चर",
            kaalLead: "इन दैनिक अशुभ समयों में नए कार्य, निवेश या शुभ यात्रा करने से बचें।"
        },
        mai: {
            choghadiya: "चोघड़िया",
            hora: "होरा",
            kaal: "अशुभ समय (राहुकाल)",
            day: "दिनक समय (सूर्योदय सँ सूर्यास्त)",
            night: "रातिक समय (सूर्यास्त सँ सूर्योदय)",
            thTime: "समय काल",
            thNature: "नाम",
            thAuspicious: "शुभता",
            thRuler: "स्वामी ग्रह",
            thHora: "होरा घंटा",
            rahu: "राहु काल",
            yamaganda: "यमगण्ड काल",
            gulika: "गुलिक काल",
            auspicious: "शुभ",
            inauspicious: "अशुभ",
            neutral: "सामान्य / चर",
            kaalLead: "एहि दैनिक अशुभ समय सभ में नवीन काज, निवेश वा शुभ यात्रा करय सँ बचू।"
        }
    }[lang];

    const getStatusStyle = (type: 'auspicious' | 'inauspicious' | 'neutral') => {
        if (type === 'auspicious') {
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        }
        if (type === 'inauspicious') {
            return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
        }
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    };

    return (
        <div className="bg-white dark:bg-card-bg rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color p-6 md:p-8 mt-12">
            
            {/* Tab Switched Header */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-border-color pb-5 gap-4">
                <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl self-start overflow-x-auto max-w-full no-scrollbar whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('choghadiya')}
                        className={`px-4 py-2 rounded-lg font-bold text-[0.88rem] transition-all ${
                            activeTab === 'choghadiya'
                                ? 'bg-white dark:bg-zinc-800 text-primary-red shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        🕉️ {t.choghadiya}
                    </button>
                    <button
                        onClick={() => setActiveTab('hora')}
                        className={`px-4 py-2 rounded-lg font-bold text-[0.88rem] transition-all ${
                            activeTab === 'hora'
                                ? 'bg-white dark:bg-zinc-800 text-primary-red shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        ⏳ {t.hora}
                    </button>
                    <button
                        onClick={() => setActiveTab('kaal')}
                        className={`px-4 py-2 rounded-lg font-bold text-[0.88rem] transition-all ${
                            activeTab === 'kaal'
                                ? 'bg-white dark:bg-zinc-800 text-primary-red shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        ⚠️ {t.kaal}
                    </button>
                </div>

                {/* Day / Night Switcher */}
                {activeTab !== 'kaal' && (
                    <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl self-start">
                        <button
                            onClick={() => setIsNight(false)}
                            className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                                !isNight
                                    ? 'bg-primary-red text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            ☀️ {lang === 'en' ? 'Day' : 'दिन'}
                        </button>
                        <button
                            onClick={() => setIsNight(true)}
                            className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                                isNight
                                    ? 'bg-primary-red text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            🌙 {lang === 'en' ? 'Night' : 'रात'}
                        </button>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="mt-6">
                
                {/* Title and Lead */}
                <div className="mb-6">
                    <h3 className="text-[1.2rem] font-bold text-primary-red flex items-center gap-2">
                        {activeTab === 'choghadiya' && `✨ ${isNight ? t.night : t.day} ${t.choghadiya}`}
                        {activeTab === 'hora' && `🕰️ ${isNight ? t.night : t.day} ${t.hora}`}
                        {activeTab === 'kaal' && `📉 ${t.kaal}`}
                    </h3>
                </div>

                {/* Choghadiya Tab */}
                {activeTab === 'choghadiya' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-color text-[0.8rem] uppercase text-gray-400 font-bold">
                                    <th className="py-3 px-4">{t.thTime}</th>
                                    <th className="py-3 px-4">{t.thNature}</th>
                                    <th className="py-3 px-4 text-center">{t.thAuspicious}</th>
                                </tr>
                            </thead>
                            <tbody className="text-[0.92rem] divide-y divide-gray-100 dark:divide-zinc-850">
                                {activeChoghadiya.map((slot, index) => (
                                    <tr key={index} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30">
                                        <td className="py-3 px-4 font-semibold text-[#2c3e50] dark:text-gray-200">
                                            {formatTime(slot.start)} - {formatTime(slot.end)}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-[1rem]">
                                            {slot.name}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(slot.type)}`}>
                                                {slot.type === 'auspicious' && t.auspicious}
                                                {slot.type === 'inauspicious' && t.inauspicious}
                                                {slot.type === 'neutral' && t.neutral}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Hora Tab */}
                {activeTab === 'hora' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-color text-[0.8rem] uppercase text-gray-400 font-bold">
                                    <th className="py-3 px-4">{t.thHora}</th>
                                    <th className="py-3 px-4">{t.thTime}</th>
                                    <th className="py-3 px-4">{t.thRuler}</th>
                                    <th className="py-3 px-4 text-center">{t.thAuspicious}</th>
                                </tr>
                            </thead>
                            <tbody className="text-[0.92rem] divide-y divide-gray-100 dark:divide-zinc-850">
                                {activeHora.map((slot, index) => (
                                    <tr key={index} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30">
                                        <td className="py-3 px-4 font-bold text-gray-400">
                                            #{slot.name}
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-[#2c3e50] dark:text-gray-200">
                                            {formatTime(slot.start)} - {formatTime(slot.end)}
                                        </td>
                                        <td className="py-3 px-4 font-extrabold text-[0.95rem] text-accent-gold">
                                            {slot.ruler}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(slot.type)}`}>
                                                {slot.type === 'auspicious' && t.auspicious}
                                                {slot.type === 'inauspicious' && t.inauspicious}
                                                {slot.type === 'neutral' && t.neutral}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Inauspicious Kaal Tab */}
                {activeTab === 'kaal' && (
                    <div className="flex flex-col gap-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm italic">{t.kaalLead}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Rahu Kaal */}
                            <div className="p-5 bg-rose-500/[0.03] dark:bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl hover:border-rose-500/25 transition-all">
                                <span className="text-[0.68rem] uppercase tracking-wider text-rose-500 font-bold block mb-2">
                                    🔴 {t.rahu}
                                </span>
                                <span className="text-[1.3rem] font-black text-rose-600 dark:text-rose-400 block">
                                    {rahuKaal || '--:--'}
                                </span>
                            </div>

                            {/* Yamaganda */}
                            <div className="p-5 bg-rose-500/[0.03] dark:bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl hover:border-rose-500/25 transition-all">
                                <span className="text-[0.68rem] uppercase tracking-wider text-rose-500 font-bold block mb-2">
                                    🔴 {t.yamaganda}
                                </span>
                                <span className="text-[1.3rem] font-black text-rose-600 dark:text-rose-400 block">
                                    {yamagandaKaal || '--:--'}
                                </span>
                            </div>

                            {/* Gulika */}
                            <div className="p-5 bg-rose-500/[0.03] dark:bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl hover:border-rose-500/25 transition-all">
                                <span className="text-[0.68rem] uppercase tracking-wider text-rose-500 font-bold block mb-2">
                                    🔴 {t.gulika}
                                </span>
                                <span className="text-[1.3rem] font-black text-rose-600 dark:text-rose-400 block">
                                    {gulikaKaal || '--:--'}
                                </span>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

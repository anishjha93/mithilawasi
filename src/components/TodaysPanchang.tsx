'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTodaysPanchang } from '@/utils/panchang';

type Locale = 'en' | 'hi' | 'mai';

import { MithilaCard } from './ui/heritage/MithilaCard';
import { HeritageHeading } from './ui/heritage/HeritageHeading';

interface PanchangData {
    tithi: string;
    tithiValue: string;
    nakshatra: string;
    nakshatraValue: string;
    yog: string;
    yogValue: string;
    karan: string;
    karanValue: string;
    paksha: string;
    pakshaValue: string;
    samvat?: string;
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    sunRashi?: string;
    moonRashi?: string;
    abhijitMuhurta?: string;
    sunriseTimeISO?: string;
}

interface TodaysPanchangProps {
    lang: Locale;
    dict: {
        title: string;
        viewFull: string;
    };
}

const TodaysPanchang: React.FC<TodaysPanchangProps> = ({ lang, dict }) => {
    const [panchang, setPanchang] = useState<PanchangData | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [vedicTime, setVedicTime] = useState<{ ghati: number; pal: number; vipal: number } | null>(null);

    const calculateVedicTime = (now: Date, sunriseTimeStr?: string) => {
        if (!sunriseTimeStr) return null;
        let sunrise = new Date(sunriseTimeStr);
        let diffMs = now.getTime() - sunrise.getTime();
        
        // If current time is before Sunrise, it belongs to the previous day's Sunrise cycle
        if (diffMs < 0) {
            sunrise = new Date(sunrise.getTime() - 24 * 60 * 60 * 1000);
            diffMs = now.getTime() - sunrise.getTime();
        }
        
        const elapsedMinutes = diffMs / (60 * 1000);
        const ghati = Math.floor(elapsedMinutes / 24);
        const pal = Math.floor((elapsedMinutes % 24) * 2.5);
        const vipal = Math.floor((((elapsedMinutes % 24) * 2.5) % 1) * 60);
        
        return { ghati, pal, vipal };
    };

    useEffect(() => {
        // Get today's date in the client's timezone
        const today = new Date();
        const todaysPanchang = getTodaysPanchang(today, lang) as PanchangData;

        // Mocking Vikram Samvat (other values are calculated dynamically)
        todaysPanchang.samvat = lang === 'mai' ? 'विक्रम संवत २०८२' : 'Vikram Samvat 2082';

        setPanchang(todaysPanchang);

        // Format the current date
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        setCurrentDate(today.toLocaleDateString(lang === 'mai' ? 'hi-IN' : lang === 'hi' ? 'hi-IN' : 'en-US', options));
    }, [lang]);

    useEffect(() => {
        if (!panchang?.sunriseTimeISO) return;
        
        const updateVedicTime = () => {
            const now = new Date();
            const time = calculateVedicTime(now, panchang.sunriseTimeISO);
            setVedicTime(time);
        };
        
        updateVedicTime();
        const interval = setInterval(updateVedicTime, 1000);
        
        return () => clearInterval(interval);
    }, [panchang?.sunriseTimeISO]);

    if (!panchang) {
        return null;
    }

    return (
        <MithilaCard variant="madhubani" className="my-10 relative overflow-hidden group glass-morphism border-primary-red/10 shadow-premium">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
                <div className="flex flex-col gap-1">
                    <HeritageHeading as="h2" className="m-0 mb-1 flex items-center gap-4">
                        <span className="text-3xl animate-bounce">📅</span>
                        <span className="text-gradient font-black tracking-tight">{dict.title}</span>
                    </HeritageHeading>
                    <div className="flex items-center gap-2">
                        <div className="h-[2px] w-8 bg-primary-yellow rounded-full"></div>
                        <span className="text-[0.7rem] font-bold text-accent-gold uppercase tracking-[0.2em]">{panchang.samvat}</span>
                    </div>
                </div>
                <Link href={`/${lang}/calendar`} className="btn btn-outline text-xs px-6 py-2 border-primary-yellow/30 text-accent-gold hover:bg-primary-yellow hover:text-white group/btn">
                    {dict.viewFull} <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </Link>
            </div>

            {currentDate && (
                <div className="text-center mb-10 relative">
                    <div className="absolute inset-0 bg-primary-yellow/5 blur-2xl rounded-full"></div>
                    <div className="relative z-10 p-5 rounded-2xl border border-primary-red/5 bg-white/40 dark:bg-black/20">
                        <div className="text-2xl md:text-3xl font-heading font-black text-mithila-ink mb-3">{currentDate}</div>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[0.8rem] uppercase tracking-widest font-bold text-text-muted">
                            <span className="flex items-center gap-2 hover:text-primary-red transition-colors duration-300">🌅 {panchang.sunrise}</span>
                            <span className="flex items-center gap-2 hover:text-primary-red transition-colors duration-300">🌇 {panchang.sunset}</span>
                        </div>

                        {/* Vedic Clock Display */}
                        {vedicTime && (
                            <div className="mt-4 pt-3 border-t border-dashed border-primary-red/10 flex flex-col items-center gap-1 group/clock cursor-help relative">
                                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent-gold font-black flex items-center gap-1.5">
                                    🪔 Traditional Vedic Clock (वैदिक घड़ी)
                                    <span className="text-gray-400 font-normal normal-case tracking-normal text-[0.75rem]" title="1 Ghati = 24 Mins | 1 Pal = 24 Secs | 1 Vipal = 0.4 Secs">ⓘ</span>
                                </span>
                                <div className="text-lg md:text-2xl font-black text-primary-red font-heading tracking-wide flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
                                    <span>{vedicTime.ghati}</span><span className="text-[0.6rem] text-text-muted font-bold mr-1">Ghati (घटी)</span>
                                    <span>{vedicTime.pal}</span><span className="text-[0.6rem] text-text-muted font-bold mr-1">Pal (पल)</span>
                                    <span className="animate-pulse">{vedicTime.vipal}</span><span className="text-[0.6rem] text-text-muted font-bold">Vipal (विपल)</span>
                                </div>
                                <span className="text-[0.65rem] text-text-muted italic">Time elapsed since Sunrise (सूर्योदय सँ व्यतीत समय)</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { label: panchang.tithi, value: panchang.tithiValue },
                    { label: panchang.nakshatra, value: panchang.nakshatraValue },
                    { label: panchang.yog, value: panchang.yogValue },
                    { label: panchang.karan, value: panchang.karanValue }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 p-5 bg-white/30 dark:bg-white/5 rounded-2xl border border-primary-red/5 transition-all duration-300 hover:border-primary-yellow/40 hover:-translate-y-1 hover:shadow-premium group/item">
                        <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-text-muted font-black group-hover/item:text-primary-red transition-colors">{item.label}</span>
                        <span className="text-[1rem] md:text-[1.1rem] font-bold text-foreground leading-tight">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* New Astrological Details Section */}
            {(panchang.sunRashi || panchang.moonRashi || panchang.abhijitMuhurta || panchang.moonrise || panchang.moonset) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {/* Rashi Card */}
                    {(panchang.sunRashi || panchang.moonRashi) && (
                        <div className="flex flex-col gap-2 p-5 bg-white/30 dark:bg-white/5 rounded-2xl border border-primary-red/5 hover:border-primary-yellow/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium group/item">
                            <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-text-muted font-black">
                                🌌 Rashi (राशि)
                            </span>
                            <div className="flex justify-between items-center w-full mt-1">
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] uppercase text-text-muted font-bold">Sun (सूर्य)</span>
                                    <span className="text-[0.95rem] font-bold text-foreground leading-tight">{panchang.sunRashi || '--'}</span>
                                </div>
                                <div className="h-8 w-[1px] bg-primary-red/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] uppercase text-text-muted font-bold">Moon (चन्द्र)</span>
                                    <span className="text-[0.95rem] font-bold text-foreground leading-tight">{panchang.moonRashi || '--'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Abhijit Muhurta Card */}
                    {panchang.abhijitMuhurta && (
                        <div className="flex flex-col gap-2 p-5 bg-white/30 dark:bg-white/5 rounded-2xl border border-primary-red/5 hover:border-primary-yellow/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium group/item justify-center text-center">
                            <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-text-muted font-black">
                                ✨ Abhijit Muhurta (अभिजीत मुहूर्त)
                            </span>
                            <span className="text-[1.1rem] font-bold text-primary-red dark:text-orange-400 mt-1 leading-tight">
                                {panchang.abhijitMuhurta}
                            </span>
                        </div>
                    )}

                    {/* Moon timings Card */}
                    {(panchang.moonrise || panchang.moonset) && (
                        <div className="flex flex-col gap-2 p-5 bg-white/30 dark:bg-white/5 rounded-2xl border border-primary-red/5 hover:border-primary-yellow/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium group/item">
                            <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-text-muted font-black">
                                🌙 Moon Times (चन्द्रोदय/चन्द्रास्त)
                            </span>
                            <div className="flex justify-between items-center w-full mt-1">
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] uppercase text-text-muted font-bold">Moonrise</span>
                                    <span className="text-[0.95rem] font-bold text-foreground leading-tight">{panchang.moonrise || '--'}</span>
                                </div>
                                <div className="h-8 w-[1px] bg-primary-red/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] uppercase text-text-muted font-bold">Moonset</span>
                                    <span className="text-[0.95rem] font-bold text-foreground leading-tight">{panchang.moonset || '--'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center p-4 bg-gradient-to-r from-primary-red/10 via-primary-red/5 to-primary-red/10 rounded-2xl border border-primary-red/20 relative group/paksha">
                <div className="absolute inset-0 bg-primary-red/5 opacity-0 group-hover/paksha:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-[0.8rem] uppercase tracking-[0.25em] text-primary-red font-black opacity-60">{panchang.paksha}</span>
                    <div className="h-1 w-1 bg-primary-red rounded-full"></div>
                    <span className="text-lg font-black text-primary-red tracking-wide uppercase italic">{panchang.pakshaValue}</span>
                </div>
            </div>
        </MithilaCard>
    );
};

export default TodaysPanchang;

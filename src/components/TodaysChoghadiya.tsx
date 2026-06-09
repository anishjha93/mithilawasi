'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateChoghadiya, getSunTimes, TimeSlot } from '@/utils/astrology';
import { MithilaCard } from './ui/heritage/MithilaCard';
import { HeritageHeading } from './ui/heritage/HeritageHeading';

interface TodaysChoghadiyaProps {
    lang: 'en' | 'hi' | 'mai';
}

const RAHU_KAAL_PARTS = [8, 2, 7, 5, 6, 4, 3];  // Sun-Sat
const YAMAG_PARTS      = [6, 5, 4, 3, 2, 1, 7];
const GULIKA_PARTS     = [1, 7, 6, 5, 4, 3, 2];

function calculateKaalTime(date: Date, partNumber: number, sunTimes: { sunrise: Date; sunset: Date }): string {
    const { sunrise, sunset } = sunTimes;
    const dayMs = sunset.getTime() - sunrise.getTime();
    const segMs = dayMs / 8;
    const start = new Date(sunrise.getTime() + (partNumber - 1) * segMs);
    const end   = new Date(sunrise.getTime() + partNumber * segMs);
    const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${fmt(start)} – ${fmt(end)}`;
}

export default function TodaysChoghadiya({ lang }: TodaysChoghadiyaProps) {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [nightSlots, setNightSlots] = useState<TimeSlot[]>([]);
    const [rahuKaal, setRahuKaal] = useState('--:--');
    const [yamaganda, setYamaganda] = useState('--:--');
    const [gulika, setGulika] = useState('--:--');
    const [now, setNow] = useState<Date>(new Date());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const today = new Date();
        const sunTimes = getSunTimes(today);
        const { day, night } = calculateChoghadiya(today, sunTimes.sunrise, sunTimes.sunset, sunTimes.nextSunrise, lang);
        const dow = today.getDay();

        setSlots(day);
        setNightSlots(night);
        setRahuKaal(calculateKaalTime(today, RAHU_KAAL_PARTS[dow], sunTimes));
        setYamaganda(calculateKaalTime(today, YAMAG_PARTS[dow], sunTimes));
        setGulika(calculateKaalTime(today, GULIKA_PARTS[dow], sunTimes));
        setLoaded(true);
    }, [lang]);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    if (!loaded) return null;

    const allSlots = [...slots, ...nightSlots];

    // Determine current and next auspicious slots
    const currentSlot = allSlots.find(s => now >= s.start && now < s.end) || null;
    const nextAuspicious = allSlots.find(s => s.start > now && s.type === 'auspicious') || null;

    const t = {
        en: {
            title: "Today's Choghadiya",
            subtitle: "Auspicious time slots for today — updated every minute",
            current: "Current Slot",
            nextShubh: "Next Auspicious",
            rahuKaal: "Rahu Kaal",
            yamaganda: "Yamaganda",
            gulika: "Gulika Kaal",
            avoid: "Avoid new ventures during these inauspicious periods",
            daytimeLabel: "Daytime Choghadiya",
            viewFull: "View Full Choghadiya & Hora →",
            auspicious: "Auspicious",
            inauspicious: "Inauspicious",
            neutral: "Neutral"
        },
        hi: {
            title: "आज का चोघड़िया",
            subtitle: "आजके शुभ समय काल — हर मिनट अपडेट",
            current: "अभी का समय",
            nextShubh: "अगला शुभ काल",
            rahuKaal: "राहु काल",
            yamaganda: "यमगण्ड",
            gulika: "गुलिक काल",
            avoid: "इन अशुभ समयों में नया कार्य न करें",
            daytimeLabel: "दिन का चोघड़िया",
            viewFull: "पूर्ण चोघड़िया और होरा देखें →",
            auspicious: "शुभ",
            inauspicious: "अशुभ",
            neutral: "सामान्य"
        },
        mai: {
            title: "आजुक चोघड़िया",
            subtitle: "आजुक शुभ समय काल — हर मिनट अपडेट",
            current: "अखन क समय",
            nextShubh: "अगिला शुभ काल",
            rahuKaal: "राहु काल",
            yamaganda: "यमगण्ड",
            gulika: "गुलिक काल",
            avoid: "एहि अशुभ समय सभ में नवीन काज नहि करू",
            daytimeLabel: "दिनुक चोघड़िया",
            viewFull: "पूर्ण चोघड़िया आ होरा देखू →",
            auspicious: "शुभ",
            inauspicious: "अशुभ",
            neutral: "सामान्य"
        }
    }[lang];

    const typeColor = (type: TimeSlot['type']) => {
        if (type === 'auspicious') return { bg: 'bg-emerald-500/10 dark:bg-emerald-500/5', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/20', badge: 'bg-emerald-500 text-white' };
        if (type === 'inauspicious') return { bg: 'bg-rose-500/10 dark:bg-rose-500/5', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/20', badge: 'bg-rose-500 text-white' };
        return { bg: 'bg-amber-500/10 dark:bg-amber-500/5', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/20', badge: 'bg-amber-500 text-white' };
    };

    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <MithilaCard variant="default" className="my-10 overflow-hidden border-primary-red/10 shadow-premium glass-morphism">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
                <div>
                    <HeritageHeading as="h2" className="m-0 mb-1 flex items-center gap-3">
                        <span className="text-3xl">🕉️</span>
                        <span className="text-gradient font-black tracking-tight">{t.title}</span>
                    </HeritageHeading>
                    <p className="text-[0.75rem] text-text-muted font-medium uppercase tracking-[0.15em] mt-1">{t.subtitle}</p>
                </div>
                <Link
                    href={`/${lang}/calendar`}
                    className="btn btn-outline text-xs px-5 py-2 border-primary-yellow/30 text-accent-gold hover:bg-primary-yellow hover:text-white shrink-0"
                >
                    {t.viewFull}
                </Link>
            </div>

            {/* Current + Next Auspicious — top summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {currentSlot && (
                    <div className={`rounded-2xl p-5 border ${typeColor(currentSlot.type).bg} ${typeColor(currentSlot.type).border} relative overflow-hidden`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary-red animate-ping inline-block"></span>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-text-muted">{t.current}</span>
                        </div>
                        <div className={`text-2xl font-black ${typeColor(currentSlot.type).text} mb-1`}>{currentSlot.name}</div>
                        <div className="text-[0.8rem] font-semibold text-text-muted">
                            {formatTime(currentSlot.start)} – {formatTime(currentSlot.end)}
                        </div>
                        <span className={`absolute top-3 right-3 text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-black ${typeColor(currentSlot.type).badge}`}>
                            {currentSlot.type === 'auspicious' ? t.auspicious : currentSlot.type === 'inauspicious' ? t.inauspicious : t.neutral}
                        </span>
                    </div>
                )}

                {nextAuspicious && (
                    <div className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-text-muted">✨ {t.nextShubh}</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mb-1">{nextAuspicious.name}</div>
                        <div className="text-[0.8rem] font-semibold text-text-muted">
                            {formatTime(nextAuspicious.start)} – {formatTime(nextAuspicious.end)}
                        </div>
                        <span className="absolute top-3 right-3 text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-black bg-emerald-500 text-white">
                            {t.auspicious}
                        </span>
                    </div>
                )}
            </div>

            {/* Daytime Choghadiya Slots — compact grid */}
            <div className="mb-8">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] font-black text-text-muted mb-4 flex items-center gap-2">
                    ☀️ {t.daytimeLabel}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slots.map((slot, i) => {
                        const isCurrent = now >= slot.start && now < slot.end;
                        const colors = typeColor(slot.type);
                        return (
                            <div
                                key={i}
                                className={`rounded-xl p-3 border transition-all duration-300 ${colors.bg} ${colors.border} ${isCurrent ? 'ring-2 ring-primary-red/40 scale-[1.02]' : ''}`}
                            >
                                <div className={`text-[0.78rem] font-black ${colors.text} mb-0.5`}>{slot.name}</div>
                                <div className="text-[0.65rem] text-text-muted font-semibold leading-tight">
                                    {formatTime(slot.start)}
                                </div>
                                <div className="text-[0.6rem] text-text-muted/70">– {formatTime(slot.end)}</div>
                                {isCurrent && (
                                    <span className="mt-1 inline-block text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary-red text-white font-black">
                                        Now
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Inauspicious Kaal — compact 3-column */}
            <div className="rounded-2xl bg-rose-500/[0.03] border border-rose-500/10 p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] font-black text-rose-500 mb-4 flex items-center gap-2">
                    ⚠️ {t.avoid}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: t.rahuKaal, time: rahuKaal, icon: '🔴' },
                        { label: t.yamaganda, time: yamaganda, icon: '🟠' },
                        { label: t.gulika, time: gulika, icon: '🟡' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <span className="text-[0.65rem] uppercase tracking-[0.15em] text-rose-500 font-black">{item.icon} {item.label}</span>
                            <span className="text-[1.05rem] font-black text-rose-600 dark:text-rose-400">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </MithilaCard>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { getTarabala, getChandrabala } from '@/utils/astrology';

interface PersonalAuspiciousnessProps {
    transitRashiIdx: number;
    transitNakshatraIdx: number;
    lang: 'en' | 'hi' | 'mai';
}

const RASHIS_EN = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
const RASHIS_MAI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

const NAKSHATRAS_EN = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];
const NAKSHATRAS_MAI = [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 
    'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 
    'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'
];

export default function PersonalAuspiciousness({ transitRashiIdx, transitNakshatraIdx, lang }: PersonalAuspiciousnessProps) {
    const [birthRashi, setBirthRashi] = useState<number>(0);
    const [birthNakshatra, setBirthNakshatra] = useState<number>(0);
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const activeRashis = lang === 'en' ? RASHIS_EN : RASHIS_MAI;
    const activeNakshatras = lang === 'en' ? NAKSHATRAS_EN : NAKSHATRAS_MAI;

    const t = {
        en: {
            title: "Check Personal Daily Auspiciousness",
            lead: "Select your Janma Rashi (Birth Moon Sign) and Janma Nakshatra (Birth Star) to calculate your Tarabala and Chandrabala strength for today.",
            rashiLabel: "Birth Moon Sign (Janam Rashi)",
            nakshatraLabel: "Birth Star (Janam Nakshatra)",
            checkBtn: "Calculate Auspiciousness",
            tarabalaTitle: "Tarabala (Strength of Star)",
            chandrabalaTitle: "Chandrabala (Strength of Moon)",
            verdictAuspicious: "Auspicious Day",
            verdictInauspicious: "Inauspicious Day - Caution Advised",
            verdictNeutral: "Average Day - Proceed normally",
            explanationTitle: "Astrological Explanation",
            transitSign: "Today's Moon Transit Rashi",
            transitStar: "Today's Transit Nakshatra",
            houseRelation: "Placed in {house} house from Birth Rashi"
        },
        hi: {
            title: "दैनिक व्यक्तिगत शुभता जांचें",
            lead: "आज के दिन अपने ताराबल और चंद्रबल की शक्ति की गणना करने के लिए अपनी जन्म राशि और जन्म नक्षत्र का चयन करें।",
            rashiLabel: "जन्म राशि (Moon Sign)",
            nakshatraLabel: "जन्म नक्षत्र (Birth Star)",
            checkBtn: "शुभता की गणना करें",
            tarabalaTitle: "ताराबल (नक्षत्र बल)",
            chandrabalaTitle: "चन्द्रबल (चन्द्रमा का बल)",
            verdictAuspicious: "अनुकूल और शुभ दिन",
            verdictInauspicious: "प्रतिकूल दिन - सावधानी बरतें",
            verdictNeutral: "सामान्य दिन - सामान्य कार्य करें",
            explanationTitle: "ज्योतिषीय विवरण",
            transitSign: "आज का चंद्र गोचर राशि",
            transitStar: "आज का गोचर नक्षत्र",
            houseRelation: "जन्म राशि से {house}वें भाव में स्थित"
        },
        mai: {
            title: "दैनिक व्यक्तिगत शुभता जांचू",
            lead: "आजुक दिन अपन ताराबल आ चन्द्रबलक शक्तिक गणना करबाक लेल अपन जन्म राशि आ जन्म नक्षत्रक चयन करू।",
            rashiLabel: "जन्म राशि (Moon Sign)",
            nakshatraLabel: "जन्म नक्षत्र (Birth Star)",
            checkBtn: "शुभता कऽ गणना करू",
            tarabalaTitle: "ताराबल (नक्षत्र बल)",
            chandrabalaTitle: "चन्द्रबल (चन्द्रक बल)",
            verdictAuspicious: "अनुकूल आ शुभ दिन",
            verdictInauspicious: "प्रतिकूल दिन - सावधानी राखू",
            verdictNeutral: "सामान्य दिन - सामान्य काज करू",
            explanationTitle: "ज्योतिषीय विवरण",
            transitSign: "आजुक चन्द्र गोचर राशि",
            transitStar: "आजुक गोचर नक्षत्र",
            houseRelation: "जन्म राशि सँ {house}म भाव में स्थित"
        }
    }[lang];

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculated(true);
    };

    const tarabalaResult = getTarabala(birthNakshatra, transitNakshatraIdx, lang);
    const chandrabalaResult = getChandrabala(birthRashi, transitRashiIdx, lang);

    const getStatusStyles = (status: 'auspicious' | 'inauspicious' | 'neutral') => {
        if (status === 'auspicious') {
            return {
                bg: 'bg-emerald-500/10 dark:bg-emerald-500/[0.04]',
                border: 'border-emerald-500/20',
                text: 'text-emerald-700 dark:text-emerald-400',
                badge: 'bg-emerald-500 text-white'
            };
        }
        if (status === 'inauspicious') {
            return {
                bg: 'bg-rose-500/10 dark:bg-rose-500/[0.04]',
                border: 'border-rose-500/20',
                text: 'text-rose-700 dark:text-rose-400',
                badge: 'bg-rose-500 text-white'
            };
        }
        return {
            bg: 'bg-amber-500/10 dark:bg-amber-500/[0.04]',
            border: 'border-amber-500/20',
            text: 'text-amber-700 dark:text-amber-400',
            badge: 'bg-amber-500 text-white'
        };
    };

    // Overall verdict
    let overallStatus: 'auspicious' | 'inauspicious' | 'neutral' = 'neutral';
    if (tarabalaResult.status === 'auspicious' && chandrabalaResult.status === 'auspicious') {
        overallStatus = 'auspicious';
    } else if (tarabalaResult.status === 'inauspicious' || chandrabalaResult.status === 'inauspicious') {
        overallStatus = 'inauspicious';
    }

    const overallStyle = getStatusStyles(overallStatus);

    return (
        <div className="bg-white dark:bg-card-bg rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color p-6 md:p-8 mt-12">
            <h2 className="text-[1.35rem] font-bold text-primary-red mb-3 flex items-center gap-2">
                🔮 {t.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-[0.9rem] leading-relaxed mb-6">
                {t.lead}
            </p>

            <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t.rashiLabel}
                    </label>
                    <select
                        value={birthRashi}
                        onChange={(e) => { setBirthRashi(Number(e.target.value)); setIsCalculated(false); }}
                        className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                    >
                        {activeRashis.map((name, idx) => (
                            <option key={idx} value={idx}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t.nakshatraLabel}
                    </label>
                    <select
                        value={birthNakshatra}
                        onChange={(e) => { setBirthNakshatra(Number(e.target.value)); setIsCalculated(false); }}
                        className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                    >
                        {activeNakshatras.map((name, idx) => (
                            <option key={idx} value={idx}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-primary-red text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md hover:bg-primary-red/90 hover:shadow-lg text-[0.88rem] whitespace-nowrap"
                    >
                        {t.checkBtn}
                    </button>
                </div>
            </form>

            {/* Calculations Result Output */}
            {isCalculated && (
                <div className={`mt-8 p-6 rounded-2xl border ${overallStyle.border} ${overallStyle.bg} animate-in fade-in slide-in-from-bottom duration-500`}>
                    
                    {/* Header Verdict badge */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-150 dark:border-zinc-800/80 gap-3">
                        <h3 className={`text-[1.2rem] font-black ${overallStyle.text}`}>
                            {overallStatus === 'auspicious' && `🟢 ${t.verdictAuspicious}`}
                            {overallStatus === 'inauspicious' && `🔴 ${t.verdictInauspicious}`}
                            {overallStatus === 'neutral' && `🟡 ${t.verdictNeutral}`}
                        </h3>
                        
                        <div className="text-[0.78rem] text-gray-500 dark:text-gray-400 font-semibold bg-white/60 dark:bg-black/20 px-3.5 py-1.5 rounded-full border border-gray-200/40 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0">
                            <span>{t.transitSign}: <strong>{lang === 'en' ? RASHIS_EN[transitRashiIdx] : RASHIS_MAI[transitRashiIdx]}</strong></span>
                            <span className="hidden sm:inline mx-2 font-light">|</span>
                            <span>{t.transitStar}: <strong>{lang === 'en' ? NAKSHATRAS_EN[transitNakshatraIdx] : NAKSHATRAS_MAI[transitNakshatraIdx]}</strong></span>
                        </div>
                    </div>

                    {/* Tara and Chandra split details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Tarabala */}
                        <div className="flex flex-col gap-2">
                            <h4 className="text-[0.95rem] font-black text-[#2c3e50] dark:text-gray-200 flex items-center justify-between">
                                <span>⭐ {t.tarabalaTitle}</span>
                                <span className={`text-[0.7rem] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${getStatusStyles(tarabalaResult.status).badge}`}>
                                    {tarabalaResult.name}
                                </span>
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-[0.88rem] leading-relaxed">
                                {tarabalaResult.desc}
                            </p>
                        </div>

                        {/* Chandrabala */}
                        <div className="flex flex-col gap-2">
                            <h4 className="text-[0.95rem] font-black text-[#2c3e50] dark:text-gray-200 flex items-center justify-between">
                                <span>🌙 {t.chandrabalaTitle}</span>
                                <span className={`text-[0.7rem] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${getStatusStyles(chandrabalaResult.status).badge}`}>
                                    {chandrabalaResult.name}
                                </span>
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-[0.88rem] leading-relaxed">
                                {chandrabalaResult.desc} 
                                <span className="block text-[0.75rem] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                                    {t.houseRelation.replace('{house}', String(chandrabalaResult.houseNum))}
                                </span>
                            </p>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

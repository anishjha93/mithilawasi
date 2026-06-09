'use client';

import React, { useState } from 'react';
import { calculateAshtakoota, MatchingResult } from '@/utils/matching';

interface KundliMilanProps {
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

export default function KundliMilan({ lang }: KundliMilanProps) {
    const [girlName, setGirlName] = useState<string>('');
    const [girlRashi, setGirlRashi] = useState<number>(0);
    const [girlNakshatra, setGirlNakshatra] = useState<number>(0);

    const [boyName, setBoyName] = useState<string>('');
    const [boyRashi, setBoyRashi] = useState<number>(0);
    const [boyNakshatra, setBoyNakshatra] = useState<number>(0);

    const [result, setResult] = useState<MatchingResult | null>(null);

    const activeRashis = lang === 'en' ? RASHIS_EN : RASHIS_MAI;
    const activeNakshatras = lang === 'en' ? NAKSHATRAS_EN : NAKSHATRAS_MAI;

    const t = {
        en: {
            title: "Janam Kundli Milan (Compatibility Matching)",
            lead: "Determine the matrimonial compatibility between bride and groom using the traditional Vedic Ashtakoota Milan (36 Gunas) system.",
            brideSection: "Bride Details (कनिया)",
            groomSection: "Groom Details (वर)",
            nameLabel: "Full Name",
            rashiLabel: "Moon Sign (Janam Rashi)",
            nakshatraLabel: "Birth Star (Janam Nakshatra)",
            optional: "Optional",
            matchBtn: "Match Horoscope",
            resetBtn: "Reset",
            scoreTitle: "Ashtakoota Score",
            verdictTitle: "Astrological Verdict",
            thKoota: "Koota / Parameter",
            thMaxPoints: "Max Gunas",
            thPointsScored: "Points Scored",
            thImplications: "Astrological Implications",
            gunas: "Gunas Matching",
            nadiDosha: "Nadi Dosha Warning",
            bhakootDosha: "Bhakoot Dosha Warning",
            nadiAlert: "Nadi Dosha is active. Traditional matching warns of health or descendant concerns. Consult an astrologer.",
            bhakootAlert: "Bhakoot Dosha is active. May trigger emotional distance or wealth delays.",
            noDosha: "No Major Doshas detected"
        },
        hi: {
            title: "कुंडली मिलान (अष्टकूट गुण मिलान)",
            lead: "पारंपरिक वैदिक अष्टकूट मिलान (३६ गुण) पद्धति के माध्यम से वर और कन्या की कुंडली अनुकूलता की जांच करें।",
            brideSection: "कन्या का विवरण (वधू)",
            groomSection: "वर का विवरण",
            nameLabel: "पूरा नाम",
            rashiLabel: "जन्म राशि (Rashi)",
            nakshatraLabel: "जन्म नक्षत्र (Nakshatra)",
            optional: "वैकल्पिक",
            matchBtn: "कुंडली मिलान करें",
            resetBtn: "रीसेट करें",
            scoreTitle: "अष्टकूट गुण मिलान स्कोर",
            verdictTitle: "ज्योतिषीय फलादेश",
            thKoota: "कूट / मापदंड",
            thMaxPoints: "अधिकतम गुण",
            thPointsScored: "प्राप्त गुण",
            thImplications: "ज्योतिषीय विवरण",
            gunas: "गुण मिल रहे हैं",
            nadiDosha: "नाड़ी दोष चेतावनी",
            bhakootDosha: "भकूट दोष चेतावनी",
            nadiAlert: "नाड़ी दोष सक्रिय है। पारंपरिक रूप से इसे संतान और स्वास्थ्य के लिए बाधक माना जाता है। शांति पूजा आवश्यक है।",
            bhakootAlert: "भकूट दोष सक्रिय है। आपसी समझ या धन के आगमन में विलम्ब हो सकता है।",
            noDosha: "कोई गंभीर दोष नहीं है"
        },
        mai: {
            title: "कुण्डली मिलान (अष्टकूट गुण मिलान)",
            lead: "पारंपरिक वैदिक अष्टकूट मिलान (३६ गुण) पद्धति कऽ माध्यम सँ वर आ कनियाँक कुण्डली अनुकूलताक जाँच करू।",
            brideSection: "कनियाँक विवरण (वधू)",
            groomSection: "वरक विवरण",
            nameLabel: "पूरा नाम",
            rashiLabel: "जन्म राशि (Rashi)",
            nakshatraLabel: "जन्म नक्षत्र (Nakshatra)",
            optional: "वैकल्पिक",
            matchBtn: "कुण्डली मिलान करू",
            resetBtn: "रीसेट करू",
            scoreTitle: "अष्टकूट गुण मिलान स्कोर",
            verdictTitle: "ज्योतिषीय फलादेश",
            thKoota: "कूट / मापदंड",
            thMaxPoints: "अधिकतम गुण",
            thPointsScored: "प्राप्त गुण",
            thImplications: "ज्योतिषीय विवरण",
            gunas: "गुण मिलि रहल अछि",
            nadiDosha: "नाड़ी दोष चेतावनी",
            bhakootDosha: "भकूट दोष चेतावनी",
            nadiAlert: "नाड़ी दोष सक्रिय अछि। पारंपरिक रूप सँ एकरा संतान आ स्वास्थ्यक लेल बाधक मानल जाइत अछि। शांति पूजा आवश्यक अछि।",
            bhakootAlert: "भकूट दोष सक्रिय अछि। आपसी समझ वा धनक आगमन में विलम्ब भऽ सकैत अछि।",
            noDosha: "कोनो गंभीर दोष नहि अछि"
        }
    }[lang];

    const handleMatch = (e: React.FormEvent) => {
        e.preventDefault();
        const res = calculateAshtakoota(girlRashi, girlNakshatra, boyRashi, boyNakshatra, lang);
        setResult(res);
    };

    const handleReset = () => {
        setGirlName('');
        setGirlRashi(0);
        setGirlNakshatra(0);
        setBoyName('');
        setBoyRashi(0);
        setBoyNakshatra(0);
        setResult(null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 24) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 18) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    return (
        <div className="flex flex-col gap-8">
            
            {/* Form Inputs Container */}
            <div className="bg-white dark:bg-card-bg p-6 md:p-8 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                <header className="mb-8 border-b border-border-color pb-4">
                    <h2 className="text-[1.4rem] font-bold text-primary-red">{t.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-[0.9rem] mt-2 leading-relaxed">{t.lead}</p>
                </header>

                <form onSubmit={handleMatch} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        
                        {/* Bride Column */}
                        <div className="flex flex-col gap-5 p-5 bg-pink-500/[0.02] border border-pink-500/5 dark:border-pink-500/10 rounded-2xl">
                            <h3 className="text-[1.15rem] font-black text-pink-600 dark:text-pink-400 border-b border-pink-500/10 pb-2">
                                👰 {t.brideSection}
                            </h3>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.nameLabel} <span className="text-[0.7rem] italic opacity-60">({t.optional})</span></label>
                                <input
                                    type="text"
                                    value={girlName}
                                    onChange={(e) => setGirlName(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                                    placeholder="e.g. Sita"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.rashiLabel}</label>
                                <select
                                    value={girlRashi}
                                    onChange={(e) => setGirlRashi(Number(e.target.value))}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                                >
                                    {activeRashis.map((name, idx) => (
                                        <option key={idx} value={idx}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.nakshatraLabel}</label>
                                <select
                                    value={girlNakshatra}
                                    onChange={(e) => setGirlNakshatra(Number(e.target.value))}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                                >
                                    {activeNakshatras.map((name, idx) => (
                                        <option key={idx} value={idx}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Groom Column */}
                        <div className="flex flex-col gap-5 p-5 bg-primary-red/[0.02] border border-primary-red/5 dark:border-primary-red/10 rounded-2xl">
                            <h3 className="text-[1.15rem] font-black text-primary-red border-b border-primary-red/10 pb-2">
                                🤵 {t.groomSection}
                            </h3>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.nameLabel} <span className="text-[0.7rem] italic opacity-60">({t.optional})</span></label>
                                <input
                                    type="text"
                                    value={boyName}
                                    onChange={(e) => setBoyName(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                                    placeholder="e.g. Ram"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.rashiLabel}</label>
                                <select
                                    value={boyRashi}
                                    onChange={(e) => setBoyRashi(Number(e.target.value))}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                                >
                                    {activeRashis.map((name, idx) => (
                                        <option key={idx} value={idx}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.nakshatraLabel}</label>
                                <select
                                    value={boyNakshatra}
                                    onChange={(e) => setBoyNakshatra(Number(e.target.value))}
                                    className="bg-white dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem] font-medium"
                                >
                                    {activeNakshatras.map((name, idx) => (
                                        <option key={idx} value={idx}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-4 border-t border-border-color pt-6 justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 text-[0.92rem]"
                        >
                            {t.resetBtn}
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-red text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:bg-primary-red/90 hover:shadow-lg text-[0.92rem]"
                        >
                            💖 {t.matchBtn}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Output Displays */}
            {result && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom duration-500">
                    
                    {/* Verdict Card */}
                    <div className="bg-white dark:bg-card-bg p-6 md:p-8 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                        <h3 className="text-[1.2rem] font-bold text-primary-red mb-4">🏆 {t.verdictTitle}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            
                            {/* Visual Score Circle */}
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl border border-gray-100 dark:border-zinc-850">
                                <span className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.scoreTitle}</span>
                                <div className={`text-[3.2rem] font-black tracking-tight ${getScoreColor(result.totalScore)}`}>
                                    {result.totalScore} <span className="text-[1.5rem] font-bold text-gray-400">/ 36</span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider">{t.gunas}</span>
                            </div>

                            {/* Text Description */}
                            <div className="md:col-span-8 flex flex-col gap-4">
                                <p className="text-[1.1rem] text-[#2c3e50] dark:text-gray-200 font-extrabold leading-relaxed">
                                    {result.verdict}
                                </p>

                                {/* Dosha badges list */}
                                <div className="flex flex-wrap gap-3">
                                    {result.hasNadiDosha && (
                                        <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-rose-500/20">
                                            ⚠️ {t.nadiDosha}
                                        </span>
                                    )}
                                    {result.hasBhakootDosha && (
                                        <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-rose-500/20">
                                            ⚠️ {t.bhakootDosha}
                                        </span>
                                    )}
                                    {!result.hasNadiDosha && !result.hasBhakootDosha && (
                                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/20">
                                            ✅ {t.noDosha}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dosha detailed alarms */}
                        {(result.hasNadiDosha || result.hasBhakootDosha) && (
                            <div className="mt-6 p-4 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl flex flex-col gap-2">
                                {result.hasNadiDosha && <p className="text-xs font-bold text-rose-600 dark:text-rose-400">🔴 {t.nadiAlert}</p>}
                                {result.hasBhakootDosha && <p className="text-xs font-bold text-rose-600 dark:text-rose-400">🔴 {t.bhakootAlert}</p>}
                            </div>
                        )}
                    </div>

                    {/* Breakdown Table Card */}
                    <div className="bg-white dark:bg-card-bg p-6 md:p-8 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                        <h3 className="text-[1.2rem] font-bold text-primary-red mb-6">📊 Detailed Guna Match Breakdown</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-color text-[0.8rem] uppercase text-gray-400 font-bold">
                                        <th className="py-3 px-4">{t.thKoota}</th>
                                        <th className="py-3 px-4 text-center">{t.thMaxPoints}</th>
                                        <th className="py-3 px-4 text-center">{t.thPointsScored}</th>
                                        <th className="py-3 px-4">{t.thImplications}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[0.92rem] divide-y divide-gray-100 dark:divide-zinc-850">
                                    {result.kootas.map((koota, index) => (
                                        <tr key={index} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30">
                                            <td className="py-3.5 px-4 font-bold text-[#2c3e50] dark:text-gray-200">
                                                {koota.name}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-bold text-gray-400">
                                                {koota.maxScore}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-extrabold text-accent-gold text-[1rem]">
                                                {koota.score}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-semibold leading-relaxed text-gray-500 dark:text-gray-400 max-w-[320px]">
                                                {koota.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
}

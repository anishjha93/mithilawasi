'use client';

import React, { useState, useEffect } from 'react';

interface DailyWordData {
    word: string;
    meaning: string;
    sentence: string;
}

interface DailyWordProps {
    title: string;
    words: DailyWordData[];
}

const DailyWord: React.FC<DailyWordProps> = ({ title, words }) => {
    const [index, setIndex] = useState<number | null>(null);

    useEffect(() => {
        // Calculate index based on current date to ensure daily rotation
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        setIndex(day % words.length);
    }, [words.length]);

    // Prevent hydration mismatch by returning null until client-side calculation
    if (index === null) return null;

    const todayWord = words[index];

    return (
        <div className="bg-gradient-to-br from-white to-[#fff9f0] border border-[#ffe4e1] rounded-xl p-6 shadow-sm mb-8 text-center relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-[#ff9933] before:to-[#ff4d4d]">
            <div className="text-[0.9rem] text-[#cc3300] uppercase tracking-wider mb-4 font-semibold">{title}</div>
            <div className="text-4xl md:text-[2.5rem] font-bold text-[#333] mb-2">{todayWord.word}</div>
            <div className="text-lg text-[#666] mb-6 italic">{todayWord.meaning}</div>
            <div className="bg-[#ff9933]/10 p-4 rounded-lg border-l-4 border-[#ff9933] text-left">
                <span className="block font-semibold text-[0.8rem] text-[#cc3300] mb-1.5">Usage</span>
                <div className="text-[1.1rem] text-[#444] leading-relaxed">{todayWord.sentence}</div>
            </div>
        </div>
    );
};

export default DailyWord;

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download } from 'lucide-react';

const totalPages = 36;

const t = {
    en: {
        back: 'Back to Calendar',
        title: 'Original Maithili Panchang Scans',
        lead: 'Browse the complete scanned pages of the traditional Maithili Panchang 2026-2027 (Vikram Samvat 2083-2084).',
        page: 'Page',
        next: 'Next',
        prev: 'Prev',
        close: 'Close',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        download: 'Download Page',
        jump: 'Jump to Page',
        cover: 'Cover Page',
        preface: 'Preface & Legend'
    },
    hi: {
        back: 'पंचांग पर वापस',
        title: 'मूल मैथिली पंचांग पत्रक',
        lead: 'पारंपरिक मैथिली पंचांग २०२६-२०२७ (विक्रम संवत २०८३-२०८४) के सभी मूल स्कैन किए गए पृष्ठों को यहाँ देखें।',
        page: 'पृष्ठ',
        next: 'अगला',
        prev: 'पिछला',
        close: 'बंद करें',
        zoomIn: 'ज़ूम इन',
        zoomOut: 'ज़ूम आउट',
        download: 'डाउनलोड करें',
        jump: 'सीधे पृष्ठ पर जाएँ',
        cover: 'मुख्य पृष्ठ (कवर)',
        preface: 'प्रस्तावना और विवरण'
    },
    mai: {
        back: 'पंचांग पर वापस',
        title: 'मूल मैथिली पंचांग पत्रक',
        lead: 'पारंपरिक मैथिली पंचांग २०२६-२०२७ (विक्रम संवत २०८३-२०८४) कऽ सभ मूल स्कैन कएल गेल पन्ना सभ नीचाँ देखू।',
        page: 'पन्ना',
        next: 'अगला',
        prev: 'पिछला',
        close: 'बंद करू',
        zoomIn: 'ज़ूम इन',
        zoomOut: 'ज़ूम आउट',
        download: 'डाउनलोड करू',
        jump: 'सीधे पन्ना पर जाऊ',
        cover: 'मुख्य पृष्ठ (कवर)',
        preface: 'प्रस्तावना आओर विवरण'
    }
};

export default function PanchangPagesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const locale = (lang === 'hi' || lang === 'mai' ? lang : 'en') as 'en' | 'hi' | 'mai';
    const dict = t[locale];

    const [activePage, setActivePage] = useState<number | null>(null);
    const [zoom, setZoom] = useState<number>(1);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activePage === null) return;
            if (e.key === 'Escape') setActivePage(null);
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePage]);

    const handleNext = () => {
        if (activePage === null) return;
        setActivePage(activePage === totalPages ? 1 : activePage + 1);
        setZoom(1);
    };

    const handlePrev = () => {
        if (activePage === null) return;
        setActivePage(activePage === 1 ? totalPages : activePage - 1);
        setZoom(1);
    };

    const getPageLabel = (page: number) => {
        if (page === 1) return dict.cover;
        if (page === 2) return dict.preface;
        return `${dict.page} ${page}`;
    };

    return (
        <main className="max-w-[1280px] mx-auto px-4 py-12">
            {/* Header section */}
            <div className="text-center mb-16 animate-in fade-in duration-700">
                <Link href={`/${lang}/calendar`} className="inline-flex items-center text-primary-red no-underline font-semibold mb-8 transition-transform hover:-translate-x-1">
                    ← {dict.back}
                </Link>
                <h1 className="text-[3rem] font-bold text-primary-red tracking-tight">{dict.title}</h1>
                <p className="text-[1.15rem] text-gray-700 dark:text-gray-300 max-w-[800px] mx-auto mt-6 leading-relaxed">
                    {dict.lead}
                </p>
            </div>

            {/* Grid of scanned pages */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const paddedNumber = String(pageNumber).padStart(2, '0');
                    return (
                        <div
                            key={pageNumber}
                            onClick={() => {
                                setActivePage(pageNumber);
                                setZoom(1);
                            }}
                            className="bg-white dark:bg-card-bg rounded-[20px] p-4 shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-border-color cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-premium hover:border-primary-red/30 flex flex-col items-center group"
                        >
                            <div className="w-full aspect-[3/4] bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden mb-4 relative border border-border-color">
                                <img
                                    src={`/panchang-pages/page_${paddedNumber}.jpg`}
                                    alt={`Maithili Panchang Page ${paddedNumber}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="bg-white/95 text-primary-red text-[0.85rem] font-bold px-4 py-2 rounded-full shadow-lg">
                                        {lang === 'en' ? 'Click to View' : (lang === 'hi' ? 'देखने के लिए क्लिक करें' : 'देखबाक लेल क्लिक करू')}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-[1rem] font-bold text-gray-900 dark:text-gray-100">
                                {getPageLabel(pageNumber)}
                            </h3>
                        </div>
                    );
                })}
            </div>

            {/* Lightbox / Overlay modal */}
            {activePage !== null && (
                <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-between p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-300">
                    
                    {/* Lightbox Topbar */}
                    <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                            <span className="font-extrabold text-[1.2rem]">
                                {getPageLabel(activePage)} / {totalPages}
                            </span>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-[0.85rem] opacity-60">{dict.jump}:</span>
                                <select 
                                    value={activePage} 
                                    onChange={(e) => {
                                        setActivePage(Number(e.target.value));
                                        setZoom(1);
                                    }}
                                    className="bg-zinc-800 text-white border border-white/20 rounded px-2 py-1 text-[0.9rem] focus:outline-none"
                                >
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {getPageLabel(index + 1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Zoom controls */}
                            <button 
                                onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.5))}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                                title={dict.zoomIn}
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button 
                                onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.75))}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                                title={dict.zoomOut}
                            >
                                <ZoomOut size={20} />
                            </button>
                            
                            {/* Download */}
                            <a
                                href={`/panchang-pages/page_${String(activePage).padStart(2, '0')}.jpg`}
                                download={`Maithili_Panchang_Page_${activePage}.jpg`}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white flex items-center justify-center"
                                title={dict.download}
                            >
                                <Download size={20} />
                            </a>

                            {/* Close */}
                            <button
                                onClick={() => setActivePage(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white flex items-center justify-center"
                                title={dict.close}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Lightbox Center Content */}
                    <div className="flex-grow flex items-center justify-between gap-4 py-6 relative overflow-hidden select-none">
                        
                        {/* Prev button */}
                        <button
                            onClick={handlePrev}
                            className="bg-white/5 hover:bg-white/15 text-white/80 hover:text-white p-4 rounded-full transition-all border border-white/10 shadow-lg select-none z-10"
                        >
                            <ChevronLeft size={36} />
                        </button>

                        {/* Scanned Image Container */}
                        <div className="flex-grow h-full flex items-center justify-center overflow-auto p-2">
                            <div 
                                className="transition-transform duration-300 max-h-full max-w-full flex items-center justify-center"
                                style={{ transform: `scale(${zoom})` }}
                            >
                                <img
                                    src={`/panchang-pages/page_${String(activePage).padStart(2, '0')}.jpg`}
                                    alt={`Panchang Page ${activePage}`}
                                    className="max-h-[75vh] md:max-h-[82vh] w-auto h-auto rounded-lg shadow-2xl object-contain select-none pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            className="bg-white/5 hover:bg-white/15 text-white/80 hover:text-white p-4 rounded-full transition-all border border-white/10 shadow-lg select-none z-10"
                        >
                            <ChevronRight size={36} />
                        </button>
                    </div>

                    {/* Lightbox Footer */}
                    <div className="text-center text-white/50 text-[0.85rem] border-t border-white/10 pt-4">
                        {lang === 'en' ? 'Tip: Use Left and Right arrow keys to navigate, Esc to close.' : (lang === 'hi' ? 'सुझाव: नेविगेट करने के लिए बाएं और दाएं तीर कुंजियों का उपयोग करें, बंद करने के लिए Esc दबाएं।' : 'सुझाव: नेविगेट करबाक लेल बामा आ दहिना तीर कुंजीक प्रयोग करू, बंद करबाक लेल Esc दबाऊ।')}
                    </div>
                </div>
            )}
        </main>
    );
}

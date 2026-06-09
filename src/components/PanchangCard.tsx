'use client';

import React from 'react';

interface PanchangData {
    title: string;
    dateStr: string;
    month: string;
    monthValue: string;
    tithi: string;
    tithiValue: string;
    nakshatra: string;
    nakshatraValue: string;
    paksha: string;
    pakshaValue: string;
    sunrise: string;
    sunriseValue: string;
    sunset: string;
    sunsetValue: string;
    isPanchak?: boolean;
    panchakLabel?: string;
    isPurnima?: boolean;
    purnimaLabel?: string;
    isAmavasya?: boolean;
    amavasyaLabel?: string;
    sankrantiName?: string | null;
    sankrantiLabel?: string;
    isLagan?: boolean;
    laganLabel?: string;
    isMundan?: boolean;
    mundanLabel?: string;
    isUpnayan?: boolean;
    upnayanLabel?: string;
    isDuragaman?: boolean;
    duragamanLabel?: string;
    // Yog and Karan
    yog?: string;
    yogValue?: string;
    karan?: string;
    karanValue?: string;
    // Kaal timings
    rahuKaal?: string;
    rahuKaalValue?: string;
    yamagandaKaal?: string;
    yamagandaKaalValue?: string;
    gulikaKaal?: string;
    gulikaKaalValue?: string;
    inauspiciousTimings?: string;
    // New Astro features
    sunRashi?: string;
    moonRashi?: string;
    abhijitMuhurta?: string;
    moonrise?: string;
    moonset?: string;
}

const PanchangCard: React.FC<{ data: PanchangData }> = ({ data }) => {
    return (
        <div className="bg-paper-texture dark:bg-card-bg border-madhubani rounded-xl p-6 md:p-8 my-8 relative overflow-hidden shadow-xl group animate-fade-in-up">
            {/* Decorative background pattern overlay */}
            <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center mb-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary-red/40 to-transparent"></div>
                <div className="text-[0.8rem] uppercase tracking-[3px] text-gray-500 dark:text-gray-400 mb-3 font-bold font-body">{data.dateStr}</div>
                <div className="text-center font-heading text-3xl md:text-[2.5rem] text-primary-red flex items-center justify-center gap-4 drop-shadow-sm">
                    <span className="text-2xl opacity-60">🪔</span>
                    {data.title}
                    <span className="text-2xl opacity-60">🪔</span>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary-yellow/60 rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 relative z-10">
                <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                    <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.month}</span>
                    <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.monthValue}</span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                    <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.tithi}</span>
                    <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.tithiValue}</span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                    <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.nakshatra}</span>
                    <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.nakshatraValue}</span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                    <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.paksha}</span>
                    <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.pakshaValue}</span>
                </div>
                {data.yog && (
                    <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                        <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.yog}</span>
                        <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.yogValue}</span>
                    </div>
                )}
                {data.karan && (
                    <div className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-100 dark:border-white/10 rounded-lg transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-white/30 group/item text-center">
                        <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{data.karan}</span>
                        <span className="text-xl font-heading text-mithila-ink dark:text-white font-bold group-hover/item:text-primary-red transition-colors">{data.karanValue}</span>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 flex justify-center gap-12 border-t border-dashed border-orange-200 dark:border-white/10 max-md:flex-col max-md:items-center max-md:gap-6 relative z-10">
                <div className="flex items-center gap-4 bg-white/40 dark:bg-white/10 px-6 py-3 rounded-full border border-orange-100/50 dark:border-white/10">
                    <span className="text-3xl filter drop-shadow-sm">🌅</span>
                    <div>
                        <span className="text-[0.8rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold block mb-1">{data.sunrise}</span>
                        <span className="font-heading text-xl text-mithila-ink dark:text-white font-bold">{data.sunriseValue}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/40 dark:bg-white/10 px-6 py-3 rounded-full border border-orange-100/50 dark:border-white/10">
                    <span className="text-3xl filter drop-shadow-sm">🌇</span>
                    <div>
                        <span className="text-[0.8rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold block mb-1">{data.sunset}</span>
                        <span className="font-heading text-xl text-mithila-ink dark:text-white font-bold">{data.sunsetValue}</span>
                    </div>
                </div>
            </div>

            {/* New Astronomical & Auspicious Section */}
            {(data.sunRashi || data.moonRashi || data.abhijitMuhurta || data.moonrise || data.moonset) && (
                <div className="mt-8 pt-6 border-t border-dashed border-orange-200 dark:border-white/10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Rashi info */}
                        {(data.sunRashi || data.moonRashi) && (
                            <div className="p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-orange-100/50 dark:border-white/10 flex flex-col gap-2">
                                <span className="text-[0.75rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold text-center border-b border-orange-100/50 dark:border-white/10 pb-1.5 mb-1">
                                    🌌 Rashi (राशि)
                                </span>
                                <div className="flex justify-around text-center mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[0.7rem] uppercase tracking-wider text-gray-400">Sun (सूर्य)</span>
                                        <span className="font-heading font-black text-[1.15rem] text-mithila-ink dark:text-white">{data.sunRashi || '--'}</span>
                                    </div>
                                    <div className="w-[1px] bg-orange-100/50 dark:bg-white/10"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.7rem] uppercase tracking-wider text-gray-400">Moon (चन्द्र)</span>
                                        <span className="font-heading font-black text-[1.15rem] text-mithila-ink dark:text-white">{data.moonRashi || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Abhijit Muhurta */}
                        {data.abhijitMuhurta && (
                            <div className="p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-orange-100/50 dark:border-white/10 flex flex-col gap-2 text-center items-center justify-center">
                                <span className="text-[0.75rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                                    ✨ Abhijit Muhurta (अभिजीत मुहूर्त)
                                </span>
                                <span className="font-heading text-xl text-primary-red dark:text-orange-400 font-black tracking-wide mt-1">
                                    {data.abhijitMuhurta}
                                </span>
                            </div>
                        )}

                        {/* Moonrise/Moonset */}
                        {(data.moonrise || data.moonset) && (
                            <div className="p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-orange-100/50 dark:border-white/10 flex flex-col gap-2">
                                <span className="text-[0.75rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold text-center border-b border-orange-100/50 dark:border-white/10 pb-1.5 mb-1">
                                    🌙 Moon Timings (चन्द्रोदय/चन्द्रास्त)
                                </span>
                                <div className="flex justify-around text-center mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[0.7rem] uppercase tracking-wider text-gray-400">Moonrise</span>
                                        <span className="font-heading font-black text-[1.05rem] text-mithila-ink dark:text-white">{data.moonrise || '--'}</span>
                                    </div>
                                    <div className="w-[1px] bg-orange-100/50 dark:bg-white/10"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.7rem] uppercase tracking-wider text-gray-400">Moonset</span>
                                        <span className="font-heading font-black text-[1.05rem] text-mithila-ink dark:text-white">{data.moonset || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(data.rahuKaal || data.yamagandaKaal || data.gulikaKaal) && (
                <div className="mt-8 p-6 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-2xl animate-pulse">⚠️</span>
                        <span className="text-[1.1rem] font-bold uppercase tracking-widest text-primary-red dark:text-red-400 border-b-2 border-primary-red/20 dark:border-red-400/30 pb-1">{data.inauspiciousTimings}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        {data.rahuKaal && (
                            <div className="flex flex-col gap-1 p-3 px-4 bg-white dark:bg-white/5 rounded-lg border-l-4 border-primary-red dark:border-red-500 shadow-sm">
                                <span className="text-[0.8rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">{data.rahuKaal}</span>
                                <span className="text-lg font-heading font-bold text-mithila-ink dark:text-white">{data.rahuKaalValue}</span>
                            </div>
                        )}
                        {data.yamagandaKaal && (
                            <div className="flex flex-col gap-1 p-3 px-4 bg-white dark:bg-white/5 rounded-lg border-l-4 border-orange-400 dark:border-orange-500 shadow-sm">
                                <span className="text-[0.8rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">{data.yamagandaKaal}</span>
                                <span className="text-lg font-heading font-bold text-mithila-ink dark:text-white">{data.yamagandaKaalValue}</span>
                            </div>
                        )}
                        {data.gulikaKaal && (
                            <div className="flex flex-col gap-1 p-3 px-4 bg-white dark:bg-white/5 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                                <span className="text-[0.8rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">{data.gulikaKaal}</span>
                                <span className="text-lg font-heading font-bold text-mithila-ink dark:text-white">{data.gulikaKaalValue}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(data.isPanchak || data.isPurnima || data.isAmavasya || data.sankrantiName || data.isLagan || data.isMundan || data.isUpnayan || data.isDuragaman) && (
                <div className="mt-8 pt-6 border-t border-orange-200/60 flex flex-wrap justify-center gap-3 relative z-10">
                    {data.isPanchak && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-red-100 text-red-800 border border-red-200">{data.panchakLabel}</div>}
                    {data.isPurnima && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-yellow-100 text-yellow-800 border border-yellow-200">{data.purnimaLabel}</div>}
                    {data.isAmavasya && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-gray-800 text-white border border-gray-700">{data.amavasyaLabel}</div>}
                    {data.isLagan && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-pink-100 text-pink-800 border border-pink-200">{data.laganLabel}</div>}
                    {data.isMundan && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-purple-100 text-purple-800 border border-purple-200">{data.mundanLabel}</div>}
                    {data.isUpnayan && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-blue-100 text-blue-800 border border-blue-200">{data.upnayanLabel}</div>}
                    {data.isDuragaman && <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-teal-100 text-teal-800 border border-teal-200">{data.duragamanLabel}</div>}
                    {data.sankrantiName && (
                        <div className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm bg-orange-500 text-white border border-orange-600">
                            {data.sankrantiLabel}: {data.sankrantiName}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PanchangCard;

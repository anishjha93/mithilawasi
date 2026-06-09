'use client';

import React from 'react';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

const HistoryTimeline = ({ events, lang }: { events: TimelineEvent[], lang: string }) => {
    return (
        <div className="relative py-12 px-4 md:px-0">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-red/10 via-primary-red/40 to-primary-red/10 -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12 relative flex flex-col">
                {events.map((event, index) => (
                    <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} animate-fade-in-up`} style={{ animationDelay: `${index * 0.15}s` }}>
                        
                        {/* Content Card */}
                        <div className="w-full md:w-[45%]">
                            <div className="glass-morphism p-8 rounded-2xl hover:shadow-premium transition-all duration-500 hover:-translate-y-2 group border border-primary-red/5">
                                <span className="text-primary-red font-black text-2xl md:text-3xl font-heading mb-2 block group-hover:scale-105 transition-transform origin-left">{event.year}</span>
                                <h3 className="text-xl font-bold text-mithila-ink mb-3">{event.title}</h3>
                                <p className="text-text-muted leading-relaxed group-hover:text-foreground transition-colors">{event.description}</p>
                            </div>
                        </div>

                        {/* Dot in Center */}
                        <div className="relative z-10 hidden md:flex items-center justify-center w-[10%] shrink-0">
                            <div className="w-6 h-6 rounded-full bg-white dark:bg-black border-4 border-primary-red shadow-lg group-hover:scale-125 transition-transform duration-500 relative">
                                <div className="absolute inset-0 bg-primary-red/20 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Spacer for other side */}
                        <div className="hidden md:block w-[45%]"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTimeline;

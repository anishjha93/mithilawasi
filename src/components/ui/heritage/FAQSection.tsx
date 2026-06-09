'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
    title?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ items, title = "Frequently Asked Questions" }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="my-16 md:my-24">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-mithila-ink mb-10 header-heritage">
                {title}
            </h2>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className={`group border border-primary-red/10 rounded-2xl overflow-hidden transition-all duration-500 ${openIndex === index ? 'shadow-premium bg-white dark:bg-card-bg' : 'hover:border-primary-red/30'}`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                        >
                            <span className={`text-lg md:text-xl font-heading font-bold transition-colors duration-300 ${openIndex === index ? 'text-primary-red' : 'text-mithila-ink'}`}>
                                {item.question}
                            </span>
                            <ChevronDown 
                                className={`transition-transform duration-500 text-primary-red/60 ${openIndex === index ? 'rotate-180 text-primary-red' : 'group-hover:translate-y-1'}`} 
                                size={24} 
                            />
                        </button>
                        <div 
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-6 md:p-8 pt-0 text-text-muted leading-relaxed font-body text-base md:text-lg border-t border-primary-red/5">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

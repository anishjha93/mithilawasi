'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, Hash, FileText, Image as ImageIcon, Type } from 'lucide-react';

interface SEOChecklistProps {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    slug: string;
}

export default function SEOChecklist({ title, excerpt, content, image, slug }: SEOChecklistProps) {
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    const checks = [
        {
            icon: <Type size={12} />,
            label: "Title",
            status: title.length >= 40 && title.length <= 60 ? 'success' : title.length > 0 ? 'warning' : 'error',
            info: `${title.length}/60`,
        },
        {
            icon: <FileText size={12} />,
            label: "Excerpt",
            status: excerpt.length >= 120 && excerpt.length <= 160 ? 'success' : excerpt.length > 0 ? 'warning' : 'error',
            info: `${excerpt.length}/160`,
        },
        {
            icon: <ImageIcon size={12} />,
            label: "Image",
            status: image ? 'success' : 'error',
            info: image ? "Set" : "Missing",
        },
        {
            icon: <Hash size={12} />,
            label: "Words",
            status: wordCount >= 300 ? 'success' : wordCount > 50 ? 'warning' : 'error',
            info: `${wordCount}`,
        }
    ];

    const score = Math.round((checks.filter(c => c.status === 'success').length / checks.length) * 100);

    return (
        <div className="bg-white border-b border-orange-100 flex items-center divide-x divide-gray-100 h-11 px-6 shadow-sm relative z-20">
            <div className="flex items-center gap-2 pr-6 border-r border-orange-50">
                <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-widest whitespace-nowrap">SEO Score</span>
                <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${score > 80 ? 'bg-green-100 text-green-700' :
                    score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {score}%
                </div>
            </div>

            <div className="flex items-center gap-8 pl-6 overflow-x-auto no-scrollbar scrollbar-hide">
                {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${check.status === 'success' ? 'bg-green-50 text-green-600' :
                            check.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                            }`}>
                            {check.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">{check.label}</span>
                            <span className={`text-[10px] font-bold whitespace-nowrap ${check.status === 'success' ? 'text-green-700' :
                                check.status === 'warning' ? 'text-amber-700' : 'text-red-700'
                                }`}>{check.info}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="ml-auto pl-6 flex items-center gap-2 text-gray-300">
                <Info size={14} className="hover:text-orange-400 cursor-help transition-colors" />
            </div>
        </div>
    );
}

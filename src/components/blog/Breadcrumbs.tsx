"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    lang: string;
    items: {
        label: string;
        href?: string;
    }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ lang, items }) => {
    return (
        <nav className="flex mb-6 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link href={`/${lang}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-800 transition-colors">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="ml-1 text-sm font-medium text-slate-500 hover:text-red-800 transition-colors md:ml-2"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="ml-1 text-sm font-bold text-slate-900 md:ml-2 truncate max-w-[200px] md:max-w-xs">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;

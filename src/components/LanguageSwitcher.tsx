'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Locale = 'en' | 'hi' | 'mai';

interface LanguageSwitcherProps {
    lang: Locale;
    dict: {
        selectLanguage?: string;
        en?: string;
        hi?: string;
        mai?: string;
    };
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, dict }) => {
    const pathname = usePathname();

    // Helper to switch language while keeping the path
    const redirectedPathName = (locale: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'mai', label: 'मैथिली' }
    ];

    return (
        <div className="hidden max-md:block bg-card-bg border-b border-border-color py-1.5 relative z-10 shadow-sm">
            <div className="container flex items-center justify-center gap-3">
                <div className="flex gap-2">
                    {languages.map((l) => (
                        <Link
                            key={l.code}
                            href={redirectedPathName(l.code)}
                            className={`px-3 py-1 rounded-full no-underline text-[0.8rem] font-bold transition-all duration-300 flex items-center gap-1.5 border ${lang === l.code
                                ? 'bg-accent-gold text-white border-accent-gold shadow-sm'
                                : 'text-foreground border-border-color hover:border-accent-gold bg-card-bg'
                                }`}
                        >
                            <span>{l.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;

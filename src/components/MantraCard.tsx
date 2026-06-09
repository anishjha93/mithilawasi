'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share, Copy, Check, Volume2, ArrowUpRight } from 'lucide-react';
interface MantraProps {
    mantra: {
        slug: string;
        locales: {
            en: { title: string; meaning: string; transliteration?: string };
            hi: { title: string; meaning: string; transliteration?: string };
            mai: { title: string; meaning: string; transliteration?: string };
        };
        mantra: string;
        tags: string[];
        externalLink?: string;
        category?: string;
    };
    lang: 'en' | 'hi' | 'mai';
    dictionary: any;
    isDetailsPage?: boolean;
}

const MantraCard: React.FC<MantraProps> = ({ mantra, lang, dictionary, isDetailsPage = false }) => {
    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleCopy = () => {
        const locale = mantra.locales[lang] || mantra.locales.en;
        const textToCopy = `${locale.title}\n\n${mantra.mantra}\n\nMeaning: ${locale.meaning}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(mantra.mantra);
            utterance.lang = 'hi-IN'; // Sanskrit usually works best with Hindi voice
            utterance.rate = 0.8; // Slower for mantras

            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            const shareUrl = `${window.location.origin}/${lang}/mantras/${mantra.slug}`;
            const locale = mantra.locales[lang] || mantra.locales.en;
            try {
                await navigator.share({
                    title: locale.title,
                    text: `${mantra.mantra}\n\n${locale.meaning}`,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div
            className="bg-paper-texture border-madhubani rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl group relative"
            aria-label={`${lang === 'mai' ? 'मंत्र' : (lang === 'hi' ? 'मंत्र' : 'Mantra')}: ${(mantra.locales[lang] || mantra.locales.en).title}`}
        >
            {/* Decorative background pattern overlay */}
            <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />

            {/* Header */}
            <div className="bg-primary-red/5 dark:bg-primary-red/10 p-4 md:px-6 border-b border-rose-100 dark:border-red-900/30 flex justify-between items-start relative z-10">
                {isDetailsPage ? (
                    <h1 className="font-heading font-bold text-2xl text-mithila-ink m-0">
                        {(mantra.locales[lang] || mantra.locales.en).title}
                    </h1>
                ) : (
                    mantra.externalLink ? (
                        <a href={mantra.externalLink} target="_blank" rel="noopener noreferrer" className="no-underline cursor-pointer group/link">
                            <h3 className="font-heading font-bold text-xl text-mithila-ink m-0 group-hover/link:text-primary-red transition-colors flex items-center gap-2">
                                {(mantra.locales[lang] || mantra.locales.en).title} <ArrowUpRight size={16} className="opacity-50" />
                            </h3>
                        </a>
                    ) : (
                        <Link href={`/${lang}/mantras/${mantra.slug}`} className="no-underline cursor-pointer group/link">
                            <h3 className="font-heading font-bold text-xl text-mithila-ink m-0 group-hover/link:text-primary-red transition-colors">
                                {(mantra.locales[lang] || mantra.locales.en).title}
                            </h3>
                        </Link>
                    )
                )}

                <div className="flex gap-2 flex-wrap justify-end">
                    {mantra.tags.map(tag => (
                        <span key={tag} className="text-[0.65rem] uppercase tracking-wider px-2 py-1 bg-white dark:bg-zinc-800 border border-rose-200 dark:border-red-900/40 text-rose-800 dark:text-red-300 rounded-full font-bold shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col gap-8 relative z-10">
                {/* Content Area */}
                <div className={`text-center ${mantra.category === 'vrat_katha' ? 'text-left max-w-[65ch] mx-auto' : ''}`}>
                    <div className={`font-medium text-mithila-ink mb-2 font-heading ${mantra.category === 'vrat_katha' ? 'text-[1.15rem] leading-relaxed text-justify max-md:text-base max-md:text-left' : 'text-3xl md:text-[2rem] leading-snug'}`}>
                        {isDetailsPage
                            ? mantra.mantra.split('\n').map((line, i) => {
                                // Simple parser for **bold** text
                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                return (
                                    <span key={i} className="block mb-2">
                                        {parts.map((part, j) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={j} className="font-bold text-primary-red">{part.slice(2, -2)}</strong>;
                                            }
                                            return part;
                                        })}
                                    </span>
                                );
                            })
                            : (
                                <>
                                    <span className="block mb-1 text-primary-red">
                                        {mantra.mantra.split('\n')[0].replace(/\*\*/g, '')}...
                                    </span>
                                </>
                            )
                        }
                    </div>
                </div>

                {/* Transliteration */}
                {lang === 'en' && isDetailsPage && mantra.locales.en.transliteration && (
                    <div className="bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 p-4 rounded-lg italic text-[1rem] text-gray-600 dark:text-gray-400 text-center font-serif">
                        <p>
                            "{mantra.locales.en.transliteration}"
                        </p>
                    </div>
                )}

                {/* Meaning */}
                <div className="text-center relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-4 w-1/2 mx-auto"></div>
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 font-bold block">
                        {lang === 'mai' ? 'भावार्थ' : (lang === 'hi' ? 'अर्थ' : 'Meaning')}
                    </span>
                    <p className={`text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-body ${!isDetailsPage ? 'line-clamp-2' : ''}`}>
                        {(mantra.locales[lang] || mantra.locales.en).meaning}
                    </p>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-t border-rose-100 dark:border-red-900/20 relative z-10">
                <button
                    onClick={handleSpeak}
                    className={`cursor-pointer p-3 rounded-full transition-all duration-300 flex items-center justify-center border hover:shadow-md active:scale-95 ${isSpeaking ? 'bg-primary-red text-white border-primary-red animate-pulse' : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400 hover:border-primary-red hover:text-primary-red dark:hover:text-primary-red'}`}
                    title={dictionary.listen || "Listen"}
                    aria-label={isSpeaking ? (lang === 'en' ? 'Stop Listening' : 'सुनना बंद करें') : (dictionary.listen || "Listen to Mantra")}
                >
                    <Volume2 size={20} aria-hidden="true" />
                </button>

                <div className="flex gap-3">
                    {mantra.externalLink ? (
                        <a href={mantra.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-all duration-300 hover:border-primary-red hover:text-primary-red hover:shadow-md dark:hover:border-primary-red dark:hover:text-primary-red" title={dictionary.readStory || "Read Story"}>
                            <ArrowUpRight size={16} />
                            <span className="hidden sm:inline uppercase tracking-wider text-xs">{dictionary.readStory || "Read Story"}</span>
                        </a>
                    ) : (
                        !isDetailsPage && (
                            <Link href={`/${lang}/mantras/${mantra.slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-all duration-300 hover:border-primary-red hover:text-primary-red hover:shadow-md dark:hover:border-primary-red dark:hover:text-primary-red" title={dictionary.readFull || "Read Full"}>
                                <ArrowUpRight size={16} />
                                <span className="hidden sm:inline uppercase tracking-wider text-xs">{dictionary.readFull || "Read Full"}</span>
                            </Link>
                        )
                    )}

                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border bg-white dark:bg-zinc-800 text-sm font-bold cursor-pointer transition-all duration-300 hover:shadow-md ${copied ? 'border-green-600 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-mithila-ink hover:text-mithila-ink dark:hover:text-white dark:hover:border-white'}`}
                        aria-label={copied ? (lang === 'en' ? 'Copied to clipboard' : 'क्लिपबोर्ड पर कॉपी किया गया') : (dictionary.copy || 'Copy Mantra')}
                    >
                        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                        <span className="uppercase tracking-wider text-xs">{copied ? (lang === 'en' ? 'Copied' : 'Copied') : (dictionary.copy || 'Copy')}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-all duration-300 hover:border-mithila-ink hover:text-mithila-ink hover:shadow-md dark:hover:border-white dark:hover:text-white"
                        aria-label={dictionary.share || 'Share Mantra'}
                    >
                        <Share size={16} aria-hidden="true" />
                        <span className="uppercase tracking-wider text-xs">{dictionary.share || 'Share'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MantraCard;

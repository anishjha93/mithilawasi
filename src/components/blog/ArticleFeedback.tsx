'use client';

import { useState } from 'react';
import { Share2, MessageSquare, Check, Copy } from 'lucide-react';

interface ArticleFeedbackProps {
    title: string;
    url: string;
}

export default function ArticleFeedback({ title, url }: ArticleFeedbackProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (typeof navigator === 'undefined') return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Read this article about Mithila: ${title}`,
                    url: window.location.href
                });
            } catch (err) {
                // Share cancelled or failed
            }
        } else {
            // Fallback to copy link
            handleCopy();
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleComment = () => {
        // Open email client for now as specific comment system isn't set up
        window.location.href = `mailto:contact@mithilawasi.com?subject=Comment: ${encodeURIComponent(title)}`;
    };

    return (
        <div className="bg-slate-50 dark:bg-card-bg rounded-[2rem] p-8 md:p-12 text-center border border-slate-100 dark:border-border-color mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3 font-heading">
                Did you find this helpful?
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm md:text-base font-body">
                Help us spread the glory of Mithila by sharing this article.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={handleComment}
                    className="px-8 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-700 dark:text-gray-300 hover:border-red-800 hover:text-red-800 dark:hover:text-red-400 transition-all shadow-sm text-sm uppercase tracking-wider font-body flex items-center gap-2 group"
                >
                    <MessageSquare size={18} className="text-slate-400 group-hover:text-red-800 dark:group-hover:text-red-400 transition-colors" />
                    Leave a Comment
                </button>
                <button
                    onClick={handleShare}
                    className="px-8 py-3 bg-red-800 text-white rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg shadow-red-900/20 text-sm uppercase tracking-wider font-body flex items-center gap-2"
                >
                    {copied ? (
                        <>
                            <Check size={18} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Share2 size={18} />
                            Share Article
                        </>
                    )}
                </button>
            </div>
            {copied && (
                <p className="mt-3 text-green-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    Link copied to clipboard
                </p>
            )}
        </div>
    );
}

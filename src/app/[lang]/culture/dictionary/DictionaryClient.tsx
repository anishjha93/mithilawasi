
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function DictionaryClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(dictionary?.categories?.[0] || 'All');

    const categories = dictionary?.categories || [];
    const words = dictionary?.words || [];

    const filteredWords = words.filter((item: any) => {
        const matchesSearch = (item.word?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.meaning?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-card-bg rounded-[32px] shadow-xl p-6 md:p-10 border border-border-color min-h-[500px]">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-[#e67e22] transition-colors" />
                    <input
                        type="text"
                        placeholder={lang === 'en' ? "Search words..." : "शब्द खोजें..."}
                        className="w-full pl-12 pr-4 py-4 bg-background border border-border-color rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e67e22]/30 focus:border-[#e67e22] transition-all text-foreground placeholder:text-text-muted font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                ? 'bg-[#e67e22] text-white shadow-lg shadow-orange-500/30 transform scale-105'
                                : 'bg-muted text-text-muted hover:bg-border-color/50 hover:text-foreground'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredWords.map((item: any, idx: number) => (
                    <div key={idx} className="bg-background/50 p-8 rounded-[24px] border border-border-color hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-orange-200 dark:hover:border-orange-900/40 hover:-translate-y-1 transition-all group duration-300">
                        <div className="flex flex-col h-full items-start">
                            <span className="inline-block px-3 py-1 mb-4 text-[0.7rem] font-bold tracking-widest text-[#e67e22] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/20 rounded-full uppercase">
                                {item.category}
                            </span>
                            <h3 className="text-2xl font-bold text-foreground mb-2 font-serif group-hover:text-[#d35400] transition-colors leading-tight">
                                {item.word}
                            </h3>
                            <div className="h-0.5 w-12 bg-border-color my-4 group-hover:w-full group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-all duration-500" />
                            <p className="text-text-muted font-medium text-lg leading-relaxed">
                                {item.meaning}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredWords.length === 0 && (
                <div className="text-center py-32 text-text-muted">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl font-medium">No words found matching "{searchTerm}"</p>
                    <p className="mt-2 text-text-muted/70">Try a different search term or category.</p>
                </div>
            )}
        </div>
    );
}

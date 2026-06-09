'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Recipe } from '@/data/recipes';

interface RecipeListProps {
    recipes: Recipe[];
    lang: string;
    dictionary: any;
}

const categories = ['All', 'Main Course', 'Sweets', 'Snacks', 'Chutney/Pickle', 'Festival Special'];

export default function RecipeList({ recipes, lang, dictionary }: RecipeListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredRecipes = recipes.filter((recipe) => {
        const locale = recipe.locales[lang as 'en' | 'hi' | 'mai'] || recipe.locales.en;

        const matchesSearch =
            locale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.locales.en.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Search and Filter Controls */}
            <div className="mb-20 text-center animate-fade-in-up">
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute inset-0 bg-primary-red/5 blur-2xl group-hover:bg-primary-red/10 transition-all duration-500 rounded-full"></div>
                    <input
                        type="text"
                        placeholder="Search recipes (e.g., Ahuna Mutton, Thekua)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative w-full px-10 py-6 text-xl glass-morphism border-2 border-primary-red/5 rounded-[2rem] outline-hidden transition-all duration-500 shadow-premium text-mithila-ink placeholder:text-text-muted/50 focus:border-primary-red focus:ring-8 focus:ring-primary-red/5 focus:shadow-2xl font-serif italic"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl group-focus-within:scale-125 transition-transform duration-300">🔍</span>
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-12">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            className={`px-8 py-3 rounded-full cursor-pointer text-xs font-black tracking-[0.2em] uppercase transition-all duration-500 border-2 ${selectedCategory === cat
                                ? "bg-mithila-ink text-paper-white border-mithila-ink shadow-premium transform -translate-y-1"
                                : "glass border-primary-red/5 text-text-muted hover:border-primary-red/40 hover:text-primary-red hover:shadow-lg"
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-8">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe, index) => {
                        const rawLocale = recipe.locales[lang as 'en' | 'hi' | 'mai'] || recipe.locales.en;
                        const enLocale = recipe.locales.en;
                        const title = rawLocale.title || enLocale.title;
                        const description = rawLocale.description || enLocale.description;
                        return (
                            <Link
                                href={`/${lang}/food/${recipe.slug}`}
                                key={recipe.slug}
                                className="group h-full animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="h-full relative glass-morphism border border-primary-red/5 rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-700 flex flex-col hover:-translate-y-2">
                                    <div className="absolute inset-0 madhubani-pattern-bg opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" />

                                    <div className="p-10 flex-1 flex flex-col relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <span className="text-[0.65rem] uppercase tracking-[0.3em] bg-primary-yellow/10 text-mithila-ink border border-primary-yellow/30 px-5 py-1.5 rounded-full font-black shadow-sm group-hover:bg-primary-yellow group-hover:text-white transition-all duration-300">
                                                {recipe.category}
                                            </span>
                                            <span className="text-4xl filter drop-shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🥘</span>
                                        </div>

                                        <h3 className="text-3xl font-black mb-2 text-mithila-ink font-heading group-hover:text-primary-red transition-colors tracking-tighter italic">{title}</h3>
                                        {lang !== 'en' && <p className="text-xs text-primary-red/60 mb-6 font-black uppercase tracking-widest border-b border-dashed border-primary-red/10 pb-3 inline-block">{recipe.locales.en.title}</p>}

                                        <p className="text-lg text-text-muted leading-relaxed mb-10 line-clamp-3 font-serif italic">
                                            {description}
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-primary-red/5 flex justify-between items-center text-sm font-black text-mithila-ink/60">
                                            <div className="flex gap-6">
                                                <span className="flex items-center gap-3"><span className="text-2xl">⏱️</span> {recipe.prepTime}</span>
                                            </div>
                                            <span className="font-black text-primary-red group-hover:translate-x-3 transition-transform duration-300 uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                                                {dictionary.foodPage.viewRecipe} <span className="text-xl">→</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-24 px-10 text-text-muted glass-morphism border-4 border-dashed border-primary-red/10 rounded-[4rem] animate-fade-in">
                        <p className="text-6xl mb-8 animate-pulse-slow">🍽️</p>
                        <p className="text-2xl font-serif italic mb-4">No culinary treasures found matching</p>
                        <p className="text-3xl font-black text-mithila-ink mb-12 italic">"{searchQuery}"</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="btn btn-primary px-12 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-premium hover:shadow-2xl transition-all"
                        >
                            Reset Kitchen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

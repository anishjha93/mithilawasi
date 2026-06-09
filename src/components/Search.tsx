'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Map dictionary keys to URL paths
const PAGE_MAP: { [key: string]: string } = {
    'historyPage': '/history',
    'culturePage': '/culture',
    'foodPage': '/food',
    'placesPage': '/places',
    'agriculturePage': '/agriculture',
    'learningPage': '/learning',
    'philosophyPage': '/philosophy',
    'folklorePage': '/folklore',
    'artPage': '/art',
    'personalitiesPage': '/personalities'
};

const Search = ({ dict, lang }: { dict: any, lang: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ title: string; desc: string; url: string }[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const performSearch = (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const matches: { title: string; desc: string; url: string }[] = [];
        const lowerTerm = searchTerm.toLowerCase();

        // Helper to recursively search object
        const searchRecursive = (obj: any, pageKey: string, contextChain: string[]) => {
            if (!obj) return;

            if (typeof obj === 'string') {
                if (obj.toLowerCase().includes(lowerTerm)) {
                    // Found a match
                    // Use the page title or context as title
                    const pageUrl = PAGE_MAP[pageKey];
                    if (pageUrl) {
                        // Avoid duplicates roughly
                        const title = contextChain.join(' > ');
                        // Limit snippet length
                        const snippet = obj.length > 100 ? obj.substring(0, 100) + '...' : obj;

                        // Check if we already have this URL+title combo to avoid spamming results
                        // For detailed JSON, might match many properties.
                        // We push distinct items.
                        if (matches.length < 10) {
                            matches.push({
                                title: title || pageKey,
                                desc: snippet,
                                url: `/${lang}${pageUrl}`
                            });
                        }
                    }
                }
            } else if (typeof obj === 'object') {
                // If Array
                if (Array.isArray(obj)) {
                    obj.forEach(item => searchRecursive(item, pageKey, contextChain));
                } else {
                    // Object
                    Object.keys(obj).forEach(key => {
                        // Add nice readable keys to context
                        // Skip numeric keys or generic 'desc'
                        let newContext = [...contextChain];
                        if (key !== 'desc' && key !== 'text' && key !== 'intro') {
                            // Try to use 'title' or 'name' property of the object if we are descending
                            if (obj[key] && typeof obj[key] === 'object' && obj[key].title) {
                                newContext.push(obj[key].title);
                            } else if (obj[key] && typeof obj[key] === 'object' && obj[key].name) {
                                newContext.push(obj[key].name);
                            }
                        }
                        searchRecursive(obj[key], pageKey, newContext);
                    });
                }
            }
        };

        // Iterate over specific top-level page keys
        Object.keys(PAGE_MAP).forEach(pageKey => {
            if (dict[pageKey]) {
                // Start search with Page Title as context
                const pageTitle = dict[pageKey].title || pageKey;
                searchRecursive(dict[pageKey], pageKey, [pageTitle]);
            }
        });

        // Deduplicate URL matches (optional, but good for UX)
        // For now, simpler list
        setResults(matches.slice(0, 8)); // Top 8 results
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        performSearch(val);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-transparent border-none text-xl cursor-pointer p-2 transition-transform duration-200 ml-4 hover:scale-110"
                aria-label="Search"
            >
                🔍
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-center items-start pt-[10vh]" onClick={() => setIsOpen(false)}>
            <div className="bg-card-bg w-[90%] max-w-[600px] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-300" onClick={e => e.stopPropagation()}>
                <div className="flex items-center border-b border-border-color p-4">
                    <span className="text-xl text-gray-400 mr-2">🔍</span>
                    <input
                        type="text"
                        placeholder="Search Mithilawasi..."
                        autoFocus
                        value={query}
                        onChange={handleInput}
                        className="flex-1 border-none text-lg outline-none text-foreground bg-transparent"
                    />
                    <button onClick={() => setIsOpen(false)} className="bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">×</button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {results.length > 0 ? (
                        results.map((res, idx) => (
                            <Link
                                href={res.url}
                                key={idx}
                                className="block p-4 border-b border-border-color no-underline transition-colors duration-200 hover:bg-black/5"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="font-semibold text-foreground mb-1 text-[0.95rem]">{res.title}</div>
                                <div className="text-[0.85rem] text-foreground/80 line-clamp-2">{res.desc}</div>
                            </Link>
                        ))
                    ) : (
                        query.length > 1 && <div className="p-8 text-center text-gray-400">No results found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;

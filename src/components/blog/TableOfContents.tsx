"use client";

import React, { useEffect, useState } from 'react';
import { List, Hash } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    title?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ title = "Table of Contents" }) => {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Find all headings within the blog content
        const elements = Array.from(document.querySelectorAll('.blog-content h2, .blog-content h3'));
        const items: TOCItem[] = elements.map((el) => {
            const id = el.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
            el.id = id; // Assign ID to heading element for linking
            return {
                id,
                text: el.textContent || '',
                level: parseInt(el.tagName.charAt(1)),
            };
        });
        setHeadings(items);

        // Intersection Observer to track active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -60% 0px' }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 hidden lg:block w-full">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 font-body">
                {title}
            </h4>
            <ul className="space-y-3 border-l border-slate-100">
                {headings.map((item) => (
                    <li key={item.id} className="group">
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`block pl-4 py-1 text-sm transition-all duration-300 font-body border-l-2 -ml-[2px] ${activeId === item.id
                                    ? 'border-red-800 text-red-800 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                                }`}
                            style={{ paddingLeft: `${item.level === 3 ? '1.5rem' : '1rem'}` }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;

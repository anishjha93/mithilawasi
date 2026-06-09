'use client';

import React from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Link as LinkIcon, Image as ImageIcon, SeparatorHorizontal } from 'lucide-react';

interface MarkdownToolbarProps {
    onInsert: (prefix: string, suffix?: string) => void;
}

export default function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
    const tools = [
        { icon: <Heading1 size={14} />, label: "H1", action: () => onInsert("# ", "") },
        { icon: <Heading2 size={14} />, label: "H2", action: () => onInsert("## ", "") },
        { icon: <Bold size={14} />, label: "Bold", action: () => onInsert("**", "**") },
        { icon: <Italic size={14} />, label: "Italic", action: () => onInsert("*", "*") },
        { icon: <List size={14} />, label: "List", action: () => onInsert("- ", "") },
        { icon: <ListOrdered size={14} />, label: "Numbered", action: () => onInsert("1. ", "") },
        { icon: <Quote size={14} />, label: "Quote", action: () => onInsert("> ", "") },
        { icon: <LinkIcon size={14} />, label: "Link", action: () => onInsert("[text](", ")") },
        { icon: <ImageIcon size={14} />, label: "Image", action: () => onInsert('<ExternalImage src="', '" width="100%" />') },
        { icon: <SeparatorHorizontal size={14} />, label: "Spacer", action: () => onInsert("\n\n<Spacer height=\"20px\" />\n\n", "") },
    ];

    return (
        <div className="flex items-center gap-1 p-1 px-2 border-b border-gray-100 bg-white">
            {tools.map((tool, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={tool.action}
                    title={tool.label}
                    className="p-1.5 hover:bg-orange-50 rounded transition-colors text-gray-500 hover:text-orange-700 flex items-center gap-1.5"
                >
                    {tool.icon}
                    {i < 2 && <span className="text-[10px] font-bold">{tool.label}</span>}
                </button>
            ))}
        </div>
    );
}

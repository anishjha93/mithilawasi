'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2 } from 'lucide-react';

interface ResizableImageProps {
    src: string;
    alt?: string;
    initialWidth?: string;
    onResizeStop: (width: string) => void;
}

export default function ResizableImage({ src, alt, initialWidth = '100%', onResizeStop }: ResizableImageProps) {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update internal width if initialWidth changes externally
    useEffect(() => {
        setWidth(initialWidth);
    }, [initialWidth]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            const containerRect = containerRef.current.parentElement?.getBoundingClientRect();
            if (!containerRect) return;

            // Calculate width as percentage of parent
            const newWidthPx = e.clientX - containerRect.left;
            const newWidthPercent = Math.min(100, Math.max(10, (newWidthPx / containerRect.width) * 100));

            setWidth(`${Math.round(newWidthPercent)}%`);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                onResizeStop(width);
            }
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, width, onResizeStop]);

    return (
        <figure
            ref={containerRef}
            className={`group relative my-8 mx-auto inline-block max-w-full transition-shadow ${isResizing ? 'ring-2 ring-orange-400 shadow-xl' : 'hover:ring-1 hover:ring-orange-200'}`}
            style={{ width }}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt || ''}
                className="w-full h-auto rounded-lg block shadow-sm border border-orange-50 select-none"
            />

            {/* RESIZE HANDLE */}
            <div
                onMouseDown={handleMouseDown}
                className="absolute bottom-2 right-2 p-1.5 bg-orange-600 text-white rounded-lg cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                title="Drag to resize"
            >
                <Maximize2 size={12} className="rotate-90" />
            </div>

            {/* WIDTH BADGE */}
            {isResizing && (
                <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                    {width}
                </div>
            )}

            {alt && <figcaption className="text-center text-gray-500 text-sm mt-3 italic">{alt}</figcaption>}
        </figure>
    );
}

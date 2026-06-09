'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-red-700 to-red-900 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(160,28,41,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

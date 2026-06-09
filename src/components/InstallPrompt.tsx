'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        // Check for mobile user agent
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // If not mobile, don't show
        if (!isMobile) return;

        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            // For iOS, we can't detect "can install" easily, but we can show instructions if not standalone
            setIsVisible(true);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true); // Only show if the browser says it's installable
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt && !isIOS) return;

        if (isIOS) {
            // Show iOS instructions tooltip or modal? 
            // For a simple floating button, maybe just alert or expand?
            alert("To install: Tap the Share button and select 'Add to Home Screen'");
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible || isStandalone) return null;

    return (
        <div className="fixed bottom-24 md:bottom-20 right-4 z-50 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-5 fade-in duration-500">
            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                className="bg-gray-800/80 text-white p-1 rounded-full shadow-sm hover:bg-gray-700 backdrop-blur-sm mb-1"
                aria-label="Close Install Prompt"
            >
                <X size={14} />
            </button>

            {/* Main Install Button */}
            <button
                onClick={handleInstallClick}
                className="bg-primary-red text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group backdrop-blur-md"
            >
                <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
                    <Download size={18} className="text-white" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-medium opacity-90 uppercase tracking-widest leading-none mb-0.5">Get App</span>
                    <span className="text-xs font-bold leading-none">Install Now</span>
                </div>
            </button>
        </div>
    );
}

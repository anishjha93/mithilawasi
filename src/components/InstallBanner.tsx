'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallBanner({ dict }: { dict: any }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            setIsVisible(true);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    // Fallback for types not strictly defined in 'any' dict yet
    const t = dict?.installBanner || {
        title: "Install Mithilawasi",
        badge: "Official App",
        description: "Get daily Panchang notifications, read Vrat Kathas offline, and faster access to Mithila culture.",
        button: "Install App",
        iosButton: "Share Menu",
        iosInstruction: "Open Share Menu & tap Add to Home Screen"
    };

    return (
        <div className="w-full bg-gradient-to-r from-primary-red to-[#2C1810] text-white rounded-[2.5rem] p-6 md:p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-premium border border-white/10 animate-fade-in-up">

            {/* Heritage Texture */}
            <div className="absolute inset-0 opacity-[0.05] madhubani-pattern-bg"></div>

            <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-yellow-500/30">
                        {t.badge}
                    </span>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2 text-white">
                    {t.title}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed max-w-2xl">
                    {t.description}
                </p>
            </div>

            <div className="relative z-10 flex gap-3 w-full md:w-auto shrink-0">
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-3 text-gray-400 hover:text-white transition-colors md:hidden absolute top-0 right-0 -mt-2 -mr-2"
                >
                    <X size={16} />
                </button>

                {isIOS ? (
                    <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded border border-gray-700">
                        {t.iosInstruction}
                    </div>
                ) : (
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 md:flex-none bg-white text-gray-900 px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg active:scale-95"
                    >
                        <Download size={18} />
                        {t.button}
                    </button>
                )}
            </div>
        </div>
    );
}

'use client';

import { useEffect } from 'react';

const ServiceWorkerRegister = () => {
    useEffect(() => {
        /*
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
        */

        // Debug PWA installability
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('👍 PWA Install Prompt fired! The app is installable.');
            // Prevent the mini-infobar from appearing on mobile
            // e.preventDefault();
            // Stash the event so it can be triggered later.
            // (window as any).deferredPrompt = e;
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA was installed');
        });
    }, []);

    return null;
};

export default ServiceWorkerRegister;

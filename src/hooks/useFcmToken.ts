'use client';

import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';

const useFcmToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const status = Notification.permission;
            setNotificationPermissionStatus(status);

            // Auto-retrieve token if already granted (fixes issue where button is hidden but no token)
            if (status === 'granted') {
                retrieveToken();
            }
        }
    }, []);

    const retrieveToken = async () => {
        try {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator && messaging) {
                const permission = await Notification.requestPermission();
                setNotificationPermissionStatus(permission);

                if (permission === 'granted') {
                    // Register service worker if not already (Next.js handles this often for PWAs but explicit for FCM is good)
                    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

                    const currentToken = await getToken(messaging, {
                        vapidKey: 'BN0TwCDkAqsOVjeTVA7Eweem3gS35DCaxVyRlPpdrS2dZOXoHTB-ASWbwqTTaTe3-5jdqiGg-GSHsPgwELZE0GA', // Optional but recommended for web
                        serviceWorkerRegistration: swRegistration
                    });

                    if (currentToken) {
                        setToken(currentToken);
                        console.log('🔥 FCM TOKEN GENERATED:', currentToken);

                        // Auto-subscribe to 'all_users' topic
                        try {
                            fetch('/api/subscribe', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: currentToken,
                                    topic: 'all_users'
                                }),
                            }).then(res => {
                                if (res.ok) console.log('✅ Subscribed to all_users topic');
                                else console.error('Failed to subscribe');
                            });
                        } catch (err) {
                            console.error('Failed to subscribe to topic:', err);
                        }
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }
            } else {
                console.log('⚠️ Skipping token retrieval. Prerequisites missing:', {
                    window: typeof window !== 'undefined',
                    serviceWorker: 'serviceWorker' in navigator,
                    messaging: !!messaging
                });
            }
        } catch (error) {
            console.error('An error occurred while retrieving token. ', error);
        }
    };

    // Optional: Foreground message listener
    useEffect(() => {
        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Message received. ', payload);
                console.log('Message received. ', payload);
                // Optionally handle foreground notification UI here (e.g. toast)
            });
            return () => unsubscribe();
        }
    }, []);

    return { fcmToken: token, notificationPermissionStatus, retrieveToken };
};

export default useFcmToken;

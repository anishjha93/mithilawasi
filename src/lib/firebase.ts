'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// REPLACE WITH YOUR FIREBASE CONFIG
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
    apiKey: "AIzaSyCPhxwE632-uvV1H2H0eTK8t75_Lu_zwi8",
    authDomain: "mithilalegacy-32033.firebaseapp.com",
    projectId: "mithilalegacy-32033",
    storageBucket: "mithilalegacy-32033.firebasestorage.app",
    messagingSenderId: "581428737999",
    appId: "1:581428737999:web:ccbfb4b8e13bc8a4ba04ba",
    measurementId: "G-MPVXBN9M97"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        console.log('Firebase Messaging Supported:', supported);
        if (supported) {
            messaging = getMessaging(app);
            console.log('Firebase Messaging Initialized:', !!messaging);
        } else {
            console.warn('Firebase Messaging NOT supported in this browser/context.');
        }
    }).catch(err => {
        console.error('Error checking messaging support:', err);
    });
}

export { app, messaging };

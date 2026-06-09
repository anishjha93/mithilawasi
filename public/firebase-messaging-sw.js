importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: '/icons/icon-192x192.png'
//     };
//
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('fetch', (event) => {
    // No-op fetch listener to satisfy PWA installability requirements
    // This allows the app to pass the "registers a service worker" check
});

// Version 1.2 - Explicit Click Handling
self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event);

    event.notification.close();

    // Get the link from the data payload (if sent) or fcm_options
    // Logic: 1. data.url, 2. fcm_options.link, 3. Root URL
    let clickAction = '/';
    if (event.notification.data && event.notification.data.url) {
        clickAction = event.notification.data.url;
    } else if (event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification && event.notification.data.FCM_MSG.notification.click_action) {
        clickAction = event.notification.data.FCM_MSG.notification.click_action;
    }

    // This looks for window clients (tabs/PWA windows)
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If there is an open window, focus it
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // Check if the client matches the target URL or is just the app
                // For simplicity, we focus any open window of this origin
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(clickAction);
            }
        })
    );
});

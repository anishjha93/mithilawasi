'use client';

import React from 'react';
import useFcmToken from '@/hooks/useFcmToken';
import { Bell } from 'lucide-react';

const NotificationButton = () => {
    const { notificationPermissionStatus, retrieveToken } = useFcmToken();

    // Hide button if permission already granted
    if (notificationPermissionStatus === 'granted') {
        return null;
    }

    return (
        <button
            onClick={retrieveToken}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition-all animate-bounce"
            aria-label="Enable Notifications"
        >
            <Bell size={20} />
            <span className="font-medium">Get Updates</span>
        </button>
    );
};

export default NotificationButton;

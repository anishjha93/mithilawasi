'use client';

import { useState, useEffect } from 'react';
import useFcmToken from '@/hooks/useFcmToken';
import { Bell, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function NotificationDebug() {
    const { fcmToken, notificationPermissionStatus, retrieveToken } = useFcmToken();
    const [isOpen, setIsOpen] = useState(false);
    const [lastError, setLastError] = useState<string>("");

    // Hook into console.error to capture logs for debug
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            setLastError(args.map(a => a.toString()).join(" "));
            originalError(...args);
        };
        return () => {
            console.error = originalError;
        };
    }, []);

    if (process.env.NODE_ENV === 'production' && !isOpen) {
        // Optional: Hide in production unless specific trigger? 
        // For now, we will show a small icon.
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
            >
                {notificationPermissionStatus === 'denied' ? <AlertTriangle className="text-red-400" size={20} /> : <Bell size={20} />}
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div className="pointer-events-auto mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="bg-gray-50 border-b border-gray-100 p-3 flex justify-between items-center">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Notification Debugger</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <XCircle size={16} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Permission Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Permission</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${notificationPermissionStatus === 'granted' ? 'bg-green-50 text-green-700 border-green-200' :
                                    notificationPermissionStatus === 'denied' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                {notificationPermissionStatus || 'unknown'}
                            </span>
                        </div>

                        {/* Token Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">FCM Token</span>
                            {fcmToken ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle size={14} />
                                    <span className="text-xs font-mono">{fcmToken.slice(0, 6)}...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-orange-500">
                                    <AlertTriangle size={14} />
                                    <span className="text-xs">Missing</span>
                                </div>
                            )}
                        </div>

                        {/* Last Error */}
                        {lastError && (
                            <div className="bg-red-50 p-2 rounded border border-red-100 text-[10px] text-red-800 font-mono break-all">
                                {lastError}
                            </div>
                        )}

                        {/* Actions */}
                        <button
                            onClick={() => retrieveToken()}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={12} />
                            Retry Registration
                        </button>

                        <div className="text-[10px] text-gray-400 leading-snug">
                            If issues persist:
                            <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                                <li>Check Android Settings {'>'} Notifications</li>
                                <li>Check Site Settings {'>'} Permissions</li>
                                <li>Clear Site Data & Reload</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

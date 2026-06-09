'use client';

import { useState, useEffect } from 'react';
import { purgeAllCaches } from '../cache-actions';
import { RefreshCw, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function CacheManager() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [lastPurged, setLastPurged] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('admin_last_cache_purge');
        if (saved) setLastPurged(saved);
    }, []);

    const handlePurge = async () => {
        if (!confirm('Are you sure you want to purge all application caches? This may temporarily affect performance as pages are rebuilt on demand.')) {
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const result = await purgeAllCaches();
            if (result.success) {
                const now = new Date().toLocaleString();
                setLastPurged(now);
                localStorage.setItem('admin_last_cache_purge', now);
                setStatus({ type: 'success', message: result.message });

                // Hide success status after 5 seconds
                setTimeout(() => setStatus({ type: null, message: '' }), 5000);
            } else {
                setStatus({ type: 'error', message: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-sm mt-12 overflow-hidden relative group transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Zap size={120} className="text-orange-600" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={16} className="text-orange-500" />
                        System Performance
                    </h2>
                    {lastPurged && (
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Clock size={10} />
                            LAST PURGE: {lastPurged}
                        </span>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Cache Control</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-0">
                            Updates made in the admin panel usually reflect instantly. However, if you see old content on the live site, use this tool to manually wipe the application-level data cache across all regions.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handlePurge}
                            disabled={loading}
                            className={`group h-14 rounded-2xl font-bold transition-all relative overflow-hidden flex items-center justify-center gap-3 ${loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    <span>Purging System Cache...</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                    <span>Purge All Application Caches</span>
                                </>
                            )}
                        </button>

                        {status.type && (
                            <div className={`p-4 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span className="font-medium">{status.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

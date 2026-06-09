'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Bell, Mail } from 'lucide-react';
import SubscribersView from './views/SubscribersView';
import PushNotificationsView from './views/PushNotificationsView';
import EmailCampaignsView from './views/EmailCampaignsView';
import { Subscriber } from '@/app/actions/subscribe';

interface CommunicationHubProps {
    initialSubscribers: Subscriber[];
    lang: string;
}

export default function CommunicationHub({ initialSubscribers, lang }: CommunicationHubProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'subscribers' | 'emails' | 'notifications'>('emails');

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={`/${lang}/admin`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">Communication Hub</h1>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold hidden md:block">Reach your audience</p>
                            </div>
                        </div>

                        {/* Navigation Tabs - Refined */}
                        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-2xl border border-orange-100 shadow-sm overflow-x-auto w-full md:w-auto text-sm font-bold no-scrollbar">
                            <button
                                onClick={() => setActiveTab('emails')}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-1 md:flex-none justify-center ${activeTab === 'emails'
                                    ? 'bg-white text-orange-900 shadow-md ring-1 ring-black/5'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                            >
                                <Mail size={16} className={activeTab === 'emails' ? 'text-orange-500' : ''} />
                                Emails
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-1 md:flex-none justify-center ${activeTab === 'notifications'
                                    ? 'bg-white text-orange-900 shadow-md ring-1 ring-black/5'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                            >
                                <Bell size={16} className={activeTab === 'notifications' ? 'text-orange-500' : ''} />
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('subscribers')}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-1 md:flex-none justify-center ${activeTab === 'subscribers'
                                    ? 'bg-white text-orange-900 shadow-md ring-1 ring-black/5'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                            >
                                <Users size={16} className={activeTab === 'subscribers' ? 'text-orange-500' : ''} />
                                Subscribers
                                <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full ml-1.5 shadow-inner">
                                    {initialSubscribers.length}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {activeTab === 'subscribers' && <SubscribersView initialSubscribers={initialSubscribers} />}
                {activeTab === 'notifications' && <PushNotificationsView />}
                {activeTab === 'emails' && <EmailCampaignsView />}
            </main>
        </div>
    );
}

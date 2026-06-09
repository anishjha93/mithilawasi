'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Users, Mail, Clock, Search, CheckCircle2, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { addSubscriberManually, deleteSubscriber } from '@/app/actions/subscribe';
import type { Subscriber } from '@/app/actions/subscribe';

interface SubscribersViewProps {
    initialSubscribers: Subscriber[];
}

export default function SubscribersView({ initialSubscribers }: SubscribersViewProps) {
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [confirming, setConfirming] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'unsubscribed'>('all');

    useEffect(() => {
        setSubscribers(initialSubscribers);
    }, [initialSubscribers]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!newEmail || !newEmail.includes('@')) {
            showMessage('Valid email required', 'error');
            return;
        }

        setAdding(true);
        try {
            const res = await addSubscriberManually(newEmail);
            if (res.success) {
                showMessage('Subscriber added successfully', 'success');
                setNewEmail('');
                router.refresh();
            } else {
                showMessage(res.message || 'Error adding subscriber', 'error');
            }
        } catch (error) {
            showMessage('Failed to add subscriber', 'error');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteClick = (email: string) => {
        if (confirming === email) {
            executeDelete(email);
        } else {
            setConfirming(email);
            setTimeout(() => setConfirming(current => current === email ? null : current), 3000);
        }
    };

    const executeDelete = async (email: string) => {
        setConfirming(null);
        setDeleting(email);

        try {
            const res = await deleteSubscriber(email);
            if (res.success) {
                showMessage('Subscriber removed', 'success');
                setSubscribers(prev => prev.filter(s => s.email !== email));
                router.refresh();
            } else {
                showMessage(res.message || 'Failed to delete', 'error');
            }
        } catch (error) {
            showMessage('Error deleting subscriber', 'error');
        } finally {
            setDeleting(null);
        }
    };

    const exportToCSV = () => {
        if (subscribers.length === 0) {
            showMessage('No subscribers to export', 'error');
            return;
        }

        const headers = ['Email', 'Date Subscribed', 'Source'];
        const csvRows = [
            headers.join(','),
            ...subscribers.map(s => `"${s.email}","${new Date(s.date).toLocaleString()}","${s.source}"`)
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mithila_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showMessage('Exporting to CSV...', 'success');
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || s.status === filterStatus)
    );

    return (
        <div className="font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toast Message */}
            {message && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
                    </div>
                    <span className="font-bold text-sm text-gray-800">{message.text}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-3">
                        Audience Directory
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200 font-sans uppercase tracking-widest shadow-inner">
                            {subscribers.length} total
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Manage your community network</p>
                </div>
                {subscribers.length > 0 && (
                    <button
                        onClick={exportToCSV}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-600 border border-orange-100 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <Download size={18} /> Export Database
                    </button>
                )}
            </div>

            {/* Manual Add Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-none">Quick Invitation</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Add a new email manually</p>
                    </div>
                </div>
                <form onSubmit={handleManualAdd} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="e.g. maithilmilaap@example.com"
                        className="flex-1 px-6 py-4 bg-gray-50/50 border border-orange-100 rounded-[1.5rem] text-sm focus:ring-2 focus:ring-orange-200 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={adding}
                        className="px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] text-sm font-bold hover:bg-black transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {adding ? <Loader2 size={16} className="animate-spin" /> : 'Register User'}
                    </button>
                </form>
            </div>

            {/* List Header */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-orange-50 shadow-sm">
                <div className="flex gap-1.5 p-1 bg-gray-100/50 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {(['all', 'active', 'unsubscribed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ring-1 ${filterStatus === status
                                ? 'bg-white text-orange-900 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 ring-transparent'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-400 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search our community..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium text-sm placeholder:text-gray-300 shadow-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-orange-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Community Member</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell whitespace-nowrap">Join Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell whitespace-nowrap">Engagement</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-50/50">
                            {filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber.email} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-800 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-red-100 transition-colors">
                                                {subscriber.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm break-all">{subscriber.email}</div>
                                                <div className="md:hidden text-xs text-slate-400 mt-1">
                                                    {new Date(subscriber.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                                            <Clock size={12} className="text-gray-300" />
                                            {new Date(subscriber.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 hidden sm:table-cell">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ring-1 ${subscriber.status === 'unsubscribed'
                                            ? 'bg-gray-100 text-gray-500 ring-gray-200'
                                            : 'bg-green-50 text-green-700 ring-green-100'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${subscriber.status === 'unsubscribed' ? 'bg-gray-400' : 'bg-green-500'}`} />
                                            {subscriber.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right whitespace-nowrap">
                                        {confirming === subscriber.email ? (
                                            <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-2 duration-300">
                                                <button
                                                    onClick={() => setConfirming(null)}
                                                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => executeDelete(subscriber.email)}
                                                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase shadow-sm hover:bg-red-700 transition-colors"
                                                >
                                                    Confirm Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(subscriber.email)}
                                                disabled={deleting === subscriber.email}
                                                className="p-3 rounded-2xl text-gray-300 hover:text-red-600 hover:bg-red-50 hover:shadow-inner transition-all duration-300 disabled:opacity-30"
                                                title="Remove Member"
                                            >
                                                {deleting === subscriber.email ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredSubscribers.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={24} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No subscribers found</h3>
                            <p className="text-gray-400 text-sm">Your list is waiting to grow.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

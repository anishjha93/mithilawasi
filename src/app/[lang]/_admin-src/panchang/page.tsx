"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { getPanchangData, savePanchangDay, PanchangDayData, PanchangDataMap } from "./actions";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    LogOut,
    Save,
    X,
    ArrowLeft,
    Plus,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PanchangAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [panchangData, setPanchangData] = useState<PanchangDataMap>({});
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start at Jan 2026
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editData, setEditData] = useState<PanchangDayData>({
        tithi: '',
        tithi_start_time: '',
        tithi_end_time: '',
        next_tithi: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        checkAuth().then((isAuth) => {
            setIsAuthenticated(isAuth);
            setIsLoadingAuth(false);
            if (isAuth) {
                fetchData();
            }
        });
    }, []);

    async function fetchData() {
        setIsLoadingData(true);
        const data = await getPanchangData();
        setPanchangData(data);
        setIsLoadingData(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay, year, month };
    };

    const handleDayClick = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        setSelectedDate(dateStr);
        if (panchangData[dateStr]) {
            setEditData({ ...panchangData[dateStr] });
        } else {
            setEditData({
                tithi: '',
                tithi_start_time: '',
                tithi_end_time: '',
                next_tithi: ''
            });
        }
    };

    const handleSave = async () => {
        if (!selectedDate) return;

        setIsSaving(true);
        const res = await savePanchangDay(selectedDate, editData);
        if (res.success) {
            setPanchangData(prev => ({
                ...prev,
                [selectedDate]: editData
            }));
            setStatus({ type: 'success', message: "Saved successfully" });
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
            setSelectedDate(null);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
        setIsSaving(false);
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-orange-800" size={32} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">Please login through the main admin portal first.</p>
                    <Link href={`/${lang}/admin`} className="bg-orange-800 text-white px-6 py-2 rounded-lg font-bold">
                        Go to Admin Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Panchang Management</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Admin Dashboard</p>
                        </div>
                    </div>

                    {status.type !== 'idle' && (
                        <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50 ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-bold text-sm">{status.message}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon size={24} className="text-orange-600" />
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading panchang data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden p-6">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-4">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Empty cells for start of month */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {/* Actual Days */}
                            {Array.from({ length: days }).map((_, i) => {
                                const day = i + 1;
                                const year = currentDate.getFullYear();
                                const month = currentDate.getMonth() + 1;
                                const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                const hasData = !!panchangData[dateStr];
                                const data = panchangData[dateStr];

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={`aspect-square rounded-xl border flex flex-col items-start p-2 transition-all hover:shadow-md relative
                                            ${hasData
                                                ? 'bg-orange-50/50 border-orange-100 hover:border-orange-300'
                                                : 'bg-white border-gray-100 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${hasData ? 'text-orange-900' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        {hasData && (
                                            <span className="text-[10px] text-orange-600 mt-1 line-clamp-2 text-left font-medium">
                                                {data.tithi}
                                            </span>
                                        )}
                                        {!hasData && (
                                            <span className="absolute bottom-2 right-2 text-gray-200">
                                                <Plus size={14} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {selectedDate && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                Edit: {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
                            </h3>
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tithi</label>
                                <select
                                    value={editData.tithi}
                                    onChange={(e) => setEditData(prev => ({ ...prev, tithi: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                >
                                    <option value="">Select Tithi...</option>
                                    {['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Time</label>
                                    <input
                                        type="text"
                                        value={editData.tithi_start_time}
                                        onChange={(e) => setEditData(prev => ({ ...prev, tithi_start_time: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="e.g. Jan 1, 01:48 AM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Time</label>
                                    <input
                                        type="text"
                                        value={editData.tithi_end_time}
                                        onChange={(e) => setEditData(prev => ({ ...prev, tithi_end_time: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="e.g. Jan 1, 10:22 PM"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Next Tithi</label>
                                <select
                                    value={editData.next_tithi}
                                    onChange={(e) => setEditData(prev => ({ ...prev, next_tithi: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                >
                                    <option value="">Select Next Tithi...</option>
                                    {['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

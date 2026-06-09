"use client";

import { useState, useEffect } from "react";
import { verifyPassword, checkAuth, logout, getDashboardStats } from "./actions";
import {
    Lock,
    LogOut,
    LayoutDashboard,
    Music,
    Mail,
    Utensils,
    ScrollText,
    Calendar,
    Bell,
    Send,
    Users,
    MapPin,
    Sparkles,
    HardDrive,
    Image as ImageIcon,
    Activity,
    Database,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Loader2,
    RefreshCw,
    Megaphone
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import CacheManager from "./components/CacheManager";

interface DashboardStats {
    success: boolean;
    counts: Record<string, number>;
    storage: {
        unusedCount: number;
        totalSize: number;
    };
    recentActivity: Array<{
        type: string;
        title: string;
        date: string;
    }>;
}

export default function AdminDashboardContent() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Login State
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        checkAuth().then((isAuth) => {
            setIsAuthenticated(isAuth);
            setIsLoadingAuth(false);
            if (isAuth) {
                fetchStats();
            }
        });

        // Refresh stats on window focus
        const onFocus = () => fetchStats();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        const res = await getDashboardStats();
        if (res.success) {
            setStats(res as DashboardStats);
        }
        setIsLoadingStats(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");

        const res = await verifyPassword(password);
        if (res.success) {
            setIsAuthenticated(true);
        } else {
            setLoginError(res.error || "Invalid password");
        }
        setIsLoggingIn(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
        setPassword("");
    };

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="animate-spin text-orange-800 text-2xl">⏳</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden w-full max-w-[440px]">
                    <div className="bg-gradient-to-br from-red-800 to-red-900 p-8 text-center relative overflow-hidden">
                        <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner relative z-10">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold font-serif text-white tracking-wide relative z-10">Admin Portal</h1>
                        <p className="text-red-200 text-sm mt-1 relative z-10">Restricted Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Access Code</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-800 text-lg font-medium tracking-widest"
                                placeholder="••••"
                                autoFocus
                            />
                        </div>
                        {loginError && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 justify-center">
                                <span>⚠️</span> {loginError}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoggingIn ? "Unlocking..." : "Unlock Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const modules = [
        {
            category: "Content Management",
            items: [
                { title: "Blogs", icon: LayoutDashboard, href: `/${lang}/admin/blogs`, desc: "Manage articles", color: "orange" },
                { title: "Songs", icon: Music, href: `/${lang}/admin/songs`, desc: "Folk songs & lyrics", color: "red" },
                { title: "Recipes", icon: Utensils, href: `/${lang}/admin/recipes`, desc: "Mithila cuisine", color: "yellow" },
                { title: "Mantras", icon: ScrollText, href: `/${lang}/admin/mantras`, desc: "Vrat Katha & Chants", color: "purple" },
                { title: "Personalities", icon: Users, href: `/${lang}/admin/personalities`, desc: "Famous Maithils", color: "blue" },
                { title: "Places", icon: MapPin, href: `/${lang}/admin/places`, desc: "Tourist Destinations", color: "green" },
                { title: "Modern Mithila", icon: Sparkles, href: `/${lang}/admin/modern-mithila`, desc: "Trends & News", color: "pink" },
                { title: "Submissions", icon: Bell, href: `/${lang}/admin/submissions`, desc: "Community Stories", color: "cyan" },
            ]
        },
        {
            category: "Tools & Utilities",
            items: [
                { title: "Communication Hub", icon: Megaphone, href: `/${lang}/admin/communication`, desc: "Emails, Notifications & Subscribers", color: "red" },
                { title: "Panchang", icon: Calendar, href: `/${lang}/admin/panchang`, desc: "Calendar Management", color: "indigo" },
                { title: "Icon Registry", icon: ImageIcon, href: `/${lang}/admin/icons`, desc: "Manage App Icons", color: "cyan" },
            ]
        },
        {
            category: "System",
            items: [
                { title: "Cloudflare Storage", icon: HardDrive, href: `/${lang}/admin/storage`, desc: "Manage R2 Images", color: "slate" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900">Mithila Admin</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        {isLoadingStats && <Loader2 size={16} className="animate-spin text-orange-400" />}
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

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Health & Metrics Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Activity size={14} />
                            Health & Analytics
                        </h2>
                        {stats && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                LIVE
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Card 1: Inventory Breakdown */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Inventory Status</h3>
                                </div>
                                <button
                                    onClick={fetchStats}
                                    disabled={isLoadingStats}
                                    className="p-2 hover:bg-orange-50 rounded-lg text-gray-400 hover:text-orange-600 transition-all disabled:opacity-50"
                                    title="Refresh Stats"
                                >
                                    <RefreshCw size={14} className={isLoadingStats ? "animate-spin" : ""} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {stats ? (
                                    Object.entries(stats.counts).map(([key, count]) => (
                                        <div key={key} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors group/stat">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover/stat:text-orange-600 transition-colors">
                                                {key}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                                        </div>
                                    ))
                                ) : (
                                    Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 animate-pulse">
                                            <div className="h-2 w-12 bg-gray-200 rounded mb-2" />
                                            <div className="h-6 w-8 bg-gray-200 rounded" />
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-orange-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate Growth</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {stats ? Object.values(stats.counts).reduce((a: number, b: number) => a + b, 0) : '...'} Total Files
                                    </span>
                                </div>
                                <div className="h-10 w-10 rounded-full border-4 border-orange-50 border-t-orange-500 flex items-center justify-center text-[10px] font-bold text-orange-600">
                                    LIVE
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Activity & System Health */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Activity & Pulse</h3>
                                </div>

                                {stats?.storage?.unusedCount && stats.storage.unusedCount > 0 ? (
                                    <Link href={`/${lang}/admin/storage`} className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-red-100 animate-pulse hover:bg-red-100 transition-colors">
                                        <AlertCircle size={14} />
                                        {stats.storage.unusedCount} CRUFT IMAGES
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-100">
                                        <Database size={14} />
                                        SYSTEM HEALTHY
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 flex-1">
                                {stats?.recentActivity?.map((act: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-sm group/item hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-default">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white text-gray-500 uppercase tracking-tighter border border-gray-200 shrink-0">
                                                {act.type}
                                            </span>
                                            <span className="font-bold text-gray-700 truncate text-xs sm:text-sm">{act.title}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-mono italic shrink-0 ml-4">{act.date ? new Date(act.date).toLocaleDateString() : 'Today'}</span>
                                    </div>
                                )) || (
                                        <div className="py-12 text-center">
                                            <Loader2 className="animate-spin text-orange-200 mx-auto mb-2" size={32} />
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sourcing latest activity...</p>
                                        </div>
                                    )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-blue-50 flex items-center gap-4">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Storage:</div>
                                <div className="flex gap-2 text-[10px] font-bold">
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">R2 Active</span>
                                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">JSON Database</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-10">
                    {modules.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pl-1">
                                {section.category}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className="group bg-white p-4 md:p-6 rounded-2xl border border-orange-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className={`absolute top-0 left-0 w-full h-1 bg-${item.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-transform group-hover:scale-110 
                                                bg-${item.color}-50 text-${item.color}-600`}
                                            >
                                                <Icon size={20} className="md:w-6 md:h-6" />
                                            </div>
                                            <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">{item.desc}</p>

                                            <div className="flex items-center text-[10px] md:text-xs font-bold text-gray-300 group-hover:text-orange-600 transition-colors uppercase tracking-wider">
                                                Open ↗
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <CacheManager />
            </main>
        </div>
    );
}

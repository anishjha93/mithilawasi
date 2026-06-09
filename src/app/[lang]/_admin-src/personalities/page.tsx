"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deletePersonality, getAllPersonalities, Personality } from "./actions";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Users,
    Loader2,
    LogOut,
    ArrowLeft,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function PersonalitiesAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [personalities, setPersonalities] = useState<Personality[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
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
        const data = await getAllPersonalities();
        setPersonalities(data);
        setIsLoadingData(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const handleDelete = async (slug: string) => {
        if (confirmDeleteSlug === slug) {
            // User confirmed
            setConfirmDeleteSlug(null);

            const res = await deletePersonality(slug);
            if (res.success) {
                setStatus({ type: 'success', message: "Personality deleted successfully" });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                fetchData();
            } else {
                setStatus({ type: 'error', message: "Failed to delete personality" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteSlug(slug);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteSlug(null), 3000);
        }
    };

    // ... (lines 62-198)


    const filtered = personalities.filter(p =>
        p.locales.en.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.locales.hi.name.includes(searchQuery) ||
        p.locales.mai.name.includes(searchQuery)
    );

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
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Personalities</h1>
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
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
                    <div className="flex-1 bg-white p-2 rounded-2xl border border-orange-100 flex items-center pr-6 shadow-sm">
                        <div className="p-4 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search personalities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <Link
                        href={`/${lang}/admin/personalities/new`}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Add New
                    </Link>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading personalities...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Users size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Personalities Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Start building the legacy of Mithila.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filtered.map((person) => (
                            <div
                                key={person.slug}
                                className="group bg-white hover:bg-blue-50/30 rounded-2xl border border-orange-100 p-4 md:p-6 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                    {person.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={person.image} alt={person.locales.en.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Users size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        {person.featured && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700">
                                                Featured
                                            </span>
                                        )}
                                        {person.profession.map(prof => (
                                            <span key={prof} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-200 px-2 py-0.5 rounded">
                                                {prof}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate mb-1">
                                        {person.locales.en.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {person.locales.en.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/${lang}/admin/personalities/${person.slug}`}
                                        className="p-3 bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-xl transition-all"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(person.slug)}
                                        className={`p-3 rounded-xl transition-all flex items-center justify-center min-w-[44px] ${confirmDeleteSlug === person.slug
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600"
                                            }`}
                                        title={confirmDeleteSlug === person.slug ? "Click again to confirm" : "Delete Personality"}
                                    >
                                        {confirmDeleteSlug === person.slug ? (
                                            <CheckCircle size={20} className="animate-pulse" />
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

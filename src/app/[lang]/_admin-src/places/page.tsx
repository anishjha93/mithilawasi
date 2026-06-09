"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deletePlace, getAllPlaces, Place } from "./actions";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    MapPin,
    Loader2,
    LogOut,
    ArrowLeft,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function PlacesAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [places, setPlaces] = useState<Place[]>([]);
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
        const data = await getAllPlaces();
        setPlaces(data);
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

            const res = await deletePlace(slug);
            if (res.success) {
                setStatus({ type: 'success', message: "Place deleted successfully" });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                fetchData();
            } else {
                setStatus({ type: 'error', message: "Failed to delete place" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteSlug(slug);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteSlug(null), 3000);
        }
    };

    const filtered = places.filter(p =>
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

    if (!isAuthenticated) return null; // Or redirect logic handled in useEffect

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Places</h1>
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
                            placeholder="Search places..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <Link
                        href={`/${lang}/admin/places/new`}
                        className="bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Add New
                    </Link>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading places...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <MapPin size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Places Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Add the beautiful locations of Mithila.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((place) => (
                            <div
                                key={place.slug}
                                className="group bg-white rounded-2xl border border-orange-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                            >
                                <div className="h-48 bg-gray-100 relative">
                                    {place.images.length > 0 ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={place.images[0]} alt={place.locales.en.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MapPin size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Link
                                            href={`/${lang}/admin/places/${place.slug}`}
                                            className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-sm backdrop-blur-sm transition-colors"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(place.slug)}
                                            className={`p-2 rounded-lg shadow-sm backdrop-blur-sm transition-colors flex items-center justify-center min-w-[32px] ${confirmDeleteSlug === place.slug
                                                ? "bg-red-600 text-white hover:bg-red-700"
                                                : "bg-white/90 hover:bg-white text-red-600"
                                                }`}
                                        >
                                            {confirmDeleteSlug === place.slug ? <CheckCircle size={16} className="animate-pulse" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded border border-green-100">
                                            {place.locales.en.significance || "Place"}
                                        </span>
                                        {place.featured && (
                                            <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {place.locales.en.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                                        <MapPin size={14} />
                                        {place.locales.en.location || "Location not set"}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                        {place.locales.en.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

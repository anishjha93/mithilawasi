"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deleteSong, getAllSongsForAdmin } from "./actions";
import { Song } from "@/data/songs";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Music,
    Loader2,
    LogOut,
    ArrowLeft,
    Globe,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function SongsAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [songs, setSongs] = useState<Song[]>([]); // Use Song type
    const [isLoadingSongs, setIsLoadingSongs] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    // ... (lines 31-52 omitted)

    useEffect(() => {
        checkAuth().then((isAuth) => {
            setIsAuthenticated(isAuth);
            setIsLoadingAuth(false);
            if (isAuth) {
                fetchSongs();
            }
        });
    }, []);

    async function fetchSongs() {
        setIsLoadingSongs(true);
        const data = await getAllSongsForAdmin();
        setSongs(data);
        setIsLoadingSongs(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const handleDelete = async (slug: string) => {
        if (confirmDeleteSlug === slug) {
            // User confirmed
            setConfirmDeleteSlug(null);

            const res = await deleteSong(slug);
            if (res.success) {
                setStatus({ type: 'success', message: "Song deleted successfully" });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                fetchSongs();
            } else {
                setStatus({ type: 'error', message: "Failed to delete song" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteSlug(slug);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteSlug(null), 3000);
        }
    };

    // ... (lines 64-196)



    const filteredSongs = songs.filter(song =>
        song.locales.en.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.locales.mai.title.includes(searchQuery) ||
        song.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Songs Management</h1>
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
                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
                    <div className="flex-1 bg-white p-2 rounded-2xl border border-orange-100 flex items-center pr-6 shadow-sm">
                        <div className="p-4 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search songs by title or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <Link
                        href={`/${lang}/admin/songs/new`}
                        className="bg-gradient-to-r from-orange-600 to-orange-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 hover:shadow-xl hover:shadow-orange-900/30 transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Add New Song
                    </Link>
                </div>

                {isLoadingSongs ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading songs...</p>
                    </div>
                ) : filteredSongs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Music size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Songs Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            {searchQuery ? "We couldn't find any songs matching your search." : "No songs yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredSongs.map((song) => (
                            <div
                                key={song.slug}
                                className="group bg-white hover:bg-orange-50/30 rounded-2xl border border-orange-100 p-4 md:p-6 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                                            {song.category}
                                        </span>
                                        {song.occasion && (
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-200 px-2 py-0.5 rounded">
                                                {song.occasion}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate mb-1">
                                        {song.locales.mai.title}
                                    </h3>
                                    <h4 className="text-md text-gray-600 truncate mb-1">
                                        {song.locales.en.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500 mt-2">
                                        <div className="text-xs text-gray-300 font-mono">
                                            {song.slug}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/${lang}/admin/songs/${song.slug}`}
                                        className="p-3 bg-gray-50 hover:bg-orange-100 text-gray-600 hover:text-orange-700 rounded-xl transition-all"
                                        title="Edit Song"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(song.slug)}
                                        className={`p-3 rounded-xl transition-all flex items-center justify-center min-w-[44px] ${confirmDeleteSlug === song.slug
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600"
                                            }`}
                                        title={confirmDeleteSlug === song.slug ? "Click again to confirm" : "Delete Song"}
                                    >
                                        {confirmDeleteSlug === song.slug ? (
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

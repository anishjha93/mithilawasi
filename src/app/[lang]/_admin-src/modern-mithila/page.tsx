"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deleteModernPost, getAllModernPosts, ModernPost } from "./actions";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Sparkles,
    Loader2,
    LogOut,
    ArrowLeft,
    Calendar,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function ModernMithilaAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [posts, setPosts] = useState<ModernPost[]>([]);
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
        const data = await getAllModernPosts();
        setPosts(data);
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

            const res = await deleteModernPost(slug);
            if (res.success) {
                setStatus({ type: 'success', message: "Post deleted successfully" });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                fetchData();
            } else {
                setStatus({ type: 'error', message: "Failed to delete post" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteSlug(slug);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteSlug(null), 3000);
        }
    };

    const filtered = posts.filter(p =>
        p.locales.en.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.locales.hi.title.includes(searchQuery) ||
        p.locales.mai.title.includes(searchQuery)
    );

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-orange-800" size={32} />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Modern Mithila</h1>
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
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <Link
                        href={`/${lang}/admin/modern-mithila/new`}
                        className="bg-gradient-to-r from-pink-600 to-pink-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        New Post
                    </Link>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading posts...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Sparkles size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Posts Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Share the modern stories of Mithila.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((post) => (
                            <div
                                key={post.slug}
                                className="group bg-white rounded-2xl border border-orange-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                            >
                                <div className="h-48 bg-gray-100 relative">
                                    {post.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={post.image} alt={post.locales.en.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Sparkles size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur shadow-sm ${post.published ? 'text-green-600' : 'text-gray-500'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Link
                                            href={`/${lang}/admin/modern-mithila/${post.slug}`}
                                            className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-sm backdrop-blur-sm transition-colors"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className={`p-2 rounded-lg shadow-sm backdrop-blur-sm transition-colors flex items-center justify-center min-w-[32px] ${confirmDeleteSlug === post.slug
                                                ? "bg-red-600 text-white hover:bg-red-700"
                                                : "bg-white/90 hover:bg-white text-red-600"
                                                }`}
                                            title={confirmDeleteSlug === post.slug ? "Click again to confirm" : "Delete Post"}
                                        >
                                            {confirmDeleteSlug === post.slug ? <CheckCircle size={16} className="animate-pulse" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-medium">
                                        <Calendar size={12} />
                                        {post.date}
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-pink-600 uppercase font-bold tracking-wider">{post.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {post.locales.en.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                                        {post.locales.en.excerpt}
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

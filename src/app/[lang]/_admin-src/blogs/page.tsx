"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAllBlogsForAdmin } from "@/lib/blogs";
import { checkAuth, logout } from "../actions";
import { deleteBlog, getAllBlogsForAdminAction } from "./actions";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    FileText,
    Globe,
    Calendar,
    User,
    Loader2,
    LogOut,
    ChevronRight,
    ArrowLeft,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function BlogAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null); // composite key: lang-slug
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        checkAuth().then((isAuth) => {
            setIsAuthenticated(isAuth);
            setIsLoadingAuth(false);
            if (isAuth) {
                fetchBlogs();
            }
        });
    }, []);

    async function fetchBlogs() {
        setIsLoadingBlogs(true);
        const data = await getAllBlogsForAdminAction();
        setBlogs(data);
        setIsLoadingBlogs(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const handleDelete = async (slug: string, langKey: string) => {
        const compositeKey = `${langKey}-${slug}`;
        if (confirmDeleteKey === compositeKey) {
            // User confirmed
            setConfirmDeleteKey(null);

            const res = await deleteBlog(slug, langKey);
            if (res.success) {
                setStatus({ type: 'success', message: "Blog deleted successfully" });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                fetchBlogs();
            } else {
                setStatus({ type: 'error', message: "Failed to delete blog" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteKey(compositeKey);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteKey(null), 3000);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-red-800" size={32} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">Please login through the main admin portal first.</p>
                    <Link href={`/${lang}/admin`} className="bg-red-800 text-white px-6 py-2 rounded-lg font-bold">
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
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Blog Management</h1>
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
                            placeholder="Search blogs by title or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <Link
                        href={`/${lang}/admin/blogs/new`}
                        className="bg-gradient-to-r from-red-700 to-red-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 hover:shadow-xl hover:shadow-red-900/30 transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Write New Blog
                    </Link>
                </div>

                {isLoadingBlogs ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading your masterpieces...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <FileText size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Blogs Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            {searchQuery ? "We couldn't find any blogs matching your search." : "You haven't written any blogs yet. Start your first story today!"}
                        </p>
                        {!searchQuery && (
                            <Link
                                href={`/${lang}/admin/blogs/new`}
                                className="text-red-700 font-bold hover:underline"
                            >
                                Click here to create your first post
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredBlogs.map((blog) => (
                            <div
                                key={`${blog.lang}-${blog.slug}`}
                                className="group bg-white hover:bg-orange-50/30 rounded-2xl border border-orange-100 p-4 md:p-6 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${blog.status === 'published' ? 'bg-green-100 text-green-700' :
                                            blog.status === 'draft' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {blog.status}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                            <Globe size={10} />
                                            {blog.lang}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate mb-1">
                                        {blog.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {new Date(blog.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            {blog.author}
                                        </div>
                                        <div className="text-xs text-gray-300 font-mono">
                                            {blog.slug}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/${lang}/admin/blogs/${blog.slug}?lang=${blog.lang}`}
                                        className="p-3 bg-gray-50 hover:bg-orange-100 text-gray-600 hover:text-orange-700 rounded-xl transition-all"
                                        title="Edit Blog"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.slug, blog.lang)}
                                        className={`p-3 rounded-xl transition-all flex items-center justify-center min-w-[44px] ${confirmDeleteKey === `${blog.lang}-${blog.slug}`
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600"
                                            }`}
                                        title={confirmDeleteKey === `${blog.lang}-${blog.slug}` ? "Click again to confirm" : "Delete Blog"}
                                    >
                                        {confirmDeleteKey === `${blog.lang}-${blog.slug}` ? (
                                            <CheckCircle size={20} className="animate-pulse" />
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
                                    </button>
                                    <Link
                                        href={`/${blog.lang}/blog/${blog.slug}`}
                                        target="_blank"
                                        className="ml-2 p-3 text-gray-400 hover:text-gray-900 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
                                    >
                                        View
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

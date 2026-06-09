"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deleteObject, listObjects, StorageObject } from "./actions";
import {
    Trash2,
    Search,
    HardDrive,
    Loader2,
    LogOut,
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Copy,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function StorageAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [objects, setObjects] = useState<StorageObject[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
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
        setStatus({ type: 'idle', message: '' });
        const res = await listObjects();
        if (res.success) {
            setObjects(res.objects);
        } else {
            setStatus({ type: 'error', message: res.error || "Failed to load objects" });
        }
        setIsLoadingData(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

    const handleDelete = async (key: string) => {
        if (confirmDeleteKey === key) {
            // User confirmed
            setConfirmDeleteKey(null);
            setDeletingKey(key);

            const res = await deleteObject(key);

            if (res.success) {
                setObjects(prev => prev.filter(o => o.key !== key));
                setStatus({ type: 'success', message: 'Deleted successfully' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
            } else {
                setStatus({ type: 'error', message: res.error || "Failed to delete" });
            }
            setDeletingKey(null);
        } else {
            // First click - arm the button
            setConfirmDeleteKey(key);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteKey(null), 3000);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filtered = objects.filter(o =>
        o.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUsage = objects.reduce((acc, obj) => acc + obj.size, 0);
    const unusedCount = objects.filter(o => !o.isUsed).length;

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
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Storage Management</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Cloudflare R2</p>
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Usage</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatSize(totalUsage)}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unused Images</p>
                            <h3 className="text-2xl font-bold text-gray-900">{unusedCount}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Objects</p>
                            <h3 className="text-2xl font-bold text-gray-900">{objects.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
                    <div className="flex-1 bg-white p-2 rounded-2xl border border-orange-100 flex items-center pr-6 shadow-sm">
                        <div className="p-4 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <button
                        onClick={fetchData}
                        disabled={isLoadingData}
                        className="bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={20} className={isLoadingData ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Scanning bucket...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Preview</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Filename</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sources</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((obj) => (
                                        <tr key={obj.key} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={obj.url} alt="thumbnail" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <a href={obj.url} target="_blank" className="font-medium text-gray-900 hover:text-blue-600 break-all" title={obj.key}>
                                                        {obj.key}
                                                    </a>
                                                    <span className="text-xs text-gray-500">{new Date(obj.lastModified).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                {formatSize(obj.size)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {obj.isUsed ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100 whitespace-nowrap">
                                                        <CheckCircle size={12} />
                                                        In Use
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100 whitespace-nowrap">
                                                        <AlertTriangle size={12} />
                                                        Unused
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-[200px]">
                                                {obj.usages && obj.usages.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {obj.usages.slice(0, 2).map((usage, i) => (
                                                            <div key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded truncate" title={usage}>
                                                                {usage.split('/').pop()}
                                                            </div>
                                                        ))}
                                                        {obj.usages.length > 2 && (
                                                            <span className="text-[10px] text-gray-400 pl-1">+{obj.usages.length - 2} more</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(obj.url);
                                                            setStatus({ type: 'success', message: 'Copied URL to clipboard!' });
                                                            setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
                                                        }}
                                                        className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="Copy URL"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(obj.key)}
                                                        disabled={deletingKey === obj.key}
                                                        className={`p-2 rounded-lg transition-colors flex items-center justify-center min-w-[36px] ${confirmDeleteKey === obj.key
                                                            ? "bg-red-600 text-white hover:bg-red-700"
                                                            : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                                                            }`}
                                                        title={confirmDeleteKey === obj.key ? "Click again to confirm" : "Delete permanently"}
                                                    >
                                                        {deletingKey === obj.key ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : confirmDeleteKey === obj.key ? (
                                                            <CheckCircle size={18} className="animate-pulse" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

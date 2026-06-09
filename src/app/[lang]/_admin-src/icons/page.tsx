"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth, logout } from "../actions";
import { deleteIcon, getAllIcons, saveIcon, IconData } from "./actions";
import {
    Plus,
    Trash2,
    Search,
    ImageIcon,
    Loader2,
    LogOut,
    ArrowLeft,
    Copy,
    X,
    Save,
    CheckCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function IconsAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [icons, setIcons] = useState<IconData[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingIcon, setEditingIcon] = useState<IconData>({
        id: "",
        name: "",
        url: "",
        tags: [],
        category: "General"
    });
    const [newTag, setNewTag] = useState("");
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
        const data = await getAllIcons();
        setIcons(data);
        setIsLoadingData(false);
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const handleDelete = async (id: string) => {
        if (confirmDeleteId === id) {
            // User confirmed
            setConfirmDeleteId(null);

            const res = await deleteIcon(id);
            if (res.success) {
                fetchData();
            } else {
                setStatus({ type: 'error', message: res.message || "Failed to delete" });
            }
        } else {
            // First click - arm the button
            setConfirmDeleteId(id);
            // Auto-reset after 3 seconds
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    const handleSave = async () => {
        if (!editingIcon.name || !editingIcon.url) {
            setStatus({ type: 'error', message: "Name and URL are required" });
            return;
        }

        setIsSaving(true);
        const iconToSave = {
            ...editingIcon,
            id: editingIcon.id || Date.now().toString()
        };
        const res = await saveIcon(iconToSave);
        setIsSaving(false);

        if (res.success) {
            fetchData();
            setIsModalOpen(false);
            setEditingIcon({ id: "", name: "", url: "", tags: [], category: "General" });
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setStatus({ type: 'success', message: 'Copied URL to clipboard!' });
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 2000);
    };

    const filtered = icons.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-orange-800" size={32} />
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
                            <h1 className="text-2xl font-bold font-serif text-gray-900">Icon Registry</h1>
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
                            placeholder="Search icons by name or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3 outline-none text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditingIcon({ id: "", name: "", url: "", tags: [], category: "General" });
                            setIsModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Add Icon
                    </button>
                </div>

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading icons...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ImageIcon size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Icons Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Build your asset library.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filtered.map((icon) => (
                            <div
                                key={icon.id}
                                className="group bg-white rounded-2xl border border-orange-100 p-4 hover:shadow-lg transition-all flex flex-col items-center text-center relative"
                            >
                                <button
                                    onClick={() => handleDelete(icon.id)}
                                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all flex items-center justify-center ${confirmDeleteId === icon.id
                                        ? "bg-red-600 text-white opacity-100 scale-110"
                                        : "bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                                        }`}
                                    title={confirmDeleteId === icon.id ? "Click again to confirm" : "Delete Icon"}
                                >
                                    {confirmDeleteId === icon.id ? <CheckCircle size={14} className="animate-pulse" /> : <Trash2 size={14} />}
                                </button>

                                <div className="w-16 h-16 mb-4 flex items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={icon.url} alt={icon.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 truncate w-full mb-1">
                                    {icon.name}
                                </h3>
                                <div className="flex gap-1 flex-wrap justify-center mb-3">
                                    {icon.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => copyToClipboard(icon.url)}
                                    className="w-full mt-auto py-2 bg-gray-50 hover:bg-cyan-50 text-gray-600 hover:text-cyan-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Copy size={12} />
                                    Copy URL
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingIcon.id ? "Edit Icon" : "Add New Icon"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    value={editingIcon.name}
                                    onChange={(e) => setEditingIcon({ ...editingIcon, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="Icon Name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                                <input
                                    value={editingIcon.url}
                                    onChange={(e) => setEditingIcon({ ...editingIcon, url: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editingIcon.tags.map(tag => (
                                        <span key={tag} className="bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-cyan-100">
                                            {tag}
                                            <button
                                                onClick={() => setEditingIcon(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                                                className="hover:text-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newTag) {
                                                setEditingIcon(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
                                                setNewTag("");
                                            }
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
                                        placeholder="Add tag..."
                                    />
                                    <button
                                        onClick={() => {
                                            if (newTag) {
                                                setEditingIcon(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
                                                setNewTag("");
                                            }
                                        }}
                                        className="bg-cyan-100 text-cyan-700 p-3 rounded-xl"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-900/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Icon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

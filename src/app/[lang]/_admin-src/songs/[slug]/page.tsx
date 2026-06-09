"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getSongBySlug, saveSong } from "../actions";
import { Song, SongLocale } from "@/data/songs";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    Music,
    Video,
    FileText,
    List,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const INITIAL_LOCALE: SongLocale = { title: "", meaning: "" };
const INITIAL_SONG: Song = {
    id: "",
    slug: "",
    category: "Ritual",
    occasion: "",
    lyrics: "",
    youtubeUrl: "",
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    }
};

export default function SongEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [song, setSong] = useState<Song>(INITIAL_SONG);
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'mai'>('en');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        checkAuth().then(async (isAuth) => {
            if (!isAuth) {
                router.push(`/${lang}/admin`);
                return;
            }
            setIsAuthenticated(true);

            if (!isNew) {
                const fetchedSong = await getSongBySlug(slugParam);
                if (fetchedSong) {
                    setSong(fetchedSong);
                } else {
                    setStatus({ type: 'error', message: "Song not found" });
                    setTimeout(() => router.push(`/${lang}/admin/songs`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!song.slug || !song.locales.mai.title) {
            setStatus({ type: 'error', message: "Slug and Maithili Title are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await saveSong(song, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Song saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/songs`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof SongLocale, value: string) => {
        setSong(prev => ({
            ...prev,
            locales: {
                ...prev.locales,
                [activeTab]: {
                    ...prev.locales[activeTab],
                    [field]: value
                }
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-orange-800" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm transition-all">
                <div className="max-w-5xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/songs`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                                {isNew ? "Add New Song" : "Edit Song"}
                            </h1>
                        </div>
                    </div>

                    {status.type !== 'idle' && (
                        <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50 ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-bold text-sm">{status.message}</span>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Song
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <List size={18} className="text-orange-600" />
                                Metadata
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={song.slug}
                                        onChange={(e) => setSong(prev => ({ ...prev, slug: e.target.value }))}
                                        disabled={!isNew}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                                        placeholder="unique-song-slug"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={song.category}
                                        onChange={(e) => setSong(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                    >
                                        <option value="Ritual">Ritual</option>
                                        <option value="Devotional">Devotional</option>
                                        <option value="Seasonal">Seasonal</option>
                                        <option value="Social">Social</option>
                                        <option value="Festival">Festival</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Occasion (Optional)</label>
                                    <input
                                        type="text"
                                        value={song.occasion || ""}
                                        onChange={(e) => setSong(prev => ({ ...prev, occasion: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="e.g. Wedding, Chhath"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Youtube URL (Optional)</label>
                                    <div className="relative">
                                        <Video size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            value={song.youtubeUrl || ""}
                                            onChange={(e) => setSong(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Localized Content & Lyrics */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Language Tabs */}
                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                            <div className="flex border-b border-orange-100">
                                {(['en', 'hi', 'mai'] as const).map((locale) => (
                                    <button
                                        key={locale}
                                        onClick={() => setActiveTab(locale)}
                                        className={`flex-1 py-4 font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2
                                            ${activeTab === locale
                                                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600'
                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Globe size={16} />
                                        {locale === 'en' ? 'English' : locale === 'hi' ? 'Hindi' : 'Maithili'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Title ({activeTab === 'en' ? 'English' : activeTab === 'hi' ? 'Hindi' : 'Maithili'})
                                    </label>
                                    <input
                                        type="text"
                                        value={song.locales[activeTab].title}
                                        onChange={(e) => updateLocale('title', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Enter song title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Meaning / Context
                                    </label>
                                    <textarea
                                        value={song.locales[activeTab].meaning}
                                        onChange={(e) => updateLocale('meaning', e.target.value)}
                                        rows={4}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none"
                                        placeholder="Explain the meaning or context of the song..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lyrics (Universal) */}
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Music size={18} className="text-orange-600" />
                                Original Lyrics (Maithili)
                            </h2>
                            <textarea
                                value={song.lyrics}
                                onChange={(e) => setSong(prev => ({ ...prev, lyrics: e.target.value }))}
                                rows={10}
                                className="w-full bg-orange-50/30 border border-orange-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-orange-500 transition-colors resize-none"
                                placeholder="Enter the song lyrics here..."
                            />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

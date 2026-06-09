"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getMantraBySlug, saveMantra, Mantra, MantraLocale } from "../actions";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    BookOpen,
    Tag,
    X,
    Plus,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const INITIAL_LOCALE: MantraLocale = {
    title: "",
    meaning: "",
    transliteration: ""
};

const INITIAL_MANTRA: Mantra = {
    slug: "",
    category: "mantra",
    tags: [],
    mantra: "",
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    }
};

export default function MantraEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mantra, setMantra] = useState<Mantra>(INITIAL_MANTRA);
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'mai'>('en');
    const [newTag, setNewTag] = useState("");
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        checkAuth().then(async (isAuth) => {
            if (!isAuth) {
                router.push(`/${lang}/admin`);
                return;
            }
            setIsAuthenticated(true);

            if (!isNew) {
                const fetchedMantra = await getMantraBySlug(slugParam);
                if (fetchedMantra) {
                    setMantra(fetchedMantra);
                } else {
                    setStatus({ type: 'error', message: "Mantra not found" });
                    setTimeout(() => router.push(`/${lang}/admin/mantras`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!mantra.slug || !mantra.locales.en.title) {
            setStatus({ type: 'error', message: "Slug and English Title are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await saveMantra(mantra, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Mantra saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/mantras`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof MantraLocale, value: string) => {
        setMantra(prev => ({
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

    const addTag = () => {
        if (newTag && !mantra.tags.includes(newTag)) {
            setMantra(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setMantra(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
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
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/mantras`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                                {isNew ? "Add New Mantra" : "Edit Mantra"}
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
                        Save Mantra
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-orange-600" />
                                Mantra Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={mantra.slug}
                                        onChange={(e) => setMantra(prev => ({ ...prev, slug: e.target.value }))}
                                        disabled={!isNew}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                                        placeholder="unique-mantra-id"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={mantra.category}
                                        onChange={(e) => setMantra(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                    >
                                        <option value="mantra">Mantra</option>
                                        <option value="vrat_katha">Vrat Katha</option>
                                        <option value="stotra">Stotra</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {mantra.tags.map(tag => (
                                            <span key={tag} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-orange-100">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500"
                                            placeholder="Add tag..."
                                        />
                                        <button onClick={addTag} className="bg-orange-100 text-orange-700 p-2 rounded-xl hover:bg-orange-200">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sanskrit Mantra Text (Global) */}
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Sanskrit Text</h2>
                            <textarea
                                value={mantra.mantra}
                                onChange={(e) => setMantra(prev => ({ ...prev, mantra: e.target.value }))}
                                rows={6}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none font-serif text-lg leading-relaxed"
                                placeholder="Sanskrit text here..."
                            />
                            <p className="text-xs text-gray-400 mt-2">This is the main mantra text displayed in all languages usually.</p>
                        </div>
                    </div>

                    {/* Right Column: Localized Content */}
                    <div className="lg:col-span-2 space-y-6">

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

                            <div className="p-6 space-y-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Title ({activeTab})
                                    </label>
                                    <input
                                        type="text"
                                        value={mantra.locales[activeTab].title}
                                        onChange={(e) => updateLocale('title', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Mantra Title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Meaning / Translation
                                    </label>
                                    <textarea
                                        value={mantra.locales[activeTab].meaning}
                                        onChange={(e) => updateLocale('meaning', e.target.value)}
                                        rows={6}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none"
                                        placeholder="Meaning of the mantra..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Transliteration (Optional)
                                    </label>
                                    <textarea
                                        value={mantra.locales[activeTab].transliteration || ""}
                                        onChange={(e) => updateLocale('transliteration', e.target.value)}
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none font-mono text-sm"
                                        placeholder="Romanized text..."
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

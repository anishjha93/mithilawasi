"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getPersonalityBySlug, savePersonality, Personality, PersonalityLocale } from "../actions";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    Users,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Plus,
    X
} from "lucide-react";

const INITIAL_LOCALE: PersonalityLocale = {
    name: "",
    description: "",
    achievements: [],
    period: ""
};

const INITIAL_PERSON: Personality = {
    slug: "",
    image: "",
    born: "",
    died: "",
    profession: [],
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    },
    featured: false
};

export default function PersonalityEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [person, setPerson] = useState<Personality>(INITIAL_PERSON);
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'mai'>('en');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    // UI Helpers
    const [newProfession, setNewProfession] = useState("");
    const [newAchievement, setNewAchievement] = useState("");

    useEffect(() => {
        checkAuth().then(async (isAuth) => {
            if (!isAuth) {
                router.push(`/${lang}/admin`);
                return;
            }
            setIsAuthenticated(true);

            if (!isNew) {
                const fetched = await getPersonalityBySlug(slugParam);
                if (fetched) {
                    setPerson(fetched);
                } else {
                    setStatus({ type: 'error', message: "Personality not found" });
                    setTimeout(() => router.push(`/${lang}/admin/personalities`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!person.slug || !person.locales.en.name) {
            setStatus({ type: 'error', message: "Slug and English Name are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await savePersonality(person, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/personalities`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof PersonalityLocale, value: any) => {
        setPerson(prev => ({
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

    const addProfession = () => {
        if (newProfession && !person.profession.includes(newProfession)) {
            setPerson(prev => ({ ...prev, profession: [...prev.profession, newProfession] }));
            setNewProfession("");
        }
    };

    const removeProfession = (prof: string) => {
        setPerson(prev => ({ ...prev, profession: prev.profession.filter(p => p !== prof) }));
    };

    const addAchievement = () => {
        if (newAchievement) {
            const current = person.locales[activeTab].achievements;
            updateLocale('achievements', [...current, newAchievement]);
            setNewAchievement("");
        }
    };

    const removeAchievement = (index: number) => {
        const current = person.locales[activeTab].achievements;
        updateLocale('achievements', current.filter((_, i) => i !== index));
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/personalities`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                            {isNew ? "New Personality" : "Edit Personality"}
                        </h1>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users size={18} className="text-blue-600" />
                                Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="label-sm">Slug</label>
                                    <input
                                        type="text"
                                        value={person.slug}
                                        onChange={(e) => setPerson({ ...person, slug: e.target.value })}
                                        disabled={!isNew}
                                        className="input-base"
                                        placeholder="vidyapati"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Cannot be changed</p>}
                                </div>

                                <div>
                                    <label className="label-sm">Image URL</label>
                                    <input
                                        type="url"
                                        value={person.image}
                                        onChange={(e) => setPerson({ ...person, image: e.target.value })}
                                        className="input-base"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-sm">Born</label>
                                        <input
                                            type="text"
                                            value={person.born}
                                            onChange={(e) => setPerson({ ...person, born: e.target.value })}
                                            className="input-base"
                                            placeholder="1352"
                                        />
                                    </div>
                                    <div>
                                        <label className="label-sm">Died</label>
                                        <input
                                            type="text"
                                            value={person.died}
                                            onChange={(e) => setPerson({ ...person, died: e.target.value })}
                                            className="input-base"
                                            placeholder="1448"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label-sm">Professions</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {person.profession.map(prof => (
                                            <span key={prof} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                                                {prof}
                                                <button onClick={() => removeProfession(prof)} className="hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={newProfession}
                                            onChange={(e) => setNewProfession(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addProfession()}
                                            className="input-base"
                                            placeholder="Poet..."
                                        />
                                        <button onClick={addProfession} className="bg-blue-100 text-blue-700 p-2 rounded-xl">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        checked={person.featured}
                                        onChange={(e) => setPerson({ ...person, featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-bold text-gray-700">Featured Personality</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Localized Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                            <div className="flex border-b border-orange-100">
                                {(['en', 'hi', 'mai'] as const).map((locale) => (
                                    <button
                                        key={locale}
                                        onClick={() => setActiveTab(locale)}
                                        className={`flex-1 py-4 font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2
                                            ${activeTab === locale
                                                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
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
                                    <label className="label-sm">Name ({activeTab})</label>
                                    <input
                                        value={person.locales[activeTab].name}
                                        onChange={(e) => updateLocale('name', e.target.value)}
                                        className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-blue-500 outline-none bg-transparent"
                                        placeholder="Name"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Period / Era</label>
                                    <input
                                        value={person.locales[activeTab].period || ""}
                                        onChange={(e) => updateLocale('period', e.target.value)}
                                        className="input-base"
                                        placeholder="e.g. 14th Century"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Description</label>
                                    <textarea
                                        value={person.locales[activeTab].description}
                                        onChange={(e) => updateLocale('description', e.target.value)}
                                        rows={6}
                                        className="w-full input-base resize-none"
                                        placeholder="Biography..."
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Key Achievements</label>
                                    <div className="space-y-2 mb-3">
                                        {person.locales[activeTab].achievements.map((ach, i) => (
                                            <div key={i} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0" />
                                                <p className="text-sm text-gray-700 flex-1">{ach}</p>
                                                <button onClick={() => removeAchievement(i)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={newAchievement}
                                            onChange={(e) => setNewAchievement(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                                            className="input-base"
                                            placeholder="Add achievement..."
                                        />
                                        <button onClick={addAchievement} className="bg-blue-100 text-blue-700 p-2 rounded-xl">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .label-sm {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }
                .input-base {
                    width: 100%;
                    background-color: #f9fafb; /* gray-50 */
                    border: 1px solid #e5e7eb; /* gray-200 */
                    border-radius: 0.75rem; /* rounded-xl */
                    padding: 0.75rem 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .input-base:focus {
                    border-color: #3b82f6; /* blue-500 */
                }
            `}</style>
        </div>
    );
}

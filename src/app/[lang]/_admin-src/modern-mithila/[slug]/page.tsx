"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getModernPostBySlug, saveModernPost, ModernPost, ModernPostLocale } from "../actions";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    Sparkles,
    Trash2,
    Plus,
    X,
    ImageIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const INITIAL_LOCALE: ModernPostLocale = {
    title: "",
    excerpt: "",
    content: "",
    author: ""
};

const INITIAL_POST: ModernPost = {
    slug: "",
    image: "",
    category: "News",
    date: new Date().toISOString().split('T')[0],
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    },
    published: false,
    tags: []
};

export default function ModernMithilaEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [post, setPost] = useState<ModernPost>(INITIAL_POST);
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
                const fetched = await getModernPostBySlug(slugParam);
                if (fetched) {
                    setPost(fetched);
                } else {
                    setStatus({ type: 'error', message: "Post not found" });
                    setTimeout(() => router.push(`/${lang}/admin/modern-mithila`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!post.slug || !post.locales.en.title) {
            setStatus({ type: 'error', message: "Slug and English Title are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await saveModernPost(post, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/modern-mithila`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof ModernPostLocale, value: any) => {
        setPost(prev => ({
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
        if (newTag && !post.tags.includes(newTag)) {
            setPost(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/modern-mithila`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                            {isNew ? "New Post" : "Edit Post"}
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
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
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
                                <Sparkles size={18} className="text-pink-600" />
                                Post Metadata
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="label-sm">Slug</label>
                                    <input
                                        type="text"
                                        value={post.slug}
                                        onChange={(e) => setPost({ ...post, slug: e.target.value })}
                                        disabled={!isNew}
                                        className="input-base"
                                        placeholder="modern-mithila-art-trends"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Cannot be changed</p>}
                                </div>

                                <div>
                                    <label className="label-sm">Image URL</label>
                                    <input
                                        type="url"
                                        value={post.image}
                                        onChange={(e) => setPost({ ...post, image: e.target.value })}
                                        className="input-base"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Category</label>
                                    <select
                                        value={post.category}
                                        onChange={(e) => setPost({ ...post, category: e.target.value })}
                                        className="input-base"
                                    >
                                        <option value="News">News</option>
                                        <option value="Art">Art</option>
                                        <option value="Tech">Tech</option>
                                        <option value="Business">Business</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label-sm">Date</label>
                                    <input
                                        type="date"
                                        value={post.date}
                                        onChange={(e) => setPost({ ...post, date: e.target.value })}
                                        className="input-base"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-pink-100">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                            className="input-base text-sm"
                                            placeholder="Tag..."
                                        />
                                        <button onClick={addTag} className="bg-pink-100 text-pink-700 p-2 rounded-xl">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        checked={post.published}
                                        onChange={(e) => setPost({ ...post, published: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label className="text-sm font-bold text-gray-700">Published</label>
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
                                                ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-600'
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
                                    <label className="label-sm">Title ({activeTab})</label>
                                    <input
                                        value={post.locales[activeTab].title}
                                        onChange={(e) => updateLocale('title', e.target.value)}
                                        className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-pink-500 outline-none bg-transparent"
                                        placeholder="Article Title"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Author</label>
                                    <input
                                        value={post.locales[activeTab].author}
                                        onChange={(e) => updateLocale('author', e.target.value)}
                                        className="input-base"
                                        placeholder="Post Author Name"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Excerpt</label>
                                    <textarea
                                        value={post.locales[activeTab].excerpt}
                                        onChange={(e) => updateLocale('excerpt', e.target.value)}
                                        rows={3}
                                        className="w-full input-base resize-none"
                                        placeholder="Short summary..."
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Content (Markdown)</label>
                                    <textarea
                                        value={post.locales[activeTab].content}
                                        onChange={(e) => updateLocale('content', e.target.value)}
                                        rows={12}
                                        className="w-full input-base resize-none font-mono text-sm"
                                        placeholder="# Hello World..."
                                    />
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
                    border-color: #db2777; /* pink-600 */
                }
            `}</style>
        </div>
    );
}

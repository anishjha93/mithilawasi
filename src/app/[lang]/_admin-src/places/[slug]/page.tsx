"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getPlaceBySlug, savePlace, Place, PlaceLocale } from "../actions";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    MapPin,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Plus,
    X,
    ImageIcon
} from "lucide-react";

const INITIAL_LOCALE: PlaceLocale = {
    name: "",
    description: "",
    location: "",
    significance: ""
};

const INITIAL_PLACE: Place = {
    slug: "",
    images: [],
    coordinates: "",
    mapEmbedUrl: "",
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    },
    featured: false
};

export default function PlaceEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [place, setPlace] = useState<Place>(INITIAL_PLACE);
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'mai'>('en');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    // UI Helpers
    const [newImage, setNewImage] = useState("");

    useEffect(() => {
        checkAuth().then(async (isAuth) => {
            if (!isAuth) {
                router.push(`/${lang}/admin`);
                return;
            }
            setIsAuthenticated(true);

            if (!isNew) {
                const fetched = await getPlaceBySlug(slugParam);
                if (fetched) {
                    setPlace(fetched);
                } else {
                    setStatus({ type: 'error', message: "Place not found" });
                    setTimeout(() => router.push(`/${lang}/admin/places`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!place.slug || !place.locales.en.name) {
            setStatus({ type: 'error', message: "Slug and English Name are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await savePlace(place, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/places`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof PlaceLocale, value: any) => {
        setPlace(prev => ({
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

    const addImage = () => {
        if (newImage) {
            setPlace(prev => ({ ...prev, images: [...prev.images, newImage] }));
            setNewImage("");
        }
    };

    const removeImage = (index: number) => {
        setPlace(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans pb-20">
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/places`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                            {isNew ? "New Place" : "Edit Place"}
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
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
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
                                <MapPin size={18} className="text-green-600" />
                                Location Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="label-sm">Slug</label>
                                    <input
                                        type="text"
                                        value={place.slug}
                                        onChange={(e) => setPlace({ ...place, slug: e.target.value })}
                                        disabled={!isNew}
                                        className="input-base"
                                        placeholder="madhubani-art-center"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Cannot be changed</p>}
                                </div>

                                <div>
                                    <label className="label-sm">Coordinates (Lat, Lng)</label>
                                    <input
                                        type="text"
                                        value={place.coordinates || ""}
                                        onChange={(e) => setPlace({ ...place, coordinates: e.target.value })}
                                        className="input-base"
                                        placeholder="26.35, 86.08"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Google Maps Embed URL</label>
                                    <input
                                        type="url"
                                        value={place.mapEmbedUrl || ""}
                                        onChange={(e) => setPlace({ ...place, mapEmbedUrl: e.target.value })}
                                        className="input-base"
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Paste the 'src' value from Google Maps Embed code</p>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        checked={place.featured}
                                        onChange={(e) => setPlace({ ...place, featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label className="text-sm font-bold text-gray-700">Featured Place</label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-green-600" />
                                Images Listing
                            </h2>
                            <div className="space-y-3">
                                {place.images.map((img, i) => (
                                    <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg text-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="Thumb" className="w-10 h-10 object-cover rounded" />
                                        <span className="flex-1 truncate text-gray-500 text-xs">{img}</span>
                                        <button onClick={() => removeImage(i)} className="text-red-500"><X size={16} /></button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <input
                                        value={newImage}
                                        onChange={(e) => setNewImage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addImage()}
                                        className="input-base text-sm"
                                        placeholder="Image URL..."
                                    />
                                    <button onClick={addImage} className="bg-green-100 text-green-700 p-2 rounded-xl">
                                        <Plus size={20} />
                                    </button>
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
                                                ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
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
                                    <label className="label-sm">Place Name ({activeTab})</label>
                                    <input
                                        value={place.locales[activeTab].name}
                                        onChange={(e) => updateLocale('name', e.target.value)}
                                        className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-green-500 outline-none bg-transparent"
                                        placeholder="Place Name"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Location String</label>
                                    <input
                                        value={place.locales[activeTab].location}
                                        onChange={(e) => updateLocale('location', e.target.value)}
                                        className="input-base"
                                        placeholder="e.g. Madhubani, Bihar"
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Significance</label>
                                    <input
                                        value={place.locales[activeTab].significance}
                                        onChange={(e) => updateLocale('significance', e.target.value)}
                                        className="input-base"
                                        placeholder="Historical, Religious, etc."
                                    />
                                </div>

                                <div>
                                    <label className="label-sm">Description</label>
                                    <textarea
                                        value={place.locales[activeTab].description}
                                        onChange={(e) => updateLocale('description', e.target.value)}
                                        rows={8}
                                        className="w-full input-base resize-none"
                                        placeholder="About this place..."
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
                    border-color: #22c55e; /* green-500 */
                }
            `}</style>
        </div>
    );
}

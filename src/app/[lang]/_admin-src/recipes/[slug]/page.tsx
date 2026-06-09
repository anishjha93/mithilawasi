"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../actions";
import { getRecipeBySlug, saveRecipe } from "../actions";
import { Recipe, RecipeLocale } from "@/data/recipes";
import {
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    Utensils,
    Clock,
    Users,
    CheckCircle2,
    AlertCircle,
    Plus,
    X
} from "lucide-react";

const INITIAL_LOCALE: RecipeLocale = {
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    culturalSignificance: ""
};

const INITIAL_RECIPE: Recipe = {
    slug: "",
    category: "Main Course",
    prepTime: "",
    cookTime: "",
    servings: 4,
    author: "",
    locales: {
        en: { ...INITIAL_LOCALE },
        hi: { ...INITIAL_LOCALE },
        mai: { ...INITIAL_LOCALE }
    }
};

export default function RecipeEditorPage() {
    const params = useParams();
    const router = useRouter();
    const lang = params.lang as string;
    const slugParam = params.slug as string;
    const isNew = slugParam === "new";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [recipe, setRecipe] = useState<Recipe>(INITIAL_RECIPE);
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
                const fetchedRecipe = await getRecipeBySlug(slugParam);
                if (fetchedRecipe) {
                    setRecipe(fetchedRecipe);
                } else {
                    setStatus({ type: 'error', message: "Recipe not found" });
                    setTimeout(() => router.push(`/${lang}/admin/recipes`), 2000);
                }
            }
            setIsLoading(false);
        });
    }, [isNew, slugParam, lang, router]);

    const handleSave = async () => {
        if (!recipe.slug || !recipe.locales.en.title) {
            setStatus({ type: 'error', message: "Slug and English Title are required" });
            return;
        }

        setIsSaving(true);
        setStatus({ type: 'idle', message: '' });

        const res = await saveRecipe(recipe, isNew);
        setIsSaving(false);

        if (res.success) {
            setStatus({ type: 'success', message: "Recipe saved successfully!" });
            setTimeout(() => {
                router.push(`/${lang}/admin/recipes`);
                router.refresh();
            }, 1500);
        } else {
            setStatus({ type: 'error', message: res.message || "Failed to save" });
        }
    };

    const updateLocale = (field: keyof RecipeLocale, value: any) => {
        setRecipe(prev => ({
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

    // Helper to manage array fields (ingredients, instructions)
    const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
        const currentArray = [...recipe.locales[activeTab][field]];
        currentArray[index] = value;
        updateLocale(field, currentArray);
    };

    const addArrayItem = (field: 'ingredients' | 'instructions') => {
        const currentArray = [...recipe.locales[activeTab][field]];
        currentArray.push("");
        updateLocale(field, currentArray);
    };

    const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
        const currentArray = [...recipe.locales[activeTab][field]];
        currentArray.splice(index, 1);
        updateLocale(field, currentArray);
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
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <Link href={`/${lang}/admin/recipes`} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold font-serif text-gray-900">
                                {isNew ? "Add New Recipe" : "Edit Recipe"}
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
                        Save Recipe
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Utensils size={18} className="text-orange-600" />
                                Recipe Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={recipe.slug}
                                        onChange={(e) => setRecipe(prev => ({ ...prev, slug: e.target.value }))}
                                        disabled={!isNew}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                                        placeholder="unique-recipe-slug"
                                    />
                                    {!isNew && <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={recipe.category}
                                        onChange={(e) => setRecipe(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                    >
                                        <option value="Main Course">Main Course</option>
                                        <option value="Sweets">Sweets</option>
                                        <option value="Snacks">Snacks</option>
                                        <option value="Chutney/Pickle">Chutney/Pickle</option>
                                        <option value="Festival Special">Festival Special</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prep Time</label>
                                        <div className="relative">
                                            <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                value={recipe.prepTime}
                                                onChange={(e) => setRecipe(prev => ({ ...prev, prepTime: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                                placeholder="15 mins"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cook Time</label>
                                        <div className="relative">
                                            <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                value={recipe.cookTime}
                                                onChange={(e) => setRecipe(prev => ({ ...prev, cookTime: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                                placeholder="30 mins"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Servings</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="number"
                                            value={recipe.servings}
                                            onChange={(e) => setRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 0 }))}
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                            placeholder="4"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author (Optional)</label>
                                    <input
                                        type="text"
                                        value={recipe.author || ""}
                                        onChange={(e) => setRecipe(prev => ({ ...prev, author: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Name of contributor"
                                    />
                                </div>
                            </div>
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
                                        value={recipe.locales[activeTab].title}
                                        onChange={(e) => updateLocale('title', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Recipe Title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={recipe.locales[activeTab].description}
                                        onChange={(e) => updateLocale('description', e.target.value)}
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none"
                                        placeholder="Brief description of the dish..."
                                    />
                                </div>

                                {/* Ingredients List */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Ingredients
                                        </label>
                                        <button
                                            onClick={() => addArrayItem('ingredients')}
                                            className="text-orange-600 text-xs font-bold flex items-center gap-1 hover:text-orange-700"
                                        >
                                            <Plus size={14} /> Add Ingredient
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {recipe.locales[activeTab].ingredients.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('ingredients', idx, e.target.value)}
                                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors"
                                                    placeholder={`Ingredient ${idx + 1}`}
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('ingredients', idx)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Instructions List */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Instructions
                                        </label>
                                        <button
                                            onClick={() => addArrayItem('instructions')}
                                            className="text-orange-600 text-xs font-bold flex items-center gap-1 hover:text-orange-700"
                                        >
                                            <Plus size={14} /> Add Step
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {recipe.locales[activeTab].instructions.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <div className="w-8 h-10 flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-xs rounded-lg shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <textarea
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('instructions', idx, e.target.value)}
                                                    rows={2}
                                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors resize-none"
                                                    placeholder={`Step ${idx + 1}...`}
                                                />
                                                <button
                                                    onClick={() => removeArrayItem('instructions', idx)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start mt-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Cultural Significance
                                    </label>
                                    <textarea
                                        value={recipe.locales[activeTab].culturalSignificance}
                                        onChange={(e) => updateLocale('culturalSignificance', e.target.value)}
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none"
                                        placeholder="Significance of this dish..."
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

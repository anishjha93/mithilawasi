
'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function SubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/community/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            setResult(json);
            if (json.success) {
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            setResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 bg-paper-texture border-madhubani rounded-xl shadow-xl relative overflow-hidden">
            {/* Decorative background pattern overlay */}
            <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />

            <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-heading text-primary-red font-bold text-center border-b border-dashed border-primary-yellow pb-4 mb-2">
                    Share Your Mithila Story
                </h2>
                <p className="text-[0.95rem] text-gray-600 text-center italic font-body">
                    "Your memories are the threads that weave our heritage."
                </p>
            </div>

            {result?.message && (
                <div aria-live="polite" className={`p-4 rounded-md text-sm relative z-10 ${result.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {result.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Your Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm transition-all"
                        placeholder="e.g. Ram Ji Jha"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm transition-all"
                        placeholder="contact@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Location (Village/City)</label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm transition-all"
                        placeholder="e.g. Madhubani"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Category</label>
                    <select
                        id="category"
                        name="category"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm transition-all"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a category...</option>
                        <option value="Folklore">Folklore (Katha)</option>
                        <option value="Memory">Childhood Memory</option>
                        <option value="Recipe">Family Recipe</option>
                        <option value="Ritual">Ritual/Festival</option>
                        <option value="Song">Folk Song (Geet)</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label htmlFor="title" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Story Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm transition-all"
                    placeholder="The title of your story..."
                />
            </div>

            <div className="space-y-2 relative z-10">
                <label htmlFor="content" className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">Your Story</label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red/50 bg-white/60 backdrop-blur-sm resize-y transition-all"
                    placeholder="Share your story here in English or Maithili..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative z-10 flex items-center justify-center gap-2 bg-primary-red text-white font-bold py-3.5 px-6 rounded-full hover:bg-[#8e1c26] transition-all transform hover:-translate-y-1 shadow-md disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit Story'
                )}
            </button>
        </form>
    );
}

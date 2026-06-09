'use client';

import { useState } from 'react';
import { Send, Sparkles, Image as ImageIcon, BookOpen, Utensils } from 'lucide-react';

import { sendStoryEmail } from '@/app/actions/contact';

export default function ShareStorySection({ dictionary }: { dictionary: any }) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { shareStory } = dictionary;
    const form = shareStory.form;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-gradient-to-br from-primary-red to-[#80101b] rounded-[32px] p-12 text-center text-white shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold font-serif mb-4">{form.success}</h3>
                <p className="text-white/80 max-w-lg mx-auto text-lg">
                    We will review it shortly. Keep sharing the legacy!
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-8 py-3 bg-white text-primary-red rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                    Share Another
                </button>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-[#fff9f0] to-[#fff] dark:from-zinc-900 dark:to-zinc-950 rounded-[32px] p-8 md:p-12 border border-border-color shadow-[0_20px_60px_rgba(200,75,49,0.05)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FF0066" d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,55,18.7C52.6,29.3,43.8,38.6,34,45.9C24.1,53.2,13.2,58.4,0.6,57.6C-12.1,56.7,-26.1,49.8,-38.7,40.7C-51.3,31.6,-62.5,20.3,-65.3,7C-68.1,-6.3,-62.5,-21.6,-53.2,-33.4C-43.9,-45.2,-30.9,-53.5,-18.2,-59.8C-5.5,-66.1,6.8,-70.4,19.9,-68.8C33,-67.2,46.9,-59.7,42.7,-62.9Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="lg:w-1/3">
                    <span className="inline-block px-4 py-1.5 bg-[#feebc8] text-[#d97706] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        Community
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-red mb-6 font-serif leading-tight">
                        {shareStory.title}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        {shareStory.intro}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-zinc-800/60 p-4 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="font-medium">{form.types.memory}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-zinc-800/60 p-4 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium">{form.types.recipe}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-zinc-800/60 p-4 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">{form.types.photo}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-[24px] shadow-sm border border-border-color space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{form.name}</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-border-color rounded-xl focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red outline-none transition-all dark:text-white dark:placeholder-gray-400"
                                    placeholder="Mithila Vasi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{form.email}</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-border-color rounded-xl focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red outline-none transition-all dark:text-white dark:placeholder-gray-400"
                                    placeholder="contact@mithilawasi.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{form.type}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['memory', 'recipe', 'photo'].map((type) => (
                                    <label key={type} className="cursor-pointer">
                                        <input type="radio" name="storyType" value={type} className="peer sr-only" required defaultChecked={type === 'memory'} />
                                        <div className="text-center py-3 px-2 rounded-xl border-2 border-border-color text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 peer-checked:border-primary-red peer-checked:text-primary-red peer-checked:bg-primary-red/5 transition-all text-sm font-bold">
                                            {form.types[type as keyof typeof form.types]}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{form.message}</label>
                            <textarea
                                name="message"
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-border-color rounded-xl focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red outline-none transition-all resize-none dark:text-white dark:placeholder-gray-400"
                                placeholder="..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full py-4 bg-primary-red text-white rounded-xl font-bold text-lg hover:bg-primary-red/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {form.submit} <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

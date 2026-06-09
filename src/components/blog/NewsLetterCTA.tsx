'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function NewsLetterCTA() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const json = await response.json();
            setResult(json);
            if (json.success) {
                setEmail('');
            }
        } catch (error) {
            setResult({ success: false, message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 md:py-32 bg-paper-texture relative overflow-hidden">
            <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.05] pointer-events-none" />
            <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-20 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-6xl font-heading text-primary-red font-bold animate-fade-in-up">
                            Join the Mithilawasi
                        </h2>
                        <p className="text-xl md:text-2xl text-text-muted font-body max-w-2xl mx-auto italic animate-fade-in-up delay-100">
                            Get weekly stories, folklore, and cultural updates delivered to your inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow px-6 py-4 rounded-full border-2 border-primary-yellow focus:border-primary-red outline-none transition-all font-body text-lg"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary-red hover:bg-[#8e1c26] text-white font-bold px-10 py-4 rounded-full transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                'Subscribe'
                            )}
                        </button>
                    </form>

                    {result && (
                        <p className={`text-lg font-bold ${result.success ? 'text-green-600' : 'text-primary-red'}`}>
                            {result.message}
                        </p>
                    )}

                    <p className="text-sm text-gray-500 font-body italic">
                        No spam. Just culture. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
}


import { getDictionary } from '@/get-dictionary';
import { MoveLeft, Search, BookA } from 'lucide-react';
import Link from 'next/link';
import DictionaryClient from './DictionaryClient';

export const metadata = {
    title: 'Maithili Dictionary - Mithilawasi',
    description: 'Learn basic Maithili words and phrases. A beginner friendly dictionary.',
};

export default async function DictionaryPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { dictionaryPage } = dict;

    return (
        <main className="min-h-screen bg-[#fdfbf7] text-stone-900 pb-20 font-sans">
            <div className="bg-[#e67e22] text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://cdn.mithilawasi.com/hero-bg.webp')] opacity-10" />
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <Link
                        href={`/${lang}/culture`}
                        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors uppercase tracking-widest text-sm font-semibold"
                    >
                        <MoveLeft className="w-4 h-4 mr-2" />
                        {lang === 'en' ? 'Back to Culture' : (lang === 'hi' ? 'संस्कृति पर वापस' : 'संस्कृति पर घुरु')}
                    </Link>
                    <div className="flex justify-center mb-4">
                        <BookA className="w-16 h-16 text-white/90" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 shadow-sm">
                        {dictionaryPage?.title || 'Maithili Dictionary'}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
                        {dictionaryPage?.intro || 'Learn the sweet language'}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
                <DictionaryClient dictionary={dictionaryPage} lang={lang} />
            </div>
        </main>
    );
}

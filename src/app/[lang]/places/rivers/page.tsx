
import { getDictionary } from '@/get-dictionary';
import { MoveLeft, Waves } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Sacred Rivers of Mithila - Mithilawasi',
    description: 'Explore the sacred geography of Mithila, defined by the holy Ganga, Kosi, Bagmati, and Kamala rivers.',
};

export default async function RiversPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { riversPage } = dict;

    // Default river colors/gradients if not in JSON or to enhance UI
    const riverStyles: Record<string, string> = {
        'Ganga': 'from-blue-600 to-indigo-800',
        'Kosi': 'from-cyan-500 to-blue-600',
        'Bagmati': 'from-teal-500 to-emerald-700',
        'Kamala': 'from-sky-400 to-blue-500',
        'Gandaki': 'from-indigo-500 to-purple-700',
        // Hi/Mai fallbacks
        'गंगा': 'from-blue-600 to-indigo-800',
        'कोसी (कौशिकी)': 'from-cyan-500 to-blue-600',
        'बागमती': 'from-teal-500 to-emerald-700',
        'कमला': 'from-sky-400 to-blue-500',
        'गंडकी': 'from-indigo-500 to-purple-700'
    };

    return (
        <main className="min-h-screen bg-stone-50 text-stone-900 pb-20 font-sans">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900 z-10" />
                    {/* Abstract Water Background */}
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black opacity-80 animate-pulse" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <Link
                        href={`/${lang}/places`}
                        className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors uppercase tracking-widest text-sm font-semibold"
                    >
                        <MoveLeft className="w-4 h-4 mr-2" />
                        {dict.placesPage?.title || 'Back'}
                    </Link>
                    <div className="flex justify-center mb-6">
                        <Waves className="w-16 h-16 text-blue-400 opacity-80" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-6 font-serif">
                        {riversPage.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed font-light">
                        {riversPage.description}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="space-y-40">
                    {riversPage.rivers.map((river: any, idx: number) => {
                        const style = riverStyles[river.name.split(' ')[0]] || 'from-blue-500 to-blue-700'; // Fallback
                        const isEven = idx % 2 === 0;

                        return (
                            <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
                                {/* Visual Side */}
                                <div className="w-full md:w-1/2 relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${style} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700 rounded-full`} />
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white bg-slate-100">
                                        <div className={`w-full h-full bg-gradient-to-br ${style} opacity-90 flex items-center justify-center`}>
                                            <span className="text-9xl opacity-20 text-white font-serif select-none">
                                                {river.name.charAt(0)}
                                            </span>
                                        </div>
                                        {/* If we had real images, they would go here. For now, abstract gradients look premium. */}
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl z-10 hidden md:flex">
                                        <div className="text-center">
                                            <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Significance</span>
                                            <span className="block text-sm font-bold text-slate-800 px-2">{river.significance.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="w-full md:w-1/2 md:px-8">
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 font-serif">
                                        {river.name}
                                    </h2>
                                    <div className="w-20 h-1 bg-blue-500 mb-8" />
                                    <p className="text-xl text-slate-600 leading-loose mb-8">
                                        {river.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                            {river.significance}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Quote or CTA */}
            <div className="bg-blue-50 py-24 mt-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-3xl md:text-4xl font-serif text-blue-900/80 italic mb-8">
                        "Water is the driving force of all nature."
                    </p>
                    <Link
                        href={`/${lang}/places`}
                        className="inline-block px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        {dict.placesPage?.title || 'Explore More Places'}
                    </Link>
                </div>
            </div>
        </main>
    );
}

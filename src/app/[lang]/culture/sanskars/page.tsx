
import { getDictionary } from '@/get-dictionary';
import { MoveLeft, Baby, GraduationCap, HeartHandshake, Skull } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: '16 Sanskars of Mithila - Mithilawasi',
    description: 'The sixteen sacred rituals of Mithila culture marking the journey of life.',
};

export default async function SanskarsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { sanskarsPage } = dict;

    const colorMap: Record<string, any> = {
        'rose-500': { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-600', dot: 'bg-rose-500', icon: Baby },
        'amber-500': { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', dot: 'bg-amber-500', icon: Baby }, // Using Baby for Childhood too, simplistic
        'blue-500': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', dot: 'bg-blue-500', icon: GraduationCap },
        'purple-500': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600', dot: 'bg-purple-500', icon: HeartHandshake },
    };

    return (
        <main className="min-h-screen bg-background text-foreground pb-24">
            {/* Header */}
            <div className="relative bg-stone-900 text-white py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://cdn.mithilawasi.com/hero-bg.webp')] bg-repeat" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <Link
                        href={`/${lang}/culture`}
                        className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors uppercase tracking-widest text-sm font-semibold"
                    >
                        <MoveLeft className="w-4 h-4 mr-2" />
                        {lang === 'en' ? 'Back to Culture' : lang === 'hi' ? 'संस्कृति पर वापस' : 'संस्कृति पर घुरु'}
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">{sanskarsPage.title}</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
                        {sanskarsPage.description}
                    </p>
                </div>
            </div>

            {/* Timeline Container */}
            <div className="max-w-4xl mx-auto px-6 mt-16">

                <div className="space-y-16">
                    {sanskarsPage.phases.map((phase: any, phaseIdx: number) => {
                        const colors = colorMap[phase.color] || colorMap['rose-500'];
                        const Icon = colors.icon;

                        return (
                            <div key={phaseIdx} className="relative">
                                {/* Phase Header */}
                                <div className="sticky top-4 z-20 bg-background/95 backdrop-blur-sm py-4 mb-8 border-b border-border-color">
                                    <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-3 font-serif`}>
                                        <span className={`p-2 rounded-lg ${colors.bg}`}>
                                            <Icon className="w-6 h-6" />
                                        </span>
                                        {phase.title}
                                    </h2>
                                </div>

                                {/* Items Grid */}
                                <div className="grid gap-6 md:grid-cols-2 relative lg:ml-8">
                                    {/* Vertical Line for Desktop */}
                                    <div className={`absolute left-[-20px] top-4 bottom-4 w-0.5 ${colors.bg.replace('bg-', 'bg-').replace('50', '200')} dark:bg-stone-700 hidden lg:block`} />

                                    {phase.items.map((item: any, itemIdx: number) => (
                                        <div
                                            key={itemIdx}
                                            className={`group relative bg-card-bg p-6 rounded-xl shadow-sm border border-border-color hover:shadow-md transition-all duration-300 hover:border-${phase.color} hover:-translate-y-1`}
                                        >
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${colors.dot} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                            {/* Connector Dot for Desktop Timeline */}
                                            <div className={`hidden lg:block absolute left-[-38px] top-8 w-4 h-4 rounded-full border-2 border-white dark:border-stone-800 ${colors.dot} z-10`} />

                                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-foreground transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-text-muted leading-relaxed text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigational Footer */}
            <div className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-border-color flex justify-between">
                <Link href={`/${lang}/culture/songs`} className="text-text-muted hover:text-foreground font-medium">
                    ← {lang === 'en' ? 'Folk Songs' : lang === 'hi' ? 'लोक गीत' : 'लोक गीत'}
                </Link>
                <Link href={`/${lang}/places/rivers`} className="text-text-muted hover:text-foreground font-medium">
                    {lang === 'en' ? 'Sacred Rivers' : lang === 'hi' ? 'पवित्र नदियाँ' : 'पवित्र नदी'} →
                </Link>
            </div>
        </main>
    );
}

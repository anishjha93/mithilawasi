import { getDictionary } from '@/get-dictionary';

import type { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/history`;

    return {
        title: dict.historyPage.title,
        description: dict.historyPage.lead,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/history`,
                'hi-IN': `${baseUrl}/hi/history`,
                'mai-IN': `${baseUrl}/mai/history`,
                'x-default': `${baseUrl}/en/history`,
            },
        },
        keywords: [
            'Mithila History', 'Videha Kingdom', 'Janak Dynasty',
            'Karnata Dynasty', 'Oiniwar Dynasty', 'Darbhanga Raj',
            'Ancient India History', 'King Janak', 'Sita Birthplace',
            'Maithil Brahmins History'
        ]
    };
}

import HistoryTimeline from '@/components/HistoryTimeline';

export default async function HistoryPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const history = dict.historyPage;

    const timelineEvents = [
        {
            year: history.eras.ancient.marker,
            title: history.eras.ancient.title,
            description: `${history.eras.ancient.text1} ${history.eras.ancient.text2}`
        },
        {
            year: history.eras.vajjika.marker,
            title: history.eras.vajjika.title,
            description: history.eras.vajjika.text
        },
        {
            year: history.eras.medieval.marker,
            title: history.eras.medieval.title,
            description: "The golden age of Maithili literature and architecture under diverse influential dynasties."
        },
        {
            year: history.eras.modern.marker,
            title: history.eras.modern.title,
            description: `${history.eras.modern.text1} ${history.eras.modern.text2}`
        }
    ];

    const schemaData = {
        headline: history.title,
        description: history.lead,
        image: 'https://mithilawasi.comhttps://cdn.mithilawasi.com/hero-bg.webp',
        datePublished: '2025-01-01',
        dateModified: new Date().toISOString().split('T')[0]
    };

    return (
        <div className="bg-paper-texture min-h-screen">
            <JsonLd type="Article" data={schemaData} />
            
            {/* Immersive Header */}
            <header className="relative py-24 md:py-32 overflow-hidden px-4 mb-8">
                <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-40"></div>
                <div className="container relative z-10 text-center max-w-4xl mx-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full glass-morphism mb-6 animate-fade-in-up">
                        <span className="text-primary-red font-bold text-xs md:text-sm tracking-[0.3em] uppercase">Chronicles of Videha</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-mithila-ink mb-8 font-heading animate-fade-in-up delay-100">{history.title}</h1>
                    <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-serif italic animate-fade-in-up delay-200">
                        {history.lead}
                    </p>
                    <div className="h-1.5 w-32 bg-primary-yellow mx-auto mt-10 rounded-full shadow-sm animate-fade-in-up delay-300"></div>
                </div>
            </header>

            <section className="container py-12">
                 <HistoryTimeline events={timelineEvents} lang={lang} />
            </section>

            {/* Medieval Dynasties Detail Grid */}
            <section className="container py-20 border-t border-primary-red/5">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-mithila-ink mb-4 font-heading">{history.eras.medieval.title} Details</h2>
                    <p className="text-text-muted italic">Explore the powerful lineages that shaped medieval Mithilanchal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {Object.entries(history.eras.medieval)
                        .filter(([key]) => !['marker', 'title'].includes(key))
                        .map(([key, dynasty]: [string, any], index) => (
                            <div key={key} className="glass-morphism p-8 rounded-2xl border border-primary-red/5 hover:shadow-premium transition-all duration-500 hover:-translate-y-2 group group/card animate-fade-in-up" 
                                 style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center mb-6 group-hover/card:bg-primary-green transition-colors duration-300">
                                    <span className="text-primary-green group-hover/card:text-white transition-colors">🔱</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-mithila-ink font-heading">{dynasty.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed group-hover/card:text-foreground transition-colors">{dynasty.desc}</p>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}

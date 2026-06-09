import { getDictionary } from '@/get-dictionary';
import { getCollectionData, getDocumentByField } from '@/lib/data-service';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const folklore = await getCollectionData<any>('folklore');
    return folklore.map((item: any) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const item = await getDocumentByField<any>('folklore', 'slug', slug);
    if (!item) return {};

    const localeData = item.locales[lang as 'en' | 'hi' | 'mai'] || item.locales['en'];
    return {
        title: `${localeData.title} | Mithila Folklore`,
        description: localeData.description,
    };
}

export default async function FolkloreDetail({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const item = await getDocumentByField<any>('folklore', 'slug', slug);

    if (!item) notFound();

    const localeData = item.locales[lang as 'en' | 'hi' | 'mai'] || item.locales['en'];

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-16">
            <Link href={`/${lang}/folklore`} className="text-primary-red hover:gap-2 transition-all flex items-center gap-1 mb-8 font-bold text-sm uppercase tracking-widest">
                <span>←</span> {lang === 'en' ? 'Back to Folklore' : (lang === 'hi' ? 'लोककथाओं पर वापस' : 'लोकगाथा पर घुरु')}
            </Link>

            <article className="bg-paper-texture rounded-3xl overflow-hidden shadow-2xl border border-primary-yellow/20 relative">
                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />
                
                <div className="aspect-video w-full relative">
                    <img src={item.image} alt={localeData.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                        <span className="bg-primary-red text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                            {item.category}
                        </span>
                        <h1 className="text-[clamp(2rem,5vw,3.5rem)] text-white font-bold font-heading leading-tight">
                            {localeData.title}
                        </h1>
                    </div>
                </div>

                <div className="p-10 md:p-16 relative z-10">
                    <div className="prose prose-lg max-w-none font-body text-mithila-ink">
                        <p className="text-[1.25rem] leading-relaxed mb-8 first-letter:text-5xl first-letter:font-heading first-letter:text-primary-red first-letter:mr-3 first-letter:float-left">
                            {localeData.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12 mt-12">
                            <div className="bg-white/50 p-8 rounded-2xl border-l-4 border-primary-yellow shadow-sm">
                                <h2 className="text-primary-red text-xl font-bold font-heading mb-4 uppercase tracking-wide">The Rituals</h2>
                                <p className="text-gray-700 leading-relaxed italic">{localeData.rituals}</p>
                            </div>
                            <div className="bg-white/50 p-8 rounded-2xl border-l-4 border-primary-red shadow-sm">
                                <h2 className="text-primary-red text-xl font-bold font-heading mb-4 uppercase tracking-wide">Cultural Significance</h2>
                                <p className="text-gray-700 leading-relaxed">{localeData.significance}</p>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Origin</p>
                            <p className="text-gray-600 italic">{localeData.origin}</p>
                        </div>
                    </div>
                </div>
            </article>

            <div className="mt-16 text-center">
                <p className="text-gray-500 mb-6 italic">Help us preserve this heritage. Share this story with the world.</p>
                <div className="flex justify-center gap-4">
                    {/* Placeholder for social share buttons */}
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold">Twitter</button>
                    <button className="px-6 py-2 bg-blue-800 text-white rounded-full text-sm font-bold">Facebook</button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-bold">WhatsApp</button>
                </div>
            </div>
        </div>
    );
}

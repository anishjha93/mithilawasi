import { getDictionary } from '@/get-dictionary';
import { getCollectionData, getDocumentByField } from '@/lib/data-service';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const literature = await getCollectionData<any>('literature');
    return literature.map((item: any) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const item = await getDocumentByField<any>('literature', 'slug', slug);
    if (!item) return {};

    const localeData = item.locales[lang as 'en' | 'hi' | 'mai'] || item.locales['en'];
    return {
        title: `${localeData.title} | Mithila Learning & Literature`,
        description: localeData.description,
    };
}

export default async function LiteratureDetail({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const item = await getDocumentByField<any>('literature', 'slug', slug);

    if (!item) notFound();

    const localeData = item.locales[lang as 'en' | 'hi' | 'mai'] || item.locales['en'];

    return (
        <div className="max-w-[900px] mx-auto px-6 py-16">
            <Link href={`/${lang}/learning`} className="text-primary-red hover:gap-2 transition-all flex items-center gap-1 mb-8 font-bold text-sm uppercase tracking-widest">
                <span>←</span> {lang === 'en' ? 'Back to Learning' : (lang === 'hi' ? 'सीखने पर वापस' : 'सीखय पर घुरु')}
            </Link>

            <div className="bg-paper-texture rounded-3xl overflow-hidden shadow-2xl border border-primary-yellow/20 relative">
                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none" />
                
                <div className="h-64 w-full relative">
                    <img src={item.image} alt={localeData.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-6 left-10">
                        <span className="bg-primary-red text-white px-3 py-1 rounded text-[0.65rem] font-bold uppercase tracking-widest mb-2 inline-block">
                            {item.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl text-white font-bold font-heading">
                            {localeData.title}
                        </h1>
                    </div>
                </div>

                <div className="p-10 md:p-16 relative z-10">
                    <div className="prose prose-lg max-w-none font-body text-mithila-ink">
                        <div className="flex items-center gap-4 mb-8 text-sm font-bold text-primary-red uppercase tracking-widest pb-4 border-b border-gray-100">
                            <span>Author/Source: {localeData.author}</span>
                        </div>

                        <p className="text-[1.2rem] leading-relaxed mb-8 italic text-gray-600">
                            "{localeData.description}"
                        </p>

                        <div className="bg-white/80 p-8 rounded-2xl border-2 border-primary-yellow/20 shadow-inner mb-10">
                            <h2 className="text-primary-red text-xl font-bold font-heading mb-4 uppercase tracking-wide">Course/Book Summary</h2>
                            <p className="text-gray-700 leading-relaxed">{localeData.summary}</p>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row gap-6">
                            <button className="flex-1 px-8 py-4 bg-primary-red text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">
                                {item.category === 'Learning' ? 'Start Learning Now' : 'Buy / Read Now'}
                            </button>
                            <button className="flex-1 px-8 py-4 border-2 border-primary-red text-primary-red rounded-xl font-bold hover:bg-red-50 transition-colors">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

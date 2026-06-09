import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import { getSongs } from '@/data/songs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    return {
        title: dict.songsPage.title,
        description: dict.songsPage.description,
    };
}

export default async function SongsPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const songs = await getSongs();
    const { songsPage } = dict;

    // Group songs by category for better UX
    const groupedSongs = songs.reduce((acc, song) => {
        const cat = song.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(song);
        return acc;
    }, {} as Record<string, typeof songs>);

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            <header className="text-center mb-12">
                <Link href={`/${lang}`} className="text-primary-red hover:text-red-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium mb-4 inline-block transition-colors">
                    ← {lang === 'en' ? 'Back to Home' : (lang === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'घर पर घुरु')}
                </Link>
                <h1 className="text-[2.5rem] font-bold text-mithila-ink mb-4">{songsPage.title}</h1>
                <p className="text-[1.25rem] text-text-muted max-w-2xl mx-auto">
                    {songsPage.description} ({songs.length} {lang === 'en' ? 'Songs' : 'गीत'})
                </p>
            </header>

            {Object.entries(groupedSongs).map(([category, categorySongs]) => (
                <div key={category} className="mb-12">
                    <h2 className="text-[2rem] mb-6 text-orange-700 dark:text-orange-400 border-b-2 border-b-orange-100 dark:border-b-orange-900/30 pb-2 font-bold">
                        {category}
                    </h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 max-w-[900px] mx-auto">
                        {categorySongs.map((song) => {
                            const locale = song.locales[lang as 'en' | 'hi' | 'mai'] || song.locales.en;
                            return (
                                <Link
                                    key={song.slug}
                                    href={`/${lang}/songs/${song.slug}`}
                                    className="bg-card-bg p-8 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-500/30 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md block group"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-[#fb923c] to-[#ef4444]"></div>
                                    <div className="flex flex-col mb-6">
                                        <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-[0.875rem] font-semibold mb-2 self-start">
                                            {song.occasion || song.category}
                                        </span>
                                        <h3 className="text-[1.5rem] font-bold text-mithila-ink dark:text-white">
                                            {locale.title}
                                        </h3>
                                        {lang !== 'mai' && locale.title !== song.locales.mai.title && (
                                            <p className="text-[0.9rem] text-text-muted mt-1">{song.locales.mai.title}</p>
                                        )}
                                    </div>
                                    <p className="text-foreground/80 dark:text-gray-300 text-[1rem] line-clamp-3 italic leading-relaxed">
                                        {locale.meaning}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

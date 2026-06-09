import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';
import { getSongs, type Song } from '@/data/songs';
import { getPersonalities } from '@/lib/personalities';

export const dynamic = 'force-dynamic';

// Generate static params for all songs
export async function generateStaticParams() {
    const songs = await getSongs();
    const langs = ['en', 'hi', 'mai'];
    const params = [];

    for (const lang of langs) {
        for (const song of songs) {
            params.push({ lang, slug: song.slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await Promise.resolve(params);
    const songs = await getSongs();
    const song = songs.find((s) => s.slug === slug);

    if (!song) return { title: 'Song Not Found' };

    const locale = song.locales[lang as 'en' | 'hi' | 'mai'] || song.locales.en;
    const title = `${locale.title} | Mithila Folk Songs`;
    const description = locale.meaning.substring(0, 160);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'music.song',
            siteName: 'Mithilawasi',
        },
    };
}

export default async function SongDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await Promise.resolve(params);
    const songs = await getSongs();
    const song = songs.find((s) => s.slug === slug);

    // Fetch author if exists
    const personalities = await getPersonalities();
    const author = song?.authorSlug ? personalities.find(p => p.slug === song.authorSlug) : null;

    if (!song) notFound();

    const locale = song.locales[lang as 'en' | 'hi' | 'mai'] || song.locales.en;

    // JSON-LD Schema for MusicComposition
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicComposition',
        name: locale.title,
        alternateName: song.locales.en.title,
        lyricist: {
            '@type': 'Person',
            name: author ? author.locales[lang as 'en' | 'hi' | 'mai']?.name || 'Vidyapati' : 'Traditional'
        },
        inLanguage: 'mai',
        musicArrangement: song.category,
        lyrics: {
            '@type': 'CreativeWork',
            text: song.lyrics
        },
        description: locale.meaning
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="text-center mb-12">
                <Link href={`/${lang}/songs`} className="text-primary-red hover:text-red-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium mb-4 inline-block transition-colors">
                    ← {lang === 'en' ? 'Back to Songs' : (lang === 'hi' ? 'गीतों पर वापस' : 'गीत पर घुरु')}
                </Link>
                <div className="mt-4">
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-[0.875rem] font-semibold mb-2">{song.occasion || song.category}</span>
                </div>
                <h1 className="text-[2.5rem] font-bold text-mithila-ink mt-4 mb-2">{locale.title}</h1>
                {lang !== 'mai' && locale.title !== song.locales.mai.title && (
                    <h2 className="text-[1.5rem] text-text-muted font-normal">{song.locales.mai.title}</h2>
                )}

                {author && (
                    <div className="mt-6 inline-block bg-orange-50 dark:bg-orange-900/10 px-6 py-3 rounded-full border border-orange-100 dark:border-orange-800/20">
                        <span className="text-text-muted mr-2">{lang === 'en' ? 'Written by:' : (lang === 'hi' ? 'रचयिता:' : 'रचयिता:')}</span>
                        <Link href={`/${lang}/personalities/${author.slug}`} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                            {author.locales[lang as 'en' | 'hi' | 'mai']?.name || author.locales.en.name}
                        </Link>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
                <div className="bg-orange-50/50 dark:bg-orange-900/10 p-8 rounded-xl shadow-sm border border-orange-100/50 dark:border-orange-800/20">
                    <h3 className="text-[0.875rem] uppercase tracking-wider font-bold mb-4 opacity-70 text-orange-900 dark:text-orange-300">
                        {lang === 'en' ? 'Maithili Lyrics' : 'मैथिली बोल'}
                    </h3>
                    <p className="whitespace-pre-line text-[1.25rem] font-medium text-foreground leading-relaxed">
                        {song.lyrics}
                    </p>
                </div>

                <div>
                    <div className="bg-card-bg p-8 rounded-xl shadow-sm border border-border-color mb-8 transition-shadow hover:shadow-md">
                        <h3 className="text-[0.875rem] uppercase tracking-wider font-bold mb-4 opacity-70 text-text-muted">
                            {lang === 'en' ? 'Meaning & Context' : 'भावार्थ'}
                        </h3>
                        <p className="text-[1.125rem] text-foreground/80 italic leading-relaxed">
                            {locale.meaning}
                        </p>
                    </div>

                    {song.youtubeUrl && (
                        <div className="mt-8">
                            <h3 className="text-[0.875rem] uppercase tracking-wider font-bold mb-4 opacity-70 text-text-muted">Video</h3>
                            <div className="relative pt-[56.25%] h-0 overflow-hidden rounded-xl shadow-md">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full border-none"
                                    src={song.youtubeUrl.replace('watch?v=', 'embed/')}
                                    title={locale.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

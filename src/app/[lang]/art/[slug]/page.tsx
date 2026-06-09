
import { getDictionary } from '@/get-dictionary';
import { artStyles } from '@/data/art';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        lang: 'en' | 'hi' | 'mai';
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return artStyles.map((style) => ({
        slug: style.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { lang, slug } = await params;
    const style = artStyles.find((s) => s.slug === slug);

    if (!style) {
        return {
            title: 'Style Not Found | Mithilawasi'
        };
    }

    return {
        title: `${style.englishTitle} (${style.title}) | Mithila Art`,
        description: style.description,
    };
}

export default async function ArtDetailPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const style = artStyles.find((s) => s.slug === slug);

    if (!style) {
        notFound();
    }

    return (
        <article className="max-w-[1200px] mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-[2.5rem] font-bold text-primary-red font-heading">{style.title}</h1>
                <h2 className="text-[1.2rem] text-text-muted mt-2 font-medium">{style.englishTitle}</h2>
            </header>

            <div className="max-w-[800px] mx-auto text-[1.1rem] leading-relaxed text-foreground">
                <div className="h-[250px] bg-card-bg rounded-xl flex items-center justify-center mb-8 border border-border-color">
                    <span className="text-[4rem]">🎨</span>
                </div>

                <p className="mb-8 italic text-[1.2rem]">{style.description}</p>

                <Section title="History & Origins" content={style.history} />

                <div className="mb-8">
                    <h3 className="text-[1.4rem] font-bold mb-4 text-primary-red">Key Motifs</h3>
                    <div className="flex flex-wrap gap-2">
                        {style.keyMotifs.map((motif, i) => (
                            <span key={i} className="bg-primary-red/5 px-4 py-2 rounded-full text-[0.9rem] border border-primary-red/20 text-primary-red">
                                {motif}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-[1.4rem] font-bold mb-4 text-primary-red">Colors Palette</h3>
                    <div className="flex flex-wrap gap-2">
                        {style.colorsUsed.map((color, i) => (
                            <span key={i} className="bg-primary-yellow/10 px-4 py-2 rounded-full text-[0.9rem] border border-primary-yellow/30 text-mithila-ink">
                                {color}
                            </span>
                        ))}
                    </div>
                </div>

                <Section title="Process & Technique" content={style.process} />
                <Section title="Cultural Significance" content={style.culturalSignificance} />

            </div>
        </article>
    );
}

function Section({ title, content }: { title: string, content: string }) {
    return (
        <section className="mb-8">
            <h3 className="text-[1.4rem] font-bold mb-4 text-primary-red">{title}</h3>
            <p>{content}</p>
        </section>
    );
}

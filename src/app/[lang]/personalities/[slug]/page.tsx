import { getDictionary } from '@/get-dictionary';
import { getPersonalities } from '@/lib/personalities';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const allPersonalities = await getPersonalities();
    const person = allPersonalities.find(p => p.slug === slug);

    if (!person) {
        return {
            title: 'Personality Not Found'
        };
    }

    const locale = person.locales[lang as 'en' | 'hi' | 'mai'] || person.locales.en;
    const profession = person.profession[0] || 'Famous Personality';
    const description = locale.description.substring(0, 160) + '...';
    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/personalities/${slug}`;
    const imageUrl = `${baseUrl}https://cdn.mithilawasi.com/logo.webp`;

    return {
        title: `${locale.name} - ${profession} - Mithilawasi`,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/personalities/${slug}`,
                'hi-IN': `${baseUrl}/hi/personalities/${slug}`,
                'mai-IN': `${baseUrl}/mai/personalities/${slug}`,
                'x-default': `${baseUrl}/en/personalities/${slug}`,
            },
        },
        openGraph: {
            title: `${locale.name} - ${profession} - Mithilawasi`,
            description,
            type: 'profile',
            url: canonicalUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: locale.name,
                }
            ],
            siteName: 'Mithilawasi',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${locale.name} - Mithilawasi`,
            description,
            images: [imageUrl],
        }
    };
}

export default async function PersonalityDetailPage({ params }: Props) {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const { personalitiesPage } = dict;
    const allPersonalities = await getPersonalities();
    const person = allPersonalities.find(p => p.slug === slug);

    if (!person) {
        notFound();
    }

    const locale = person.locales[lang as 'en' | 'hi' | 'mai'] || person.locales.en;
    const profession = person.profession[0] || 'Famous Personality';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: locale.name,
        description: locale.description,
        jobTitle: profession,
        knowsAbout: ['Mithila', 'Maithili', profession],
        url: `https://mithilawasi.com/${lang}/personalities/${slug}`,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: lang === 'en' ? 'Home' : lang === 'hi' ? 'होम' : 'घर',
                item: `https://mithilawasi.com/${lang}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: personalitiesPage.title,
                item: `https://mithilawasi.com/${lang}/personalities`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: locale.name,
                item: `https://mithilawasi.com/${lang}/personalities/${slug}`,
            },
        ],
    };

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-16">
            <JsonLd override={true} data={personSchema} />
            <JsonLd override={true} data={breadcrumbSchema} />
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-[0.9rem] text-text-muted">
                <Link href={`/${lang}`} className="text-[#d35400] hover:text-[#e67e22] hover:underline transition-colors">
                    {lang === 'en' ? 'Home' : lang === 'hi' ? 'होम' : 'घर'}
                </Link>
                <span className="text-gray-400">›</span>
                <Link href={`/${lang}/personalities`} className="text-[#d35400] hover:text-[#e67e22] hover:underline transition-colors">
                    {personalitiesPage.title}
                </Link>
                <span className="text-text-muted/60">›</span>
                <span className="text-foreground font-medium">{locale.name}</span>
            </nav>

            {/* Main Content */}
            <article className="max-w-[800px] mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-block px-4 py-1.5 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white rounded-full text-[0.85rem] font-semibold uppercase tracking-wide mb-4">
                        {profession}
                    </div>
                    <h1 className="text-[2.5rem] font-bold text-mithila-ink mb-2 leading-tight">{locale.name}</h1>
                    {(person.born || person.died) && (
                        <p className="text-[1.1rem] text-text-muted">📅 {person.born || '?'} - {person.died || '?'}</p>
                    )}
                </header>

                {/* Description */}
                <div className="my-8">
                    <p className="text-[1.15rem] leading-loose text-foreground text-justify whitespace-pre-line">{locale.description}</p>
                </div>

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t-2 border-border-color text-center">
                    <Link href={`/${lang}/personalities`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#667eea] text-white rounded-lg font-bold transition-all duration-300 shadow-md hover:bg-[#5568d3] hover:-translate-y-0.5 hover:shadow-lg">
                        ← {lang === 'en' ? 'Back to Personalities' : lang === 'hi' ? 'व्यक्तित्वों पर वापस जाएं' : 'व्यक्तित्व सभ पर वापस जाउ'}
                    </Link>
                </div>
            </article>
        </div>
    );
}

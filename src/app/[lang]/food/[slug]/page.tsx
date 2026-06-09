import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { getRecipes, type Recipe } from '@/data/recipes';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const recipes = await getRecipes();
    const langs: Locale[] = ['en', 'hi', 'mai'];

    return langs.flatMap((lang) =>
        recipes.map((recipe) => ({
            lang,
            slug: recipe.slug,
        }))
    );
}

export async function generateMetadata(
    props: {
        params: Promise<{ lang: Locale; slug: string }>;
    }
): Promise<Metadata> {
    const { lang, slug } = await props.params;
    const recipes = await getRecipes();
    const recipe = recipes.find((r) => r.slug === slug);
    if (!recipe) return {};

    const rawLocale = recipe.locales[lang as 'en' | 'hi' | 'mai'] || recipe.locales.en;
    const enLocale = recipe.locales.en;

    const title = rawLocale.title || enLocale.title;
    const descText = rawLocale.description || enLocale.description || '';
    const author = recipe.author || 'Mithilawasi Team';
    const description = `${descText.substring(0, 140)}... | Contributed by: ${author}`;

    return {
        title: `${title} | Mithila Cuisine`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'article',
            authors: [author],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Mithilawasi`,
            description: description,
            creator: '@mithilawasi',
        }
    };
}

export default async function RecipePage(props: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const { lang, slug } = await props.params;
    const dictionary = await getDictionary(lang);
    const recipes = await getRecipes();
    const baseRecipe = recipes.find((r) => r.slug === slug);

    if (!baseRecipe) {
        notFound();
    }

    const rawLocale = baseRecipe.locales[lang as 'en' | 'hi' | 'mai'] || baseRecipe.locales.en;
    const enLocale = baseRecipe.locales.en;

    const locale = {
        title: rawLocale.title || enLocale.title,
        description: rawLocale.description || enLocale.description,
        ingredients: rawLocale.ingredients && rawLocale.ingredients.length > 0 
            ? rawLocale.ingredients 
            : enLocale.ingredients,
        instructions: rawLocale.instructions && rawLocale.instructions.length > 0 
            ? rawLocale.instructions 
            : enLocale.instructions,
        culturalSignificance: rawLocale.culturalSignificance || enLocale.culturalSignificance,
    };

    // Schema.org structured data for Recipe
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: locale.title,
        image: [],
        author: {
            '@type': 'Organization',
            name: 'Mithilawasi'
        },
        datePublished: '2025-01-15',
        description: locale.description,
        prepTime: `PT${baseRecipe.prepTime.replace(' mins', 'M')}`,
        cookTime: `PT${baseRecipe.cookTime.replace(' mins', 'M')}`,
        recipeYield: `${baseRecipe.servings} servings`,
        recipeCategory: baseRecipe.category,
        recipeCuisine: 'Indian (Maithil)',
        keywords: `${locale.title}, Mithila Food, Maithili Recipe, Bihar Cuisine`,
        recipeIngredient: locale.ingredients,
        recipeInstructions: locale.instructions.map(step => ({
            '@type': 'HowToStep',
            text: step
        }))
    };

    return (
        <div className="max-w-[800px] mx-auto px-4 py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href={`/${lang}/food`} className="inline-flex items-center gap-2 text-text-muted hover:text-primary-red mb-8 text-[0.9rem] transition-colors">
                ← Back to Recipes
            </Link>

            <header className="text-center mb-12 pb-8 border-b border-border-color">
                <span className="text-[0.8rem] uppercase tracking-wider text-primary-red mb-2 font-semibold">
                    {baseRecipe.category}
                </span>
                <h1 className="text-[2.5rem] font-bold mb-2 text-mithila-ink">{locale.title}</h1>
                <p className="text-[1.2rem] text-text-muted mb-6">{baseRecipe.locales.en.title}</p>

                <div className="flex justify-center gap-8 text-[0.9rem] text-text-muted flex-wrap">
                    <div className="bg-gray-soft px-4 py-2 rounded-full flex items-center gap-2">
                        <span>⏱️</span>
                        <span>Prep: {baseRecipe.prepTime}</span>
                    </div>
                    <div className="bg-gray-soft px-4 py-2 rounded-full flex items-center gap-2">
                        <span>🔥</span>
                        <span>Cook: {baseRecipe.cookTime}</span>
                    </div>
                    <div className="bg-gray-soft px-4 py-2 rounded-full flex items-center gap-2">
                        <span>🍽️</span>
                        <span>Serves {baseRecipe.servings}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12">
                {/* Ingredients Column */}
                <div>
                    <div className="bg-gray-soft p-6 rounded-xl h-fit">
                        <h3 className="text-[1.2rem] font-bold mb-4 text-mithila-ink flex items-center gap-2">
                            🥘 Ingredients
                        </h3>
                        <ul className="list-none p-0 m-0">
                            {locale.ingredients.map((item, index) => (
                                <li key={index} className="py-3 border-b border-border-color last:border-0 text-text-muted text-[0.95rem]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Instructions Column */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-[1.2rem] font-bold text-mithila-ink flex items-center gap-2">
                        👩‍🍳 Instructions
                    </h3>
                    {locale.instructions.map((step, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="w-8 h-8 bg-primary-red text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                {index + 1}
                            </div>
                            <p className="pt-1 text-text-muted leading-relaxed">{step}</p>
                        </div>
                    ))}

                    <div className="mt-8 p-6 bg-linear-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <h4 className="text-accent-gold font-bold mb-2 flex items-center gap-2">
                            💡 Cultural Significance
                        </h4>
                        <p className="text-text-muted italic text-[0.95rem]">{locale.culturalSignificance}</p>
                    </div>

                    {/* Author Section */}
                    <div className="mt-8 p-6 bg-gray-soft rounded-xl border-l-4 border-primary-red">
                        <p className="text-[0.8rem] uppercase tracking-wider text-text-muted mb-2 font-bold">
                            {lang === 'en' ? 'Contributed by' : lang === 'hi' ? 'योगदानकर्ता' : 'योगदानकर्ता'}
                        </p>
                        <div className="text-[1.1rem] font-bold text-mithila-ink flex items-center gap-2">
                            <span className="text-[1.2rem]">✍️</span>
                            {baseRecipe.author || 'Mithilawasi Team'}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

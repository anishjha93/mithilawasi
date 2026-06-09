
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import Link from 'next/link';
import { getRecipes } from '@/data/recipes';
import RecipeList from './RecipeList';

export const dynamic = 'force-dynamic';

export default async function FoodPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const recipes = await getRecipes();



    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <h1 className="text-4xl font-bold font-serif mb-4 text-mithila-ink">{dictionary.foodPage.title}</h1>
                <p className="text-lg text-text-muted max-w-[600px] mx-auto">{dictionary.foodPage.description}</p>
            </header>

            <RecipeList
                recipes={recipes}
                lang={lang}
                dictionary={dictionary}
            />
        </div>
    );
}

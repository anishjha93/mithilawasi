import { getCollectionData } from '../lib/data-service';

export interface RecipeLocale {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    culturalSignificance: string;
}

export interface Recipe {
    slug: string;
    category: 'Sweets' | 'Snacks' | 'Main Course' | 'Chutney/Pickle' | 'Festival Special' | string;
    prepTime: string;
    cookTime: string;
    servings: number;
    author?: string;
    locales: {
        en: RecipeLocale;
        hi: RecipeLocale;
        mai: RecipeLocale;
    };
}

export async function getRecipes(): Promise<Recipe[]> {
    return getCollectionData<Recipe>('recipes');
}

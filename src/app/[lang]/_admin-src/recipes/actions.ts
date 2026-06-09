import { revalidatePath } from 'next/cache';
import { Recipe } from '@/data/recipes';
import { initAdmin } from '@/lib/firebase-admin';
import { getCollectionData } from '@/lib/data-service';

export async function getAllRecipesForAdmin() {
    return getCollectionData<Recipe>('recipes', 'slug');
}

export async function getRecipeBySlug(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) return null;
        
        const db = adminApp.firestore();
        const doc = await db.collection('recipes').doc(slug).get();
        return doc.exists ? (doc.data() as Recipe) : null;
    } catch (error) {
        console.error('Error reading recipe by slug:', error);
        return null;
    }
}

export async function saveRecipe(recipe: Recipe, isNew: boolean) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        
        if (isNew) {
            const existing = await db.collection('recipes').doc(recipe.slug).get();
            if (existing.exists) {
                return { success: false, message: 'Slug already exists' };
            }
        }

        await db.collection('recipes').doc(recipe.slug).set(recipe);

        revalidatePath('/[lang]/food', 'page');
        revalidatePath('/[lang]/admin/recipes', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Recipe saved successfully' };
    } catch (error) {
        console.error('Error saving recipe:', error);
        return { success: false, message: 'Failed to save recipe' };
    }
}

export async function deleteRecipe(slug: string) {
    try {
        const adminApp = await initAdmin();
        if (!adminApp) throw new Error('Firebase Admin not initialized');
        
        const db = adminApp.firestore();
        await db.collection('recipes').doc(slug).delete();

        revalidatePath('/[lang]/food', 'page');
        revalidatePath('/[lang]/admin/recipes', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true, message: 'Recipe deleted successfully' };
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return { success: false, message: 'Failed to delete recipe' };
    }
}

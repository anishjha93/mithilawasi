
const fs = require('fs');
const path = require('path');

const recipesTsPath = path.join(process.cwd(), 'src/data/recipes.ts');
let content = fs.readFileSync(recipesTsPath, 'utf8');

// Find the start of the recipes array
const startIndex = content.indexOf('export const recipes');
if (startIndex === -1) {
    console.error('Could not find recipes array');
    process.exit(1);
}

// Keep only the array part and following (stripping imports/interfaces at the top)
content = content.substring(startIndex);

// Replace the export statement with a simple variable declaration
// Handling the type annotation ": Recipe[]"
content = content.replace(/export const recipes: Recipe\[\] =/, 'const recipes =');

// Evaluate the code
const getRecipes = new Function(`${content}; return recipes;`);

try {
    const originalRecipes = getRecipes();

    const newRecipes = originalRecipes.map(recipe => {
        const translations = recipe.translations || {};

        return {
            slug: recipe.slug,
            category: recipe.category,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            author: recipe.author,
            locales: {
                en: {
                    title: recipe.englishTitle || recipe.title, // Fallback
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    culturalSignificance: recipe.culturalSignificance
                },
                hi: {
                    title: translations.hi?.title || recipe.title,
                    description: translations.hi?.description || "",
                    ingredients: translations.hi?.ingredients || [],
                    instructions: translations.hi?.instructions || [],
                    culturalSignificance: translations.hi?.culturalSignificance || ""
                },
                mai: {
                    title: translations.mai?.title || recipe.title,
                    description: translations.mai?.description || "",
                    ingredients: translations.mai?.ingredients || [],
                    instructions: translations.mai?.instructions || [],
                    culturalSignificance: translations.mai?.culturalSignificance || ""
                }
            }
        };
    });

    fs.writeFileSync(path.join(process.cwd(), 'src/data/recipes.json'), JSON.stringify(newRecipes, null, 2));
    console.log('Successfully migrated recipes to src/data/recipes.json');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}

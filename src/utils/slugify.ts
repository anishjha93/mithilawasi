/**
 * Converts a string to a URL-friendly slug
 * Supports Unicode characters including Devanagari script
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '') // Remove special characters but keep Unicode letters, marks, and numbers
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
}

/**
 * Finds a place object by its slug
 * @param places - Array of place objects
 * @param slug - The slug to search for
 * @returns The matching place object or undefined
 */
export function getPlaceBySlug(places: any[], slug: string): any | undefined {
    return places.find(place => (place.slug === slug) || (slugify(place.name) === slug));
}

/**
 * Generates all place slugs from dictionary data
 * @param placesPage - The placesPage object from dictionary
 * @returns Array of all slugs
 */
export function getAllPlaceSlugs(placesPage: any): string[] {
    const slugs: string[] = [];

    // Add places
    if (placesPage.places) {
        placesPage.places.forEach((place: any) => {
            slugs.push(place.slug || slugify(place.name));
        });
    }

    // Add heritage sites
    if (placesPage.heritage?.sites) {
        placesPage.heritage.sites.forEach((site: any) => {
            slugs.push(site.slug || slugify(site.name));
        });
    }

    // Add Shakti Peethas
    if (placesPage.shaktiPeethas?.list) {
        placesPage.shaktiPeethas.list.forEach((peeth: any) => {
            slugs.push(peeth.slug || slugify(peeth.name));
        });
    }

    // Add geography items (rivers, etc.)
    if (placesPage.geography?.rivers) {
        placesPage.geography.rivers.forEach((river: any) => {
            slugs.push(river.slug || slugify(river.name));
        });
    }

    // Add villages
    if (placesPage.villages?.list) {
        placesPage.villages.list.forEach((village: any) => {
            slugs.push(village.slug || slugify(village.name));
        });
    }

    // Add administrative divisions
    if (placesPage.administrative?.list) {
        placesPage.administrative.list.forEach((div: any) => {
            slugs.push(div.slug || slugify(div.name));
        });
    }

    return slugs;
}

/**
 * Finds a place across all categories
 * @param placesPage - The placesPage object from dictionary
 * @param slug - The slug to search for
 * @returns Object with place data and category, or null
 */
export function findPlaceBySlug(placesPage: any, slug: string): { place: any; category: string } | null {
    // Search in places
    if (placesPage.places) {
        const place = getPlaceBySlug(placesPage.places, slug);
        if (place) return { place, category: 'places' };
    }

    // Search in heritage sites
    if (placesPage.heritage?.sites) {
        const place = getPlaceBySlug(placesPage.heritage.sites, slug);
        if (place) return { place, category: 'heritage' };
    }

    // Search in Shakti Peethas
    if (placesPage.shaktiPeethas?.list) {
        const place = getPlaceBySlug(placesPage.shaktiPeethas.list, slug);
        if (place) return { place, category: 'shaktiPeethas' };
    }

    // Search in geography
    if (placesPage.geography?.rivers) {
        const place = getPlaceBySlug(placesPage.geography.rivers, slug);
        if (place) return { place, category: 'geography' };
    }

    // Search in villages
    if (placesPage.villages?.list) {
        const place = getPlaceBySlug(placesPage.villages.list, slug);
        if (place) return { place, category: 'villages' };
    }

    // Search in administrative divisions
    if (placesPage.administrative?.list) {
        const place = getPlaceBySlug(placesPage.administrative.list, slug);
        if (place) return { place, category: 'administrative' };
    }

    return null;
}

// ============================================
// PERSONALITIES UTILITIES
// ============================================

/**
 * Generates all personality slugs from dictionary data
 * @param personalitiesPage - The personalitiesPage object from dictionary
 * @returns Array of all slugs
 */
export function getAllPersonalitySlugs(personalitiesPage: any): string[] {
    const slugs: string[] = [];

    if (personalitiesPage?.categories) {
        personalitiesPage.categories.forEach((category: any) => {
            if (category.people) {
                category.people.forEach((person: any) => {
                    slugs.push(person.slug || slugify(person.name));
                });
            }
        });
    }

    return slugs;
}

/**
 * Finds a personality by slug across all categories
 * @param personalitiesPage - The personalitiesPage object from dictionary
 * @param slug - The slug to search for
 * @returns Object with person data and category, or null
 */
export function findPersonalityBySlug(personalitiesPage: any, slug: string): { person: any; category: string } | null {
    if (!personalitiesPage?.categories) return null;

    for (const category of personalitiesPage.categories) {
        if (category.people) {
            // Check for explicit slug first, then fallback to name slug or ID
            const person = category.people.find((p: any) =>
                (p.slug === slug) || (slugify(p.name) === slug) || (p.id === slug)
            );

            if (person) {
                return { person, category: category.title };
            }
        }
    }

    return null;
}

// ============================================
// FOOD UTILITIES
// ============================================

/**
 * Generates all food item slugs from dictionary data
 * @param foodPage - The foodPage object from dictionary
 * @returns Array of all slugs
 */
export function getAllFoodSlugs(foodPage: any): string[] {
    const slugs: string[] = [];

    if (foodPage?.dishes) {
        foodPage.dishes.forEach((dish: any) => {
            slugs.push(dish.slug || slugify(dish.name));
        });
    }

    if (foodPage?.recipes?.list) {
        foodPage.recipes.list.forEach((recipe: any) => {
            slugs.push(recipe.slug || slugify(recipe.name));
        });
    }

    return slugs;
}

/**
 * Finds a food item by slug
 * @param foodPage - The foodPage object from dictionary
 * @param slug - The slug to search for
 * @returns Object with food data and type, or null
 */
export function findFoodBySlug(foodPage: any, slug: string): { food: any; category: string } | null {
    // Search in dishes
    if (foodPage?.dishes) {
        const food = foodPage.dishes.find((d: any) => (d.slug === slug) || (slugify(d.name) === slug));
        if (food) return { food, category: 'dish' };
    }

    // Search in recipes
    if (foodPage?.recipes?.list) {
        const food = foodPage.recipes.list.find((r: any) => (r.slug === slug) || (slugify(r.name) === slug));
        if (food) return { food, category: 'recipe' };
    }

    return null;
}

// ============================================
// ART UTILITIES
// ============================================

/**
 * Generates all art form slugs from dictionary data
 * @param artPage - The artPage object from dictionary
 * @returns Array of all slugs
 */
export function getAllArtSlugs(artPage: any): string[] {
    const slugs: string[] = [];

    if (artPage?.styles) {
        artPage.styles.forEach((style: any) => {
            slugs.push(style.slug || slugify(style.name));
        });
    }

    if (artPage?.crafts?.list) {
        artPage.crafts.list.forEach((craft: any) => {
            slugs.push(craft.slug || slugify(craft.name));
        });
    }

    return slugs;
}

/**
 * Finds an art form by slug
 * @param artPage - The artPage object from dictionary
 * @param slug - The slug to search for
 * @returns Object with art data and type, or null
 */
export function findArtBySlug(artPage: any, slug: string): { art: any; category: string } | null {
    // Search in styles
    if (artPage?.styles) {
        const art = artPage.styles.find((s: any) => (s.slug === slug) || (slugify(s.name) === slug));
        if (art) return { art, category: 'style' };
    }

    // Search in crafts
    if (artPage?.crafts?.list) {
        const art = artPage.crafts.list.find((c: any) => (c.slug === slug) || (slugify(c.name) === slug));
        if (art) return { art, category: 'craft' };
    }

    return null;
}

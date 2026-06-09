
const fs = require('fs');

// Mock slugify since we can't easily import TS in this simple script context without compilation
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Re-implementing the function logic for testing because importing the TS module directly in node is tricky without ts-node setup
function findPlaceBySlug(placesPage, slug) {
    function getPlaceBySlug(places, s) {
        return places.find(place => (place.slug === s) || (slugify(place.name) === s));
    }

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

try {
    const en = JSON.parse(fs.readFileSync('src/dictionaries/en.json', 'utf8'));
    const testSlug = 'jitwarpur-art-village';
    console.log(`Testing slug: ${testSlug}`);

    // Log structure again just to be safe
    console.log('Keys in placesPage:', Object.keys(en.placesPage));
    if (en.placesPage.villages) {
        console.log('Villages list length:', en.placesPage.villages.list.length);
    }

    const result = findPlaceBySlug(en.placesPage, testSlug);
    if (result) {
        console.log('SUCCESS: Found place:', result.place.name, 'in category:', result.category);
    } else {
        console.log('FAILURE: Could not find place');
    }

} catch (e) {
    console.error(e);
}

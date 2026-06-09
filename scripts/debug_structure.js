const fs = require('fs');
try {
    const en = JSON.parse(fs.readFileSync('src/dictionaries/en.json', 'utf8'));
    console.log('Keys in placesPage:', JSON.stringify(Object.keys(en.placesPage)));

    // Check for whitespace in keys
    Object.keys(en.placesPage).forEach(k => {
        console.log(`Key: "${k}", Code points: ${[...k].map(c => c.codePointAt(0))}`);
    });

    // Check places array
    console.log('Places array length:', en.placesPage.places.length);
    const lastPlace = en.placesPage.places[en.placesPage.places.length - 1];
    console.log('Last place name:', lastPlace.name);
    console.log('Last place keys:', Object.keys(lastPlace));

} catch (e) {
    console.error(e);
}

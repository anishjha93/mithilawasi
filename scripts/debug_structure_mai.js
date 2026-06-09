const fs = require('fs');
try {
    const mai = JSON.parse(fs.readFileSync('src/dictionaries/mai.json', 'utf8'));
    console.log('Keys in placesPage (Maithili):', JSON.stringify(Object.keys(mai.placesPage)));
} catch (e) {
    console.error(e);
}

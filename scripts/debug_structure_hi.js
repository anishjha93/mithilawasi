const fs = require('fs');
try {
    const hi = JSON.parse(fs.readFileSync('src/dictionaries/hi.json', 'utf8'));
    console.log('Keys in placesPage (Hindi):', JSON.stringify(Object.keys(hi.placesPage)));
} catch (e) {
    console.error(e);
}

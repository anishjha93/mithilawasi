
const fs = require('fs');
const path = require('path');

const mantrasPath = path.join(process.cwd(), 'src/data/mantras.json');
const mantras = JSON.parse(fs.readFileSync(mantrasPath, 'utf8'));

const newMantras = mantras.map(m => {
    return {
        slug: m.id, // Rename id to slug
        category: m.category,
        tags: m.tags || [],
        mantra: m.mantra, // Keep Sanskrit text at root
        locales: {
            en: {
                title: m.title.en,
                meaning: m.meaning.en,
                transliteration: m.transliteration || "" // Move transliteration to EN locale primarily
            },
            hi: {
                title: m.title.hi,
                meaning: m.meaning.hi,
                transliteration: "" // Optional
            },
            mai: {
                title: m.title.mai,
                meaning: m.meaning.mai,
                transliteration: "" // Optional
            }
        }
    };
});

fs.writeFileSync(mantrasPath, JSON.stringify(newMantras, null, 2));
console.log('Successfully migrated mantras.json');

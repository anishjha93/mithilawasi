const fs = require('fs');

const files = [
    'src/dictionaries/en.json',
    'src/dictionaries/hi.json',
    'src/dictionaries/mai.json'
];

function extractKeywords(obj, keywords = new Set()) {
    if (!obj) return keywords;
    if (Array.isArray(obj)) {
        obj.forEach(item => extractKeywords(item, keywords));
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            if (key === 'keywords' && Array.isArray(obj[key])) {
                obj[key].forEach(k => keywords.add(k.trim()));
            } else {
                extractKeywords(obj[key], keywords);
            }
        }
    }
    return keywords;
}

files.forEach(file => {
    try {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        const keywords = extractKeywords(content);
        console.log(`${file}: ${keywords.size} unique keywords`);
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

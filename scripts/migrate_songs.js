
const fs = require('fs');
const path = require('path');

const songsTsPath = path.join(process.cwd(), 'src/data/songs.ts');
let content = fs.readFileSync(songsTsPath, 'utf8');

// Strip TypeScript and exports to make it valid JS
content = content.replace(/export interface Song \{[\s\S]*?\}/, '');
content = content.replace(/export const songs: Song\[\] =/, 'const songs =');
content = content.replace(/import .*/g, '');

// Eval the content to get the songs array
// We wrap it in a function to avoid global scope issues and return the songs
const getSongs = new Function(`${content}; return songs;`);

try {
    const originalSongs = getSongs();

    const newSongs = originalSongs.map(song => {
        return {
            slug: song.slug,
            category: song.category,
            occasion: song.occasion,
            lyrics: song.lyrics,
            youtubeUrl: song.youtubeUrl,
            locales: {
                en: {
                    title: song.englishTitle,
                    meaning: song.meaning
                },
                hi: {
                    title: song.title, // Defaulting to Maithili titleScript
                    meaning: ""
                },
                mai: {
                    title: song.title,
                    meaning: ""
                }
            }
        };
    });

    fs.writeFileSync(path.join(process.cwd(), 'src/data/songs.json'), JSON.stringify(newSongs, null, 2));
    console.log('Successfully migrated songs to src/data/songs.json');
} catch (error) {
    console.error('Migration failed:', error);
}


export interface ArtStyle {
    slug: string;
    title: string;
    englishTitle: string;
    description: string;
    history: string;
    keyMotifs: string[];
    colorsUsed: string[];
    process: string;
    culturalSignificance: string;
}

export const artStyles: ArtStyle[] = [
    {
        slug: 'bharni',
        title: 'भरनी',
        englishTitle: 'Bharni Style',
        description: 'A style characterized by rich, vibrant colors filling the subject outlines with no whitespace left.',
        history: 'Historically practiced by Brahmin women, Bharni (meaning "to fill") focuses on mythological figures like Ram-Sita, Radha-Krishna, and Vishnu avatars.',
        keyMotifs: ['Hindu Deities', 'Lotus', 'Peacock', 'Elephant'],
        colorsUsed: ['Vibrant Orange', 'Pink', 'Yellow', 'Blue', 'Red (derived from natural sources)'],
        process: 'The subject is drawn in double outlines using black soot ink. The enclosed spaces are then completely filled with bright colors.',
        culturalSignificance: 'Bharni paintings are known for their grandeur and are often used to depict auspicious stories from the Ramayana and Mahabharata.'
    },
    {
        slug: 'katchni',
        title: 'कचनी',
        englishTitle: 'Katchni Style',
        description: 'A monochromatic style using only fine lines and patterns, usually in black or red ink.',
        history: 'Practiced by Kayastha women, Katchni focuses on intricate line work (hatching and stippling) rather than color filling.',
        keyMotifs: ['Geometric patterns', 'Flora and Fauna', 'Social life scenes', 'Ceremonial processions'],
        colorsUsed: ['Black (Soot)', 'Red (Vermilion)', 'Sometimes two tones'],
        process: 'Artists use a bamboo nib pen to draw extremely fine parallel lines, cross-hatching, and curves to create texture and shading without solid colors.',
        culturalSignificance: 'Katchni celebrates the precision and patience of the artist, representing the intellectual heritage of the Kayastha community.'
    },
    {
        slug: 'godna',
        title: 'गोदना',
        englishTitle: 'Godna Style (Tattoo Art)',
        description: 'Based on traditional body tattoos, consisting of concentric circles and simple geometric figures.',
        history: 'Originated from the Dalit/Dusadh community who were historically excluded from mainstream religious art. They converted their body tattoo patterns onto paper and walls.',
        keyMotifs: ['Raja Salhesh (Local Hero)', 'Tree of Life', 'Sun and Moon', 'Concentric Circles', 'Animals'],
        colorsUsed: ['Natural Cow Dung wash (Background)', 'Black', 'Earth tones'],
        process: 'The paper is often washed with cow dung to create a rustic brown canvas. Bamboo nibs are used to draw repetitive, rhythmic patterns.',
        culturalSignificance: 'Godna art is a powerful symbol of social assertion and identity, transforming stigmatized body art into a celebrated global art form.'
    },
    {
        slug: 'tantrik',
        title: 'तांत्रिक',
        englishTitle: 'Tantrik Style',
        description: 'Depicts spiritual and metaphysical concepts deeply rooted in Tantra prowess of Mithila.',
        history: 'Mithila has been a center of Tantra Shastra. This style is strictly religious and used for meditation and rituals.',
        keyMotifs: ['Sri Yantra', 'Kali', 'Das Mahavidya', 'Shiva-Shakti', 'Lotus diagrams'],
        colorsUsed: ['Red (Blood/Energy)', 'Black', 'Yellow'],
        process: 'Creating a Tantrik painting is a meditative act. The geometrical precision is crucial as each line represents cosmic energy flow.',
        culturalSignificance: 'These paintings are often kept in private prayer rooms and are believed to hold spiritual power.'
    },
    {
        slug: 'kohbar',
        title: 'कोहबर',
        englishTitle: 'Kohbar (Bridal Chamber Art)',
        description: 'The most auspicious and central form of Mithila art, drawn on the walls of the nuptial chamber.',
        history: 'Drawn to bless the newlywed couple with fertility and prosperity. Originally done on walls coated with cow dung and rice paste.',
        keyMotifs: ['Lotus (Female fertility)', 'Bamboo (Male lineage)', 'Fish (Prosperity)', 'Birds', 'Snakes (Divinity)'],
        colorsUsed: ['Red (Passion/Sindoor)', 'Green (Nature)', 'Yellow (Prosperity)'],
        process: 'A central diagram "Kohbar" is drawn, surrounded by auspicious symbols. It acts as a visual prayer for the couple.',
        culturalSignificance: 'No Maithil wedding is complete without the Kohbar. It is the visual representation of creation and lineage.'
    }
];

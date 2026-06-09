export interface KootaResult {
    name: string;
    score: number;
    maxScore: number;
    description: string;
}

export interface MatchingResult {
    totalScore: number;
    maxScore: number;
    kootas: KootaResult[];
    verdict: string;
    hasNadiDosha: boolean;
    hasBhakootDosha: boolean;
}

// Signs list (Rashis)
const RASHIS_EN = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
const RASHIS_MAI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

// Nakshatras list
const NAKSHATRAS_EN = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRAS_MAI = [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 
    'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 
    'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'
];

// Lords of Rashis: Mars, Venus, Mercury, Moon, Sun, Mercury, Venus, Mars, Jupiter, Saturn, Saturn, Jupiter
const RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

// Varna index map (0 = Brahmin, 1 = Kshatriya, 2 = Vaishya, 3 = Shudra)
function getVarnaIndex(rashiIdx: number): number {
    if ([3, 7, 11].includes(rashiIdx)) return 0; // Cancer, Scorpio, Pisces (Brahmin)
    if ([0, 4, 8].includes(rashiIdx)) return 1;  // Aries, Leo, Sagittarius (Kshatriya)
    if ([1, 5, 9].includes(rashiIdx)) return 2;  // Taurus, Virgo, Capricorn (Vaishya)
    return 3;                                    // Gemini, Libra, Aquarius (Shudra)
}

// Vashya group map (0 = Chatushpada, 1 = Manav, 2 = Jalachar, 3 = Vanachar, 4 = Keeta)
function getVashyaGroup(rashiIdx: number): number {
    if ([0, 1].includes(rashiIdx)) return 0;      // Aries, Taurus (Chatushpada)
    if ([2, 5, 6, 10].includes(rashiIdx)) return 1; // Gemini, Virgo, Libra, Aquarius (Manav)
    if ([3, 11].includes(rashiIdx)) return 2;      // Cancer, Pisces (Jalachar)
    if (rashiIdx === 4) return 3;                  // Leo (Vanachar)
    if (rashiIdx === 7) return 4;                  // Scorpio (Keeta)
    if (rashiIdx === 8) return 1;                  // Sagittarius (Manav / Chatushpada -> Manav)
    return 0;                                      // Capricorn (Chatushpada / Jalachar -> Chatushpada)
}

// Vashya matrix
const VASHYA_MATRIX = [
    // Chatushpada (0), Manav (1), Jalachar (2), Vanachar (3), Keeta (4)
    [2.0, 1.0, 1.0, 0.5, 1.0], // Chatushpada
    [1.0, 2.0, 1.5, 0.0, 1.0], // Manav
    [1.0, 1.0, 2.0, 1.0, 1.0], // Jalachar
    [0.0, 0.0, 0.0, 2.0, 0.0], // Vanachar
    [1.0, 1.0, 1.0, 0.0, 2.0]  // Keeta
];

// Yoni animal assignment
const NAKSHATRA_YONI = [
    0, 1, 2, 3, 3, 4, 5, 2, 5, // Ashwini (Horse), Bharani (Elephant), Krittika (Sheep), Rohini (Serpent), Mrigashira (Serpent), Ardra (Dog), Punarvasu (Cat), Pushya (Sheep), Ashlesha (Cat)
    6, 6, 7, 8, 9, 8, 9, 10, 10, // Magha (Rat), Purva Phalguni (Rat), Uttara Phalguni (Cow), Hasta (Buffalo), Chitra (Tiger), Swati (Buffalo), Vishakha (Tiger), Anuradha (Deer), Jyeshtha (Deer)
    4, 11, 13, 11, 12, 0, 12, 7, 1 // Mula (Dog), Purva Ashadha (Monkey), Uttarashadha (Mongoose), Shravana (Monkey), Dhanishta (Lion), Shatabhisha (Horse), Purva Bhadrapada (Lion), Uttara Bhadrapada (Cow), Revati (Elephant)
];

// Yoni compatibility matrix
const YONI_COMPATIBILITY_MATRIX = [
    // 0: Horse, 1: Elephant, 2: Sheep, 3: Serpent, 4: Dog, 5: Cat, 6: Rat, 7: Cow, 8: Buffalo, 9: Tiger, 10: Deer, 11: Monkey, 12: Lion, 13: Mongoose
    [4, 2, 2, 3, 2, 2, 1, 2, 3, 2, 3, 3, 1, 2], // 0: Horse
    [2, 4, 3, 3, 2, 2, 2, 3, 3, 1, 2, 3, 2, 2], // 1: Elephant
    [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 1, 2], // 2: Sheep
    [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 0], // 3: Serpent
    [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 3, 2, 1, 1], // 4: Dog
    [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 2], // 5: Cat
    [1, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 1, 2, 1], // 6: Rat
    [2, 3, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 2], // 7: Cow
    [3, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 2], // 8: Buffalo
    [2, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 2], // 9: Tiger
    [3, 2, 2, 2, 3, 3, 2, 3, 2, 1, 4, 2, 2, 2], // 10: Deer
    [3, 3, 0, 2, 2, 3, 1, 2, 2, 1, 2, 4, 1, 2], // 11: Monkey
    [1, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 4, 2], // 12: Lion
    [2, 2, 2, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 4]  // 13: Mongoose
];

// Planet relationship map (1 = Friend, 0 = Neutral, -1 = Enemy)
const PLANET_RELATIONS: Record<string, Record<string, number>> = {
    'Sun': { 'Sun': 1, 'Moon': 1, 'Mars': 1, 'Mercury': 0, 'Jupiter': 1, 'Venus': -1, 'Saturn': -1 },
    'Moon': { 'Sun': 1, 'Moon': 1, 'Mars': 0, 'Mercury': 1, 'Jupiter': 0, 'Venus': 0, 'Saturn': 0 },
    'Mars': { 'Sun': 1, 'Moon': 1, 'Mars': 1, 'Mercury': -1, 'Jupiter': 1, 'Venus': 0, 'Saturn': 0 },
    'Mercury': { 'Sun': 1, 'Moon': -1, 'Mars': 0, 'Mercury': 1, 'Venus': 1, 'Jupiter': 0, 'Saturn': 0 },
    'Jupiter': { 'Sun': 1, 'Moon': 1, 'Mars': 1, 'Mercury': -1, 'Venus': -1, 'Jupiter': 1, 'Saturn': 0 },
    'Venus': { 'Sun': -1, 'Moon': -1, 'Mars': 0, 'Mercury': 1, 'Jupiter': 0, 'Venus': 1, 'Saturn': 1 },
    'Saturn': { 'Sun': -1, 'Moon': -1, 'Mars': -1, 'Mercury': 1, 'Jupiter': 0, 'Venus': 1, 'Saturn': 1 }
};

// Gana map (0 = Deva, 1 = Manushya, 2 = Rakshasa)
const NAKSHATRA_GANA = [
    0, 1, 2, 1, 0, 1, 0, 0, 2, // Ashwini (D), Bharani (M), Krittika (R), Rohini (M), Mrigashira (D), Ardra (M), Punarvasu (D), Pushya (D), Ashlesha (R)
    2, 1, 1, 0, 2, 0, 2, 0, 2, // Magha (R), Purva Phalguni (M), Uttara Phalguni (M), Hasta (D), Chitra (R), Swati (D), Vishakha (R), Anuradha (D), Jyeshtha (R)
    2, 1, 1, 0, 2, 2, 2, 1, 0  // Mula (R), Purva Ashadha (M), Uttarashadha (M), Shravana (D), Dhanishta (R), Shatabhisha (R), Purva Bhadrapada (R -> M in some, but let's use M), Uttara Bhadrapada (M), Revati (D)
];
// Adjusting index 24 (Purva Bhadrapada) to Manushya (1)
// Adjusting index 23 (Shatabhisha) to Rakshasa (2)
// Adjusting index 22 (Dhanishta) to Rakshasa (2)

// Nadi map (0 = Adi, 1 = Madhya, 2 = Antya)
const NAKSHATRA_NADI = [
    0, 1, 2, 2, 1, 0, 0, 1, 2, // 0-8
    2, 1, 0, 0, 1, 2, 2, 1, 0, // 9-17
    0, 1, 2, 2, 1, 0, 0, 1, 2  // 18-26
];

export function calculateAshtakoota(
    girlRashiIdx: number,
    girlNakshatraIdx: number,
    boyRashiIdx: number,
    boyNakshatraIdx: number,
    lang: 'en' | 'hi' | 'mai'
): MatchingResult {
    const kootas: KootaResult[] = [];

    // 1. Varna (Max 1 Point)
    const girlVarna = getVarnaIndex(girlRashiIdx);
    const boyVarna = getVarnaIndex(boyRashiIdx);
    // Brahmin (0) is highest, Shudra (3) is lowest. Lower index = higher spiritual varna.
    // Girl varna should be lower or equal in rank (value higher or equal index) compared to boy
    let varnaScore = 0;
    if (girlVarna >= boyVarna) {
        varnaScore = 1;
    }
    const varnaNames = { en: 'Varna', hi: 'वर्ण', mai: 'वर्ण' };
    const varnaDesc = {
        en: varnaScore === 1 ? 'Perfect compatibility of spiritual and work outlooks.' : 'Difference in work/social temperament. Remedial worship suggested.',
        hi: varnaScore === 1 ? 'आध्यात्मिक और सामाजिक स्वभाव का उत्तम मिलन।' : 'काम और स्वभाव में भिन्नता। सामान्य तालमेल की आवश्यकता है।',
        mai: varnaScore === 1 ? 'आध्यात्मिक आ सामाजिक स्वभावक उत्तम मिलन।' : 'काज आ स्वभाव में भिन्नता। सामान्य तालमेलक आवश्यकता अछि।'
    };
    kootas.push({ name: varnaNames[lang], score: varnaScore, maxScore: 1, description: varnaDesc[lang] });

    // 2. Vashya (Max 2 Points)
    const girlVashya = getVashyaGroup(girlRashiIdx);
    const boyVashya = getVashyaGroup(boyRashiIdx);
    const vashyaScore = VASHYA_MATRIX[girlVashya][boyVashya];
    const vashyaNames = { en: 'Vashya', hi: 'वश्य', mai: 'वश्य' };
    const vashyaDesc = {
        en: vashyaScore === 2 ? 'Excellent mutual attraction and dominance alignment.' : (vashyaScore >= 1 ? 'Satisfactory mutual control and harmony.' : 'Tendency of dominance clashes. Caution advised.'),
        hi: vashyaScore === 2 ? 'आपसी आकर्षण और समर्पण का सर्वश्रेष्ठ स्तर।' : (vashyaScore >= 1 ? 'सामान्य सामंजस्य और आपसी समझ।' : 'वर्चस्व की लड़ाई हो सकती है। सावधानी बरतें।'),
        mai: vashyaScore === 2 ? 'आपसी आकर्षण आ समर्पणक सर्वश्रेष्ठ स्तर।' : (vashyaScore >= 1 ? 'सामान्य सामंजस्य आ आपसी समझ।' : 'वर्चस्व कऽ लड़ाई भऽ सकैत अछि। सावधानी राखू।')
    };
    kootas.push({ name: vashyaNames[lang], score: vashyaScore, maxScore: 2, description: vashyaDesc[lang] });

    // 3. Tara (Max 3 Points)
    const d1 = (boyNakshatraIdx - girlNakshatraIdx + 27) % 27 + 1;
    const d2 = (girlNakshatraIdx - boyNakshatraIdx + 27) % 27 + 1;
    const t1 = d1 % 9;
    const t2 = d2 % 9;
    
    let taraScore = 0;
    const badTaras = [3, 5, 7];
    if (!badTaras.includes(t1)) taraScore += 1.5;
    if (!badTaras.includes(t2)) taraScore += 1.5;

    const taraNames = { en: 'Tara', hi: 'तारा', mai: 'तारा' };
    const taraDesc = {
        en: taraScore === 3 ? 'Deep longevity and fortune support for both.' : (taraScore === 1.5 ? 'Average destiny compatibility. Moderate support.' : 'Weak tara strength. Potential health concerns for one partner.'),
        hi: taraScore === 3 ? 'दोनों के उत्तम स्वास्थ्य और दीर्घायु की पुष्टि।' : (taraScore === 1.5 ? 'सामान्य स्वास्थ्य और भाग्य सहयोग।' : 'तारा बल कमजोर है। स्वास्थ्य का विशेष ध्यान रखना होगा।'),
        mai: taraScore === 3 ? 'दुनू गोटे कऽ उत्तम स्वास्थ्य आ दीर्घायुक पुष्टि।' : (taraScore === 1.5 ? 'सामान्य स्वास्थ्य आ भाग्य सहयोग।' : 'तारा बल कमजोर अछि। स्वास्थ्य कऽ विशेष ध्यान राखय पड़त।')
    };
    kootas.push({ name: taraNames[lang], score: taraScore, maxScore: 3, description: taraDesc[lang] });

    // 4. Yoni (Max 4 Points)
    const girlYoni = NAKSHATRA_YONI[girlNakshatraIdx];
    const boyYoni = NAKSHATRA_YONI[boyNakshatraIdx];
    const yoniScore = YONI_COMPATIBILITY_MATRIX[girlYoni][boyYoni];
    const yoniNames = { en: 'Yoni', hi: 'योनि', mai: 'योनि' };
    const yoniDesc = {
        en: yoniScore === 4 ? 'Exceptional physical compatibility, intense harmony.' : (yoniScore >= 2 ? 'Good biological adjustment and domestic peace.' : 'Hostile biological compatibility. Sexual/physical adjustment issues possible.'),
        hi: yoniScore === 4 ? 'शारीरिक और मानसिक अनुकूलता सर्वश्रेष्ठ है।' : (yoniScore >= 2 ? 'सामान्य शारीरिक और जैविक सामंजस्य।' : 'जैविक अनुकूलता शत्रुवत है। आपसी कलह हो सकती है।'),
        mai: yoniScore === 4 ? 'शारीरिक आ मानसिक अनुकूलता सर्वश्रेष्ठ अछि।' : (yoniScore >= 2 ? 'सामान्य शारीरिक आ जैविक सामंजस्य।' : 'जैविक अनुकूलता शत्रुवत अछि। आपसी कलह भऽ सकैत अछि।')
    };
    kootas.push({ name: yoniNames[lang], score: yoniScore, maxScore: 4, description: yoniDesc[lang] });

    // 5. Graha Maitri (Planetary Friendship) (Max 5 Points)
    const girlLord = RASHI_LORDS[girlRashiIdx];
    const boyLord = RASHI_LORDS[boyRashiIdx];
    const r1 = PLANET_RELATIONS[girlLord][boyLord] ?? 0;
    const r2 = PLANET_RELATIONS[boyLord][girlLord] ?? 0;

    let maitriScore = 0;
    if (r1 === 1 && r2 === 1) maitriScore = 5;
    else if ((r1 === 1 && r2 === 0) || (r1 === 0 && r2 === 1)) maitriScore = 4;
    else if (r1 === 0 && r2 === 0) maitriScore = 3;
    else if ((r1 === 1 && r2 === -1) || (r1 === -1 && r2 === 1)) maitriScore = 2;
    else if ((r1 === 0 && r2 === -1) || (r1 === -1 && r2 === 0)) maitriScore = 1;
    else maitriScore = 0;

    const maitriNames = { en: 'Graha Maitri', hi: 'ग्रह मैत्री', mai: 'ग्रह मैत्री' };
    const maitriDesc = {
        en: maitriScore === 5 ? 'Excellent mental alignment, shared life values.' : (maitriScore >= 3 ? 'Moderate intellectual synchronization.' : 'Different mindsets. Frequent intellectual differences possible.'),
        hi: maitriScore === 5 ? 'परस्पर मानसिक और बौद्धिक विचार अत्यंत मिलते हैं।' : (maitriScore >= 3 ? 'सामान्य वैचारिक सामंजस्य।' : 'मानसिकता में भारी भिन्नता। विवादों की आशंका।'),
        mai: maitriScore === 5 ? 'परस्पर मानसिक आ बौद्धिक विचार अत्यंत मिलैत अछि।' : (maitriScore >= 3 ? 'सामान्य वैचारिक सामंजस्य।' : 'मानसिकता में भारी भिन्नता। विवादक आशंका।')
    };
    kootas.push({ name: maitriNames[lang], score: maitriScore, maxScore: 5, description: maitriDesc[lang] });

    // 6. Gana (Max 6 Points)
    const girlGana = NAKSHATRA_GANA[girlNakshatraIdx];
    const boyGana = NAKSHATRA_GANA[boyNakshatraIdx];
    
    let ganaScore = 0;
    // Deva (0), Manushya (1), Rakshasa (2)
    if (girlGana === boyGana) {
        ganaScore = 6;
    } else if ((girlGana === 0 && boyGana === 1) || (girlGana === 1 && boyGana === 0)) {
        ganaScore = 5;
    } else if ((girlGana === 0 && boyGana === 2) || (girlGana === 2 && boyGana === 0)) {
        ganaScore = 1;
    } else {
        ganaScore = 0; // Manushya + Rakshasa
    }

    const ganaNames = { en: 'Gana', hi: 'गण', mai: 'गण' };
    const ganaDesc = {
        en: ganaScore >= 5 ? 'Matching temperament. Smooth communication.' : (ganaScore === 1 ? 'Temperament mismatches. Requires adjustment.' : 'Severe differences in worldview and anger levels. Conflict risk.'),
        hi: ganaScore >= 5 ? 'स्वभाव और आदतों का सुंदर मिलन।' : (ganaScore === 1 ? 'स्वभाव में असमानता, समझदारी आवश्यक।' : 'स्वभाव में गंभीर विरोधाभास। क्रोध और वैमनस्य का भय।'),
        mai: ganaScore >= 5 ? 'स्वभाव आ आदति सभक सुंदर मिलन।' : (ganaScore === 1 ? 'स्वभाव में असमानता, समझदारी आवश्यक।' : 'स्वभाव में गंभीर विरोधाभास। क्रोध आ वैमनस्यक भय।')
    };
    kootas.push({ name: ganaNames[lang], score: ganaScore, maxScore: 6, description: ganaDesc[lang] });

    // 7. Bhakoot (Max 7 Points)
    const girlRashiPos = girlRashiIdx;
    const boyRashiPos = boyRashiIdx;
    const diffRashi = (boyRashiPos - girlRashiPos + 12) % 12 + 1;
    const revDiffRashi = (girlRashiPos - boyRashiPos + 12) % 12 + 1;

    // Bad positions: 2-12, 5-9, 6-8
    const badPositions = [2, 12, 5, 9, 6, 8];
    const hasBhakootDosha = badPositions.includes(diffRashi);
    
    // Exception rules: Graha Maitri cancels Bhakoot Dosha in some traditions, but mathematically standard score:
    const bhakootScore = hasBhakootDosha ? 0 : 7;
    const bhakootNames = { en: 'Bhakoot', hi: 'भकूट', mai: 'भकूट' };
    const bhakootDesc = {
        en: hasBhakootDosha 
            ? `Bhakoot Dosha present (${diffRashi}-${revDiffRashi} relation). Potential financial or relationship friction.` 
            : 'Favorable sign relations. Financial stability and emotional harmony.',
        hi: hasBhakootDosha 
            ? `भकूट दोष विद्यमान है (${diffRashi}-${revDiffRashi} संबंध)। आपसी संबंधों या सुख में बाधा।` 
            : 'राशियों का अनुकूल संबंध। मानसिक शांति और पारिवारिक समृद्धि।',
        mai: hasBhakootDosha 
            ? `भकूट दोष विद्यमान अछि (${diffRashi}-${revDiffRashi} संबंध)। आपसी संबंध वा सुख में बाधा।` 
            : 'राशिक अनुकूल संबंध। मानसिक शांति आ पारिवारिक समृद्धि।'
    };
    kootas.push({ name: bhakootNames[lang], score: bhakootScore, maxScore: 7, description: bhakootDesc[lang] });

    // 8. Nadi (Max 8 Points)
    const girlNadi = NAKSHATRA_NADI[girlNakshatraIdx];
    const boyNadi = NAKSHATRA_NADI[boyNakshatraIdx];
    const hasNadiDosha = girlNadi === boyNadi;
    const nadiScore = hasNadiDosha ? 0 : 8;

    const nadiNames = { en: 'Nadi', hi: 'नाड़ी', mai: 'नाड़ी' };
    const nadiDesc = {
        en: hasNadiDosha 
            ? 'Nadi Dosha present (Same Nadi). Potential issues with offspring health or physical compatibility.' 
            : 'Excellent biological compatibility. Health and descendants safety assured.',
        hi: hasNadiDosha 
            ? 'नाड़ी दोष विद्यमान है (समान नाड़ी)। संतान पक्ष या स्वास्थ्य को लेकर चिंता हो सकती है।' 
            : 'शारीरिक और आनुवंशिक अनुकूलता सर्वोत्तम। भावी संतान और स्वास्थ्य सुरक्षित।',
        mai: hasNadiDosha 
            ? 'नाड़ी दोष विद्यमान अछि (समान नाड़ी)। संतान पक्ष वा स्वास्थ्य कें लऽ चिंता भऽ सकैत अछि।' 
            : 'शारीरिक आ आनुवंशिक अनुकूलता सर्वोत्तम। भावी संतान आ स्वास्थ्य सुरक्षित।'
    };
    kootas.push({ name: nadiNames[lang], score: nadiScore, maxScore: 8, description: nadiDesc[lang] });

    // Total Score
    const totalScore = kootas.reduce((acc, curr) => acc + curr.score, 0);

    // Verdict formulation
    let verdict = '';
    if (lang === 'en') {
        if (totalScore >= 25 && !hasNadiDosha && !hasBhakootDosha) {
            verdict = 'Excellent Compatibility! Highly recommended union with strong planetary and biological support.';
        } else if (totalScore >= 18) {
            let notes = [];
            if (hasNadiDosha) notes.push('Nadi Dosha requires remedy');
            if (hasBhakootDosha) notes.push('Bhakoot Dosha is present');
            verdict = `Good Compatibility. Match is acceptable (${totalScore}/36). ${notes.length > 0 ? `Note: ${notes.join(' and ')}.` : ''}`;
        } else {
            verdict = 'Low Compatibility. Matching score is below the minimum required threshold of 18 Gunas. Caution and remedies advised.';
        }
    } else if (lang === 'hi') {
        if (totalScore >= 25 && !hasNadiDosha && !hasBhakootDosha) {
            verdict = 'उत्कृष्ट मिलान! वैवाहिक जीवन अत्यंत सुखद, समृद्ध और सौभाग्यशाली रहेगा। विवाह के लिए सर्वश्रेष्ठ।';
        } else if (totalScore >= 18) {
            let notes = [];
            if (hasNadiDosha) notes.push('नाड़ी दोष की शांति आवश्यक है');
            if (hasBhakootDosha) notes.push('भकूट दोष विद्यमान है');
            verdict = `मध्यम मिलान। विवाह स्वीकार्य है (${totalScore}/36 गुण मिल रहे हैं)। ${notes.length > 0 ? `सूचना: ${notes.join(', ')}।` : ''}`;
        } else {
            verdict = 'कमजोर मिलान। कुल मिलान १८ गुण से कम है। कुंडली मिलान के अनुसार वैवाहिक बाधाएं आ सकती हैं।';
        }
    } else {
        // Maithili
        if (totalScore >= 25 && !hasNadiDosha && !hasBhakootDosha) {
            verdict = 'उत्कृष्ट मिलान! वैवाहिक जीवन अत्यंत सुखद, समृद्ध आ सौभाग्यशाली रहत। बियाह लेल सर्वश्रेष्ठ अछि।';
        } else if (totalScore >= 18) {
            let notes = [];
            if (hasNadiDosha) notes.push('नाड़ी दोष कऽ शांति आवश्यक अछि');
            if (hasBhakootDosha) notes.push('भकूट दोष विद्यमान अछि');
            verdict = `मध्यम मिलान। बियाह कएल जा सकैत अछि (${totalScore}/36 गुण मिलि रहल अछि)। ${notes.length > 0 ? `ध्यान दिअ: ${notes.join(', ')}।` : ''}`;
        } else {
            verdict = 'कमजोर मिलान। कुल मिलान १८ गुण सँ कम अछि। कुण्डली मिलानक अनुसार वैवाहिक जीवन में बाधा आ सकैत अछि।';
        }
    }

    return {
        totalScore,
        maxScore: 36,
        kootas,
        verdict,
        hasNadiDosha,
        hasBhakootDosha
    };
}

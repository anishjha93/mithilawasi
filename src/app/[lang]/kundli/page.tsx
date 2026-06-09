'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { generateKundli, KundliResult, formatDegrees } from '@/utils/kundli';
import KundliMilan from '@/components/KundliMilan';

// Major cities presets in and around Mithila/India
const CITIES_PRESETS = [
    { nameKey: 'darbhanga', lat: 26.15, lon: 85.90 },
    { nameKey: 'madhubani', lat: 26.35, lon: 86.08 },
    { nameKey: 'patna', lat: 25.59, lon: 85.14 },
    { nameKey: 'muzaffarpur', lat: 26.12, lon: 85.39 },
    { nameKey: 'saharsa', lat: 25.88, lon: 86.60 },
    { nameKey: 'purnia', lat: 25.78, lon: 87.47 },
    { nameKey: 'delhi', lat: 28.61, lon: 77.20 },
    { nameKey: 'mumbai', lat: 19.07, lon: 72.87 },
    { nameKey: 'bengaluru', lat: 12.97, lon: 77.59 },
    { nameKey: 'kolkata', lat: 22.57, lon: 88.36 }
];

const RASHIS_EN = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
const RASHIS_MAI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

const PLANET_NAME_MAP: Record<string, { en: string, hi: string, mai: string, abbrevEn: string, abbrevLocal: string }> = {
    'Sun': { en: 'Sun', hi: 'सूर्य', mai: 'सूर्य', abbrevEn: 'Su', abbrevLocal: 'सू' },
    'Moon': { en: 'Moon', hi: 'चन्द्र', mai: 'चन्द्र', abbrevEn: 'Mo', abbrevLocal: 'च' },
    'Mercury': { en: 'Mercury', hi: 'बुध', mai: 'बुध', abbrevEn: 'Me', abbrevLocal: 'बु' },
    'Venus': { en: 'Venus', hi: 'शुक्र', mai: 'शुक्र', abbrevEn: 'Ve', abbrevLocal: 'शु' },
    'Mars': { en: 'Mars', hi: 'मंगल', mai: 'मंगल', abbrevEn: 'Ma', abbrevLocal: 'मं' },
    'Jupiter': { en: 'Jupiter', hi: 'गुरु', mai: 'गुरु', abbrevEn: 'Ju', abbrevLocal: 'गु' },
    'Saturn': { en: 'Saturn', hi: 'शनि', mai: 'शनि', abbrevEn: 'Sa', abbrevLocal: 'श' },
    'Rahu': { en: 'Rahu', hi: 'राहु', mai: 'राहु', abbrevEn: 'Ra', abbrevLocal: 'रा' },
    'Ketu': { en: 'Ketu', hi: 'केतु', mai: 'केतु', abbrevEn: 'Ke', abbrevLocal: 'के' }
};

// Interpretation system for planets in houses
const getPlanetHouseInterpretation = (planet: string, house: number, lang: 'en' | 'hi' | 'mai'): string => {
    const interpretations: Record<string, Record<number, { en: string, hi: string, mai: string }>> = {
        'Sun': {
            1: {
                en: "Gives strong willpower, leadership capabilities, high self-esteem, and independent nature. Can cause ego issues.",
                hi: "मजबूत इच्छाशक्ति, नेतृत्व क्षमता, उच्च आत्मसम्मान और स्वतंत्र स्वभाव देता है। अहंकार की समस्या हो सकती है।",
                mai: "मजबूत इच्छाशक्ति, नेतृत्व क्षमता, उच्च आत्मसम्मान आ स्वतंत्र स्वभाव दैत अछि। अहंकारक समस्या भऽ सकैत अछि।"
            },
            9: {
                en: "Indicates deep interest in philosophy, spirituality, and higher learning. Highly auspicious for ethics, travel, and luck.",
                hi: "दर्शन, आध्यात्मिकता और उच्च शिक्षा में गहरी रुचि दर्शाता है। नैतिकता, यात्रा और भाग्य के लिए अत्यधिक शुभ है।",
                mai: "दर्शन, आध्यात्मिकता आ उच्च शिक्षा में गहरी रुचि दर्शाबैत अछि। नैतिकता, यात्रा आ भाग्यक लेल अत्यधिक शुभ अछि।"
            },
            10: {
                en: "Excellent placement for career, public recognition, fame, power, and political success. The native enjoys authority.",
                hi: "करियर, सार्वजनिक पहचान, प्रसिद्धि, शक्ति और राजनीतिक सफलता के लिए उत्कृष्ट स्थान। जातक अधिकार का आनंद लेता है।",
                mai: "करियर, सार्वजनिक पहचान, प्रसिद्धि, शक्ति आ राजनीतिक सफलताक लेल उत्कृष्ट स्थान। जातक अधिकारक आनंद लैत अछि।"
            }
        },
        'Moon': {
            5: {
                en: "Highly creative and imaginative mind. Gives intellectual inclinations, love for learning, and affectionate relations with children.",
                hi: "अत्यधिक रचनात्मक और कल्पनाशील मन। बौद्धिक झुकाव, सीखने के लिए प्यार और बच्चों के साथ स्नेही संबंध देता है।",
                mai: "अत्यधिक रचनात्मक आ कल्पनाशील मन। बौद्धिक झुकाव, सीखबाक लेल प्रेम आ बच्चा सभक संग स्नेही संबंध दैत अछि।"
            },
            4: {
                en: "Strong emotional connection to mother, home, and ancestral roots. Represents peace of mind, happiness, and comforts.",
                hi: "माता, घर और पैतृक जड़ों के साथ मजबूत भावनात्मक संबंध। मन की शांति, खुशी और सुख-सुविधाओं का प्रतिनिधित्व करता है।",
                mai: "माता, घर आ पैतृक जड़ि कऽ संग मजबूत भावनात्मक संबंध। मनक शांति, प्रसन्नता आ सुख-सुविधाक प्रतिनिधित्व करैत अछि।"
            }
        },
        'Jupiter': {
            11: {
                en: "Indicates vast wealth, wisdom, fulfillment of desires, and support from highly influential friends and networks.",
                hi: "विशाल धन, बुद्धि, इच्छाओं की पूर्ति और अत्यधिक प्रभावशाली मित्रों और नेटवर्क से समर्थन का संकेत देता है।",
                mai: "विशाल धन, बुद्धि, इच्छाक पूर्ति आ अत्यधिक प्रभावशाली मित्र आ नेटवर्क सँ समर्थनक संकेत दैत अछि।"
            },
            1: {
                en: "Brings strong wisdom, magnanimous personality, spiritual inclinations, good fortune, and general success throughout life.",
                hi: "जीवन भर मजबूत ज्ञान, उदार व्यक्तित्व, आध्यात्मिक झुकाव, अच्छा भाग्य और सामान्य सफलता लाता है।",
                mai: "जीवन भर मजबूत ज्ञान, उदार व्यक्तित्व, आध्यात्मिक झुकाव, नीक भाग्य आ सामान्य सफलता अनैत अछि।"
            },
            9: {
                en: "Highly spiritual placement. Indicates higher knowledge, luck, fortune, and strong interest in Vedic scriptures and teaching.",
                hi: "अत्यधिक आध्यात्मिक स्थान। उच्च ज्ञान, भाग्य, समृद्धि और वैदिक शास्त्रों और शिक्षण में गहरी रुचि का संकेत देता है।",
                mai: "अत्यधिक आध्यात्मिक स्थान। उच्च ज्ञान, भाग्य, समृद्धि आ वैदिक शास्त्र आ शिक्षण में गहरी रुचि कऽ संकेत दैत अछि।"
            }
        }
    };

    const entry = interpretations[planet]?.[house];
    if (entry) {
        return entry[lang];
    }

    // Dynamic Generic fallbacks for other planets/houses
    if (house === 1 || house === 5 || house === 9 || house === 10) {
        if (lang === 'en') return `Brings positive and favorable outcomes in this house, enhancing qualities of expression, intellect, and social standing.`;
        return `इस भाव में सकारात्मक और अनुकूल परिणाम लाता है, अभिव्यक्ति, बुद्धि और सामाजिक स्थिति के गुणों को बढ़ाता है।`;
    } else if (house === 6 || house === 8 || house === 12) {
        if (lang === 'en') return `Encourages deep reflection, spiritual growth, resilience, and resolving obstacles or internal conflicts in life.`;
        return `गहन चिंतन, आध्यात्मिक विकास, लचीलेपन और जीवन में बाधाओं या आंतरिक संघर्षों को हल करने को बढ़ावा देता है।`;
    } else {
        if (lang === 'en') return `Indicates balanced energies in this area of life, supporting stability, wealth accumulation, and family relations.`;
        return `जीवन के इस क्षेत्र में संतुलित ऊर्जा का संकेत देता है, स्थिरता, धन संचय और पारिवारिक संबंधों का समर्थन करता है।`;
    }
};

export default function KundliPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const locale = (lang === 'hi' || lang === 'mai' ? lang : 'en') as 'en' | 'hi' | 'mai';

    // Page translations inline to guarantee availability
    const t = {
        en: {
            title: "Janam Kundli Generator",
            lead: "Generate your traditional Vedic Janam Kundli (Birth Chart) instantly. Calculations are calculated locally in your browser with zero network footprint.",
            formTitle: "Enter Birth Details",
            nameLabel: "Full Name",
            dateLabel: "Date of Birth",
            timeLabel: "Time of Birth",
            cityLabel: "Birth Place (Select City)",
            customCity: "Custom Location (Lat / Long)",
            latLabel: "Latitude (decimal)",
            lonLabel: "Longitude (decimal)",
            generateBtn: "Generate Kundli",
            resetBtn: "Reset",
            chartTitle: "Lagna Kundli (D-1 Birth Chart)",
            detailsTitle: "Planetary Longitudes & Positions",
            thPlanet: "Planet",
            thRashi: "Rashi / Sign",
            thDegree: "Degree",
            thHouse: "House Placement",
            ascendant: "Lagna (Ascendant)",
            interpretationsTitle: "Astrological Interpretations (Graha & Bhava)",
            interpretationsLead: "Here is a brief analysis of the planets placed in their respective houses in your chart:",
            optional: "Optional",
            guideTitle: "Vedic Astrology Chart Guide",
            guideReadingTitle: "How to Read the Chart",
            guideReadingText: "The North Indian Kundli is read counter-clockwise starting from the top central diamond (1st House / Lagna). The numbers printed in each partition represent the Zodiac Sign (Rashi) number (e.g. 1 = Aries, 6 = Virgo, 12 = Pisces), NOT the house number. The 1st house will show your Ascendant sign's number.",
            guideHousesTitle: "The 12 Houses (Bhavas)",
            guideHousesText: "Each house corresponds to a specific area of life. The 1st House represents yourself and body; the 4th governs home, comfort and mother; the 5th governs intellect and children; the 7th governs marriage and partnerships; the 9th governs luck and spirituality; and the 10th governs career and status.",
            guidePlanetsTitle: "The 9 Grahas (Planets)",
            guidePlanetsText: "Grahas represent cosmic energies positioned in your chart. The Sun represents the soul and career; the Moon represents the mind and emotions; Jupiter represents wisdom and wealth; Venus represents luxuries and marriage; Rahu represents worldly desires; and Ketu represents spiritual liberation."
        },
        hi: {
            title: "जन्म कुंडली जनरेटर",
            lead: "अपनी पारंपरिक वैदिक जन्म कुंडली तुरंत प्राप्त करें। सभी गणनाएं आपके ब्राउज़र में सुरक्षित रूप से स्थानीय स्तर पर की जाती हैं, जिससे डेटा का कोई सर्वर उपयोग नहीं होता है।",
            formTitle: "जन्म का विवरण भरें",
            nameLabel: "पूरा नाम",
            dateLabel: "जन्म तिथि",
            timeLabel: "जन्म समय",
            cityLabel: "जन्म स्थान (शहर चुनें)",
            customCity: "कस्टम स्थान (अक्षांश / देशांतर)",
            latLabel: "अक्षांश (Latitude)",
            lonLabel: "देशांतर (Longitude)",
            generateBtn: "कुंडली बनाएं",
            resetBtn: "रीसेट करें",
            chartTitle: "लग्न कुंडली (D-1 चार्ट)",
            detailsTitle: "ग्रहों की स्थिति और अंश",
            thPlanet: "ग्रह",
            thRashi: "राशि / राशि चक्र",
            thDegree: "अंश (Degree)",
            thHouse: "भाव (House)",
            ascendant: "लग्न (Ascendant)",
            interpretationsTitle: "ज्योतिषीय विश्लेषण (ग्रह और भाव फल)",
            interpretationsLead: "आपके कुंडली चक्र में विभिन्न भावों में स्थित ग्रहों का संक्षिप्त फलादेश नीचे दिया गया है:",
            optional: "वैकल्पिक",
            guideTitle: "वैदिक ज्योतिष कुंडली मार्गदर्शिका",
            guideReadingTitle: "कुंडली कैसे पढ़ें",
            guideReadingText: "उत्तर भारतीय कुंडली को शीर्ष मध्य हीरे (प्रथम भाव / लग्न) से शुरू करके वामावर्त (counter-clockwise) पढ़ा जाता है। प्रत्येक भाव में लिखे नंबर राशि (Rashi) के नंबर (जैसे 1 = मेष, 6 = कन्या, 12 = मीन) का प्रतिनिधित्व करते हैं, न कि भाव संख्या का। प्रथम भाव आपके लग्न राशि के नंबर को दर्शाता है।",
            guideHousesTitle: "12 भाव (घर)",
            guideHousesText: "कुंडली का प्रत्येक भाव जीवन के एक विशिष्ट क्षेत्र को दर्शाता है। प्रथम भाव स्वयं और शरीर का प्रतिनिधित्व करता है; चतुर्थ भाव सुख, घर और माता का; पंचम भाव बुद्धि और संतान का; सप्तम भाव विवाह और साझेदारी का; नवम भाव भाग्य और धर्म का; और दशम भाव करियर और कर्म का प्रतिनिधित्व करता है।",
            guidePlanetsTitle: "9 ग्रह (Grahas)",
            guidePlanetsText: "ग्रह आपके जीवन में ब्रह्मांडीय ऊर्जाओं के प्रभाव को दर्शाते हैं। सूर्य आत्मा और करियर का प्रतिनिधित्व करता है; चन्द्रमा मन और भावनाओं का; गुरु ज्ञान और धन का; शुक्र विलासिता और विवाह का; राहु सांसारिक इच्छाओं का; और केतु आध्यात्मिक मुक्ति का प्रतिनिधित्व करता है।"
        },
        mai: {
            title: "जन्म कुण्डली जनरेटर",
            lead: "अपन पारंपरिक वैदिक जन्म कुण्डली तुरंत प्राप्त करू। सभटा गणना अहाँक ब्राउज़र में सुरक्षित रूप सँ स्थानीय स्तर पर कएल जाइत अछि, जाहि सँ क्लाउडफ्लेयर सर्वर पर कोनो भार नहि पड़ैत अछि।",
            formTitle: "जन्म कऽ विवरण भरू",
            nameLabel: "पूरा नाम",
            dateLabel: "जन्म तिथि",
            timeLabel: "जन्म समय",
            cityLabel: "जन्म स्थान (शहर चुनू)",
            customCity: "कस्टम स्थान (अक्षांश / देशांतर)",
            latLabel: "अक्षांश (Latitude)",
            lonLabel: "देशांतर (Longitude)",
            generateBtn: "कुण्डली बनाउ",
            resetBtn: "रीसेट करू",
            chartTitle: "लग्न कुण्डली (D-1 चार्ट)",
            detailsTitle: "ग्रहक स्थिति आ अंश",
            thPlanet: "ग्रह",
            thRashi: "राशि / राशि चक्र",
            thDegree: "अंश (Degree)",
            thHouse: "भाव (House)",
            ascendant: "लग्न (Ascendant)",
            interpretationsTitle: "ज्योतिषीय विश्लेषण (ग्रह आ भाव फल)",
            interpretationsLead: "अहाँक कुण्डली चक्र में विभिन्न भाव में स्थित ग्रह सभक संक्षिप्त फलादेश नीचाँ देल गेल अछि:",
            optional: "वैकल्पिक",
            guideTitle: "वैदिक ज्योतिष कुण्डली मार्गदर्शिका",
            guideReadingTitle: "कुण्डली कोना पढू",
            guideReadingText: "उत्तर भारतीय कुण्डली कें ऊपरका मध्य हीरा (प्रथम भाव / लग्न) सँ शुरू कऽ वामावर्त (counter-clockwise) पढ़ल जाइत अछि। प्रत्येक घर में लिखल नम्बर राशि (Rashi) कऽ नम्बर (जेना 1 = मेष, 6 = कन्या, 12 = मीन) कऽ प्रतिनिधित्व करैत अछि, नहि कि घरक संख्या कऽ। प्रथम घर अहाँक लग्न राशिक नम्बर कें देखबैत अछि।",
            guideHousesTitle: "12 भाव (घर)",
            guideHousesText: "कुण्डलीक प्रत्येक घर जीवनक एकटा खास क्षेत्र कें देखबैत अछि। प्रथम घर स्वयं आ शरीरक प्रतिनिधित्व करैत अछि; चतुर्थ घर सुख, घर आ माताक; पंचम घर बुद्धि आ संतानक; सप्तम घर बियाह आ साझेदारीक; नवम घर भाग्य आ धर्मक; आ दशम घर career आ कर्मक प्रतिनिधित्व करैत अछि।",
            guidePlanetsTitle: "9 ग्रह (Grahas)",
            guidePlanetsText: "ग्रह अहाँक जीवन में ब्रह्मांडीय ऊर्जा सभक प्रभाव कें देखबैत अछि। सूर्य आत्मा आ करियरक प्रतिनिधित्व करैत छथि; चन्द्रमा मन आ भावनाक; गुरु ज्ञान आ धनक; शुक्र विलासिता आ बियाहक; राहु सांसारिक इच्छाक; आ केतु आध्यात्मिक मुक्तिक प्रतिनिधित्व करैत छथि।"
        }
    }[locale];

    const cityNames: Record<string, string> = {
        darbhanga: locale === 'en' ? "Darbhanga (Mithila)" : "दरभंगा (मिथिला)",
        madhubani: locale === 'en' ? "Madhubani (Mithila)" : "मधुबनी (मिथिला)",
        patna: locale === 'en' ? "Patna (Bihar)" : "पटना (बिहार)",
        muzaffarpur: locale === 'en' ? "Muzaffarpur (Bihar)" : "मुजफ्फरपुर (बिहार)",
        saharsa: locale === 'en' ? "Saharsa (Bihar)" : "सहरसा (बिहार)",
        purnia: locale === 'en' ? "Purnia (Bihar)" : "पूर्णिया (बिहार)",
        delhi: locale === 'en' ? "Delhi (NCR)" : "दिल्ली (एनसीआर)",
        mumbai: locale === 'en' ? "Mumbai" : "मुंबई",
        bengaluru: locale === 'en' ? "Bengaluru" : "बेंगलुरु",
        kolkata: locale === 'en' ? "Kolkata" : "कोलकाता",
        custom: locale === 'en' ? "Custom Coordinates" : "कस्टम स्थान (अक्षांश / देशांतर)"
    };

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [cityIndex, setCityIndex] = useState('0'); // Index in CITIES_PRESETS or 'custom'
    const [latitude, setLatitude] = useState('26.15');
    const [longitude, setLongitude] = useState('85.90');

    const [kundli, setKundli] = useState<KundliResult | null>(null);
    const [activeTab, setActiveTab] = useState<'chart' | 'milan'>('chart');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            if (tab === 'milan') {
                setActiveTab('milan');
            } else if (tab === 'chart') {
                setActiveTab('chart');
            }
        }
    }, []);

    const handleCityChange = (val: string) => {
        setCityIndex(val);
        if (val !== 'custom') {
            const city = CITIES_PRESETS[Number(val)];
            setLatitude(city.lat.toFixed(4));
            setLongitude(city.lon.toFixed(4));
        }
    };

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate || !birthTime) return;

        const dateTimeStr = `${birthDate}T${birthTime}:00`;
        const dateObj = new Date(dateTimeStr);
        const lat = Number(latitude);
        const lon = Number(longitude);

        const result = generateKundli(dateObj, lat, lon);
        setKundli(result);
    };

    const handleReset = () => {
        setName('');
        setBirthDate('');
        setBirthTime('');
        setCityIndex('0');
        setLatitude('26.15');
        setLongitude('85.90');
        setKundli(null);
    };

    // Construct the planets list in each house
    const getHousePlanets = (houseNum: number): string[] => {
        if (!kundli) return [];
        const matches = kundli.planets.filter(p => p.houseNum === houseNum);
        
        // Return abbreviated names
        return matches.map(p => {
            const mapping = PLANET_NAME_MAP[p.name];
            return locale === 'en' ? mapping.abbrevEn : mapping.abbrevLocal;
        });
    };

    // Get Rashi index of each house
    const getHouseRashiIndex = (houseNum: number): number => {
        if (!kundli) return 0;
        return (kundli.lagnaRashiIndex + houseNum - 1) % 12;
    };

    return (
        <main className="max-w-[1280px] mx-auto px-4 py-12">
            <header className="text-center mb-16 animate-in fade-in duration-700">
                <Link href={`/${lang}/calendar`} className="inline-flex items-center text-primary-red no-underline font-semibold mb-8 transition-transform hover:-translate-x-1">
                    ← {locale === 'en' ? 'Back to Calendar' : 'पंचांग पर वापस'}
                </Link>
                <h1 className="text-[3rem] font-bold text-primary-red tracking-tight">{t.title}</h1>
                <p className="text-[1.15rem] text-gray-700 dark:text-gray-300 max-w-[800px] mx-auto mt-6 leading-relaxed">
                    {t.lead}
                </p>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-xl max-w-full w-fit mx-auto mt-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('chart')}
                        className={`flex-grow px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                            activeTab === 'chart'
                                ? 'bg-white dark:bg-zinc-800 text-primary-red shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        🗺️ {locale === 'en' ? 'Janam Kundli' : 'जन्म कुंडली'}
                    </button>
                    <button
                        onClick={() => setActiveTab('milan')}
                        className={`flex-grow px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                            activeTab === 'milan'
                                ? 'bg-white dark:bg-zinc-800 text-primary-red shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        💖 {locale === 'en' ? 'Kundli Milan' : 'गुण मिलान'}
                    </button>
                </div>
            </header>

            {activeTab === 'chart' ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Section */}
                <div className="lg:col-span-4 bg-white dark:bg-card-bg p-6 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                    <h2 className="text-[1.35rem] font-bold text-primary-red mb-6 border-b border-border-color pb-2">{t.formTitle}</h2>
                    <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.nameLabel} <span className="text-[0.7rem] italic opacity-60">({t.optional})</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                                placeholder="e.g. Anish"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dateLabel}</label>
                            <input
                                type="date"
                                required
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.timeLabel}</label>
                            <input
                                type="time"
                                required
                                value={birthTime}
                                onChange={(e) => setBirthTime(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.cityLabel}</label>
                            <select
                                value={cityIndex}
                                onChange={(e) => handleCityChange(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                            >
                                {CITIES_PRESETS.map((city, idx) => (
                                    <option key={idx} value={String(idx)}>{cityNames[city.nameKey]}</option>
                                ))}
                                <option value="custom">{cityNames.custom}</option>
                            </select>
                        </div>

                        {cityIndex === 'custom' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.latLabel}</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        required
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[0.8rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.lonLabel}</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        required
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        className="bg-gray-50 dark:bg-zinc-900 border border-border-color rounded-lg p-2.5 outline-none focus:border-primary-red text-[0.95rem]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-4">
                            <button
                                type="submit"
                                className="flex-grow bg-primary-red text-white py-3 rounded-xl font-bold transition-all shadow-md hover:bg-primary-red/90 hover:shadow-lg text-[0.95rem]"
                            >
                                {t.generateBtn}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-xl font-semibold transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 text-[0.95rem]"
                            >
                                {t.resetBtn}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {kundli ? (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom duration-500">
                            
                            {/* SVG Kundli Grid and Table side-by-side on desktop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                
                                {/* Chart */}
                                <div className="bg-paper-texture dark:bg-zinc-900 p-6 rounded-2xl border-madhubani shadow-lg flex flex-col items-center">
                                    <h3 className="text-[1.2rem] font-heading font-black text-primary-red mb-6 text-center">
                                        ✨ {t.chartTitle} {name ? `(${name})` : ''}
                                    </h3>
                                    
                                    {/* Responsive North Indian Kundli SVG */}
                                    <svg viewBox="0 0 300 300" className="w-full max-w-[340px] aspect-square text-primary-red">
                                        {/* Border */}
                                        <rect x="2" y="2" width="296" height="296" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                        
                                        {/* Diagonals */}
                                        <line x1="2" y1="2" x2="298" y2="298" stroke="currentColor" strokeWidth="1.5" />
                                        <line x1="2" y1="298" x2="298" y2="2" stroke="currentColor" strokeWidth="1.5" />
                                        
                                        {/* Inner Diamond */}
                                        <polygon points="150,2 2,150 150,298 298,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                        
                                        {/* House 1 */}
                                        <text x="150" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(1) + 1}
                                        </text>
                                        <text x="150" y="80" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(1).join(' ')} {locale === 'en' ? 'Lg' : 'ल'}
                                        </text>

                                        {/* House 2 */}
                                        <text x="95" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(2) + 1}
                                        </text>
                                        <text x="75" y="48" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(2).join(' ')}
                                        </text>

                                        {/* House 3 */}
                                        <text x="32" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(3) + 1}
                                        </text>
                                        <text x="48" y="75" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(3).join(' ')}
                                        </text>

                                        {/* House 4 */}
                                        <text x="95" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(4) + 1}
                                        </text>
                                        <text x="75" y="165" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(4).join(' ')}
                                        </text>

                                        {/* House 5 */}
                                        <text x="32" y="205" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(5) + 1}
                                        </text>
                                        <text x="48" y="225" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(5).join(' ')}
                                        </text>

                                        {/* House 6 */}
                                        <text x="95" y="268" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(6) + 1}
                                        </text>
                                        <text x="75" y="252" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(6).join(' ')}
                                        </text>

                                        {/* House 7 */}
                                        <text x="150" y="245" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(7) + 1}
                                        </text>
                                        <text x="150" y="225" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(7).join(' ')}
                                        </text>

                                        {/* House 8 */}
                                        <text x="205" y="268" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(8) + 1}
                                        </text>
                                        <text x="225" y="252" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(8).join(' ')}
                                        </text>

                                        {/* House 9 */}
                                        <text x="268" y="205" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(9) + 1}
                                        </text>
                                        <text x="252" y="225" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(9).join(' ')}
                                        </text>

                                        {/* House 10 */}
                                        <text x="205" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(10) + 1}
                                        </text>
                                        <text x="225" y="165" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(10).join(' ')}
                                        </text>

                                        {/* House 11 */}
                                        <text x="268" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(11) + 1}
                                        </text>
                                        <text x="252" y="75" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(11).join(' ')}
                                        </text>

                                        {/* House 12 */}
                                        <text x="205" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.6">
                                            {getHouseRashiIndex(12) + 1}
                                        </text>
                                        <text x="225" y="48" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill="var(--color-text-main)">
                                            {getHousePlanets(12).join(' ')}
                                        </text>
                                    </svg>
                                </div>

                                {/* Planetary Positions Table */}
                                <div className="bg-white dark:bg-card-bg p-6 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                                    <h3 className="text-[1.2rem] font-bold text-primary-red mb-4">{t.detailsTitle}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-150 dark:border-zinc-800 text-[0.8rem] uppercase text-gray-400 font-bold">
                                                    <th className="py-2.5">{t.thPlanet}</th>
                                                    <th className="py-2.5">{t.thRashi}</th>
                                                    <th className="py-2.5">{t.thDegree}</th>
                                                    <th className="py-2.5">{t.thHouse}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[0.95rem] divide-y divide-gray-100 dark:divide-zinc-850">
                                                {/* Lagna / Ascendant row */}
                                                <tr className="text-gray-900 dark:text-gray-100 font-semibold bg-gray-50/50 dark:bg-zinc-900/40">
                                                    <td className="py-2.5">{t.ascendant}</td>
                                                    <td className="py-2.5">
                                                        {locale === 'en' ? RASHIS_EN[kundli.lagnaRashiIndex] : RASHIS_MAI[kundli.lagnaRashiIndex]}
                                                    </td>
                                                    <td className="py-2.5">{formatDegrees(kundli.lagnaLongitude)}</td>
                                                    <td className="py-2.5">1</td>
                                                </tr>
                                                {/* Planet rows */}
                                                {kundli.planets.map((p, idx) => {
                                                    const map = PLANET_NAME_MAP[p.name];
                                                    const localizedName = locale === 'en' ? map.en : (locale === 'hi' ? map.hi : map.mai);
                                                    return (
                                                        <tr key={idx} className="text-gray-700 dark:text-gray-300">
                                                            <td className="py-2.5 font-medium">{localizedName}</td>
                                                            <td className="py-2.5">
                                                                {locale === 'en' ? RASHIS_EN[p.rashiIndex] : RASHIS_MAI[p.rashiIndex]}
                                                            </td>
                                                            <td className="py-2.5">{p.degreeStr}</td>
                                                            <td className="py-2.5 font-bold">{p.houseNum}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Astrological Interpretations Card */}
                            <div className="bg-white dark:bg-card-bg p-8 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color">
                                <h3 className="text-[1.35rem] font-bold text-primary-red mb-2">🪐 {t.interpretationsTitle}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-[0.95rem]">{t.interpretationsLead}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select a few key planets to show detailed readings (Sun, Moon, Jupiter) */}
                                    {['Sun', 'Moon', 'Jupiter'].map(planetName => {
                                        const map = PLANET_NAME_MAP[planetName];
                                        const localizedName = locale === 'en' ? map.en : (locale === 'hi' ? map.hi : map.mai);
                                        const planetData = kundli.planets.find(p => p.name === planetName);
                                        if (!planetData) return null;

                                        return (
                                            <div key={planetName} className="p-4 bg-gray-50/50 dark:bg-zinc-900/30 rounded-xl border border-border-color">
                                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-border-color">
                                                    <strong className="text-accent-gold text-[1.05rem]">{localizedName}</strong>
                                                    <span className="text-[0.8rem] font-bold bg-primary-red/15 text-primary-red px-2.5 py-0.5 rounded-full">
                                                        {locale === 'en' ? `House ${planetData.houseNum}` : `भाव ${planetData.houseNum}`}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 text-[0.9rem] leading-relaxed">
                                                    {getPlanetHouseInterpretation(planetName, planetData.houseNum, locale)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-zinc-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 text-center min-h-[300px]">
                            <span className="text-5xl mb-4 filter drop-shadow-md">🗺️</span>
                            <h3 className="text-[1.25rem] font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {locale === 'en' ? 'Birth Chart Ready' : 'जन्म कुंडली तैयार है'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-[400px] text-[0.9rem] leading-relaxed">
                                {locale === 'en' 
                                    ? 'Fill out your birth date, time, and location in the details form to compute and draw your Lagna Kundli chart instantly.' 
                                    : 'अपनी लग्न कुंडली की तुरंत गणना करने और देखने के लिए विवरण फ़ॉर्म में अपनी जन्म तिथि, समय और स्थान भरें।'}
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Educational Chart Guide Section */}
            <section className="mt-16 bg-white dark:bg-card-bg p-8 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-border-color animate-in fade-in duration-700">
                <h2 className="text-[1.5rem] font-bold text-primary-red mb-8 border-b border-border-color pb-3 flex items-center gap-2">
                    📖 {t.guideTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[1.15rem] font-bold text-accent-gold">
                            🔍 {t.guideReadingTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-[0.92rem] leading-relaxed">
                            {t.guideReadingText}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[1.15rem] font-bold text-accent-gold">
                            🏠 {t.guideHousesTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-[0.92rem] leading-relaxed">
                            {t.guideHousesText}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[1.15rem] font-bold text-accent-gold">
                            🪐 {t.guidePlanetsTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-[0.92rem] leading-relaxed">
                            {t.guidePlanetsText}
                        </p>
                    </div>
                </div>
            </section>
                </>
            ) : (
                <KundliMilan lang={locale} />
            )}
        </main>
    );
}

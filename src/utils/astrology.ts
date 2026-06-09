import { Observer, SearchRiseSet, Body } from 'astronomy-engine';

export interface TimeSlot {
    name: string;
    start: Date;
    end: Date;
    ruler?: string;
    type: 'auspicious' | 'inauspicious' | 'neutral';
    desc?: string;
}

// Get accurate sunrise/sunset for today and tomorrow sunrise
export function getSunTimes(date: Date, lat: number = 26.15, lon: number = 85.90) {
    const observer = new Observer(lat, lon, 0);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Anchor to today's local midnight
    const localMidnight = new Date(year, month, day, 0, 0, 0);
    
    // Convert to UTC before querying astronomy-engine
    const riseTime = SearchRiseSet(Body.Sun, observer, 1, localMidnight, 1);
    const setTime = SearchRiseSet(Body.Sun, observer, -1, localMidnight, 1);

    const tomorrowMidnight = new Date(localMidnight.getTime() + 24 * 60 * 60 * 1000);
    const nextRiseTime = SearchRiseSet(Body.Sun, observer, 1, tomorrowMidnight, 1);

    // Fallbacks if search fails
    const fallbackSunrise = new Date(year, month, day, 6, 45, 0);
    const fallbackSunset = new Date(year, month, day, 17, 20, 0);
    const fallbackNextSunrise = new Date(year, month, day + 1, 6, 45, 0);

    return {
        sunrise: riseTime?.date || fallbackSunrise,
        sunset: setTime?.date || fallbackSunset,
        nextSunrise: nextRiseTime?.date || fallbackNextSunrise
    };
}

// Choghadiya Names and Categories
const CHOGHADIYA_TYPES: Record<string, { en: string; hi: string; mai: string; type: 'auspicious' | 'inauspicious' | 'neutral' }> = {
    'Amrit': { en: 'Amrita', hi: 'अमृत', mai: 'अमृत', type: 'auspicious' },
    'Shubh': { en: 'Shubh', hi: 'शुभ', mai: 'शुभ', type: 'auspicious' },
    'Labh': { en: 'Labha', hi: 'लाभ', mai: 'लाभ', type: 'auspicious' },
    'Char': { en: 'Chara', hi: 'चर', mai: 'चर', type: 'neutral' }, // Neutral but good for movement
    'Udveg': { en: 'Udveg', hi: 'उद्वेग', mai: 'उद्वेग', type: 'inauspicious' },
    'Rog': { en: 'Rog', hi: 'रोग', mai: 'रोग', type: 'inauspicious' },
    'Kaal': { en: 'Kaala', hi: 'काल', mai: 'काल', type: 'inauspicious' }
};

const DAY_CHOGHADIYA_SEQUENCES = [
    // 0: Sunday
    ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
    // 1: Monday
    ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
    // 2: Tuesday
    ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
    // 3: Wednesday
    ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
    // 4: Thursday
    ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
    // 5: Friday
    ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
    // 6: Saturday
    ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
];

const NIGHT_CHOGHADIYA_SEQUENCES = [
    // 0: Sunday
    ['Shubh', 'Char', 'Kaal', 'Udveg', 'Amrit', 'Rog', 'Labh', 'Shubh'],
    // 1: Monday
    ['Amrit', 'Rog', 'Labh', 'Shubh', 'Char', 'Kaal', 'Udveg', 'Amrit'],
    // 2: Tuesday
    ['Char', 'Kaal', 'Udveg', 'Amrit', 'Rog', 'Labh', 'Shubh', 'Char'],
    // 3: Wednesday
    ['Rog', 'Labh', 'Shubh', 'Char', 'Kaal', 'Udveg', 'Amrit', 'Rog'],
    // 4: Thursday
    ['Kaal', 'Udveg', 'Amrit', 'Rog', 'Labh', 'Shubh', 'Char', 'Kaal'],
    // 5: Friday
    ['Labh', 'Shubh', 'Char', 'Kaal', 'Udveg', 'Amrit', 'Rog', 'Labh'],
    // 6: Saturday
    ['Udveg', 'Amrit', 'Rog', 'Labh', 'Shubh', 'Char', 'Kaal', 'Udveg']
];

export function calculateChoghadiya(date: Date, sunrise: Date, sunset: Date, nextSunrise: Date, lang: 'en' | 'hi' | 'mai'): { day: TimeSlot[]; night: TimeSlot[] } {
    const dayOfWeek = date.getDay();
    const daySeq = DAY_CHOGHADIYA_SEQUENCES[dayOfWeek];
    const nightSeq = NIGHT_CHOGHADIYA_SEQUENCES[dayOfWeek];

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const dayPart = dayDuration / 8;

    const nightDuration = nextSunrise.getTime() - sunset.getTime();
    const nightPart = nightDuration / 8;

    const daySlots: TimeSlot[] = daySeq.map((name, index) => {
        const start = new Date(sunrise.getTime() + index * dayPart);
        const end = new Date(sunrise.getTime() + (index + 1) * dayPart);
        const meta = CHOGHADIYA_TYPES[name];
        return {
            name: lang === 'en' ? meta.en : (lang === 'hi' ? meta.hi : meta.mai),
            start,
            end,
            type: meta.type
        };
    });

    const nightSlots: TimeSlot[] = nightSeq.map((name, index) => {
        const start = new Date(sunset.getTime() + index * nightPart);
        const end = new Date(sunset.getTime() + (index + 1) * nightPart);
        const meta = CHOGHADIYA_TYPES[name];
        return {
            name: lang === 'en' ? meta.en : (lang === 'hi' ? meta.hi : meta.mai),
            start,
            end,
            type: meta.type
        };
    });

    return { day: daySlots, night: nightSlots };
}

// Hora Planetary Lords
const HORA_PLANETS = [
    { nameEn: 'Sun', nameHi: 'सूर्य', nameMai: 'सूर्य', type: 'neutral' },
    { nameEn: 'Venus', nameHi: 'शुक्र', nameMai: 'शुक्र', type: 'auspicious' },
    { nameEn: 'Mercury', nameHi: 'बुध', nameMai: 'बुध', type: 'auspicious' },
    { nameEn: 'Moon', nameHi: 'चन्द्र', nameMai: 'चन्द्र', type: 'auspicious' },
    { nameEn: 'Saturn', nameHi: 'शनि', nameMai: 'शनि', type: 'inauspicious' },
    { nameEn: 'Jupiter', nameHi: 'गुरु', nameMai: 'गुरु', type: 'auspicious' },
    { nameEn: 'Mars', nameHi: 'मंगल', nameMai: 'मंगल', type: 'inauspicious' }
];

// Map weekday index to starting Hora index in HORA_PLANETS
const WEEKDAY_LORD_START_INDEX = [0, 3, 6, 2, 5, 1, 4]; // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn

export function calculateHora(date: Date, sunrise: Date, sunset: Date, nextSunrise: Date, lang: 'en' | 'hi' | 'mai'): { day: TimeSlot[]; night: TimeSlot[] } {
    const dayOfWeek = date.getDay();
    const startIndex = WEEKDAY_LORD_START_INDEX[dayOfWeek];

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const dayPart = dayDuration / 12;

    const nightDuration = nextSunrise.getTime() - sunset.getTime();
    const nightPart = nightDuration / 12;

    const daySlots: TimeSlot[] = [];
    for (let i = 0; i < 12; i++) {
        const start = new Date(sunrise.getTime() + i * dayPart);
        const end = new Date(sunrise.getTime() + (i + 1) * dayPart);
        const planetIdx = (startIndex + i) % 7;
        const planet = HORA_PLANETS[planetIdx];
        daySlots.push({
            name: `${i + 1}`,
            start,
            end,
            ruler: lang === 'en' ? planet.nameEn : (lang === 'hi' ? planet.nameHi : planet.nameMai),
            type: planet.type as 'auspicious' | 'inauspicious' | 'neutral'
        });
    }

    const nightSlots: TimeSlot[] = [];
    // Night starts after 12 Day Horas
    const nightStartIndex = (startIndex + 12) % 7;
    for (let i = 0; i < 12; i++) {
        const start = new Date(sunset.getTime() + i * nightPart);
        const end = new Date(sunset.getTime() + (i + 1) * nightPart);
        const planetIdx = (nightStartIndex + i) % 7;
        const planet = HORA_PLANETS[planetIdx];
        nightSlots.push({
            name: `${i + 1}`,
            start,
            end,
            ruler: lang === 'en' ? planet.nameEn : (lang === 'hi' ? planet.nameHi : planet.nameMai),
            type: planet.type as 'auspicious' | 'inauspicious' | 'neutral'
        });
    }

    return { day: daySlots, night: nightSlots };
}

// Tarabala Calculation
export function getTarabala(birthNakshatraIdx: number, transitNakshatraIdx: number, lang: 'en' | 'hi' | 'mai') {
    // 1-based distance from birth to transit
    const dist = (transitNakshatraIdx - birthNakshatraIdx + 27) % 27 + 1;
    const categoryNum = dist % 9 === 0 ? 9 : dist % 9;

    const tarabalaData: Record<number, { 
        name: { en: string; hi: string; mai: string }; 
        desc: { en: string; hi: string; mai: string };
        status: 'auspicious' | 'inauspicious' | 'neutral' 
    }> = {
        1: {
            name: { en: 'Janma', hi: 'जन्म', mai: 'जन्म' },
            desc: { 
                en: 'Indicates physical health. Average energy, moderate caution recommended.', 
                hi: 'शारीरिक स्वास्थ्य को दर्शाता है। सामान्य ऊर्जा, थोड़ा सावधान रहें।', 
                mai: 'शारीरिक स्वास्थ्य कऽ देखबैत अछि। सामान्य ऊर्जा, कनेक सावधान रहू।' 
            },
            status: 'neutral'
        },
        2: {
            name: { en: 'Sampat', hi: 'सम्पत', mai: 'सम्पत' },
            desc: { 
                en: 'Wealth and prosperity. Highly auspicious for starting financial activities.', 
                hi: 'धन और समृद्धि लाता है। वित्तीय कार्यों के लिए अत्यधिक शुभ।', 
                mai: 'धन आ समृद्धि अनैत अछि। वित्तीय काज सभक लेल अत्यधिक शुभ।' 
            },
            status: 'auspicious'
        },
        3: {
            name: { en: 'Vipat', hi: 'विपत', mai: 'विपत' },
            desc: { 
                en: 'Losses and obstacles. Avoid starting any important work.', 
                hi: 'हानि और बाधाएं। कोई भी महत्वपूर्ण कार्य शुरू करने से बचें।', 
                mai: 'हानि आ बाधा सभ। कोनो महत्वपूर्ण काज शुरू करबा सँ बचू।' 
            },
            status: 'inauspicious'
        },
        4: {
            name: { en: 'Kshema', hi: 'क्षेम', mai: 'क्षेम' },
            desc: { 
                en: 'Comfort, safety, and well-being. Good for family events.', 
                hi: 'सुख, सुरक्षा और कल्याण। पारिवारिक उत्सवों के लिए उत्तम।', 
                mai: 'सुख, सुरक्षा आ कल्याण। पारिवारिक उत्सव सभक लेल उत्तम।' 
            },
            status: 'auspicious'
        },
        5: {
            name: { en: 'Pratyari', hi: 'प्रत्यरि', mai: 'प्रत्यरि' },
            desc: { 
                en: 'Obstacles and opposition from enemies. Be careful of disputes.', 
                hi: 'बाधाएं और विरोध। विवादों से सावधान रहें।', 
                mai: 'बाधा आ विरोध। विवाद सभ सँ सावधान रहू।' 
            },
            status: 'inauspicious'
        },
        6: {
            name: { en: 'Sadhaka', hi: 'साधक', mai: 'साधक' },
            desc: { 
                en: 'Success and achievements. Highly auspicious for execution of goals.', 
                hi: 'सफलता और सिद्धियां। कार्यों को पूर्ण करने के लिए सर्वश्रेष्ठ।', 
                mai: 'सफलता आ सिद्धि सभ। काज सभ कें पूरा करबाक लेल सर्वश्रेष्ठ।' 
            },
            status: 'auspicious'
        },
        7: {
            name: { en: 'Vadha', hi: 'वध', mai: 'वध' },
            desc: { 
                en: 'Extremely critical. Danger of accidents or major failures. Avoid all major actions.', 
                hi: 'अत्यंत प्रतिकूल। दुर्घटना या बड़ी असफलता का डर। महत्वपूर्ण कार्यों को पूरी तरह टालें।', 
                mai: 'अत्यंत प्रतिकूल। दुर्घटना वा बड़का असफलताक भय। महत्वपूर्ण काज सभ कें पूर्ण रूप सँ टालू।' 
            },
            status: 'inauspicious'
        },
        8: {
            name: { en: 'Mitra', hi: 'मित्र', mai: 'मित्र' },
            desc: { 
                en: 'Friendly relations, comfort and support. Auspicious.', 
                hi: 'मैत्रीपूर्ण संबंध, सुख और सहयोग। शुभ दिन।', 
                mai: 'मैत्रीपूर्ण संबंध, सुख आ सहयोग। शुभ दिन।' 
            },
            status: 'auspicious'
        },
        9: {
            name: { en: 'Atimitra', hi: 'अतिमित्र', mai: 'अतिमित्र' },
            desc: { 
                en: 'Deeply auspicious day. Exceptional support, highly favorable.', 
                hi: 'परम मित्र और अत्यधिक अनुकूल। कार्यों के लिए अत्यंत उत्तम दिन।', 
                mai: 'परम मित्र आ अत्यधिक अनुकूल। काज सभक लेल अत्यंत उत्तम दिन।' 
            },
            status: 'auspicious'
        }
    };

    const entry = tarabalaData[categoryNum];
    return {
        name: entry.name[lang],
        desc: entry.desc[lang],
        status: entry.status
    };
}

// Chandrabala Calculation
export function getChandrabala(birthRashiIdx: number, transitRashiIdx: number, lang: 'en' | 'hi' | 'mai') {
    // 1-based distance from birth Rashi to transit Moon Rashi
    const dist = (transitRashiIdx - birthRashiIdx + 12) % 12 + 1;

    // Strong houses: 1, 3, 6, 7, 10, 11
    // Weak houses: 4, 8, 12
    // Neutral/Caution houses: 2, 5, 9
    let status: 'auspicious' | 'inauspicious' | 'neutral' = 'neutral';
    let label = { en: 'Neutral', hi: 'सामान्य', mai: 'सामान्य' };
    let desc = {
        en: 'Fair strength. Exercising caution is advised.',
        hi: 'सामान्य प्रभाव। कार्य करते समय थोड़ा ध्यान रखें।',
        mai: 'सामान्य प्रभाव। काज करैत काल कनेक ध्यान राखू।'
    };

    if ([1, 3, 6, 7, 10, 11].includes(dist)) {
        status = 'auspicious';
        label = { en: 'Auspicious', hi: 'शुभ और बली', mai: 'शुभ आ बली' };
        desc = {
            en: 'The Moon is strong and favorable. Highly auspicious for starting activities.',
            hi: 'चन्द्रमा अनुकूल और बली है। नए कार्यों को शुरू करने के लिए अत्यंत शुभ।',
            mai: 'चन्द्रमा अनुकूल आ बली अछि। नवीन काज सभ कें शुरू करबाक लेल अत्यंत शुभ।'
        };
    } else if ([4, 8, 12].includes(dist)) {
        status = 'inauspicious';
        label = { en: 'Inauspicious', hi: 'प्रतिकूल / कमजोर', mai: 'प्रतिकूल / कमजोर' };
        desc = {
            en: 'The Moon is weak. Risk of mental distress, delays, or physical fatigue. Avoid major decisions.',
            hi: 'चन्द्रमा कमजोर है। मानसिक तनाव, कार्यों में देरी या थकान हो सकती है। महत्वपूर्ण निर्णयों से बचें।',
            mai: 'चन्द्रमा कमजोर अछि। मानसिक तनाव, काज सभ में देरी वा थकान भऽ सकैत अछि। महत्वपूर्ण निर्णय सभ सँ बचू।'
        };
    }

    return {
        houseNum: dist,
        name: label[lang],
        desc: desc[lang],
        status
    };
}

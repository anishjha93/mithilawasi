type Locale = 'en' | 'hi' | 'mai';

interface PanchangData {
    tithi: string;
    tithiValue: string;
    nakshatra: string;
    nakshatraValue: string;
    yog: string;
    yogValue: string;
    karan: string;
    karanValue: string;
    paksha: string;
    pakshaValue: string;
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    sunRashi?: string;
    moonRashi?: string;
    abhijitMuhurta?: string;
    sunriseTimeISO?: string;
}


import panchangDataRaw from '../data/panchang_2026.json';
import { Observer, SearchRiseSet, SunPosition, EclipticGeoMoon, Body } from 'astronomy-engine';

const panchangDataJson = panchangDataRaw as Record<string, { tithi: string; tithi_start_time: string; tithi_end_time: string; next_tithi: string }>;

export function getTodaysPanchang(date: Date, lang: Locale): PanchangData {
    // Tithis (30 lunar days)
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'];
    const tithisMai = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावास्या'];

    // Nakshatras (27 lunar mansions)
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const nakshatrasMai = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'];

    // Yogas (27 Nithya Yogas)
    const yogas = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    const yogasMai = ['विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'];

    // Karanas (11 Karanas)
    const karans = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    const karansMai = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गरिज', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'];

    // Reference: Jan 1, 2026 was Tithi Index 12 (Trayodashi) and Nakshatra Index 3 (Rohini)
    const referenceDate = new Date('2026-01-01');
    const diffTime = date.getTime() - referenceDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Accurate Data Lookup
    const dateKey = date.toISOString().split('T')[0];
    const accurateData = panchangDataJson[dateKey];

    // Astronomy Engine calculations for Darbhanga, Mithila (26.15 N, 85.90 E)
    const observer = new Observer(26.15, 85.90, 0);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    // Create target date IST Midnight to anchor Sunrise/Sunset search correctly
    const istMidnight = new Date(Date.UTC(year, month, day, 0, 0, 0));
    istMidnight.setTime(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);

    const riseTime = SearchRiseSet(Body.Sun, observer, 1, istMidnight, 1);
    const setTime = SearchRiseSet(Body.Sun, observer, -1, istMidnight, 1);
    const moonriseTime = SearchRiseSet(Body.Moon, observer, 1, istMidnight, 1);
    const moonsetTime = SearchRiseSet(Body.Moon, observer, -1, istMidnight, 1);

    const formatTimeIST = (d: Date | null | undefined): string => {
        if (!d) return '--:--';
        try {
            return d.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            const localMs = d.getTime() + 5.5 * 60 * 60 * 1000;
            const localDate = new Date(localMs);
            const hour = localDate.getUTCHours();
            const min = localDate.getUTCMinutes();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${String(displayHour).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`;
        }
    };

    const getSiderealRashi = (long: number, language: Locale): string => {
        const rashisEn = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
        const rashisMai = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
        const activeList = language === 'mai' || language === 'hi' ? rashisMai : rashisEn;
        
        const ayanamsha = 24.16;
        const siderealLong = (long - ayanamsha + 360) % 360;
        const index = Math.floor(siderealLong / 30);
        
        if (language === 'mai' || language === 'hi') {
            return activeList[index];
        } else {
            return `${rashisEn[index]} (${rashisMai[index]})`;
        }
    };

    const sunLong = SunPosition(date).elon;
    const moonLong = EclipticGeoMoon(date).lon;

    const sunRashi = getSiderealRashi(sunLong, lang);
    const moonRashi = getSiderealRashi(moonLong, lang);

    let abhijitMuhurta = '--:--';
    if (riseTime && setTime) {
        const sunriseMs = riseTime.date.getTime();
        const sunsetMs = setTime.date.getTime();
        const daytimeMs = sunsetMs - sunriseMs;
        const oneMuhurtaMs = daytimeMs / 15;
        const abhijitStart = new Date(sunriseMs + 7 * oneMuhurtaMs);
        const abhijitEnd = new Date(sunriseMs + 8 * oneMuhurtaMs);
        abhijitMuhurta = `${formatTimeIST(abhijitStart)} - ${formatTimeIST(abhijitEnd)}`;
    }

    // Calculate indices
    const tithiIndex = (12 + diffDays) % 30;
    const rawNormalizedTithiIndex = tithiIndex < 0 ? tithiIndex + 30 : tithiIndex;
    
    let normalizedTithiIndex = rawNormalizedTithiIndex;

    // Correct tithiIndex using accurate data if available
    if (accurateData && accurateData.tithi) {
        const matchingIndices: number[] = [];
        tithis.forEach((t, idx) => {
            if (t.toLowerCase() === accurateData.tithi.toLowerCase()) {
                matchingIndices.push(idx);
            }
        });

        if (matchingIndices.length > 0) {
            if (matchingIndices.length === 1) {
                normalizedTithiIndex = matchingIndices[0];
            } else {
                // Find index closest to our mathematical estimation (considering wrap-around)
                let bestIdx = matchingIndices[0];
                let minDiff = 30;
                for (const idx of matchingIndices) {
                    const diff = Math.min(
                        Math.abs(idx - rawNormalizedTithiIndex),
                        30 - Math.abs(idx - rawNormalizedTithiIndex)
                    );
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestIdx = idx;
                    }
                }
                normalizedTithiIndex = bestIdx;
            }
        }
    }

    // Accurate Nakshatra index calculation
    const siderealMoonLong = (moonLong - 24.16 + 360) % 360;
    const normalizedNakshatraIndex = Math.floor(siderealMoonLong / 13.333333333333334);

    const yogIndex = (normalizedNakshatraIndex + normalizedTithiIndex) % 27;
    const karanIndex = (normalizedTithiIndex * 2) % 11;

    const normalizedNakshatraIndexSafe = normalizedNakshatraIndex < 0 ? normalizedNakshatraIndex + 27 : normalizedNakshatraIndex;

    // Determine Paksha
    const paksha = normalizedTithiIndex < 15 ? 'Shukla' : 'Krishna';
    const pakshaValue = normalizedTithiIndex < 15 ?
        (lang === 'mai' ? 'शुक्ल पक्ष' : (lang === 'hi' ? 'शुक्ल पक्ष' : 'Shukla (Waxing)')) :
        (lang === 'mai' ? 'कृष्ण पक्ष' : (lang === 'hi' ? 'कृष्ण पक्ष' : 'Krishna (Waning)'));

    let tithiValue = lang === 'mai' ? tithisMai[normalizedTithiIndex] : `${tithis[normalizedTithiIndex]} (${tithisMai[normalizedTithiIndex]})`;

    // Append timing if available
    let timingString = '';
    if (accurateData && accurateData.tithi_end_time) {
        if (lang === 'en') {
            timingString = ` (From ${accurateData.tithi_start_time || '?'} to ${accurateData.tithi_end_time})`;
        } else {
            // Simple transliteration
            timingString = ` (${accurateData.tithi_start_time || '?'} - ${accurateData.tithi_end_time})`;
        }
        tithiValue += timingString;
    }

    return {
        tithi: lang === 'mai' ? 'तिथि' : 'Tithi',
        tithiValue,
        nakshatra: lang === 'mai' ? 'नक्षत्र' : 'Nakshatra',
        nakshatraValue: lang === 'mai' ? nakshatrasMai[normalizedNakshatraIndexSafe] : `${nakshatras[normalizedNakshatraIndexSafe]} (${nakshatrasMai[normalizedNakshatraIndexSafe]})`,
        yog: lang === 'mai' ? 'योग' : 'Yog',
        yogValue: lang === 'mai' ? yogasMai[yogIndex] : `${yogas[yogIndex]} (${yogasMai[yogIndex]})`,
        karan: lang === 'mai' ? 'करण' : 'Karan',
        karanValue: lang === 'mai' ? karansMai[karanIndex] : `${karans[karanIndex]} (${karansMai[karanIndex]})`,
        paksha: lang === 'mai' ? 'पक्ष' : 'Paksha',
        pakshaValue,
        sunrise: formatTimeIST(riseTime?.date),
        sunset: formatTimeIST(setTime?.date),
        moonrise: formatTimeIST(moonriseTime?.date),
        moonset: formatTimeIST(moonsetTime?.date),
        sunRashi,
        moonRashi,
        abhijitMuhurta,
        sunriseTimeISO: riseTime?.date.toISOString()
    };
}

export function getHinduMonth(date: Date | string): { index: number; isAdhik: boolean } {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

    // index: 0 = Baishakh, 1 = Jyeshtha, 2 = Ashadha, 3 = Shravana, 4 = Bhadra, 5 = Ashvina,
    // 6 = Kartika, 7 = Margashirsha, 8 = Pausha, 9 = Magha, 10 = Phalguna, 11 = Chaitra.

    // 2026 Month Boundaries (inclusive ranges, using UTC ISO date string comparison)
    if (dateStr.startsWith('2026-')) {
        if (dateStr <= '2026-01-03') return { index: 8, isAdhik: false }; // Pausha
        if (dateStr <= '2026-02-01') return { index: 9, isAdhik: false }; // Magha
        if (dateStr <= '2026-03-03') return { index: 10, isAdhik: false }; // Phalguna
        if (dateStr <= '2026-04-02') return { index: 11, isAdhik: false }; // Chaitra
        if (dateStr <= '2026-05-01') return { index: 0, isAdhik: false }; // Baishakh

        // Jyeshtha (Adhik/Malmas is from May 17 to June 15)
        if (dateStr <= '2026-05-16') return { index: 1, isAdhik: false }; // Jyeshtha (Shuddha Krishna)
        if (dateStr <= '2026-06-15') return { index: 1, isAdhik: true };  // Jyeshtha (Adhik/Malmas)
        if (dateStr <= '2026-06-29') return { index: 1, isAdhik: false }; // Jyeshtha (Shuddha Shukla)

        if (dateStr <= '2026-07-29') return { index: 2, isAdhik: false }; // Ashadha
        if (dateStr <= '2026-08-27') return { index: 3, isAdhik: false }; // Shravana
        if (dateStr <= '2026-09-26') return { index: 4, isAdhik: false }; // Bhadra
        if (dateStr <= '2026-10-25') return { index: 5, isAdhik: false }; // Ashvina
        if (dateStr <= '2026-11-24') return { index: 6, isAdhik: false }; // Kartika
        if (dateStr <= '2026-12-23') return { index: 7, isAdhik: false }; // Margashirsha
        return { index: 8, isAdhik: false }; // Pausha (starts on 2026-12-24)
    }

    // 2027 Month Boundaries (inclusive ranges)
    if (dateStr.startsWith('2027-')) {
        if (dateStr <= '2027-01-22') return { index: 8, isAdhik: false }; // Pausha
        if (dateStr <= '2027-02-20') return { index: 9, isAdhik: false }; // Magha
        if (dateStr <= '2027-03-22') return { index: 10, isAdhik: false }; // Phalguna
        if (dateStr <= '2027-04-20') return { index: 11, isAdhik: false }; // Chaitra
        if (dateStr <= '2027-05-20') return { index: 0, isAdhik: false }; // Baishakh
        if (dateStr <= '2027-06-18') return { index: 1, isAdhik: false }; // Jyeshtha
        if (dateStr <= '2027-07-18') return { index: 2, isAdhik: false }; // Ashadha
        if (dateStr <= '2027-08-17') return { index: 3, isAdhik: false }; // Shravana
        if (dateStr <= '2027-09-15') return { index: 4, isAdhik: false }; // Bhadra
        if (dateStr <= '2027-10-15') return { index: 5, isAdhik: false }; // Ashvina
        if (dateStr <= '2027-11-14') return { index: 6, isAdhik: false }; // Kartika
        if (dateStr <= '2027-12-13') return { index: 7, isAdhik: false }; // Margashirsha
        return { index: 8, isAdhik: false }; // Pausha (starts on 2027-12-14)
    }

    // Fallback for dates outside 2026-2027
    const refDate = new Date('2026-01-01');
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffTime = targetDate.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const daysFromMaghaStart = diffDays - 3;
    const monthsElapsed = Math.floor(daysFromMaghaStart / 29.53059);
    let index = (9 + monthsElapsed) % 12;
    if (index < 0) index += 12;
    return { index, isAdhik: false };
}

export interface VratItem {
    date: string;
    name: string;
    desc: string;
    slug?: string;
}

export function getVratsForYear(year: number, lang: Locale): VratItem[] {
    const vrats: VratItem[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthNamesEn = [
        'Baishakh', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina',
        'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna', 'Chaitra'
    ];
    const monthNamesMai = [
        'बैशाख', 'जेठ', 'आषाढ़', 'साओन', 'भादव', 'आसिन',
        'कार्तिक', 'अगहन', 'पूस', 'माघ', 'फागुन', 'चैत'
    ];
    const monthNamesHi = [
        'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'अश्विन',
        'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
    ];
    
    const activeMonths = lang === 'mai' ? monthNamesMai : (lang === 'hi' ? monthNamesHi : monthNamesEn);

    // Loop through each day of the year (safe iteration to avoid mutating original objects)
    const currentIterDate = new Date(startDate);
    while (currentIterDate <= endDate) {
        const dateStr = currentIterDate.toISOString().split('T')[0];
        
        const refDate = new Date('2026-01-01');
        const diffTime = currentIterDate.getTime() - refDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const tithiIndex = (12 + diffDays) % 30;
        const normalizedTithiIndex = tithiIndex < 0 ? tithiIndex + 30 : tithiIndex;

        const { index: monthIdx, isAdhik } = getHinduMonth(dateStr);
        let monthName = activeMonths[monthIdx];
        if (isAdhik) {
            monthName += lang === 'en' ? ' (Adhik)' : ' (अधिक)';
        }

        // 1. Ekadashi (Tithi Index 10 and 25)
        if (normalizedTithiIndex === 10) {
            const name = lang === 'en' ? `${monthName} Shukla Ekadashi` : `${monthName} शुक्ल एकादशी`;
            const desc = lang === 'en' ? 'Auspicious Ekadashi fasting for Lord Vishnu.' : 'भगवान विष्णु की कृपा हेतु महत्वपूर्ण एकादशी व्रत।';
            vrats.push({ date: dateStr, name, desc });
        } else if (normalizedTithiIndex === 25) {
            const name = lang === 'en' ? `${monthName} Krishna Ekadashi` : `${monthName} कृष्ण एकादशी`;
            const desc = lang === 'en' ? 'Auspicious Ekadashi fasting for Lord Vishnu.' : 'भगवान विष्णु की कृपा हेतु महत्वपूर्ण एकादशी व्रत।';
            vrats.push({ date: dateStr, name, desc });
        }
        
        // 2. Pradosh (Tithi Index 12 and 27)
        if (normalizedTithiIndex === 12) {
            const name = lang === 'en' ? `${monthName} Shukla Pradosh Vrat` : `${monthName} शुक्ल प्रदोष व्रत`;
            const desc = lang === 'en' ? 'Evening worship of Lord Shiva.' : 'भगवान शिव की संध्या कालीन आराधना हेतु प्रदोष व्रत।';
            vrats.push({ date: dateStr, name, desc });
        } else if (normalizedTithiIndex === 27) {
            const name = lang === 'en' ? `${monthName} Krishna Pradosh Vrat` : `${monthName} कृष्ण प्रदोष व्रत`;
            const desc = lang === 'en' ? 'Evening worship of Lord Shiva.' : 'भगवान शिव की संध्या कालीन आराधना हेतु प्रदोष व्रत।';
            vrats.push({ date: dateStr, name, desc });
        }

        // 3. Sankashti Chaturthi (Tithi Index 18)
        if (normalizedTithiIndex === 18) {
            const name = lang === 'en' ? `${monthName} Sankashti Chaturthi` : `${monthName} संकष्टी चतुर्थी`;
            const desc = lang === 'en' ? 'Fasting and moon worship for Lord Ganesha.' : 'भगवान गणेश की कृपा और संकट निवारण हेतु व्रत।';
            vrats.push({ date: dateStr, name, desc });
        }

        // 4. Satyanarayan Vrat / Purnima (Tithi Index 14)
        if (normalizedTithiIndex === 14) {
            const name = lang === 'en' ? `${monthName} Purnima (Satyanarayan Vrat)` : `${monthName} पूर्णिमा (सत्यनारायण व्रत)`;
            const desc = lang === 'en' ? 'Satyanarayan Vrat and bathing rituals.' : 'सत्यनारायण व्रत कथा और पवित्र स्नान अनुष्ठान।';
            vrats.push({ date: dateStr, name, desc });
        }

        currentIterDate.setDate(currentIterDate.getDate() + 1);
    }

    return vrats;
}


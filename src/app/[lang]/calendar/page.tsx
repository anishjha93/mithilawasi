import { getDictionary } from '@/get-dictionary';
import { getTodaysPanchang, getHinduMonth, getVratsForYear } from '@/utils/panchang';
import PanchangCard from '@/components/PanchangCard';
import PanchangNavigator from '@/components/PanchangNavigator';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EclipticGeoMoon } from 'astronomy-engine';
import MuhuratTables from '@/components/MuhuratTables';
import PersonalAuspiciousness from '@/components/PersonalAuspiciousness';

const MuhuratTabs = dynamic(() => import('@/components/MuhuratTabs'), {
    loading: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
});

import Link from 'next/link';
import type { Metadata } from 'next';

// ... (existing metadata)

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/calendar`;

    const keywordsMap = {
        en: [
            'Mithila Panchang', 'Maithili Calendar 2026', 'Vedic Panchangam',
            'Auspicious wedding dates', 'Shubh Muhurat', 'Lagan dates', 'Mundan dates',
            'Choghadiya today', 'Rahu Kaal today', 'Hora today', 'auspicious time slots'
        ],
        hi: [
            'मिथिला पंचांग', 'मैथिली कैलेंडर २०२६', 'वैदिक पंचांग',
            'विवाह मुहूर्त', 'शुभ मुहूर्त', 'लगन तिथियां', 'मुंडन मुहूर्त',
            'आज का चोघड़िया', 'राहु काल आज', 'होरा', 'शुभ समय'
        ],
        mai: [
            'मिथिला पंचांग', 'मैथिली कैलेंडर २०२६', 'वैदिक पंचांग',
            'विवाह मुहूर्त', 'शुभ मुहूर्त', 'लगन तिथि', 'मुंडन मुहूर्त',
            'आजुक चोघड़िया', 'राहु काल आज', 'होरा', 'शुभ समय'
        ]
    };

    return {
        title: dict.calendarPage.title,
        description: dict.calendarPage.lead,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/calendar`,
                'hi-IN': `${baseUrl}/hi/calendar`,
                'mai-IN': `${baseUrl}/mai/calendar`,
                'x-default': `${baseUrl}/en/calendar`,
            },
        },
        keywords: keywordsMap[lang] || keywordsMap.en,
    };
}

export default async function CalendarPage({
    params,
    searchParams
}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ date?: string }>
}) {
    const resolvedParams = await Promise.resolve(params);
    const resolvedSearch = await Promise.resolve(searchParams);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const calendarPage = dict.calendarPage as any;

    const selectedDateStr = resolvedSearch.date || new Date().toISOString().split('T')[0];
    const selectedDate = new Date(selectedDateStr);

    // Accurate 2026 Sync Logic
    const refDate = new Date('2026-01-01');
    const diffTime = selectedDate.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const tithis = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ];
    const tithisMai = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावास्या'
    ];

    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const nakshatrasMai = ['अश्विनी', 'भरणी', 'कृतिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'];

    const purnimaDatesList = [
        '2026-01-03', '2026-02-01', '2026-03-03', '2026-04-02', '2026-05-01', '2026-05-31', '2026-06-29', '2026-07-29', '2026-08-27', '2026-09-26', '2026-10-25', '2026-11-24', '2026-12-23',
        '2027-01-22', '2027-02-20', '2027-03-22', '2027-04-20', '2027-05-20', '2027-06-18', '2027-07-18', '2027-08-17', '2027-09-15', '2027-10-15', '2027-11-14', '2027-12-13'
    ];

    // Accurate Data Lookup
    const accurateData = require('@/data/panchang_2026.json')[selectedDateStr] as { tithi: string, tithi_start_time: string, tithi_end_time: string, next_tithi: string } | undefined;

    const tithiIndex = (12 + diffDays) % 30;
    const rawNormalizedTithiIndex = tithiIndex < 0 ? tithiIndex + 30 : tithiIndex;
    
    let normalizedTithiIndex = rawNormalizedTithiIndex;

    // Correct normalizedTithiIndex using accurate data if available
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

    const nakshatraIndex = (3 + diffDays) % 27;
    const normalizedNakshatraIndex = nakshatraIndex < 0 ? nakshatraIndex + 27 : nakshatraIndex;

    const selectedYear = selectedDate.getFullYear();
    const isYear2027 = selectedYear === 2027;

    const isPurnima = purnimaDatesList.includes(selectedDateStr);
    const isAmavasya = normalizedTithiIndex === 29;

    const laganList = isYear2027 ? calendarPage.lagan2027.list : calendarPage.lagan2026.list;
    const mundanList = isYear2027 ? calendarPage.mundan2027.list : calendarPage.mundan2026.list;
    const upnayanList = isYear2027 ? calendarPage.upnayan2027.list : calendarPage.upnayan2026.list;
    const duragamanList = isYear2027 ? calendarPage.duragaman2027.list : calendarPage.duragaman2026.list;

    const isLagan = laganList.some((item: any) => item.date === selectedDateStr);
    const isMundan = mundanList.some((item: any) => item.date === selectedDateStr);
    const isUpnayan = upnayanList.some((item: any) => item.date === selectedDateStr);
    const isDuragaman = duragamanList.some((item: any) => item.date === selectedDateStr);

    const isPanchak = normalizedNakshatraIndex >= 22;

    const sankrantiDates: Record<string, string> = {
        '2026-01-14': 'Til (Makar) Sankranti', '2026-02-13': 'Kumbha Sankranti', '2026-03-15': 'Meena Sankranti',
        '2026-04-14': 'Mesha (New Year) Sankranti', '2026-05-15': 'Vrishabha Sankranti', '2026-06-15': 'Mithuna Sankranti',
        '2026-07-16': 'Karka Sankranti', '2026-08-17': 'Simha Sankranti', '2026-09-17': 'Kanya Sankranti',
        '2026-10-17': 'Tula Sankranti', '2026-11-16': 'Vrishchika Sankranti', '2026-12-16': 'Dhanu Sankranti',
        '2027-01-14': 'Til (Makar) Sankranti', '2027-02-13': 'Kumbha Sankranti', '2027-03-15': 'Meena Sankranti',
        '2027-04-14': 'Mesha (New Year) Sankranti', '2027-05-15': 'Vrishabha Sankranti', '2027-06-15': 'Mithuna Sankranti',
        '2027-07-16': 'Karka Sankranti', '2027-08-17': 'Simha Sankranti', '2027-09-17': 'Kanya Sankranti',
        '2027-10-17': 'Tula Sankranti', '2027-11-16': 'Vrishchika Sankranti', '2027-12-16': 'Dhanu Sankranti'
    };
    const sankrantiName = sankrantiDates[selectedDateStr] || null;

    const yogas = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    const yogasMai = ['विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'];
    const yogIndex = (normalizedNakshatraIndex + normalizedTithiIndex) % 27;
    const yogValue = lang === 'mai' ? yogasMai[yogIndex] : `${yogas[yogIndex]} (${yogasMai[yogIndex]})`;

    const karans = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    const karansMai = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गरिज', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'];
    const karanIndex = (normalizedTithiIndex * 2) % 11;
    const karanValue = lang === 'mai' ? karansMai[karanIndex] : `${karans[karanIndex]} (${karansMai[karanIndex]})`;

    const calculateKaal = (segmentNumber: number): string => {
        const sunriseInMinutes = 6 * 60 + 45;
        const sunsetInMinutes = 17 * 60 + 20;
        const dayDurationMinutes = sunsetInMinutes - sunriseInMinutes;
        const segmentDuration = dayDurationMinutes / 8;
        const segmentStartMinutes = sunriseInMinutes + (segmentNumber - 1) * segmentDuration;
        const segmentEndMinutes = segmentStartMinutes + segmentDuration;

        const formatTime = (totalMinutes: number) => {
            const h = Math.floor(totalMinutes / 60);
            const m = Math.floor(totalMinutes % 60);
            const p = h >= 12 ? 'PM' : 'AM';
            const dh = h > 12 ? h - 12 : (h === 0 ? 12 : h);
            return `${dh}:${m.toString().padStart(2, '0')} ${p}`;
        };
        return `${formatTime(segmentStartMinutes)} - ${formatTime(segmentEndMinutes)}`;
    };

    const dayOfWeek = selectedDate.getDay();
    const rahuKaalValue = calculateKaal([8, 2, 7, 5, 6, 4, 3][dayOfWeek]);
    const yamagandaKaalValue = calculateKaal([6, 5, 4, 3, 2, 1, 7][dayOfWeek]);
    const gulikaKaalValue = calculateKaal([1, 7, 6, 5, 4, 3, 2][dayOfWeek]);

    const { index: monthIndex, isAdhik } = getHinduMonth(selectedDateStr);
    let monthValue = calendarPage.months[monthIndex].name;
    if (isAdhik) {
        if (lang === 'mai') {
            monthValue = `${monthValue} (मलमास)`;
        } else if (lang === 'hi') {
            monthValue = `${monthValue} (मलमास)`;
        } else {
            monthValue = `${monthValue} (Adhik / Malmas)`;
        }
    }

    const todaysPanchang = getTodaysPanchang(selectedDate, lang);

    const panchangData = {
        title: calendarPage.dailyPanchang.title,
        dateStr: selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : 'mai-IN'), {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }),
        month: calendarPage.dailyPanchang.month,
        monthValue,
        tithi: calendarPage.dailyPanchang.tithi,
        tithiValue: todaysPanchang.tithiValue,
        nakshatra: calendarPage.dailyPanchang.nakshatra,
        nakshatraValue: todaysPanchang.nakshatraValue,
        paksha: calendarPage.dailyPanchang.paksha,
        pakshaValue: todaysPanchang.pakshaValue,
        sunrise: calendarPage.dailyPanchang.sunrise, sunriseValue: todaysPanchang.sunrise || '06:45 AM',
        sunset: calendarPage.dailyPanchang.sunset, sunsetValue: todaysPanchang.sunset || '05:20 PM',
        moonrise: todaysPanchang.moonrise,
        moonset: todaysPanchang.moonset,
        sunRashi: todaysPanchang.sunRashi,
        moonRashi: todaysPanchang.moonRashi,
        abhijitMuhurta: todaysPanchang.abhijitMuhurta,
        isPanchak, panchakLabel: calendarPage.dailyPanchang.panchak,
        isPurnima, purnimaLabel: calendarPage.dailyPanchang.purnima,
        isAmavasya, amavasyaLabel: calendarPage.dailyPanchang.amavasya,
        isLagan, laganLabel: isYear2027 ? calendarPage.lagan2027.label : calendarPage.lagan2026.label,
        isMundan, mundanLabel: isYear2027 ? calendarPage.mundan2027.label : calendarPage.mundan2026.label,
        isUpnayan, upnayanLabel: isYear2027 ? calendarPage.upnayan2027.label : calendarPage.upnayan2026.label,
        isDuragaman, duragamanLabel: isYear2027 ? calendarPage.duragaman2027.label : calendarPage.duragaman2026.label,
        sankrantiName, sankrantiLabel: calendarPage.dailyPanchang.sankranti,
        yog: calendarPage.dailyPanchang.yog, yogValue: todaysPanchang.yogValue,
        karan: calendarPage.dailyPanchang.karan, karanValue: todaysPanchang.karanValue,
        rahuKaal: calendarPage.dailyPanchang.rahuKaal, rahuKaalValue,
        yamagandaKaal: calendarPage.dailyPanchang.yamagandaKaal, yamagandaKaalValue,
        gulikaKaal: calendarPage.dailyPanchang.gulikaKaal, gulikaKaalValue,
        inauspiciousTimings: calendarPage.dailyPanchang.inauspiciousTimings
    };

    // Calculate transit Moon Rashi for Tarabala/Chandrabala widget
    const moonLong = EclipticGeoMoon(selectedDate).lon;
    const ayanamsha = 24.16;
    const siderealMoonLong = (moonLong - ayanamsha + 360) % 360;
    const transitRashiIdx = Math.floor(siderealMoonLong / 30);

    return (
        <div className="max-w-[1280px] mx-auto px-4 py-12">
            <header className="text-center mb-16">
                <h1 className="text-[3rem] font-bold text-primary-red">{calendarPage.title}</h1>
                <p className="text-[1.25rem] text-gray-800 max-w-[800px] mx-auto mt-6 leading-relaxed">{calendarPage.lead}</p>
            </header>

            <section className="mb-12">
                <PanchangNavigator currentDate={selectedDateStr} />
                <PanchangCard data={panchangData} />

                {/* Personal Daily Auspiciousness Checker Widget */}
                <PersonalAuspiciousness 
                    transitRashiIdx={transitRashiIdx}
                    transitNakshatraIdx={normalizedNakshatraIndex}
                    lang={lang}
                />

                {/* Muhurat tables for Choghadiya, Hora, and Kaal timings */}
                <MuhuratTables 
                    date={selectedDate}
                    lang={lang}
                    rahuKaal={rahuKaalValue}
                    yamagandaKaal={yamagandaKaalValue}
                    gulikaKaal={gulikaKaalValue}
                />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-card-bg p-6 border border-border-color shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-lg">
                    <h2 className="text-[1.5rem] font-bold text-primary-red mb-4">{calendarPage.monthsTitle}</h2>
                    <ul className="list-none mt-6">
                        {calendarPage.months.map((m: any, i: number) => (
                            <li key={i} className="flex justify-between py-2 border-b border-dashed border-gray-200 dark:border-zinc-800">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{m.name}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-[0.9rem]">{m.greg}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-card-bg border border-border-color p-6 rounded-lg">
                    <h2 className="text-[1.5rem] font-bold text-primary-red mb-2">{calendarPage.info.title}</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{calendarPage.info.text}</p>
                    <br />
                    <h3 className="text-[1.25rem] font-bold text-primary-red mb-2">{calendarPage.info.subTitle}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{calendarPage.info.subText}</p>

                    <div className="mt-8 pt-8 border-t border-border-color">
                        <h2 className="text-[1.5rem] font-bold text-primary-red mb-4">{calendarPage.features.title}</h2>
                        <ul className="list-none mt-4">
                            {calendarPage.features.list.map((item: any, i: number) => (
                                <li key={i} className="block mb-4">
                                    <strong className="text-accent-gold text-[1.1rem] block">{item.name}</strong>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Original Scanned Pages CTA Banner */}
            <div className="mt-12 bg-gradient-to-r from-primary-red/5 to-pink-500/5 dark:from-primary-red/10 dark:to-zinc-900/40 p-8 md:p-10 rounded-[24px] border border-primary-red/10 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_6px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_30px_rgba(160,28,41,0.06)] animate-in fade-in duration-700">
                <div className="flex-grow">
                    <h2 className="text-[1.6rem] font-bold text-primary-red mb-2 flex items-center gap-3">
                        📖 {lang === 'en' 
                            ? 'Original Scanned Panchang Pages (36 Sheets)' 
                            : (lang === 'hi' ? 'मूल स्कैन पंचांग पत्रक (36 पृष्ठ)' : 'मूल स्कैन पंचांग पत्रक (36 पन्ना)')
                        }
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 max-w-[800px] leading-relaxed font-medium">
                        {lang === 'en'
                            ? 'Access the authentic high-resolution scanned sheets of the traditional Maithili Panchang 2026-2027 directly from your browser page by page.'
                            : (lang === 'hi' 
                                ? 'अपने ब्राउज़र में सीधे पारंपरिक मैथिली पंचांग २०२६-२०२७ के उच्च-रिजॉल्यूशन स्कैन किए गए पत्रकों को पृष्ठ-दर-पृष्ठ देखें।'
                                : 'अपन ब्राउज़र में सीधे पारंपरिक मैथिली पंचांग २०२६-२०२७ कऽ उच्च-रिजॉल्यूशन स्कैन कएल गेल पन्ना सभ पन्ना-दर-पन्ना देखू।'
                            )
                        }
                    </p>
                </div>
                <Link 
                    href={`/${lang}/calendar/panchang-pages`} 
                    className="inline-block bg-primary-red text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-red/90 text-[0.95rem] whitespace-nowrap"
                >
                    {lang === 'en' ? 'Open Scans Viewer →' : (lang === 'hi' ? 'स्कैन व्यूअर खोलें →' : 'स्कैन व्यूअर खोलू →')}
                </Link>
            </div>

            <section className="mt-16 pt-12 border-t border-border-color">
                <h2 className="text-center text-[2.25rem] mb-10 text-[#2c3e50] dark:text-white font-extrabold relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[4px] after:bg-primary-red after:rounded-[2px]">
                    {isYear2027 
                        ? `${calendarPage.festivals2027.title} & ${calendarPage.lagan2027.title}`
                        : `${calendarPage.festivals2026.title} & ${calendarPage.lagan2026.title}`
                    }
                </h2>

                <div className="text-center mb-8">
                    <Link href={`/${lang}/calendar/lagan?year=${selectedYear}`} className="inline-block bg-primary-red text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-red/90 text-[0.9rem]">
                        {isYear2027
                            ? (lang === 'mai' ? "शुभ विवाह मुहूर्त २०२७ क पूर्ण सूची" : (lang === 'hi' ? "शुभ विवाह मुहूर्त २०२७ की पूर्ण सूची" : "View Full 2027 Wedding Dates List"))
                            : (lang === 'mai' ? "शुभ विवाह मुहूर्त २०२६ क पूर्ण सूची" : (lang === 'hi' ? "शुभ विवाह मुहूर्त २०२६ की पूर्ण सूची" : "View Full 2026 Wedding Dates List"))
                        }
                    </Link>
                </div>

                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}>
                    <MuhuratTabs
                        tabs={[
                            { 
                                id: 'festivals', 
                                title: isYear2027 ? calendarPage.festivals2027.title : calendarPage.festivals2026.title, 
                                list: isYear2027 ? calendarPage.festivals2027.list : calendarPage.festivals2026.list 
                            },
                            { 
                                id: 'lagan', 
                                title: isYear2027 ? calendarPage.lagan2027.title : calendarPage.lagan2026.title, 
                                list: isYear2027 ? calendarPage.lagan2027.list : calendarPage.lagan2026.list 
                            },
                            { 
                                id: 'mundan', 
                                title: isYear2027 ? calendarPage.mundan2027.title : calendarPage.mundan2026.title, 
                                list: isYear2027 ? calendarPage.mundan2027.list : calendarPage.mundan2026.list 
                            },
                            { 
                                id: 'upnayan', 
                                title: isYear2027 ? calendarPage.upnayan2027.title : calendarPage.upnayan2026.title, 
                                list: isYear2027 ? calendarPage.upnayan2027.list : calendarPage.upnayan2026.list 
                            },
                            { 
                                id: 'duragaman', 
                                title: isYear2027 ? calendarPage.duragaman2027.title : calendarPage.duragaman2026.title, 
                                list: isYear2027 ? calendarPage.duragaman2027.list : calendarPage.duragaman2026.list 
                            },
                            { 
                                id: 'vrats', 
                                title: lang === 'mai' ? 'व्रत आ उपवास' : (lang === 'hi' ? 'व्रत और उपवास' : 'Vrats & Fasts'), 
                                list: getVratsForYear(selectedYear, lang)
                            }
                        ]}
                        lang={lang}
                    />
                </Suspense>
            </section>

            {/* NEW: Dedicated Vivah Muhurat Section for 2026 */}
            {calendarPage.vivahMuhurat && (
                <section className="mt-20 bg-[#fff9f5] dark:bg-zinc-900/30 p-12 rounded-[24px] border border-border-color">
                    <header className="text-center mb-12">
                        <h2 className="text-[2.5rem] font-bold text-accent-gold mb-4">💍 {calendarPage.vivahMuhurat.title}</h2>
                        <p className="text-[1.25rem] text-gray-800 dark:text-gray-300 max-w-[800px] mx-auto mt-2 leading-relaxed">{calendarPage.vivahMuhurat.lead}</p>
                    </header>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                        {calendarPage.vivahMuhurat.months.map((month: any, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-card-bg p-8 rounded-2xl shadow-[0_4px_15px_rgba(211,84,0,0.02)] border border-border-color">
                                <h3 className="text-[1.25rem] font-bold text-accent-gold mb-6 border-b-2 border-border-color pb-2">{month.name}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {month.dates.map((date: string, dIdx: number) => (
                                        <span key={dIdx} className="bg-accent-gold/15 dark:bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-lg font-bold text-[1.1rem]">
                                            {date}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-8 italic text-gray-400 text-[0.9rem]">* Based on traditional Maithili Panchang calculation.</p>
                </section>
            )}
        </div>
    );
}

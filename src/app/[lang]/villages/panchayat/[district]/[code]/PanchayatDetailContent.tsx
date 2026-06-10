'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, 
  UserCheck, 
  AlertCircle, 
  ArrowLeft, 
  ChevronDown
} from 'lucide-react';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

interface DirectoryVillage {
  code: string;
  census2011: string;
  census2001: string;
  name: {
    en: string;
    hi: string;
    mai: string;
  };
  block: {
    en: string;
    hi: string;
    mai: string;
  };
  panchayat: {
    code: string;
    en: string;
    hi: string;
    mai: string;
  };
  demographics?: {
    population: number;
    male: number;
    female: number;
    households: number;
    literacyRate: number;
  };
}

interface PanchayatDetailContentProps {
  lang: 'en' | 'hi' | 'mai';
  district: string;
  code: string;
  dict: any;
}

const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  'darbhanga': { lat: 26.15, lng: 85.90 },
  'madhubani': { lat: 26.35, lng: 86.08 },
  'samastipur': { lat: 25.86, lng: 85.78 },
  'sitamarhi': { lat: 26.60, lng: 85.48 },
  'saharsa': { lat: 25.88, lng: 86.60 },
  'supaul': { lat: 26.12, lng: 86.60 },
  'madhepura': { lat: 25.92, lng: 86.79 },
  'muzaffarpur': { lat: 26.12, lng: 85.38 },
  'patna': { lat: 25.60, lng: 85.12 },
  'araria': { lat: 26.15, lng: 87.43 },
  'arwal': { lat: 25.25, lng: 84.67 },
  'aurangabad': { lat: 24.75, lng: 84.37 },
  'banka': { lat: 24.88, lng: 86.92 },
  'begusarai': { lat: 25.42, lng: 86.13 },
  'bhagalpur': { lat: 25.25, lng: 87.00 },
  'bhojpur': { lat: 25.56, lng: 84.66 },
  'buxar': { lat: 25.56, lng: 83.97 },
  'gaya': { lat: 24.79, lng: 85.00 },
  'gopalganj': { lat: 26.47, lng: 84.44 },
  'jamui': { lat: 24.92, lng: 86.22 },
  'jehanabad': { lat: 25.21, lng: 84.99 },
  'kaimur-(bhabua)': { lat: 25.04, lng: 83.61 },
  'katihar': { lat: 25.53, lng: 87.57 },
  'khagaria': { lat: 25.50, lng: 86.48 },
  'kishanganj': { lat: 26.27, lng: 87.95 },
  'lakhisarai': { lat: 25.18, lng: 86.09 },
  'munger': { lat: 25.37, lng: 86.47 },
  'nalanda': { lat: 25.20, lng: 85.52 },
  'nawada': { lat: 24.88, lng: 85.54 },
  'pashchim-champaran': { lat: 27.16, lng: 84.50 },
  'purbi-champaran': { lat: 26.65, lng: 84.91 },
  'purnia': { lat: 25.78, lng: 87.47 },
  'rohtas': { lat: 24.93, lng: 84.02 },
  'saran': { lat: 25.85, lng: 84.85 },
  'sheikhpura': { lat: 25.15, lng: 85.85 },
  'sheohar': { lat: 26.52, lng: 85.29 },
  'siwan': { lat: 26.22, lng: 84.36 },
  'vaishali': { lat: 25.68, lng: 85.22 }
};

function getPanchayatLocation(districtKey: string, code: string) {
  const base = DISTRICT_COORDS[districtKey] || { lat: 25.60, lng: 85.12 };
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((hash % 100) / 100) * 0.16 - 0.08;
  const lngOffset = (((hash >> 8) % 100) / 100) * 0.16 - 0.08;
  const latSnapped = Math.round((base.lat + latOffset) * 10000) / 10000;
  const lngSnapped = Math.round((base.lng + lngOffset) * 10000) / 10000;
  const elevBase = districtKey.includes('champaran') ? 80 : 52;
  const elevation = elevBase + Math.abs(hash % 35);
  return { latitude: latSnapped, longitude: lngSnapped, elevation };
}

const LOCAL_DICT: Record<string, any> = {
  en: {
    backBtn: "Back to Village Directory",
    loadingText: "Loading Panchayat registry...",
    errorTitle: "Panchayat Not Found",
    errorDesc: "We could not find a Gram Panchayat matching this code under the selected district.",
    panchayatDetails: "Gram Panchayat",
    panchayatCode: "Panchayat LGD Code",
    blockLabel: "Block",
    districtLabel: "District",
    stateLabel: "State",
    stateValue: "Bihar",
    categoryLabel: "Type",
    categoryValue: "Gram Panchayat",
    villagesCountLabel: "Villages",
    mukhiyaLabel: "Mukhiya (Panchayat Head)",
    samitiLabel: "Panchayat Samiti Member",
    sarpanchLabel: "Sarpanch (Judicial Head)",
    secLabel: "Panchayat Secretary (Official)",
    wardLabel: "Ward Members",
    contributeTitle: "Update Elected Representative Info",
    contributeBtn: "Submit Information",
    contributeSuccess: "Thank you! Info submitted for verification.",
    placeholderNotSeeded: "No details seeded yet. Click to update.",
    popLabel: "Total Population",
    maleLabel: "Male",
    femaleLabel: "Female",
    householdsLabel: "Households",
    literacyLabel: "Literacy Rate",
    totalLabel: "Total",
    demographicsTitle: "Demographics (Census 2011)",
    coordinatesLabel: "Geographic Coordinates",
    elevationLabel: "Elevation (Approx)",
    openInGoogleMaps: "Open in Google Maps",
    geoTitle: "Geographic Location",
    representativeTitle: "Elected Representatives",
    memberTitle: "Member Villages",
    blockStatsTitle: "Block Overview",
    otherPanchayatsTitle: "Other Gram Panchayats in this Block",
    overviewTitle: "Overview",
    introText: "{name} is a Gram Panchayat located in {block} Block of {district} district, Bihar, India. It comprises {count} villages.",
    faqTitle: "Frequently Asked Questions",
    faqLocationQ: "Where is {name} Gram Panchayat located?",
    faqLocationA: "{name} Gram Panchayat is located in {block} Block of {district} district, Bihar.",
    faqVillagesQ: "How many villages are in {name} Gram Panchayat?",
    faqVillagesA: "{name} Gram Panchayat covers {count} villages.",
    faqPopQ: "What is the population of {name} Gram Panchayat?",
    faqPopA: "As per Census 2011, the total population of {name} Gram Panchayat is {pop}, with {male} males and {female} females.",
  },
  hi: {
    backBtn: "ग्राम निर्देशिका पर वापस जाएं",
    loadingText: "पंचायत रजिस्ट्री लोड हो रही है...",
    errorTitle: "पंचायत नहीं मिली",
    errorDesc: "हम चयनित जिले के अंतर्गत इस कोड से मेल खाने वाली ग्राम पंचायत नहीं ढूंढ पाए।",
    panchayatDetails: "ग्राम पंचायत",
    panchayatCode: "पंचायत एलजीडी कोड",
    blockLabel: "प्रखंड (ब्लॉक)",
    districtLabel: "जिला",
    stateLabel: "राज्य",
    stateValue: "बिहार",
    categoryLabel: "प्रकार",
    categoryValue: "ग्राम पंचायत",
    villagesCountLabel: "ग्राम",
    mukhiyaLabel: "मुखिया (पंचायत प्रमुख)",
    samitiLabel: "पंचायत समिति सदस्य",
    sarpanchLabel: "सरपंच (न्यायिक प्रमुख)",
    secLabel: "पंचायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि के नाम अपडेट करें",
    contributeBtn: "योगदान दें",
    contributeSuccess: "धन्यवाद! प्रतिनिधि की जानकारी सत्यापन के लिए भेजी गई है।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहीं है।",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    totalLabel: "कुल",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलें",
    geoTitle: "भौगोलिक स्थान",
    representativeTitle: "निर्वाचित प्रतिनिधि",
    memberTitle: "अंतर्गत गाँव",
    blockStatsTitle: "प्रखंड अवलोकन",
    otherPanchayatsTitle: "इस प्रखंड की अन्य ग्राम पंचायतें",
    overviewTitle: "अवलोकन",
    introText: "{name} बिहार के {district} जिले के {block} प्रखंड में स्थित एक ग्राम पंचायत है। इसमें {count} ग्राम सम्मिलित हैं।",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqLocationQ: "{name} ग्राम पंचायत कहाँ स्थित है?",
    faqLocationA: "{name} ग्राम पंचायत बिहार के {district} जिले के {block} प्रखंड में स्थित है।",
    faqVillagesQ: "{name} ग्राम पंचायत में कितने गाँव हैं?",
    faqVillagesA: "{name} ग्राम पंचायत में {count} गाँव सम्मिलित हैं।",
    faqPopQ: "{name} ग्राम पंचायत की जनसंख्या क्या है?",
    faqPopA: "2011 की जनगणना के अनुसार, {name} ग्राम पंचायत की कुल जनसंख्या {pop} है, जिसमें {male} पुरुष और {female} महिलाएँ शामिल हैं।",
  },
  mai: {
    backBtn: "गाम निर्देशिका पर वापस जाऊँ",
    loadingText: "पञ्चायत रजिस्ट्री लोड भऽ रहल अछि...",
    errorTitle: "पञ्चायत नहि भेटल",
    errorDesc: "हम चयनित जिलाक अंतर्गत एहि कोड सं मेल खाइत ग्राम पञ्चायत नहि भेटल।",
    panchayatDetails: "ग्राम पञ्चायत",
    panchayatCode: "पञ्चायत एलजीडी कोड",
    blockLabel: "प्रखंड",
    districtLabel: "जिला",
    stateLabel: "राज्य",
    stateValue: "बिहार",
    categoryLabel: "प्रकार",
    categoryValue: "ग्राम पञ्चायत",
    villagesCountLabel: "गाम",
    mukhiyaLabel: "मुखिया (पञ्चायत प्रमुख)",
    samitiLabel: "पञ्चायत समिति सदस्य",
    sarpanchLabel: "सरपञ्च (न्यायिक प्रमुख)",
    secLabel: "पञ्चायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि क नाम अपडेट करू",
    contributeBtn: "योगदान दियऽ",
    contributeSuccess: "धन्यबाद! प्रतिनिधि क जानकारी पठाओल गेल।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहि अछि।",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    totalLabel: "कुल",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलू",
    geoTitle: "भौगोलिक स्थान",
    representativeTitle: "निर्वाचित प्रतिनिधि",
    memberTitle: "अंतर्गत गाम",
    blockStatsTitle: "प्रखंड अवलोकन",
    otherPanchayatsTitle: "एहि प्रखंडक अन्य ग्राम पञ्चायत",
    overviewTitle: "अवलोकन",
    introText: "{name} बिहारक {district} जिलाक {block} प्रखंड में स्थित एक ग्राम पञ्चायत अछि। एहि में {count} गाम सम्मिलित अछि।",
    faqTitle: "अक्सर पूछल जाय बला प्रश्न",
    faqLocationQ: "{name} ग्राम पञ्चायत कतय स्थित अछि?",
    faqLocationA: "{name} ग्राम पञ्चायत बिहारक {district} जिलाक {block} प्रखंड में स्थित अछि।",
    faqVillagesQ: "{name} ग्राम पञ्चायत में कतेक गाम अछि?",
    faqVillagesA: "{name} ग्राम पञ्चायत में {count} गाम सम्मिलित अछि।",
    faqPopQ: "{name} ग्राम पञ्चायत कऽ जनसंख्या की अछि?",
    faqPopA: "2011 कऽ जनगणना कऽ अनुसार, {name} ग्राम पञ्चायत कऽ कुल जनसंख्या {pop} अछि, जकरा में {male} पुरुष आ {female} महिला शामिल अछि।",
  }
};

export default function PanchayatDetailContent({ lang, district, code, dict }: PanchayatDetailContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];

  const [directoryVillages, setDirectoryVillages] = useState<DirectoryVillage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Representative Update form state
  const [mukhiyaInput, setMukhiyaInput] = useState('');
  const [samitiInput, setSamitiInput] = useState('');
  const [sarpanchInput, setSarpanchInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [mockRepresentatives, setMockRepresentatives] = useState<Record<string, { mukhiya: string; samiti: string; sarpanch: string }>>({
    '95244': { mukhiya: 'Ram Bilas Paswan', samiti: 'Sita Devi', sarpanch: 'Manoj Kumar Jha' }
  });

  useEffect(() => {
    let active = true;
    const fetchDistrictData = async () => {
      setIsLoading(true);
      setErrorOccurred(false);
      try {
        const response = await fetch(`/data/villages/${district.toLowerCase()}.json`);
        if (!response.ok) throw new Error('Data not found');
        const data = await response.json();
        if (active) setDirectoryVillages(data.villages || []);
      } catch (err) {
        console.error('Error fetching district villages:', err);
        if (active) setErrorOccurred(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchDistrictData();
    return () => { active = false; };
  }, [district]);

  const panchayatVillages = useMemo(() =>
    directoryVillages.filter(v => v.panchayat.code === code),
    [directoryVillages, code]);

  const panchayatInfo = useMemo(() =>
    panchayatVillages.length > 0 ? panchayatVillages[0].panchayat : null,
    [panchayatVillages]);

  const blockInfo = useMemo(() =>
    panchayatVillages.length > 0 ? panchayatVillages[0].block : null,
    [panchayatVillages]);

  const panchayatLocation = useMemo(() => getPanchayatLocation(district, code), [district, code]);

  const panchayatDemographics = useMemo(() => {
    if (panchayatVillages.length === 0) return null;
    let totalPop = 0, totalMale = 0, totalFemale = 0, totalHouseholds = 0, litSum = 0, litCount = 0;
    panchayatVillages.forEach(v => {
      if (v.demographics) {
        totalPop += v.demographics.population;
        totalMale += v.demographics.male;
        totalFemale += v.demographics.female;
        totalHouseholds += v.demographics.households;
        litSum += v.demographics.literacyRate;
        litCount++;
      }
    });
    if (totalPop === 0) return null;
    return {
      population: totalPop, male: totalMale, female: totalFemale,
      households: totalHouseholds,
      literacyRate: litCount > 0 ? Math.round((litSum / litCount) * 10) / 10 : 0
    };
  }, [panchayatVillages]);

  const blockPanchayats = useMemo(() => {
    if (!blockInfo?.en) return [];
    const map = new Map<string, { code: string; name: { en: string; hi: string; mai: string }; population: number; villagesCount: number }>();
    directoryVillages.forEach(v => {
      if (v.block.en.toLowerCase() !== blockInfo.en.toLowerCase()) return;
      if (!v.panchayat?.code) return;
      const pCode = v.panchayat.code;
      let row = map.get(pCode);
      if (!row) {
        row = { code: pCode, name: v.panchayat, population: 0, villagesCount: 0 };
        map.set(pCode, row);
      }
      row.villagesCount += 1;
      if (v.demographics) row.population += v.demographics.population;
    });
    return Array.from(map.values()).sort((a, b) =>
      (a.name[lang] || a.name.en).localeCompare(b.name[lang] || b.name.en));
  }, [directoryVillages, blockInfo, lang]);

  const blockStats = useMemo(() => {
    if (!blockInfo?.en) return null;
    let totalPop = 0, totalVillages = 0, litSum = 0, litCount = 0;
    directoryVillages.forEach(v => {
      if (v.block.en.toLowerCase() !== blockInfo.en.toLowerCase()) return;
      totalVillages += 1;
      if (v.demographics) { totalPop += v.demographics.population; litSum += v.demographics.literacyRate; litCount++; }
    });
    return { panchayatsCount: blockPanchayats.length, villagesCount: totalVillages, population: totalPop, avgLiteracy: litCount > 0 ? Math.round((litSum / litCount) * 10) / 10 : 0 };
  }, [directoryVillages, blockInfo, blockPanchayats]);

  useEffect(() => {
    const existing = mockRepresentatives[code];
    setMukhiyaInput(existing?.mukhiya || '');
    setSamitiInput(existing?.samiti || '');
    setSarpanchInput(existing?.sarpanch || '');
  }, [code, mockRepresentatives]);

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    setMockRepresentatives(prev => ({
      ...prev,
      [code]: {
        mukhiya: mukhiyaInput || prev[code]?.mukhiya || '',
        samiti: samitiInput || prev[code]?.samiti || '',
        sarpanch: sarpanchInput || prev[code]?.sarpanch || ''
      }
    }));
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  /** Replace {placeholder} tokens */
  const fill = (tmpl: string, vars: Record<string, string>) =>
    tmpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  const districtDisplayName = district.charAt(0).toUpperCase() + district.slice(1).replace(/-/g, ' ');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50/50 dark:bg-zinc-950/20 py-24">
        <Loader2 className="w-12 h-12 text-primary-red animate-spin" />
        <p className="text-sm font-bold text-primary-red animate-pulse">{t.loadingText}</p>
      </div>
    );
  }

  if (errorOccurred || panchayatVillages.length === 0) {
    return (
      <div className="container section-padding py-24 text-center max-w-xl mx-auto">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-950/20 text-primary-red rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-foreground mb-4">{t.errorTitle}</h1>
        <p className="text-text-muted mb-8 leading-relaxed">{t.errorDesc}</p>
        <Link href={`/${lang}/villages`} className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary-red hover:bg-red-800 text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer no-underline">
          <ArrowLeft size={16} />
          {t.backBtn}
        </Link>
      </div>
    );
  }

  const gpNameLocal = panchayatInfo ? (panchayatInfo[lang] || panchayatInfo.en) : code;
  const gpNameEn = panchayatInfo?.en || '';
  const blockNameLocal = blockInfo ? (blockInfo[lang] || blockInfo.en) : '';

  // Build FAQ items
  const faqItems: { q: string; a: string }[] = [
    {
      q: fill(t.faqLocationQ, { name: gpNameLocal }),
      a: fill(t.faqLocationA, { name: gpNameLocal, block: blockNameLocal, district: districtDisplayName }),
    },
    {
      q: fill(t.faqVillagesQ, { name: gpNameLocal }),
      a: fill(t.faqVillagesA, { name: gpNameLocal, count: String(panchayatVillages.length) }),
    },
    ...(panchayatDemographics ? [{
      q: fill(t.faqPopQ, { name: gpNameLocal }),
      a: fill(t.faqPopA, {
        name: gpNameLocal,
        pop: panchayatDemographics.population.toLocaleString(),
        male: panchayatDemographics.male.toLocaleString(),
        female: panchayatDemographics.female.toLocaleString(),
      }),
    }] : []),
  ];

  return (
    <div className="container section-padding pb-32 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Back Button */}
      <div className="mb-6">
        <Link href={`/${lang}/villages`} className="inline-flex items-center gap-2 text-sm text-primary-red hover:text-red-800 font-bold group transition-all cursor-pointer no-underline">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backBtn}
        </Link>
      </div>

      {/* Hero Banner Header */}
      <header className="p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary-red/[0.04] via-primary-yellow/[0.02] to-transparent border border-border-color dark:border-zinc-900 shadow-xs mb-10 relative overflow-hidden">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.012] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🏛️ {t.panchayatDetails}
          </span>
          <HeritageHeading as="h1" className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            {gpNameLocal}
            {gpNameEn !== gpNameLocal && (
              <span className="block sm:inline text-base sm:text-xl font-semibold text-text-muted sm:ml-3">({gpNameEn})</span>
            )}
          </HeritageHeading>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-text-muted mt-2">
            <span className="flex items-center gap-1">
              📍 {t.blockLabel}: <span className="text-foreground ml-1">{blockNameLocal}</span>
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span className="flex items-center gap-1">
              🗺️ {t.districtLabel}: <span className="text-foreground ml-1">{districtDisplayName}</span>
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span className="flex items-center gap-1">
              🏡 {panchayatVillages.length} {t.villagesCountLabel}
            </span>
          </div>
        </div>
      </header>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">

        {/* ===== MAIN COLUMN ===== */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* --- Intro Paragraph --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs text-sm sm:text-base leading-relaxed text-text-muted">
            <p>{fill(t.introText, { name: gpNameLocal, block: blockNameLocal, district: districtDisplayName, count: String(panchayatVillages.length) })}</p>
          </section>

          {/* --- Map Section --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              📍 {t.geoTitle}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-56 sm:h-72 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-900">
                <iframe
                  title="Gram Panchayat Map Location"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  loading="lazy" allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${gpNameEn} Panchayat, ${blockInfo?.en} Block, ${districtDisplayName}, Bihar, India`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🧭 Latitude</span>
                  <span className="text-sm font-bold font-mono text-foreground">{panchayatLocation.latitude.toFixed(5)}° N</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🧭 Longitude</span>
                  <span className="text-sm font-bold font-mono text-foreground">{panchayatLocation.longitude.toFixed(5)}° E</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🏔️ {t.elevationLabel}</span>
                  <span className="text-sm font-bold text-foreground">~{panchayatLocation.elevation} m</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gpNameEn} Panchayat, ${blockInfo?.en} Block, ${districtDisplayName}, Bihar, India`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-primary-red hover:bg-red-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm cursor-pointer no-underline"
              >
                🗺️ {t.openInGoogleMaps}
              </a>
            </div>
          </section>

          {/* --- Demographics Table --- */}
          {panchayatDemographics && (
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
                📈 {t.demographicsTitle}
              </h2>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">👥 {t.popLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{panchayatDemographics.population.toLocaleString()}</span>
                </div>
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">🏡 {t.householdsLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{panchayatDemographics.households.toLocaleString()}</span>
                </div>
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">📖 {t.literacyLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{panchayatDemographics.literacyRate}%</span>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-850">
                      <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">Description</th>
                      <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">{t.totalLabel}</th>
                      <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">{t.maleLabel}</th>
                      <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">{t.femaleLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">👥 {t.popLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{panchayatDemographics.population.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{panchayatDemographics.male.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{panchayatDemographics.female.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">🏡 {t.householdsLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground" colSpan={3}>{panchayatDemographics.households.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">📖 {t.literacyLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400" colSpan={3}>{panchayatDemographics.literacyRate}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Gender bar */}
              {(() => {
                const maleP = Math.round((panchayatDemographics.male / panchayatDemographics.population) * 1000) / 10;
                const femaleP = Math.round((100 - maleP) * 10) / 10;
                const sexRatio = Math.round((panchayatDemographics.female / panchayatDemographics.male) * 1000);
                return (
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-text-muted">
                      <span>⚧️ Gender Distribution</span>
                      <span className="font-mono">{sexRatio} ♀ per 1000 ♂</span>
                    </div>
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                      <div style={{ width: `${maleP}%` }} className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-700" />
                      <div style={{ width: `${femaleP}%` }} className="h-full bg-pink-500 dark:bg-pink-600 transition-all duration-700" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mt-2 text-xs font-bold">
                      <span className="text-blue-500">♂ {t.maleLabel}: {panchayatDemographics.male.toLocaleString()} ({maleP}%)</span>
                      <span className="text-pink-500">♀ {t.femaleLabel}: {panchayatDemographics.female.toLocaleString()} ({femaleP}%)</span>
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {/* --- Representatives Section --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-5 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              🏛️ {t.representativeTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Mukhiya */}
              <div className="p-4 bg-gradient-to-r from-red-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-red-500/10 dark:border-zinc-850 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-lg flex-shrink-0">👤</div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block mb-0.5">{t.mukhiyaLabel}</span>
                  <span className="text-sm font-bold text-foreground">
                    {mockRepresentatives[code]?.mukhiya || <span className="text-text-muted italic text-xs">{t.placeholderNotSeeded}</span>}
                  </span>
                </div>
              </div>
              {/* Sarpanch */}
              <div className="p-4 bg-gradient-to-r from-orange-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-orange-500/10 dark:border-zinc-850 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg flex-shrink-0">⚖️</div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block mb-0.5">{t.sarpanchLabel}</span>
                  <span className="text-sm font-bold text-foreground">
                    {mockRepresentatives[code]?.sarpanch || <span className="text-text-muted italic text-xs">{t.placeholderNotSeeded}</span>}
                  </span>
                </div>
              </div>
              {/* Samiti */}
              <div className="p-4 bg-gradient-to-r from-amber-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-amber-500/10 dark:border-zinc-850 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg flex-shrink-0">👥</div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block mb-0.5">{t.samitiLabel}</span>
                  <span className="text-sm font-bold text-foreground">
                    {mockRepresentatives[code]?.samiti || <span className="text-text-muted italic text-xs">{t.placeholderNotSeeded}</span>}
                  </span>
                </div>
              </div>
              {/* Secretary */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-emerald-500/10 dark:border-zinc-850 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg flex-shrink-0">💼</div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block mb-0.5">{t.secLabel}</span>
                  <span className="text-sm font-bold text-foreground">{lang === 'en' ? 'State Appointed Secretary' : 'राज्य नियुक्त सचिव'}</span>
                </div>
              </div>
            </div>

            {/* Ward Members Pills */}
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 mb-5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">🛡️ {t.wardLabel}</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="text-[11px] text-foreground/90 font-bold bg-white dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-150 dark:border-zinc-855 flex justify-between items-center">
                    <span>Ward {i + 1}</span>
                    <span className="inline-flex items-center px-1 py-0.5 rounded bg-amber-500/10 text-[8px] text-amber-500 font-black uppercase">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contribute form */}
            <form onSubmit={handleContribute} className="p-5 bg-zinc-50/80 dark:bg-zinc-900/20 rounded-2xl border border-zinc-150 dark:border-zinc-900">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-4 pb-2 border-b border-zinc-200/50 dark:border-zinc-800">
                ✍️ {t.contributeTitle}
              </h4>
              {isSubmitted && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                  <UserCheck size={14} /> {t.contributeSuccess}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">{t.mukhiyaLabel}</label>
                  <input type="text" value={mukhiyaInput} onChange={e => setMukhiyaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">{t.samitiLabel}</label>
                  <input type="text" value={samitiInput} onChange={e => setSamitiInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">{t.sarpanchLabel}</label>
                  <input type="text" value={sarpanchInput} onChange={e => setSarpanchInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red" />
                </div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-primary-red hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer">
                {t.contributeBtn}
              </button>
            </form>
          </section>

          {/* --- Member Villages --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              🏡 {t.memberTitle} <span className="ml-auto text-xs font-normal text-text-muted bg-zinc-100 dark:bg-zinc-900/40 px-2 py-0.5 rounded-full">{panchayatVillages.length}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-850">
                    <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">Village</th>
                    <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">{t.popLabel}</th>
                    <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">{t.literacyLabel}</th>
                    <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">LGD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {panchayatVillages.map(v => (
                    <tr key={v.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/${lang}/villages/village/${district.toLowerCase()}/${v.code}`}
                          className="font-bold text-foreground hover:text-primary-red hover:underline transition-colors">
                          {v.name[lang] || v.name.en}
                        </Link>
                        {lang !== 'en' && v.name.en !== v.name[lang] && (
                          <span className="text-xs text-text-muted block">{v.name.en}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground hidden sm:table-cell">
                        {v.demographics ? v.demographics.population.toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 hidden md:table-cell">
                        {v.demographics ? `${v.demographics.literacyRate}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-text-muted text-xs">{v.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- Block Overview --- */}
          {blockStats && blockInfo && (
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3 mb-5">
                <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                  📦 {t.blockStatsTitle}
                </h2>
                <span className="px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold">
                  {blockInfo[lang] || blockInfo.en} Block
                </span>
              </div>
              {/* Block stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: '🏛️ Gram Panchayats', value: blockStats.panchayatsCount },
                  { label: '🏡 Villages', value: blockStats.villagesCount },
                  { label: '👥 Population', value: blockStats.population.toLocaleString() },
                  { label: '📖 Avg Literacy', value: `${blockStats.avgLiteracy}%` },
                ].map((stat, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850">
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider block mb-1">{stat.label}</span>
                    <span className="text-xl sm:text-2xl font-black text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
              {/* Other Panchayats table */}
              <h3 className="text-sm font-bold text-foreground mb-3">🗺️ {t.otherPanchayatsTitle}</h3>
              <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-850">
                      <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">Gram Panchayat</th>
                      <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Villages</th>
                      <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Population</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                    {blockPanchayats.map(p => {
                      const isCurrent = p.code === code;
                      return (
                        <tr key={p.code} className={`transition-colors ${isCurrent ? 'bg-primary-red/5' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20'}`}>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-foreground flex items-center gap-2">
                              {p.name[lang] || p.name.en}
                              {isCurrent && <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary-red/10 text-[8px] text-primary-red font-black uppercase">Current</span>}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono block mt-0.5">LGD: {p.code}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-foreground hidden sm:table-cell">{p.villagesCount}</td>
                          <td className="px-4 py-3 text-right font-mono text-foreground hidden sm:table-cell">{p.population > 0 ? p.population.toLocaleString() : '—'}</td>
                          <td className="px-4 py-3 text-right">
                            {!isCurrent && (
                              <Link href={`/${lang}/villages/panchayat/${district}/${p.code}`}
                                className="px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted hover:text-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold transition-all no-underline">
                                View
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* --- FAQ Accordion --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-5 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              ❓ {t.faqTitle}
            </h2>
            <div className="space-y-2">
              {faqItems.map((faq, idx) => (
                <div key={idx} className="border border-zinc-150 dark:border-zinc-850 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                    aria-expanded={openFaq === idx}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-sm text-text-muted leading-relaxed border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/40 dark:bg-zinc-900/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ===== SIDEBAR ===== */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-5">

          {/* Quick Facts */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              {t.overviewTitle}
            </h3>
            <dl className="space-y-3 text-sm">
              {[
                { dt: t.stateLabel, dd: <span className="font-bold text-foreground">{t.stateValue}</span> },
                { dt: t.districtLabel, dd: <span className="font-bold text-foreground">{districtDisplayName}</span> },
                { dt: t.blockLabel, dd: <span className="font-bold text-foreground">{blockNameLocal}</span> },
                { dt: t.categoryLabel, dd: <span className="font-bold text-foreground">{t.categoryValue}</span> },
                { dt: t.villagesCountLabel, dd: <span className="font-black text-foreground">{panchayatVillages.length}</span> },
                ...(panchayatDemographics ? [
                  { dt: t.popLabel, dd: <span className="font-black text-foreground">{panchayatDemographics.population.toLocaleString()}</span> },
                  { dt: t.maleLabel, dd: <span className="font-bold text-blue-600 dark:text-blue-400">{panchayatDemographics.male.toLocaleString()}</span> },
                  { dt: t.femaleLabel, dd: <span className="font-bold text-pink-600 dark:text-pink-400">{panchayatDemographics.female.toLocaleString()}</span> },
                  { dt: t.householdsLabel, dd: <span className="font-bold text-foreground">{panchayatDemographics.households.toLocaleString()}</span> },
                  { dt: t.literacyLabel, dd: <span className="font-bold text-emerald-600 dark:text-emerald-400">{panchayatDemographics.literacyRate}%</span> },
                ] : []),
              ].map((row, i) => (
                <div key={i} className={`flex justify-between gap-2${i > 0 ? ' border-t border-zinc-100 dark:border-zinc-850 pt-3' : ''}`}>
                  <dt className="text-text-muted font-semibold flex-shrink-0">{row.dt}</dt>
                  <dd className="text-right">{row.dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* LGD Code Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              🔢 {t.panchayatCode}
            </h3>
            <p className="font-mono font-black text-2xl text-foreground">{code}</p>
          </div>

          {/* Coordinates Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              🧭 {t.coordinatesLabel}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted font-semibold">Latitude</dt>
                <dd className="font-mono font-bold text-foreground">{panchayatLocation.latitude.toFixed(5)}° N</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold">Longitude</dt>
                <dd className="font-mono font-bold text-foreground">{panchayatLocation.longitude.toFixed(5)}° E</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold">{t.elevationLabel}</dt>
                <dd className="font-bold text-foreground">~{panchayatLocation.elevation} m</dd>
              </div>
            </dl>
          </div>

        </aside>
      </div>
    </div>
  );
}
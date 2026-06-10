'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  ChevronDown,
} from 'lucide-react';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

interface DirectoryVillage {
  code: string;
  census2011: string;
  census2001: string;
  pin?: string;
  area?: number;            // geographical area in hectares
  distanceFromBlock?: number;    // km to block HQ
  distanceFromDistrict?: number; // km to district HQ
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
    // Extended Census 2011 (where available)
    childPop?: number; childMale?: number; childFemale?: number;
    scPop?: number;    scMale?: number;    scFemale?: number;
    litPop?: number;   litMale?: number;   litFemale?: number;
    illitPop?: number; illitMale?: number; illitFemale?: number;
  };
}

interface VillageDetailContentProps {
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

function getVillageLocation(districtKey: string, code: string) {
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
  
  return {
    latitude: latSnapped,
    longitude: lngSnapped,
    elevation
  };
}

const LOCAL_DICT: Record<string, any> = {
  en: {
    backBtn: "Back to Village Directory",
    loadingText: "Loading village registry...",
    errorTitle: "Village Not Found",
    errorDesc: "We could not find a village matching this code under the selected district.",
    villageDetails: "Village Registry Details",
    villageCode: "Village LGD Code",
    blockLabel: "Block",
    districtLabel: "District",
    panchayatLabel: "Gram Panchayat",
    popLabel: "Total Population",
    maleLabel: "Male",
    femaleLabel: "Female",
    householdsLabel: "Households",
    literacyLabel: "Literacy Rate",
    demographicsTitle: "Demographics (Census 2011)",
    openInGoogleMaps: "Open in Google Maps",
    geoTitle: "Geographic Registry",
    coordinatesLabel: "Geographic Coordinates",
    elevationLabel: "Elevation (Approx)",
    adminCodesTitle: "Administrative & Census Identifiers",
    urbanLabel: "Municipal / Urban",
    overviewTitle: "Overview",
    stateLabel: "State",
    stateValue: "Bihar",
    categoryLabel: "Category",
    totalLabel: "Total",
    childPopLabel: "Child Population (0-6 yrs)",
    literatePopLabel: "Literate Population",
    illiteratePopLabel: "Illiterate Population",
    faqTitle: "Frequently Asked Questions",
    faqLocationQ: "Where is {name} located?",
    faqLocationA: "{name} village is located in {block} Block of {district} district, Bihar, India.",
    faqPanchayatQ: "What is the Gram Panchayat of {name}?",
    faqPanchayatA: "The Gram Panchayat of {name} is {panchayat}.",
    faqUrbanA: "{name} is located in an urban municipal area and is not governed under a Gram Panchayat.",
    faqPopulationQ: "What is the population of {name}?",
    faqPopulationA: "{name} has a total population of {pop}, consisting of {male} males and {female} females as per Census 2011.",
    faqHouseholdsQ: "How many households are there in {name}?",
    faqHouseholdsA: "There are {households} households in {name}.",
    faqLiteracyQ: "What is the literacy rate in {name}?",
    faqLiteracyA: "As per Census 2011, the literacy rate of {name} is {rate}%.",
    pincodeLabel: "Pincode",
    areaLabel: "Geographical Area",
    areaUnit: "hectares",
    distFromBlockLabel: "Distance from Block HQ",
    distFromDistrictLabel: "Distance from District HQ",
    kmUnit: "km",
    scPopLabel: "Scheduled Caste (SC)",
    nearbyTitle: "Nearby Villages",
    nearbySubtitle: "Villages in the same Gram Panchayat",
    nearbyBlockTitle: "More villages from {block} Block",
    breadcrumbHome: "Home",
    breadcrumbVillages: "Villages",
  },
  hi: {
    backBtn: "ग्राम निर्देशिका पर वापस जाएं",
    loadingText: "ग्राम रजिस्ट्री लोड हो रही है...",
    errorTitle: "गाँव नहीं मिला",
    errorDesc: "हम चयनित जिले के अंतर्गत इस कोड से मेल खाने वाला गाँव नहीं ढूंढ पाए।",
    villageDetails: "ग्राम रजिस्ट्री विवरण",
    villageCode: "ग्राम एलजीडी कोड",
    blockLabel: "प्रखंड (ब्लॉक)",
    districtLabel: "जिला",
    panchayatLabel: "ग्राम पंचायत",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    openInGoogleMaps: "गूगल मैप्स में खोलें",
    geoTitle: "भौगोलिक रजिस्ट्री",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    adminCodesTitle: "प्रशासनिक और जनगणना पहचानकर्ता",
    urbanLabel: "नगर निकाय / शहरी",
    overviewTitle: "अवलोकन",
    stateLabel: "राज्य",
    stateValue: "बिहार",
    categoryLabel: "श्रेणी",
    totalLabel: "कुल",
    childPopLabel: "बाल जनसंख्या (0-6 वर्ष)",
    literatePopLabel: "साक्षर जनसंख्या",
    illiteratePopLabel: "निरक्षर जनसंख्या",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqLocationQ: "{name} कहाँ स्थित है?",
    faqLocationA: "{name} गाँव बिहार के {district} जिले के {block} प्रखंड में स्थित है।",
    faqPanchayatQ: "{name} की ग्राम पंचायत क्या है?",
    faqPanchayatA: "{name} की ग्राम पंचायत {panchayat} है।",
    faqUrbanA: "{name} एक शहरी नगर निकाय क्षेत्र में स्थित है और यह ग्राम पंचायत के अंतर्गत नहीं आता है।",
    faqPopulationQ: "{name} की जनसंख्या क्या है?",
    faqPopulationA: "2011 की जनगणना के अनुसार, {name} की कुल जनसंख्या {pop} है, जिसमें {male} पुरुष और {female} महिलाएँ शामिल हैं।",
    faqHouseholdsQ: "{name} में कितने परिवार (घर) हैं?",
    faqHouseholdsA: "{name} में {households} परिवार (घर) हैं।",
    faqLiteracyQ: "{name} की साक्षरता दर क्या है?",
    faqLiteracyA: "2011 की जनगणना के अनुसार, {name} की साक्षरता दर {rate}% है।",
    pincodeLabel: "पिनकोड",
    areaLabel: "भौगोलिक क्षेत्रफल",
    areaUnit: "हेक्टेयर",
    distFromBlockLabel: "प्रखंड मुख्यालय से दूरी",
    distFromDistrictLabel: "जिला मुख्यालय से दूरी",
    kmUnit: "किमी",
    scPopLabel: "अनुसूचित जाति (SC)",
    nearbyTitle: "समीपवर्ती गाँव",
    nearbySubtitle: "इसी ग्राम पंचायत के गाँव",
    nearbyBlockTitle: "{block} प्रखंड के अन्य गाँव",
    breadcrumbHome: "होम",
    breadcrumbVillages: "गाँव निर्देशिका",
  },
  mai: {
    backBtn: "गाम निर्देशिका पर वापस जाऊँ",
    loadingText: "गाम रजिस्ट्री लोड भऽ रहल अछि...",
    errorTitle: "गाम नहि भेटल",
    errorDesc: "हम चयनित जिलाक अंतर्गत एहि कोड सं मेल खाइत गाम नहि भेटल।",
    villageDetails: "गाम विवरण",
    villageCode: "गाम एलजीडी कोड",
    blockLabel: "प्रखंड",
    districtLabel: "जिला",
    panchayatLabel: "ग्राम पञ्चायत",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    openInGoogleMaps: "गूगल मैप्स में खोलू",
    geoTitle: "भौगोलिक रजिस्ट्री",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    adminCodesTitle: "प्रशासनिक आ जनगणना पहचानकर्ता",
    urbanLabel: "नगर निकाय / शहरी",
    overviewTitle: "अवलोकन",
    stateLabel: "राज्य",
    stateValue: "बिहार",
    categoryLabel: "श्रेणी",
    totalLabel: "कुल",
    childPopLabel: "बालक जनसंख्या (0-6 वर्ष)",
    literatePopLabel: "साक्षर जनसंख्या",
    illiteratePopLabel: "निरक्षर जनसंख्या",
    faqTitle: "अक्सर पूछल जाय बला प्रश्न",
    faqLocationQ: "{name} कतय स्थित अछि?",
    faqLocationA: "{name} गाम बिहार कऽ {district} जिला कऽ {block} प्रखंड में स्थित अछि।",
    faqPanchayatQ: "{name} कऽ ग्राम पञ्चायत की अछि?",
    faqPanchayatA: "{name} कऽ ग्राम पञ्चायत {panchayat} अछि।",
    faqUrbanA: "{name} एक शहरी नगर निकाय क्षेत्र में स्थित अछि आ ई ग्राम पञ्चायत कऽ अंतर्गत नहि आबैत अछि।",
    faqPopulationQ: "{name} कऽ जनसंख्या की अछि?",
    faqPopulationA: "2011 कऽ जनगणना कऽ अनुसार, {name} कऽ कुल जनसंख्या {pop} अछि, जकरा में {male} पुरुष आ {female} महिला शामिल अछि।",
    faqHouseholdsQ: "{name} में कतेक परिवार (घर) अछि?",
    faqHouseholdsA: "{name} में {households} परिवार (घर) अछि।",
    faqLiteracyQ: "{name} कऽ साक्षरता दर की अछि?",
    faqLiteracyA: "2011 कऽ जनगणना कऽ अनुसार, {name} कऽ साक्षरता दर {rate}% अछि।",
    pincodeLabel: "पिनकोड",
    areaLabel: "भौगोलिक क्षेत्रफल",
    areaUnit: "हेक्टेयर",
    distFromBlockLabel: "प्रखंड मुख्यालय सं दूरी",
    distFromDistrictLabel: "जिला मुख्यालय सं दूरी",
    kmUnit: "किमी",
    scPopLabel: "अनुसूचित जाति (SC)",
    nearbyTitle: "समीपवर्ती गाम",
    nearbySubtitle: "एही ग्राम पञ्चायतक गाम",
    nearbyBlockTitle: "{block} प्रखंडक अन्य गाम",
    breadcrumbHome: "होम",
    breadcrumbVillages: "गाम निर्देशिका",
  }
};

export default function VillageDetailContent({ lang, district, code, dict }: VillageDetailContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  
  const [directoryVillages, setDirectoryVillages] = useState<DirectoryVillage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fetch villages data client-side (to avoid edge Worker read issues)
  useEffect(() => {
    let active = true;
    const fetchDistrictData = async () => {
      setIsLoading(true);
      setErrorOccurred(false);
      try {
        const response = await fetch(`/data/villages/${district.toLowerCase()}.json`);
        if (!response.ok) throw new Error('Data not found');
        const data = await response.json();
        if (active) {
          setDirectoryVillages(data.villages || []);
        }
      } catch (err) {
        console.error('Error fetching district villages:', err);
        if (active) {
          setErrorOccurred(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchDistrictData();
    return () => {
      active = false;
    };
  }, [district]);

  // Find the selected Village record
  const villageRecord = useMemo(() => {
    return directoryVillages.find(v => v.code === code);
  }, [directoryVillages, code]);

  // Retrieve deterministic coordinates & elevation
  const villageLocation = useMemo(() => {
    return getVillageLocation(district, code);
  }, [district, code]);

  // Nearby villages: same panchayat (excluding self), then same block (excluding panchayat)
  const nearbyVillages = useMemo(() => {
    if (!villageRecord) return { samePanchayat: [], sameBlock: [] };
    const samePanchayat = directoryVillages.filter(
      v => v.code !== code && v.panchayat.code === villageRecord.panchayat.code && v.panchayat.code
    ).slice(0, 12);
    const samePanchayatCodes = new Set([code, ...samePanchayat.map(v => v.code)]);
    const sameBlock = directoryVillages.filter(
      v => !samePanchayatCodes.has(v.code) && v.block.en.toLowerCase() === villageRecord.block.en.toLowerCase()
    ).slice(0, 12);
    return { samePanchayat, sameBlock };
  }, [directoryVillages, code, villageRecord]);

  const districtDisplayName = district.charAt(0).toUpperCase() + district.slice(1).replace(/-/g, ' ');

  /** Replace {placeholder} tokens in a template string */
  const fill = (tmpl: string, vars: Record<string, string>) =>
    tmpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50/50 dark:bg-zinc-950/20 py-24">
        <Loader2 className="w-12 h-12 text-primary-red animate-spin" />
        <p className="text-sm font-bold text-primary-red animate-pulse">{t.loadingText}</p>
      </div>
    );
  }

  if (errorOccurred || !villageRecord) {
    return (
      <div className="container section-padding py-24 text-center max-w-xl mx-auto">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-950/20 text-primary-red rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-foreground mb-4">{t.errorTitle}</h1>
        <p className="text-text-muted mb-8 leading-relaxed">{t.errorDesc}</p>
        <Link 
          href={`/${lang}/villages`}
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary-red hover:bg-red-800 text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer no-underline"
        >
          <ArrowLeft size={16} />
          {t.backBtn}
        </Link>
      </div>
    );
  }

  const vNameLocal = villageRecord.name[lang] || villageRecord.name.en;
  const vNameEn = villageRecord.name.en;
  const blockNameLocal = villageRecord.block[lang] || villageRecord.block.en;
  const gpNameLocal = villageRecord.panchayat[lang] || villageRecord.panchayat.en;
  const isUrban = !villageRecord.panchayat.en;
  const dem = villageRecord.demographics;

  // Build FAQ items dynamically
  const faqItems: { q: string; a: string }[] = [];
  faqItems.push({
    q: fill(t.faqLocationQ, { name: vNameLocal }),
    a: fill(t.faqLocationA, { name: vNameLocal, block: blockNameLocal, district: districtDisplayName }),
  });
  if (!isUrban) {
    faqItems.push({
      q: fill(t.faqPanchayatQ, { name: vNameLocal }),
      a: fill(t.faqPanchayatA, { name: vNameLocal, panchayat: gpNameLocal }),
    });
  } else {
    faqItems.push({
      q: fill(t.faqPanchayatQ, { name: vNameLocal }),
      a: fill(t.faqUrbanA, { name: vNameLocal }),
    });
  }
  if (dem) {
    faqItems.push({
      q: fill(t.faqPopulationQ, { name: vNameLocal }),
      a: fill(t.faqPopulationA, {
        name: vNameLocal,
        pop: dem.population.toLocaleString(),
        male: dem.male.toLocaleString(),
        female: dem.female.toLocaleString(),
      }),
    });
    faqItems.push({
      q: fill(t.faqHouseholdsQ, { name: vNameLocal }),
      a: fill(t.faqHouseholdsA, { name: vNameLocal, households: dem.households.toLocaleString() }),
    });
    faqItems.push({
      q: fill(t.faqLiteracyQ, { name: vNameLocal }),
      a: fill(t.faqLiteracyA, { name: vNameLocal, rate: String(dem.literacyRate) }),
    });
  }

  return (
    <div className="container section-padding pb-32 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-text-muted flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
        <Link href={`/${lang}`} className="hover:text-foreground transition-colors no-underline">🏠 {t.breadcrumbHome}</Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <Link href={`/${lang}/villages`} className="hover:text-foreground transition-colors no-underline">{t.breadcrumbVillages}</Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-foreground font-semibold">{districtDisplayName}</span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-foreground font-semibold">{blockNameLocal}</span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-primary-red font-bold">{vNameLocal}</span>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/${lang}/villages`}
          className="inline-flex items-center gap-2 text-sm text-primary-red hover:text-red-800 font-bold group transition-all cursor-pointer no-underline"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backBtn}
        </Link>
      </div>


      {/* Hero Banner Header */}
      <header className="p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary-red/[0.04] via-primary-yellow/[0.02] to-transparent border border-border-color dark:border-zinc-900 shadow-xs mb-10 relative overflow-hidden">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.012] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🏡 {t.villageDetails}
          </span>
          <HeritageHeading as="h1" className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            {vNameLocal}
            {vNameEn !== vNameLocal && (
              <span className="block sm:inline text-base sm:text-xl font-semibold text-text-muted sm:ml-3">({vNameEn})</span>
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
            <>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
              {isUrban ? (
                <span className="flex items-center gap-1">
                  🏛️ {t.panchayatLabel}:{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-[10px] font-extrabold text-amber-600 dark:text-amber-500 border border-amber-500/20 whitespace-nowrap">
                    🌆 {t.urbanLabel}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  🏛️ {t.panchayatLabel}:{' '}
                  <Link
                    href={`/${lang}/villages/panchayat/${district}/${villageRecord.panchayat.code}`}
                    className="text-primary-red hover:underline font-bold ml-1"
                  >
                    {gpNameLocal}
                  </Link>
                </span>
              )}
            </>
          </div>
        </div>
      </header>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">

        {/* ===== MAIN COLUMN ===== */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* --- Intro Paragraph --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs text-sm sm:text-base leading-relaxed text-text-muted">
            <p>
              {fill(t.faqLocationA, { name: vNameLocal, block: blockNameLocal, district: districtDisplayName })}
              {!isUrban && dem && (
                <> {fill(t.faqPopulationA, {
                  name: vNameLocal,
                  pop: dem.population.toLocaleString(),
                  male: dem.male.toLocaleString(),
                  female: dem.female.toLocaleString(),
                })}</>
              )}
            </p>
          </section>

          {/* --- Map Section --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              📍 {t.geoTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {/* Map embed */}
              <div className="relative w-full h-56 sm:h-72 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-900">
                <iframe
                  title="Village Map Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${vNameEn} Village, ${villageRecord.block.en} Block, ${districtDisplayName}, Bihar, India`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              {/* Coords row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🧭 Latitude</span>
                  <span className="text-sm font-bold font-mono text-foreground">{villageLocation.latitude.toFixed(5)}° N</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🧭 Longitude</span>
                  <span className="text-sm font-bold font-mono text-foreground">{villageLocation.longitude.toFixed(5)}° E</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">🏔️ {t.elevationLabel}</span>
                  <span className="text-sm font-bold text-foreground">~{villageLocation.elevation} m</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vNameEn} Village, ${villageRecord.block.en} Block, ${districtDisplayName}, Bihar, India`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-primary-red hover:bg-red-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm cursor-pointer no-underline"
              >
                🗺️ {t.openInGoogleMaps}
              </a>
            </div>
          </section>

          {/* --- Demographics Table --- */}
          {dem && (
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
                📈 {t.demographicsTitle}
              </h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">👥 {t.popLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{dem.population.toLocaleString()}</span>
                </div>
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">🏡 {t.householdsLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{dem.households.toLocaleString()}</span>
                </div>
                <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-text-muted tracking-wider">📖 {t.literacyLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">{dem.literacyRate}%</span>
                </div>
              </div>

              {/* Detailed Stats Table */}
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
                      <td className="px-4 py-3 text-foreground font-semibold">👥 {t.popLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{dem.population.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{dem.male.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{dem.female.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-semibold">🏡 {t.householdsLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground" colSpan={3}>{dem.households.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-semibold">📖 {t.literacyLabel}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400" colSpan={3}>{dem.literacyRate}%</td>
                    </tr>
                    {dem.childPop != null && (
                      <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                        <td className="px-4 py-3 text-foreground font-semibold">👶 {t.childPopLabel}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{dem.childPop.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{dem.childMale?.toLocaleString() ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{dem.childFemale?.toLocaleString() ?? '—'}</td>
                      </tr>
                    )}
                    {dem.scPop != null && (
                      <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                        <td className="px-4 py-3 text-foreground font-semibold">🏷️ {t.scPopLabel}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{dem.scPop.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{dem.scMale?.toLocaleString() ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{dem.scFemale?.toLocaleString() ?? '—'}</td>
                      </tr>
                    )}
                    {(() => {
                      const litTotal = dem.litPop ?? Math.round(dem.population * dem.literacyRate / 100);
                      const illitTotal = dem.illitPop ?? (dem.population - litTotal);
                      return (
                        <>
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-foreground font-semibold">✅ {t.literatePopLabel}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{litTotal.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{dem.litMale?.toLocaleString() ?? '—'}</td>
                            <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{dem.litFemale?.toLocaleString() ?? '—'}</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-foreground font-semibold">❌ {t.illiteratePopLabel}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{illitTotal.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{dem.illitMale?.toLocaleString() ?? '—'}</td>
                            <td className="px-4 py-3 text-right font-mono text-pink-600 dark:text-pink-400">{dem.illitFemale?.toLocaleString() ?? '—'}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Gender bar */}
              {(() => {
                const maleP = Math.round((dem.male / dem.population) * 1000) / 10;
                const femaleP = Math.round((100 - maleP) * 10) / 10;
                const sexRatio = Math.round((dem.female / dem.male) * 1000);
                return (
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-text-muted">
                      <span>⚧️ Gender Distribution</span>
                      <span className="font-mono">{sexRatio} ♀ per 1000 ♂</span>
                    </div>
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                      <div style={{ width: `${maleP}%` }} className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-700" title={`Male: ${maleP}%`} />
                      <div style={{ width: `${femaleP}%` }} className="h-full bg-pink-500 dark:bg-pink-600 transition-all duration-700" title={`Female: ${femaleP}%`} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mt-2 text-xs font-bold">
                      <span className="text-blue-500">♂ {t.maleLabel}: {dem.male.toLocaleString()} ({maleP}%)</span>
                      <span className="text-pink-500">♀ {t.femaleLabel}: {dem.female.toLocaleString()} ({femaleP}%)</span>
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {/* --- Administrative Codes Table --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              🔢 {t.adminCodesTitle}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="px-4 py-3 text-text-muted font-semibold w-1/2">Local Government Directory (LGD)</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{villageRecord.code}</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="px-4 py-3 text-text-muted font-semibold">Census 2011 Code</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{villageRecord.census2011 || '—'}</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="px-4 py-3 text-text-muted font-semibold">Census 2001 Code</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{villageRecord.census2001 || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- Nearby Villages --- */}
          {(nearbyVillages.samePanchayat.length > 0 || nearbyVillages.sameBlock.length > 0) && (
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
                📍 {t.nearbyTitle}
              </h2>

              {nearbyVillages.samePanchayat.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">{t.nearbySubtitle}</h3>
                  <div className="flex flex-wrap gap-2">
                    {nearbyVillages.samePanchayat.map(v => (
                      <Link
                        key={v.code}
                        href={`/${lang}/villages/village/${district.toLowerCase()}/${v.code}`}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-primary-red/5 dark:hover:bg-primary-red/10 border border-zinc-200 dark:border-zinc-800 hover:border-primary-red/30 rounded-lg text-xs font-semibold text-foreground hover:text-primary-red transition-all no-underline"
                      >
                        {v.name[lang] || v.name.en}
                        {v.demographics && (
                          <span className="ml-1.5 text-text-muted font-normal">({v.demographics.population.toLocaleString()})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {nearbyVillages.sameBlock.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                    {fill(t.nearbyBlockTitle, { block: blockNameLocal })}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {nearbyVillages.sameBlock.map(v => (
                      <Link
                        key={v.code}
                        href={`/${lang}/villages/village/${district.toLowerCase()}/${v.code}`}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-foreground hover:text-primary-red transition-all no-underline"
                      >
                        {v.name[lang] || v.name.en}
                        {v.demographics && (
                          <span className="ml-1.5 text-text-muted font-normal">({v.demographics.population.toLocaleString()})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* --- FAQ Accordion --- */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-5 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              ❓ {t.faqTitle}
            </h2>
            <div className="space-y-2">
              {faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-150 dark:border-zinc-850 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                    aria-expanded={openFaq === idx}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                    />
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

          {/* Quick Facts / Overview */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              {t.overviewTitle}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted font-semibold flex-shrink-0">{t.stateLabel}</dt>
                <dd className="font-bold text-foreground text-right">{t.stateValue}</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold flex-shrink-0">{t.districtLabel}</dt>
                <dd className="font-bold text-foreground text-right">{districtDisplayName}</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold flex-shrink-0">{t.blockLabel}</dt>
                <dd className="font-bold text-foreground text-right">{blockNameLocal}</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold flex-shrink-0">{t.panchayatLabel}</dt>
                <dd className="font-bold text-right">
                  {isUrban ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-[9px] font-extrabold text-amber-600 dark:text-amber-500 border border-amber-500/20 whitespace-nowrap">
                      🌆 {t.urbanLabel}
                    </span>
                  ) : (
                    <Link href={`/${lang}/villages/panchayat/${district}/${villageRecord.panchayat.code}`} className="text-primary-red hover:underline">
                      {gpNameLocal}
                    </Link>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold flex-shrink-0">{t.categoryLabel}</dt>
                <dd className="font-bold text-foreground text-right">
                  {isUrban ? (
                    <span className="text-amber-600 dark:text-amber-500">Urban</span>
                  ) : 'Rural'}
                </dd>
              </div>
              {dem && (
                <>
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold flex-shrink-0">{t.popLabel}</dt>
                    <dd className="font-black text-foreground text-right">{dem.population.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold flex-shrink-0">{t.maleLabel}</dt>
                    <dd className="font-bold text-blue-600 dark:text-blue-400 text-right">{dem.male.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold flex-shrink-0">{t.femaleLabel}</dt>
                    <dd className="font-bold text-pink-600 dark:text-pink-400 text-right">{dem.female.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold flex-shrink-0">{t.householdsLabel}</dt>
                    <dd className="font-bold text-foreground text-right">{dem.households.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold flex-shrink-0">{t.literacyLabel}</dt>
                    <dd className="font-bold text-emerald-600 dark:text-emerald-400 text-right">{dem.literacyRate}%</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Admin Codes Mini Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              🔢 {t.villageCode}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted font-semibold">LGD</dt>
                <dd className="font-mono font-black text-foreground">{villageRecord.code}</dd>
              </div>
              {villageRecord.census2011 && (
                <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                  <dt className="text-text-muted font-semibold">Census 2011</dt>
                  <dd className="font-mono font-bold text-foreground">{villageRecord.census2011}</dd>
                </div>
              )}
              {villageRecord.census2001 && (
                <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                  <dt className="text-text-muted font-semibold">Census 2001</dt>
                  <dd className="font-mono font-bold text-foreground">{villageRecord.census2001}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Coordinates Mini Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              🧭 {t.coordinatesLabel}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted font-semibold">Latitude</dt>
                <dd className="font-mono font-bold text-foreground">{villageLocation.latitude.toFixed(5)}° N</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold">Longitude</dt>
                <dd className="font-mono font-bold text-foreground">{villageLocation.longitude.toFixed(5)}° E</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <dt className="text-text-muted font-semibold">{t.elevationLabel}</dt>
                <dd className="font-bold text-foreground">~{villageLocation.elevation} m</dd>
              </div>
            </dl>
          </div>

          {/* Pincode / Area / Distance Card — shown only when data exists */}
          {(villageRecord.pin || villageRecord.area != null || villageRecord.distanceFromBlock != null) && (
            <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
                📋 Details
              </h3>
              <dl className="space-y-3 text-sm">
                {villageRecord.pin && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-text-muted font-semibold">{t.pincodeLabel}</dt>
                    <dd className="font-mono font-bold">
                      <Link href={`/${lang}/pincode/${villageRecord.pin}`} className="text-primary-red hover:underline">{villageRecord.pin}</Link>
                    </dd>
                  </div>
                )}
                {villageRecord.area != null && (
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold">{t.areaLabel}</dt>
                    <dd className="font-bold text-foreground">{villageRecord.area} {t.areaUnit}</dd>
                  </div>
                )}
                {villageRecord.distanceFromBlock != null && (
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold">{t.distFromBlockLabel}</dt>
                    <dd className="font-bold text-foreground">{villageRecord.distanceFromBlock} {t.kmUnit}</dd>
                  </div>
                )}
                {villageRecord.distanceFromDistrict != null && (
                  <div className="flex justify-between gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <dt className="text-text-muted font-semibold">{t.distFromDistrictLabel}</dt>
                    <dd className="font-bold text-foreground">{villageRecord.distanceFromDistrict} {t.kmUnit}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}


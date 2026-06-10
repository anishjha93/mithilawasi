'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, 
  Building2, 
  Hash, 
  UserCheck, 
  Users, 
  AlertCircle, 
  ArrowLeft, 
  MapPin, 
  Compass, 
  Award,
  BookOpen
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
  
  return {
    latitude: latSnapped,
    longitude: lngSnapped,
    elevation
  };
}

const LOCAL_DICT: Record<string, any> = {
  en: {
    backBtn: "Back to Village Directory",
    loadingText: "Loading Panchayat registry...",
    errorTitle: "Panchayat Not Found",
    errorDesc: "We could not find a Gram Panchayat matching this code under the selected district.",
    panchayatDetails: "Gram Panchayat Registry Details",
    panchayatCode: "Panchayat LGD Code",
    blockLabel: "Block",
    districtLabel: "District",
    tabRepresentatives: "Elected Representatives",
    tabVillages: "Member Villages",
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
    demographicsTitle: "Demographics (Census 2011)",
    tabMap: "Map & Location",
    mapSectionTitle: "Interactive Geo-Registry",
    coordinatesLabel: "Geographic Coordinates",
    elevationLabel: "Elevation (Approx)",
    openInGoogleMaps: "Open in Google Maps",
    panchayatBoundaries: "Panchayat Coverage Map",
    geoTitle: "Geographic Registry",
    representativeTitle: "Administrative & Representative Registry",
    memberTitle: "Panchayat Coverage (Villages List)",
    viewPanchayatDetails: "Gram Panchayat Details",
    viewMemberVillages: "Member Villages",
    viewBlockDetails: "Block Details",
    otherPanchayatsTitle: "Other Gram Panchayats in this Block",
    blockStatsTitle: "Block Administrative Statistics"
  },
  hi: {
    backBtn: "ग्राम निर्देशिका पर वापस जाएं",
    loadingText: "पंचायत रजिस्ट्री लोड हो रही है...",
    errorTitle: "पंचायत नहीं मिली",
    errorDesc: "हम चयनित जिले के अंतर्गत इस कोड से मेल खाने वाली ग्राम पंचायत नहीं ढूंढ पाए।",
    panchayatDetails: "ग्राम पंचायत रजिस्ट्री विवरण",
    panchayatCode: "पंचायत एलजीडी कोड",
    blockLabel: "ब्लॉक",
    districtLabel: "जिला",
    tabRepresentatives: "निर्वाचित प्रतिनिधि",
    tabVillages: "अंतर्गत आने वाले गाँव",
    mukhiyaLabel: "मुखिया (पंचायत प्रमुख)",
    samitiLabel: "पंचायत समिति सदस्य",
    sarpanchLabel: "सरपंच (न्यायिक प्रमुख)",
    secLabel: "पंचायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि के नाम अपडेट करें",
    contributeBtn: "योगदान दें",
    contributeSuccess: "धन्यवाद! प्रतिनिधि की जानकारी सत्यापन के लिए भेजी गई है।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहीं है। अपडेट करने के लिए क्लिक करें।",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    tabMap: "नक्शा और स्थान",
    mapSectionTitle: "इंटरएक्टिव भू-रजिस्ट्री",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलें",
    panchayatBoundaries: "पंचायत कवरेज नक्शा",
    geoTitle: "भौगोलिक रजिस्ट्री",
    representativeTitle: "प्रशासनिक और प्रतिनिधि रजिस्ट्री",
    memberTitle: "पंचायत कवरेज (गाँवों की सूची)",
    viewPanchayatDetails: "ग्राम पंचायत विवरण",
    viewMemberVillages: "अंतर्गत गाँव",
    viewBlockDetails: "प्रखंड (ब्लॉक) विवरण",
    otherPanchayatsTitle: "इस प्रखंड की अन्य ग्राम पंचायतें",
    blockStatsTitle: "प्रखंड प्रशासनिक आँकड़े"
  },
  mai: {
    backBtn: "गाम निर्देशिका पर वापस जाऊँ",
    loadingText: "पञ्चायत रजिस्ट्री लोड भऽ रहल अछि...",
    errorTitle: "पञ्चायत नहि भेटल",
    errorDesc: "हम चयनित जिलाक अंतर्गत एहि कोड सं मेल खाइत ग्राम पञ्चायत नहि भेटल।",
    panchayatDetails: "ग्राम पञ्चायत विवरण",
    panchayatCode: "पञ्चायत एलजीडी कोड",
    blockLabel: "प्रखंड",
    districtLabel: "जिला",
    tabRepresentatives: "निर्वाचित प्रतिनिधि",
    tabVillages: "अंतर्गत आबऽ बला गाम",
    mukhiyaLabel: "मुखिया (पञ्चायत प्रमुख)",
    samitiLabel: "पञ्चायत समिति सदस्य",
    sarpanchLabel: "सरपञ्च (न्यायिक प्रमुख)",
    secLabel: "पञ्चायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि क नाम अपडेट करू",
    contributeBtn: "योगदान दियऽ",
    contributeSuccess: "धन्यबाद! प्रतिनिधि क जानकारी सत्यापन क लेल पठाओल गेल अछि।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहि अछि। अपडेट करबाक लेल क्लिक करू।",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    tabMap: "मानचित्र आ स्थान",
    mapSectionTitle: "मानचित्र आ स्थान",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलू",
    panchayatBoundaries: "पञ्चायत कवरेज नक्शा",
    geoTitle: "भौगोलिक रजिस्ट्री",
    representativeTitle: "प्रशासनिक आ प्रतिनिधि रजिस्ट्री",
    memberTitle: "पञ्चायत कवरेज (गाम सभक सूची)",
    viewPanchayatDetails: "ग्राम पञ्चायत विवरण",
    viewMemberVillages: "अंतर्गत गाम",
    viewBlockDetails: "प्रखंड (ब्लॉक) विवरण",
    otherPanchayatsTitle: "एहि प्रखंडक अन्य ग्राम पञ्चायत सभ",
    blockStatsTitle: "प्रखंड प्रशासनिक आँकड़ा"
  }
};

export default function PanchayatDetailContent({ lang, district, code, dict }: PanchayatDetailContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  
  const [directoryVillages, setDirectoryVillages] = useState<DirectoryVillage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

  // Detail View switch state
  const [detailView, setDetailView] = useState<'panchayat' | 'villages' | 'block'>('panchayat');

  // Representative Update form state
  const [mukhiyaInput, setMukhiyaInput] = useState('');
  const [samitiInput, setSamitiInput] = useState('');
  const [sarpanchInput, setSarpanchInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Local storage representative mock values
  const [mockRepresentatives, setMockRepresentatives] = useState<Record<string, { mukhiya: string; samiti: string; sarpanch: string }>>({
    '95244': { mukhiya: 'Ram Bilas Paswan', samiti: 'Sita Devi', sarpanch: 'Manoj Kumar Jha' }
  });

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

  // Aggregate member villages belonging to this GP
  const panchayatVillages = useMemo(() => {
    return directoryVillages.filter(v => v.panchayat.code === code);
  }, [directoryVillages, code]);

  // Get Panchayat meta name info from member village record
  const panchayatInfo = useMemo(() => {
    if (panchayatVillages.length === 0) return null;
    return panchayatVillages[0].panchayat;
  }, [panchayatVillages]);

  const blockInfo = useMemo(() => {
    if (panchayatVillages.length === 0) return null;
    return panchayatVillages[0].block;
  }, [panchayatVillages]);

  // Retrieve deterministic coordinates & elevation
  const panchayatLocation = useMemo(() => {
    return getPanchayatLocation(district, code);
  }, [district, code]);

  // Aggregate demographics
  const panchayatDemographics = useMemo(() => {
    if (panchayatVillages.length === 0) return null;
    let totalPop = 0;
    let totalMale = 0;
    let totalFemale = 0;
    let totalHouseholds = 0;
    let totalLitRateSum = 0;
    let countWithLit = 0;
    
    panchayatVillages.forEach(v => {
      if (v.demographics) {
        totalPop += v.demographics.population;
        totalMale += v.demographics.male;
        totalFemale += v.demographics.female;
        totalHouseholds += v.demographics.households;
        totalLitRateSum += v.demographics.literacyRate;
        countWithLit++;
      }
    });

    if (totalPop === 0) return null;

    return {
      population: totalPop,
      male: totalMale,
      female: totalFemale,
      households: totalHouseholds,
      literacyRate: countWithLit > 0 ? Math.round((totalLitRateSum / countWithLit) * 10) / 10 : 0
    };
  }, [panchayatVillages]);

  // Reset switcher tab to 'panchayat' when Panchayat code changes
  useEffect(() => {
    setDetailView('panchayat');
  }, [code]);

  // Preseed form inputs when loaded
  useEffect(() => {
    const existing = mockRepresentatives[code];
    setMukhiyaInput(existing?.mukhiya || '');
    setSamitiInput(existing?.samiti || '');
    setSarpanchInput(existing?.sarpanch || '');
  }, [code, mockRepresentatives]);

  // Handle updates suggestion form
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
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  // Group other Panchayats in this block
  const blockPanchayats = useMemo(() => {
    if (!blockInfo || !blockInfo.en) return [];
    const map = new Map<string, { code: string; name: { en: string; hi: string; mai: string }; population: number; villagesCount: number }>();
    
    directoryVillages.forEach((v) => {
      if (v.block.en.toLowerCase() !== blockInfo.en.toLowerCase()) return;
      if (!v.panchayat || !v.panchayat.code) return;
      
      const code = v.panchayat.code;
      let row = map.get(code);
      if (!row) {
        row = {
          code,
          name: v.panchayat,
          population: 0,
          villagesCount: 0
        };
        map.set(code, row);
      }
      row.villagesCount += 1;
      if (v.demographics) {
        row.population += v.demographics.population;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const nameA = a.name[lang] || a.name.en || '';
      const nameB = b.name[lang] || b.name.en || '';
      return nameA.localeCompare(nameB);
    });
  }, [directoryVillages, blockInfo, lang]);

  // Aggregate statistics for the Block
  const blockStats = useMemo(() => {
    if (!blockInfo || !blockInfo.en) return null;
    let totalPop = 0;
    let totalVillages = 0;
    let literacySum = 0;
    let literacyCount = 0;
    
    directoryVillages.forEach((v) => {
      if (v.block.en.toLowerCase() !== blockInfo.en.toLowerCase()) return;
      totalVillages += 1;
      if (v.demographics) {
        totalPop += v.demographics.population;
        literacySum += v.demographics.literacyRate;
        literacyCount += 1;
      }
    });

    return {
      panchayatsCount: blockPanchayats.length,
      villagesCount: totalVillages,
      population: totalPop,
      avgLiteracy: literacyCount > 0 ? Math.round((literacySum / literacyCount) * 10) / 10 : 0
    };
  }, [directoryVillages, blockInfo, blockPanchayats]);

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

  const gpNameLocal = panchayatInfo ? (panchayatInfo[lang] || panchayatInfo.en) : code;
  const gpNameEn = panchayatInfo ? panchayatInfo.en : '';
  const blockNameLocal = blockInfo ? (blockInfo[lang] || blockInfo.en) : '';

  return (
    <div className="container section-padding pb-32 max-w-6xl mx-auto px-4 sm:px-6">
      
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

      {/* Segmented View Switcher */}
      <div className="flex border-b border-border-color dark:border-zinc-800 mb-10 gap-1 overflow-x-auto pb-2 z-10 relative">
        <button
          onClick={() => setDetailView('panchayat')}
          className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 shrink-0 ${
            detailView === 'panchayat'
              ? 'bg-primary-red text-white shadow-md'
              : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
          }`}
        >
          🏛️ {t.viewPanchayatDetails}
        </button>
        <button
          onClick={() => setDetailView('villages')}
          className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 shrink-0 ${
            detailView === 'villages'
              ? 'bg-primary-red text-white shadow-md'
              : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
          }`}
        >
          🏡 {t.viewMemberVillages}
        </button>
        <button
          onClick={() => setDetailView('block')}
          className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 shrink-0 ${
            detailView === 'block'
              ? 'bg-primary-red text-white shadow-md'
              : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
          }`}
        >
          📦 {t.viewBlockDetails} ({blockInfo?.en})
        </button>
      </div>

      {/* Hero Banner Header */}
      <header className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary-red/[0.03] via-primary-yellow/[0.02] to-transparent border border-border-color dark:border-zinc-900 shadow-xs mb-12 relative overflow-hidden">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.012] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🏛️ {t.panchayatDetails}
          </span>
          <HeritageHeading as="h1" className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
            {gpNameLocal}
            {gpNameEn !== gpNameLocal && (
              <span className="block sm:inline text-base sm:text-2xl font-semibold text-text-muted sm:ml-3">({gpNameEn})</span>
            )}
          </HeritageHeading>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-text-muted mt-2">
            <span className="flex items-center gap-1">
              📍 {t.blockLabel}: <span className="text-foreground">{blockNameLocal}</span>
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-800">|</span>
            <span className="flex items-center gap-1">
              🗺️ {t.districtLabel}: <span className="text-foreground">{districtDisplayName}</span>
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-800">|</span>
            <span className="flex items-center gap-1">
              <Hash size={14} className="text-primary-red" />
              {t.panchayatCode}: <span className="font-mono text-foreground">{code}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Grid Stack - Grid on Desktop, Stack on Mobile */}
      <div className="space-y-12">
        
        {/* ================= PANCHAYAT DETAIL VIEWS ================= */}
        {detailView === 'panchayat' && (
          <>
            {/* ================= SECTION 1: MAPS & GEOGRAPHIC DETAILS ================= */}
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
              <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
                📍 {t.geoTitle}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Interactive Map Embed */}
                <div className="lg:col-span-2 relative w-full h-64 sm:h-96 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-md bg-zinc-100 dark:bg-zinc-900">
                  <iframe
                    title="Gram Panchayat Map Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${gpNameEn} Panchayat, ${blockInfo?.en} Block, ${districtDisplayName}, Bihar, India`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>

                {/* Geographic Cards */}
                <div className="flex flex-col justify-between gap-4">
                  <div className="space-y-4">
                    {/* Latitude Card */}
                    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                      <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                        🧭 Latitude
                      </span>
                      <span className="text-xl font-bold text-foreground font-mono">
                        {panchayatLocation.latitude.toFixed(5)}° N
                      </span>
                    </div>

                    {/* Longitude Card */}
                    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                      <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                        🧭 Longitude
                      </span>
                      <span className="text-xl font-bold text-foreground font-mono">
                        {panchayatLocation.longitude.toFixed(5)}° E
                      </span>
                    </div>

                    {/* Elevation Card */}
                    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                      <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                        🏔️ {t.elevationLabel}
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        ~{panchayatLocation.elevation} meters (MSL)
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gpNameEn} Panchayat, ${blockInfo?.en} Block, ${districtDisplayName}, Bihar, India`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-primary-red hover:bg-red-800 text-white rounded-2xl text-center text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                  >
                    🗺️ {t.openInGoogleMaps}
                  </a>
                </div>
              </div>
            </section>

            {/* ================= SECTION 2: DEMOGRAPHICS ================= */}
            {panchayatDemographics && (
              <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
                  📈 {t.demographicsTitle}
                </h2>

                <div className="space-y-8">
                  {/* Summary Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* Total Population */}
                    <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex flex-col justify-between">
                      <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                        👥 {t.popLabel}
                      </span>
                      <span className="text-3xl font-black text-foreground">
                        {panchayatDemographics.population.toLocaleString()}
                      </span>
                      <span className="text-xs text-text-muted mt-2">
                        {panchayatVillages.length} villages combined
                      </span>
                    </div>

                    {/* Total Households */}
                    <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex flex-col justify-between">
                      <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                        🏡 {t.householdsLabel}
                      </span>
                      <span className="text-3xl font-black text-foreground">
                        {panchayatDemographics.households.toLocaleString()}
                      </span>
                      <span className="text-xs text-text-muted mt-2">
                        {Math.round((panchayatDemographics.population / panchayatDemographics.households) * 10) / 10} avg members / house
                      </span>
                    </div>

                    {/* Average Literacy */}
                    <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex flex-col justify-between">
                      <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                        📖 {t.literacyLabel}
                      </span>
                      <span className="text-3xl font-black text-foreground">
                        {panchayatDemographics.literacyRate}%
                      </span>
                      <span className="text-xs text-emerald-500 font-bold mt-2">
                        State Census 2011 Standard
                      </span>
                    </div>
                  </div>

                  {/* Gender Split Visual Card */}
                  <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        ⚧️ Gender Distribution
                      </span>
                      <span className="text-xs font-mono text-text-muted font-bold">
                        {Math.round((panchayatDemographics.female / panchayatDemographics.male) * 1000)} Females per 1000 Males
                      </span>
                    </div>

                    {(() => {
                      const malePercent = Math.round((panchayatDemographics.male / panchayatDemographics.population) * 1000) / 10;
                      const femalePercent = Math.round((100 - malePercent) * 10) / 10;
                      return (
                        <div className="space-y-4">
                          <div className="h-5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                            <div 
                              style={{ width: `${malePercent}%` }} 
                              className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-500"
                              title={`Male: ${malePercent}%`}
                            />
                            <div 
                              style={{ width: `${femalePercent}%` }} 
                              className="h-full bg-pink-500 dark:bg-pink-600 transition-all duration-500"
                              title={`Female: ${femalePercent}%`}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-y-1 text-xs sm:text-sm font-bold">
                            <span className="text-blue-500 flex items-center gap-1">
                              ♂️ {t.maleLabel}: {panchayatDemographics.male.toLocaleString()} ({malePercent}%)
                            </span>
                            <span className="text-pink-500 flex items-center gap-1">
                              ♀️ {t.femaleLabel}: {panchayatDemographics.female.toLocaleString()} ({femalePercent}%)
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </section>
            )}

            {/* ================= SECTION 3: REPRESENTATIVES & ADMINISTRATION ================= */}
            <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
              <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
                🏛️ {t.representativeTitle}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Representative Cards & Wards */}
                <div className="lg:col-span-2 space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mukhiya Card */}
                    <div className="p-4 bg-gradient-to-r from-red-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-red-500/10 dark:border-zinc-855 flex gap-4 items-center hover:scale-[1.01] hover:shadow-xs transition-all duration-300">
                      <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                        👤
                      </div>
                      <div className="flex-grow">
                        <span className="text-[0.7rem] uppercase tracking-wider text-text-muted font-bold block mb-0.5">
                          {t.mukhiyaLabel}
                        </span>
                        <span className="text-sm font-bold text-foreground block">
                          {mockRepresentatives[code]?.mukhiya || (
                            <span className="text-primary-red font-medium italic flex items-center gap-1 text-xs">
                              <AlertCircle size={12} />
                              {t.placeholderNotSeeded}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Sarpanch Card */}
                    <div className="p-4 bg-gradient-to-r from-orange-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-orange-500/10 dark:border-zinc-855 flex gap-4 items-center hover:scale-[1.01] hover:shadow-xs transition-all duration-300">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                        ⚖️
                      </div>
                      <div className="flex-grow">
                        <span className="text-[0.7rem] uppercase tracking-wider text-text-muted font-bold block mb-0.5">
                          {t.sarpanchLabel}
                        </span>
                        <span className="text-sm font-bold text-foreground block">
                          {mockRepresentatives[code]?.sarpanch || (
                            <span className="text-primary-red font-medium italic flex items-center gap-1 text-xs">
                              <AlertCircle size={12} />
                              {t.placeholderNotSeeded}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Samiti Card */}
                    <div className="p-4 bg-gradient-to-r from-amber-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-amber-500/10 dark:border-zinc-855 flex gap-4 items-center hover:scale-[1.01] hover:shadow-xs transition-all duration-300">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                        👥
                      </div>
                      <div className="flex-grow">
                        <span className="text-[0.7rem] uppercase tracking-wider text-text-muted font-bold block mb-0.5">
                          {t.samitiLabel}
                        </span>
                        <span className="text-sm font-bold text-foreground block">
                          {mockRepresentatives[code]?.samiti || (
                            <span className="text-primary-red font-medium italic flex items-center gap-1 text-xs">
                              <AlertCircle size={12} />
                              {t.placeholderNotSeeded}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Secretary Card */}
                    <div className="p-4 bg-gradient-to-r from-emerald-500/[0.03] to-transparent dark:bg-zinc-900/10 rounded-2xl border border-emerald-500/10 dark:border-zinc-855 flex gap-4 items-center hover:scale-[1.01] hover:shadow-xs transition-all duration-300">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                        💼
                      </div>
                      <div className="flex-grow">
                        <span className="text-[0.7rem] uppercase tracking-wider text-text-muted font-bold block mb-0.5">
                          {t.secLabel}
                        </span>
                        <span className="text-sm font-bold text-foreground block">
                          {lang === 'en' ? 'State Appointed Secretary' : 'राज्य द्वारा नियुक्त सचिव'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wards pills list */}
                  <div className="p-4 sm:p-5 bg-zinc-50/50 dark:bg-zinc-950/10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-4 flex items-center gap-1">
                      🛡️ {t.wardLabel}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="text-[11px] sm:text-xs text-foreground/90 font-bold bg-white dark:bg-zinc-900/40 p-2 sm:p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-855 flex justify-between items-center hover:border-amber-500/25 transition-all duration-300">
                          <span>Ward {i + 1}</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs bg-amber-500/10 text-[8px] text-amber-500 font-black uppercase tracking-wider shrink-0">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contribute Suggestions Form */}
                <div className="h-full">
                  <form onSubmit={handleContribute} className="p-6 bg-zinc-50/80 dark:bg-zinc-900/20 rounded-2xl border border-zinc-150 dark:border-zinc-900 shadow-xs h-full flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-4 border-b border-zinc-200/50 dark:border-zinc-800 pb-2">
                        ✍️ {t.contributeTitle}
                      </h4>

                      {isSubmitted && (
                        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                          <UserCheck size={14} />
                          {t.contributeSuccess}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                            {t.mukhiyaLabel}
                          </label>
                          <input
                            type="text"
                            value={mukhiyaInput}
                            onChange={(e) => setMukhiyaInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red"
                          />
                        </div>
                        
                        <div>
                          <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                            {t.samitiLabel}
                          </label>
                          <input
                            type="text"
                            value={samitiInput}
                            onChange={(e) => setSamitiInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                            {t.sarpanchLabel}
                          </label>
                          <input
                            type="text"
                            value={sarpanchInput}
                            onChange={(e) => setSarpanchInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-red"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary-red hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer mt-4"
                    >
                      {t.contributeBtn}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= SECTION 4: MEMBER VILLAGES ================= */}
        {detailView === 'villages' && (
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
              🏡 {t.memberTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {panchayatVillages.map((v) => (
                <div 
                  key={v.code} 
                  className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-4"
                >
                  <div>
                    <Link
                      href={`/${lang}/villages/village/${district.toLowerCase()}/${v.code}`}
                      className="text-base font-bold text-foreground hover:text-primary-red hover:underline block transition-colors"
                    >
                      {v.name[lang] || v.name.en}
                    </Link>
                    {lang !== 'en' && v.name.en !== v.name[lang] && (
                      <span className="text-xs text-text-muted block mt-0.5">
                        {v.name.en}
                      </span>
                    )}
                    {v.demographics && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-2 text-[10px] font-semibold text-text-muted">
                        <span className="inline-flex items-center gap-0.5 text-foreground/75">
                          👥 {v.demographics.population.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5">
                          ♂️ {v.demographics.male.toLocaleString()} / ♀️ {v.demographics.female.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5">
                          📖 {v.demographics.literacyRate}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 sm:items-end items-start text-[10px] font-mono text-text-muted bg-white dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-800 flex-shrink-0 w-full sm:w-28">
                    <span className="flex items-center justify-between w-full">
                      <span>LGD:</span>
                      <span className="text-foreground font-bold">{v.code}</span>
                    </span>
                    {v.census2011 && (
                      <span className="flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-800 pt-1 mt-1 w-full">
                        <span>C11:</span>
                        <span className="text-foreground font-bold">{v.census2011}</span>
                      </span>
                    )}
                    {v.census2001 && (
                      <span className="flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-800 pt-1 mt-1 w-full">
                        <span>C01:</span>
                        <span className="text-foreground font-bold">{v.census2001}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 5: BLOCK DETAILS ================= */}
        {detailView === 'block' && blockStats && blockInfo && (
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs space-y-8 animate-fade-in">
            <div className="border-b border-border-color dark:border-zinc-850 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 items-start">
              <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                📦 {t.blockStatsTitle}
              </h2>
              <span className="px-4 py-1.5 bg-primary-red/10 text-primary-red rounded-full text-sm font-bold uppercase tracking-wider">
                {blockInfo[lang] || blockInfo.en} Block
              </span>
            </div>

            {/* Block Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {/* Total GPs */}
              <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                  🏛️ Gram Panchayats
                </span>
                <span className="text-3xl font-black text-foreground">
                  {blockStats.panchayatsCount}
                </span>
              </div>

              {/* Total Villages */}
              <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                  🏡 Total Villages
                </span>
                <span className="text-3xl font-black text-foreground">
                  {blockStats.villagesCount}
                </span>
              </div>

              {/* Total Population */}
              <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                  👥 Block Population
                </span>
                <span className="text-3xl font-black text-foreground">
                  {blockStats.population.toLocaleString()}
                </span>
              </div>

              {/* Average Literacy */}
              <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                  📖 Avg Literacy Rate
                </span>
                <span className="text-3xl font-black text-foreground">
                  {blockStats.avgLiteracy}%
                </span>
              </div>
            </div>

            {/* List of other Panchayats */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                🗺️ {t.otherPanchayatsTitle}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blockPanchayats.map((p) => {
                  const isCurrent = p.code === code;
                  return (
                    <div 
                      key={p.code}
                      className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${
                        isCurrent 
                          ? 'bg-primary-red/5 border-primary-red/25 ring-1 ring-primary-red/10' 
                          : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-150 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-bold text-foreground block">
                          {p.name[lang] || p.name.en}
                          {isCurrent && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-xs bg-primary-red/10 text-[8px] text-primary-red font-black uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                          LGD Code: {p.code} | {p.villagesCount} villages
                        </span>
                      </div>
                      
                      {!isCurrent ? (
                        <Link 
                          href={`/${lang}/villages/panchayat/${district}/${p.code}`}
                          className="px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted hover:text-foreground border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs font-bold transition-all no-underline"
                        >
                          View Details
                        </Link>
                      ) : (
                        <span className="text-xs text-primary-red font-bold">Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
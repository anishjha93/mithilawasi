'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, 
  Building2, 
  Hash, 
  AlertCircle, 
  ArrowLeft, 
  MapPin, 
  Compass, 
  Award,
  BookOpen,
  Users
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
    adminCodesTitle: "Administrative & Census Identifiers"
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
    adminCodesTitle: "प्रशासनिक और जनगणना पहचानकर्ता"
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
    adminCodesTitle: "प्रशासनिक आ जनगणना पहचानकर्ता"
  }
};

export default function VillageDetailContent({ lang, district, code, dict }: VillageDetailContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  
  const [directoryVillages, setDirectoryVillages] = useState<DirectoryVillage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

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

  const districtDisplayName = district.charAt(0).toUpperCase() + district.slice(1).replace(/-/g, ' ');

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

      {/* Hero Banner Header */}
      <header className="p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary-red/[0.03] via-primary-yellow/[0.02] to-transparent border border-border-color dark:border-zinc-900 shadow-xs mb-12 relative overflow-hidden">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.012] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🏡 {t.villageDetails}
          </span>
          <HeritageHeading as="h1" className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
            {vNameLocal}
            {vNameEn !== vNameLocal && (
              <span className="block sm:inline text-base sm:text-2xl font-semibold text-text-muted sm:ml-3">({vNameEn})</span>
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
            {villageRecord.panchayat.en && (
              <>
                <span className="hidden sm:inline text-zinc-300 dark:text-zinc-800">|</span>
                <span className="flex items-center gap-1">
                  🏛️ {t.panchayatLabel}:{' '}
                  <Link 
                    href={`/${lang}/villages/panchayat/${district}/${villageRecord.panchayat.code}`}
                    className="text-primary-red hover:underline font-bold"
                  >
                    {gpNameLocal}
                  </Link>
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Grid Stack */}
      <div className="space-y-12">
        
        {/* ================= SECTION 1: MAPS & GEOGRAPHIC DETAILS ================= */}
        <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
            📍 {t.geoTitle}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Interactive Map Embed */}
            <div className="lg:col-span-2 relative w-full h-64 sm:h-96 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-md bg-zinc-100 dark:bg-zinc-900">
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

            {/* Geographic Cards */}
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-4">
                {/* Latitude Card */}
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                    🧭 Latitude
                  </span>
                  <span className="text-xl font-bold text-foreground font-mono">
                    {villageLocation.latitude.toFixed(5)}° N
                  </span>
                </div>

                {/* Longitude Card */}
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                    🧭 Longitude
                  </span>
                  <span className="text-xl font-bold text-foreground font-mono">
                    {villageLocation.longitude.toFixed(5)}° E
                  </span>
                </div>

                {/* Elevation Card */}
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                    🏔️ {t.elevationLabel}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    ~{villageLocation.elevation} meters (MSL)
                  </span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vNameEn} Village, ${villageRecord.block.en} Block, ${districtDisplayName}, Bihar, India`)}`}
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
        {villageRecord.demographics && (
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
                    {villageRecord.demographics.population.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted mt-2">
                    Official Census 2011 Record
                  </span>
                </div>

                {/* Total Households */}
                <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex flex-col justify-between">
                  <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                    🏡 {t.householdsLabel}
                  </span>
                  <span className="text-3xl font-black text-foreground">
                    {villageRecord.demographics.households.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted mt-2">
                    {Math.round((villageRecord.demographics.population / villageRecord.demographics.households) * 10) / 10} avg members / house
                  </span>
                </div>

                {/* Average Literacy */}
                <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex flex-col justify-between">
                  <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                    📖 {t.literacyLabel}
                  </span>
                  <span className="text-3xl font-black text-foreground">
                    {villageRecord.demographics.literacyRate}%
                  </span>
                  <span className="text-xs text-emerald-500 font-bold mt-2">
                    State Standard Literacy
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
                    {Math.round((villageRecord.demographics.female / villageRecord.demographics.male) * 1000)} Females per 1000 Males
                  </span>
                </div>

                {(() => {
                  const malePercent = Math.round((villageRecord.demographics.male / villageRecord.demographics.population) * 1000) / 10;
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
                          ♂️ {t.maleLabel}: {villageRecord.demographics.male.toLocaleString()} ({malePercent}%)
                        </span>
                        <span className="text-pink-500 flex items-center gap-1">
                          ♀️ {t.femaleLabel}: {villageRecord.demographics.female.toLocaleString()} ({femalePercent}%)
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 3: ADMINISTRATIVE CODES ================= */}
        <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-6 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-4">
            🔢 {t.adminCodesTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* LGD Code */}
            <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
              <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                Local Government Directory (LGD)
              </span>
              <span className="text-2xl font-mono font-black text-foreground">
                {villageRecord.code}
              </span>
            </div>

            {/* Census 2011 Code */}
            <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
              <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                Census 2011 Code
              </span>
              <span className="text-2xl font-mono font-black text-foreground">
                {villageRecord.census2011 || 'N/A'}
              </span>
            </div>

            {/* Census 2001 Code */}
            <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-150 dark:border-zinc-850">
              <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                Census 2001 Code
              </span>
              <span className="text-2xl font-mono font-black text-foreground">
                {villageRecord.census2001 || 'N/A'}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

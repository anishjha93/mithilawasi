'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

// All Bihar district slugs — scanned for pincode matches
const ALL_DISTRICTS = [
  'araria', 'arwal', 'aurangabad', 'banka', 'begusarai', 'bhagalpur',
  'bhojpur', 'buxar', 'darbhanga', 'gaya', 'gopalganj', 'jamui',
  'jehanabad', 'kaimur-(bhabua)', 'katihar', 'khagaria', 'kishanganj',
  'lakhisarai', 'madhepura', 'madhubani', 'munger', 'muzaffarpur',
  'nalanda', 'nawada', 'pashchim-champaran', 'patna', 'purbi-champaran',
  'purnia', 'rohtas', 'saharsa', 'samastipur', 'saran', 'sheikhpura',
  'sheohar', 'sitamarhi', 'siwan', 'supaul', 'vaishali',
];

interface PincodeVillage {
  code: string;
  census2011: string;
  pin?: string;
  district: string;           // injected at fetch time
  name: { en: string; hi: string; mai: string };
  block: { en: string; hi: string; mai: string };
  panchayat: { code: string; en: string; hi: string; mai: string };
  demographics?: {
    population: number;
    male: number;
    female: number;
    households: number;
    literacyRate: number;
  };
}

interface PincodeDetailContentProps {
  lang: 'en' | 'hi' | 'mai';
  pin: string;
  dict: any;
}

// ── Localization ──────────────────────────────────────────────────────────────
const T: Record<string, any> = {
  en: {
    backBtn: 'Back',
    loadingText: 'Loading pincode data…',
    errorTitle: 'Pincode Not Found',
    errorDesc: 'We could not find any villages tagged with this pincode in our database. Data may be coming soon.',
    breadcrumbHome: 'Home',
    breadcrumbPincode: 'Pincode',
    overviewTitle: 'Pincode Overview',
    stateLabel: 'State',
    stateValue: 'Bihar',
    circleLabel: 'Postal Circle',
    circleValue: 'Bihar Circle',
    divisionLabel: 'Division',
    districtLabel: 'District',
    blocksLabel: 'Blocks Covered',
    villagesLabel: 'Villages',
    popLabel: 'Total Population',
    householdsLabel: 'Households',
    literacyLabel: 'Avg Literacy',
    villagesTitle: 'Villages in Pincode {pin}',
    villageCol: 'Village',
    blockCol: 'Block',
    panchayatCol: 'Gram Panchayat',
    popCol: 'Population',
    postOfficesTitle: 'Post Offices',
    postOfficesNote: 'Post office data for this pincode will be added soon.',
    pinExplainTitle: 'About Pincode {pin}',
    pinExplainIntro: 'A Postal Index Number (PIN Code) is a 6-digit code used by India Post for accurate mail delivery.',
    pinDigit1Label: 'First digit ({d}):',
    pinDigit1Desc: 'Indicates the postal region.',
    pinDigit2Label: 'First 2 digits ({d}):',
    pinDigit2Desc: 'Indicate the sub-region or postal circle.',
    pinDigit3Label: 'First 3 digits ({d}):',
    pinDigit3Desc: 'Identify the sorting district.',
    pinDigit4Label: 'Last 3 digits ({d}):',
    pinDigit4Desc: 'Refer to the delivery post office.',
    nearbyPincodesTitle: 'Nearby Pincodes',
    faqTitle: 'Frequently Asked Questions',
    faqQ1: 'Where is pincode {pin} located?',
    faqA1: 'Pincode {pin} is located in {district} district of Bihar, India.',
    faqQ2: 'How many villages are served by pincode {pin}?',
    faqA2: 'Pincode {pin} provides postal services to {count} villages in our current records.',
    faqQ3: 'Which blocks fall under pincode {pin}?',
    faqA3: 'The blocks covered by pincode {pin} include {blocks}.',
    faqQ4: 'Which postal circle does pincode {pin} belong to?',
    faqA4: 'Pincode {pin} falls under the Bihar Postal Circle.',
    introText: 'Pincode {pin} is a postal code in {district} district, Bihar, India. It covers {count} villages across the {blocks} areas.',
    maleLabel: 'Male',
    femaleLabel: 'Female',
  },
  hi: {
    backBtn: 'वापस',
    loadingText: 'पिनकोड डेटा लोड हो रहा है…',
    errorTitle: 'पिनकोड नहीं मिला',
    errorDesc: 'हमें इस पिनकोड से जुड़े कोई गाँव हमारे डेटाबेस में नहीं मिले। डेटा जल्द उपलब्ध हो सकता है।',
    breadcrumbHome: 'होम',
    breadcrumbPincode: 'पिनकोड',
    overviewTitle: 'पिनकोड अवलोकन',
    stateLabel: 'राज्य',
    stateValue: 'बिहार',
    circleLabel: 'डाक वृत्त',
    circleValue: 'बिहार वृत्त',
    divisionLabel: 'प्रभाग',
    districtLabel: 'जिला',
    blocksLabel: 'आच्छादित प्रखंड',
    villagesLabel: 'गाँव',
    popLabel: 'कुल जनसंख्या',
    householdsLabel: 'परिवार',
    literacyLabel: 'औसत साक्षरता',
    villagesTitle: 'पिनकोड {pin} के गाँव',
    villageCol: 'गाँव',
    blockCol: 'प्रखंड',
    panchayatCol: 'ग्राम पंचायत',
    popCol: 'जनसंख्या',
    postOfficesTitle: 'डाकघर',
    postOfficesNote: 'इस पिनकोड के डाकघर का डेटा शीघ्र उपलब्ध होगा।',
    pinExplainTitle: 'पिनकोड {pin} के बारे में',
    pinExplainIntro: 'PIN कोड (डाक सूचकांक संख्या) भारतीय डाक द्वारा उपयोग किया जाने वाला 6 अंकों का कोड है।',
    pinDigit1Label: 'पहला अंक ({d}):',
    pinDigit1Desc: 'डाक क्षेत्र दर्शाता है।',
    pinDigit2Label: 'पहले 2 अंक ({d}):',
    pinDigit2Desc: 'उप-क्षेत्र या डाक वृत्त दर्शाते हैं।',
    pinDigit3Label: 'पहले 3 अंक ({d}):',
    pinDigit3Desc: 'छँटाई जिले की पहचान करते हैं।',
    pinDigit4Label: 'अंतिम 3 अंक ({d}):',
    pinDigit4Desc: 'डाकघर की पहचान करते हैं।',
    nearbyPincodesTitle: 'नज़दीकी पिनकोड',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqQ1: 'पिनकोड {pin} कहाँ स्थित है?',
    faqA1: 'पिनकोड {pin} बिहार के {district} जिले में स्थित है।',
    faqQ2: 'पिनकोड {pin} में कितने गाँव हैं?',
    faqA2: 'पिनकोड {pin} हमारे वर्तमान रिकॉर्ड में {count} गाँवों को डाक सेवा प्रदान करता है।',
    faqQ3: 'पिनकोड {pin} में कौन से प्रखंड आते हैं?',
    faqA3: 'पिनकोड {pin} में {blocks} प्रखंड शामिल हैं।',
    faqQ4: 'पिनकोड {pin} किस डाक वृत्त में आता है?',
    faqA4: 'पिनकोड {pin} बिहार डाक वृत्त के अंतर्गत आता है।',
    introText: 'पिनकोड {pin} बिहार के {district} जिले का एक डाक कोड है। यह {blocks} क्षेत्रों के {count} गाँवों को आच्छादित करता है।',
    maleLabel: 'पुरुष',
    femaleLabel: 'महिला',
  },
  mai: {
    backBtn: 'वापस',
    loadingText: 'पिनकोड डेटा लोड भऽ रहल अछि…',
    errorTitle: 'पिनकोड नहि भेटल',
    errorDesc: 'हमरा एहि पिनकोड सं जुड़ल कोनो गाम हमर डेटाबेस में नहि भेटल। डेटा जल्दी उपलब्ध हएत।',
    breadcrumbHome: 'होम',
    breadcrumbPincode: 'पिनकोड',
    overviewTitle: 'पिनकोड अवलोकन',
    stateLabel: 'राज्य',
    stateValue: 'बिहार',
    circleLabel: 'डाक वृत्त',
    circleValue: 'बिहार वृत्त',
    divisionLabel: 'प्रभाग',
    districtLabel: 'जिला',
    blocksLabel: 'आच्छादित प्रखंड',
    villagesLabel: 'गाम',
    popLabel: 'कुल जनसंख्या',
    householdsLabel: 'परिवार',
    literacyLabel: 'औसत साक्षरता',
    villagesTitle: 'पिनकोड {pin} कऽ गाम',
    villageCol: 'गाम',
    blockCol: 'प्रखंड',
    panchayatCol: 'ग्राम पञ्चायत',
    popCol: 'जनसंख्या',
    postOfficesTitle: 'डाकघर',
    postOfficesNote: 'एहि पिनकोड कऽ डाकघर डेटा जल्दी उपलब्ध हएत।',
    pinExplainTitle: 'पिनकोड {pin} कऽ बारे में',
    pinExplainIntro: 'PIN कोड भारतीय डाक द्वारा उपयोग कएल जाय बला 6 अंक कऽ कोड अछि।',
    pinDigit1Label: 'पहिल अंक ({d}):',
    pinDigit1Desc: 'डाक क्षेत्र दर्शाबैत अछि।',
    pinDigit2Label: 'पहिल 2 अंक ({d}):',
    pinDigit2Desc: 'उप-क्षेत्र या डाक वृत्त दर्शाबैत अछि।',
    pinDigit3Label: 'पहिल 3 अंक ({d}):',
    pinDigit3Desc: 'छँटाई जिलाक पहचान करैत अछि।',
    pinDigit4Label: 'अंतिम 3 अंक ({d}):',
    pinDigit4Desc: 'डाकघरक पहचान करैत अछि।',
    nearbyPincodesTitle: 'नज़दीकी पिनकोड',
    faqTitle: 'अक्सर पूछल जाय बला प्रश्न',
    faqQ1: 'पिनकोड {pin} कतय स्थित अछि?',
    faqA1: 'पिनकोड {pin} बिहारक {district} जिला में स्थित अछि।',
    faqQ2: 'पिनकोड {pin} में कतेक गाम अछि?',
    faqA2: 'पिनकोड {pin} हमर वर्तमान रिकॉर्ड में {count} गामकेँ डाक सेवा प्रदान करैत अछि।',
    faqQ3: 'पिनकोड {pin} में कोन प्रखंड अबैत अछि?',
    faqA3: 'पिनकोड {pin} में {blocks} प्रखंड शामिल अछि।',
    faqQ4: 'पिनकोड {pin} कोन डाक वृत्त में अबैत अछि?',
    faqA4: 'पिनकोड {pin} बिहार डाक वृत्त कऽ अंतर्गत अबैत अछि।',
    introText: 'पिनकोड {pin} बिहारक {district} जिलाक एक डाक कोड अछि। ई {blocks} क्षेत्रक {count} गामकेँ आच्छादित करैत अछि।',
    maleLabel: 'पुरुष',
    femaleLabel: 'महिला',
  },
};

// Compute nearby pincodes (±200 range, same 3-digit prefix, up to 8)
function getNearbyPincodes(pin: string): string[] {
  const base = parseInt(pin, 10);
  const prefix = pin.slice(0, 3);
  const nearby: string[] = [];
  for (let offset = 1; nearby.length < 8; offset++) {
    const lo = base - offset;
    const hi = base + offset;
    if (String(lo).startsWith(prefix)) nearby.push(String(lo));
    if (nearby.length < 8 && String(hi).startsWith(prefix)) nearby.push(String(hi));
    if (offset > 100) break;
  }
  return nearby.slice(0, 8);
}

export default function PincodeDetailContent({ lang, pin, dict }: PincodeDetailContentProps) {
  const t = T[lang] || T['en'];
  const fill = (tmpl: string, vars: Record<string, string>) =>
    tmpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  const [villages, setVillages] = useState<PincodeVillage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fetch all district JSONs in parallel, filter by pin
  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.allSettled(
          ALL_DISTRICTS.map(async (district) => {
            try {
              const res = await fetch(`/data/villages/${district}.json`);
              if (!res.ok) return [];
              const data = await res.json();
              return (data.villages || [])
                .filter((v: any) => v.pin === pin)
                .map((v: any) => ({ ...v, district }));
            } catch {
              return [];
            }
          })
        );
        if (!active) return;
        const all: PincodeVillage[] = results.flatMap((r) =>
          r.status === 'fulfilled' ? r.value : []
        );
        setVillages(all);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchAll();
    return () => { active = false; };
  }, [pin]);

  // Derived aggregates
  const stats = useMemo(() => {
    const blocks = new Set<string>();
    const districts = new Set<string>();
    let totalPop = 0, totalHH = 0, litSum = 0, litCount = 0;
    villages.forEach((v) => {
      if (v.block?.en) blocks.add(v.block.en);
      if (v.district) districts.add(v.district);
      if (v.demographics) {
        totalPop += v.demographics.population;
        totalHH += v.demographics.households;
        litSum += v.demographics.literacyRate;
        litCount++;
      }
    });
    return {
      blocks: Array.from(blocks).sort(),
      districts: Array.from(districts).sort(),
      totalPop,
      totalHH,
      avgLiteracy: litCount > 0 ? Math.round((litSum / litCount) * 10) / 10 : null,
    };
  }, [villages]);

  const nearbyPincodes = useMemo(() => getNearbyPincodes(pin), [pin]);

  // Primary district display name
  const primaryDistrict = stats.districts.length > 0
    ? stats.districts[0].charAt(0).toUpperCase() + stats.districts[0].slice(1).replace(/-/g, ' ')
    : '';

  // Division from district (simple lookup for Darbhanga division)
  const DISTRICT_DIVISION: Record<string, string> = {
    darbhanga: 'Darbhanga Division', madhubani: 'Darbhanga Division', samastipur: 'Darbhanga Division',
    muzaffarpur: 'Tirhut Division', sitamarhi: 'Tirhut Division', sheohar: 'Tirhut Division',
    vaishali: 'Tirhut Division', gopalganj: 'Saran Division', saran: 'Saran Division', siwan: 'Saran Division',
    patna: 'Patna Division', nalanda: 'Patna Division', bhojpur: 'Patna Division', rohtas: 'Patna Division',
    buxar: 'Patna Division', arwal: 'Patna Division', jehanabad: 'Patna Division', gaya: 'Magadh Division',
    aurangabad: 'Magadh Division', nawada: 'Magadh Division', jamui: 'Magadh Division', bhagalpur: 'Bhagalpur Division',
    banka: 'Bhagalpur Division', munger: 'Munger Division', lakhisarai: 'Munger Division', sheikhpura: 'Munger Division',
    khagaria: 'Munger Division', begusarai: 'Munger Division', purnia: 'Purnea Division', katihar: 'Purnea Division',
    araria: 'Purnea Division', kishanganj: 'Purnea Division', supaul: 'Saharsa Division', saharsa: 'Saharsa Division',
    madhepura: 'Saharsa Division', 'pashchim-champaran': 'Tirhut Division', 'purbi-champaran': 'Tirhut Division',
    'kaimur-(bhabua)': 'Patna Division',
  };
  const division = stats.districts.length > 0 ? (DISTRICT_DIVISION[stats.districts[0]] || 'Bihar Division') : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="w-12 h-12 text-primary-red animate-spin" />
        <p className="text-sm font-bold text-primary-red animate-pulse">{t.loadingText}</p>
      </div>
    );
  }

  if (villages.length === 0) {
    return (
      <div className="container section-padding py-24 text-center max-w-xl mx-auto">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-950/20 text-primary-red rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-foreground mb-4">{t.errorTitle}</h1>
        <p className="text-text-muted mb-8 leading-relaxed">{t.errorDesc}</p>
        <Link href={`/${lang}/villages`} className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary-red hover:bg-red-800 text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer no-underline">
          <ArrowLeft size={16} /> {t.backBtn}
        </Link>
      </div>
    );
  }

  const faqItems = [
    { q: fill(t.faqQ1, { pin }), a: fill(t.faqA1, { pin, district: primaryDistrict }) },
    { q: fill(t.faqQ2, { pin }), a: fill(t.faqA2, { pin, count: String(villages.length) }) },
    { q: fill(t.faqQ3, { pin }), a: fill(t.faqA3, { pin, blocks: stats.blocks.join(', ') }) },
    { q: fill(t.faqQ4, { pin }), a: fill(t.faqA4, { pin }) },
  ];

  return (
    <div className="container section-padding pb-32 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-text-muted flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
        <Link href={`/${lang}`} className="hover:text-foreground transition-colors no-underline">🏠 {t.breadcrumbHome}</Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-foreground font-semibold">{t.breadcrumbPincode}</span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-primary-red font-bold">{pin}</span>
      </nav>

      {/* Back button */}
      <div className="mb-6">
        <Link href={`/${lang}/villages`} className="inline-flex items-center gap-2 text-sm text-primary-red hover:text-red-800 font-bold group transition-all cursor-pointer no-underline">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backBtn}
        </Link>
      </div>

      {/* Hero Header */}
      <header className="p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary-red/[0.04] via-primary-yellow/[0.02] to-transparent border border-border-color dark:border-zinc-900 shadow-xs mb-10 relative overflow-hidden">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.012] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            📮 {t.breadcrumbPincode}
          </span>
          <HeritageHeading as="h1" className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-foreground mb-3 tracking-tight">
            {pin}
          </HeritageHeading>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-text-muted mt-2">
            <span>📍 {primaryDistrict}, Bihar</span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span>🏡 {villages.length} {t.villagesLabel}</span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span>📦 {stats.blocks.length} {t.blocksLabel}</span>
          </div>
        </div>
      </header>

      {/* Fact bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: t.breadcrumbPincode, value: pin },
          { label: t.stateLabel, value: t.stateValue },
          { label: t.districtLabel, value: primaryDistrict },
          { label: t.villagesLabel, value: String(villages.length) },
        ].map((stat, i) => (
          <div key={i} className="p-3 sm:p-4 bg-white dark:bg-zinc-950/40 rounded-xl border border-border-color dark:border-zinc-900 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">{stat.label}</span>
            <span className="text-lg sm:text-xl font-black text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">

        {/* ===== MAIN COLUMN ===== */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* Intro paragraph */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs text-sm sm:text-base leading-relaxed text-text-muted">
            <p>
              {fill(t.introText, {
                pin,
                district: primaryDistrict,
                count: String(villages.length),
                blocks: stats.blocks.join(', '),
              })}
            </p>
          </section>

          {/* Villages Table */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              🏡 {fill(t.villagesTitle, { pin })}
              <span className="ml-auto text-xs font-normal text-text-muted bg-zinc-100 dark:bg-zinc-900/40 px-2 py-0.5 rounded-full">{villages.length}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-850">
                    <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">{t.villageCol}</th>
                    <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">{t.blockCol}</th>
                    <th className="text-left px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">{t.panchayatCol}</th>
                    <th className="text-right px-4 py-2.5 font-bold text-text-muted text-xs uppercase tracking-wider">{t.popCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {villages
                    .slice()
                    .sort((a, b) => (a.name.en || '').localeCompare(b.name.en || ''))
                    .map((v) => (
                      <tr key={`${v.district}-${v.code}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/${lang}/villages/village/${v.district}/${v.code}`}
                            className="font-bold text-foreground hover:text-primary-red hover:underline transition-colors"
                          >
                            {v.name[lang] || v.name.en}
                          </Link>
                          {lang !== 'en' && v.name.en !== v.name[lang] && (
                            <span className="text-xs text-text-muted block">{v.name.en}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-foreground hidden sm:table-cell">
                          {v.block[lang] || v.block.en}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {v.panchayat?.en ? (
                            <Link
                              href={`/${lang}/villages/panchayat/${v.district}/${v.panchayat.code}`}
                              className="text-primary-red hover:underline font-medium"
                            >
                              {v.panchayat[lang] || v.panchayat.en}
                            </Link>
                          ) : (
                            <span className="text-text-muted text-xs italic">Urban</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          {v.demographics ? v.demographics.population.toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
                {stats.totalPop > 0 && (
                  <tfoot>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/30 border-t-2 border-zinc-200 dark:border-zinc-800 font-bold">
                      <td className="px-4 py-3 text-foreground" colSpan={3}>
                        {lang === 'en' ? 'Total' : lang === 'hi' ? 'कुल' : 'कुल'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-foreground">{stats.totalPop.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          {/* Post Offices — Coming Soon */}
          <section className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2 border-b border-border-color dark:border-zinc-850 pb-3">
              📬 {t.postOfficesTitle}
            </h2>
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
              <span className="text-xl">🔧</span>
              <span className="font-semibold">{t.postOfficesNote}</span>
            </div>
          </section>

          {/* FAQ */}
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

          {/* Overview Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              {t.overviewTitle}
            </h3>
            <dl className="space-y-3 text-sm">
              {[
                { dt: t.stateLabel, dd: t.stateValue },
                { dt: t.circleLabel, dd: t.circleValue },
                { dt: t.divisionLabel, dd: division },
                { dt: t.districtLabel, dd: primaryDistrict },
                { dt: t.blocksLabel, dd: stats.blocks.join(', ') || '—' },
                { dt: t.villagesLabel, dd: String(villages.length) },
                ...(stats.totalPop > 0 ? [
                  { dt: t.popLabel, dd: stats.totalPop.toLocaleString() },
                  { dt: t.householdsLabel, dd: stats.totalHH.toLocaleString() },
                ] : []),
                ...(stats.avgLiteracy !== null ? [
                  { dt: t.literacyLabel, dd: `${stats.avgLiteracy}%` },
                ] : []),
              ].map((row, i) => (
                <div key={i} className={`flex justify-between gap-2${i > 0 ? ' border-t border-zinc-100 dark:border-zinc-850 pt-3' : ''}`}>
                  <dt className="text-text-muted font-semibold flex-shrink-0 text-xs sm:text-sm">{row.dt}</dt>
                  <dd className="text-right font-bold text-foreground text-xs sm:text-sm">{row.dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Nearby Pincodes */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              📮 {t.nearbyPincodesTitle}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {nearbyPincodes.map((np) => (
                <Link
                  key={np}
                  href={`/${lang}/pincode/${np}`}
                  className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-primary-red/5 border border-zinc-200 dark:border-zinc-800 hover:border-primary-red/30 rounded-xl text-xs font-mono font-bold text-foreground hover:text-primary-red transition-all text-center no-underline"
                >
                  {np}
                </Link>
              ))}
            </div>
          </div>

          {/* PIN Code Explained */}
          <div className="bg-white dark:bg-zinc-950/40 border border-border-color dark:border-zinc-900 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 pb-3 border-b border-border-color dark:border-zinc-850">
              {fill(t.pinExplainTitle, { pin })}
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">{t.pinExplainIntro}</p>
            <ul className="space-y-3 text-xs">
              {[
                { label: fill(t.pinDigit1Label, { d: pin[0] }), desc: t.pinDigit1Desc, highlight: pin[0] },
                { label: fill(t.pinDigit2Label, { d: pin.slice(0, 2) }), desc: t.pinDigit2Desc, highlight: pin.slice(0, 2) },
                { label: fill(t.pinDigit3Label, { d: pin.slice(0, 3) }), desc: t.pinDigit3Desc, highlight: pin.slice(0, 3) },
                { label: fill(t.pinDigit4Label, { d: pin.slice(3) }), desc: t.pinDigit4Desc, highlight: pin.slice(3) },
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-black text-primary-red font-mono mt-0.5 shrink-0">{item.highlight}</span>
                  <span>
                    <span className="font-bold text-foreground">{item.label}</span>{' '}
                    <span className="text-text-muted">{item.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </div>
    </div>
  );
}

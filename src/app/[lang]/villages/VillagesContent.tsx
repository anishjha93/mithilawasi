'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Award, Star, Compass } from 'lucide-react';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';

interface Village {
  slug: string;
  name: Record<string, string>;
  district: Record<string, string>;
  block: Record<string, string>;
  famousFor: Record<string, string>;
  description: Record<string, string>;
  highlights: Array<Record<string, string>>;
}

interface VillagesContentProps {
  lang: 'en' | 'hi' | 'mai';
  dict: any;
  villages: any[];
}

const LOCAL_DICT: Record<string, any> = {
  en: {
    title: "Mithila Village Registry",
    subtitle: "Explore ancestral villages, rich craft hubs, and cultural lineages of Mithilanchal.",
    searchPlaceholder: "Search villages by name, district, craft...",
    allDistricts: "All Districts",
    blockLabel: "Block",
    famousLabel: "Famous For",
    highlightsLabel: "Highlights",
    noResults: "No villages found matching your search. Try another query!"
  },
  hi: {
    title: "मिथिला ग्राम निर्देशिका",
    subtitle: "मिथिलांचल के पैतृक गांवों, समृद्ध शिल्प केंद्रों और सांस्कृतिक वंशावली को जानें।",
    searchPlaceholder: "गाँव, जिला या शिल्प के नाम से खोजें...",
    allDistricts: "सभी जिले",
    blockLabel: "प्रखंड",
    famousLabel: "प्रसिद्धि का कारण",
    highlightsLabel: "मुख्य विशेषताएं",
    noResults: "आपकी खोज के अनुकूल कोई गाँव नहीं मिला। कृपया पुनः प्रयास करें!"
  },
  mai: {
    title: "मिथिला गाम निर्देशिका",
    subtitle: "मिथिलांचल कऽ पैतृक गाम, समृद्ध शिल्प केंद्र आ सांस्कृतिक वंशावली कें जानू।",
    searchPlaceholder: "गाम, जिला या शिल्प क नाम सं खोजू...",
    allDistricts: "सभ जिला",
    blockLabel: "प्रखंड",
    famousLabel: "प्रसिद्धि कऽ कारण",
    highlightsLabel: "मुख्य विशेषता सभ",
    noResults: "अहाँक खोजक अनुकूल कोनो गाम नहि भेटल। कृपया पुनः प्रयास करू!"
  }
};

export default function VillagesContent({ lang, dict, villages }: VillagesContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Extract unique districts
  const districts = useMemo(() => {
    const set = new Set<string>();
    villages.forEach((v) => {
      if (v.district?.en) set.add(v.district.en);
    });
    return Array.from(set);
  }, [villages]);

  // Filtered villages
  const filteredVillages = useMemo(() => {
    return (villages as Village[]).filter((v) => {
      const name = (v.name[lang] || v.name.en || '').toLowerCase();
      const district = (v.district[lang] || v.district.en || '').toLowerCase();
      const districtEn = (v.district.en || '').toLowerCase();
      const block = (v.block[lang] || v.block.en || '').toLowerCase();
      const famousFor = (v.famousFor[lang] || v.famousFor.en || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        district.includes(query) ||
        block.includes(query) ||
        famousFor.includes(query);

      const matchesDistrict =
        selectedDistrict === 'all' || districtEn === selectedDistrict.toLowerCase();

      return matchesSearch && matchesDistrict;
    });
  }, [searchQuery, selectedDistrict, lang, villages]);

  return (
    <div className="container section-padding pb-32">
      <header className="text-center mb-16 px-4">
        <HeritageHeading as="h1" center className="mb-6 tracking-tight text-gradient">
          {t.title}
        </HeritageHeading>
        <p className="text-xl text-text-muted max-w-2xl mx-auto font-serif italic leading-relaxed">
          {t.subtitle}
        </p>
        <div className="h-1 w-24 bg-primary-red mx-auto mt-6 rounded-full opacity-60"></div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto mb-12 px-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-border-color dark:border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-red transition-all text-foreground"
          />
        </div>

        {/* District Filter Selector */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => setSelectedDistrict('all')}
            className={`px-4 py-2 border-0 rounded-full font-bold text-sm cursor-pointer transition-all ${
              selectedDistrict === 'all'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            {t.allDistricts}
          </button>
          {districts.map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-4 py-2 border-0 rounded-full font-bold text-sm cursor-pointer transition-all ${
                selectedDistrict.toLowerCase() === dist.toLowerCase()
                  ? 'bg-primary-red text-white shadow-md'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* Villages Grid */}
      {filteredVillages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {filteredVillages.map((village) => (
            <MithilaCard
              key={village.slug}
              className="p-8 group flex flex-col justify-between h-full hover:shadow-lg border border-border-color dark:border-zinc-800"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary-red/5 flex items-center justify-center text-primary-red text-2xl group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                    🏡
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-primary-yellow/10 text-primary-yellow border border-primary-yellow/20 rounded-full flex items-center gap-1">
                    <MapPin size={10} />
                    {village.district[lang] || village.district.en}
                  </span>
                </div>

                {/* Village Title */}
                <h3 className="text-2xl font-bold mb-2 text-foreground font-heading tracking-tight">
                  {village.name[lang] || village.name.en}
                </h3>
                
                {/* Block */}
                <p className="text-xs text-text-muted uppercase tracking-wider mb-4 flex items-center gap-1.5 font-bold">
                  <Compass size={12} className="text-primary-red" />
                  {t.blockLabel}: {village.block[lang] || village.block.en}
                </p>

                {/* Famous For */}
                <div className="mb-4 bg-gray-50 dark:bg-zinc-900/30 p-3 rounded-lg border border-gray-100 dark:border-zinc-900">
                  <span className="text-xs text-text-muted font-bold block mb-1 uppercase tracking-wide flex items-center gap-1">
                    <Award size={12} className="text-primary-red" />
                    {t.famousLabel}
                  </span>
                  <p className="text-sm font-semibold text-primary-red">
                    {village.famousFor[lang] || village.famousFor.en}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[0.95rem] text-text-muted leading-relaxed font-serif italic mb-6">
                  {village.description[lang] || village.description.en}
                </p>
              </div>

              {/* Highlights List */}
              <div className="border-t border-border-color dark:border-zinc-800 pt-6">
                <span className="text-xs text-text-muted font-bold block mb-3 uppercase tracking-wide flex items-center gap-1">
                  <Star size={12} className="text-primary-yellow" />
                  {t.highlightsLabel}
                </span>
                <ul className="space-y-1.5 pl-0 list-none m-0">
                  {village.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="text-xs text-foreground/80 flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-red flex-shrink-0" />
                      {hl[lang] || hl.en}
                    </li>
                  ))}
                </ul>
              </div>
            </MithilaCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-white/5 border border-border-color dark:border-zinc-800 rounded-3xl max-w-2xl mx-auto shadow-sm">
          <p className="text-lg text-text-muted font-semibold">{t.noResults}</p>
        </div>
      )}
    </div>
  );
}

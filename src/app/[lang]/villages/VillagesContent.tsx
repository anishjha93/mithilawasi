'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Award, Star, Compass, ChevronLeft, ChevronRight, Loader2, Building2, Hash } from 'lucide-react';
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

interface VillagesContentProps {
  lang: 'en' | 'hi' | 'mai';
  dict: any;
  villages: any[]; // Curated heritage villages
}

const BIHAR_DISTRICTS = [
  { key: 'darbhanga', en: 'Darbhanga', hi: 'दरभंगा', mai: 'दरभंगा' },
  { key: 'madhubani', en: 'Madhubani', hi: 'मधुबनी', mai: 'मधुबनी' },
  { key: 'samastipur', en: 'Samastipur', hi: 'समस्तीपुर', mai: 'समस्तीपुर' },
  { key: 'sitamarhi', en: 'Sitamarhi', hi: 'सीतामढ़ी', mai: 'सीतामढ़ी' },
  { key: 'saharsa', en: 'Saharsa', hi: 'सहरसा', mai: 'सहरसा' },
  { key: 'supaul', en: 'Supaul', hi: 'सुपौल', mai: 'सुपौल' },
  { key: 'madhepura', en: 'Madhepura', hi: 'मधेपुरा', mai: 'मधेपुरा' },
  { key: 'muzaffarpur', en: 'Muzaffarpur', hi: 'मुजफ्फरपुर', mai: 'मुजफ्फरपुर' },
  { key: 'patna', en: 'Patna', hi: 'पटना', mai: 'पटना' },
  { key: 'araria', en: 'Araria', hi: 'अररिया', mai: 'अररिया' },
  { key: 'arwal', en: 'Arwal', hi: 'अरवल', mai: 'अरवल' },
  { key: 'aurangabad', en: 'Aurangabad', hi: 'औरंगाबाद', mai: 'औरंगाबाद' },
  { key: 'banka', en: 'Banka', hi: 'बांका', mai: 'बांका' },
  { key: 'begusarai', en: 'Begusarai', hi: 'बेगूसराय', mai: 'बेगूसराय' },
  { key: 'bhagalpur', en: 'Bhagalpur', hi: 'भागलपुर', mai: 'भागलपुर' },
  { key: 'bhojpur', en: 'Bhojpur', hi: 'भोजपुर', mai: 'भोजपुर' },
  { key: 'buxar', en: 'Buxar', hi: 'बक्सर', mai: 'बक्सर' },
  { key: 'gaya', en: 'Gaya', hi: 'गया', mai: 'गया' },
  { key: 'gopalganj', en: 'Gopalganj', hi: 'गोपालगंज', mai: 'गोपालगंज' },
  { key: 'jamui', en: 'Jamui', hi: 'जमुई', mai: 'जमुई' },
  { key: 'jehanabad', en: 'Jehanabad', hi: 'जहानाबाद', mai: 'जहानाबाद' },
  { key: 'kaimur-(bhabua)', en: 'Kaimur', hi: 'कैमूर', mai: 'कैमूर' },
  { key: 'katihar', en: 'Katihar', hi: 'कटिहार', mai: 'कटिहार' },
  { key: 'khagaria', en: 'Khagaria', hi: 'खगड़िया', mai: 'खगड़िया' },
  { key: 'kishanganj', en: 'Kishanganj', hi: 'किशनगंज', mai: 'किशनगंज' },
  { key: 'lakhisarai', en: 'Lakhisarai', hi: 'लखीसराय', mai: 'लखीसराय' },
  { key: 'munger', en: 'Munger', hi: 'मुंगेर', mai: 'मुंगेर' },
  { key: 'nalanda', en: 'Nalanda', hi: 'नालंदा', mai: 'नालंदा' },
  { key: 'nawada', en: 'Nawada', hi: 'नवादा', mai: 'नवादा' },
  { key: 'pashchim-champaran', en: 'West Champaran', hi: 'पश्चिम चंपारण', mai: 'पश्चिम चम्पारण' },
  { key: 'purbi-champaran', en: 'East Champaran', hi: 'पूर्वी चंपारण', mai: 'पूर्वी चम्पारण' },
  { key: 'purnia', en: 'Purnia', hi: 'पूर्णिया', mai: 'पूर्णिया' },
  { key: 'rohtas', en: 'Rohtas', hi: 'रोहतास', mai: 'रोहतास' },
  { key: 'saran', en: 'Saran', hi: 'सारण', mai: 'सारण' },
  { key: 'sheikhpura', en: 'Sheikhpura', hi: 'शेखपुरा', mai: 'शेखपुरा' },
  { key: 'sheohar', en: 'Sheohar', hi: 'शिवहर', mai: 'शिवहर' },
  { key: 'siwan', en: 'Siwan', hi: 'सीवान', mai: 'सीवान' },
  { key: 'vaishali', en: 'Vaishali', hi: 'वैशाली', mai: 'वैशाली' }
];

const LOCAL_DICT: Record<string, any> = {
  en: {
    title: "Mithila Village Directory",
    subtitle: "Explore ancestral villages, rich craft hubs, and cultural lineages of Mithilanchal.",
    searchPlaceholder: "Search curated villages...",
    blockLabel: "Block",
    famousLabel: "Famous For",
    highlightsLabel: "Highlights",
    noResults: "No villages found matching your search.",
    
    // New labels
    featuredTitle: "Featured Heritage Villages",
    directoryTitle: "All Bihar Gram Panchayat & Village Directory",
    directorySubtitle: "Browse the official Local Government Directory (LGD) record database.",
    selectDistrict: "Select District",
    selectBlock: "All Blocks",
    searchDirectoryPlaceholder: "Search by village, GP name, or codes...",
    tableVillage: "Village Details",
    tablePanchayat: "Gram Panchayat",
    tableBlock: "Block",
    tableLgdCode: "Administrative Codes",
    paginationPrev: "Previous",
    paginationNext: "Next",
    paginationPage: "Page",
    loadingText: "Loading village directory...",
    totalRecords: "Total Villages",
    viewVillages: "Villages",
    viewPanchayats: "Gram Panchayats",
    viewBlocks: "Blocks",
    colMemberVillages: "Member Villages",
    colTotalPopulation: "Total Population",
    colAction: "Action",
    colTotalPanchayats: "Total Panchayats",
    colTotalVillages: "Total Villages",
    colAvgLiteracy: "Avg Literacy Rate",
    viewDetails: "View Details",
    demographicsTitle: "Demographics (Census 2011)",
    popLabel: "Total Population",
    maleLabel: "Male",
    femaleLabel: "Female",
    householdsLabel: "Households",
    literacyLabel: "Literacy Rate",

    // Panchayat Modal Labels
    panchayatDetails: "Gram Panchayat Registry Details",
    panchayatCode: "Panchayat LGD Code",
    tabRepresentatives: "Elected Representatives",
    tabVillages: "Member Villages",
    tabMap: "Map & Location",
    mapSectionTitle: "Interactive Geo-Registry",
    coordinatesLabel: "Geographic Coordinates",
    elevationLabel: "Elevation (Approx)",
    openInGoogleMaps: "Open in Google Maps",
    panchayatBoundaries: "Panchayat Coverage Map",
    mukhiyaLabel: "Mukhiya (Panchayat Head)",
    samitiLabel: "Panchayat Samiti Member",
    sarpanchLabel: "Sarpanch (Judicial Head)",
    secLabel: "Panchayat Secretary (Official)",
    wardLabel: "Ward Members",
    contributeTitle: "Update Elected Representative Info",
    contributeBtn: "Submit Information",
    contributeSuccess: "Thank you! Info submitted for verification.",
    placeholderNotSeeded: "No details seeded yet. Click to update.",
    closeBtn: "Close"
  },
  hi: {
    title: "मिथिला ग्राम निर्देशिका",
    subtitle: "मिथिलांचल के पैतृक गांवों, समृद्ध शिल्प केंद्रों और सांस्कृतिक वंशावली को जानें।",
    searchPlaceholder: "चुनिंदा गांवों को खोजें...",
    blockLabel: "प्रखंड",
    famousLabel: "प्रसिद्धि का कारण",
    highlightsLabel: "मुख्य विशेषताएं",
    noResults: "कोई गाँव नहीं मिला।",

    // New labels
    featuredTitle: "प्रसिद्ध विरासत ग्राम",
    directoryTitle: "बिहार ग्राम पंचायत और ग्राम निर्देशिका",
    directorySubtitle: "आधिकारिक स्थानीय निकाय निर्देशिका (LGD) रिकॉर्ड डेटाबेस खोजें।",
    selectDistrict: "जिला चुनें",
    selectBlock: "सभी ब्लॉक",
    searchDirectoryPlaceholder: "गाँव, पंचायत या कोड से खोजें...",
    tableVillage: "ग्राम का विवरण",
    tablePanchayat: "ग्राम पंचायत",
    tableBlock: "प्रखंड (ब्लॉक)",
    tableLgdCode: "प्रशासनिक कोड",
    paginationPrev: "पिछला",
    paginationNext: "अगला",
    paginationPage: "पृष्ठ",
    loadingText: "ग्राम निर्देशिका लोड हो रही है...",
    totalRecords: "कुल ग्राम",
    viewVillages: "गाँव",
    viewPanchayats: "ग्राम पंचायत",
    viewBlocks: "प्रखंड (ब्लॉक)",
    colMemberVillages: "अंतर्गत गाँव",
    colTotalPopulation: "कुल जनसंख्या",
    colAction: "विवरण",
    colTotalPanchayats: "कुल पंचायत",
    colTotalVillages: "कुल गाँव",
    colAvgLiteracy: "औसत साक्षरता",
    viewDetails: "विवरण देखें",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",

    // Panchayat Modal Labels
    panchayatDetails: "ग्राम पंचायत रजिस्ट्री विवरण",
    panchayatCode: "पंचायत एलजीडी कोड",
    tabRepresentatives: "निर्वाचित प्रतिनिधि",
    tabVillages: "अंतर्गत आने वाले गाँव",
    tabMap: "नक्शा और स्थान",
    mapSectionTitle: "इंटरएक्टिव भू-रजिस्ट्री",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलें",
    panchayatBoundaries: "पंचायत कवरेज नक्शा",
    mukhiyaLabel: "मुखिया (पंचायत प्रमुख)",
    samitiLabel: "पंचायत समिति सदस्य",
    sarpanchLabel: "सरपंच (न्यायिक प्रमुख)",
    secLabel: "पंचायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि के नाम अपडेट करें",
    contributeBtn: "योगदान दें",
    contributeSuccess: "धन्यवाद! प्रतिनिधि की जानकारी सत्यापन के लिए भेजी गई है।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहीं है। अपडेट करने के लिए क्लिक करें।",
    closeBtn: "बंद करें"
  },
  mai: {
    title: "मिथिला गाम निर्देशिका",
    subtitle: "मिथिलांचल कऽ पैतृक गाम, समृद्ध शिल्प केंद्र आ सांस्कृतिक वंशावली कें जानू।",
    searchPlaceholder: "चुनिंदा गाम सभ कें खोजू...",
    blockLabel: "प्रखंड",
    famousLabel: "प्रसिद्धि कऽ कारण",
    highlightsLabel: "मुख्य विशेषता सभ",
    noResults: "कोनो गाम नहि भेटल।",

    // New labels
    featuredTitle: "प्रसिद्ध विरासत गाम",
    directoryTitle: "बिहार ग्राम पञ्चायत आ गाम निर्देशिका",
    directorySubtitle: "आधिकारिक स्थानीय निकाय निर्देशिका (LGD) रिकॉर्ड डेटाबेस खोजू।",
    selectDistrict: "जिला चुनू",
    selectBlock: "सभ ब्लॉक",
    searchDirectoryPlaceholder: "गाम, पञ्चायत या कोड सं खोजू...",
    tableVillage: "गामक विवरण",
    tablePanchayat: "ग्राम पञ्चायत",
    tableBlock: "प्रखण्ड (ब्लॉक)",
    tableLgdCode: "प्रशासनिक कोड",
    paginationPrev: "पहिलुका",
    paginationNext: "अगुतका",
    paginationPage: "पृष्ठ",
    loadingText: "गाम निर्देशिका लोड भऽ रहल अछि...",
    totalRecords: "कुल गाम",
    viewVillages: "गाम",
    viewPanchayats: "ग्राम पञ्चायत",
    viewBlocks: "प्रखंड (ब्लॉक)",
    colMemberVillages: "अंतर्गत गाम",
    colTotalPopulation: "कुल जनसंख्या",
    colAction: "विवरण",
    colTotalPanchayats: "कुल पञ्चायत",
    colTotalVillages: "कुल गाम",
    colAvgLiteracy: "औसत साक्षरता",
    viewDetails: "विवरण देखू",
    demographicsTitle: "जनसांख्यिकी (जनगणना 2011)",
    popLabel: "कुल जनसंख्या",
    maleLabel: "पुरुष",
    femaleLabel: "महिला",
    householdsLabel: "परिवार (घर)",
    literacyLabel: "साक्षरता दर",

    // Panchayat Modal Labels
    panchayatDetails: "ग्राम पञ्चायत विवरण",
    panchayatCode: "पञ्चायत एलजीडी कोड",
    tabRepresentatives: "निर्वाचित प्रतिनिधि",
    tabVillages: "अंतर्गत आबऽ बला गाम",
    tabMap: "मानचित्र आ स्थान",
    mapSectionTitle: "मानचित्र आ स्थान",
    coordinatesLabel: "भौगोलिक निर्देशांक",
    elevationLabel: "अनुमानित ऊंचाई",
    openInGoogleMaps: "गूगल मैप्स में खोलू",
    panchayatBoundaries: "पञ्चायत कवरेज नक्शा",
    mukhiyaLabel: "मुखिया (पञ्चायत प्रमुख)",
    samitiLabel: "पञ्चायत समिति सदस्य",
    sarpanchLabel: "सरपञ्च (न्यायिक प्रमुख)",
    secLabel: "पञ्चायत सचिव (सरकारी)",
    wardLabel: "वार्ड सदस्य",
    contributeTitle: "प्रतिनिधि क नाम अपडेट करू",
    contributeBtn: "योगदान दियऽ",
    contributeSuccess: "धन्यबाद! प्रतिनिधि क जानकारी सत्यापन क लेल पठाओल गेल अछि।",
    placeholderNotSeeded: "जानकारी उपलब्ध नहि अछि। अपडेट करबाक लेल क्लिक करू।",
    closeBtn: "बंद करू"
  }
};

export default function VillagesContent({ lang, dict, villages }: VillagesContentProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  
  // Curated Villages Search State
  const [curatedQuery, setCuratedQuery] = useState('');

  // Directory State
  const [selectedDistrict, setSelectedDistrict] = useState('darbhanga');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [directoryVillages, setDirectoryVillages] = useState<DirectoryVillage[]>([]);
  const [isLoadingDir, setIsLoadingDir] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [directoryView, setDirectoryView] = useState<'villages' | 'panchayats' | 'blocks'>('villages');

  // Filtered Curated Heritage Villages
  const filteredCurated = useMemo(() => {
    return (villages as Village[]).filter((v) => {
      const name = (v.name[lang] || v.name.en || '').toLowerCase();
      const block = (v.block[lang] || v.block.en || '').toLowerCase();
      const famousFor = (v.famousFor[lang] || v.famousFor.en || '').toLowerCase();
      const query = curatedQuery.toLowerCase();

      return name.includes(query) || block.includes(query) || famousFor.includes(query);
    });
  }, [curatedQuery, lang, villages]);

  // Load Directory Data dynamically when district changes
  useEffect(() => {
    let active = true;
    const loadDistrictData = async () => {
      setIsLoadingDir(true);
      setCurrentPage(1);
      setSelectedBlock('all');
      try {
        const response = await fetch(`/data/villages/${selectedDistrict}.json`);
        if (!response.ok) throw new Error('Failed to load district data');
        const data = await response.json();
        
        if (active) {
          setDirectoryVillages(data.villages || []);
        }
      } catch (err) {
        console.error('Error fetching village data:', err);
        if (active) {
          setDirectoryVillages([]);
        }
      } finally {
        if (active) {
          setIsLoadingDir(false);
        }
      }
    };

    loadDistrictData();
    return () => {
      active = false;
    };
  }, [selectedDistrict]);

  // Extract unique blocks from directory villages (with localized labels)
  const blockOptions = useMemo(() => {
    const map = new Map<string, string>();
    directoryVillages.forEach((v) => {
      if (v.block?.en) {
        map.set(v.block.en, v.block[lang] || v.block.en);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [directoryVillages, lang]);

  // Filtered Directory list
  const filteredDirectory = useMemo(() => {
    return directoryVillages.filter((v) => {
      const name = (v.name[lang] || v.name.en || '').toLowerCase();
      const blockEn = (v.block.en || '').toLowerCase();
      const blockLocal = (v.block[lang] || '').toLowerCase();
      const panchayatEn = (v.panchayat.en || '').toLowerCase();
      const panchayatLocal = (v.panchayat[lang] || '').toLowerCase();
      
      const code = v.code || '';
      const c2011 = v.census2011 || '';
      const c2001 = v.census2001 || '';
      const query = directoryQuery.toLowerCase();

      const matchesSearch = 
        name.includes(query) || 
        panchayatEn.includes(query) || 
        panchayatLocal.includes(query) || 
        code.includes(query) ||
        c2011.includes(query) ||
        c2001.includes(query);

      const matchesBlock = selectedBlock === 'all' || blockEn === selectedBlock.toLowerCase();

      return matchesSearch && matchesBlock;
    });
  }, [directoryVillages, directoryQuery, selectedBlock, lang]);

  // Group and compute Gram Panchayats dynamically from the loaded villages list
  const panchayatsData = useMemo(() => {
    const map = new Map<string, { code: string; name: { en: string; hi: string; mai: string }; block: { en: string; hi: string; mai: string }; villagesCount: number; population: number; literacySum: number; literacyCount: number }>();
    directoryVillages.forEach((v) => {
      if (!v.panchayat || !v.panchayat.code) return;
      const code = v.panchayat.code;
      let row = map.get(code);
      if (!row) {
        row = {
          code,
          name: v.panchayat,
          block: v.block,
          villagesCount: 0,
          population: 0,
          literacySum: 0,
          literacyCount: 0
        };
        map.set(code, row);
      }
      row.villagesCount += 1;
      if (v.demographics) {
        row.population += v.demographics.population;
        row.literacySum += v.demographics.literacyRate;
        row.literacyCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const nameA = a.name[lang] || a.name.en || '';
      const nameB = b.name[lang] || b.name.en || '';
      return nameA.localeCompare(nameB);
    });
  }, [directoryVillages, lang]);

  // Filtered Panchayats list
  const filteredPanchayats = useMemo(() => {
    return panchayatsData.filter((p) => {
      const name = (p.name[lang] || p.name.en || '').toLowerCase();
      const blockEn = (p.block.en || '').toLowerCase();
      const blockLocal = (p.block[lang] || '').toLowerCase();
      const code = p.code || '';
      const query = directoryQuery.toLowerCase();

      const matchesSearch = 
        name.includes(query) || 
        blockEn.includes(query) || 
        blockLocal.includes(query) || 
        code.includes(query);

      const matchesBlock = selectedBlock === 'all' || blockEn === selectedBlock.toLowerCase();

      return matchesSearch && matchesBlock;
    });
  }, [panchayatsData, directoryQuery, selectedBlock, lang]);

  // Group and compute Blocks dynamically from the loaded villages list
  const blocksData = useMemo(() => {
    const map = new Map<string, { key: string; name: { en: string; hi: string; mai: string }; panchayats: Set<string>; villagesCount: number; population: number; literacySum: number; literacyCount: number }>();
    
    directoryVillages.forEach((v) => {
      if (!v.block || !v.block.en) return;
      const blockKey = v.block.en.toLowerCase();
      let row = map.get(blockKey);
      if (!row) {
        row = {
          key: blockKey,
          name: v.block,
          panchayats: new Set(),
          villagesCount: 0,
          population: 0,
          literacySum: 0,
          literacyCount: 0
        };
        map.set(blockKey, row);
      }
      if (v.panchayat && v.panchayat.code) {
        row.panchayats.add(v.panchayat.code);
      }
      row.villagesCount += 1;
      if (v.demographics) {
        row.population += v.demographics.population;
        row.literacySum += v.demographics.literacyRate;
        row.literacyCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const nameA = a.name[lang] || a.name.en || '';
      const nameB = b.name[lang] || b.name.en || '';
      return nameA.localeCompare(nameB);
    });
  }, [directoryVillages, lang]);

  // Filtered Blocks list
  const filteredBlocks = useMemo(() => {
    return blocksData.filter((b) => {
      const name = (b.name[lang] || b.name.en || '').toLowerCase();
      const query = directoryQuery.toLowerCase();

      const matchesSearch = name.includes(query);
      const matchesBlock = selectedBlock === 'all' || b.key === selectedBlock.toLowerCase();

      return matchesSearch && matchesBlock;
    });
  }, [blocksData, directoryQuery, selectedBlock, lang]);

  // Resolve which list to display
  const activeList = useMemo(() => {
    if (directoryView === 'panchayats') return filteredPanchayats;
    if (directoryView === 'blocks') return filteredBlocks;
    return filteredDirectory;
  }, [directoryView, filteredDirectory, filteredPanchayats, filteredBlocks]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return activeList.slice(startIndex, startIndex + itemsPerPage);
  }, [activeList, currentPage]);

  const totalPages = Math.max(1, Math.ceil(activeList.length / itemsPerPage));

  // Paginated Directory list




  // Reset pagination when directoryView changes
  useEffect(() => {
    setCurrentPage(1);
  }, [directoryQuery, selectedBlock, directoryView]);

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

      {/* ================= SECTION 1: CURATED HERITAGE VILLAGES ================= */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border-color dark:border-zinc-800 pb-6 px-4">
          <div>
            <h2 className="text-3xl font-bold font-heading text-foreground mb-2">
              ✨ {t.featuredTitle}
            </h2>
            <p className="text-sm text-text-muted">
              {lang === 'en' ? 'Handpicked centers of Mithila art, Sanskrit scholarship, and ancient legacy.' : 
               lang === 'hi' ? 'मिथिला कला, संस्कृत विद्वता और प्राचीन विरासत के चुनिंदा केंद्र।' : 
               'मिथिला कला, संस्कृत विद्वता आ प्राचीन विरासतक चुनिंदा केंद्र।'}
            </p>
          </div>

          {/* Search Curated */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={curatedQuery}
              onChange={(e) => setCuratedQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-border-color dark:border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-red transition-all text-sm text-foreground"
            />
          </div>
        </div>

        {/* Curated Grid */}
        {filteredCurated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {filteredCurated.map((village) => (
              <MithilaCard
                key={village.slug}
                className="p-8 group flex flex-col justify-between h-full hover:shadow-lg border border-border-color dark:border-zinc-800"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary-red/5 flex items-center justify-center text-primary-red text-2xl group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                      🏡
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-primary-yellow/10 text-primary-yellow border border-primary-yellow/20 rounded-full flex items-center gap-1">
                      <MapPin size={10} />
                      {village.district[lang] || village.district.en}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-foreground font-heading tracking-tight">
                    {village.name[lang] || village.name.en}
                  </h3>
                  
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-4 flex items-center gap-1.5 font-bold">
                    <Compass size={12} className="text-primary-red" />
                    {t.blockLabel}: {village.block[lang] || village.block.en}
                  </p>

                  <div className="mb-4 bg-gray-50 dark:bg-zinc-900/30 p-3 rounded-lg border border-gray-100 dark:border-zinc-900">
                    <span className="text-xs text-text-muted font-bold block mb-1 uppercase tracking-wide flex items-center gap-1">
                      <Award size={12} className="text-primary-red" />
                      {t.famousLabel}
                    </span>
                    <p className="text-sm font-semibold text-primary-red">
                      {village.famousFor[lang] || village.famousFor.en}
                    </p>
                  </div>

                  <p className="text-[0.95rem] text-text-muted leading-relaxed font-serif italic mb-6">
                    {village.description[lang] || village.description.en}
                  </p>
                </div>

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
          <div className="text-center py-12 px-4 bg-white dark:bg-white/5 border border-border-color dark:border-zinc-800 rounded-3xl max-w-2xl mx-auto">
            <p className="text-text-muted font-semibold">{t.noResults}</p>
          </div>
        )}
      </section>

      {/* ================= SECTION 2: BIHAR ENTIRE LGD DIRECTORY ================= */}
      <section className="bg-gray-50/50 dark:bg-zinc-900/10 border border-border-color dark:border-zinc-800/80 rounded-3xl p-6 md:p-10 shadow-xs relative">
        <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.015] pointer-events-none rounded-3xl" />
        
        <header className="mb-10 text-center md:text-left relative z-10">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
            🗂️ {t.directoryTitle}
          </h2>
          <p className="text-text-muted text-sm max-w-2xl">
            {t.directorySubtitle}
          </p>
        </header>

        {/* View Segmented Tabs Toggle */}
        <div className="flex border-b border-border-color dark:border-zinc-800 mb-8 relative z-10 gap-1 overflow-x-auto pb-2">
          <button
            onClick={() => setDirectoryView('villages')}
            className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
              directoryView === 'villages'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
            }`}
          >
            🏡 {t.viewVillages}
          </button>
          <button
            onClick={() => setDirectoryView('panchayats')}
            className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
              directoryView === 'panchayats'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
            }`}
          >
            🏛️ {t.viewPanchayats}
          </button>
          <button
            onClick={() => setDirectoryView('blocks')}
            className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
              directoryView === 'blocks'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white dark:bg-zinc-900/40 text-text-muted hover:text-foreground border border-border-color dark:border-zinc-800'
            }`}
          >
            📦 {t.viewBlocks}
          </button>
        </div>

        {/* Directory Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
          {/* District Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {t.selectDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red text-foreground text-sm font-semibold transition-all shadow-sm"
            >
              {BIHAR_DISTRICTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d[lang] || d.en}
                </option>
              ))}
            </select>
          </div>

          {/* Block Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {t.blockLabel}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              disabled={isLoadingDir}
              className="px-4 py-3 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red text-foreground text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <option value="all">{t.selectBlock}</option>
              {blockOptions.map(([blockEn, blockLabel]) => (
                <option key={blockEn} value={blockEn}>
                  {blockEn === blockLabel ? blockEn : `${blockEn} (${blockLabel})`}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {lang === 'en' ? 'Search Directory' : lang === 'hi' ? 'निर्देशिका खोज' : 'निर्देशिका खोज'}
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t.searchDirectoryPlaceholder}
                value={directoryQuery}
                onChange={(e) => setDirectoryQuery(e.target.value)}
                disabled={isLoadingDir}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red transition-all text-sm text-foreground shadow-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Directory Results */}
        <div className="relative min-h-60 z-10">
          {isLoadingDir ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-black/20 rounded-2xl">
              <Loader2 className="w-10 h-10 text-primary-red animate-spin" />
              <p className="text-sm font-bold text-primary-red animate-pulse">
                {t.loadingText}
              </p>
            </div>
          ) : null}

          {/* Records Counter */}
          {!isLoadingDir && (
            <div className="flex justify-between items-center mb-4 text-xs font-bold text-text-muted uppercase tracking-wider px-2">
              <span>
                {directoryView === 'villages' && `${t.totalRecords}: ${filteredDirectory.length}`}
                {directoryView === 'panchayats' && `${t.viewPanchayats}: ${filteredPanchayats.length}`}
                {directoryView === 'blocks' && `${t.viewBlocks}: ${filteredBlocks.length}`}
              </span>
              <span>
                {t.paginationPage} {currentPage} / {totalPages}
              </span>
            </div>
          )}

          {/* Main Directory Table */}
          <div className="overflow-x-auto bg-white dark:bg-zinc-950/40 rounded-2xl border border-border-color dark:border-zinc-800/60 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-zinc-900/50 border-b border-border-color dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">#</th>
                  {directoryView === 'villages' && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.tableVillage}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.tablePanchayat}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.tableBlock}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t.tableLgdCode}</th>
                    </>
                  )}
                  {directoryView === 'panchayats' && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.viewPanchayats}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.tableBlock}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">{t.colMemberVillages}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t.colTotalPopulation}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t.colAction}</th>
                    </>
                  )}
                  {directoryView === 'blocks' && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t.viewBlocks}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">{t.colTotalPanchayats}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">{t.colTotalVillages}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t.colTotalPopulation}</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t.colAvgLiteracy}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color dark:divide-zinc-800/40">
                {paginatedList.length > 0 ? (
                  paginatedList.map((item: any, index) => {
                    const rowNum = (currentPage - 1) * itemsPerPage + index + 1;

                    // Villages View Row
                    if (directoryView === 'villages') {
                      const v = item;
                      const blockEn = v.block.en;
                      const blockLocal = v.block[lang] || v.block.en;
                      const blockText = blockEn === blockLocal ? blockEn : `${blockEn} (${blockLocal})`;
                      
                      return (
                        <tr 
                          key={v.code} 
                          className="hover:bg-primary-red/5 dark:hover:bg-primary-red/5 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-text-muted">
                            {rowNum}
                          </td>
                          <td className="px-6 py-3.5">
                            <Link
                              href={`/${lang}/villages/village/${selectedDistrict}/${v.code}`}
                              className="text-sm font-bold text-foreground block hover:text-primary-red hover:underline transition-colors"
                            >
                              {v.name[lang] || v.name.en}
                            </Link>
                            <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                              LGD: {v.code} {v.census2011 && `| Census 2011: ${v.census2011}`} {v.census2001 && `| Census 2001: ${v.census2001}`}
                            </span>
                            {v.demographics && (
                              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[10px] font-semibold text-text-muted">
                                <span className="inline-flex items-center gap-0.5 text-foreground/75">
                                  👥 {v.demographics.population.toLocaleString()}
                                </span>
                                <span className="text-gray-300 dark:text-zinc-700">|</span>
                                <span className="inline-flex items-center gap-0.5">
                                  ♂️ {v.demographics.male.toLocaleString()} / ♀️ {v.demographics.female.toLocaleString()}
                                </span>
                                <span className="text-gray-300 dark:text-zinc-700">|</span>
                                <span className="inline-flex items-center gap-0.5">
                                  📖 {t.literacyLabel.split(' ')[0]}: {v.demographics.literacyRate}%
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5">
                            {v.panchayat.en ? (
                              <Link
                                href={`/${lang}/villages/panchayat/${selectedDistrict}/${v.panchayat.code}`}
                                className="inline-flex items-center gap-1.5 text-sm text-primary-red hover:text-red-800 font-semibold cursor-pointer border-b border-dashed border-primary-red/30 hover:border-primary-red transition-all no-underline"
                              >
                                <Building2 size={13} className="text-primary-yellow" />
                                {v.panchayat[lang] || v.panchayat.en}
                              </Link>
                            ) : (
                              <span className="text-xs italic text-text-muted">Urban/Unmapped</span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-foreground/80 font-medium">
                            {blockText}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-sm bg-gray-100 dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/80 text-xs font-mono text-text-muted">
                              <Hash size={10} />
                              {v.code}
                            </span>
                          </td>
                        </tr>
                      );
                    }

                    // Panchayats View Row
                    if (directoryView === 'panchayats') {
                      const p = item;
                      const blockLocal = p.block[lang] || p.block.en;
                      const avgLit = p.literacyCount > 0 ? Math.round((p.literacySum / p.literacyCount) * 10) / 10 : 0;
                      
                      return (
                        <tr 
                          key={p.code} 
                          className="hover:bg-primary-red/5 dark:hover:bg-primary-red/5 transition-colors duration-150"
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-text-muted">
                            {rowNum}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="text-sm font-bold text-foreground block">
                              {p.name[lang] || p.name.en}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                              LGD Code: {p.code}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-sm text-foreground/80 font-medium">
                            {p.block.en} ({blockLocal})
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold text-center text-foreground/80">
                            {p.villagesCount}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-bold text-right text-foreground font-mono">
                            {p.population > 0 ? p.population.toLocaleString() : 'N/A'}
                            {p.population > 0 && avgLit > 0 && (
                              <span className="block text-[9px] font-semibold text-text-muted font-sans mt-0.5">
                                Avg Lit: {avgLit}%
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <Link
                              href={`/${lang}/villages/panchayat/${selectedDistrict}/${p.code}`}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-red hover:bg-red-800 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-xs cursor-pointer no-underline"
                            >
                              {t.viewDetails} →
                            </Link>
                          </td>
                        </tr>
                      );
                    }

                    // Blocks View Row
                    if (directoryView === 'blocks') {
                      const b = item;
                      const avgLit = b.literacyCount > 0 ? Math.round((b.literacySum / b.literacyCount) * 10) / 10 : 0;
                      
                      return (
                        <tr 
                          key={b.key} 
                          className="hover:bg-primary-red/5 dark:hover:bg-primary-red/5 transition-colors duration-150"
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-text-muted">
                            {rowNum}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-bold text-foreground">
                            {b.name[lang] || b.name.en}
                            {b.name.en !== (b.name[lang] || b.name.en) && (
                              <span className="block text-[10px] text-text-muted font-normal mt-0.5">
                                {b.name.en}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold text-center text-foreground/80">
                            {b.panchayatsCount}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold text-center text-foreground/80">
                            {b.villagesCount}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-bold text-right text-foreground font-mono">
                            {b.population > 0 ? b.population.toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold text-right text-foreground/80">
                            {avgLit > 0 ? `${avgLit}%` : 'N/A'}
                          </td>
                        </tr>
                      );
                    }
                    
                    return null;
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-text-muted font-medium">
                      {t.noResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoadingDir && (
            <div className="flex justify-between items-center mt-6 gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-0 rounded-full font-bold text-sm cursor-pointer transition-all bg-white dark:bg-zinc-900 text-foreground shadow-sm hover:shadow-md border border-border-color dark:border-zinc-800 disabled:opacity-50 flex items-center gap-1 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                {t.paginationPrev}
              </button>

              <span className="text-sm text-text-muted font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border-0 rounded-full font-bold text-sm cursor-pointer transition-all bg-white dark:bg-zinc-900 text-foreground shadow-sm hover:shadow-md border border-border-color dark:border-zinc-800 disabled:opacity-50 flex items-center gap-1 disabled:cursor-not-allowed"
              >
                {t.paginationNext}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

        </div>
  );
}

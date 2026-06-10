import { getDictionary } from '@/get-dictionary';
import VillageDetailContent from './VillageDetailContent';

export const dynamic = 'force-dynamic';

interface Params {
  lang: string;
  district: string;
  code: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = (resolvedParams.lang || 'en') as 'en' | 'hi' | 'mai';
    const code = resolvedParams.code;
    const district = resolvedParams.district;
    
    const districtName = district.charAt(0).toUpperCase() + district.slice(1).replace(/-/g, ' ');

    const titles = {
        en: `Village Details (LGD: ${code}) - ${districtName} | Mithilawasi`,
        hi: `ग्राम विवरण (LGD: ${code}) - ${districtName} | मिथिला वासी`,
        mai: `गाम विवरण (LGD: ${code}) - ${districtName} | मिथिला वासी`
    };
    
    const descs = {
        en: `View detailed registry, administrative codes (LGD, Census 2011/2001), demographics, population stats, maps, and block registry for Village ${code} in ${districtName}, Bihar.`,
        hi: `बिहार के ${districtName} जिले में गाँव ${code} के लिए विस्तृत रजिस्ट्री, प्रशासनिक कोड (LGD, जनगणना 2011/2001), जनसांख्यिकी, जनसंख्या आँकड़े और मानचित्र देखें।`,
        mai: `बिहार कऽ ${districtName} जिला में गाम ${code} कऽ लेल विस्तृत रजिस्ट्री, प्रशासनिक कोड (LGD, जनगणना 2011/2001), जनसांख्यिकी, जनसंख्या आँकड़ा आ मानचित्र देखू।`
    };

    return {
        title: titles[lang] || titles.en,
        description: descs[lang] || descs.en,
    };
}

export default async function VillagePage({ params }: { params: Promise<Params> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = (resolvedParams.lang || 'en') as 'en' | 'hi' | 'mai';
    const district = resolvedParams.district;
    const code = resolvedParams.code;
    const dict = await getDictionary(lang);

    return (
        <VillageDetailContent 
            lang={lang} 
            district={district} 
            code={code} 
            dict={dict} 
        />
    );
}

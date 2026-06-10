import { getDictionary } from '@/get-dictionary';
import PanchayatDetailContent from './PanchayatDetailContent';

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
    
    // Capitalize district name for title
    const districtName = district.charAt(0).toUpperCase() + district.slice(1).replace(/-/g, ' ');

    const titles = {
        en: `Gram Panchayat Details (LGD: ${code}) - ${districtName} | Mithilawasi`,
        hi: `ग्राम पंचायत विवरण (LGD: ${code}) - ${districtName} | मिथिला वासी`,
        mai: `ग्राम पञ्चायत विवरण (LGD: ${code}) - ${districtName} | मिथिला वासी`
    };
    
    const descs = {
        en: `Explore comprehensive registry, administrative codes, elected representatives, member villages, and maps for Gram Panchayat ${code} in ${districtName}, Bihar.`,
        hi: `बिहार के ${districtName} जिले में ग्राम पंचायत ${code} के लिए व्यापक रजिस्ट्री, प्रशासनिक कोड, निर्वाचित प्रतिनिधि, सदस्य गांव और मानचित्र देखें।`,
        mai: `बिहार कऽ ${districtName} जिला में ग्राम पञ्चायत ${code} कऽ लेल व्यापक रजिस्ट्री, प्रशासनिक कोड, निर्वाचित प्रतिनिधि, सदस्य गाम आ मानचित्र देखू।`
    };

    return {
        title: titles[lang] || titles.en,
        description: descs[lang] || descs.en,
    };
}

export default async function PanchayatPage({ params }: { params: Promise<Params> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = (resolvedParams.lang || 'en') as 'en' | 'hi' | 'mai';
    const district = resolvedParams.district;
    const code = resolvedParams.code;
    const dict = await getDictionary(lang);

    return (
        <PanchayatDetailContent 
            lang={lang} 
            district={district} 
            code={code} 
            dict={dict} 
        />
    );
}

import { getDictionary } from '@/get-dictionary';
import VillagesContent from './VillagesContent';
import villagesData from '@/data/villages.json';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    
    const titles = {
        en: "Mithila Village Directory & Registry | Mithilawasi",
        hi: "मिथिला ग्राम निर्देशिका और रजिस्ट्री | मिथिला वासी",
        mai: "मिथिला गाम निर्देशिका आ रजिस्ट्री | मिथिला वासी"
    };
    
    const descs = {
        en: "Explore the ancestral villages of Mithilanchal. Search by district and block, and discover local heritage, traditional crafts, and famous personalities.",
        hi: "मिथिलांचल के पैतृक गांवों की खोज करें। जिले और प्रखंड के अनुसार खोजें, स्थानीय विरासत, शिल्प और प्रसिद्ध हस्तियों के बारे में जानें।",
        mai: "मिथिलांचल कऽ पैतृक गाम सभक खोज करू। जिला आ प्रखंडक अनुसार खोजू, स्थानीय विरासत, शिल्प आ प्रसिद्ध विभूति सभक जानकारी प्राप्त करू।"
    };

    return {
        title: titles[lang] || titles.en,
        description: descs[lang] || descs.en,
    };
}

export default async function VillagesPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const schemaData = {
        name: lang === 'en' ? "Mithila Village Directory" : lang === 'hi' ? "मिथिला ग्राम निर्देशिका" : "मिथिला गाम निर्देशिका",
        description: dict.navigation.villages || "Village Directory",
        url: `https://mithilawasi.com/${lang}/villages`
    };

    return (
        <>
            <JsonLd type="CollectionPage" data={schemaData} />
            <VillagesContent lang={lang} dict={dict} villages={villagesData} />
        </>
    );
}

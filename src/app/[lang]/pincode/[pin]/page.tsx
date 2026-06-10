import { getDictionary } from '@/get-dictionary';
import PincodeDetailContent from './PincodeDetailContent';

export const dynamic = 'force-dynamic';

interface Params {
  lang: string;
  pin: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const resolvedParams = await Promise.resolve(params);
  const lang = (resolvedParams.lang || 'en') as 'en' | 'hi' | 'mai';
  const pin = resolvedParams.pin;

  const titles = {
    en: `Pincode ${pin} - Villages, Post Offices & Area Info | Mithilawasi`,
    hi: `पिनकोड ${pin} - गाँव, डाकघर और क्षेत्र की जानकारी | मिथिला वासी`,
    mai: `पिनकोड ${pin} - गाम, डाकघर आ क्षेत्र कऽ जानकारी | मिथिला वासी`,
  };

  const descs = {
    en: `Explore pincode ${pin} — find all villages, blocks, population data, and post offices served by this postal code in Bihar, India.`,
    hi: `पिनकोड ${pin} के अंतर्गत सभी गाँव, प्रखंड, जनसंख्या डेटा और डाकघरों की जानकारी प्राप्त करें।`,
    mai: `पिनकोड ${pin} क अंतर्गत सभ गाम, प्रखंड, जनसंख्या डेटा आ डाकघर कऽ जानकारी प्राप्त करू।`,
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descs[lang as keyof typeof descs] || descs.en,
    keywords: [`${pin}`, `pincode ${pin}`, `${pin} villages`, `${pin} post office`, 'bihar pincode', 'mithila pincode'],
  };
}

export default async function PincodePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await Promise.resolve(params);
  const lang = (resolvedParams.lang || 'en') as 'en' | 'hi' | 'mai';
  const pin = resolvedParams.pin;
  const dict = await getDictionary(lang);

  return <PincodeDetailContent lang={lang} pin={pin} dict={dict} />;
}

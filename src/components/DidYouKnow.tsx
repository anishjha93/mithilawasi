
'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

export default function DidYouKnow({ lang }: { lang: string }) {
    const facts = [
        {
            en: "Mithila was the first republic in the world (Vajjika League at Vaishali).",
            hi: "मिथिला दुनिया का पहला गणराज्य था (वैशाली में वज्जी संघ)।",
            mai: "मिथिला विश्वक पहिल गणराज्य छल (वैशाली मे वज्जी संघ)।"
        },
        {
            en: "The Madhubani painting tradition is believed to have started during the wedding of Lord Ram and Sita.",
            hi: "माना जाता है कि मधुबनी पेंटिंग की परंपरा भगवान राम और सीता के विवाह के दौरान शुरू हुई थी।",
            mai: "मानल जाइत अछि जे मधुबनी पेंटिंग क परंपरा भगवान राम आ सीता क विवाह क समय शुरू भेल छल।"
        },
        {
            en: "Vidyapati, the great poet of Mithila, is known as the 'Maithil Kokil' (Cuckoo of Mithila).",
            hi: "मिथिला के महान कवि विद्यापति को 'मैथिल कोकिल' के नाम से जाना जाता है।",
            mai: "मिथिला क महान कवि विद्यापति के 'मैथिल कोकिल' क नाम स जानल जाइत अछि।"
        },
        {
            en: "Makhana (Fox Nut) from Mithila has received the GI (Geographical Indication) Tag.",
            hi: "मिथिला के मखाना को GI (भौगोलिक संकेत) टैग मिला है।",
            mai: "मिथिला क मखाना के जीआई (GI) टैग भेटल अछि।"
        },
        {
            en: "The Paag is a symbol of honor and respect in Maithil culture, historically awarded for intellectual prowess.",
            hi: "पाग मैथिल संस्कृति में सम्मान का प्रतीक है, जो ऐतिहासिक रूप से बौद्धिक कौशल के लिए दिया जाता था।",
            mai: "पाग मैथिल संस्कृति मे सम्मान क प्रतीक अछि, जे ऐतिहासिक रूप स विद्वता क लेल देल जाइत छल।"
        }
    ];

    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Random start
        setCurrentFactIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentFactIndex((prev) => (prev + 1) % facts.length);
            setIsAnimating(false);
        }, 300);
    };

    const currentFact = facts[currentFactIndex] as any;
    const text = currentFact?.[lang] || currentFact?.['en'];

    return (
        <div className="bg-[#fdfbf7] dark:bg-zinc-900 border border-border-color rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightbulb className="w-24 h-24 text-[#ffc300]" />
            </div>

            <div className="relative z-10">
                <h3 className="font-bold text-primary-red mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <Lightbulb className="w-5 h-5" />
                    {lang === 'hi' ? 'क्या आप जानते हैं?' : (lang === 'mai' ? 'की अहाँ जानैत छी?' : 'Did you know?')}
                </h3>

                <p className={`text-lg text-gray-800 dark:text-gray-100 leading-relaxed min-h-[80px] font-medium transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    "{text}"
                </p>

                <button
                    onClick={nextFact}
                    className="mt-4 text-xs font-bold text-gray-500 dark:text-gray-300 hover:text-primary-red flex items-center gap-1 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    {lang === 'en' ? 'Another Fact' : (lang === 'hi' ? 'अगला तथ्य' : 'अगिला तथ्य')}
                </button>
            </div>
        </div>
    );
}

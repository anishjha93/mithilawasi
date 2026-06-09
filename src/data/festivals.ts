export interface FestivalLocale {
    name: string;
    description: string;
    significance: string;
}

export interface Festival {
    slug: string;
    date_2026: string;
    month: string; // Maithili month
    image: string;
    locales: {
        en: FestivalLocale;
        hi: FestivalLocale;
        mai: FestivalLocale;
    };
}

export const festivals: Festival[] = [
    {
        slug: "jur-sheetal",
        date_2026: "2026-04-14",
        month: "Baishakh",
        image: "https://cdn.mithilawasi.com/festivals/jur-sital.webp",
        locales: {
            en: {
                name: "Jur Sheetal (Maithili New Year)",
                description: "The Maithili New Year, celebrated by watering plants and eating stale food (Basi Pauaa) to cool the body.",
                significance: "Marks the beginning of the Maithili calendar and the summer season."
            },
            hi: {
                name: "जुड़ शीतल (मैथिली नव वर्ष)",
                description: "मैथिली नव वर्ष, जिसे पेड़-पौधों को पानी देकर और बासी भोजन (बासी पौआ) खाकर मनाया जाता है।",
                significance: "मैथिली कैलेंडर और ग्रीष्म ऋतु की शुरुआत का प्रतीक।"
            },
            mai: {
                name: "जुड़ शीतल",
                description: "मैथिली नव वर्ष, जाहि में गाछ-बिरिछ में पानि देल जाइत अछि आओर बासी भात (बासी पौआ) खाएल जाइत अछि।",
                significance: "मैथिली पंचांग आओर गर्मीक शुरुआत।"
            }
        }
    },
    {
        slug: "vat-savitri",
        date_2026: "2026-05-18",
        month: "Jyeshtha",
        image: "https://cdn.mithilawasi.com/festivals/jitiya-vrat.webp",
        locales: {
            en: {
                name: "Vat Savitri",
                description: "A festival where married women worship the Banyan tree for the longevity of their husbands.",
                significance: "Symbolizes the devotion of Savitri who brought her husband back from death."
            },
            hi: {
                name: "वट सावित्री",
                description: "एक त्योहार जिसमें विवाहित महिलाएं अपने पति की लंबी उम्र के लिए बरगद के पेड़ की पूजा करती हैं।",
                significance: "सावित्री की भक्ति का प्रतीक, जिसने अपने पति को मृत्यु से वापस लाया।"
            },
            mai: {
                name: "बट सावित्री",
                description: "अहि पावनि में सुहागिन महिला सब अपन स्वामीक दीर्घायु लेल बरगद गाछक पूजा करैत छथि।",
                significance: "सावित्रीक पतिव्रता धर्मक प्रतीक।"
            }
        }
    },
    {
        slug: "madhushravani",
        date_2026: "2026-07-28",
        month: "Shravan",
        image: "https://cdn.mithilawasi.com/festivals/madhushravani.webp",
        locales: {
            en: {
                name: "Madhushravani",
                description: "A 13-day festival for newlywed brides, involving storytelling and worship of Naga (snake deities).",
                significance: "Celebrates marital bliss and teaches lessons from mythology."
            },
            hi: {
                name: "मधुश्रावणी",
                description: "नवविवाहित दुल्हनों के लिए 13 दिनों का त्योहार, जिसमें कथा वाचन और नाग देवताओं की पूजा शामिल है।",
                significance: "वैवाहिक आनंद का उत्सव और पौराणिक कथाओं से सीख।"
            },
            mai: {
                name: "मधुश्रावणी",
                description: "नवविवाहिता लेल 13 दिनक पावनि, जाहि में मैना-पंचमी आओर विषहरक पूजा होइत अछि।",
                significance: "दाम्पत्य जीवनक सुख आओर पौराणिक कथा सँ शिक्षा।"
            }
        }
    },
    {
        slug: "chhath-puja",
        date_2026: "2026-11-15",
        month: "Kartik",
        image: "https://cdn.mithilawasi.com/festivals/chhath-puja.webp",
        locales: {
            en: {
                name: "Chhath Puja",
                description: "The most revered festival of Mithila, dedicated to the Sun God and Chhathi Maiya, emphasizing purity and nature.",
                significance: "Thanksgiving to nature and the Sun for bestowing life."
            },
            hi: {
                name: "छठ पूजा",
                description: "मिथिला का सबसे पवित्र त्योहार, जो सूर्य देव और छठी मैया को समर्पित है, जिसमें पवित्रता और प्रकृति पर जोर दिया जाता है।",
                significance: "जीवन प्रदान करने के लिए प्रकृति और सूर्य का धन्यवाद।"
            },
            mai: {
                name: "छठि पावनि",
                description: "मिथिलाक सभ सँ पैघ पावनि, जे सूर्य देव आओर छठी मैया कऽ समर्पित अछि।",
                significance: "प्रकृति आओर सूर्य कऽ प्रति कृतज्ञता।"
            }
        }
    },
    {
        slug: "sama-chakeva",
        date_2026: "2026-11-25",
        month: "Kartik",
        image: "https://cdn.mithilawasi.com/festivals/sama-chakeva.webp",
        locales: {
            en: {
                name: "Sama Chakeva",
                description: "A festival celebrating the bond between brothers and sisters through folk songs and clay idols.",
                significance: "Based on the legend of Krishna's daughter Sama and her brother Samba."
            },
            hi: {
                name: "सामा चकेवा",
                description: "भाई-बहन के प्रेम का प्रतीक, जिसे लोक गीतों और मिट्टी की मूर्तियों के माध्यम से मनाया जाता है।",
                significance: "कृष्ण की पुत्री सामा और उनके भाई साम्ब की कथा पर आधारित।"
            },
            mai: {
                name: "सामा चकेवा",
                description: "भाइ-बहिनक प्रेम कर प्रतीक, जाहि में लोक गीत आओर माटिक मूर्ति बना कऽ खेलल जाइत अछि।",
                significance: "साम्ब आओर सामाक पौराणिक कथा पर आधारित।"
            }
        }
    },
    {
        slug: "vivah-panchami",
        date_2026: "2026-12-13",
        month: "Margashirsha",
        image: "https://cdn.mithilawasi.com/festivals/vivah-panchami.webp",
        locales: {
            en: {
                name: "Vivah Panchami",
                description: "Celebrates the wedding of Lord Rama and Sita in Janakpur (Mithila).",
                significance: "Commemorates the union of Purusha and Prakriti."
            },
            hi: {
                name: "विवाह पंचमी",
                description: "जनकपुर (मिथिला) में भगवान राम और सीता के विवाह का उत्सव।",
                significance: "पुरुष और प्रकृति के मिलन का स्मरण।"
            },
            mai: {
                name: "विवाह पंचमी",
                description: "सिया-पिया (सीता-राम) के विवाहक उत्सव, जे जनकपुर में धूमधाम स मनाओल जाइत अछि।",
                significance: "राम-सीताक विवाहक सालगिरह।"
            }
        }
    },
    {
        slug: "kojagara",
        date_2026: "2026-10-25",
        month: "Ashwin",
        image: "https://cdn.mithilawasi.com/festivals/kojagara.webp",
        locales: {
            en: {
                name: "Kojagara (Lakshmi Puja)",
                description: "Celebrated on Sharad Purnima, invoking Goddess Lakshmi. Newly married grooms receive gifts (Makhan, Paan).",
                significance: "Celebrates prosperity and marital bliss."
            },
            hi: {
                name: "कोजागरा",
                description: "शरद पूर्णिमा को मनाया जाने वाला पर्व। नवविवाहित वरों का मखाना और पान से स्वागत होता है।",
                significance: "समृद्धि और वैवाहिक जीवन की मंगलकामना।"
            },
            mai: {
                name: "कोजागरा",
                description: "शरद पूर्णिमा कऽ दिन मनाओल जाय बला पावनि, जाहि में नव-विवाहित वर कऽ चुमाओन होइत अछि।",
                significance: "लक्ष्मी आगमन आओर नव दाम्पत्य जीवनक सुख।"
            }
        }
    },
    {
        slug: "janaki-navami",
        date_2026: "2026-05-24",
        month: "Vaishakh",
        image: "https://cdn.mithilawasi.com/festivals/chauth-chandra.webp",
        locales: {
            en: {
                name: "Janaki Navami",
                description: "The birth anniversary of Goddess Sita (Janaki), appearing from the earth while King Janak was ploughing.",
                significance: "Celebrates the feminine power and the daughter of Mithila."
            },
            hi: {
                name: "जानकी नवमी",
                description: "माता सीता (जानकी) का जन्मोत्सव।",
                significance: "मिथिला की बेटी और शक्ति का उत्सव।"
            },
            mai: {
                name: "जानकी नवमी",
                description: "जगजननी जानकी (सीता) कऽ प्राकट्य दिवस।",
                significance: "मिथिलाक बेटीक गौरव दिवस।"
            }
        }
    },
    {
        slug: "makar-sankranti",
        date_2026: "2026-01-14",
        month: "Magh",
        image: "https://cdn.mithilawasi.com/festivals/tila-sankranti.webp",
        locales: {
            en: {
                name: "Makar Sankranti (Til Sakraat)",
                description: "Marks the sun's transition into Capricorn. Celebrated with Til (sesame) and Chura-Dahi.",
                significance: "Harvest festival and change of season."
            },
            hi: {
                name: "मकर संक्रांति (तिल सकरात)",
                description: "सूर्य का मकर राशि में प्रवेश। तिल और चूड़ा-दही खाकर मनाया जाता है।",
                significance: "फसल उत्सव और ऋतु परिवर्तन।"
            },
            mai: {
                name: "तिल सकरात",
                description: "सूर्य कऽ उत्तरायण होमय पर तिल-गुड़ आओर दही-चिवड़ा खाएल जाइत अछि।",
                significance: "आरोग्य आओर ऋतु परिवर्तन।"
            }
        }
    },
    {
        slug: "saraswati-puja",
        date_2026: "2026-01-24",
        month: "Magh",
        image: "https://cdn.mithilawasi.com/festivals/saraswati-puja.webp",
        locales: {
            en: {
                name: "Saraswati Puja (Vasant Panchami)",
                description: "Worship of the Goddess of Wisdom. Marks the arrival of Spring (Vasant).",
                significance: "Dedication to arts, music, and learning."
            },
            hi: {
                name: "सरस्वती पूजा (वसंत पंचमी)",
                description: "ज्ञान की देवी की पूजा। वसंत ऋतु के आगमन का प्रतीक।",
                significance: "कला, संगीत और शिक्षा के प्रति समर्पण।"
            },
            mai: {
                name: "सरस्वती पूजा",
                description: "विद्याक देवी सरस्वतीक आराधना। बसंत ऋतुक नूतन उत्साह।",
                significance: "कला आओर ज्ञानक उत्सव।"
            }
        }
    }
];

export async function getFestivals(): Promise<Festival[]> {
    return festivals;
}

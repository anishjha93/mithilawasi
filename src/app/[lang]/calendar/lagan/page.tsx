import { getDictionary } from "@/get-dictionary";
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ 
    params,
    searchParams 
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ year?: string }> 
}): Promise<Metadata> {
    const { lang } = await params;
    const resolvedSearch = await searchParams;
    const selectedYear = resolvedSearch.year === '2027' ? 2027 : 2026;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');

    const title = lang === 'mai' 
        ? `शुभ विवाह मुहूर्त ${selectedYear === 2027 ? '२०२७' : '२०२६'} - मिथिला पंचांग` 
        : (lang === 'hi' 
            ? `शुभ विवाह मुहूर्त ${selectedYear === 2027 ? '२०२७' : '२०२६'} - मिथिला पंचांग` 
            : `Auspicious Wedding Dates ${selectedYear} - Mithila Panchang`);

    const description = lang === 'mai' 
        ? `साल ${selectedYear === 2027 ? '२०२७' : '२०२६'} लेल मिथिलाक पारंपरिक पंचांगक अनुसार शुभ विवाहक मुहूर्त।` 
        : (lang === 'hi' 
            ? `वर्ष ${selectedYear === 2027 ? '२०२७' : '२०२६'} के लिए मिथिला के पारंपरिक पंचांग के अनुसार शुभ विवाह के मुहूर्त।` 
            : `Auspicious wedding dates (Lagan) for ${selectedYear} according to the traditional Mithila Panchang.`);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        }
    };
}

export default async function LaganPage({ 
    params,
    searchParams
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ year?: string }>
}) {
    const { lang } = await params;
    const resolvedSearch = await searchParams;
    const selectedYear = resolvedSearch.year === '2027' ? 2027 : 2026;
    const isYear2027 = selectedYear === 2027;

    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');
    const laganData = isYear2027 ? dict.calendarPage.lagan2027 : dict.calendarPage.lagan2026;

    const backLinkText = lang === 'mai' ? "पंचांग पर वापस" : (lang === 'hi' ? "पंचांग पर वापस" : "Back to Panchang");
    
    const introText = isYear2027
        ? (lang === 'mai' 
            ? "मिथिलाक परंपरा आ पंचांगक अनुसार वर्ष २०२७ लेल विवाहक सर्वाधिक शुभ तिथि सबहक सूची नीचाँ देल गेल अछि।" 
            : (lang === 'hi' 
                ? "मिथिला की परंपरा और पंचांग के अनुसार वर्ष २०२७ के लिए विवाह की सर्वाधिक शुभ तिथियों की सूची नीचे दी गई है।" 
                : "Below is the list of the most auspicious wedding dates for the year 2027 according to Mithila tradition and Panchang."))
        : (lang === 'mai' 
            ? "मिथिलाक परंपरा आ पंचांगक अनुसार वर्ष २०२६ लेल विवाहक सर्वाधिक शुभ तिथि सबहक सूची नीचाँ देल गेल अछि।" 
            : (lang === 'hi' 
                ? "मिथिला की परंपरा और पंचांग के अनुसार वर्ष २०२६ के लिए विवाह की सर्वाधिक शुभ तिथियों की सूची नीचे दी गई है।" 
                : "Below is the list of the most auspicious wedding dates for the year 2026 according to Mithila tradition and Panchang."));

    return (
        <main className="max-w-[1280px] mx-auto px-4 py-12">
            <div className="text-center mb-16 animate-in fade-in duration-700">
                <Link href={`/${lang}/calendar?date=${selectedYear}-05-17`} className="inline-flex items-center text-primary-red no-underline font-semibold mb-8 transition-transform hover:-translate-x-1">
                    ← {backLinkText}
                </Link>
                <h1 className="text-[3rem] font-bold text-primary-red">{laganData.title}</h1>
                <p className="text-[1.15rem] text-gray-700 dark:text-gray-300 max-w-[800px] mx-auto mt-6 leading-relaxed">{introText}</p>
            </div>

            {/* Year selector tabs */}
            <div className="flex justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <Link
                    href={`/${lang}/calendar/lagan?year=2026`}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-md hover:-translate-y-0.5 ${
                        !isYear2027
                            ? 'bg-primary-red text-white border-none shadow-[0_6px_15px_rgba(200,75,49,0.3)]'
                            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-border-color hover:bg-gray-50 dark:hover:bg-zinc-700'
                    }`}
                >
                    {lang === 'mai' ? '२०२६ क सूची' : (lang === 'hi' ? '२०२६ की सूची' : '2026 List')}
                </Link>
                <Link
                    href={`/${lang}/calendar/lagan?year=2027`}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-md hover:-translate-y-0.5 ${
                        isYear2027
                            ? 'bg-primary-red text-white border-none shadow-[0_6px_15px_rgba(200,75,49,0.3)]'
                            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-border-color hover:bg-gray-50 dark:hover:bg-zinc-700'
                    }`}
                >
                    {lang === 'mai' ? '२०२७ क सूची' : (lang === 'hi' ? '२०२७ की सूची' : '2027 List')}
                </Link>
            </div>

            <section className="mb-12">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8">
                    {laganData.list.map((item: any, index: number) => {
                        const dateObj = new Date(item.date);
                        return (
                            <div key={index} className="bg-white dark:bg-card-bg rounded-[20px] p-6 shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-border-color flex items-center gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium hover:border-primary-red/20 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" style={{ animationDelay: `${index * 30}ms` }}>
                                <div className="bg-gradient-to-br from-[#e91e63] to-[#c2185b] text-white p-3 rounded-xl min-w-[85px] text-center flex flex-col justify-center shadow-[0_4px_12px_rgba(233,30,99,0.3)]">
                                    <div className="text-[0.8rem] font-extrabold uppercase tracking-wider mb-0.5">
                                        {dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : 'mai-IN'), { month: 'short' }).toUpperCase()}
                                    </div>
                                    <div className="text-[1.85rem] font-black leading-none">
                                        {dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : 'mai-IN'), { day: '2-digit' })}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-[1.3rem] font-bold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                                    <p className="text-[0.95rem] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold capitalize">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="mt-20 text-center p-12 bg-gray-50 dark:bg-zinc-900/50 rounded-[30px] border border-border-color">
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium text-[1.05rem]">
                    {lang === 'mai' ? "अधिक जानकारी आओर दैनिक पंचांग विवरणक लेल मुख्य पंचांग पेज देखू।" : (lang === 'hi' ? "अधिक जानकारी और दैनिक पंचांग विवरण के लिए मुख्य पंचांग पेज देखें।" : "For more details, daily tithi calculations, nakshatras and daily panchang, visit our main page.")}
                </p>
                <Link href={`/${lang}/calendar?date=${selectedYear}-05-17`} className="inline-block bg-primary-red text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-primary-red/90">
                    {lang === 'mai' ? "मुख्य पंचांग" : (lang === 'hi' ? "मुख्य पंचांग" : "View Main Panchang")}
                </Link>
            </div>
        </main>
    );
}

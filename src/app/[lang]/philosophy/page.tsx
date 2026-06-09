import { getDictionary } from '@/get-dictionary';

export default async function PhilosophyPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);
    const { philosophyPage } = dict;

    if (!philosophyPage) { // Fallback if data not ready
        return <div className="container section-padding">Loading...</div>;
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-16">
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-primary-red mb-4 font-heading">{philosophyPage.title}</h1>
                <p className="text-[1.25rem] text-text-muted max-w-[800px] mx-auto">{philosophyPage.lead}</p>
            </header>

            {/* Nyaya Shastra Section */}
            <div className="mb-20 text-left">
                <h2 className="text-[2.2rem] text-primary-red mb-6 border-b-2 border-b-primary-yellow inline-block pb-2 font-heading font-bold">{philosophyPage.nyaya.title}</h2>
                <div className="bg-white dark:bg-card-bg p-10 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:-translate-y-1 hover:shadow-lg text-left h-full border-l-[5px] border-l-primary-red">
                    <p className="text-[1.2rem] leading-relaxed text-text-muted">{philosophyPage.nyaya.desc}</p>
                </div>
            </div>

            {/* Scholars Grid */}
            <div className="mb-20 text-left">
                <h2 className="text-[2.2rem] text-primary-red mb-6 border-b-2 border-b-primary-yellow inline-block pb-2 font-heading font-bold">{philosophyPage.scholars.title}</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
                    {philosophyPage.scholars.list.map((scholar: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-card-bg p-10 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:-translate-y-1 hover:shadow-lg text-left h-full group">
                            <h3 className="text-[1.6rem] text-primary-red mb-4 font-heading font-bold">{scholar.name}</h3>
                            <p className="text-[1.05rem] leading-relaxed text-text-muted">{scholar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panji Prabandh */}
            <div className="mb-20 text-left">
                <h2 className="text-[2.2rem] text-primary-red mb-6 border-b-2 border-b-primary-yellow inline-block pb-2 font-heading font-bold">{philosophyPage.panji.title}</h2>
                <div className="bg-white dark:bg-card-bg p-10 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:-translate-y-1 hover:shadow-lg text-left h-full border-l-[5px] border-l-primary-yellow">
                    <p className="text-[1.05rem] leading-relaxed text-text-muted">{philosophyPage.panji.desc}</p>
                </div>
            </div>
        </div>
    );
}

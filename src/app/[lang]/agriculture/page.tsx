import { getDictionary } from '@/get-dictionary';
import WeatherRiverDashboard from '@/components/WeatherRiverDashboard';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    return {
        title: dict.agriculturePage.title,
        description: dict.agriculturePage.description,
    };
}

export default async function AgriculturePage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    const { agriculturePage } = dict;

    return (
        <div className="container section-padding">
            <header className="text-center mb-20">
                <h1 className="text-[3rem] mb-6 text-primary-green font-bold font-heading leading-tight">{agriculturePage.title}</h1>
                <p className="text-[1.3rem] text-text-muted max-w-[800px] mx-auto leading-relaxed">
                    {agriculturePage.description}
                </p>
            </header>

            {/* Three Jewels: Maachh, Makhaan, Paan (and Mango) */}
            <section className="mb-12">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12">
                    {agriculturePage.crops.map((crop: any, idx: number) => (
                        <div key={idx} className="bg-card-bg dark:bg-card-bg p-10 rounded-[20px] shadow-sm border border-border-color dark:border-zinc-800 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="text-[5rem] mb-6 leading-none">{crop.icon}</div>
                            <h2 className="text-[2rem] mb-4 text-foreground dark:text-gray-100 font-bold font-heading">{crop.name}</h2>
                            <p className="text-[1.1rem] text-foreground opacity-80 dark:text-gray-400 leading-relaxed">{crop.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weather & River Dashboard Monitor */}
            <WeatherRiverDashboard lang={resolvedParams.lang} />

            {/* Fish Culture */}
            <section className="mt-20 bg-primary-green/5 dark:bg-primary-green/10 p-16 rounded-[24px] relative overflow-hidden border border-primary-green/10">
                <div className="relative z-10 text-center">
                    <h2 className="text-[2.5rem] text-primary-green mb-4 font-bold font-heading">🐟 {agriculturePage.fish.title}</h2>
                    <p className="text-[1.2rem] mb-12 max-w-[700px] mx-auto opacity-90 text-text-muted">{agriculturePage.fish.intro}</p>

                    <div className="flex flex-wrap justify-center gap-8">
                        {agriculturePage.fish.varieties.map((fish: any, idx: number) => (
                            <div key={idx} className="bg-card-bg dark:bg-card-bg px-10 py-6 rounded-full shadow-md text-foreground border border-primary-green/10 hover:shadow-lg transition-all">
                                <h3 className="m-0 text-primary-green text-[1.5rem] font-bold font-heading">{fish.name}</h3>
                                <p className="mt-2 text-[1rem] opacity-80 text-text-muted">{fish.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Decorative water wave */}
                <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-gradient-to-r from-primary-green/80 to-primary-green" />
            </section>
        </div>
    );
}

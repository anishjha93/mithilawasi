import { getDictionary } from '@/get-dictionary';
import { Heart, Shield, Globe, Users, Palette, History, BookOpen, Lightbulb, Mail, Facebook } from 'lucide-react';
import { MithilaCard } from '@/components/ui/heritage/MithilaCard';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const baseUrl = 'https://mithilawasi.com';
    const canonicalUrl = `${baseUrl}/${lang}/about`;

    return {
        title: dict.aboutPage.title,
        description: dict.aboutPage.mission.text,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-US': `${baseUrl}/en/about`,
                'hi-IN': `${baseUrl}/hi/about`,
                'mai-IN': `${baseUrl}/mai/about`,
                'x-default': `${baseUrl}/en/about`,
            },
        },
    };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    const pillarIcons = [Palette, History, BookOpen, Lightbulb];
    const valueIcons = [Shield, Heart, Users];

    return (
        <div className="bg-paper-white dark:bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden border-b border-primary-red/5">
                <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-40"></div>
                <div className="absolute inset-0 madhubani-pattern-bg opacity-5 pointer-events-none"></div>
                <div className="container relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full glass-morphism mb-6 animate-fade-in-up">
                        <span className="text-primary-red font-bold text-xs md:text-sm tracking-[0.3em] uppercase">{dict.aboutPage.title}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 text-mithila-ink animate-fade-in-up delay-100 italic">
                        Our Mission & <span className="text-primary-red">Legacy</span>
                    </h1>
                    <div className="h-1.5 w-32 mx-auto bg-primary-yellow rounded-full mb-8 shadow-sm animate-fade-in-up delay-200"></div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 container">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                    <MithilaCard variant="madhubani" className="p-8 md:p-12 group">
                        <div className="p-4 bg-primary-red/5 w-fit rounded-2xl mb-8 group-hover:bg-primary-red transition-all duration-300">
                            <Heart className="text-primary-red w-8 h-8 group-hover:text-white transition-colors" />
                        </div>
                        <HeritageHeading as="h2" className="text-3xl font-black mb-6">
                            {dict.aboutPage.mission.title}
                        </HeritageHeading>
                        <p className="text-xl text-text-muted leading-relaxed font-serif italic">
                            {dict.aboutPage.mission.text}
                        </p>
                    </MithilaCard>

                    <MithilaCard variant="madhubani" className="p-8 md:p-12 group">
                        <div className="p-4 bg-primary-green/5 w-fit rounded-2xl mb-8 group-hover:bg-primary-green transition-all duration-300">
                            <Globe className="text-primary-green w-8 h-8 group-hover:text-white transition-colors" />
                        </div>
                        <HeritageHeading as="h2" className="text-3xl font-black mb-6">
                            {dict.aboutPage.vision.title}
                        </HeritageHeading>
                        <p className="text-xl text-text-muted leading-relaxed font-serif italic">
                            {dict.aboutPage.vision.text}
                        </p>
                    </MithilaCard>
                </div>
            </section>

            {/* Cultural Pillars */}
            <section className="py-24 bg-primary-red/5 relative overflow-hidden">
                <div className="absolute inset-0 madhubani-pattern-bg opacity-5 pointer-events-none"></div>
                <div className="container relative z-10">
                    <div className="text-center mb-20">
                        <HeritageHeading as="h2" center className="mb-4">
                            {dict.aboutPage.pillars.title}
                        </HeritageHeading>
                        <p className="text-text-muted max-w-2xl mx-auto text-xl italic font-serif">
                            {dict.aboutPage.pillars.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {dict.aboutPage.pillars.list.map((pillar: any, index: number) => {
                            const Icon = pillarIcons[index % pillarIcons.length];
                            return (
                                <MithilaCard key={index} padding="none" className="group p-8 border-primary-red/5 hover:border-primary-red transition-all duration-500">
                                    <div className="p-4 bg-white/50 dark:bg-white/10 w-fit rounded-2xl mb-6 group-hover:bg-primary-red/10 transition-colors">
                                        <Icon className="w-7 h-7 text-primary-red group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-mithila-ink">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-text-muted leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </MithilaCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 container">
                <div className="text-center mb-20 text-mithila-ink">
                    <HeritageHeading as="h2" center>
                        {dict.aboutPage.values.title}
                    </HeritageHeading>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {dict.aboutPage.values.list.map((value: any, index: number) => {
                        const Icon = valueIcons[index % valueIcons.length];
                        return (
                            <div key={index} className="flex flex-col gap-6 p-10 rounded-3xl glass-morphism transition-all duration-500 hover:-translate-y-2 hover:shadow-premium group">
                                <div className="p-5 bg-primary-yellow/10 w-fit rounded-2xl group-hover:bg-primary-yellow transition-all duration-300">
                                    <Icon className="text-primary-yellow w-8 h-8 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-4 text-mithila-ink">
                                        {value.title}
                                    </h3>
                                    <p className="text-text-muted leading-relaxed text-lg">
                                        {value.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 px-4 md:px-0">
                <div className="max-w-6xl mx-auto rounded-[4rem] bg-mithila-ink text-paper-white overflow-hidden relative p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-red/20 via-transparent to-primary-yellow/20 pointer-events-none"></div>
                    <div className="absolute inset-0 madhubani-pattern-bg opacity-10"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <HeritageHeading as="h2" className="text-paper-white text-4xl md:text-6xl mb-8 leading-tight">
                            {dict.aboutPage.contact.title}
                        </HeritageHeading>
                        <p className="text-xl md:text-2xl text-paper-white/70 mb-12 font-serif italic">
                            {dict.aboutPage.contact.text}
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <a href="mailto:contact@mithilawasi.com" className="btn btn-primary px-12 py-5 gap-3 text-xl shadow-premium hover:shadow-2xl">
                                <Mail className="w-6 h-6" />
                                contact@mithilawasi.com
                            </a>
                            <a href="https://www.facebook.com/mithilawasi" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 text-paper-white hover:text-primary-yellow transition-all text-xl font-bold group">
                                <Facebook className="w-6 h-6 text-[#1877F2] group-hover:scale-110 transition-transform" />
                                {dict.aboutPage.contact.facebookLabel}
                                <span className="h-[2px] w-0 bg-primary-yellow transition-all group-hover:w-full"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


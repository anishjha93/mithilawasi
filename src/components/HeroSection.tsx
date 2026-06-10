
import Link from 'next/link';

export default function HeroSection({ dict, lang }: { dict: any; lang: string }) {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 md:py-32 border-b border-primary-red/10">
            {/* Immersive Background Layers */}
            <div className="absolute inset-0 bg-[var(--mesh-gradient-1)] opacity-40"></div>
            <div className="absolute inset-0 madhubani-pattern-bg opacity-10 pointer-events-none transition-transform duration-1000 hover:scale-105"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary-yellow/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="container relative z-10 text-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-primary-red rounded-full animate-ping"></span>
                    <span className="text-primary-red font-heading text-sm md:text-base tracking-[0.2em] uppercase font-bold">
                        {lang === 'en' ? 'Since Ancient Times' : lang === 'hi' ? 'प्राचीन काल से' : 'अति प्राचीन काल सँ'}
                    </span>
                </div>

                <h1 className="text-5xl md:text-[5.5rem] font-bold mb-8 leading-[1.1] text-mithila-ink drop-shadow-sm animate-fade-in-up delay-100 font-heading">
                    {dict.welcome} <br />
                    <span className="text-primary-red relative inline-block group font-heading">
                        {dict.highlight}
                        {/* Premium Underline Flourish */}
                        <div className="absolute -bottom-2 left-0 w-0 h-1.5 bg-primary-yellow transition-all duration-700 group-hover:w-full rounded-full opacity-60"></div>
                        <svg className="absolute w-full h-4 -bottom-4 left-0 text-primary-yellow/40 transition-transform duration-500 group-hover:translate-y-1" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                    </span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-text-muted max-w-[800px] mx-auto mb-8 sm:mb-12 leading-relaxed font-serif italic animate-fade-in-up delay-200" style={{ fontFamily: lang === 'en' ? 'var(--font-body)' : 'var(--font-devanagari-body)' }}>
                    {dict.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up delay-300 w-full px-2 sm:px-0">
                    <Link href={`/${lang}/about`} className="btn btn-primary text-base sm:text-lg px-6 py-3 sm:px-10 sm:py-4 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center">
                        {dict.learnMoreAbout || 'Explore Our Heritage'}
                    </Link>
                    <Link href={`/${lang}/art`} className="btn btn-outline text-base sm:text-lg px-6 py-3 sm:px-10 sm:py-4 glass-morphism hover:bg-mithila-ink hover:text-paper-white border-primary-red/20 transition-all duration-300 w-full sm:w-auto text-center">
                        {dict.viewGallery || 'View Gallery'}
                    </Link>
                </div>
            </div>

            {/* Decorative bottom edge flourish - Madhubani inspired pattern */}
            <div className="absolute bottom-0 left-0 w-full h-8 flex overflow-hidden opacity-40 pointer-events-none">
                <div className="w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, var(--color-primary-red) 0, var(--color-primary-red) 2px, transparent 2px, transparent 10px),
                                     repeating-linear-gradient(-45deg, var(--color-primary-yellow) 0, var(--color-primary-yellow) 2px, transparent 2px, transparent 10px)`,
                    backgroundSize: '20px 20px',
                    maskImage: 'linear-gradient(to top, black, transparent)',
                    WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
                }}></div>
            </div>
        </section>
    );
}

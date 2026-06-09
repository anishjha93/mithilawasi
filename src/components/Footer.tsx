import Link from 'next/link';

const Footer = ({ dict, lang }: { dict: any, lang: string }) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const f = dict || {};
    const cols = f.columns || {};

    return (
        <footer className="bg-[var(--color-background)] text-[var(--color-text-main)] pt-16 md:pt-20 mt-auto relative overflow-hidden border-t border-primary-red/10">
            {/* Heritage Border Pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-red via-primary-yellow to-primary-red opacity-60" />
            
            <div className="container pb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-4 max-w-[400px]">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="https://cdn.mithilawasi.com/logo_icon.webp" alt="Mithilawasi Logo" className="h-10 md:h-12 w-auto bg-white rounded-full p-0.5 shadow-sm" />
                            <span className="text-xl md:text-2xl font-bold text-primary-red font-heading">Mithilawasi</span>
                        </div>
                        <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-relaxed italic">{f.brand?.tagline || "Preserving the Soul of Mithila"}</p>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Heritage */}
                        <div>
                            <h3 className="text-primary-yellow text-[1.1rem] mb-5 font-bold uppercase tracking-wider font-heading">{cols.heritage?.title || "Heritage"}</h3>
                            <ul className="list-none p-0 mx-0 space-y-3">
                                <li><Link href={`/${lang}/history`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.heritage?.history || "History"}</Link></li>
                                <li><Link href={`/${lang}/places`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.heritage?.places || "Places"}</Link></li>
                                <li><Link href={`/${lang}/personalities`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.heritage?.personalities || "Personalities"}</Link></li>
                                <li><Link href={`/${lang}/folklore`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.heritage?.folklore || "Folklore"}</Link></li>
                                <li><Link href={`/${lang}/villages`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{f.navigation?.villages || "Village Directory"}</Link></li>
                            </ul>
                        </div>

                        {/* Culture */}
                        <div>
                            <h3 className="text-primary-yellow text-[1.1rem] mb-5 font-bold uppercase tracking-wider font-heading">{cols.culture?.title || "Culture"}</h3>
                            <ul className="list-none p-0 mx-0 space-y-3">
                                <li><Link href={`/${lang}/art`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.culture?.art || "Art"}</Link></li>
                                <li><Link href={`/${lang}/food`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.culture?.food || "Food"}</Link></li>
                                <li><Link href={`/${lang}/calendar`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.culture?.calendar || "Calendar"}</Link></li>
                                <li><Link href={`/${lang}/kundli`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.culture?.kundli || "Janam Kundli"}</Link></li>
                                <li><Link href={`/${lang}/learning`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.culture?.language || "Language"}</Link></li>
                            </ul>
                        </div>

                        {/* Knowledge */}
                        <div>
                            <h3 className="text-primary-yellow text-[1.1rem] mb-5 font-bold uppercase tracking-wider font-heading">{cols.knowledge?.title || "Knowledge"}</h3>
                            <ul className="list-none p-0 mx-0 space-y-3">
                                <li><Link href={`/${lang}/philosophy`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.knowledge?.philosophy || "Philosophy"}</Link></li>
                                <li><Link href={`/${lang}/agriculture`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.knowledge?.agriculture || "Economy"}</Link></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-primary-yellow text-[1.1rem] mb-5 font-bold uppercase tracking-wider font-heading">{cols.connect?.title || "Connect"}</h3>
                            <ul className="list-none p-0 mx-0 space-y-3">
                                <li><Link href={`/${lang}/about`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.connect?.about || "About Us"}</Link></li>
                                <li><Link href={`/${lang}/contact`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.connect?.contact || "Contact"}</Link></li>
                                <li><Link href={`/${lang}/blog`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.connect?.blog || "Blog"}</Link></li>
                                <li><Link href={`/${lang}/community/share`} className="text-[var(--color-text-muted)] no-underline transition-all duration-200 text-[0.95rem] hover:text-primary-red hover:pl-1">{cols.connect?.shareStory || "Share Story"}</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contribution Section */}
                <div className="w-full mt-16 pt-10 border-t border-primary-red/5 text-center">
                    <h4 className="text-primary-yellow mb-4 text-[1.15rem] uppercase tracking-wider font-bold font-heading">{f.contribution?.title || "Join the Mithilawasi Community"}</h4>
                    <p className="text-[var(--color-text-muted)] max-w-[800px] mx-auto mb-6 leading-relaxed text-[0.95rem]">{f.contribution?.text}</p>
                    {f.contribution?.slogan && <p className="text-primary-red italic font-semibold mb-4 tracking-wide">{f.contribution?.slogan}</p>}
                    <div className="font-bold text-[var(--color-text-main)] mt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                        <span>{f.contribution?.email_label}</span>
                        <a href={`mailto:${f.contribution?.email || 'contact@mithilawasi.com'}`} className="text-primary-red no-underline border-b-2 border-primary-red/20 hover:border-primary-red transition-all">{f.contribution?.email || 'contact@mithilawasi.com'}</a>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--color-card-bg)] py-10 pb-32 md:py-10 text-[0.85rem] text-[var(--color-text-muted)] border-t border-primary-red/5">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <p className="font-medium">&copy; {new Date().getFullYear()} {f.legal?.rights || "All rights reserved."}</p>
                    <div className="flex flex-wrap gap-6">
                        <Link href={`/${lang}/privacy`} className="hover:text-primary-red transition-colors">{f.legal?.privacy || "Privacy Policy"}</Link>
                        <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">{f.legal?.terms || "Terms of Use"}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

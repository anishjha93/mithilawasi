'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Search from './Search';

const Navbar = ({ dict, lang }: { dict: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, lang: string }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Theme disabled - light mode only

  // Helper to switch language while keeping the path
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const nav = dict.navigation;

  // Theme switcher removed - light mode only

  return (
    <nav className="h-[--header-height] border-b border-primary-red/10 sticky top-0 z-50 flex items-center transition-all duration-500 glass shadow-premium">
      <div className="container flex justify-between items-center w-full">
        <Link href={`/${lang}`} className="font-heading flex items-center gap-3 no-underline group">
          <div className="relative">
            <img
              src="https://cdn.mithilawasi.com/logo_icon.webp"
              alt="Mithilawasi Logo"
              className="h-10 w-auto transition-all duration-500 group-hover:scale-110 [data-theme='light']:mix-blend-multiply [data-theme='dark']:bg-white [data-theme='dark']:p-0.5 [data-theme='dark']:rounded-full [data-theme='dark']:border-2 [data-theme='dark']:border-white/20 [data-theme='dark']:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-red to-primary-red/70 bg-clip-text text-transparent">Mithilawasi</span>
            <span className="text-[0.6rem] md:text-[0.7rem] font-medium text-text-muted uppercase tracking-[0.2em] -mt-1">
              {lang === 'en' ? 'मिथिलावासी' : lang === 'hi' ? 'Mithilawasi' : 'Mithilawasi'}
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="list-none hidden lg:flex gap-4 items-center">
          <li><Link href={`/${lang}`} className="font-medium uppercase tracking-wider text-[0.85rem] text-foreground no-underline hover:text-primary-red">{nav.home}</Link></li>

          <li className="relative py-2 group">
            <span className="font-medium uppercase tracking-wider text-[0.85rem] text-foreground cursor-pointer group-hover:text-primary-red transition-all duration-300 flex items-center gap-1">{nav.dropdowns?.heritage || 'Heritage'} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></span>
            <ul className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 glass shadow-premium rounded-xl min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 z-50 border border-primary-red/5">
              <li><Link href={`/${lang}/history`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.history}</Link></li>
              <li><Link href={`/${lang}/places`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.places}</Link></li>
              <li><Link href={`/${lang}/personalities`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.personalities}</Link></li>
              <li><Link href={`/${lang}/folklore`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.folklore}</Link></li>
              <li><Link href={`/${lang}/villages`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.villages || 'Village Directory'}</Link></li>
            </ul>
          </li>

          {/* Culture Dropdown */}
          <li className="relative py-2 group">
            <span className="font-medium uppercase tracking-wider text-[0.85rem] text-foreground cursor-pointer group-hover:text-primary-red transition-all duration-300 flex items-center gap-1">{nav.dropdowns?.culture || 'Culture'} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></span>
            <ul className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 glass shadow-premium rounded-xl min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 z-50 border border-primary-red/5">
              <li><Link href={`/${lang}/art`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.art}</Link></li>
              <li><Link href={`/${lang}/culture`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.culture}</Link></li>
              <li><Link href={`/${lang}/food`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.food}</Link></li>
              <li><Link href={`/${lang}/calendar`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.calendar}</Link></li>
              <li><Link href={`/${lang}/kundli`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.kundli}</Link></li>
              <li><Link href={`/${lang}/mantras`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.mantras}</Link></li>
              <li><Link href={`/${lang}/vrat-katha`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.vrat}</Link></li>
              <li><Link href={`/${lang}/community/share`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red font-bold">{nav.submitStory || 'Submit Story +'}</Link></li>
            </ul>
          </li>

          {/* Knowledge Dropdown */}
          <li className="relative py-2 group">
            <span className="font-medium uppercase tracking-wider text-[0.85rem] text-foreground cursor-pointer group-hover:text-primary-red transition-all duration-300 flex items-center gap-1">{nav.dropdowns?.knowledge || 'Knowledge'} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></span>
            <ul className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 glass shadow-premium rounded-xl min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 z-50 border border-primary-red/5">
              <li><Link href={`/${lang}/philosophy`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.philosophy}</Link></li>
              <li><Link href={`/${lang}/learning`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.learning}</Link></li>
              <li><Link href={`/${lang}/agriculture`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav.agriculture}</Link></li>
              <li><Link href={`/${lang}/modern-mithila`} className="block py-2.5 px-6 whitespace-nowrap text-foreground text-[0.9rem] transition-all duration-200 hover:bg-primary-red/5 hover:text-primary-red">{nav['modern-mithila'] || 'Future'}</Link></li>
            </ul>
          </li>

          <li><Link href={`/${lang}/blog`} className="font-medium uppercase tracking-wider text-[0.85rem] text-foreground no-underline hover:text-primary-red">{nav.blog}</Link></li>
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {/* Search - Passes full dict now */}
          <Search dict={dict} lang={lang} />

          <div className="hidden lg:flex gap-1 text-[0.8rem] font-bold items-center text-foreground">
            <Link href={redirectedPathName('en')} className={`px-1.5 py-0.5 rounded transition-all ${lang === 'en' ? 'bg-primary-red text-white shadow-sm' : 'hover:text-primary-red'}`}>EN</Link>
            <span className="text-border-color/40">/</span>
            <Link href={redirectedPathName('hi')} className={`px-1.5 py-0.5 rounded transition-all ${lang === 'hi' ? 'bg-primary-red text-white shadow-sm' : 'hover:text-primary-red'}`}>हि</Link>
            <span className="text-border-color/40">/</span>
            <Link href={redirectedPathName('mai')} className={`px-1.5 py-0.5 rounded transition-all ${lang === 'mai' ? 'bg-primary-red text-white shadow-sm' : 'hover:text-primary-red'}`}>मै</Link>
          </div>

          <button className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer z-[2100]" onClick={toggleMenu} aria-label="Toggle Menu">
            <span className={`w-6 h-0.5 bg-primary-red transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-primary-red transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-primary-red transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed top-0 left-0 w-full h-screen glass z-[2000] transition-all duration-500 ease-in-out flex flex-col pt-24 md:pt-28 overflow-y-auto ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="container py-8 flex flex-col gap-8">
          {/* Language Switcher in Mobile Menu */}
          <div className="flex justify-center gap-6 pb-6 border-b border-border-color/50">
            <Link href={redirectedPathName('en')} onClick={toggleMenu} className={`text-lg font-bold transition-colors ${lang === 'en' ? 'text-primary-red decoration-2 underline underline-offset-4' : 'text-foreground hover:text-primary-red'}`}>ENGLISH</Link>
            <Link href={redirectedPathName('hi')} onClick={toggleMenu} className={`text-lg font-bold transition-colors ${lang === 'hi' ? 'text-primary-red decoration-2 underline underline-offset-4' : 'text-foreground hover:text-primary-red'}`}>हिन्दी</Link>
            <Link href={redirectedPathName('mai')} onClick={toggleMenu} className={`text-lg font-bold transition-colors ${lang === 'mai' ? 'text-primary-red decoration-2 underline underline-offset-4' : 'text-foreground hover:text-primary-red'}`}>मैथिली</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4">
            {/* Main & Heritage */}
            <div className="flex flex-col gap-6">
              <div>
                <Link href={`/${lang}`} onClick={toggleMenu} className="text-xl font-black text-primary-red uppercase tracking-tighter hover:opacity-80 decoration-none">{nav.home}</Link>
              </div>

              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-l-4 border-primary-yellow pl-3">{nav.dropdowns?.heritage || 'Heritage'}</h3>
                <ul className="list-none p-0 flex flex-col gap-3">
                  <li><Link href={`/${lang}/history`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.history}</Link></li>
                  <li><Link href={`/${lang}/places`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.places}</Link></li>
                  <li><Link href={`/${lang}/personalities`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.personalities}</Link></li>
                  <li><Link href={`/${lang}/folklore`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.folklore}</Link></li>
                  <li><Link href={`/${lang}/villages`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.villages || 'Village Directory'}</Link></li>
                </ul>
              </div>
            </div>

            {/* Culture */}
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-l-4 border-primary-red pl-3">{nav.dropdowns?.culture || 'Culture'}</h3>
              <ul className="list-none p-0 flex flex-col gap-3">
                <li><Link href={`/${lang}/art`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.art}</Link></li>
                <li><Link href={`/${lang}/culture`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.culture}</Link></li>
                <li><Link href={`/${lang}/food`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.food}</Link></li>
                <li><Link href={`/${lang}/calendar`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.calendar}</Link></li>
                <li><Link href={`/${lang}/kundli`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.kundli}</Link></li>
                <li><Link href={`/${lang}/mantras`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.mantras}</Link></li>
                <li><Link href={`/${lang}/vrat-katha`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.vrat}</Link></li>
              </ul>
            </div>

            {/* Knowledge */}
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-l-4 border-primary-green pl-3">{nav.dropdowns?.knowledge || 'Knowledge'}</h3>
              <ul className="list-none p-0 flex flex-col gap-3">
                <li><Link href={`/${lang}/philosophy`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.philosophy}</Link></li>
                <li><Link href={`/${lang}/learning`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.learning}</Link></li>
                <li><Link href={`/${lang}/agriculture`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav.agriculture}</Link></li>
                <li><Link href={`/${lang}/modern-mithila`} onClick={toggleMenu} className="text-lg font-medium text-foreground hover:text-primary-red transition-colors">{nav['modern-mithila'] || 'Future'}</Link></li>
              </ul>
            </div>

            {/* Blog & Closing */}
            <div className="flex flex-col gap-6">
              <div>
                <Link href={`/${lang}/blog`} onClick={toggleMenu} className="text-xl font-black text-primary-red uppercase tracking-tighter hover:opacity-80 decoration-none">{nav.blog}</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border-color/30 text-center">
            <p className="text-xs text-text-muted italic">Mithilawasi &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

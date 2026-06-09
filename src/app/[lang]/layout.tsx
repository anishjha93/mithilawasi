
import type { Metadata, Viewport } from 'next';
import { Inter, Crimson_Pro, Rozha_One, Hind } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/get-dictionary';
import JsonLd from '@/components/JsonLd';
import InstallPrompt from '@/components/InstallPrompt';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { ThemeProvider } from '@/components/ThemeProvider';

export const runtime = 'edge';

// Font configuration
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap'
});
const crimsonPro = Crimson_Pro({
    subsets: ['latin'],
    variable: '--font-heading',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap'
});
const rozhaOne = Rozha_One({
    subsets: ['devanagari', 'latin'],
    variable: '--font-devanagari-heading',
    weight: ['400'],
    display: 'swap'
});
const hind = Hind({
    subsets: ['devanagari', 'latin'],
    variable: '--font-devanagari-body',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';



export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#ffffff' }, // Keep as light or dark depending on preference
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: 'Mithilawasi - Live Panchang, Weather & Community',
        template: '%s | Mithilawasi'
    },
    manifest: '/manifest.json',
    description: 'Explore the vibrant community of Mithila - from live agricultural weather and river safety reports to traditional Panchang, Vedic calendar, and heritage.',
    metadataBase: new URL('https://mithilawasi.com'),
    openGraph: {
        title: 'Mithilawasi - Live Panchang, Weather & Community',
        description: 'Connect with the vibrant community of Mithilanchal. Live Panchang, agricultural weather updates, river safety monitors, and heritage.',
        url: 'https://mithilawasi.com',
        siteName: 'Mithilawasi',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://cdn.mithilawasi.com/hero-bg.webp', // Pointing to existing asset CDN
                width: 1200,
                height: 630,
                alt: 'Mithilawasi - Community & Live Weather',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mithilawasi',
        description: 'Explore the vibrant community of Mithilanchal.',
        images: ['https://cdn.mithilawasi.com/hero-bg.webp'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    keywords: ['Mithila', 'Mithilanchal', 'Maithili', 'Mithilawasi', 'Panchang', 'Weather Monitor', 'River Safety', 'Culture', 'History'],
    // icons are automatically handled by app/icon.png
};



import LanguageSwitcher from '@/components/LanguageSwitcher';

// ... (imports)

// ... (metadata)

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const resolvedParams = await Promise.resolve(params); // Next 15+ async params handling
    const lang = resolvedParams.lang as 'en' | 'hi' | 'mai';
    const dict = await getDictionary(lang);

    return (
        <html lang={resolvedParams.lang} className={`${inter.variable} ${crimsonPro.variable} ${rozhaOne.variable} ${hind.variable}`} suppressHydrationWarning>
            <body>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1493774382914429"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-4HYPX5QQGF'} />
                <JsonLd />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar dict={dict} lang={resolvedParams.lang} />
                    <LanguageSwitcher lang={lang} dict={dict.home} />
                    <main className="min-h-[calc(100vh-300px)]">
                        {children}
                    </main>
                    <Footer dict={dict.footer} lang={resolvedParams.lang} />
                </ThemeProvider>
                <InstallPrompt />
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}

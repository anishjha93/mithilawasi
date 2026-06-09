import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define locales
const locales = ['en', 'hi', 'mai'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Redirect www to non-www
    const host = request.headers.get('host');
    if (host?.startsWith('www.')) {
        const newUrl = new URL(request.url);
        newUrl.host = host.replace('www.', '');
        return NextResponse.redirect(newUrl, 301);
    }

    // 2. Skip internal Next.js requests, assets, and api routes
    if (
        pathname.startsWith('/_next') || 
        pathname.includes('/api/') ||
        pathname.includes('.') ||
        request.headers.has('next-action')
    ) {
        return NextResponse.next();
    }

    // 3. Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // 4. Redirect to default locale if missing
    const locale = getLocale(request);
    
    // Construct the new URL preserving query parameters (like _rsc)
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    return NextResponse.redirect(newUrl, 301);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\..*).*)'],
};

export const runtime = 'experimental-edge';

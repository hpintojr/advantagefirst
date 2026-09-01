import { NextRequest, NextResponse } from 'next/server';

/**
 * Hostname-based routing for the two-domain setup:
 *
 *   advantagefirst.com  → main site (landing page route blocked)
 *   adv1st.app          → ONLY serves /{short_code} landing pages
 *   *.vercel.app        → serves everything (testing)
 *
 * Place this file at the repo root (same level as /app).
 */

// 5-char alphanumeric short_code, e.g. /Kx9mQ or /JSYNB (letters-only OK)
const UNIQUE_ID_PATH = /^\/[a-zA-Z0-9]{5}$/;

// Real site paths that must never be treated as short codes
const RESERVED = new Set([
  'about', 'terms', 'legal', 'blogs', 'press', 'apply', 'loans', 'admin',
  'login', 'faqs1',
]);

const isUniqueId = (pathname: string) =>
  UNIQUE_ID_PATH.test(pathname) && !RESERVED.has(pathname.slice(1).toLowerCase());

// Paths the short domain must always allow (assets, api, disclosures, internals)
const ALWAYS_ALLOW = /^\/(api|_next|favicon\.ico|robots\.txt|images|fonts|disclosures)/;

const MAIN_SITE = 'https://advantagefirst.com';
const SHORT_HOSTS = ['adv1st.app', 'www.adv1st.app'];
// Landing pages are blocked ONLY on these hosts (so *.vercel.app previews
// can still serve /{id} for testing).
const MAIN_HOSTS = ['advantagefirst.com', 'www.advantagefirst.com'];

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const { pathname } = req.nextUrl;
  const isShortHost = SHORT_HOSTS.some((h) => host === h);

  if (isShortHost) {
    // Short domain: allow only landing pages + required internals.
    if (isUniqueId(pathname) || ALWAYS_ALLOW.test(pathname)) {
      return NextResponse.next();
    }
    // Everything else (including "/") bounces to the main site.
    return NextResponse.redirect(MAIN_SITE, 302);
  }

  // Main domain only: block direct access to landing pages so the
  // short domain is the only public entry point for pre-filled forms.
  if (MAIN_HOSTS.includes(host) && isUniqueId(pathname)) {
    return NextResponse.redirect(MAIN_SITE, 302);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static files Next serves directly
  matcher: ['/((?!_next/static|_next/image).*)'],
};

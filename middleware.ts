import { NextRequest, NextResponse } from 'next/server';

/**
 * Hostname-based routing for the two-domain setup:
 *
 *   advantagefirst.com  → main site (landing page route blocked)
 *   adv1st.app          → ONLY serves /{unique_id} landing pages
 *
 * Place this file at the repo root (same level as /app).
 */

// 5-char alphanumeric unique_id, e.g. /Kx9mQ
// IMPORTANT: IDs must contain AT LEAST ONE DIGIT (enforced here and in the
// ID generator) so real routes like /about or /terms never match.
const UNIQUE_ID_PATH = /^\/(?=[a-zA-Z]*\d)[a-zA-Z0-9]{5}$/;

// Extra safety: never treat these as unique IDs even if they match the pattern
const RESERVED = new Set(['about', 'terms', 'legal', 'blogs', 'faqs1']);

const isUniqueId = (pathname: string) =>
  UNIQUE_ID_PATH.test(pathname) && !RESERVED.has(pathname.slice(1).toLowerCase());

// Paths the short domain must always allow (assets, api, next internals)
const ALWAYS_ALLOW = /^\/(api|_next|favicon\.ico|robots\.txt|images|fonts)/;

const MAIN_SITE = 'https://advantagefirst.com';
const SHORT_HOSTS = ['adv1st.app', 'www.adv1st.app'];

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

  // Main domain: block direct access to landing pages so the
  // short domain is the only entry point for pre-filled forms.
  if (isUniqueId(pathname)) {
    return NextResponse.redirect(MAIN_SITE, 302);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static files Next serves directly
  matcher: ['/((?!_next/static|_next/image).*)'],
};

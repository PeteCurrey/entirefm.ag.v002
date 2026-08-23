import { NextResponse, type NextRequest } from 'next/server';

const PRODUCTION_HOSTNAME = 'www.entirefm.com';

/**
 * PRODUCTION PROXY / EDGE MIDDLEWARE (Next.js 16)
 * ================================================
 * 1. Non-WWW Canonical Redirect:
 *    Permanently redirects (301) all traffic on 'entirefm.com' to 'www.entirefm.com'
 *    preserving path and query parameters in a single hop.
 *
 * 2. Hostname-Aware Search Indexing Protection:
 *    Ensures all staging, Vercel preview, and alias hosts (e.g. entirefmagv002.vercel.app)
 *    strictly receive 'X-Robots-Tag: noindex, nofollow' response headers so they can
 *    NEVER be indexed by search engines.
 *
 * 3. Production Environment Gate:
 *    If ALLOW_SEARCH_INDEXING !== 'true', non-sitemap production requests receive noindex protection.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  const { pathname, search } = request.nextUrl;

  // 1. Non-WWW to WWW 301 Permanent Redirect
  if (hostname === 'entirefm.com') {
    const destination = `https://${PRODUCTION_HOSTNAME}${pathname}${search}`;
    return NextResponse.redirect(destination, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const response = NextResponse.next();

  // 2. Hostname-Aware Search Indexing Protection
  const isProductionHost = hostname === PRODUCTION_HOSTNAME;
  const isIndexingAllowed = process.env.ALLOW_SEARCH_INDEXING === 'true';
  const isSitemapOrRobots = pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname.startsWith('/sitemaps/');

  if (!isProductionHost || (!isIndexingAllowed && !isSitemapOrRobots)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and asset directories:
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|video|branding|Images).*)',
  ],
};

import { NextResponse, type NextRequest } from 'next/server';

const PRODUCTION_HOSTNAME = 'www.entirefm.com';

/**
 * ENTIREFM UNIFIED EDGE PROXY & MIDDLEWARE (Next.js 16)
 * ====================================================
 * Combines:
 * 1. Non-WWW Canonical 301 Redirect:
 *    Permanently redirects all traffic on 'entirefm.com' to 'www.entirefm.com'.
 * 2. Legacy /client to /clients 308 Redirect.
 * 3. Portal Security & Role-Based Session Gating:
 *    Restricts /admin, /clients, /contractor, and /engineer.
 * 4. Search Indexing Protection:
 *    Enforces 'X-Robots-Tag: noindex, nofollow, noarchive' across private routes.
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

  // 2. Controlled migration for legacy /client route -> /clients (308)
  if (pathname === '/client' || pathname.startsWith('/client/')) {
    const canonicalPath = pathname.replace(/^\/client/, '/clients');
    const redirectUrl = new URL(canonicalPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // 3. Skip public static assets and API auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/enquiry') ||
    pathname.startsWith('/api/newsletter') ||
    pathname.startsWith('/branding') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  // 4. Inspect session cookie for private portal paths
  const isPrivateAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPrivateClients = pathname === '/clients' || pathname.startsWith('/clients/');
  const isPrivateContractor = pathname === '/contractor' || pathname.startsWith('/contractor/');
  const isPrivateEngineer = pathname === '/engineer' || pathname.startsWith('/engineer/');

  if (isPrivateAdmin || isPrivateClients || isPrivateContractor || isPrivateEngineer) {
    const token = request.cookies.get('efm_session')?.value || request.cookies.get('efm_admin')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return response;
    }

    // Decode token payload (format: base64urlPayload.signature)
    try {
      const parts = token.split('.');
      if (parts.length === 2) {
        const payloadStr = Buffer.from(parts[0], 'base64url').toString('utf8');
        const session = JSON.parse(payloadStr);

        // Check token expiry
        if (session.expiresAt && session.expiresAt < Date.now()) {
          const loginUrl = new URL('/login?error=expired', request.url);
          return NextResponse.redirect(loginUrl);
        }

        const isViewAs = !!session.viewAsContext?.isViewAs;

        // /admin is STRICTLY INTERNAL EntireFM
        if (isPrivateAdmin) {
          if (session.orgType !== 'ENTIREFM') {
            const forbiddenUrl = new URL('/login?error=forbidden_admin', request.url);
            return NextResponse.redirect(forbiddenUrl);
          }
        }

        // /clients is STRICTLY CLIENT (or internal View-As)
        if (isPrivateClients) {
          if (session.orgType !== 'CLIENT' && !isViewAs) {
            const forbiddenUrl = new URL('/login?error=forbidden_client', request.url);
            return NextResponse.redirect(forbiddenUrl);
          }
        }

        // /contractor is STRICTLY CONTRACTOR (or internal View-As)
        if (isPrivateContractor) {
          if (session.orgType !== 'CONTRACTOR' && !isViewAs) {
            const forbiddenUrl = new URL('/login?error=forbidden_contractor', request.url);
            return NextResponse.redirect(forbiddenUrl);
          }
        }

        // /engineer is STRICTLY FIELD ENGINEER
        if (isPrivateEngineer) {
          const isEngineerRole = session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER';
          if (!isEngineerRole && !isViewAs && session.orgType !== 'ENTIREFM') {
            const forbiddenUrl = new URL('/login?error=forbidden_engineer', request.url);
            return NextResponse.redirect(forbiddenUrl);
          }
        }
      }
    } catch {
      const loginUrl = new URL('/login?error=invalid_session', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 5. Hostname-Aware Search Indexing Protection for Public Routes
  const response = NextResponse.next();
  const isProductionHost = hostname === PRODUCTION_HOSTNAME;
  const isIndexingAllowed = process.env.ALLOW_SEARCH_INDEXING === 'true';
  const isSitemapOrRobots =
    pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname.startsWith('/sitemaps/');

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

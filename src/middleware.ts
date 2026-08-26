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
export function middleware(request: NextRequest) {
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

  // Supplier portal route classification
  const PUBLIC_SUPPLIER_ROUTES = [
    '/supplier-portal/register',
    '/supplier-portal/sign-in',
    '/supplier-portal/forgot-password',
    '/supplier-portal/reset-password',
    '/supplier-portal/verify-email',
  ];
  const AUTHENTICATED_SETUP_ROUTES = ['/supplier-portal/org-setup'];

  const isSupplierPortal = pathname === '/supplier-portal' || pathname.startsWith('/supplier-portal/');
  const isPublicSupplierRoute = PUBLIC_SUPPLIER_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  const isSetupRoute = AUTHENTICATED_SETUP_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  const isPrivateSupplierPortal = isSupplierPortal && !isPublicSupplierRoute;

  // If already authenticated as a supplier, redirect away from public auth pages to resume destination
  if (isPublicSupplierRoute && (pathname === '/supplier-portal/register' || pathname === '/supplier-portal/sign-in')) {
    const token = request.cookies.get('efm_session')?.value;
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 2) {
          const session = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
          if (session.orgType === 'SUPPLIER' && (!session.expiresAt || session.expiresAt > Date.now())) {
            return NextResponse.redirect(new URL('/supplier-portal/resume', request.url));
          }
        }
      } catch {}
    }
  }

  if (isPrivateAdmin || isPrivateClients || isPrivateContractor || isPrivateEngineer || isPrivateSupplierPortal) {
    const token = request.cookies.get('efm_session')?.value || request.cookies.get('efm_admin')?.value;

    if (!token) {
      if (isPrivateSupplierPortal) {
        const signInUrl = new URL('/supplier-portal/sign-in', request.url);
        if (pathname !== '/supplier-portal') {
          signInUrl.searchParams.set('redirect', pathname);
        }
        const response = NextResponse.redirect(signInUrl);
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        return response;
      }
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
          if (isPrivateSupplierPortal) {
            return NextResponse.redirect(new URL('/supplier-portal/sign-in?error=session_expired', request.url));
          }
          return NextResponse.redirect(new URL('/login?error=expired', request.url));
        }

        const isViewAs = !!session.viewAsContext?.isViewAs;

        // /supplier-portal/* requires SUPPLIER orgType (or internal EntireFM)
        if (isPrivateSupplierPortal) {
          if (session.orgType !== 'SUPPLIER' && session.orgType !== 'ENTIREFM') {
            return NextResponse.redirect(new URL('/supplier-portal/sign-in?error=forbidden_supplier', request.url));
          }
        }

        // /admin is STRICTLY INTERNAL EntireFM
        if (isPrivateAdmin) {
          if (session.orgType !== 'ENTIREFM') {
            return NextResponse.redirect(new URL('/login?error=forbidden_admin', request.url));
          }
        }

        // /clients is STRICTLY CLIENT (or internal View-As)
        if (isPrivateClients) {
          if (session.orgType !== 'CLIENT' && !isViewAs) {
            return NextResponse.redirect(new URL('/login?error=forbidden_client', request.url));
          }
        }

        // /contractor is STRICTLY CONTRACTOR (or internal View-As)
        if (isPrivateContractor) {
          if (session.orgType !== 'CONTRACTOR' && !isViewAs) {
            return NextResponse.redirect(new URL('/login?error=forbidden_contractor', request.url));
          }
        }

        // /engineer is STRICTLY FIELD ENGINEER
        if (isPrivateEngineer) {
          const isEngineerRole = session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER';
          if (!isEngineerRole && !isViewAs && session.orgType !== 'ENTIREFM') {
            return NextResponse.redirect(new URL('/login?error=forbidden_engineer', request.url));
          }
        }
      }
    } catch {
      if (isPrivateSupplierPortal) {
        return NextResponse.redirect(new URL('/supplier-portal/sign-in?error=session_expired', request.url));
      }
      return NextResponse.redirect(new URL('/login?error=invalid_session', request.url));
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and asset directories:
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|video|branding|Images).*)',
  ],
};

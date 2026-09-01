import { NextResponse, type NextRequest } from 'next/server';

const PRODUCTION_HOSTNAME = 'www.entirefm.com';

/**
 * ENTIREFM UNIFIED EDGE PROXY & MIDDLEWARE (Next.js 16)
 * ====================================================
 * Combines:
 * 1. Non-WWW Canonical 301 Redirect:
 *    Permanently redirects all traffic on 'entirefm.com' to 'www.entirefm.com'.
 * 2. Legacy /client to /clients 308 Redirect.
 * 3. Strict Context Separation:
 *    - Internal Admin Control Plane (/admin/*): Gated to internal EntireFM staff only.
 *      Unauthenticated -> /admin/login. Authenticated non-admin -> /admin/access-denied.
 *    - Supplier Portal (/supplier-portal/*): Gated to SUPPLIER orgType.
 *    - Client Portal (/clients/*): Gated to CLIENT orgType.
 *    - Contractor Portal (/contractor/*): Gated to CONTRACTOR orgType.
 *    - Engineer Portal (/engineer/*): Gated to FIELD_ENGINEER role.
 * 4. Search Indexing Protection:
 *    Enforces 'X-Robots-Tag: noindex, nofollow, noarchive' across private routes.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  const { pathname, search } = request.nextUrl;

  // 1. Non-WWW to WWW 308 Permanent Redirect (Preserves HTTP Method & Body on API / Form submissions)
  if (hostname === 'entirefm.com') {
    const destination = `https://${PRODUCTION_HOSTNAME}${pathname}${search}`;
    return NextResponse.redirect(destination, {
      status: 308,
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

  // 2b. Typo migration: /facilities-management-services-lond -> /facilities-management-services-london (301)
  if (pathname === '/facilities-management-services-lond' || pathname === '/facilities-management-services-lond/') {
    const destination = `https://${PRODUCTION_HOSTNAME}/facilities-management-services-london${search}`;
    return NextResponse.redirect(destination, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 3. Skip public static assets and API auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
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

  // Helper to extract session payload safely
  const token = request.cookies.get('efm_session')?.value || request.cookies.get('efm_admin')?.value;
  let session: any = null;
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 2) {
        const payloadStr = Buffer.from(parts[0], 'base64url').toString('utf8');
        const parsed = JSON.parse(payloadStr);
        if (!parsed.expiresAt || parsed.expiresAt >= Date.now()) {
          session = parsed;
        }
      }
    } catch {
      session = null;
    }
  }

  // Inject x-pathname header so Server Components & Layouts know the requested path
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4A. INTERNAL ADMIN CONTROL PLANE GATING (/admin/*)
  // ─────────────────────────────────────────────────────────────────────────────
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/access-denied';

  if (isAdminRoute) {
    // Public admin routes (Login & Access Denied)
    if (isPublicAdminRoute) {
      // If already authenticated as internal Admin and visiting /admin/login, bounce to /admin
      if (pathname === '/admin/login' && session?.orgType === 'ENTIREFM') {
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      }
      const res = NextResponse.next({ request: { headers: requestHeaders } });
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    // Protected Admin Cockpit Subroutes (/admin, /admin/careers, /admin/finance, etc.)
    if (!session) {
      // Unauthenticated visitor -> dedicated admin login with return destination
      const adminLoginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        adminLoginUrl.searchParams.set('next', pathname);
      }
      const res = NextResponse.redirect(adminLoginUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    // Authenticated user exists: verify internal EntireFM authorization
    if (session.orgType !== 'ENTIREFM') {
      // Authenticated as Client, Supplier, Engineer, Contractor -> show explicit access denied screen
      // Do NOT destroy their session and do NOT redirect to public /login role cards
      const deniedUrl = new URL('/admin/access-denied', request.url);
      const res = NextResponse.redirect(deniedUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    // Valid internal EntireFM admin session -> allow access
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4B. SUPPLIER PORTAL GATING (/supplier-portal/*)
  // ─────────────────────────────────────────────────────────────────────────────
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

  // Gate for /supplier-portal/org-setup
  if (isSetupRoute) {
    if (!session) {
      const registerUrl = new URL('/supplier-portal/register', request.url);
      const res = NextResponse.redirect(registerUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }
  }

  // Dedicated Supplier Portal Security Gate (Strict SUPPLIER orgType only)
  if (isPrivateSupplierPortal) {
    if (!session) {
      const signInUrl = new URL('/supplier-portal/sign-in', request.url);
      if (pathname !== '/supplier-portal') {
        signInUrl.searchParams.set('redirect', pathname);
      }
      const res = NextResponse.redirect(signInUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    if (session.orgType !== 'SUPPLIER') {
      const res = NextResponse.redirect(new URL('/supplier-portal/sign-in?error=forbidden_supplier', request.url));
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4C. CLIENT, CONTRACTOR, & FIELD ENGINEER PORTAL GATING
  // ─────────────────────────────────────────────────────────────────────────────
  const isPrivateClients = pathname === '/clients' || pathname.startsWith('/clients/');
  const isPrivateContractor = pathname === '/contractor' || pathname.startsWith('/contractor/');
  const isPrivateEngineer = pathname === '/engineer' || pathname.startsWith('/engineer/');

  if (isPrivateClients || isPrivateContractor || isPrivateEngineer) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;

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

    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. HOSTNAME-AWARE SEARCH INDEXING PROTECTION FOR PUBLIC ROUTES
  // ─────────────────────────────────────────────────────────────────────────────
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  const isProductionHost = hostname === PRODUCTION_HOSTNAME;
  const isIndexingAllowed = process.env.ALLOW_SEARCH_INDEXING === 'true';
  const isSitemapOrRobots =
    pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname.startsWith('/sitemaps/');

  if (!isProductionHost || (!isIndexingAllowed && !isSitemapOrRobots)) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and asset directories:
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|video|branding|Images).*)',
  ],
};

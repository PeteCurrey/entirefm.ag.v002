/**
 * ENTIREFM PORTAL ROUTING & SECURITY MIDDLEWARE
 * =============================================
 * Gating & Boundary Enforcement:
 * 1. Restricts /admin to internal EntireFM memberships (rejects external users).
 * 2. Restricts /clients to client memberships or audited View-As sessions.
 * 3. Permanently redirects legacy /client/** to /clients/** (308).
 * 4. Restricts /contractor to contractor memberships.
 * 5. Restricts /engineer to field engineers.
 * 6. Adds X-Robots-Tag: noindex, nofollow to all private portal routes.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Controlled migration for legacy /client route -> /clients
  if (pathname === '/client' || pathname.startsWith('/client/')) {
    const canonicalPath = pathname.replace(/^\/client/, '/clients');
    const redirectUrl = new URL(canonicalPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // 2. Skip public static assets and API auth endpoints
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

  // 3. Inspect session cookie for private portal paths
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
    '/clients/:path*',
    '/contractor/:path*',
    '/engineer/:path*',
  ],
};

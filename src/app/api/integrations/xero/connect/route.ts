/**
 * GET /api/integrations/xero/connect
 * Generates and redirects to the Xero OAuth 2.0 authorization URL.
 * Requires: accounting:sync permission
 *
 * IMPORTANT: All error-path redirects MUST use absolute URLs.
 * NextResponse.redirect() throws "URL is malformed" for relative paths,
 * converting every caught exception into an unrelated HTTP 500.
 * We always derive the redirect base from _req.nextUrl (guaranteed absolute).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { createAuthorizationUrl, isXeroConfigured } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  // Helper: build an absolute admin/integrations/xero URL with query params,
  // derived from the incoming request URL so it is always valid regardless of env vars.
  const adminXeroUrl = (params: Record<string, string>): URL => {
    const u = new URL('/admin/integrations/xero', _req.nextUrl);
    for (const [key, val] of Object.entries(params)) {
      u.searchParams.set(key, val);
    }
    return u;
  };

  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  if (!hasPermission(session, 'accounting:sync') && !hasPermission(session, 'finance:admin')) {
    return NextResponse.json({ error: 'Forbidden — accounting:sync permission required.' }, { status: 403 });
  }

  // Fast-fail before touching the database if credentials are not configured.
  if (!isXeroConfigured()) {
    console.error('[XERO_CONNECT] XERO_CLIENT_ID or XERO_CLIENT_SECRET are not set in server environment.');
    return NextResponse.redirect(adminXeroUrl({ error: 'xero_credentials_not_configured' }));
  }

  try {
    const { url } = await createAuthorizationUrl({
      personId: session.personId,
      organisationId: session.orgId,
    });
    return NextResponse.redirect(url);
  } catch (err: any) {
    // Log full error server-side; never expose raw messages to the client.
    console.error('[XERO_CONNECT] Failed to generate auth URL:', err?.message, err);
    const safeCode = (err?.errorCode as string | undefined) || 'oauth_init_failed';
    return NextResponse.redirect(adminXeroUrl({ error: safeCode }));
  }
}

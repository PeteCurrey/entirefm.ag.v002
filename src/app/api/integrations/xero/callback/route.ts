/**
 * GET /api/integrations/xero/callback
 * Handles OAuth 2.0 redirect from Xero.
 * Validates state against CSRF attack, exchanges auth code for tokens,
 * stores encrypted tokens in xero_connections, and redirects back to admin settings.
 *
 * IMPORTANT: All redirects must use absolute URLs.
 * NextResponse.redirect() throws "URL is malformed" for relative paths.
 * We derive the base from req.nextUrl (always absolute) instead of
 * NEXT_PUBLIC_BASE_URL which is NOT set in production.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleAuthorizationCallback } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Build absolute redirect target from the incoming request URL — never from env vars.
  const adminXeroUrl = (params: Record<string, string>): URL => {
    const u = new URL('/admin/integrations/xero', req.nextUrl);
    for (const [key, val] of Object.entries(params)) {
      u.searchParams.set(key, val);
    }
    return u;
  };

  if (error) {
    console.error(`[XERO_CALLBACK_ERROR] Error from Xero: ${error} - ${errorDescription}`);
    return NextResponse.redirect(adminXeroUrl({ error: encodeURIComponent(errorDescription || error) }));
  }

  if (!code || !state) {
    console.error('[XERO_CALLBACK_ERROR] Missing code or state parameter');
    return NextResponse.redirect(adminXeroUrl({ error: 'missing_code_or_state' }));
  }

  try {
    const result = await handleAuthorizationCallback({ code, state });
    return NextResponse.redirect(
      adminXeroUrl({ status: 'connected', tenant: encodeURIComponent(result.tenantName || 'Xero') })
    );
  } catch (err: any) {
    console.error('[XERO_CALLBACK_EXCEPTION]', err);
    const safeMsg = err?.safeMessage || err?.message || 'Authentication exchange failed.';
    return NextResponse.redirect(adminXeroUrl({ error: encodeURIComponent(safeMsg) }));
  }
}

/**
 * GET /api/integrations/xero/callback
 * Handles OAuth 2.0 redirect from Xero.
 * Validates state against CSRF attack, exchanges auth code for tokens,
 * stores encrypted tokens in xero_connections, and redirects back to admin settings.
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const redirectTarget = `${baseUrl}/admin/integrations/xero`;

  if (error) {
    console.error(`[XERO_CALLBACK_ERROR] Error from Xero: ${error} - ${errorDescription}`);
    return NextResponse.redirect(`${redirectTarget}?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectTarget}?error=missing_code_or_state`);
  }

  try {
    const result = await handleAuthorizationCallback({ code, state });
    return NextResponse.redirect(
      `${redirectTarget}?status=connected&tenant=${encodeURIComponent(result.tenantName || 'Xero')}`
    );
  } catch (err: any) {
    console.error('[XERO_CALLBACK_EXCEPTION]', err);
    const safeMsg = err?.safeMessage || err?.message || 'Authentication exchange failed.';
    return NextResponse.redirect(`${redirectTarget}?error=${encodeURIComponent(safeMsg)}`);
  }
}

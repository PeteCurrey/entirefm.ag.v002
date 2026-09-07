/**
 * GET /api/integrations/xero/connect
 * Generates and redirects to the Xero OAuth 2.0 authorization URL.
 * Requires: accounting:sync permission
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { createAuthorizationUrl } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  if (!hasPermission(session, 'accounting:sync') && !hasPermission(session, 'finance:admin')) {
    return NextResponse.json({ error: 'Forbidden — accounting:sync permission required.' }, { status: 403 });
  }

  try {
    const { url } = await createAuthorizationUrl({
      personId: session.personId,
      organisationId: session.orgId,
    });
    return NextResponse.redirect(url);
  } catch (err: any) {
    console.error('[XERO_CONNECT] Failed to generate auth URL:', err?.message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/integrations/xero?error=oauth_init_failed`
    );
  }
}

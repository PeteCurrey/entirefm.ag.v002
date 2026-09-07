/**
 * POST /api/integrations/xero/disconnect
 * Revokes and deletes active Xero OAuth connection.
 * Requires: accounting:sync or finance:admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { disconnectXeroConnection } from '@/lib/integrations/xero';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (!hasPermission(session, 'accounting:sync') && !hasPermission(session, 'finance:admin')) {
    return NextResponse.json(
      { error: 'Forbidden — finance:admin or accounting:sync permission required.' },
      { status: 403 }
    );
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const reason = body?.reason || 'User requested disconnect';
    await disconnectXeroConnection({ reason, actorPersonId: session.personId });

    // Update platform_integration_configs state back to INTERFACE_ONLY
    await dbQuery(`platform_integration_configs?name=eq.Xero`, {
      method: 'PATCH',
      body: {
        state: 'INTERFACE_ONLY',
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, message: 'Xero disconnected successfully' });
  } catch (err: any) {
    console.error('[XERO_DISCONNECT_ERROR]', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to disconnect Xero' },
      { status: 500 }
    );
  }
}

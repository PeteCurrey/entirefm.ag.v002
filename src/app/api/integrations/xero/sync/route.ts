/**
 * POST /api/integrations/xero/sync
 * Manually initiates synchronisation between EntireCAFM and Xero.
 * Supports full batch sync (contacts + invoices + payments) or targeted single invoice sync.
 * Requires: accounting:sync or finance:admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { runXeroSync } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (!hasPermission(session, 'accounting:sync') && !hasPermission(session, 'finance:admin')) {
    return NextResponse.json(
      { error: 'Forbidden — accounting:sync permission required.' },
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

    const result = await runXeroSync({
      actorPersonId: session.personId,
      singleInvoiceId: body?.singleInvoiceId,
      skipContactSync: body?.skipContactSync,
      skipPaymentReconciliation: body?.skipPaymentReconciliation,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[XERO_MANUAL_SYNC_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.safeMessage || err?.message || 'Synchronisation encountered an unexpected error.',
      },
      { status: 500 }
    );
  }
}

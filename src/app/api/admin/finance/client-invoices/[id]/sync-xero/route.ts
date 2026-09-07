/**
 * POST /api/admin/finance/client-invoices/[id]/sync-xero
 * Synchronises a single EntireCAFM client invoice to Xero.
 * Idempotent, auditable, database-backed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { syncInvoiceToXero } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (
    !hasPermission(session, 'accounting:sync') &&
    !hasPermission(session, 'finance:admin') &&
    !hasPermission(session, 'finance:billing')
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await syncInvoiceToXero({
      invoiceId: id,
      actorPersonId: session.personId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invoice sync to Xero failed.',
          syncStatus: result.syncStatus,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      xeroInvoiceId: result.xeroInvoiceId,
      xeroInvoiceNumber: result.xeroInvoiceNumber,
      isNew: result.isNew,
      syncStatus: result.syncStatus,
    });
  } catch (err: any) {
    console.error(`[XERO_SINGLE_INVOICE_SYNC_ERROR] ${id}:`, err);
    return NextResponse.json(
      {
        success: false,
        error: err?.safeMessage || err?.message || 'Unexpected error synchronising invoice to Xero.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listAccountingSyncFailures } from '@/server/finance';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [syncFails, bankAlerts, duplicates] = await Promise.all([
    listAccountingSyncFailures(),
    dbQuery<any[]>(`supplier_invoices?bank_details_change_alert=eq.true&bank_alert_reviewed_at=is.null&select=id,invoice_ref,supplier_org_id,total_amount_gbp,created_at`),
    dbQuery<any[]>(`supplier_invoices?processing_status=eq.DUPLICATE&select=id,invoice_ref,supplier_org_id,total_amount_gbp,duplicate_of_invoice_id,created_at`),
  ]);

  return NextResponse.json({
    accountingSyncFailures: syncFails,
    bankDetailAlerts: bankAlerts.data || [],
    duplicateFlags: duplicates.data || [],
  });
}

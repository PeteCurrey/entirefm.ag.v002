import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { matchSupplierInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: invs } = await dbQuery<any[]>(`supplier_invoices?id=eq.${encodeURIComponent(id)}&select=*`);
  if (!invs || invs.length === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: lines } = await dbQuery<any[]>(
    `supplier_invoice_lines?supplier_invoice_id=eq.${encodeURIComponent(id)}&select=*&order=line_number.asc`
  );

  const { data: creditNotes } = await dbQuery<any[]>(
    `credit_notes?supplier_invoice_id=eq.${encodeURIComponent(id)}&select=*`
  );

  const { data: auditEvents } = await dbQuery<any[]>(
    `audit_events?object_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=50`
  );

  return NextResponse.json({
    invoice: invs[0],
    lines: lines || [],
    creditNotes: creditNotes || [],
    auditHistory: auditEvents || [],
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:write'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  // Only allow safe field updates — never allow updating approved/posted state directly
  const safeFields: Record<string, any> = {};
  const allowed = [
    'invoice_ref', 'issue_date', 'due_date', 'supplier_org_id',
    'resolved_supplier_org_id', 'supplier_resolution_status',
    'purchase_order_id', 'work_order_id',
    'bank_alert_reviewed_by_id', 'bank_alert_reviewed_at',
    'subtotal_gbp', 'tax_amount_gbp', 'total_amount_gbp',
    'supplier_account_ref', 'ingest_channel',
  ];
  for (const key of allowed) {
    if (key in body) safeFields[key] = body[key];
  }

  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', body: safeFields,
  });

  const { data } = await dbQuery<any[]>(`supplier_invoices?id=eq.${encodeURIComponent(id)}&select=*`);
  return NextResponse.json(data?.[0] || {});
}

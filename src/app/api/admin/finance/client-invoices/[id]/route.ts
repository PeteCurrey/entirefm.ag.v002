import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: invs } = await dbQuery<any[]>(`client_invoices?id=eq.${encodeURIComponent(id)}&select=*`);
  if (!invs || invs.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: lines } = await dbQuery<any[]>(
    `client_invoice_lines?client_invoice_id=eq.${encodeURIComponent(id)}&select=*&order=line_number.asc`
  );
  const { data: creditNotes } = await dbQuery<any[]>(
    `credit_notes?client_invoice_id=eq.${encodeURIComponent(id)}&select=*`
  );
  const { data: auditEvents } = await dbQuery<any[]>(
    `audit_events?object_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=30`
  );

  return NextResponse.json({ invoice: invs[0], lines: lines || [], creditNotes: creditNotes || [], auditHistory: auditEvents || [] });
}

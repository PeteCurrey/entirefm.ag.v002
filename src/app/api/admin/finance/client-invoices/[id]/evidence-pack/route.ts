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
    `client_invoice_lines?client_invoice_id=eq.${encodeURIComponent(id)}&select=*`
  );

  const evidenceItems = [];
  for (const line of (lines || [])) {
    if (line.work_order_id) {
      const { data: wo } = await dbQuery<any[]>(
        `work_orders?id=eq.${encodeURIComponent(line.work_order_id)}&select=*`
      );
      if (wo?.[0]) {
        evidenceItems.push({
          type: 'WORK_ORDER',
          workOrder: wo[0],
          // Evidence (photos, reports, signatures) would be linked here
          // Supplier cost and margin are NEVER included in client evidence pack
        });
      }
    }
  }

  return NextResponse.json({
    invoice: invs[0],
    lines: lines || [],
    evidenceItems,
    note: 'Supplier costs and EntireFM margin are not included in client evidence packs',
  });
}

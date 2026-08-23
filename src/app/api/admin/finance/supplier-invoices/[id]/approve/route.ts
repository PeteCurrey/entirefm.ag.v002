import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { approveSupplierInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:approve'))
    return NextResponse.json({ error: 'Forbidden — finance:approve permission required' }, { status: 403 });

  await approveSupplierInvoice(id, session);
  return NextResponse.json({ ok: true, invoiceId: id });
}

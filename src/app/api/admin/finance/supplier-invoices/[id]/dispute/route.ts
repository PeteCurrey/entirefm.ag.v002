import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { disputeSupplierInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:write'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.reason) return NextResponse.json({ error: 'reason is required' }, { status: 400 });

  await disputeSupplierInvoice({ invoiceId: id, reason: body.reason, disputeAmountGbp: body.disputeAmountGbp }, session);
  return NextResponse.json({ ok: true });
}

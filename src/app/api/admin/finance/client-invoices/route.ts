import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listClientInvoices, prepareClientInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const invoices = await listClientInvoices({
    clientAccountId: searchParams.get('clientAccountId') || undefined,
    status: searchParams.get('status') || undefined,
    paymentStatus: searchParams.get('paymentStatus') || undefined,
    limit: parseInt(searchParams.get('limit') || '50', 10),
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.billingRecordIds || !Array.isArray(body.billingRecordIds) || body.billingRecordIds.length === 0)
    return NextResponse.json({ error: 'billingRecordIds array is required' }, { status: 400 });
  if (!body.clientAccountId)
    return NextResponse.json({ error: 'clientAccountId is required' }, { status: 400 });

  const invoiceId = await prepareClientInvoice({
    billingRecordIds: body.billingRecordIds,
    clientAccountId: body.clientAccountId,
    contractId: body.contractId,
    billingPeriodStart: body.billingPeriodStart,
    billingPeriodEnd: body.billingPeriodEnd,
    clientPoRef: body.clientPoRef,
    daysTerms: body.daysTerms,
  }, session);

  return NextResponse.json({ invoiceId }, { status: 201 });
}

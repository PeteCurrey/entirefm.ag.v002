import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listClientInvoices, prepareClientInvoice, createDirectClientInvoice } from '@/server/finance';

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
  if (!body.clientAccountId)
    return NextResponse.json({ error: 'clientAccountId is required' }, { status: 400 });

  try {
    // 1. Batching from billing records
    if (Array.isArray(body.billingRecordIds) && body.billingRecordIds.length > 0) {
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

    // 2. Direct / Standalone invoice creation (from Work Order, Quote, Contract, or Standalone)
    const lines = Array.isArray(body.lines) && body.lines.length > 0
      ? body.lines
      : [
          {
            description: body.description || 'Facilities Management Operational Services',
            quantity: Number(body.quantity) || 1,
            unitPriceGbp: Number(body.amountGbp) || 0,
            taxRatePct: Number(body.taxRatePct ?? 20),
            workOrderId: body.workOrderId,
            quoteId: body.quoteId,
          },
        ];

    const invoiceId = await createDirectClientInvoice({
      clientAccountId: body.clientAccountId,
      contractId: body.contractId,
      workOrderId: body.workOrderId,
      quoteId: body.quoteId,
      clientPoRef: body.clientPoRef,
      notes: body.notes,
      daysTerms: body.daysTerms ? Number(body.daysTerms) : 30,
      issueDate: body.issueDate,
      lines,
    }, session);

    return NextResponse.json({ invoiceId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create invoice' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listBillingReadyQueue, evaluateBillingEligibility, createClientBillingItem } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const queue = await listBillingReadyQueue();
  return NextResponse.json(queue);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.workOrderId) return NextResponse.json({ error: 'workOrderId is required' }, { status: 400 });
  if (!body.netRevenueGbp) return NextResponse.json({ error: 'netRevenueGbp is required' }, { status: 400 });

  const eligibility = await evaluateBillingEligibility(body.workOrderId);
  if (!eligibility.eligible) {
    return NextResponse.json({ eligible: false, blockers: eligibility.blockers }, { status: 422 });
  }

  const billingRecordId = await createClientBillingItem({
    workOrderId: body.workOrderId,
    billingModel: body.billingModel,
    billingEventType: body.billingEventType,
    netRevenueGbp: body.netRevenueGbp,
    taxRatePct: body.taxRatePct,
    clientPoRef: body.clientPoRef,
    billingPeriodStart: body.billingPeriodStart,
    billingPeriodEnd: body.billingPeriodEnd,
    quoteId: body.quoteId,
  }, session);

  return NextResponse.json({ billingRecordId }, { status: 201 });
}

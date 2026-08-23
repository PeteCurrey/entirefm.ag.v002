import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createVariationOrder } from '@/server/commercial';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await dbQuery<any[]>('variation_orders?select=*&order=created_at.desc');
  return NextResponse.json({ data: data || [] });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quoteId, workOrderId, scopeDescription, expectedCostGbp, sellPriceGbp } = body;

    if (!quoteId || !workOrderId || !scopeDescription) {
      return NextResponse.json({ error: 'quoteId, workOrderId, and scopeDescription are required' }, { status: 400 });
    }

    const { variation, error } = await createVariationOrder({
      quoteId,
      workOrderId,
      scopeDescription,
      expectedCostGbp: Number(expectedCostGbp) || 0,
      sellPriceGbp: Number(sellPriceGbp) || 0,
      session,
    });

    if (error || !variation) {
      return NextResponse.json({ error: error || 'Failed to create variation order' }, { status: 400 });
    }

    return NextResponse.json({ variation }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createPurchaseOrder } from '@/server/commercial';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await dbQuery<any[]>('purchase_orders?select=*&order=created_at.desc');
  return NextResponse.json({ data: data || [] });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { workOrderId, quoteId, supplierOrgId, commitmentType, lines, notes } = body;

    if (!supplierOrgId || !lines || lines.length === 0) {
      return NextResponse.json({ error: 'supplierOrgId and non-empty lines are required' }, { status: 400 });
    }

    const { purchaseOrder, error } = await createPurchaseOrder({
      workOrderId,
      quoteId,
      supplierOrgId,
      commitmentType,
      lines,
      notes,
      session,
    });

    if (error || !purchaseOrder) {
      return NextResponse.json({ error: error || 'Failed to create PO' }, { status: 400 });
    }

    return NextResponse.json({ purchaseOrder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

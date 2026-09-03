import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { createInvoiceFromWorkOrder } from '@/server/finance';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await context.params;

    const result = await createInvoiceFromWorkOrder({
      workOrderId: id,
      session,
    });

    if (result.error || !result.invoice) {
      return NextResponse.json({ error: result.error || 'Failed to create invoice' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      invoice: result.invoice,
      alreadyInvoiced: result.alreadyInvoiced,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { convertQuoteToWorkOrder } from '@/server/commercial';

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
    let overrideStatus = false;
    try {
      const body = await request.json();
      overrideStatus = !!body?.overrideStatus;
    } catch {
      // Body may be empty
    }

    const result = await convertQuoteToWorkOrder({
      quoteId: id,
      session,
      overrideStatus,
    });

    if (result.error || !result.workOrder) {
      return NextResponse.json({ error: result.error || 'Failed to convert quote' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      workOrder: result.workOrder,
      alreadyConverted: result.alreadyConverted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordClientQuoteDecision } from '@/server/commercial';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const { reasonCode, reasonDetail } = body;

    const result = await recordClientQuoteDecision({
      quoteId: id,
      decision: 'REJECTED',
      rejectionReasonCode: reasonCode || 'PRICE_TOO_HIGH',
      rejectionReasonDetail: reasonDetail || '',
      session,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to reject quote' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote rejection recorded',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

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
    const { clientPoRef } = body;

    const result = await recordClientQuoteDecision({
      quoteId: id,
      decision: 'APPROVED',
      clientPoRef,
      session,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to approve quote' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote approved successfully',
      costCommitmentId: result.costCommitmentId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeVisit } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { operativeId = 'op-jack-turner', decision, declineReason } = body;

    if (!decision || !['ACCEPT', 'DECLINE'].includes(decision)) {
      return NextResponse.json({ error: 'Valid decision (ACCEPT or DECLINE) required' }, { status: 400 });
    }

    const result = await acknowledgeVisit(id, operativeId, decision, declineReason);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      message: decision === 'ACCEPT' ? 'Job accepted and added to your active queue.' : 'Job declined and returned to dispatcher.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

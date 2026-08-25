import { NextRequest, NextResponse } from 'next/server';
import { startJourney } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { operativeId = 'op-jack-turner', etaTime } = body;

    const result = await startJourney(id, operativeId, etaTime);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      status: 'TRAVELLING',
      etaTime: result.visit?.eta_time,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { startWork } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { operativeId = 'op-jack-turner' } = body;

    const result = await startWork(id, operativeId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      status: 'IN_PROGRESS',
      workStartedAt: result.visit?.work_started_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

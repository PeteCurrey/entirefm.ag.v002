import { NextRequest, NextResponse } from 'next/server';
import { raiseOperationalDefect } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      severity = 'MAJOR',
      make_safe_status = 'NOT_APPLICABLE',
      stop_work_triggered = false,
      recommended_action,
      evidence_photo_ids,
      operativeId = 'op-jack-turner',
      idempotencyKey = req.headers.get('x-idempotency-key') || undefined,
    } = body;

    if (!title || !description || !recommended_action) {
      return NextResponse.json(
        { error: 'title, description, and recommended_action are required' },
        { status: 400 }
      );
    }

    const result = await raiseOperationalDefect(
      id,
      {
        title,
        description,
        severity,
        make_safe_status,
        stop_work_triggered,
        recommended_action,
        evidence_photo_ids,
      },
      idempotencyKey,
      operativeId
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to raise defect' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      defect: result.defect,
      message: 'Defect recorded and added to visit report.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

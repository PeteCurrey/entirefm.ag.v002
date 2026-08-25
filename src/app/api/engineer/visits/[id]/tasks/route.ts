import { NextRequest, NextResponse } from 'next/server';
import { updatePpmTask } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { taskId, update } = body;

    if (!taskId || !update) {
      return NextResponse.json({ error: 'taskId and update object required' }, { status: 400 });
    }

    const result = await updatePpmTask(id, taskId, update);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

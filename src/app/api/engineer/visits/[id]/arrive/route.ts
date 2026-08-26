import { NextRequest, NextResponse } from 'next/server';
import { recordVisitArrival } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const {
      operativeId = 'op-jack-turner',
      method = 'MANUAL',
      coordinates,
      idempotencyKey = req.headers.get('x-idempotency-key') || undefined,
    } = body;

    const result = await recordVisitArrival(id, operativeId, method, coordinates, idempotencyKey);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      status: 'ARRIVED',
      arrivalMethod: method,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

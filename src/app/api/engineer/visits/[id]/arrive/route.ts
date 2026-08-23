import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordArrival } from '@/server/field';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await context.params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // optional body
  }

  const method = body.method || 'MANUAL';
  const coordinates = body.coordinates || (body.lat !== undefined ? { lat: body.lat, lng: body.lng } : null);

  const result = await recordArrival(id, method, coordinates, session);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

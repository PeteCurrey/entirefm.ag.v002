import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordOperativeBriefing } from '@/server/contractor/rams-service';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const operativeId = body.operativeId || session.personId;
  const result = await recordOperativeBriefing(id, operativeId, session);

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to record briefing' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

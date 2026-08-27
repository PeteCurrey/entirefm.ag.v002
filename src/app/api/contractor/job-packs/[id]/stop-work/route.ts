import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordStopWorkEvent } from '@/server/contractor/job-pack-engine';

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

  const { reasonCategory, details } = body;
  if (!reasonCategory || !details) {
    return NextResponse.json({ error: 'Reason category and details are required' }, { status: 400 });
  }

  const result = await recordStopWorkEvent(id, { reasonCategory, details }, session);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to record stop-work event' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

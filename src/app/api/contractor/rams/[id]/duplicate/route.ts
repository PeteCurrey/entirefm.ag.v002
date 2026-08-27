import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { duplicateRamsRecord } from '@/server/contractor/rams-service';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  const result = await duplicateRamsRecord(id, session);

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to duplicate RAMS' }, { status: 400 });
  }

  return NextResponse.json({ success: true, newRamsId: result.newRamsId });
}

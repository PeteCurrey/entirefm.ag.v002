import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getRamsRecordById, updateRamsRecord } from '@/server/contractor/rams-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  const rams = await getRamsRecordById(id, session);
  if (!rams) return NextResponse.json({ error: 'RAMS not found' }, { status: 404 });

  return NextResponse.json({ rams });
}

export async function PATCH(
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

  const result = await updateRamsRecord(id, body, session);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to update RAMS' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

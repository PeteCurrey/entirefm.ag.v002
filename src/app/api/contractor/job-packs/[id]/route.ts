import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getJobPackById, assembleJobPack } from '@/server/contractor/job-pack-engine';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  let pack = await getJobPackById(id, session);

  // If not found by JobPack ID, attempt to assemble by workOrderId
  if (!pack) {
    try {
      pack = await assembleJobPack(id, session);
    } catch {
      return NextResponse.json({ error: 'Job pack not found' }, { status: 404 });
    }
  }

  return NextResponse.json({ jobPack: pack });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  try {
    const pack = await assembleJobPack(id, session);
    return NextResponse.json({ success: true, jobPack: pack });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Assembly failed' }, { status: 400 });
  }
}

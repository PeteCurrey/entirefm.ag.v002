import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { resolveAssetDuplicate } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { id } = await params;
  let body: any = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (body.resolution !== 'MERGED' && body.resolution !== 'DISMISSED_SEPARATE') {
    return NextResponse.json({ error: 'resolution must be MERGED or DISMISSED_SEPARATE' }, { status: 400 });
  }
  const result = await resolveAssetDuplicate(id, body.resolution, session);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: result.success });
}

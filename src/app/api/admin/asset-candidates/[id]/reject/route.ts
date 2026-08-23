import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { rejectAssetCandidate } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { id } = await params;
  let body: any = {};
  try { body = await request.json(); } catch { /* reason optional */ }
  const result = await rejectAssetCandidate(id, body.reason || 'Rejected by reviewer', session);
  return NextResponse.json({ success: result.success });
}

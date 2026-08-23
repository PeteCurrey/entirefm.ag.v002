import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { verifyAssetCandidate } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { id } = await params;
  let body: any = {};
  try { body = await request.json(); } catch { /* overrides optional */ }
  const result = await verifyAssetCandidate(id, body.overrides || {}, session);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ assetId: result.assetId });
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listAssets } from '@/server/estate';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ assetId: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { assetId } = await params;

  // Fetch asset to get its category (used as asset_class)
  const assets = await listAssets();
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });

  const { proposeMaintenanceRequirements: propose } = await import('@/server/ppm');
  const result = await propose(assetId, asset.category, session);
  return NextResponse.json(result);
}

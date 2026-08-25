import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getAssetIntelligenceProfile } from '@/server/asset-intelligence';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  const profile = await getAssetIntelligenceProfile(assetId, session);

  if (!profile) {
    return NextResponse.json({ error: 'Asset not found or restricted' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

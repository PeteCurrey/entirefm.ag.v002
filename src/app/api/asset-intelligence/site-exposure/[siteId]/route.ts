import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getSiteAssetExposure } from '@/server/asset-intelligence';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const exposure = await getSiteAssetExposure(siteId);
  return NextResponse.json(exposure);
}

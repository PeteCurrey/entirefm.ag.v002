import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getAssetDataQuality, getEnrichmentQueue } from '@/server/asset-intelligence';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const siteId = url.searchParams.get('siteId') || undefined;
  const includeQueue = url.searchParams.get('queue') === 'true';

  const dataQuality = await getAssetDataQuality({ siteId });
  const enrichmentQueue = includeQueue ? await getEnrichmentQueue({ siteId }) : [];

  return NextResponse.json({
    dataQuality,
    enrichmentQueue,
  });
}

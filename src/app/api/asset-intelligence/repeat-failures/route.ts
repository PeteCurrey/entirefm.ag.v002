import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getRepeatFailureAssets } from '@/server/asset-intelligence';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const siteId = url.searchParams.get('siteId') || undefined;
  const windowDays = parseInt(url.searchParams.get('windowDays') || '90', 10);
  const minOccurrences = parseInt(url.searchParams.get('minOccurrences') || '3', 10);

  const results = await getRepeatFailureAssets({ siteId }, windowDays, minOccurrences);
  return NextResponse.json(results);
}

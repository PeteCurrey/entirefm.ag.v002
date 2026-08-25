import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getHighCostAssets } from '@/server/asset-intelligence';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const siteId = url.searchParams.get('siteId') || undefined;
  const periodDays = parseInt(url.searchParams.get('days') || '365', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  const assets = await getHighCostAssets({ siteId }, periodDays, limit);
  return NextResponse.json(assets);
}

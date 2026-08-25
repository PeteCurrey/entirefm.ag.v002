import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getAssetCostLedger } from '@/server/asset-intelligence';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  const url = new URL(request.url);
  const periodDays = parseInt(url.searchParams.get('days') || '365', 10);

  const ledger = await getAssetCostLedger(assetId, periodDays);
  return NextResponse.json(ledger);
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getAssetFailureHistory } from '@/server/asset-intelligence';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  const history = await getAssetFailureHistory(assetId);
  return NextResponse.json(history);
}

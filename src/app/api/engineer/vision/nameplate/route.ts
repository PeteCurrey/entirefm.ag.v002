import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { extractNameplateDetails } from '@/server/field';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { rawText, assetId } = body;
  if (!rawText) {
    return NextResponse.json({ error: 'rawText required' }, { status: 400 });
  }

  let existingAsset: any = undefined;
  if (assetId) {
    const { data: assets } = await dbQuery<any[]>(`assets?id=eq.${assetId}&select=manufacturer,model,serial_number`);
    if (assets && assets.length > 0) existingAsset = assets[0];
  }

  const extracted = await extractNameplateDetails(rawText, existingAsset);

  return NextResponse.json({
    success: true,
    extraction: extracted,
  });
}

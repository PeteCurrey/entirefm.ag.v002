/**
 * API ROUTE: /api/assets/batch-labels
 * ===================================
 * Generates an A4 printable sheet for multiple selected assets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { generateBatchLabelSheetHtml } from '@/server/assets/qr-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const assetIds: string[] = body.asset_ids || [];

    if (assetIds.length === 0) {
      return NextResponse.json({ error: 'No asset IDs provided' }, { status: 400 });
    }

    const isInternal = session.orgType === 'ENTIREFM' || !!session.viewAsContext?.isViewAs;

    const { data: rawAssets } = await dbQuery<any[]>(
      `assets?id=in.(${assetIds.map(encodeURIComponent).join(',')})&select=id,asset_reference,name,category,manufacturer,model,serial_number,installation_date,site:sites(id,name,organisation_id)`
    );

    if (!rawAssets || rawAssets.length === 0) {
      return NextResponse.json({ error: 'No assets found' }, { status: 404 });
    }

    // Filter out assets not belonging to client organization if not internal
    const assets = rawAssets.filter((a) => {
      if (isInternal) return true;
      if (session.orgType === 'CLIENT') {
        return a.site?.organisation_id === session.orgId;
      }
      return true;
    });

    if (assets.length === 0) {
      return NextResponse.json({ error: 'Forbidden: No authorized assets in selection' }, { status: 403 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entirefm.com';
    const labelData = assets.map((a) => ({
      id: a.id,
      asset_reference: a.asset_reference,
      name: a.name,
      category: a.category,
      manufacturer: a.manufacturer,
      model: a.model,
      serial_number: a.serial_number,
      site_name: a.site?.name,
      installation_date: a.installation_date,
      qr_code_url: `${baseUrl}/asset/${a.id}`,
    }));

    const html = generateBatchLabelSheetHtml(labelData, baseUrl);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('[BATCH_LABELS_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

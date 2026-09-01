/**
 * API ROUTE: /api/assets/[id]/qr
 * ==============================
 * Returns SVG QR code or formatted SVG Asset Label for a specific asset.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { generateQrSvg, generatePrintableAssetLabelSvg } from '@/server/assets/qr-engine';
import { verifyAssetAccess } from '@/server/assets/asset-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessCheck = await verifyAssetAccess(id, session);
    if (!accessCheck.allowed || !accessCheck.asset) {
      return NextResponse.json({ error: accessCheck.reason || 'Forbidden' }, { status: 403 });
    }

    const format = req.nextUrl.searchParams.get('format') || 'label'; // 'label' | 'qr_only'
    const download = req.nextUrl.searchParams.get('download') === 'true';

    const asset = accessCheck.asset;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entirefm.com';
    const targetUrl = `${baseUrl}/asset/${asset.id}`;

    let svg: string;
    let filename: string;

    if (format === 'qr_only') {
      svg = generateQrSvg(targetUrl, { size: 300, margin: 2 });
      filename = `QR-${asset.asset_reference}.svg`;
    } else {
      svg = generatePrintableAssetLabelSvg(
        {
          id: asset.id,
          asset_reference: asset.asset_reference,
          name: asset.name,
          category: asset.category,
          manufacturer: asset.manufacturer,
          model: asset.model,
          serial_number: asset.serial_number,
          site_name: asset.site?.name,
          installation_date: asset.installation_date,
          qr_code_url: targetUrl,
        },
        baseUrl
      );
      filename = `LABEL-${asset.asset_reference}.svg`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    };

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(svg, { status: 200, headers });
  } catch (err: any) {
    console.error('[ASSET_QR_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

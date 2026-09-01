/**
 * API ROUTE: /api/assets/scan
 * ===========================
 * Handles authenticated asset QR scan submissions & physical attendance verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordAssetScan } from '@/server/assets/asset-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized — please sign in' }, { status: 401 });
    }

    const body = await req.json();
    const { asset_id, work_order_id, scan_event_type, latitude, longitude, accuracy_meters, device_metadata, notes } = body;

    if (!asset_id) {
      return NextResponse.json({ error: 'Missing required field: asset_id' }, { status: 400 });
    }

    const result = await recordAssetScan(
      {
        asset_id,
        work_order_id,
        scan_event_type: scan_event_type || 'GENERAL_SCAN',
        latitude: typeof latitude === 'number' ? latitude : undefined,
        longitude: typeof longitude === 'number' ? longitude : undefined,
        accuracy_meters: typeof accuracy_meters === 'number' ? accuracy_meters : undefined,
        device_metadata: device_metadata || {
          userAgent: req.headers.get('user-agent') || 'Unknown',
        },
        notes,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to record scan' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      scanId: result.scanId,
      message: 'Physical attendance and QR scan successfully verified and logged.',
    });
  } catch (err: any) {
    console.error('[API_ASSET_SCAN_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

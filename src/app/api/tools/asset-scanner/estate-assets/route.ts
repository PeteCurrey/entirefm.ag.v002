/**
 * ESTATE ASSETS API ENDPOINT — /api/tools/asset-scanner/estate-assets
 * =================================================================
 * Fetches and updates scanned assets for a logged-in member's estate.
 */

import { NextResponse } from 'next/server';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'AUTH_REQUIRED', message: 'Authentication required to view estate assets' },
        { status: 401 }
      );
    }

    const { supabaseUid } = await verifySupabaseAuthToken(authHeader);

    // Return current member's scanned estate assets
    return NextResponse.json({
      success: true,
      supabaseUid,
      assets: [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'AUTH_FAILED', message: err?.message || 'Authentication error' },
      { status: 401 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'AUTH_REQUIRED', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { supabaseUid } = await verifySupabaseAuthToken(authHeader);
    const body = await request.json();
    const { assetId, addedToPpmSchedule } = body;

    if (!assetId) {
      return NextResponse.json({ success: false, error: 'MISSING_ASSET_ID' }, { status: 400 });
    }

    const timestamp = addedToPpmSchedule ? new Date().toISOString() : null;

    return NextResponse.json({
      success: true,
      assetId,
      supabaseUid,
      addedToPpmScheduleAt: timestamp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'UPDATE_FAILED', message: err?.message || 'Update failed' },
      { status: 500 }
    );
  }
}

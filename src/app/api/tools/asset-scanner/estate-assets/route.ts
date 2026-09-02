/**
 * ESTATE ASSETS API ENDPOINT — /api/tools/asset-scanner/estate-assets
 * =================================================================
 * GET  — List all assets for the authenticated member's estate.
 *         Optional ?assetId={id} to fetch a single asset.
 * PATCH — Update addedToPpmScheduleAt on one or more assets (bulk or single).
 *
 * All Firestore operations use the server-side Firestore REST client.
 * All operations are scoped to the verified member UID — no cross-user access.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { listEstateAssets, getEstateAsset, updateEstateAsset } from '@/server/firestore/client';

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

    // Optional: fetch single asset by ID
    const url = new URL(request.url);
    const assetId = url.searchParams.get('assetId');

    if (assetId) {
      const { asset, error } = await getEstateAsset(supabaseUid, assetId);
      if (error === 'ASSET_NOT_FOUND') {
        return NextResponse.json({ success: false, error: 'ASSET_NOT_FOUND' }, { status: 404 });
      }
      if (error) {
        return NextResponse.json(
          { success: false, error: 'FIRESTORE_ERROR', message: error },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, asset });
    }

    // List all assets
    const { assets, error } = await listEstateAssets(supabaseUid);
    if (error) {
      return NextResponse.json(
        { success: false, error: 'FIRESTORE_ERROR', message: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      supabaseUid,
      assets,
      count: assets.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'AUTH_FAILED', message: err?.message || 'Authentication error' },
      { status: 401 }
    );
  }
}

const PatchSchema = z.union([
  // Single asset update (PPM schedule stamp)
  z.object({
    assetId: z.string().min(1),
    assetIds: z.undefined().optional(),
    addedToPpmSchedule: z.boolean(),
  }),
  // Bulk asset update (multi-select PPM handoff)
  z.object({
    assetIds: z.array(z.string().min(1)).min(1),
    assetId: z.undefined().optional(),
    addedToPpmSchedule: z.boolean(),
  }),
]);

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
    const parsed = PatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const timestamp = parsed.data.addedToPpmSchedule ? new Date().toISOString() : null;
    const idsToUpdate = parsed.data.assetIds ?? [parsed.data.assetId!];

    const results = await Promise.all(
      idsToUpdate.map((assetId) =>
        updateEstateAsset(
          supabaseUid,
          assetId,
          { addedToPpmScheduleAt: timestamp, updatedAt: new Date().toISOString() },
          ['addedToPpmScheduleAt', 'updatedAt']
        ).then(({ success, error }) => ({ assetId, success, error }))
      )
    );

    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'PARTIAL_UPDATE_FAILURE',
          failed: failed.map((r) => ({ assetId: r.assetId, error: r.error })),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      supabaseUid,
      updated: results.map((r) => ({ assetId: r.assetId, addedToPpmScheduleAt: timestamp })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'UPDATE_FAILED', message: err?.message || 'Update failed' },
      { status: 500 }
    );
  }
}

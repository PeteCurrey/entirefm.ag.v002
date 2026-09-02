/**
 * MANUAL ASSET ENTRY ENDPOINT — /api/tools/asset-scanner/estate-assets/manual
 * ===========================================================================
 * POST — Creates a new asset doc for equipment not scanned through the pipeline.
 *         Runs the same SFG20 regime-matching step as scanned assets so manual
 *         and scanned assets behave identically everywhere else in the product.
 *
 * Status is set directly to 'complete'.
 * extractionConfidence is omitted from the schema enum and set to 'manual'
 * to distinguish from AI-extracted confidence levels.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { createEstateAsset } from '@/server/firestore/client';
import { matchSfg20Regime } from '@/server/asset-scanner/extractor';

const ManualAssetSchema = z.object({
  assetType: z.string().min(1, 'Asset type is required'),
  manufacturer: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  serialNumber: z.string().nullable().optional(),
  // Optional: pre-selected SFG20 asset ID for regime matching
  sfg20AssetId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'AUTH_REQUIRED' }, { status: 401 });
    }

    const { supabaseUid } = await verifySupabaseAuthToken(authHeader);
    const body = await request.json();
    const parsed = ManualAssetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { assetType, manufacturer, model, serialNumber, sfg20AssetId } = parsed.data;

    // Run the same SFG20 matching logic as scanned assets — reuses extractor's matchSfg20Regime()
    let resolvedSfg20Id: string | null = null;
    let regime = null;

    if (sfg20AssetId) {
      // Member already selected a specific SFG20 asset
      const { matchedDef, regime: matchedRegime } = matchSfg20Regime(assetType, manufacturer ?? null, sfg20AssetId);
      regime = matchedRegime;
      resolvedSfg20Id = matchedDef?.id ?? null;
    } else {
      // Auto-match from assetType + manufacturer
      const { matchedDef, regime: matchedRegime } = matchSfg20Regime(assetType, manufacturer ?? null);
      regime = matchedRegime;
      resolvedSfg20Id = matchedDef?.id ?? null;
    }

    const nowIso = new Date().toISOString();
    const manualUploadId = `manual_${supabaseUid.slice(0, 8)}_${Date.now()}`;

    const { assetId, error } = await createEstateAsset(supabaseUid, {
      createdAt: nowIso,
      updatedAt: nowIso,
      sourceUploadId: manualUploadId,
      assetType: assetType,
      manufacturer: manufacturer ?? null,
      model: model ?? null,
      serialNumber: serialNumber ?? null,
      sfg20AssetId: resolvedSfg20Id,
      extractionConfidence: 'manual',
      recommendedRegime: regime,
      flaggedIssues: [],
      addedToPpmScheduleAt: null,
      status: 'complete',
    });

    if (error || !assetId) {
      return NextResponse.json(
        { success: false, error: 'FIRESTORE_WRITE_FAILED', message: error ?? 'Unknown error creating asset' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assetId,
      sfg20AssetId: resolvedSfg20Id,
      hasRegimeMatch: regime !== null,
      recommendedRegime: regime,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'MANUAL_ENTRY_FAILED', message: err?.message || 'Manual asset creation failed' },
      { status: 500 }
    );
  }
}

/**
 * ESTATE ASSET EDIT ENDPOINT — /api/tools/asset-scanner/estate-assets/[assetId]
 * =============================================================================
 * PATCH — Member-editable fields only: assetType, manufacturer, model, serialNumber,
 *          and recommendedRegime (via SFG20 re-selection only, not free-text).
 *
 * Server-protected fields (extractionConfidence, sourceUploadId, createdAt,
 * status, addedToPpmScheduleAt) cannot be modified through this endpoint.
 * manuallyEditedFields is maintained server-side to track what the member changed.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { getEstateAsset, updateEstateAsset } from '@/server/firestore/client';
import { getAssetById } from '@/lib/tools/asset-taxonomy';
import { matchSfg20Regime } from '@/server/asset-scanner/extractor';

const EditableAssetFields = z.object({
  assetType: z.string().min(1).nullable().optional(),
  manufacturer: z.string().min(1).nullable().optional(),
  model: z.string().min(1).nullable().optional(),
  serialNumber: z.string().min(1).nullable().optional(),
  // SFG20 regime re-selection: provide the SFG20 asset ID from asset-taxonomy.ts
  // The server resolves this to a full RecommendedRegime — members cannot free-type frequencies
  sfg20AssetId: z.string().min(1).nullable().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'AUTH_REQUIRED' }, { status: 401 });
    }

    const { supabaseUid } = await verifySupabaseAuthToken(authHeader);
    const { assetId } = await context.params;

    if (!assetId) {
      return NextResponse.json({ success: false, error: 'MISSING_ASSET_ID' }, { status: 400 });
    }

    // Verify asset belongs to this member before accepting edits
    const { asset: existingAsset, error: fetchError } = await getEstateAsset(supabaseUid, assetId);
    if (fetchError === 'ASSET_NOT_FOUND' || !existingAsset) {
      return NextResponse.json({ success: false, error: 'ASSET_NOT_FOUND' }, { status: 404 });
    }
    if (fetchError) {
      return NextResponse.json({ success: false, error: 'FIRESTORE_ERROR', message: fetchError }, { status: 500 });
    }

    const body = await request.json();
    const parsed = EditableAssetFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const edits = parsed.data;
    const fieldsToUpdate: Record<string, any> = { updatedAt: new Date().toISOString() };
    const updateMask: string[] = ['updatedAt'];
    const editedFieldNames: string[] = [...(existingAsset.manuallyEditedFields || [])];

    // Apply each editable field
    const editableKeys = ['assetType', 'manufacturer', 'model', 'serialNumber'] as const;
    for (const key of editableKeys) {
      if (key in edits && edits[key] !== undefined) {
        fieldsToUpdate[key] = edits[key];
        updateMask.push(key);
        if (!editedFieldNames.includes(key)) {
          editedFieldNames.push(key);
        }
      }
    }

    // SFG20 regime re-selection: resolve via canonical taxonomy, not free-text
    if ('sfg20AssetId' in edits && edits.sfg20AssetId !== undefined) {
      if (edits.sfg20AssetId === null) {
        // Member explicitly cleared the regime match
        fieldsToUpdate.recommendedRegime = null;
        fieldsToUpdate.sfg20AssetId = null;
        updateMask.push('recommendedRegime', 'sfg20AssetId');
        if (!editedFieldNames.includes('recommendedRegime')) editedFieldNames.push('recommendedRegime');
      } else {
        const assetDef = getAssetById(edits.sfg20AssetId);
        if (!assetDef) {
          return NextResponse.json(
            { success: false, error: 'INVALID_SFG20_ASSET_ID', message: `No SFG20 asset found for id: ${edits.sfg20AssetId}` },
            { status: 400 }
          );
        }
        const { regime } = matchSfg20Regime(assetDef.name, null);
        fieldsToUpdate.recommendedRegime = regime;
        fieldsToUpdate.sfg20AssetId = edits.sfg20AssetId;
        updateMask.push('recommendedRegime', 'sfg20AssetId');
        if (!editedFieldNames.includes('recommendedRegime')) editedFieldNames.push('recommendedRegime');
      }
    }

    // Update the manuallyEditedFields audit trail
    if (editedFieldNames.length > 0) {
      fieldsToUpdate.manuallyEditedFields = editedFieldNames;
      updateMask.push('manuallyEditedFields');
    }

    if (updateMask.length <= 1) {
      return NextResponse.json({ success: false, error: 'NO_EDITABLE_FIELDS', message: 'No valid editable fields provided.' }, { status: 400 });
    }

    const { success, error } = await updateEstateAsset(supabaseUid, assetId, fieldsToUpdate, updateMask);
    if (!success) {
      return NextResponse.json({ success: false, error: 'FIRESTORE_WRITE_FAILED', message: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      assetId,
      updatedFields: Object.keys(fieldsToUpdate).filter((k) => k !== 'updatedAt'),
      manuallyEditedFields: editedFieldNames,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'EDIT_FAILED', message: err?.message || 'Edit failed' },
      { status: 500 }
    );
  }
}

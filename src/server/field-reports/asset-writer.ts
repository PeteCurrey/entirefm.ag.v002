/**
 * ENTIREFM FIELD REPORTING ENGINE — ASSET REGISTER SYNC
 * =======================================================
 * Creates and updates canonical CAFM assets from field survey schedules.
 * Ensures emergency lighting / fire call point surveys directly populate
 * and refresh the permanent asset registry.
 */

import { dbQuery } from '../db/client';
import type { LuminaireAssetRowData } from './types';

export interface AssetSyncResult {
  assetId: string;
  assetReference: string;
  action: 'CREATED' | 'UPDATED';
}

/**
 * Synchronise a batch of surveyed emergency luminaires to canonical assets.
 */
export async function syncEmergencyLightingAssets(
  siteId: string,
  rows: LuminaireAssetRowData[]
): Promise<AssetSyncResult[]> {
  const results: AssetSyncResult[] = [];

  for (const row of rows) {
    if (!row.asset_reference) continue;

    // Check if asset already exists for this site by asset_reference
    const { data: existingAssets } = await dbQuery<any[]>(
      `assets?site_id=eq.${siteId}&asset_reference=eq.${encodeURIComponent(row.asset_reference)}&limit=1`
    );

    const assetPayload = {
      site_id: siteId,
      asset_reference: row.asset_reference,
      name: `${row.fitting_type || 'Emergency Luminaire'} (${row.maintained_type || 'Maintained'})`,
      category: 'EMERGENCY_LIGHTING',
      condition: row.condition || 'GOOD',
      status: row.is_operational ? 'IN_SERVICE' : 'DEFECTIVE',
      metadata: {
        floor_level: row.floor_level,
        zone_area: row.zone_area,
        exact_location: row.exact_location,
        fitting_type: row.fitting_type,
        maintained_type: row.maintained_type,
        test_facility: row.test_facility,
        duration_hours: row.duration_hours || 3,
        access_limitation: row.access_limitation,
        comments: row.comments,
        last_surveyed_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    if (existingAssets && existingAssets.length > 0) {
      const existing = existingAssets[0];
      await dbQuery(`assets?id=eq.${existing.id}`, {
        method: 'PATCH',
        body: assetPayload,
      });
      results.push({
        assetId: existing.id,
        assetReference: row.asset_reference,
        action: 'UPDATED',
      });
    } else {
      const { data: inserted, error } = await dbQuery<any[]>('assets', {
        method: 'POST',
        body: {
          ...assetPayload,
          statutory_relevance: true,
          criticality: 'HIGH',
        },
        headers: { Prefer: 'return=representation' },
      });

      const newId = inserted?.[0]?.id || `asset-survey-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      results.push({
        assetId: newId,
        assetReference: row.asset_reference,
        action: 'CREATED',
      });
    }
  }

  return results;
}

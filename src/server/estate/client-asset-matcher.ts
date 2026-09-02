import { dbQuery } from '../db/client';

export interface PlausibleMatch {
  clientAsset: {
    id: string;
    name: string;
    category: string;
    manufacturer: string | null;
    model: string | null;
    serialNumber: string | null;
    status: string;
    condition: string | null;
    authoritativeRegime?: {
      taskRef: string;
      standard: string;
      frequency: string;
    } | null;
  };
  matchConfidence: 'high' | 'medium';
  matchReason: string;
}

function cleanStr(val: string | null | undefined): string {
  if (!val) return '';
  return val.trim().toLowerCase().replace(/[\s\-_]/g, '');
}

/**
 * Finds plausible matches between an extracted My Estate asset and client-managed portfolio assets.
 * Strict matching:
 *  1. Exact clean serial number match (High confidence)
 *  2. Exact manufacturer AND model match (Medium confidence)
 * Ignores any match already confirmed or previously dismissed.
 */
export async function findPlausibleMatches(
  authUserId: string,
  estateAsset: {
    id: string;
    serialNumber?: string | null;
    manufacturer?: string | null;
    model?: string | null;
    assetType?: string | null;
  }
): Promise<PlausibleMatch[]> {
  if (!authUserId || !estateAsset.id) return [];

  // Check existing links and dismissals for this estate asset
  const [existingLinksRes, dismissalsRes] = await Promise.all([
    dbQuery<any[]>(
      `estate_client_asset_links?auth_user_id=eq.${encodeURIComponent(
        authUserId
      )}&estate_asset_firestore_id=eq.${encodeURIComponent(estateAsset.id)}&select=client_asset_id`
    ),
    dbQuery<any[]>(
      `estate_client_link_dismissals?auth_user_id=eq.${encodeURIComponent(
        authUserId
      )}&estate_asset_firestore_id=eq.${encodeURIComponent(estateAsset.id)}&select=client_asset_id`
    ),
  ]);

  const excludedIds = new Set<string>();
  (existingLinksRes.data || []).forEach((r) => excludedIds.add(r.client_asset_id));
  (dismissalsRes.data || []).forEach((r) => excludedIds.add(r.client_asset_id));

  const cleanSerial = cleanStr(estateAsset.serialNumber);
  const cleanMfg = cleanStr(estateAsset.manufacturer);
  const cleanModel = cleanStr(estateAsset.model);

  if (!cleanSerial && (!cleanMfg || !cleanModel)) {
    return [];
  }

  // Fetch active candidate assets from client register
  const { data: candidates, error } = await dbQuery<any[]>(
    'assets?status=neq.ARCHIVED&select=id,name,category,manufacturer,model,serial_number,status,condition,metadata&limit=100'
  );

  if (error || !candidates) return [];

  const matches: PlausibleMatch[] = [];

  for (const asset of candidates) {
    if (excludedIds.has(asset.id)) continue;

    const candSerial = cleanStr(asset.serial_number);
    const candMfg = cleanStr(asset.manufacturer);
    const candModel = cleanStr(asset.model);

    // Rule 1: Exact serial match
    if (cleanSerial && candSerial && cleanSerial === candSerial) {
      matches.push({
        clientAsset: {
          id: asset.id,
          name: asset.name,
          category: asset.category,
          manufacturer: asset.manufacturer,
          model: asset.model,
          serialNumber: asset.serial_number,
          status: asset.status,
          condition: asset.condition,
          authoritativeRegime: asset.metadata?.authoritativeRegime || {
            taskRef: 'SFG20-STAT-01',
            standard: 'SFG20',
            frequency: 'Quarterly',
          },
        },
        matchConfidence: 'high',
        matchReason: `Exact serial number match (${asset.serial_number}) with managed client register`,
      });
      continue;
    }

    // Rule 2: Exact manufacturer + model match
    if (cleanMfg && cleanModel && candMfg && candModel && cleanMfg === candMfg && cleanModel === candModel) {
      matches.push({
        clientAsset: {
          id: asset.id,
          name: asset.name,
          category: asset.category,
          manufacturer: asset.manufacturer,
          model: asset.model,
          serialNumber: asset.serial_number,
          status: asset.status,
          condition: asset.condition,
          authoritativeRegime: asset.metadata?.authoritativeRegime || {
            taskRef: 'SFG20-STAT-01',
            standard: 'SFG20',
            frequency: 'Quarterly',
          },
        },
        matchConfidence: 'medium',
        matchReason: `Manufacturer (${asset.manufacturer}) and Model (${asset.model}) match managed plant record`,
      });
    }
  }

  return matches;
}

/**
 * Explicit user confirmation to link an estate asset to an authoritative client record.
 * Creates a reference only — zero data overwrites or merges.
 */
export async function confirmEstateClientLink(
  authUserId: string,
  estateAssetFirestoreId: string,
  clientAssetId: string
): Promise<{ success: boolean; link?: any; error?: string }> {
  if (!authUserId || !estateAssetFirestoreId || !clientAssetId) {
    return { success: false, error: 'Missing required link parameters' };
  }

  const { data, error } = await dbQuery<any[]>('estate_client_asset_links', {
    method: 'POST',
    body: {
      auth_user_id: authUserId,
      estate_asset_firestore_id: estateAssetFirestoreId,
      client_asset_id: clientAssetId,
      linked_by: 'MEMBER',
      linked_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error('[ESTATE_CLIENT_LINK] Failed to confirm link:', error);
    return { success: false, error };
  }

  return { success: true, link: data?.[0] };
}

/**
 * Records a dismissal so the member is not repeatedly nagged about this match.
 */
export async function dismissEstateClientSuggestion(
  authUserId: string,
  estateAssetFirestoreId: string,
  clientAssetId: string
): Promise<boolean> {
  const { error } = await dbQuery('estate_client_link_dismissals', {
    method: 'POST',
    body: {
      auth_user_id: authUserId,
      estate_asset_firestore_id: estateAssetFirestoreId,
      client_asset_id: clientAssetId,
      dismissed_at: new Date().toISOString(),
    },
  });

  return !error;
}

/**
 * Removes link reference between estate asset and client record.
 * GUARANTEE: Unlinking never deletes or modifies either underlying record.
 */
export async function unlinkEstateClientAsset(
  authUserId: string,
  estateAssetFirestoreId: string,
  clientAssetId: string
): Promise<boolean> {
  const { error } = await dbQuery(
    `estate_client_asset_links?auth_user_id=eq.${encodeURIComponent(
      authUserId
    )}&estate_asset_firestore_id=eq.${encodeURIComponent(
      estateAssetFirestoreId
    )}&client_asset_id=eq.${encodeURIComponent(clientAssetId)}`,
    {
      method: 'DELETE',
    }
  );

  return !error;
}

/**
 * Retrieves the authoritative client record if linked.
 */
export async function getLinkedClientAsset(
  authUserId: string,
  estateAssetFirestoreId: string
): Promise<any | null> {
  const { data, error } = await dbQuery<any[]>(
    `estate_client_asset_links?auth_user_id=eq.${encodeURIComponent(
      authUserId
    )}&estate_asset_firestore_id=eq.${encodeURIComponent(
      estateAssetFirestoreId
    )}&select=id,linked_at,client_asset:assets(id,name,category,manufacturer,model,serial_number,status,condition,metadata)`
  );

  if (error || !data || data.length === 0) return null;

  return data[0];
}

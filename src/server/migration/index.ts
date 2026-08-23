/**
 * ENTIREFM MIGRATION & IMPORT ARCHITECTURE
 * ========================================
 * Isolation layer and transformation adapters for migrating legacy CAFM data
 * into the canonical domain model without compromising schema integrity.
 */

export interface LegacyImportJob {
  id: string;
  sourceSystem: 'LEGACY_CAFM' | 'SPREADSHEET' | 'CLIENT_EXPORT';
  entityType: 'ASSETS' | 'SITES' | 'CLIENTS' | 'CONTRACTORS' | 'WORK_ORDERS';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  status: 'PENDING' | 'VALIDATING' | 'MIGRATING' | 'COMPLETED' | 'FAILED';
  startedAt: string;
}

export interface LegacyAssetRecord {
  legacyId: string;
  siteName: string;
  assetDescription: string;
  category: string;
  location?: string;
  serialNumber?: string;
  installDate?: string;
}

/**
 * Validate and map legacy asset record into canonical Asset entity schema
 */
export function mapLegacyAssetToCanonical(record: LegacyAssetRecord, siteId: string) {
  return {
    site_id: siteId,
    asset_reference: `AST-${record.legacyId || Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    name: record.assetDescription || 'Unspecified Asset',
    category: (record.category || 'GENERAL').toUpperCase(),
    serial_number: record.serialNumber || null,
    installation_date: record.installDate || null,
    condition: 'GOOD' as const,
    criticality: 'MEDIUM' as const,
    statutory_relevance: false,
    status: 'IN_SERVICE' as const,
    metadata: { migratedFromLegacy: true, legacyId: record.legacyId },
  };
}

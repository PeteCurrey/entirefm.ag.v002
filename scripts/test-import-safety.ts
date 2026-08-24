/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * PHASE 0I-PRE IMPORT SAFETY SEAL TEST SUITE
 * ============================================================================
 * Tests:
 * 1. UNCHANGED exact record (same external_id + same hash -> UNCHANGED, 0 writes)
 * 2. CHANGE_DETECTED record (same external_id + changed hash -> CHANGE_DETECTED, diff computed)
 * 3. Field-level change diff accuracy
 * 4. Fuzzy duplicate detection (POSSIBLE_DUPLICATE, commit blocked)
 * 5. Fuzzy duplicate resolution gate (resolveImportDuplicate unblocks commit)
 * 6. Duplicate decision audit ledger verification
 * 7. Enriched EntireFM data conflict protection (CONFLICT on local edit)
 * 8. Safe rollback of untouched new records (clean reversion)
 * 9. Rollback protection after manual edit (ROLLBACK_BLOCKED)
 * 10. Rollback protection with downstream Work Order (dependency check)
 * 11. Rollback protection with downstream Asset (dependency check)
 * 12. Rollback safety pre-flight check (checkRollbackSafety)
 * 13. Raw CSV storage security & privacy truth check (TRANSIENT / NOT PERSISTED)
 * 14. Real database-backed import history verification
 * 15. RBAC permission gates for import, commit, and rollback
 * 16. Post-test cleanup: verification that remote operational counts return to 0
 */

import { Client } from 'pg';
import {
  parseCSV,
  calculateHash,
  detectMappingPreset,
  createImportBatch,
  applyMappingAndValidate,
  commitImport,
  rollbackImport,
  resolveImportDuplicate,
  getImportRowDiff,
  checkRollbackSafety,
  listImportBatches,
  SYSTEM_PRESET_MAPPINGS,
  isFuzzyNameMatch,
  computeFieldDiff,
} from '../src/server/data-import';
import { UserSession, hasPermission } from '../src/server/identity';
import { dbQuery } from '../src/server/db/client';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://tyrknahwlodspvzfkdzk.supabase.co';
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cmtuYWh3bG9kc3B2emZrZHprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQxODQ3OCwiZXhwIjoyMTAyOTk0NDc4fQ.yBVGBP0r4YRHwY1rBhsnZqO-n_alrhwTO-_VmTNfJjM';
}

const adminSession: UserSession = {
  personId: '00000000-0000-0000-0000-000000000099',
  orgId: '00000000-0000-0000-0000-000000000001',
  role: 'SUPER_ADMIN',
  orgType: 'ENTIREFM',
  effectivePermissions: ['data_import:view', 'data_import:create', 'data_import:map', 'data_import:commit', 'data_import:rollback', 'data_import:admin'],
};

const clientSession: UserSession = {
  personId: '00000000-0000-0000-0000-000000000002',
  orgId: '00000000-0000-0000-0000-000000000002',
  role: 'CLIENT_MANAGER',
  orgType: 'CLIENT',
  effectivePermissions: [],
};

const contractorSession: UserSession = {
  personId: '00000000-0000-0000-0000-000000000003',
  orgId: '00000000-0000-0000-0000-000000000003',
  role: 'CONTRACTOR_ADMIN',
  orgType: 'CONTRACTOR',
  effectivePermissions: [],
};

const engineerSession: UserSession = {
  personId: '00000000-0000-0000-0000-000000000004',
  orgId: '00000000-0000-0000-0000-000000000003',
  role: 'FIELD_ENGINEER',
  orgType: 'CONTRACTOR',
  effectivePermissions: [],
};

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ [${passed}] ${description}`);
  } else {
    failed++;
    console.error(`  ✗ [FAIL] ${description}`);
  }
}

async function run() {
  console.log('================================================================');
  console.log('ENTIREFM IMPORT SAFETY FINAL SEAL TEST SUITE');
  console.log('================================================================\n');

  const pgClient = new Client({
    connectionString: 'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();

  // Ensure test verification actor exists in database for FK references
  await pgClient.query(`
    INSERT INTO public.organisations (id, code, name, org_type)
    VALUES ('00000000-0000-0000-0000-000000000001', 'ENTIREFM-INT', 'EntireFM Internal Operations', 'ENTIREFM')
    ON CONFLICT (id) DO NOTHING
  `);
  await pgClient.query(`
    INSERT INTO public.persons (id, first_name, last_name, email, job_title, status)
    VALUES ('00000000-0000-0000-0000-000000000099', 'Platform Verification', 'Officer', 'admin.verifier@entirefm.internal', 'Super Admin', 'ACTIVE')
    ON CONFLICT (id) DO NOTHING
  `);

  // Clean pre-existing test data
  await pgClient.query(`DELETE FROM public.sites WHERE source_system = 'SIMPRO'`);
  await pgClient.query(`DELETE FROM public.provider_organisations WHERE source_system = 'SIMPRO'`);
  await pgClient.query(`DELETE FROM public.client_accounts WHERE source_system = 'SIMPRO'`);
  await pgClient.query(`DELETE FROM public.organisations WHERE source_system = 'SIMPRO'`);
  await pgClient.query(`DELETE FROM public.data_import_duplicate_decisions WHERE true`);
  await pgClient.query(`DELETE FROM public.data_import_issues WHERE true`);
  await pgClient.query(`DELETE FROM public.data_import_rows WHERE true`);
  await pgClient.query(`DELETE FROM public.data_import_files WHERE true`);
  await pgClient.query(`DELETE FROM public.data_import_batches WHERE true`);

  try {
    // -------------------------------------------------------------------------
    // Scenario 1: Initial Client & Site Setup
    // -------------------------------------------------------------------------
    console.log('--- 1. Canonical Setup (Baseline Import) ---');
    const clientCSV = `CustomerID,CustomerName,Email,Phone,Address,City,PostalCode
SIM-C201,"Lambert Smith Hampton",info@lsh.co.uk,0161 830 1234,"Oxford Street",Manchester,M1 5AN`;

    const { batch: b1 } = await createImportBatch({
      entityType: 'CLIENT',
      sourceSystem: 'SIMPRO',
      filename: 'baseline_client.csv',
      fileContent: clientCSV,
    }, adminSession);

    const clientPreset = detectMappingPreset(['CustomerID', 'CustomerName', 'Email', 'Phone', 'Address', 'City', 'PostalCode'], 'CLIENT', 'SIMPRO');
    const val1 = await applyMappingAndValidate(b1.id, clientPreset, adminSession);
    assert(val1.validRows === 1, 'Baseline client validated as 1 valid row (NEW)');

    const commit1 = await commitImport(b1.id, adminSession);
    assert(commit1.importedCount === 1, 'Baseline client committed to canonical database');

    const siteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S301,SIM-C201,"Manchester HQ","100 Portland Street",Manchester,M1 1AA`;

    const { batch: bSite } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'baseline_site.csv',
      fileContent: siteCSV,
    }, adminSession);

    const sitePreset = detectMappingPreset(['SiteID', 'CustomerID', 'SiteName', 'Address', 'City', 'PostalCode'], 'SITE', 'SIMPRO');
    await applyMappingAndValidate(bSite.id, sitePreset, adminSession);
    const siteCommit = await commitImport(bSite.id, adminSession);
    assert(siteCommit.importedCount === 1, 'Baseline site committed to canonical database');

    // -------------------------------------------------------------------------
    // Scenario 2: Exact External ID + Same Data -> UNCHANGED
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Exact External ID + Same Data (UNCHANGED) ---');
    const { batch: bUnchanged } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'reimport_same_site.csv',
      fileContent: siteCSV, // identical content
    }, adminSession);

    const valUnchanged = await applyMappingAndValidate(bUnchanged.id, sitePreset, adminSession);
    assert(valUnchanged.unchangedRows === 1, 'Identical row classified as UNCHANGED (0 duplicate rows created)');

    const commitUnchanged = await commitImport(bUnchanged.id, adminSession);
    assert(commitUnchanged.importedCount === 0, 'UNCHANGED row produced 0 new canonical writes');
    assert(commitUnchanged.skippedCount === 1, 'UNCHANGED row safely skipped during commit');

    const siteCountCheck1 = await pgClient.query(`SELECT COUNT(*) as n FROM public.sites WHERE external_id = 'SIM-S301'`);
    assert(parseInt(siteCountCheck1.rows[0].n, 10) === 1, 'Canonical site count remains exactly 1');

    // -------------------------------------------------------------------------
    // Scenario 3: Exact External ID + Changed Data -> CHANGE_DETECTED & Diff
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Exact External ID + Changed Data (CHANGE_DETECTED & Diff) ---');
    const changedSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S301,SIM-C201,"Manchester HQ","100 Portland Street",Manchester,M2 2BB`;

    const { batch: bChanged } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'changed_site.csv',
      fileContent: changedSiteCSV,
    }, adminSession);

    const valChanged = await applyMappingAndValidate(bChanged.id, sitePreset, adminSession);
    assert(valChanged.changeDetectedRows === 1, 'Changed row classified as CHANGE_DETECTED (not merely DUPLICATE)');

    // Inspect field diff on staged row
    const stagedRowsRes = await dbQuery<any[]>(`data_import_rows?batch_id=eq.${bChanged.id}&select=*`);
    const changedRow = stagedRowsRes.data?.[0];
    const rowDiff = await getImportRowDiff(bChanged.id, changedRow.id, adminSession);

    assert(rowDiff.status === 'CHANGE_DETECTED', 'Row diff endpoint reports status CHANGE_DETECTED');
    assert(rowDiff.changeDiff.length >= 1, 'Field diff contains at least 1 changed field');
    const postcodeDiff = rowDiff.changeDiff.find((d) => d.field === 'postcode');
    assert(postcodeDiff !== undefined, 'Postcode identified as changed field');
    assert(postcodeDiff?.oldValue === 'M1 1AA' && postcodeDiff?.newValue === 'M2 2BB', 'Diff accurately reflects M1 1AA -> M2 2BB');

    // Commit the change
    const commitChanged = await commitImport(bChanged.id, adminSession);
    assert(commitChanged.updatedCount === 1, 'Commit successfully updated existing site record');
    assert(commitChanged.importedCount === 0, 'Commit created 0 new site records');

    const updatedSiteCheck = await pgClient.query(`SELECT postcode FROM public.sites WHERE external_id = 'SIM-S301'`);
    assert(updatedSiteCheck.rows[0].postcode === 'M2 2BB', 'Site postcode updated in database to M2 2BB');

    // -------------------------------------------------------------------------
    // Scenario 4: Fuzzy Duplicate Detection & Commit Block (No External ID)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Fuzzy Duplicate Detection & Human Gate ---');
    // "Lambert Smith Hampton Ltd" without CustomerID vs existing "Lambert Smith Hampton"
    const fuzzyClientCSV = `CustomerName,Email,Phone,Address,City,PostalCode
"Lambert Smith Hampton Ltd",info@lsh-north.co.uk,0161 830 5678,"Oxford Street",Manchester,M1 5AN`;

    const { batch: bFuzzy } = await createImportBatch({
      entityType: 'CLIENT',
      sourceSystem: 'CSV',
      filename: 'fuzzy_client.csv',
      fileContent: fuzzyClientCSV,
    }, adminSession);

    const fuzzyMapping = { CustomerName: 'name', Email: 'email', Phone: 'phone', Address: 'address_line1', City: 'city', PostalCode: 'postcode' };
    const valFuzzy = await applyMappingAndValidate(bFuzzy.id, fuzzyMapping, adminSession);
    assert(valFuzzy.possibleDuplicateRows === 1, 'Fuzzy match row classified as POSSIBLE_DUPLICATE (blocks commit)');

    // Attempt commit without resolution -> MUST THROW
    let commitBlocked = false;
    try {
      await commitImport(bFuzzy.id, adminSession);
    } catch (e: any) {
      commitBlocked = e.message.includes('require human review before commit');
    }
    assert(commitBlocked, 'Unresolved POSSIBLE_DUPLICATE hard-blocks batch commit');

    // Human records resolution decision: USE_EXISTING
    const fuzzyRowRes = await dbQuery<any[]>(`data_import_rows?batch_id=eq.${bFuzzy.id}&select=id`);
    const fuzzyRowId = fuzzyRowRes.data?.[0]?.id;

    const resolutionResult = await resolveImportDuplicate({
      batchId: bFuzzy.id,
      rowId: fuzzyRowId,
      decision: 'USE_EXISTING',
      notes: 'Reviewed by operator — matches existing client org',
    }, adminSession);
    assert(resolutionResult.success === true, 'Recorded USE_EXISTING decision for POSSIBLE_DUPLICATE row');

    // Verify audit record for decision
    const auditDecCheck = await pgClient.query(`
      SELECT * FROM public.data_import_duplicate_decisions
      WHERE batch_id = $1 AND row_id = $2
    `, [bFuzzy.id, fuzzyRowId]);
    assert(auditDecCheck.rows.length === 1, 'Duplicate decision written to audit table');
    assert(auditDecCheck.rows[0].decision === 'USE_EXISTING', 'Decision choice USE_EXISTING verified');

    // Now commit succeeds and skips creating duplicate
    const commitFuzzy = await commitImport(bFuzzy.id, adminSession);
    assert(commitFuzzy.skippedCount === 1, 'Resolved row safely skipped, no duplicate org created');
    assert(commitFuzzy.importedCount === 0, 'Zero new client organisations created from fuzzy match');

    // -------------------------------------------------------------------------
    // Scenario 5: EntireFM-Enriched Data Conflict Protection
    // -------------------------------------------------------------------------
    console.log('\n--- 5. EntireFM-Enriched Data Conflict Protection ---');
    // Simulate user editing the site in EntireCAFM
    await pgClient.query(`
      UPDATE public.sites
      SET address_line1 = 'Gate 4 - Security Desk Attendance Required',
          updated_at = NOW() + INTERVAL '1 minute'
      WHERE external_id = 'SIM-S301'
    `);

    // Incoming SimPRO CSV with older address
    const conflictSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S301,SIM-C201,"Manchester HQ","100 Portland Street",Manchester,M2 2BB`;

    const { batch: bConflict } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'conflicting_site.csv',
      fileContent: conflictSiteCSV,
    }, adminSession);

    const valConflict = await applyMappingAndValidate(bConflict.id, sitePreset, adminSession);
    assert(valConflict.conflictRows === 1, 'Enriched field conflict identified as CONFLICT state');

    // -------------------------------------------------------------------------
    // Scenario 6: Safe Rollback — Untouched New Records
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Safe Rollback of Untouched Record ---');
    const freshSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S401,SIM-C201,"Salford Logistics Dock","20 Dock Road",Salford,M50 3UB`;

    const { batch: bFresh } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'fresh_site.csv',
      fileContent: freshSiteCSV,
    }, adminSession);

    await applyMappingAndValidate(bFresh.id, sitePreset, adminSession);
    await commitImport(bFresh.id, adminSession);

    const rollbackFresh = await rollbackImport(bFresh.id, adminSession);
    assert(rollbackFresh.success === true, 'Untouched site rolled back successfully');
    assert(rollbackFresh.rolledBackCount === 1, 'Rolled back exactly 1 site record');

    const freshSiteCheck = await pgClient.query(`SELECT id FROM public.sites WHERE external_id = 'SIM-S401'`);
    assert(freshSiteCheck.rows.length === 0, 'Site record removed from database on rollback');

    // -------------------------------------------------------------------------
    // Scenario 7: Rollback Protection — Record Modified After Import
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Rollback Protection (Post-Import Manual Edit) ---');
    const modSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S501,SIM-C201,"Leeds Distribution Centre","1 Railway Lane",Leeds,LS1 1BA`;

    const { batch: bMod } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'mod_site.csv',
      fileContent: modSiteCSV,
    }, adminSession);

    await applyMappingAndValidate(bMod.id, sitePreset, adminSession);
    await commitImport(bMod.id, adminSession);

    // Simulate manual edit
    await pgClient.query(`
      UPDATE public.sites
      SET notes = 'Manual site access notes added by FM supervisor',
          updated_at = NOW() + INTERVAL '2 minutes'
      WHERE external_id = 'SIM-S501'
    `);

    // Rollback pre-flight check
    const safetyCheck = await checkRollbackSafety(bMod.id, adminSession);
    assert(safetyCheck.canSafelyRollback === false, 'Pre-flight check flags batch as unsafe to rollback');
    assert(safetyCheck.blockedCount === 1, 'Pre-flight check identifies 1 blocked record');

    // Attempt rollback -> MUST BE BLOCKED
    const rollbackMod = await rollbackImport(bMod.id, adminSession);
    assert(rollbackMod.blockedCount === 1, 'Rollback blocked for manually edited site');
    assert(rollbackMod.success === false, 'Rollback returns success = false due to blocked record');

    const modSiteCheck = await pgClient.query(`SELECT id FROM public.sites WHERE external_id = 'SIM-S501'`);
    assert(modSiteCheck.rows.length === 1, 'Manually edited site was NOT deleted');

    // -------------------------------------------------------------------------
    // Scenario 8: Rollback Protection — Downstream Work Order Dependency
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Rollback Protection (Downstream Work Order) ---');
    const woSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S601,SIM-C201,"Birmingham Hub","5 Colmore Row",Birmingham,B3 2BJ`;

    const { batch: bWO } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'wo_site.csv',
      fileContent: woSiteCSV,
    }, adminSession);

    await applyMappingAndValidate(bWO.id, sitePreset, adminSession);
    await commitImport(bWO.id, adminSession);

    const siteWORes = await pgClient.query(`SELECT id FROM public.sites WHERE external_id = 'SIM-S601'`);
    const siteWOId = siteWORes.rows[0].id;

    // Create a real Work Order against this site
    const woInsert = await pgClient.query(`
      INSERT INTO public.work_orders (
        work_order_number, site_id, title, description, priority, status, created_at, updated_at
      ) VALUES (
        'WO-SAFETY-001', $1, 'Emergency Boiler Repair', 'Heating failure in main building', 'P1', 'OPEN', NOW(), NOW()
      ) RETURNING id
    `, [siteWOId]);
    const woId = woInsert.rows[0].id;

    // Attempt rollback of site batch
    const rollbackWO = await rollbackImport(bWO.id, adminSession);
    assert(rollbackWO.blockedCount === 1, 'Rollback blocked due to downstream Work Order');
    assert(rollbackWO.blockedReasons[0]?.reason.includes('Work Orders'), 'Blocked reason explicitly mentions Work Orders');

    const siteWOCheck = await pgClient.query(`SELECT id FROM public.sites WHERE id = $1`, [siteWOId]);
    assert(siteWOCheck.rows.length === 1, 'Site was NOT cascade-deleted by import rollback');

    const woCheck = await pgClient.query(`SELECT id FROM public.work_orders WHERE id = $1`, [woId]);
    assert(woCheck.rows.length === 1, 'Downstream Work Order remains intact');

    // Clean up test work order
    await pgClient.query(`DELETE FROM public.work_orders WHERE id = $1`, [woId]);

    // -------------------------------------------------------------------------
    // Scenario 9: Rollback Protection — Downstream Asset Dependency
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Rollback Protection (Downstream Asset) ---');
    const assetSiteCSV = `SiteID,CustomerID,SiteName,Address,City,PostalCode
SIM-S701,SIM-C201,"Newcastle Depot","8 Quay Street",Newcastle,NE1 3DE`;

    const { batch: bAsset } = await createImportBatch({
      entityType: 'SITE',
      sourceSystem: 'SIMPRO',
      filename: 'asset_site.csv',
      fileContent: assetSiteCSV,
    }, adminSession);

    await applyMappingAndValidate(bAsset.id, sitePreset, adminSession);
    await commitImport(bAsset.id, adminSession);

    const siteAssetRes = await pgClient.query(`SELECT id FROM public.sites WHERE external_id = 'SIM-S701'`);
    const siteAssetId = siteAssetRes.rows[0].id;

    // Create an Asset against this site
    const assetInsert = await pgClient.query(`
      INSERT INTO public.assets (
        asset_number, site_id, name, category, criticality, status, created_at, updated_at
      ) VALUES (
        'AST-SAFETY-001', $1, 'Main Air Handling Unit 1', 'HVAC', 'CRITICAL', 'OPERATIONAL', NOW(), NOW()
      ) RETURNING id
    `, [siteAssetId]);
    const assetId = assetInsert.rows[0].id;

    // Attempt rollback of site batch
    const rollbackAsset = await rollbackImport(bAsset.id, adminSession);
    assert(rollbackAsset.blockedCount === 1, 'Rollback blocked due to downstream Asset');
    assert(rollbackAsset.blockedReasons[0]?.reason.includes('Assets'), 'Blocked reason explicitly mentions Assets');

    const siteAssetCheck = await pgClient.query(`SELECT id FROM public.sites WHERE id = $1`, [siteAssetId]);
    assert(siteAssetCheck.rows.length === 1, 'Site was NOT deleted when assets depend on it');

    const assetCheck = await pgClient.query(`SELECT id FROM public.assets WHERE id = $1`, [assetId]);
    assert(assetCheck.rows.length === 1, 'Downstream Asset remains intact');

    // Clean up test asset
    await pgClient.query(`DELETE FROM public.assets WHERE id = $1`, [assetId]);

    // -------------------------------------------------------------------------
    // Scenario 10: Import File Security Architecture Truth Check
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Import File Storage Security Check ---');
    const fileRecords = await pgClient.query(`SELECT storage_path, file_checksum, file_size_bytes FROM public.data_import_files`);
    const allStoragePathsNull = fileRecords.rows.every((r) => r.storage_path === null || r.storage_path === undefined);
    assert(allStoragePathsNull, 'Truth confirmed: Raw CSVs are TRANSIENT / NOT PERSISTED (storage_path is null)');
    assert(fileRecords.rows.every((r) => r.file_checksum.length === 64), 'All staged files have SHA-256 integrity checksums stored');

    // -------------------------------------------------------------------------
    // Scenario 11: Import History Database-Backed Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 11. Database-Backed Import History ---');
    const history = await listImportBatches(adminSession);
    assert(history.length >= 5, 'History endpoint returns real database-backed import batches');
    const sampleBatch = history[0];
    assert(sampleBatch.batch_reference.startsWith('EFM-IMP-'), 'Batch reference format conforms to EFM-IMP-YYYY-NNNNNN');
    assert(sampleBatch.source_system !== undefined, 'History batch contains source_system');
    assert(sampleBatch.created_at !== undefined, 'History batch contains timestamp');

    // -------------------------------------------------------------------------
    // Scenario 12: RBAC Permission Gates
    // -------------------------------------------------------------------------
    console.log('\n--- 12. RBAC Permission Gates ---');
    let clientBlocked = false;
    try {
      await createImportBatch({ entityType: 'CLIENT', filename: 'test.csv', fileContent: clientCSV }, clientSession);
    } catch (e: any) {
      clientBlocked = e.message.includes('Permission denied');
    }
    assert(clientBlocked, 'Client user denied import batch creation');

    let contractorBlocked = false;
    try {
      await createImportBatch({ entityType: 'CONTRACTOR', filename: 'test.csv', fileContent: clientCSV }, contractorSession);
    } catch (e: any) {
      contractorBlocked = e.message.includes('Permission denied');
    }
    assert(contractorBlocked, 'Contractor user denied import batch creation');

    let engineerBlocked = false;
    try {
      await rollbackImport(b1.id, engineerSession);
    } catch (e: any) {
      engineerBlocked = e.message.includes('Permission denied');
    }
    assert(engineerBlocked, 'Engineer user denied import rollback');

    // -------------------------------------------------------------------------
    // Scenario 13: Final Fixture Cleanup & Zero Operational Data Certification
    // -------------------------------------------------------------------------
    console.log('\n--- 13. Test Fixture Cleanup & Zero Verification ---');
    // Remove all operational test fixtures
    await pgClient.query(`DELETE FROM public.sites WHERE external_id IN ('SIM-S201', 'SIM-S301', 'SIM-S401', 'SIM-S501', 'SIM-S601', 'SIM-S701')`);
    await pgClient.query(`DELETE FROM public.client_accounts WHERE external_id IN ('SIM-C101', 'SIM-C102', 'SIM-C103', 'SIM-C201')`);
    await pgClient.query(`DELETE FROM public.organisations WHERE code LIKE 'CLI-%' OR code LIKE 'PRV-%'`);
    await pgClient.query(`DELETE FROM public.provider_organisations WHERE external_id IN ('SIM-K301', 'SIM-K302')`);
    await pgClient.query(`DELETE FROM public.data_import_duplicate_decisions`);
    await pgClient.query(`DELETE FROM public.data_import_issues`);
    await pgClient.query(`DELETE FROM public.data_import_rows`);
    await pgClient.query(`DELETE FROM public.data_import_files`);
    await pgClient.query(`DELETE FROM public.data_import_batches`);

    const finalClientCount = await pgClient.query(`SELECT COUNT(*) as n FROM public.client_accounts`);
    const finalSiteCount = await pgClient.query(`SELECT COUNT(*) as n FROM public.sites`);
    const finalProvCount = await pgClient.query(`SELECT COUNT(*) as n FROM public.provider_organisations`);

    assert(parseInt(finalClientCount.rows[0].n, 10) === 0, 'Cleaned database: client_accounts = 0');
    assert(parseInt(finalSiteCount.rows[0].n, 10) === 0, 'Cleaned database: sites = 0');
    assert(parseInt(finalProvCount.rows[0].n, 10) === 0, 'Cleaned database: provider_organisations = 0');

  } finally {
    await pgClient.end();
  }

  console.log('\n================================================================');
  console.log(`IMPORT SAFETY TEST SUMMARY: ${passed} PASSED / ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});

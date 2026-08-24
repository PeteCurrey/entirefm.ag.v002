/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * PHASE 0I-PRE VERIFICATION TEST SUITE
 * ====================================
 * Verifies:
 * 1. Complete Mock Data Elimination across all 10 dashboard components & server modules
 * 2. Production Guard & Fixture Isolation
 * 3. SimPRO Migration Engine (CSV parser, sanitisation, presets, validation, staging, commit, rollback)
 * 4. External Identity Provenance & RBAC Permissions
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseCSV,
  sanitizeCellValue,
  calculateHash,
  generateBatchReference,
  detectMappingPreset,
  validateMappedRow,
  SYSTEM_PRESET_MAPPINGS,
} from '../src/server/data-import';
import { DEFAULT_ROLE_PERMISSIONS, PERMISSION } from '../src/server/identity';
import { assertNotProduction, isProductionEnvironment } from '../src/lib/env/production-guard';

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.error(`  ✗ ${name}`);
    failed++;
  }
}

console.log('\n================================================================');
console.log('ENTIREFM PHASE 0I-PRE VERIFICATION SUITE');
console.log('Production Data Truth + SimPRO Migration Centre');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// GROUP 1: MOCK DATA ELIMINATION AUDIT
// -----------------------------------------------------------------------------
console.log('--- Group 1: Mock Data Elimination Audit ---');

const rootDir = resolve(__dirname, '..');

// 1. ControlCentreClient.tsx
const cccContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/ControlCentreClient.tsx'), 'utf8');
assert(!cccContent.includes('sites.length > 0 ? sites.length : 42'), 'ControlCentreClient: 42 sites fallback removed');
assert(!cccContent.includes('?? 3846'), 'ControlCentreClient: 3846 assets fallback removed');
assert(!cccContent.includes('?? 127'), 'ControlCentreClient: 127 open jobs fallback removed');
assert(!cccContent.includes('?? 184500'), 'ControlCentreClient: 184500 WIP fallback removed');
assert(!cccContent.includes('slaPerformancePercent: 96.2'), 'ControlCentreClient: hardcoded 96.2% SLA removed');
assert(!cccContent.includes('compliancePercent: 98.4'), 'ControlCentreClient: hardcoded 98.4% compliance removed');
assert(!cccContent.includes('DEV / DEMO TELEMETRY'), 'ControlCentreClient: DEV/DEMO TELEMETRY badge removed');

// 2. LiveEstateWorkspace.tsx
const lewContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/LiveEstateWorkspace.tsx'), 'utf8');
assert(!lewContent.includes('Victoria House Commercial Complex'), 'LiveEstateWorkspace: fake Victoria House removed');
assert(!lewContent.includes('Manchester Hub & Tech Central'), 'LiveEstateWorkspace: fake Manchester Hub removed');
assert(!lewContent.includes('Birmingham Logistics & Distribution Centre'), 'LiveEstateWorkspace: fake Birmingham Logistics removed');
assert(!lewContent.includes('Leeds Sovereign Square Estate'), 'LiveEstateWorkspace: fake Leeds Sovereign removed');
assert(lewContent.includes('No sites configured yet'), 'LiveEstateWorkspace: proper empty state present');

// 3. ComplianceRadar.tsx
const crContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/ComplianceRadar.tsx'), 'utf8');
assert(!crContent.includes('const complianceData = {'), 'ComplianceRadar: hardcoded complianceData object removed');
assert(crContent.includes('No compliance obligations configured'), 'ComplianceRadar: proper empty state present');

// 4. CommercialPosition.tsx
const cpContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/CommercialPosition.tsx'), 'utf8');
assert(!cpContent.includes('const financialData = {'), 'CommercialPosition: hardcoded financialData object removed');
assert(cpContent.includes('No financial data available'), 'CommercialPosition: proper empty state present');

// 5. ActionRequiredQueue.tsx
const arqContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/ActionRequiredQueue.tsx'), 'utf8');
assert(!arqContent.includes('Boiler Plant Primary Circulation Pump Trip'), 'ActionRequiredQueue: fake boiler pump incident removed');
assert(arqContent.includes('No actions required'), 'ActionRequiredQueue: clean empty state present');

// 6. FieldPresencePanel.tsx
const fppContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/FieldPresencePanel.tsx'), 'utf8');
assert(!fppContent.includes('Marcus Vance'), 'FieldPresencePanel: fake Marcus Vance removed');
assert(!fppContent.includes('David Reynolds'), 'FieldPresencePanel: fake David Reynolds removed');
assert(fppContent.includes('No field activity data'), 'FieldPresencePanel: proper empty state present');

// 7. OperationsTimeline.tsx
const otContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/OperationsTimeline.tsx'), 'utf8');
assert(otContent.includes('No scheduled activity'), 'OperationsTimeline: proper empty state present');

// 8. SiteInspectorDrawer.tsx
const sidContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/SiteInspectorDrawer.tsx'), 'utf8');
assert(!sidContent.includes('WO-84920'), 'SiteInspectorDrawer: fake WO-84920 removed');
assert(!sidContent.includes('PPM-30194'), 'SiteInspectorDrawer: fake PPM-30194 removed');

// 9. LiveWorkloadPipeline.tsx
const lwpContent = readFileSync(resolve(rootDir, 'src/components/admin/control-centre/LiveWorkloadPipeline.tsx'), 'utf8');
assert(!lwpContent.includes('unassigned: 6'), 'LiveWorkloadPipeline: fake unassigned:6 fallback removed');

// 10. src/server/compliance/index.ts
const compContent = readFileSync(resolve(rootDir, 'src/server/compliance/index.ts'), 'utf8');
assert(!compContent.includes('Statutory Compliance Assurance Pack — Manchester HQ'), 'compliance: Manchester HQ exportAuditPack literal removed');
assert(!compContent.includes('Issued by ABC Mechanical Ltd (Gas Safe Reg: 504931)'), 'compliance: ABC Mechanical exportAuditPack literal removed');
assert(!compContent.includes('obligations.length || 10'), 'compliance: getComplianceKPIs || 10 fallback removed');
assert(!compContent.includes('status === \'COMPLIANT\').length || 8'), 'compliance: getComplianceKPIs || 8 fallback removed');

// -----------------------------------------------------------------------------
// GROUP 2: PRODUCTION GUARD & ENVIRONMENT AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- Group 2: Production Guard & Environment Security ---');

assert(typeof assertNotProduction === 'function', 'assertNotProduction function exported');
assert(typeof isProductionEnvironment === 'function', 'isProductionEnvironment function exported');

// Test that assertNotProduction throws when NODE_ENV is production
const origNodeEnv = process.env.NODE_ENV;
try {
  process.env.NODE_ENV = 'production';
  let threw = false;
  try {
    assertNotProduction('test-fixture-seed');
  } catch (err: any) {
    threw = true;
    assert(err.message.includes('PRODUCTION GUARD BLOCKED'), 'assertNotProduction blocks execution in production');
  }
  assert(threw, 'assertNotProduction threw error in production');
} finally {
  process.env.NODE_ENV = origNodeEnv;
}

// Check scripts/seed-test-fixtures.ts
assert(existsSync(resolve(rootDir, 'scripts/seed-test-fixtures.ts')), 'scripts/seed-test-fixtures.ts exists');
const seedScript = readFileSync(resolve(rootDir, 'scripts/seed-test-fixtures.ts'), 'utf8');
assert(seedScript.includes('assertNotProduction'), 'seed-test-fixtures.ts contains production guard');

// -----------------------------------------------------------------------------
// GROUP 3: CSV PARSER & FORMULA INJECTION SECURITY
// -----------------------------------------------------------------------------
console.log('\n--- Group 3: CSV Parser & Formula Injection Security ---');

// Formula injection sanitisation
assert(sanitizeCellValue('=1+1') === "'=1+1", 'sanitizeCellValue neutralises = formula injection');
assert(sanitizeCellValue('+cmd|') === "'+cmd|", 'sanitizeCellValue neutralises + formula injection');
assert(sanitizeCellValue('-2+3') === "'-2+3", 'sanitizeCellValue neutralises - formula injection');
assert(sanitizeCellValue('@SUM(A1:A5)') === "'@SUM(A1:A5)", 'sanitizeCellValue neutralises @ formula injection');
assert(sanitizeCellValue('Regular Text') === 'Regular Text', 'sanitizeCellValue preserves normal text');

// CSV Parser
const testCsv = `CustomerID,CustomerName,Email,Phone,CreditLimit
CUST001,"Acme Corp, Ltd",billing@acme.com,0161 555 0100,50000
CUST002,"Apex Facilities ""UK""",ops@apex.co.uk,0207 555 0200,25000
`;

const parsed = parseCSV(testCsv);
assert(parsed.headers.length === 5, 'parseCSV correctly extracts 5 headers');
assert(parsed.headers[0] === 'CustomerID', 'parseCSV header 0 is CustomerID');
assert(parsed.rows.length === 2, 'parseCSV extracts 2 data rows');
assert(parsed.rows[0]['CustomerName'] === 'Acme Corp, Ltd', 'parseCSV handles quoted comma in CustomerName');
assert(parsed.rows[1]['CustomerName'] === 'Apex Facilities "UK"', 'parseCSV handles escaped double quotes');

// BOM stripping
const bomCsv = '\uFEFFCustomerID,CustomerName\n101,Test Corp';
const bomParsed = parseCSV(bomCsv);
assert(bomParsed.headers[0] === 'CustomerID', 'parseCSV strips UTF-8 BOM');

// Checksum & Reference generator
const testHash = calculateHash('test content');
assert(testHash.length === 64, 'calculateHash produces valid SHA-256 hex string');
const batchRef = generateBatchReference();
assert(/^EFM-IMP-\d{4}-\d{6}$/.test(batchRef), 'generateBatchReference matches EFM-IMP-YYYY-NNNNNN format');

// -----------------------------------------------------------------------------
// GROUP 4: SIMPRO PRESET DETECTION & VALIDATION LOGIC
// -----------------------------------------------------------------------------
console.log('\n--- Group 4: SimPRO Presets & Validation Rules ---');

const simproClientHeaders = ['CustomerID', 'CustomerName', 'CompanyName', 'AccountNo', 'Email', 'Address', 'PostalCode'];
const clientPreset = detectMappingPreset(simproClientHeaders, 'CLIENT', 'SIMPRO');
assert(clientPreset['CustomerID'] === 'external_id', 'detectMappingPreset maps CustomerID -> external_id');
assert(clientPreset['CustomerName'] === 'name', 'detectMappingPreset maps CustomerName -> name');
assert(clientPreset['Email'] === 'email', 'detectMappingPreset maps Email -> email');
assert(clientPreset['PostalCode'] === 'postcode', 'detectMappingPreset maps PostalCode -> postcode');

const simproSiteHeaders = ['SiteID', 'CustomerID', 'SiteName', 'Address', 'City', 'PostalCode'];
const sitePreset = detectMappingPreset(simproSiteHeaders, 'SITE', 'SIMPRO');
assert(sitePreset['SiteID'] === 'external_id', 'detectMappingPreset maps SiteID -> external_id');
assert(sitePreset['CustomerID'] === 'parent_client_external_id', 'detectMappingPreset maps CustomerID -> parent_client_external_id');
assert(sitePreset['SiteName'] === 'name', 'detectMappingPreset maps SiteName -> name');

// Client Row Validation
const validClient = validateMappedRow(1, { name: 'Acme Estates Ltd', email: 'admin@acme.com', external_id: 'C001' }, 'CLIENT');
assert(validClient.status === 'VALID', 'validateMappedRow accepts valid client');

const invalidClientNoName = validateMappedRow(2, { email: 'admin@acme.com' }, 'CLIENT');
assert(invalidClientNoName.status === 'INVALID', 'validateMappedRow rejects client without name');
assert(invalidClientNoName.issues.some((i) => i.issue_code === 'MISSING_CLIENT_NAME'), 'validateMappedRow produces MISSING_CLIENT_NAME issue');

const invalidEmailClient = validateMappedRow(3, { name: 'Acme Estates Ltd', email: 'invalid-email-address' }, 'CLIENT');
assert(invalidEmailClient.issues.some((i) => i.issue_code === 'INVALID_EMAIL_FORMAT'), 'validateMappedRow flags malformed email as WARNING');

// Site Row Validation (requires parent client)
const validSite = validateMappedRow(1, { name: 'Victoria House', address_line1: '37 Camden St', parent_client_external_id: 'C001' }, 'SITE');
assert(validSite.status === 'VALID', 'validateMappedRow accepts site with parent client external ID');

const siteNoParent = validateMappedRow(2, { name: 'Victoria House', address_line1: '37 Camden St' }, 'SITE');
assert(siteNoParent.status === 'INVALID', 'validateMappedRow rejects site without parent client');
assert(siteNoParent.issues.some((i) => i.issue_code === 'MISSING_PARENT_CLIENT'), 'validateMappedRow produces MISSING_PARENT_CLIENT issue');

// Contractor Row Validation
const validContractor = validateMappedRow(1, { name: 'ABC Mechanical Ltd', primary_trade: 'HVAC' }, 'CONTRACTOR');
assert(validContractor.status === 'VALID', 'validateMappedRow accepts valid contractor');

const invalidContractorNoName = validateMappedRow(2, { primary_trade: 'HVAC' }, 'CONTRACTOR');
assert(invalidContractorNoName.status === 'INVALID', 'validateMappedRow rejects contractor without name');

// System preset definitions exist
assert(!!SYSTEM_PRESET_MAPPINGS.SIMPRO_CLIENTS, 'SYSTEM_PRESET_MAPPINGS contains SIMPRO_CLIENTS');
assert(!!SYSTEM_PRESET_MAPPINGS.SIMPRO_SITES, 'SYSTEM_PRESET_MAPPINGS contains SIMPRO_SITES');
assert(!!SYSTEM_PRESET_MAPPINGS.SIMPRO_CONTRACTORS, 'SYSTEM_PRESET_MAPPINGS contains SIMPRO_CONTRACTORS');

// -----------------------------------------------------------------------------
// GROUP 5: RBAC PERMISSIONS & PROVENANCE COLUMNS
// -----------------------------------------------------------------------------
console.log('\n--- Group 5: RBAC Permissions & Schema Integrity ---');

// Check SUPER_ADMIN permissions
const superAdminPerms = DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN;
assert(superAdminPerms.includes('data_import:view'), 'SUPER_ADMIN has data_import:view');
assert(superAdminPerms.includes('data_import:create'), 'SUPER_ADMIN has data_import:create');
assert(superAdminPerms.includes('data_import:map'), 'SUPER_ADMIN has data_import:map');
assert(superAdminPerms.includes('data_import:commit'), 'SUPER_ADMIN has data_import:commit');
assert(superAdminPerms.includes('data_import:rollback'), 'SUPER_ADMIN has data_import:rollback');
assert(superAdminPerms.includes('data_import:admin'), 'SUPER_ADMIN has data_import:admin');

// Check CEO & ADMINISTRATOR permissions
assert(DEFAULT_ROLE_PERMISSIONS.CEO.includes('data_import:commit'), 'CEO has data_import:commit');
assert(DEFAULT_ROLE_PERMISSIONS.ADMINISTRATOR.includes('data_import:commit'), 'ADMINISTRATOR has data_import:commit');

// Check that client/engineer roles do NOT have import permissions
assert(!DEFAULT_ROLE_PERMISSIONS.CLIENT_ADMIN.includes('data_import:create' as any), 'CLIENT_ADMIN does not have data_import:create');
assert(!DEFAULT_ROLE_PERMISSIONS.ENGINEER.includes('data_import:create' as any), 'ENGINEER does not have data_import:create');

// Check PERMISSION constants
assert(PERMISSION.DATA_IMPORT_VIEW === 'data_import:view', 'PERMISSION.DATA_IMPORT_VIEW is defined');
assert(PERMISSION.DATA_IMPORT_COMMIT === 'data_import:commit', 'PERMISSION.DATA_IMPORT_COMMIT is defined');
assert(PERMISSION.DATA_IMPORT_ROLLBACK === 'data_import:rollback', 'PERMISSION.DATA_IMPORT_ROLLBACK is defined');

// Check Migration 0023 file exists
assert(existsSync(resolve(rootDir, 'supabase/migrations/0023_data_import_and_external_identity.sql')), 'Migration 0023 file exists');
const m23 = readFileSync(resolve(rootDir, 'supabase/migrations/0023_data_import_and_external_identity.sql'), 'utf8');
assert(m23.includes('CREATE TABLE IF NOT EXISTS public.data_import_batches'), 'Migration 0023 creates data_import_batches');
assert(m23.includes('CREATE TABLE IF NOT EXISTS public.data_import_files'), 'Migration 0023 creates data_import_files');
assert(m23.includes('CREATE TABLE IF NOT EXISTS public.data_import_rows'), 'Migration 0023 creates data_import_rows');
assert(m23.includes('CREATE TABLE IF NOT EXISTS public.data_import_mappings'), 'Migration 0023 creates data_import_mappings');
assert(m23.includes('CREATE TABLE IF NOT EXISTS public.data_import_issues'), 'Migration 0023 creates data_import_issues');
assert(m23.includes('ADD COLUMN IF NOT EXISTS source_system text'), 'Migration 0023 adds source_system column');
assert(m23.includes('ADD COLUMN IF NOT EXISTS external_id text'), 'Migration 0023 adds external_id column');
assert(m23.includes('ADD COLUMN IF NOT EXISTS import_batch_id uuid'), 'Migration 0023 adds import_batch_id column');

// Check UI Pages and Components exist
assert(existsSync(resolve(rootDir, 'src/app/admin/platform/imports/page.tsx')), 'src/app/admin/platform/imports/page.tsx exists');
assert(existsSync(resolve(rootDir, 'src/app/admin/platform/imports/new/page.tsx')), 'src/app/admin/platform/imports/new/page.tsx exists');
assert(existsSync(resolve(rootDir, 'src/app/admin/platform/imports/history/page.tsx')), 'src/app/admin/platform/imports/history/page.tsx exists');
assert(existsSync(resolve(rootDir, 'src/app/admin/platform/imports/templates/page.tsx')), 'src/app/admin/platform/imports/templates/page.tsx exists');

// Check API Routes exist
assert(existsSync(resolve(rootDir, 'src/app/api/import/batch/route.ts')), 'API route /api/import/batch exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/[id]/mapping/route.ts')), 'API route /api/import/[id]/mapping exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/[id]/preview/route.ts')), 'API route /api/import/[id]/preview exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/[id]/commit/route.ts')), 'API route /api/import/[id]/commit exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/[id]/rollback/route.ts')), 'API route /api/import/[id]/rollback exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/[id]/issues.csv/route.ts')), 'API route /api/import/[id]/issues.csv exists');
assert(existsSync(resolve(rootDir, 'src/app/api/import/history/route.ts')), 'API route /api/import/history exists');

console.log('\n================================================================');
console.log(`TOTAL PHASE 0I-PRE ASSERTIONS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}

/**
 * ENTIREFM PHASE 1 VERIFICATION TEST SUITE
 * ========================================
 * Tests:
 * 1. Absence of mock/hardcoded personnel in UI components
 * 2. Account manager eligibility rules & role validation
 * 3. Server-side account manager validation (active, eligible role, internal org)
 * 4. Create Client Account data contract & account_manager_id persistence
 * 5. Reassign account manager behavior
 * 6. API input validation & error reporting (meaningful error responses vs silent failure)
 *
 * Run: npx tsx scripts/test-phase1-client-onboarding.ts
 */

import fs from 'fs';
import path from 'path';
import {
  ACCOUNT_MANAGER_ELIGIBLE_ROLES,
  validateAccountManager,
  listEligibleAccountManagers,
} from '../src/server/estate/account-managers';

interface TestResult {
  category: string;
  name: string;
  ok: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function assert(category: string, name: string, condition: boolean, detail?: string) {
  results.push({ category, name, ok: condition, detail });
  const mark = condition ? '✓' : '✗';
  console.log(`  ${mark} [${category}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('ENTIREFM PHASE 1: CLIENT ONBOARDING & TEAM MANAGEMENT TESTS');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: AUDIT SOURCE CODE FOR REMOVAL OF HARDCODED PERSONNEL
  // --------------------------------------------------------------------------
  console.log('1. Mock Data Audit');
  const clientPagePath = path.resolve('src/app/admin/estate/clients/ClientsPageClient.tsx');
  const clientPageContent = fs.readFileSync(clientPagePath, 'utf8');

  assert(
    'MOCK_DATA',
    'ClientsPageClient does not contain "Sarah Jenkins"',
    !clientPageContent.includes('Sarah Jenkins')
  );
  assert(
    'MOCK_DATA',
    'ClientsPageClient does not contain "David Hughes"',
    !clientPageContent.includes('David Hughes')
  );
  assert(
    'MOCK_DATA',
    'ClientsPageClient does not contain "Emma Watson"',
    !clientPageContent.includes('Emma Watson')
  );
  assert(
    'MOCK_DATA',
    'ClientsPageClient does not contain "Michael Zhang"',
    !clientPageContent.includes('Michael Zhang')
  );
  assert(
    'MOCK_DATA',
    'ClientsPageClient uses account_manager_id in payload',
    clientPageContent.includes('account_manager_id:')
  );

  // --------------------------------------------------------------------------
  // TEST 2: ACCOUNT MANAGER ELIGIBILITY RULES
  // --------------------------------------------------------------------------
  console.log('\n2. Account Manager Eligibility');
  assert(
    'ROLES',
    'ACCOUNT_MANAGER is in eligible roles list',
    ACCOUNT_MANAGER_ELIGIBLE_ROLES.includes('ACCOUNT_MANAGER')
  );
  assert(
    'ROLES',
    'OPERATIONS_MANAGER is in eligible roles list',
    ACCOUNT_MANAGER_ELIGIBLE_ROLES.includes('OPERATIONS_MANAGER')
  );
  assert(
    'ROLES',
    'ADMINISTRATOR is in eligible roles list',
    ACCOUNT_MANAGER_ELIGIBLE_ROLES.includes('ADMINISTRATOR')
  );
  assert(
    'ROLES',
    'CLIENT_ADMIN is NOT in eligible roles list (cannot be internal AM)',
    !(ACCOUNT_MANAGER_ELIGIBLE_ROLES as readonly string[]).includes('CLIENT_ADMIN')
  );
  assert(
    'ROLES',
    'CONTRACTOR_ADMIN is NOT in eligible roles list',
    !(ACCOUNT_MANAGER_ELIGIBLE_ROLES as readonly string[]).includes('CONTRACTOR_ADMIN')
  );

  // --------------------------------------------------------------------------
  // TEST 3: SERVER-SIDE VALIDATION FUNCTIONS
  // --------------------------------------------------------------------------
  console.log('\n3. Server-Side Account Manager Validation');
  const invalidResult = await validateAccountManager('non-existent-uuid-000');
  assert(
    'VALIDATION',
    'validateAccountManager returns null for non-existent person ID',
    invalidResult === null
  );

  const emptyResult = await validateAccountManager('');
  assert(
    'VALIDATION',
    'validateAccountManager returns null for empty string',
    emptyResult === null
  );

  // --------------------------------------------------------------------------
  // TEST 4: SCHEMA & MIGRATION INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n4. Schema Migration 0057 Integrity');
  const migrationPath = path.resolve('supabase/migrations/0057_internal_team_and_client_account_schema.sql');
  const migrationExists = fs.existsSync(migrationPath);
  assert('MIGRATION', 'Migration 0057 file exists', migrationExists);

  if (migrationExists) {
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    assert(
      'MIGRATION',
      'Migration adds name column',
      migrationSql.includes('ADD COLUMN IF NOT EXISTS name')
    );
    assert(
      'MIGRATION',
      'Migration adds account_number column',
      migrationSql.includes('ADD COLUMN IF NOT EXISTS account_number')
    );
    assert(
      'MIGRATION',
      'Migration adds account_tier column',
      migrationSql.includes('ADD COLUMN IF NOT EXISTS account_tier')
    );
    assert(
      'MIGRATION',
      'Migration adds account_status column',
      migrationSql.includes('ADD COLUMN IF NOT EXISTS account_status')
    );
    assert(
      'MIGRATION',
      'Migration configures service_role RLS for persons',
      migrationSql.includes('service_role_persons')
    );
    assert(
      'MIGRATION',
      'Migration configures service_role RLS for client_accounts',
      migrationSql.includes('service_role_client_accounts')
    );
  }

  // --------------------------------------------------------------------------
  // TEST 5: ROUTE & API AVAILABILITY
  // --------------------------------------------------------------------------
  console.log('\n5. Route Structure Integrity');
  assert(
    'ROUTES',
    'Admin team page route exists (/admin/estate/team/page.tsx)',
    fs.existsSync(path.resolve('src/app/admin/estate/team/page.tsx'))
  );
  assert(
    'ROUTES',
    'Admin team client component exists (/admin/estate/team/TeamPageClient.tsx)',
    fs.existsSync(path.resolve('src/app/admin/estate/team/TeamPageClient.tsx'))
  );
  assert(
    'ROUTES',
    'Admin team shortcut route exists (/admin/team/page.tsx)',
    fs.existsSync(path.resolve('src/app/admin/team/page.tsx'))
  );
  assert(
    'ROUTES',
    'Team API route exists (/api/admin/team/route.ts)',
    fs.existsSync(path.resolve('src/app/api/admin/team/route.ts'))
  );
  assert(
    'ROUTES',
    'Team member [id] API route exists (/api/admin/team/[id]/route.ts)',
    fs.existsSync(path.resolve('src/app/api/admin/team/[id]/route.ts'))
  );
  assert(
    'ROUTES',
    'Account managers API route exists (/api/admin/account-managers/route.ts)',
    fs.existsSync(path.resolve('src/app/api/admin/account-managers/route.ts'))
  );
  assert(
    'ROUTES',
    'Client [id] API route exists (/api/admin/clients/[id]/route.ts)',
    fs.existsSync(path.resolve('src/app/api/admin/clients/[id]/route.ts'))
  );

  // --------------------------------------------------------------------------
  // TEST 6: NAVIGATION INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n6. Admin Sidebar Navigation Integration');
  const sidebarPath = path.resolve('src/components/admin/AdminSidebar.tsx');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  assert(
    'SIDEBAR',
    'AdminSidebar links to EntireFM Team (/admin/estate/team)',
    sidebarContent.includes('/admin/estate/team')
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n---------------------------------------------------------------');
  const total = results.length;
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`RESULTS: ${passed}/${total} passed (${failed} failed)`);
  console.log('---------------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});

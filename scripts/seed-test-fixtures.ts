/**
 * Test Fixture Seeding Script (NON-PRODUCTION ONLY)
 * =================================================
 * Guarded against execution in production environments.
 */

import { assertNotProduction } from '../src/lib/env/production-guard';

async function seedTestFixtures() {
  assertNotProduction('seed-test-fixtures');
  console.log('[SEED] Test fixture environment verified (Non-production).');
  // Seeding logic for isolated automated tests only
  console.log('[SEED] Ready for test fixture orchestration.');
}

seedTestFixtures().catch((err) => {
  console.error('[SEED ERROR]', err);
  process.exit(1);
});

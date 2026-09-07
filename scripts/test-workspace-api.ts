import assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { dbQuery } from '../src/server/db/client';
import {
  createSiteProfile,
  listSiteProfiles,
  deleteSiteProfile,
  saveToolOutput,
  listSavedToolOutputs,
  deleteSavedToolOutput,
} from '../src/server/workspace/workspace-store';

async function runTests() {
  console.log('--- 1. FETCH TEST MEMBER ---');
  const { data: members, error: mErr } = await dbQuery<any[]>('lobby_members?limit=1&select=id,email');
  if (mErr || !members || members.length === 0) {
    console.log('No members in DB, testing store with synthetic test member ID.');
  }
  const testMemberId = members && members.length > 0 ? members[0].id : '00000000-0000-0000-0000-000000000001';
  console.log(`Using member ID: ${testMemberId}`);

  console.log('\n--- 2. TEST SITE PROFILE CREATION ---');
  const profile = await createSiteProfile(testMemberId, {
    name: 'Automated Test Head Office',
    building_type: 'Commercial Office / Corporate HQ',
    floor_area: '50,000 sq ft',
    region: 'london',
    operating_profile: 'standard',
    site_criticality: 'Standard Commercial',
    portfolio_sites: 1,
  });
  console.log('Created profile:', profile.id, profile.name);
  assert(profile.id, 'Profile must have an ID');
  assert.strictEqual(profile.name, 'Automated Test Head Office');

  console.log('\n--- 3. TEST LIST SITE PROFILES ---');
  const profiles = await listSiteProfiles(testMemberId);
  const found = profiles.find((p) => p.id === profile.id);
  assert(found, 'Created profile must exist in listSiteProfiles');
  console.log(`Verified profile in list of ${profiles.length} profiles.`);

  console.log('\n--- 4. TEST SAVE TOOL OUTPUT ---');
  const saved = await saveToolOutput(testMemberId, {
    site_profile_id: profile.id,
    tool_name: 'ppm-estimator',
    title: 'Test PPM Budget 2026',
    inputs_json: { floorAreaSqFt: 50000, sector: 'Commercial Office / Corporate HQ' },
    outputs_json: { totalAnnualPpm: 72500, monthlyPpm: 6041 },
    summary_kpis: { annualPpm: 72500, floorArea: '50,000 sq ft' },
    pdf_reference: null,
  });
  console.log('Created saved output:', saved.id, saved.title);
  assert(saved.id, 'Saved output must have an ID');
  assert.strictEqual(saved.title, 'Test PPM Budget 2026');

  console.log('\n--- 5. TEST LIST SAVED TOOL OUTPUTS ---');
  const outputs = await listSavedToolOutputs(testMemberId);
  const foundOutput = outputs.find((o) => o.id === saved.id);
  assert(foundOutput, 'Saved output must exist in listSavedToolOutputs');
  console.log(`Verified saved output in list of ${outputs.length} outputs.`);

  console.log('\n--- 6. CLEANUP TEST RECORDS ---');
  const deletedOutput = await deleteSavedToolOutput(testMemberId, saved.id);
  assert(deletedOutput, 'deleteSavedToolOutput should succeed');
  console.log('Deleted test output:', saved.id);

  const deletedProfile = await deleteSiteProfile(testMemberId, profile.id);
  assert(deletedProfile, 'deleteSiteProfile should succeed');
  console.log('Deleted test profile:', profile.id);

  console.log('\n🎉 ALL WORKSPACE DATA MODEL & STORE TESTS PASSED!\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

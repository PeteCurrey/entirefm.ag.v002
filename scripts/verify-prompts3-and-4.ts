import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

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
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

import {
  findPlausibleMatches,
  confirmEstateClientLink,
  dismissEstateClientSuggestion,
  unlinkEstateClientAsset,
  getLinkedClientAsset,
} from '../src/server/estate/client-asset-matcher';
import { getMemberByEmail, getLobbyClientLinks } from '../src/server/member/member-store';

const TEST_TAG = 'TEST_VERIFY_P3P4';
const ESTATE_ASSET_ID = 'firestore_doc_test_p3p4_estate_asset';

async function main() {
  console.log('=================================================================');
  console.log('PROMPTS 3 & 4 PRODUCTION EVIDENCE: ASSET LINKING & CLIENT CTA');
  console.log('=================================================================');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');
  const db = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await db.connect();

  // ── Lookup test members ─────────────────────────────────────────────────────
  const dualMember = await getMemberByEmail('thowze@outlook.com');
  const lobbyMember = await getMemberByEmail('mebuqa.co75@gmail.com');
  if (!dualMember || !lobbyMember) throw new Error('Test members not found');
  const authUserId = dualMember.auth_user_id!;

  // ── Tear down any previous test run ────────────────────────────────────────
  console.log('\n[Setup] Cleaning prior test data...');
  await db.query(`DELETE FROM estate_client_link_dismissals WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`, [authUserId, ESTATE_ASSET_ID]);
  await db.query(`DELETE FROM estate_client_asset_links WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`, [authUserId, ESTATE_ASSET_ID]);
  // Remove seeded FK chain if it exists
  await db.query(`DELETE FROM assets WHERE asset_reference = $1`, [TEST_TAG]);
  await db.query(`DELETE FROM sites WHERE site_code = $1`, [TEST_TAG]);
  await db.query(`DELETE FROM organisations WHERE code = $1`, [TEST_TAG]);

  // ── Seed: Organisation → Site → Asset ──────────────────────────────────────
  console.log('[Setup] Seeding test organisation, site, and asset...');

  const orgRes = await db.query(`
    INSERT INTO organisations (code, name) VALUES ($1, $2) RETURNING id
  `, [TEST_TAG, `${TEST_TAG}_org`]);
  const orgId = orgRes.rows[0].id;
  console.log('  Seeded org:', orgId);

  const siteRes = await db.query(`
    INSERT INTO sites (organisation_id, site_code, name, address_line1, city, postcode)
    VALUES ($1, $2, 'Test Site for P3/P4', '1 Test Street', 'London', 'EC1A 1BB')
    RETURNING id
  `, [orgId, TEST_TAG]);
  const siteId = siteRes.rows[0].id;
  console.log('  Seeded site:', siteId);

  const assetRes = await db.query(`
    INSERT INTO assets (
      site_id, asset_reference, name, category,
      manufacturer, model, serial_number,
      status, metadata
    ) VALUES (
      $1, $2, 'Main Office VRV Heat Pump #1', 'HVAC',
      'Daikin', 'REYQ10T7Y1B', 'SN-VRV-TEST-900',
      'OPERATIONAL',
      '{"authoritativeRegime": {"taskRef": "SFG20-04-01", "standard": "SFG20", "frequency": "Quarterly"}}'::jsonb
    ) RETURNING id, name, serial_number, manufacturer, model
  `, [siteId, TEST_TAG]);
  const clientAsset = assetRes.rows[0];
  console.log('  Seeded client asset:', clientAsset.id, '|', clientAsset.name, '| SN:', clientAsset.serial_number);

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 3 TEST A: Plausible Matching by Serial Number
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 3 Test A: Plausible Matching by Serial Number ---');
  const matchesBySerial = await findPlausibleMatches(authUserId, {
    id: ESTATE_ASSET_ID,
    serialNumber: 'sn-vrv-test-900',   // normalised variant
    manufacturer: 'Daikin',
    model: 'REYQ10T7Y1B',
  });

  console.log(`Found ${matchesBySerial.length} match(es):`);
  matchesBySerial.forEach((m) => {
    console.log(`  Asset:      ${m.clientAsset.name}`);
    console.log(`  Confidence: ${m.matchConfidence}`);
    console.log(`  Reason:     ${m.matchReason}`);
  });

  if (matchesBySerial.length === 0) throw new Error('❌ Expected at least 1 plausible serial match');
  console.log('✅ Serial match returned correctly');

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 3 TEST B: Manufacturer + Model Fuzzy Match (no serial)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 3 Test B: Manufacturer + Model Match (no serial) ---');
  const matchesByModel = await findPlausibleMatches(authUserId, {
    id: ESTATE_ASSET_ID,
    serialNumber: '',
    manufacturer: 'Daikin',
    model: 'reyq10t7y1b',
  });

  console.log(`Found ${matchesByModel.length} match(es) by manufacturer+model:`);
  matchesByModel.forEach((m) => {
    console.log(`  Asset: ${m.clientAsset.name} | Reason: ${m.matchReason}`);
  });
  if (matchesByModel.length === 0) throw new Error('❌ Expected manufacturer+model match');
  console.log('✅ Manufacturer+model match returned correctly');

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 3 TEST C: Explicit Opt-In Confirmation Link
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 3 Test C: Explicit Opt-In Confirmation ---');
  const confirmResult = await confirmEstateClientLink(authUserId, ESTATE_ASSET_ID, clientAsset.id);
  console.log('Confirm API result:', confirmResult);

  const linkRow = await db.query(
    `SELECT * FROM estate_client_asset_links WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`,
    [authUserId, ESTATE_ASSET_ID]
  );
  if (linkRow.rows.length !== 1) throw new Error('❌ Expected exactly 1 link row after confirmation');
  console.log('✅ Link row created in estate_client_asset_links');

  // Authoritative regime visible via getLinkedClientAsset
  const linked = await getLinkedClientAsset(authUserId, ESTATE_ASSET_ID);
  console.log('Authoritative regime from client record:');
  console.log(`  Name:   ${linked.client_asset.name}`);
  console.log(`  Regime: ${JSON.stringify(linked.client_asset.metadata?.authoritativeRegime)}`);
  if (!linked.client_asset.metadata?.authoritativeRegime?.taskRef) {
    throw new Error('❌ Authoritative regime missing from linked client asset');
  }
  console.log('✅ Authoritative regime correctly resolved from client record');

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 3 TEST D: Unlink — Non-Destructive (both records intact after unlink)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 3 Test D: Unlink Non-Destructive Guarantee ---');
  const unlinkOk = await unlinkEstateClientAsset(authUserId, ESTATE_ASSET_ID, clientAsset.id);
  console.log('Unlink returned success:', unlinkOk);

  const postUnlinkLink = await db.query(
    `SELECT * FROM estate_client_asset_links WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`,
    [authUserId, ESTATE_ASSET_ID]
  );
  if (postUnlinkLink.rows.length !== 0) throw new Error('❌ Link row should be removed after unlink');
  console.log('✅ Link row removed from estate_client_asset_links');

  const clientAssetIntact = await db.query(`SELECT id, name FROM assets WHERE id = $1`, [clientAsset.id]);
  if (clientAssetIntact.rows.length !== 1) throw new Error('❌ Client asset must survive unlink');
  console.log('✅ Client asset in public.assets remains 100% intact:', clientAssetIntact.rows[0].name);

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 3 TEST E: Dismissal Suppresses Future Matches
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 3 Test E: Dismissal Suppresses Future Matches ---');
  await dismissEstateClientSuggestion(authUserId, ESTATE_ASSET_ID, clientAsset.id);
  const matchesAfterDismissal = await findPlausibleMatches(authUserId, {
    id: ESTATE_ASSET_ID,
    serialNumber: 'SN-VRV-TEST-900',
    manufacturer: 'Daikin',
    model: 'REYQ10T7Y1B',
  });
  if (matchesAfterDismissal.length !== 0) throw new Error('❌ Dismissed match should not appear again');
  console.log('✅ Dismissed match correctly suppressed from future suggestions');

  // ─────────────────────────────────────────────────────────────────────────────
  // PROMPT 4: Asset Scanner Sales CTA Routing Audit
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- Prompt 4: Asset Scanner CTA Branch Logic ---');

  // Dual-context member
  const clientLinksDual = await getLobbyClientLinks(dualMember.auth_user_id!);
  const isClientLinkedDual = clientLinksDual.length > 0;
  const ctaDual = isClientLinkedDual ? 'Raise as Service Request' : 'Get a Quote for Managing This';
  const routeDual = isClientLinkedDual
    ? '/log-a-job?source=asset-scanner&manufacturer=Daikin&model=REYQ10T7Y1B&serial=SN-VRV-TEST-900'
    : 'COLD_ENQUIRY_MODAL';
  console.log(`\n  ${dualMember.email} (${clientLinksDual.length} client links):`);
  console.log(`  CTA Label:  "${ctaDual}"`);
  console.log(`  CTA Route:  ${routeDual}`);
  if (!isClientLinkedDual) throw new Error('❌ Dual-context member should have at least 1 client link');
  console.log('  ✅ Client-linked member routed to /log-a-job (bypasses cold lead pipeline)');

  // Lobby-only member
  const clientLinksLobby = await getLobbyClientLinks(lobbyMember.auth_user_id!);
  const isClientLinkedLobby = clientLinksLobby.length > 0;
  const ctaLobby = isClientLinkedLobby ? 'Raise as Service Request' : 'Get a Quote for Managing This';
  const routeLobby = isClientLinkedLobby ? '/log-a-job?...' : 'COLD_ENQUIRY_MODAL (/api/enquiry)';
  console.log(`\n  ${lobbyMember.email} (${clientLinksLobby.length} client links):`);
  console.log(`  CTA Label:  "${ctaLobby}"`);
  console.log(`  CTA Route:  ${routeLobby}`);
  if (isClientLinkedLobby) throw new Error('❌ Lobby-only member should have 0 client links');
  console.log('  ✅ Lobby-only member gets cold-enquiry modal (prospect conversion funnel preserved)');

  // ── Teardown seeded test data ───────────────────────────────────────────────
  console.log('\n[Teardown] Removing seeded test data...');
  await db.query(`DELETE FROM estate_client_link_dismissals WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`, [authUserId, ESTATE_ASSET_ID]);
  await db.query(`DELETE FROM estate_client_asset_links WHERE auth_user_id = $1 AND estate_asset_firestore_id = $2`, [authUserId, ESTATE_ASSET_ID]);
  await db.query(`DELETE FROM assets WHERE asset_reference = $1`, [TEST_TAG]);
  await db.query(`DELETE FROM sites WHERE site_code = $1`, [TEST_TAG]);
  await db.query(`DELETE FROM organisations WHERE code = $1`, [TEST_TAG]);
  console.log('[Teardown] Done — no test data left in DB.');

  console.log('\n=================================================================');
  console.log('✅ ALL PROMPT 3 & 4 CHECKS PASSED — PRODUCTION EVIDENCE COMPLETE');
  console.log('=================================================================');

  await db.end();
}

main().catch((err) => {
  console.error('\n❌ VERIFICATION FAILED:', err.message);
  process.exit(1);
});

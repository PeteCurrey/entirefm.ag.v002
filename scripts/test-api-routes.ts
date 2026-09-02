/**
 * API ROUTE HANDLER HTTP CONTRACT TEST SUITE
 * ==========================================
 * Directly verifies Next.js Route Handlers for HTTP status codes,
 * authentication guard rails, and payload contract validation.
 */

import { GET as getEstateAssets, PATCH as patchEstateAssets } from '../src/app/api/tools/asset-scanner/estate-assets/route';
import { PATCH as patchSingleAsset } from '../src/app/api/tools/asset-scanner/estate-assets/[assetId]/route';
import { POST as postManualAsset } from '../src/app/api/tools/asset-scanner/estate-assets/manual/route';
import { POST as postProcess } from '../src/app/api/tools/asset-scanner/process/route';

function assert(condition: boolean, title: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${title}`);
    if (detail) console.error(`   Details: ${detail}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${title}`);
  if (detail) console.log(`   Evidence: ${detail}`);
}

async function runApiTests() {
  console.log('================================================================');
  console.log('  MY ESTATE API ROUTES — HTTP INTEGRATION CONTRACT TESTS');
  console.log('================================================================\n');

  // 1. GET /api/tools/asset-scanner/estate-assets without Auth -> 401
  const req1 = new Request('http://localhost:3000/api/tools/asset-scanner/estate-assets', {
    method: 'GET',
  });
  const res1 = await getEstateAssets(req1);
  const data1 = await res1.json();
  assert(res1.status === 401, 'GET estate-assets without auth returns 401');
  assert(data1.error === 'AUTH_REQUIRED', 'GET estate-assets returns AUTH_REQUIRED error code', JSON.stringify(data1));

  // 2. PATCH /api/tools/asset-scanner/estate-assets without Auth -> 401
  const req2 = new Request('http://localhost:3000/api/tools/asset-scanner/estate-assets', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId: 'ast_123', addedToPpmSchedule: true }),
  });
  const res2 = await patchEstateAssets(req2);
  const data2 = await res2.json();
  assert(res2.status === 401, 'PATCH estate-assets without auth returns 401');
  assert(data2.error === 'AUTH_REQUIRED', 'PATCH estate-assets returns AUTH_REQUIRED error code');

  // 3. PATCH /api/tools/asset-scanner/estate-assets/[assetId] without Auth -> 401
  const req3 = new Request('http://localhost:3000/api/tools/asset-scanner/estate-assets/ast_123', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serialNumber: 'NEW-SN-123' }),
  });
  const res3 = await patchSingleAsset(req3, { params: Promise.resolve({ assetId: 'ast_123' }) });
  const data3 = await res3.json();
  assert(res3.status === 401, 'PATCH [assetId] without auth returns 401');
  assert(data3.error === 'AUTH_REQUIRED', 'PATCH [assetId] returns AUTH_REQUIRED');

  // 4. POST /api/tools/asset-scanner/estate-assets/manual without Auth -> 401
  const req4 = new Request('http://localhost:3000/api/tools/asset-scanner/estate-assets/manual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetType: 'Air Handling Unit' }),
  });
  const res4 = await postManualAsset(req4);
  const data4 = await res4.json();
  assert(res4.status === 401, 'POST manual without auth returns 401');
  assert(data4.error === 'AUTH_REQUIRED', 'POST manual returns AUTH_REQUIRED');

  // 5. POST /api/tools/asset-scanner/process with anonymous payload -> 200
  const req5 = new Request('http://localhost:3000/api/tools/asset-scanner/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uploadId: 'up_anon_test_001',
      fileType: 'pdf',
      filename: 'sample.pdf',
      textContent: 'Manufacturer: Daikin\nModel: VRV IV\nSerial: 123456\nAir Handling Unit',
      sessionId: 'sess_anon_999',
    }),
  });
  const res5 = await postProcess(req5);
  const data5 = await res5.json();
  assert(res5.status === 200, 'POST process allows valid anonymous scan (returns 200)');
  assert(data5.success === true, 'POST process returns success: true');
  assert(data5.data.persisted === false, 'Anonymous scan is not persisted to member estate');
  assert(data5.data.asset.sfg20AssetId !== null, 'Canonical sfg20AssetId generated during scan');

  console.log('\n================================================================');
  console.log('  ALL API ROUTE INTEGRATION CONTRACT TESTS PASSED (100%)');
  console.log('================================================================\n');
}

runApiTests().catch((err) => {
  console.error('API test run failed:', err);
  process.exit(1);
});

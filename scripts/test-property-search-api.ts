/**
 * API ENDPOINT TEST: /api/properties/search
 * ==========================================
 * Tests NextRequest handling, cookie session parsing, status codes, and DTO projection.
 */

import { NextRequest } from 'next/server';
import { GET } from '../src/app/api/properties/search/route';
import { createSessionToken } from '../src/server/identity';
import { UserSession } from '../src/server/identity';

let passed = 0;
let total = 0;

function assert(condition: boolean, name: string, detail?: any) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } else {
    console.error(`  ❌ FAIL: ${name}`, detail || '');
  }
}

async function runApiTests() {
  console.log('=================================================================');
  console.log('TESTING /api/properties/search API ROUTE HANDLER');
  console.log('=================================================================\n');

  // Test 1: Unauthenticated request -> 401
  const req1 = new NextRequest('http://localhost:3000/api/properties/search?q=Bra');
  const res1 = await GET(req1);
  assert(res1.status === 401, 'Unauthenticated request returns HTTP 401');
  const body1 = await res1.json();
  assert(body1.error?.code === 'UNAUTHENTICATED', 'Error code is UNAUTHENTICATED');

  // Test 2: Contractor session -> 403
  const contractorSession: UserSession = {
    personId: 'contractor-person-1',
    email: 'contractor@apex.co.uk',
    name: 'Apex Contractor',
    role: 'CONTRACTOR_ADMIN',
    orgId: 'ea8b6a0b-0623-4bdd-8e5e-1827b7727474',
    orgName: 'Apex Test Contractor Ltd',
    orgType: 'CONTRACTOR',
    activeApplication: 'CONTRACTOR',
    permissions: ['operations:read'],
    scopes: [],
    expiresAt: Date.now() + 3600000,
  };
  const contractorToken = createSessionToken(contractorSession);
  const req2 = new NextRequest('http://localhost:3000/api/properties/search?q=Bra', {
    headers: {
      cookie: `efm_session=${contractorToken}`,
    },
  });
  const res2 = await GET(req2);
  assert(res2.status === 403, 'Contractor request returns HTTP 403 Forbidden');
  const body2 = await res2.json();
  assert(body2.error?.code === 'FORBIDDEN', 'Error code is FORBIDDEN');

  // Test 3: Short query (<2 chars) -> 200 { data: [] }
  const adminSession: UserSession = {
    personId: 'admin-person-1',
    email: 'admin@entirefm.com',
    name: 'EntireFM Admin',
    role: 'SUPER_ADMIN',
    orgId: '00000000-0000-0000-0000-000000000001',
    orgName: 'EntireFM Internal Operations',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: ['platform:admin', 'operations:read', 'operations:write'],
    scopes: [],
    expiresAt: Date.now() + 3600000,
  };
  const adminToken = createSessionToken(adminSession);
  const req3 = new NextRequest('http://localhost:3000/api/properties/search?q=B', {
    headers: {
      cookie: `efm_session=${adminToken}`,
    },
  });
  const res3 = await GET(req3);
  assert(res3.status === 200, 'Query < 2 chars returns HTTP 200');
  const body3 = await res3.json();
  assert(Array.isArray(body3.data) && body3.data.length === 0, 'Query < 2 chars returns empty array without querying database');

  // Test 4: Excessive query (>100 chars) -> 400
  const longQuery = 'a'.repeat(105);
  const req4 = new NextRequest(`http://localhost:3000/api/properties/search?q=${longQuery}`, {
    headers: {
      cookie: `efm_session=${adminToken}`,
    },
  });
  const res4 = await GET(req4);
  assert(res4.status === 400, 'Query > 100 chars returns HTTP 400 Bad Request');
  const body4 = await res4.json();
  assert(body4.error?.code === 'INVALID_QUERY', 'Error code is INVALID_QUERY');

  // Test 5: Valid search -> 200 { data: [{ id, name, postcode? }] }
  const req5 = new NextRequest('http://localhost:3000/api/properties/search?q=Bra', {
    headers: {
      cookie: `efm_session=${adminToken}`,
    },
  });
  const res5 = await GET(req5);
  assert(res5.status === 200, 'Valid search returns HTTP 200 OK');
  const body5 = await res5.json();
  assert(Array.isArray(body5.data), 'Returns data array');
  assert(body5.data.length > 0, 'Found results for "Bra"');

  let zeroLeakage = true;
  for (const item of body5.data) {
    const keys = Object.keys(item);
    for (const k of keys) {
      if (k !== 'id' && k !== 'name' && k !== 'postcode') {
        zeroLeakage = false;
        console.error('Leaked key in API response:', k);
      }
    }
  }
  assert(zeroLeakage, 'ZERO client names or internal IDs in API response payload');

  console.log('\n=================================================================');
  console.log(`API TEST SUMMARY: ${passed} / ${total} PASSED`);
  console.log('=================================================================');

  if (passed < total) process.exit(1);
}

runApiTests().catch((e) => {
  console.error('API Test runner error:', e);
  process.exit(1);
});

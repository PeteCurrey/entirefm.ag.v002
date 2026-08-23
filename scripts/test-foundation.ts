import {
  createSessionToken,
  verifySessionToken,
  hasPermission,
  getPostLoginRedirect,
  getRolePermissions,
  UserSession,
} from '../src/server/identity';
import { mapLegacyAssetToCanonical } from '../src/server/migration';
import { isDbConfigured } from '../src/server/db/client';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

console.log('\n========================================');
console.log('  ENTIREFM PLATFORM FOUNDATION TESTS');
console.log('========================================\n');

const sampleSession: UserSession = {
  personId: '11111111-1111-1111-1111-111111111111',
  email: 'ceo@entirefm.com',
  name: 'Chief Executive',
  role: 'CEO',
  orgId: '22222222-2222-2222-2222-222222222222',
  orgName: 'EntireFM Headquarters',
  orgType: 'ENTIREFM',
  permissions: getRolePermissions('CEO'),
  expiresAt: Date.now() + 1000 * 60 * 60,
};

// 1. Session Token Signature & Verification
const token = createSessionToken(sampleSession);
assert(typeof token === 'string' && token.includes('.'), 'HMAC token generated');

const decoded = verifySessionToken(token);
assert(decoded !== null && decoded.email === 'ceo@entirefm.com', 'HMAC token decoded and verified');
assert(decoded?.role === 'CEO' && decoded?.orgType === 'ENTIREFM', 'Session claims preserved');

// 2. Tamper resistance
const tampered = token.slice(0, -4) + 'zzzz';
assert(verifySessionToken(tampered) === null, 'Tampered token strictly rejected');

// 3. Permissions enforcement
assert(hasPermission(sampleSession, 'command:access') === true, 'CEO has command:access');
assert(hasPermission(sampleSession, 'ai:control') === true, 'CEO has ai:control');
assert(hasPermission(sampleSession, 'operations:dispatch') === true, 'CEO has operations:dispatch');

const clientSession: UserSession = {
  ...sampleSession,
  role: 'CLIENT_USER',
  orgType: 'CLIENT',
  permissions: getRolePermissions('CLIENT_USER'),
};
assert(hasPermission(clientSession, 'operations:read') === true, 'Client user has operations:read');
assert(hasPermission(clientSession, 'command:ceo') === false, 'Client user blocked from command:ceo');
assert(hasPermission(clientSession, 'ai:control') === false, 'Client user blocked from ai:control');

// 4. Role-aware post-login routing
assert(getPostLoginRedirect('CEO', 'ENTIREFM') === '/admin', 'CEO routes to /admin');
assert(getPostLoginRedirect('OPERATIONS_MANAGER', 'ENTIREFM') === '/admin', 'Ops Manager routes to /admin');
assert(getPostLoginRedirect('CLIENT_ADMIN', 'CLIENT') === '/client', 'Client Admin routes to /client');
assert(getPostLoginRedirect('CONTRACTOR_ADMIN', 'CONTRACTOR') === '/contractor', 'Contractor routes to /contractor');
assert(getPostLoginRedirect('ENGINEER', 'ENTIREFM') === '/engineer', 'Field Engineer routes to /engineer');

// 5. Migration schema mapper
const legacyItem = {
  legacyId: 'LEG-9988',
  siteName: 'Meadowhall Centre',
  assetDescription: 'Main Boiler Unit 1',
  category: 'HVAC',
  serialNumber: 'SN-44321',
  installDate: '2022-04-15',
};
const canonical = mapLegacyAssetToCanonical(legacyItem, 'site-uuid-123');
assert(canonical.site_id === 'site-uuid-123', 'Site ID mapped');
assert(canonical.asset_reference === 'AST-LEG-9988', 'Asset reference prefixed');
assert(canonical.name === 'Main Boiler Unit 1', 'Asset name mapped');
assert(canonical.condition === 'GOOD' && canonical.status === 'IN_SERVICE', 'Default lifecycle states applied');
assert(canonical.metadata.migratedFromLegacy === true, 'Audit migration metadata recorded');

console.log('\n========================================');
console.log('  ALL FOUNDATION TESTS PASSED (100%)');
console.log('========================================\n');

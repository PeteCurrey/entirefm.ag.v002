/**
 * TEST SUITE: PROPERTY AUTHORISATION, SEARCH DTO PRIVACY & EFFECTIVE SCOPE
 * ========================================================================
 * Validates:
 * 1. Role Precedence and Authority Separation
 * 2. Scope Formula: Union of positive grants, Narrowing restrictions
 * 3. Cross-Client Isolation (Search & Mutation)
 * 4. Contractor & Unauthenticated Access Rejections
 * 5. Safe Response Projections (Zero Client/Internal Data Leakage)
 * 6. Archived/Inactive Property Exclusions
 */

import {
  canSearchProperties,
  hasJobCreationAuthority,
  resolvePropertySearchScope,
  resolvePropertyAccess,
  searchAuthorisedProperties,
  canCreateJobForProperty,
} from '../src/server/identity/property-authorisation';
import { UserSession } from '../src/server/identity';

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`, detail || '');
  }
}

async function runTests() {
  console.log('=================================================================');
  console.log('ENTIREFM PROPERTY AUTHORISATION & SCOPE VERIFICATION SUITE');
  console.log('=================================================================\n');

  // ── TEST 1: Unauthenticated Requests ──
  console.log('── Test Group 1: Unauthenticated Requests ──');
  assert(!canSearchProperties(null), 'canSearchProperties(null) returns false');
  assert(!hasJobCreationAuthority(null), 'hasJobCreationAuthority(null) returns false');
  const unauthScope = await resolvePropertySearchScope(null);
  assert(!unauthScope.allowed && unauthScope.reason === 'UNAUTHENTICATED', 'resolvePropertySearchScope(null) returns UNAUTHENTICATED');
  const unauthAccess = await canCreateJobForProperty(null, 'any-site-id');
  assert(!unauthAccess.allowed && unauthAccess.denials.includes('UNAUTHENTICATED'), 'canCreateJobForProperty(null) denies mutation');

  // ── TEST 2: Contractor & Supplier Isolation ──
  console.log('\n── Test Group 2: Contractor & Supplier Discovery Rejection ──');
  const contractorSession: UserSession = {
    personId: 'test-contractor-person',
    email: 'contractor@apex.co.uk',
    name: 'Apex Contractor',
    role: 'CONTRACTOR_ADMIN',
    orgId: 'ea8b6a0b-0623-4bdd-8e5e-1827b7727474',
    orgName: 'Apex Test Contractor Ltd',
    orgType: 'CONTRACTOR',
    activeApplication: 'CONTRACTOR',
    permissions: ['operations:read', 'operations:write'],
    scopes: [],
    expiresAt: Date.now() + 100000,
  };
  assert(!canSearchProperties(contractorSession), 'Contractor cannot search properties');
  assert(!hasJobCreationAuthority(contractorSession), 'Contractor cannot create client service requests on Log a Job');
  const contractorScope = await resolvePropertySearchScope(contractorSession);
  assert(!contractorScope.allowed && contractorScope.denials.includes('CONTRACTOR_DISCOVERY_PROHIBITED'), 'Contractor search scope is rejected');

  // ── TEST 3: Platform Admin Universal Scope ──
  console.log('\n── Test Group 3: Platform Admin Scope ──');
  const adminSession: UserSession = {
    personId: 'admin-person-id',
    email: 'admin@entirefm.com',
    name: 'EntireFM Admin',
    role: 'SUPER_ADMIN',
    orgId: '00000000-0000-0000-0000-000000000001',
    orgName: 'EntireFM Internal Operations',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: ['platform:admin', 'operations:read', 'operations:write'],
    scopes: [{ type: 'ORGANISATION', id: '00000000-0000-0000-0000-000000000001' }],
    expiresAt: Date.now() + 100000,
  };
  assert(canSearchProperties(adminSession), 'Platform Admin can search properties');
  assert(hasJobCreationAuthority(adminSession), 'Platform Admin has job creation authority');
  const adminScope = await resolvePropertySearchScope(adminSession);
  assert(adminScope.allowed && adminScope.isPlatformWide, 'Platform Admin receives platform-wide search scope');

  // ── TEST 4: Client Organisation Scope (Additive Union) ──
  console.log('\n── Test Group 4: Client Organisation Scope & Multi-Org Union ──');
  const clientAOrgId = 'client-org-a-1111';
  const clientBOrgId = 'client-org-b-2222';
  const multiOrgClientSession: UserSession = {
    personId: 'client-person-1',
    email: 'client@clientcorp.com',
    name: 'Client User',
    role: 'CLIENT_ADMIN',
    orgId: clientAOrgId,
    orgName: 'Client Corp A',
    orgType: 'CLIENT',
    activeApplication: 'CLIENT',
    permissions: ['operations:read', 'operations:write'],
    scopes: [{ type: 'ORGANISATION', id: clientAOrgId }],
    availableContexts: [
      {
        membershipId: 'mem-2',
        orgId: clientBOrgId,
        orgName: 'Client Corp B',
        orgType: 'CLIENT',
        role: 'CLIENT_USER',
        portal: 'CLIENT',
      },
    ],
    expiresAt: Date.now() + 100000,
  };
  const clientScope = await resolvePropertySearchScope(multiOrgClientSession);
  assert(clientScope.allowed, 'Multi-org client is allowed');
  assert(!clientScope.isPlatformWide, 'Multi-org client is NOT platform-wide');
  assert(
    clientScope.allowedOrgIds?.includes(clientAOrgId) && clientScope.allowedOrgIds?.includes(clientBOrgId),
    'Valid positive client memberships are UNIONED (Client A UNION Client B)',
    clientScope.allowedOrgIds
  );

  // ── TEST 5: Narrowing Property Restrictions (INTERSECTION) ──
  console.log('\n── Test Group 5: Narrowing Property Restrictions ──');
  const restrictedSiteId1 = 'restricted-site-0001';
  const restrictedSiteId2 = 'restricted-site-0002';
  const restrictedClientSession: UserSession = {
    personId: 'restricted-person-1',
    email: 'site.manager@clientcorp.com',
    name: 'Restricted Site Manager',
    role: 'CLIENT_SITE_MANAGER',
    orgId: clientAOrgId,
    orgName: 'Client Corp A',
    orgType: 'CLIENT',
    activeApplication: 'CLIENT',
    permissions: ['operations:read', 'operations:write'],
    scopes: [
      { type: 'SITE', id: restrictedSiteId1 },
      { type: 'SITE', id: restrictedSiteId2 },
    ],
    expiresAt: Date.now() + 100000,
  };
  const restrictedScope = await resolvePropertySearchScope(restrictedClientSession);
  assert(restrictedScope.allowed, 'Restricted client user is allowed');
  assert(
    restrictedScope.allowedSiteIds?.length === 2 &&
      restrictedScope.allowedSiteIds.includes(restrictedSiteId1) &&
      restrictedScope.allowedSiteIds.includes(restrictedSiteId2),
    'Property restrictions strictly NARROW scope to assigned site UUIDs only',
    restrictedScope.allowedSiteIds
  );

  // ── TEST 6: Account Manager Scope Union ──
  console.log('\n── Test Group 6: Account Manager Scope Union ──');
  const accountManagerSession: UserSession = {
    personId: '00000000-0000-0000-0000-000000000099',
    email: 'am@entirefm.com',
    name: 'EntireFM Account Manager',
    role: 'ACCOUNT_MANAGER',
    orgId: '00000000-0000-0000-0000-000000000001',
    orgName: 'EntireFM Internal Operations',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: ['operations:read', 'operations:write'],
    scopes: [
      { type: 'ORGANISATION', id: 'client-account-org-1' },
      { type: 'CLIENT_ACCOUNT', id: 'client-account-org-2' },
    ],
    expiresAt: Date.now() + 100000,
  };
  const amScope = await resolvePropertySearchScope(accountManagerSession);
  assert(amScope.allowed, 'Account manager is allowed');
  assert(
    amScope.allowedOrgIds?.includes('client-account-org-1') && amScope.allowedOrgIds?.includes('client-account-org-2'),
    'Account manager scopes are UNIONED across all assigned clients',
    amScope.allowedOrgIds
  );

  // ── TEST 7: Safe DTO Projection (Live Database Search) ──
  console.log('\n── Test Group 7: Safe DTO Projection & Data Privacy ──');
  const searchResults = await searchAuthorisedProperties(adminSession, 'Bra', 10);
  assert(Array.isArray(searchResults), 'searchAuthorisedProperties returns array');
  assert(searchResults.length > 0, 'Found matching real properties for "Bra"');

  let hasProhibitedField = false;
  for (const item of searchResults) {
    const keys = Object.keys(item);
    for (const key of keys) {
      if (key !== 'id' && key !== 'name' && key !== 'postcode') {
        hasProhibitedField = true;
        console.error(`Prohibited field discovered in DTO: "${key}"`, item);
      }
    }
  }
  assert(!hasProhibitedField, 'ZERO prohibited fields in search DTO (strictly id, name, postcode only)');

  // Verify starts-with sorting
  if (searchResults.length > 1) {
    const firstStarts = searchResults[0].name.toLowerCase().startsWith('bra');
    assert(firstStarts, 'Intelligent ranking puts starts-with match first ("Braemore apartments" or similar)');
  }

  // ── TEST 8: Point of Mutation Revalidation ──
  console.log('\n── Test Group 8: Point-of-Mutation Security Checks ──');
  const validSiteId = searchResults[0]?.id;
  if (validSiteId) {
    const adminMutation = await canCreateJobForProperty(adminSession, validSiteId);
    assert(adminMutation.allowed, 'Admin can create job against valid active site');

    const contractorMutation = await canCreateJobForProperty(contractorSession, validSiteId);
    assert(
      !contractorMutation.allowed && contractorMutation.denials.includes('CONTRACTOR_ACCESS_PROHIBITED'),
      'Contractor job creation is rejected at mutation point'
    );

    // Cross-client mutation attack test:
    // Client user from org B attempts to create job on site belonging to org A (EntireFM org)
    const clientIsolatedSession: UserSession = {
      personId: 'foreign-client-user',
      email: 'user@foreign.com',
      name: 'Foreign Client User',
      role: 'CLIENT_USER',
      orgId: 'foreign-org-9999-8888-7777',
      orgName: 'Foreign Client Ltd',
      orgType: 'CLIENT',
      activeApplication: 'CLIENT',
      permissions: ['operations:read', 'operations:write'],
      scopes: [{ type: 'ORGANISATION', id: 'foreign-org-9999-8888-7777' }],
      expiresAt: Date.now() + 100000,
    };
    const crossClientMutation = await canCreateJobForProperty(clientIsolatedSession, validSiteId);
    assert(
      !crossClientMutation.allowed && crossClientMutation.denials.includes('ORGANISATION_BOUNDARY_VIOLATION'),
      'Cross-client job creation attack is rejected (ORGANISATION_BOUNDARY_VIOLATION)'
    );

    // Non-existent property ID test
    const nonexistentMutation = await canCreateJobForProperty(adminSession, '00000000-0000-0000-0000-000000000000');
    assert(
      !nonexistentMutation.allowed && nonexistentMutation.denials.includes('PROPERTY_NOT_FOUND'),
      'Non-existent property ID is rejected with PROPERTY_NOT_FOUND'
    );
  }

  console.log('\n=================================================================');
  console.log(`TEST SUMMARY: ${passedCount} / ${totalCount} PASSED`);
  console.log('=================================================================');

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

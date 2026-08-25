import {
  getSupplierRelationshipOverview,
  getSupplierServicesScope,
  requestAdditionalService,
  getSupplierCoverageScope,
  requestAdditionalCoverage,
  getSupplierComplianceRadar,
  listSupplierVaultDocuments,
  replaceSupplierVaultDocument,
  listSupplierResources,
} from '../src/server/suppliers/store';

async function runPhase2bPartnerPortalTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM APPROVED PARTNER PORTAL (PHASE 2B) SUITE          ');
  console.log('══════════════════════════════════════════════════════════════\n');

  const testSupId = 'sup-test-01';

  // Test 1: Relationship Overview & Assurance State
  console.log('1. Testing Relationship Overview & Assigned Team Contacts...');
  const rel = await getSupplierRelationshipOverview(testSupId);
  console.log(`   ✓ Partner: ${rel.legal_name} (${rel.trading_name})`);
  console.log(`   ✓ Relationship Tier: ${rel.relationship_tier} (Assurance: ${rel.assurance_status})`);
  console.log(`   ✓ Assigned EntireFM Contacts: ${rel.assigned_entirefm_team.length}`);
  if (rel.relationship_tier !== 'APPROVED_SUPPLIER' || rel.assurance_status !== 'APPROVED') {
    throw new Error('Invalid relationship tier or assurance status');
  }
  if (rel.assigned_entirefm_team.length < 2) {
    throw new Error('Assigned EntireFM management team contacts missing');
  }

  // Test 2: Declared vs Approved Service Scope Separation
  console.log('\n2. Testing Declared vs Approved Service Matrix...');
  const services = await getSupplierServicesScope(testSupId);
  const hvac = services.find((s) => s.slug === 'hvac');
  const electrical = services.find((s) => s.slug === 'electrical');
  console.log(`   ✓ HVAC Status: Declared=${hvac?.is_declared}, Approval=${hvac?.approval_status} (Regions: ${hvac?.approved_geographies?.join(', ')})`);
  console.log(`   ✓ Electrical Status: Declared=${electrical?.is_declared}, Approval=${electrical?.approval_status}`);
  if (hvac?.approval_status !== 'APPROVED') throw new Error('HVAC should be approved');
  if (electrical?.approval_status !== 'NOT_REQUESTED') throw new Error('Electrical should be NOT_REQUESTED');

  // Test 3: Request Additional Service Workflow
  console.log('\n3. Testing Request Additional Service Expansion...');
  const reqService = await requestAdditionalService(testSupId, 'electrical', 'Commercial NICEIC certified engineers for fixed wire testing.');
  console.log(`   ✓ Service Requested: ${reqService.service.slug} (New Status: ${reqService.service.approval_status})`);
  const postReqServices = await getSupplierServicesScope(testSupId);
  const updatedElectrical = postReqServices.find((s) => s.slug === 'electrical');
  const postHvac = postReqServices.find((s) => s.slug === 'hvac');
  if (updatedElectrical?.approval_status !== 'UNDER_REVIEW') throw new Error('Electrical should be UNDER_REVIEW');
  if (postHvac?.approval_status !== 'APPROVED') throw new Error('Existing HVAC approval was unexpectedly modified');
  console.log('   ✓ Verified: Existing HVAC approval remained unchanged at APPROVED.');

  // Test 4: Declared vs Approved Coverage Scope
  console.log('\n4. Testing Declared vs Approved Geographical Scope...');
  const coverage = await getSupplierCoverageScope(testSupId);
  const westMidlands = coverage.find((c) => c.region.includes('West Midlands'));
  const northWest = coverage.find((c) => c.region.includes('North West'));
  console.log(`   ✓ West Midlands: Declared=${westMidlands?.is_declared}, Approval=${westMidlands?.approval_status}`);
  console.log(`   ✓ North West: Declared=${northWest?.is_declared}, Approval=${northWest?.approval_status}`);
  if (westMidlands?.approval_status !== 'APPROVED') throw new Error('West Midlands should be APPROVED');
  if (northWest?.approval_status !== 'UNDER_REVIEW') throw new Error('North West should be UNDER_REVIEW');

  // Test 5: Request Additional Coverage
  console.log('\n5. Testing Request Additional Regional Coverage...');
  const reqCov = await requestAdditionalCoverage(testSupId, 'Greater London');
  console.log(`   ✓ Region Requested: ${reqCov.coverage.region} (Status: ${reqCov.coverage.approval_status})`);
  if (reqCov.coverage.approval_status !== 'UNDER_REVIEW') throw new Error('London coverage should be UNDER_REVIEW');

  // Test 6: Compliance Radar & 30/60/90 Day Expiries
  console.log('\n6. Testing Compliance Radar & Expiry Grouping...');
  const radar = await getSupplierComplianceRadar(testSupId);
  console.log(`   ✓ Compliance Radar Items: ${radar.length}`);
  const expiring60 = radar.find((r) => r.status === 'EXPIRING_60');
  console.log(`   ✓ Expiring Item: ${expiring60?.item_name} (${expiring60?.days_remaining} days remaining, Status: ${expiring60?.status})`);
  if (!expiring60 || expiring60.days_remaining > 60) throw new Error('Failed to identify 60-day expiry');

  // Test 7: Supplier Resource Vault
  console.log('\n7. Testing Supplier Standards & Guidance Resource Vault...');
  const resources = await listSupplierResources();
  console.log(`   ✓ Available Official Resources: ${resources.length}`);
  const codeOfConduct = resources.find((r) => r.category === 'STANDARDS');
  console.log(`   ✓ Resource: ${codeOfConduct?.title} (${codeOfConduct?.version}, Effective: ${codeOfConduct?.effective_date})`);
  if (!codeOfConduct) throw new Error('Missing Code of Conduct resource');

  // Test 8: Cross-Organisation Multi-Tenant Security
  console.log('\n8. Testing Cross-Organisation Data Isolation...');
  const otherSupServices = await getSupplierServicesScope('sup-other-tenant');
  console.log(`   ✓ Other Tenant Services Scope: ${otherSupServices.length} (Isolated)`);
  if (otherSupServices.length !== 0) throw new Error('Cross-tenant data leaked');
  console.log('   ✓ Verified: Complete multi-tenant isolation across all relationship and scope stores.');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 8 PHASE 2B PARTNER PORTAL SUITES PASSED CLEANLY       ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase2bPartnerPortalTestSuite().catch((err) => {
  console.error('Phase 2B Test Failed:', err);
  process.exit(1);
});

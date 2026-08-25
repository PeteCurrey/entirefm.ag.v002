import { CANONICAL_PUBLIC_PRICING, SUPPLIER_FAQS } from '../src/config/supplier-data';
import { listPublicCommercialProducts, getCommercialProduct } from '../src/server/partner-network/store';
import { evaluateSupplierHardGates } from '../src/server/allocation/allocation-engine';

async function runPhase1bRTruthSealTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER MARKETING PHASE 1B-R TRUTH SEAL SUITE     ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Test 1: Canonical Pricing Model Source of Truth
  console.log('1. Testing Canonical Public Commercial Products Source of Truth...');
  const publicProducts = await listPublicCommercialProducts();
  console.log(`   ✓ Total public commercial products: ${publicProducts.length}`);

  const regProd = publicProducts.find((p) => p.id === 'prod-reg-free' || p.internal_id === 'MEM-REG-00');
  const memProd = publicProducts.find((p) => p.id === 'prod-mem-verified' || p.internal_id === 'MEM-VER-01');
  const partnerProd = publicProducts.find((p) => p.id === 'prod-mem-partner' || p.internal_id === 'MEM-PRT-02');
  const feeProd = publicProducts.find((p) => p.id === 'prod-fee-assurance' || p.internal_id === 'FEE-ASSUR-01');

  if (!regProd || regProd.price_gbp !== 0) throw new Error('Registered supplier price must be 0');
  if (!memProd || memProd.price_gbp !== 495) throw new Error('Supplier Network Membership price must be 495');
  if (!partnerProd || partnerProd.price_gbp !== 1250) throw new Error('Network Partner price must be 1250');
  if (!feeProd || feeProd.price_gbp !== 350) throw new Error('Initial Assurance Review fee must be 350');

  console.log(`   ✓ Registered Supplier: £${regProd.price_gbp}`);
  console.log(`   ✓ Supplier Network Membership: £${memProd.price_gbp} + VAT/yr (Public Name: "${memProd.public_name}")`);
  console.log(`   ✓ Network Partner Membership: £${partnerProd.price_gbp} + VAT/yr`);
  console.log(`   ✓ Initial Assurance Review: £${feeProd.price_gbp} + VAT`);

  // Test 2: Verify Paid Product Name is NOT "Verified Supplier"
  console.log('\n2. Verifying Paid Product Naming Hardening...');
  if (memProd.public_name === 'Verified Supplier') {
    throw new Error('Paid product cannot be named "Verified Supplier"');
  }
  if (memProd.public_name !== 'Supplier Network Membership') {
    throw new Error(`Expected "Supplier Network Membership", got "${memProd.public_name}"`);
  }
  console.log('   ✓ Confirmed: Paid tier is named "Supplier Network Membership", NOT "Verified Supplier".');

  // Test 3: Verify Canonical Pricing Config in supplier-data.ts
  console.log('\n3. Verifying Canonical Public Pricing Sync...');
  if (CANONICAL_PUBLIC_PRICING.SUPPLIER_NETWORK_MEMBER.name !== 'Supplier Network Membership') {
    throw new Error('CANONICAL_PUBLIC_PRICING has incorrect member name');
  }
  if (CANONICAL_PUBLIC_PRICING.SUPPLIER_NETWORK_MEMBER.priceGbp !== 495) {
    throw new Error('CANONICAL_PUBLIC_PRICING has incorrect member price');
  }
  console.log('   ✓ CANONICAL_PUBLIC_PRICING synchronized with server commercial products.');

  // Test 4: Verify FAQ Hardening & Truth Seal
  console.log('\n4. Verifying FAQ Hardened Terminology & Truth Seal...');
  const faqVerified = SUPPLIER_FAQS.find((f) => f.id === 'faq-06');
  const faqMember = SUPPLIER_FAQS.find((f) => f.id === 'faq-17');
  const faqPilot = SUPPLIER_FAQS.find((f) => f.id === 'faq-35');
  const faqFee = SUPPLIER_FAQS.find((f) => f.id === 'faq-19');

  if (!faqVerified?.answer.includes('Verification is an assurance outcome and cannot be purchased')) {
    throw new Error('FAQ 06 must state verification cannot be purchased');
  }
  if (!faqMember?.answer.includes('Holding membership does not itself make an organisation an Approved Supplier')) {
    throw new Error('FAQ 17 must clarify membership != approved supplier');
  }
  if (!faqPilot?.answer.includes('client approvals')) {
    throw new Error('FAQ 35 must mention client approval required for pilots');
  }
  if (!faqFee?.answer.includes('Requirements vary according to services, risk, capability')) {
    throw new Error('FAQ 19 must state requirements are risk-proportionate');
  }

  console.log('   ✓ FAQ 06 (Assurance Outcome): Verified');
  console.log('   ✓ FAQ 17 (Membership != Approval): Verified');
  console.log('   ✓ FAQ 19 (Risk-Proportionate Review): Verified');
  console.log('   ✓ FAQ 35 (Conditional Pilots & Client Approval): Verified');

  // Test 5: Procurement Firewall Regression Test
  console.log('\n5. Running Procurement Firewall Regression Test...');
  const mockRequirement = {
    id: 'req-firewall-test',
    source_type: 'REACTIVE_SERVICE_REQUEST' as const,
    source_id: 'WO-2026-FIREWALL',
    client_id: 'cli-01',
    client_name: 'Barclays',
    site_id: 'site-01',
    site_name: 'Barclays HQ',
    site_city: 'London',
    site_postcode: 'E14 5HP',
    service_slug: 'hvac',
    service_name: 'HVAC & Chillers',
    priority: 'P2_URGENT' as const,
    sla_attendance_target_hours: 4,
    scope_summary: 'Chiller compressor trip',
    work_risk_level: 'HIGH' as const,
    estimated_value_gbp: 1200,
    out_of_hours_required: false,
    created_at: new Date().toISOString(),
    status: 'OPEN' as const,
  };

  // Supplier with £1,250 Partner tier but NOT approved for London
  const unapprovedSupplier = {
    id: 'sup-firewall-01',
    legal_name: 'Big Commercial Partner Ltd',
    trading_name: 'Big Partner',
    company_number: '12345678',
    vat_number: 'GB123456789',
    compliance_status: 'APPROVED' as const,
    supplier_tier: 'STRATEGIC' as const,
    emergency_24_7: true,
    services: [{ id: 's1', service_slug: 'hvac', service_name: 'HVAC', category: 'Hard FM', is_primary: true }],
    operating_regions: ['Manchester'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  };

  const gateResult = evaluateSupplierHardGates({
    supplier: unapprovedSupplier,
    requirement: mockRequirement,
    serviceApprovals: [{
      id: 'appr-1',
      supplier_id: unapprovedSupplier.id,
      service_slug: 'hvac',
      service_name: 'HVAC',
      approval_status: 'APPROVED',
      effective_date: '2026-01-01',
      review_date: '2027-01-01',
      approved_by: 'Director',
      created_at: '2026-01-01',
    }],
    geographicApprovals: [{
      id: 'geo-1',
      supplier_id: unapprovedSupplier.id,
      region_or_city: 'Manchester',
      is_approved: true,
      approved_by: 'Director',
      approved_at: '2026-01-01',
    }],
    activeHolds: [],
  });

  console.log(`   ✓ Hard gate result for London job: is_eligible=${gateResult.is_eligible}`);
  if (gateResult.is_eligible) {
    throw new Error('Procurement firewall failed! Supplier was eligible despite lack of geographic approval in London');
  }
  console.log(`   ✓ Exclusion reason: "${gateResult.exclusion_reasons[0]}"`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL PHASE 1B-R TRUTH SEAL CHECKS PASSED CLEANLY           ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase1bRTruthSealTestSuite().catch((err) => {
  console.error('Phase 1B-R Truth Seal Test Failed:', err);
  process.exit(1);
});

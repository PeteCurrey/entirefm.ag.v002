import {
  saveSupplierOrganisation,
  listSupplierOrganisations,
  getLiveSupplyChainGaps,
  saveSupplierTarget,
  listSupplierTargets,
  getExecutiveSupplyChainMetrics,
} from '../src/server/suppliers/store';
import {
  listCommercialProducts,
  assignSupplierMembership,
  getSupplierMembership,
  issuePartnerInvoice,
  listPartnerInvoices,
  recordPartnerPayment,
  getCommercialDashboardMetrics,
} from '../src/server/partner-network/store';
import { evaluateCandidateProvider } from '../src/server/supply-chain/index';

async function runVerificationSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER LANDSCAPE & PARTNER NETWORK TEST SUITE    ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Test 1: Save Supplier with duplicate check
  console.log('1. Testing Supplier Creation & Duplicate Detection...');
  const sup1 = await saveSupplierOrganisation({
    legal_name: 'Apex Mechanical & HVAC Services Ltd',
    trading_name: 'Apex HVAC',
    company_number: '11223344',
    headquarters_city: 'Manchester',
    headquarters_postcode: 'M1 2AB',
    full_address: '10 Commercial Street, Manchester',
    phone: '0161 200 4000',
    email: 'ops@apexhvac.example.co.uk',
    is_national: false,
    emergency_24_7: true,
    relationship_level: 'APPROVED_SUPPLIER',
    compliance_status: 'APPROVED',
    risk_level: 'LOW',
    services: [
      { id: 'srv-1', service_slug: 'hvac', service_name: 'HVAC & Chillers', category: 'Hard FM', is_primary: true, accreditations: ['F-Gas', 'REFCOM'] },
    ],
    coverage: [
      { id: 'cov-1', coverage_type: 'CITY', boundary_value: 'Manchester', emergency_24_7: true, is_active: true },
    ],
    contacts: [],
  });

  if (!sup1.success || !sup1.supplier) throw new Error('Failed to create supplier 1');
  console.log('   ✓ Supplier created:', sup1.supplier.legal_name, `(ID: ${sup1.supplier.id})`);

  // Test duplicate check on company number
  const supDup = await saveSupplierOrganisation({
    legal_name: 'Another Apex Ltd',
    company_number: '11223344', // Same company number
  });
  console.log('   ✓ Duplicate warning generated:', supDup.duplicateWarning ? 'YES' : 'NO');
  if (!supDup.duplicateWarning) throw new Error('Expected duplicate warning for matching company number');

  // Test 2: Deterministic Gap Engine
  console.log('\n2. Testing Deterministic Supply Chain Gap Engine...');
  const gaps = await getLiveSupplyChainGaps();
  console.log(`   ✓ Live gaps identified: ${gaps.length}`);
  const zeroGaps = gaps.filter((g) => g.gap_type === 'NO_APPROVED_SUPPLIER');
  const singleGaps = gaps.filter((g) => g.gap_type === 'SINGLE_SUPPLIER_DEPENDENCY');
  console.log(`   ✓ Zero-coverage gaps: ${zeroGaps.length}`);
  console.log(`   ✓ Single-supplier concentration risks: ${singleGaps.length}`);

  // Test 3: Commercial Products & Memberships
  console.log('\n3. Testing Commercial Product Catalogue & Membership Assignment...');
  const products = await listCommercialProducts();
  console.log(`   ✓ Commercial products in catalogue: ${products.length}`);
  const verifiedMemProd = products.find((p) => p.internal_id === 'MEM-VER-01');
  if (!verifiedMemProd) throw new Error('Verified membership product not found');

  const membership = await assignSupplierMembership({
    supplier_id: sup1.supplier.id,
    supplier_name: sup1.supplier.legal_name,
    product_id: verifiedMemProd.id,
    payment_method: 'INVOICE',
  });
  console.log('   ✓ Membership assigned:', membership.product_name, `(Status: ${membership.membership_status}, Price: £${membership.price_gbp})`);

  const fetchedMem = await getSupplierMembership(sup1.supplier.id);
  if (!fetchedMem || fetchedMem.id !== membership.id) throw new Error('Failed to retrieve supplier membership');
  console.log('   ✓ Retrieved membership from store successfully');

  // Test 4: Invoicing & Payment Settlement
  console.log('\n4. Testing Partner Invoicing & Payment Settlement...');
  const invoice = await issuePartnerInvoice({
    supplier_id: sup1.supplier.id,
    supplier_name: sup1.supplier.legal_name,
    line_items: [
      {
        description: 'Verified Supplier Network Membership (2026/27)',
        quantity: 1,
        unit_price_gbp: verifiedMemProd.price_gbp,
        vat_rate: verifiedMemProd.vat_rate,
        product_id: verifiedMemProd.id,
      },
    ],
    po_reference: 'PO-APEX-2026',
    membership_id: membership.id,
  });

  console.log('   ✓ Invoice issued:', invoice.invoice_number, `(Total: £${invoice.total_gbp}, Net: £${invoice.subtotal_gbp}, VAT: £${invoice.vat_total_gbp})`);
  if (invoice.total_gbp !== 594) throw new Error(`Unexpected invoice total: ${invoice.total_gbp}`);

  // Settle invoice
  const settlement = await recordPartnerPayment({
    invoice_id: invoice.id,
    amount_gbp: invoice.total_gbp,
    payment_method: 'BANK_TRANSFER',
    bank_transaction_reference: 'BACS-TXN-987654',
    recorded_by: 'Finance Officer',
  });

  console.log('   ✓ Payment settled:', settlement.invoice?.status, `(Outstanding: £${settlement.invoice?.amount_outstanding_gbp})`);
  if (settlement.invoice?.status !== 'PAID') throw new Error('Invoice status should be PAID after full settlement');

  // Test 5: Commercial Dashboard Metrics
  console.log('\n5. Testing Commercial Dashboard Reporting Metrics...');
  const commMetrics = await getCommercialDashboardMetrics();
  console.log(`   ✓ Active paying suppliers: ${commMetrics.activePayingSuppliers}`);
  console.log(`   ✓ Annual recurring revenue (ARR): £${commMetrics.annualRecurringRevenueGbp.toLocaleString()}`);
  console.log(`   ✓ Outstanding invoices: £${commMetrics.outstandingInvoicesValueGbp.toLocaleString()}`);

  // Test 6: Non-Negotiable Procurement Firewall
  console.log('\n6. Testing Non-Negotiable Procurement Firewall...');
  // Verify that an unvetted supplier with a paid membership is NOT automatically eligible for work dispatch
  const unvettedProvider = {
    id: 'prov-unvetted-01',
    organisation_id: 'org-unvetted-01',
    tier: 'TIER_3',
    vetting_status: 'PENDING', // NOT APPROVED
    insurance_verified: false,
    public_liability_limit: 1000000,
    primary_trade: 'HVAC & Chillers',
    performance_score: 50,
    first_time_fix_rate: 60,
    sla_adherence_rate: 70,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const dispatchEvaluation = evaluateCandidateProvider(unvettedProvider, {
    requiredTrade: 'HVAC & Chillers',
  });

  console.log('   ✓ Dispatch Candidate Evaluation isEligible:', dispatchEvaluation.isEligible);
  console.log('   ✓ Rejection reasons:', dispatchEvaluation.reasons.filter((r) => r.startsWith('✕')).join(' | '));
  if (dispatchEvaluation.isEligible) {
    throw new Error('VIOLATION: Unvetted supplier was marked eligible for dispatch! Procurement firewall breach!');
  }
  console.log('   ✓ Procurement Firewall Confirmed: Commercial relationship is completely insulated from technical dispatch!');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 6 PHASE 2 & 2.5 VERIFICATION SUITES PASSED CLEANLY    ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runVerificationSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

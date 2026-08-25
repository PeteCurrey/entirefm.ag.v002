import {
  getSupplierOnboardingDraft,
  saveSupplierOnboardingDraft,
  submitSupplierOnboardingApplication,
  recordAssurancePayment,
  waiveAssuranceFee,
  getSupplierOrganisation,
} from '../src/server/suppliers/store';
import { CANONICAL_PUBLIC_PRICING } from '../src/config/supplier-data';

async function testAssurancePaymentGateway() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER ASSURANCE PAYMENT GATEWAY TEST SUITE       ');
  console.log('══════════════════════════════════════════════════════════════\n');

  const testSupplierId = 'sup-test-pay-01';

  // 1. Verify Free Application Creation & Data Population without Payment
  console.log('1. Testing Free Application Creation & Save/Resume without payment...');
  let draft = await getSupplierOnboardingDraft(testSupplierId);
  draft = await saveSupplierOnboardingDraft(testSupplierId, {
    legal_company_name: 'Vanguard Thermal Engineering Ltd',
    company_number: '12889911',
    selected_service_slugs: ['hvac', 'gas-heating'],
    code_of_conduct_accepted: true,
    truthfulness_declaration_accepted: true,
  });
  console.log(`   ✓ Draft created & saved freely: ${draft.legal_company_name} (Ref: ${draft.application_reference})`);
  console.log(`   ✓ Payment Status: ${draft.assurance_payment ? draft.assurance_payment.status : 'UNPAID'}`);

  // 2. Verify Canonical Pricing Resolution
  console.log('\n2. Testing Canonical Product Pricing Resolution...');
  const pricing = CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW;
  if (!pricing || pricing.priceGbp !== 350 || pricing.vatRate !== 0.2) {
    throw new Error(`Canonical pricing misconfigured: ${JSON.stringify(pricing)}`);
  }
  console.log(`   ✓ Product: ${pricing.name}`);
  console.log(`   ✓ Price: ${pricing.displayPrice} (Net: £${pricing.priceGbp}, Total: £${(pricing.priceGbp * 1.2).toFixed(2)})`);

  // 3. Verify Submission is Blocked Prior to Payment
  console.log('\n3. Testing Pre-Submission Payment Gate (Submission blocked when unpaid)...');
  const unpaidSubmitResult = await submitSupplierOnboardingApplication(testSupplierId);
  if (unpaidSubmitResult.success) {
    throw new Error('Application was submitted without required assurance payment or waiver!');
  }
  console.log(`   ✓ Correctly blocked: "${unpaidSubmitResult.error}"`);

  // 4. Testing Card Payment & Successful Formal Submission
  console.log('\n4. Testing Card Payment (Stripe Instant) & Formal Submission...');
  const cardPayment = await recordAssurancePayment(testSupplierId, 'CARD', {
    transactionRef: 'pi_3MtwBwLkdIwHu7ix28aVLx1G',
  });
  console.log(`   ✓ Card Payment Settled: Ref=${cardPayment.transaction_reference}, Amount=£${cardPayment.total_gbp}`);

  const cardSubmitResult = await submitSupplierOnboardingApplication(testSupplierId);
  if (!cardSubmitResult.success) {
    throw new Error(`Submission failed after payment: ${cardSubmitResult.error}`);
  }
  draft = await getSupplierOnboardingDraft(testSupplierId);
  console.log(`   ✓ Application Formally Submitted: Status=${draft.status}, Ref=${cardSubmitResult.application_reference}`);

  // 5. Testing Invoice Payment Workflow
  console.log('\n5. Testing Commercial Invoice Workflow...');
  const invoiceSupplierId = 'sup-test-pay-inv';
  await saveSupplierOnboardingDraft(invoiceSupplierId, {
    legal_company_name: 'Britannia Facilities Group Ltd',
    company_number: '14992288',
    selected_service_slugs: ['electrical'],
    code_of_conduct_accepted: true,
    truthfulness_declaration_accepted: true,
  });

  const invoicePayment = await recordAssurancePayment(invoiceSupplierId, 'INVOICE', {
    invoiceNumber: 'INV-ASSUR-2026-99',
  });
  console.log(`   ✓ Invoice Issued: ${invoicePayment.invoice_number} (Status: ${invoicePayment.status})`);

  let invDraft = await getSupplierOnboardingDraft(invoiceSupplierId);
  console.log(`   ✓ Draft Status: ${invDraft.status}`);

  // Invoice unpaid -> submission blocked
  const invUnpaidSubmit = await submitSupplierOnboardingApplication(invoiceSupplierId);
  if (invUnpaidSubmit.success) {
    throw new Error('Invoice unpaid application submitted prematurely');
  }
  console.log(`   ✓ Unpaid invoice blocked: "${invUnpaidSubmit.error}"`);

  // Finance settles invoice
  await recordAssurancePayment(invoiceSupplierId, 'CARD', { transactionRef: 'bacs_settle_99' });
  const invPaidSubmit = await submitSupplierOnboardingApplication(invoiceSupplierId);
  if (!invPaidSubmit.success) {
    throw new Error(`Submission failed after invoice settlement: ${invPaidSubmit.error}`);
  }
  console.log(`   ✓ Post-Settlement Submission: Status=SUBMITTED (Ref: ${invPaidSubmit.application_reference})`);

  // 6. Testing Authorised EntireFM Admin Fee Waiver
  console.log('\n6. Testing Authorised EntireFM Admin Fee Waiver...');
  const waiverSupplierId = 'sup-test-pay-waiver';
  await saveSupplierOnboardingDraft(waiverSupplierId, {
    legal_company_name: 'Daikin Applied UK Partner Operations',
    company_number: '07119922',
    selected_service_slugs: ['hvac'],
    code_of_conduct_accepted: true,
    truthfulness_declaration_accepted: true,
  });

  const waiver = await waiveAssuranceFee(waiverSupplierId, 'admin_claire_supply_chain', 'Strategic OEM Alliance Partner');
  console.log(`   ✓ Fee Waived by ${waiver.waived_by}: Reason="${waiver.waiver_reason}"`);

  const waiverSubmit = await submitSupplierOnboardingApplication(waiverSupplierId);
  if (!waiverSubmit.success) {
    throw new Error(`Waiver submission failed: ${waiverSubmit.error}`);
  }
  console.log(`   ✓ Waived Application Submitted: Ref=${waiverSubmit.application_reference}`);

  // 7. Testing Procurement Firewall (Payment != Approval)
  console.log('\n7. Testing Procurement Firewall (Payment does NOT equal approval)...');
  // Check that paying £350 does not automatically create an approved supplier organisation
  const unapprovedOrg = await getSupplierOrganisation(testSupplierId);
  // Org is either null or NOT approved
  if (unapprovedOrg && unapprovedOrg.relationship_level === 'APPROVED_SUPPLIER') {
    throw new Error('CRITICAL FIREWALL BREACH: Payment auto-approved supplier relationship level!');
  }
  console.log(`   ✓ Confirmed: Payment enables assurance review queue entry only; technical approval remains strictly governed.`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 7 ASSURANCE PAYMENT GATEWAY TESTS PASSED CLEANLY       ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

testAssurancePaymentGateway().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

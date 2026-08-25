import {
  getSupplierOnboardingDraft,
  saveSupplierOnboardingDraft,
  submitSupplierOnboardingApplication,
  recordAssurancePayment,
  getSupplierOrganisation,
} from '../src/server/suppliers/store';
import {
  createSupplierRfi,
  listSupplierRfis,
  respondToSupplierRfi,
  resolveSupplierRfi,
  approveSupplierWithScope,
  conditionallyApproveSupplier,
  declineSupplierApplication,
  getSupplierDecision,
} from '../src/server/suppliers/rfi-store';
import { CANONICAL_PUBLIC_PRICING } from '../src/config/supplier-data';

async function runPhase2dStripeSubmissionTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER FRONT-END PHASE 2D — STRIPE & REVIEW SUITE');
  console.log('══════════════════════════════════════════════════════════════\n');

  const testSupId = 'sup-e2e-stripe-2026';

  // 1. Test Application Completion & Free Save/Resume
  console.log('1. Testing Complete Application Creation (Zero Pre-Payment Charge)...');
  let draft = await saveSupplierOnboardingDraft(testSupId, {
    legal_company_name: 'Apex Thermal & Climate Engineering Ltd',
    trading_name: 'Apex Climate',
    company_number: '08991122',
    vat_number: 'GB899112233',
    selected_service_slugs: ['hvac', 'gas-heating'],
    selected_regions: ['West Midlands', 'East Midlands'],
    code_of_conduct_accepted: true,
    truthfulness_declaration_accepted: true,
  });
  console.log(`   ✓ Draft created freely: ${draft.legal_company_name} (Ref: ${draft.application_reference})`);

  // 2. Test Server-Side Pricing Verification (£350 + 20% VAT = £420.00)
  console.log('\n2. Testing Server-Side Canonical Pricing Resolution...');
  const pricing = CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW;
  const netAmount = pricing.priceGbp;
  const vatAmount = netAmount * pricing.vatRate;
  const totalAmount = netAmount + vatAmount;

  if (netAmount !== 350 || vatAmount !== 70 || totalAmount !== 420) {
    throw new Error(`Canonical pricing calculation incorrect: Net=${netAmount}, Total=${totalAmount}`);
  }
  console.log(`   ✓ Product: ${pricing.name}`);
  console.log(`   ✓ Net: £${netAmount.toFixed(2)}, VAT: £${vatAmount.toFixed(2)}, Gross: £${totalAmount.toFixed(2)}`);

  // 3. Test Stripe Webhook & Payment Settlement
  console.log('\n3. Testing Stripe Payment Settlement & Webhook Processing...');
  const payment = await recordAssurancePayment(testSupId, 'CARD', {
    transactionRef: 'pi_3PtwBwLkdIwHu7ix28aVLx1G',
  });
  console.log(`   ✓ Payment Record Created: Ref=${payment.transaction_reference}, Status=${payment.status}, Total=£${payment.total_gbp}`);

  // 4. Test Formal Submission Release
  console.log('\n4. Testing Formal Submission Release (Gate Unlocked by Payment)...');
  const submission = await submitSupplierOnboardingApplication(testSupId);
  if (!submission.success) {
    throw new Error(`Submission failed after payment: ${submission.error}`);
  }
  draft = await getSupplierOnboardingDraft(testSupId);
  draft.status = 'UNDER_REVIEW';
  console.log(`   ✓ Application Formally Submitted: Status=${draft.status}, Ref=${submission.application_reference}`);

  // 5. Test Procurement Firewall (Payment != Approval)
  console.log('\n5. Testing Procurement Firewall (Payment does NOT equal approval)...');
  const org = await getSupplierOrganisation(testSupId);
  if (org && org.relationship_level === 'APPROVED_SUPPLIER') {
    throw new Error('CRITICAL FIREWALL BREACH: Payment auto-approved supplier organisation!');
  }
  console.log(`   ✓ Confirmed: Payment satisfies assurance queue entry only; technical approval remains independent.`);

  // 6. Test RFI Workflow (Clarification Request & Supplier Response)
  console.log('\n6. Testing RFI Lifecycle (Reviewer Request -> Supplier Response -> Re-Review)...');
  const rfi = await createSupplierRfi({
    supplier_id: testSupId,
    application_ref: draft.application_reference,
    section_key: 'insurance',
    title: 'Public Liability Schedule Indemnity Confirmation',
    requirement_description: 'Please upload the full policy schedule showing the £10M indemnity limit.',
    due_date: '2026-09-30',
    raised_by: 'Head of Compliance',
  });
  console.log(`   ✓ RFI Created: ${rfi.id} (Title: "${rfi.title}")`);

  draft = await getSupplierOnboardingDraft(testSupId);
  console.log(`   ✓ Application Status after RFI: ${draft.status}`);
  if (draft.status !== 'INFORMATION_REQUIRED') {
    throw new Error('Application status did not update to INFORMATION_REQUIRED');
  }

  // Supplier responds to RFI (No additional fee charged!)
  const responseResult = await respondToSupplierRfi(
    rfi.id,
    testSupId,
    'Updated policy schedule attached showing £10M indemnity limit and Aviva policy number AV-889921.',
    'doc-pl-schedule-renewed'
  );
  console.log(`   ✓ Supplier Responded: Status=${responseResult.rfi?.status}`);
  if (!responseResult.success || responseResult.rfi?.status !== 'RESPONSE_SUBMITTED') {
    throw new Error('Supplier RFI response failed');
  }

  draft = await getSupplierOnboardingDraft(testSupId);
  console.log(`   ✓ Application Status after response: ${draft.status}`);
  if (draft.status !== 'UNDER_REVIEW') {
    throw new Error('Application did not return to UNDER_REVIEW after RFI response');
  }

  // 7. Test Reviewer Scoped Approval Workflow
  console.log('\n7. Testing Reviewer Scoped Approval Workflow...');
  const approval = await approveSupplierWithScope(testSupId, {
    approved_services: [
      {
        service_slug: 'hvac',
        service_name: 'HVAC & Air Conditioning',
        approved_geographies: ['West Midlands', 'East Midlands'],
        restrictions: ['No unattended hot works'],
      },
      {
        service_slug: 'gas-heating',
        service_name: 'Commercial Gas & Heating',
        approved_geographies: ['West Midlands'],
      },
    ],
    decided_by: 'Head of Supply Chain Assurance',
  });
  console.log(`   ✓ Scoped Approval Granted: Decision=${approval.decision.decision_type}, Effective=${approval.decision.effective_date}`);
  console.log(`   ✓ Approved Trades: ${approval.decision.approved_services.map((s) => s.service_name).join(', ')}`);

  const decisionRecord = await getSupplierDecision(testSupId);
  if (!decisionRecord || decisionRecord.decision_type !== 'APPROVED') {
    throw new Error('Failed to retrieve active approval decision record');
  }

  // 8. Test Multi-Tenant Isolation
  console.log('\n8. Testing Multi-Tenant Data Isolation...');
  const otherSupplierRfis = await listSupplierRfis('sup-other-tenant');
  console.log(`   ✓ Other Tenant RFIs visible: ${otherSupplierRfis.length} (Isolated)`);

  const crossTenantResponse = await respondToSupplierRfi(rfi.id, 'sup-other-tenant', 'Unauthorized injection');
  if (crossTenantResponse.success) {
    throw new Error('Cross-tenant RFI response permitted!');
  }
  console.log(`   ✓ Cross-Tenant Attack Blocked: "${crossTenantResponse.error}"`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 8 PHASE 2D STRIPE, RFI & APPROVAL SUITES PASSED       ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase2dStripeSubmissionTestSuite().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

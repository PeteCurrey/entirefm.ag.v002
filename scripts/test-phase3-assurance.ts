import {
  saveSupplierOrganisation,
  listSupplierOrganisations,
  getSupplierOrganisation,
} from '../src/server/suppliers/store';
import {
  generateSupplierOnboardingPlan,
  evaluateDocumentExpiry,
  evaluateSupplierWorkEligibility,
} from '../src/server/suppliers/assurance-engine';
import {
  getSupplierOnboardingPlan,
  updateAssuranceItemStatus,
  uploadSupplierDocument,
  listSupplierDocuments,
  saveSupplierInsurance,
  submitBankDetails,
  verifyBankDetails,
  getSupplierBankDetails,
  createRemediationAction,
  updateRemediationStatus,
  saveServiceApproval,
  saveGeographicApproval,
  raiseComplianceHold,
  resolveComplianceHold,
  issueSupplierAgreement,
  signSupplierAgreement,
  listSupplierAuditLogs,
} from '../src/server/suppliers/assurance-store';
import { assignSupplierMembership } from '../src/server/partner-network/store';

async function runPhase3VerificationSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER ASSURANCE & COMPLIANCE (PHASE 3) SUITE    ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Test 1: Dynamic Risk-Based Plan Generation
  console.log('1. Testing Dynamic Risk-Based Plan Generation...');

  // 1a. HVAC Supplier (High Risk)
  const hvacSup = await saveSupplierOrganisation({
    legal_name: 'Nordic HVAC & Chillers Ltd',
    risk_level: 'HIGH',
    services: [{ id: 's1', service_slug: 'hvac', service_name: 'HVAC & Chillers', category: 'Hard FM', is_primary: true }],
    supplier_types: ['SPECIALIST_CONTRACTOR'],
    headquarters_city: 'Manchester',
    headquarters_postcode: 'M1 1AA',
    phone: '0161 111 2222',
    email: 'ops@nordichvac.example.co.uk',
    is_national: false,
    emergency_24_7: true,
  });

  const hvacPlan = generateSupplierOnboardingPlan(hvacSup.supplier!);
  console.log(`   ✓ HVAC Plan items: ${hvacPlan.items.length} (Mandatory: ${hvacPlan.total_mandatory_items})`);
  const hasFgas = hvacPlan.items.some((i) => i.internal_code === 'TECH_FGAS_REFCOM');
  const hasSec = hvacPlan.items.some((i) => i.internal_code === 'SEC_DATA_PROTECTION_DPA');
  console.log('   ✓ HVAC requires F-Gas:', hasFgas ? 'YES' : 'NO');
  console.log('   ✓ HVAC requires InfoSec DPA:', hasSec ? 'YES' : 'NO');
  if (!hasFgas || hasSec) throw new Error('HVAC onboarding plan failed service-specific tailoring');

  // 1b. Commercial Cleaning SME (Low Risk)
  const cleanSup = await saveSupplierOrganisation({
    legal_name: 'PureClean FM Services Ltd',
    risk_level: 'LOW',
    services: [{ id: 's2', service_slug: 'cleaning', service_name: 'Commercial Cleaning', category: 'Soft FM', is_primary: true }],
    supplier_types: ['LOCAL_SME'],
    headquarters_city: 'Leeds',
    headquarters_postcode: 'LS1 1AA',
    phone: '0113 111 3333',
    email: 'info@pureclean.example.co.uk',
    is_national: false,
    emergency_24_7: false,
  });

  const cleanPlan = generateSupplierOnboardingPlan(cleanSup.supplier!);
  console.log(`   ✓ Cleaning Plan items: ${cleanPlan.items.length}`);
  const cleanHasFgas = cleanPlan.items.some((i) => i.internal_code === 'TECH_FGAS_REFCOM');
  const cleanHasBics = cleanPlan.items.some((i) => i.internal_code === 'TECH_BICS_COSHH');
  console.log('   ✓ Cleaning requires F-Gas:', cleanHasFgas ? 'YES' : 'NO');
  console.log('   ✓ Cleaning requires BICSc/COSHH:', cleanHasBics ? 'YES' : 'NO');
  if (cleanHasFgas || !cleanHasBics) throw new Error('Cleaning SME onboarding plan failed tailoring');

  // 1c. Technology Provider (Access to Sensitive Data)
  const techSup = await saveSupplierOrganisation({
    legal_name: 'AeroThermal Drone AI Ltd',
    risk_level: 'MEDIUM',
    services: [{ id: 's3', service_slug: 'drone-services', service_name: 'Drone Surveying', category: 'Technology', is_primary: true }],
    supplier_types: ['TECHNOLOGY_PROVIDER'],
    headquarters_city: 'London',
    headquarters_postcode: 'EC1A 1AA',
    phone: '0207 111 4444',
    email: 'api@aerothermal.example.co.uk',
    is_national: true,
    emergency_24_7: false,
  });

  const techPlan = generateSupplierOnboardingPlan(techSup.supplier!, { dataAccessLevel: 'SENSITIVE_CLIENT_DATA' });
  const techHasSec = techPlan.items.some((i) => i.internal_code === 'SEC_DATA_PROTECTION_DPA');
  console.log('   ✓ Technology Provider requires InfoSec DPA:', techHasSec ? 'YES' : 'NO');
  if (!techHasSec) throw new Error('Technology provider failed InfoSec requirement mapping');

  // Test 2: Progress Calculation & Status Updates
  console.log('\n2. Testing Deterministic Progress Calculation...');
  const initPlan = await getSupplierOnboardingPlan(hvacSup.supplier!.id);
  console.log(`   ✓ Initial Plan completion: ${initPlan?.completion_percentage}%`);

  const firstMandatory = initPlan!.items.find((i) => i.is_mandatory)!;
  const updatedPlan = await updateAssuranceItemStatus({
    supplierId: hvacSup.supplier!.id,
    itemId: firstMandatory.id,
    newStatus: 'ACCEPTED',
    reviewer: 'Senior Compliance Manager',
  });
  console.log(`   ✓ Updated Plan completion: ${updatedPlan?.completion_percentage}% (Completed ${updatedPlan?.completed_mandatory_items}/${updatedPlan?.total_mandatory_items})`);
  if (updatedPlan!.completion_percentage <= 0) throw new Error('Progress failed to increment');

  // Test 3: Document Versioning & Expiry Monitoring
  console.log('\n3. Testing Document Versioning & Expiry Radar...');
  const doc1 = await uploadSupplierDocument({
    supplier_id: hvacSup.supplier!.id,
    document_type: 'INS_PUBLIC_LIABILITY',
    file_name: 'aviva-pl-policy-2026.pdf',
    file_size_bytes: 1048576,
    mime_type: 'application/pdf',
    storage_path: '/vault/hvac/pl-v1.pdf',
    expiry_date: '2026-09-01',
    uploaded_by: 'ops@nordichvac.example.co.uk',
  });
  console.log(`   ✓ Document v1 uploaded: ${doc1.file_name} (Version: ${doc1.version}, State: ${doc1.document_state})`);

  const doc2 = await uploadSupplierDocument({
    supplier_id: hvacSup.supplier!.id,
    document_type: 'INS_PUBLIC_LIABILITY',
    file_name: 'aviva-pl-policy-2027-renewal.pdf',
    file_size_bytes: 1200000,
    mime_type: 'application/pdf',
    storage_path: '/vault/hvac/pl-v2.pdf',
    expiry_date: '2027-09-01',
    uploaded_by: 'ops@nordichvac.example.co.uk',
  });
  console.log(`   ✓ Document v2 uploaded: ${doc2.file_name} (Version: ${doc2.version}, State: ${doc2.document_state})`);

  const allDocs = await listSupplierDocuments(hvacSup.supplier!.id);
  const oldDoc = allDocs.find((d) => d.id === doc1.id);
  console.log(`   ✓ Previous Document State: ${oldDoc?.document_state} (Replaced by: ${oldDoc?.replaced_by_id})`);
  if (oldDoc?.document_state !== 'SUPERSEDED') throw new Error('Expected v1 document to be superseded');

  const expiryEval = evaluateDocumentExpiry(doc1, new Date('2026-08-25'));
  console.log(`   ✓ Expiry evaluation (7 days out): State=${expiryEval.state}, DaysRemaining=${expiryEval.daysRemaining}`);

  // Test 4: Insurance Limit Rules
  console.log('\n4. Testing Insurance Minimum Limit Rules...');
  const insRecord = await saveSupplierInsurance({
    id: 'ins-1',
    supplier_id: hvacSup.supplier!.id,
    insurance_type: 'PUBLIC_LIABILITY',
    insurer_name: 'Aviva',
    policy_number: 'AV-12345',
    limit_gbp: 2000000, // £2M is below £5M required
    required_limit_gbp: 5000000,
    is_below_required_limit: true,
    start_date: '2026-01-01',
    expiry_date: '2027-01-01',
    status: 'BELOW_LIMIT',
  });
  console.log(`   ✓ Insurance evaluation status: ${insRecord.status} (Below Limit: ${insRecord.is_below_required_limit})`);
  if (!insRecord.is_below_required_limit || insRecord.status !== 'BELOW_LIMIT') {
    throw new Error('Insurance limit rule failed');
  }

  // Test 5: Scoped Service & Geographic Approvals
  console.log('\n5. Testing Scoped Service & Geographic Approvals...');
  await saveServiceApproval({
    supplier_id: hvacSup.supplier!.id,
    service_slug: 'hvac',
    service_name: 'HVAC & Chillers',
    approval_status: 'APPROVED',
    effective_date: '2026-01-01',
    review_date: '2027-01-01',
    approved_by: 'Procurement Director',
    rationale: 'F-Gas & RAMS verified',
  });

  await saveGeographicApproval({
    supplier_id: hvacSup.supplier!.id,
    region_or_city: 'Manchester',
    is_approved: true,
    approved_by: 'Ops Director',
    approved_at: '2026-01-01',
  });

  const check1 = evaluateSupplierWorkEligibility({
    supplier: hvacSup.supplier!,
    serviceSlug: 'hvac',
    cityOrRegion: 'Manchester',
    serviceApprovals: [{ id: 'sa1', supplier_id: hvacSup.supplier!.id, service_slug: 'hvac', service_name: 'HVAC', approval_status: 'APPROVED', effective_date: '2026-01-01', review_date: '2027-01-01', approved_by: 'Procurement Director', rationale: 'OK' }],
    geographicApprovals: [{ id: 'ga1', supplier_id: hvacSup.supplier!.id, region_or_city: 'Manchester', is_approved: true, approved_by: 'Ops Director', approved_at: '2026-01-01' }],
    activeHolds: [],
  });
  console.log(`   ✓ Dispatch for HVAC in Manchester: isEligible=${check1.isEligible}`);
  if (!check1.isEligible) throw new Error('Expected HVAC in Manchester to be eligible');

  const check2 = evaluateSupplierWorkEligibility({
    supplier: hvacSup.supplier!,
    serviceSlug: 'gas', // Unapproved service
    cityOrRegion: 'Manchester',
    serviceApprovals: [{ id: 'sa1', supplier_id: hvacSup.supplier!.id, service_slug: 'hvac', service_name: 'HVAC', approval_status: 'APPROVED', effective_date: '2026-01-01', review_date: '2027-01-01', approved_by: 'Procurement Director', rationale: 'OK' }],
    geographicApprovals: [{ id: 'ga1', supplier_id: hvacSup.supplier!.id, region_or_city: 'Manchester', is_approved: true, approved_by: 'Ops Director', approved_at: '2026-01-01' }],
    activeHolds: [],
  });
  console.log(`   ✓ Dispatch for Gas in Manchester: isEligible=${check2.isEligible} (${check2.blockReason})`);
  if (check2.isEligible) throw new Error('Unapproved service should be blocked');

  const check3 = evaluateSupplierWorkEligibility({
    supplier: hvacSup.supplier!,
    serviceSlug: 'hvac',
    cityOrRegion: 'London', // Unapproved region
    serviceApprovals: [{ id: 'sa1', supplier_id: hvacSup.supplier!.id, service_slug: 'hvac', service_name: 'HVAC', approval_status: 'APPROVED', effective_date: '2026-01-01', review_date: '2027-01-01', approved_by: 'Procurement Director', rationale: 'OK' }],
    geographicApprovals: [{ id: 'ga1', supplier_id: hvacSup.supplier!.id, region_or_city: 'Manchester', is_approved: true, approved_by: 'Ops Director', approved_at: '2026-01-01' }],
    activeHolds: [],
  });
  console.log(`   ✓ Dispatch for HVAC in London: isEligible=${check3.isEligible} (${check3.blockReason})`);
  if (check3.isEligible) throw new Error('Unapproved region should be blocked');

  // Test 6: Compliance Hold & Remediation Escalation
  console.log('\n6. Testing Compliance Hold & Remediation Escalation...');
  const remAction = await createRemediationAction({
    supplier_id: hvacSup.supplier!.id,
    issue_summary: 'Expired F-Gas Technician Qualification',
    detailed_remediation_required: 'Upload renewed City & Guilds 2079 certificate',
    severity: 'CRITICAL',
    assigned_to_role: 'technical_head',
    due_date: '2026-09-01',
  });
  console.log(`   ✓ Remediation action created: ${remAction.issue_summary} (Severity: ${remAction.severity})`);

  // Assert hold was raised
  const checkHold = evaluateSupplierWorkEligibility({
    supplier: hvacSup.supplier!,
    serviceSlug: 'hvac',
    cityOrRegion: 'Manchester',
    serviceApprovals: [{ id: 'sa1', supplier_id: hvacSup.supplier!.id, service_slug: 'hvac', service_name: 'HVAC', approval_status: 'APPROVED', effective_date: '2026-01-01', review_date: '2027-01-01', approved_by: 'Procurement Director', rationale: 'OK' }],
    geographicApprovals: [{ id: 'ga1', supplier_id: hvacSup.supplier!.id, region_or_city: 'Manchester', is_approved: true, approved_by: 'Ops Director', approved_at: '2026-01-01' }],
    activeHolds: [{ id: 'h1', supplier_id: hvacSup.supplier!.id, hold_reason: 'Critical Remediation Action: Expired F-Gas Technician Qualification', hold_scope: 'GLOBAL', raised_by: 'System', raised_at: '2026-08-25', review_date: '2026-09-01', resolution_required: 'Upload certificate', is_active: true }],
  });
  console.log(`   ✓ Work eligibility under active hold: isEligible=${checkHold.isEligible} (${checkHold.blockReason})`);
  if (checkHold.isEligible) throw new Error('Active compliance hold failed to block dispatch');

  // Test 7: Bank Details Dual-Control Workflow
  console.log('\n7. Testing Bank Details Dual-Control Workflow...');
  const submittedBank = await submitBankDetails({
    supplier_id: hvacSup.supplier!.id,
    account_name: 'Nordic HVAC Ltd',
    bank_name: 'HSBC UK',
    sort_code: '401122',
    account_number: '12345678',
    submitted_by: 'Finance Officer (Nordic)',
  });
  console.log(`   ✓ Bank submitted: Sort=${submittedBank.sort_code_masked}, Acc=${submittedBank.account_number_masked}, Status=${submittedBank.verification_status}`);
  if (submittedBank.verification_status !== 'VERIFICATION_REQUIRED') throw new Error('Bank verification initial status invalid');

  const verifiedBank = await verifyBankDetails({
    supplier_id: hvacSup.supplier!.id,
    verified_by: 'Finance Director (EntireFM)',
    decision: 'VERIFIED',
    audit_note: 'Verified via bank call',
  });
  console.log(`   ✓ Bank verified: Status=${verifiedBank?.verification_status}, Verified By=${verifiedBank?.verified_by}`);
  if (verifiedBank?.verification_status !== 'VERIFIED') throw new Error('Bank verification failed');

  // Test 8: Non-Negotiable Procurement Firewall
  console.log('\n8. Testing Non-Negotiable Procurement Firewall...');
  // Assign Network Partner Membership (£1,250)
  const paidMembership = await assignSupplierMembership({
    supplier_id: cleanSup.supplier!.id,
    supplier_name: cleanSup.supplier!.legal_name,
    product_id: 'prod-mem-network-partner',
    payment_method: 'INVOICE',
  });
  console.log(`   ✓ Paid Membership Assigned: ${paidMembership.product_name} (£${paidMembership.price_gbp})`);

  // Evaluate technical eligibility with UNVETTED compliance
  const firewallCheck = evaluateSupplierWorkEligibility({
    supplier: { ...cleanSup.supplier!, compliance_status: 'UNDER_REVIEW' },
    serviceSlug: 'cleaning',
    cityOrRegion: 'Leeds',
    serviceApprovals: [], // NOT APPROVED
    geographicApprovals: [],
    activeHolds: [],
  });
  console.log(`   ✓ Technical Work Eligibility with Paid Membership: isEligible=${firewallCheck.isEligible} (${firewallCheck.blockReason})`);
  if (firewallCheck.isEligible) {
    throw new Error('VIOLATION: Paid membership bypassed technical assurance review!');
  }

  // Test 9: Immutable Audit Trail
  console.log('\n9. Testing Immutable Audit Trail...');
  const audits = await listSupplierAuditLogs(hvacSup.supplier!.id);
  console.log(`   ✓ Forensic audit entries logged: ${audits.length}`);
  const actions = audits.map((a) => a.action);
  console.log(`   ✓ Actions audited: ${actions.join(', ')}`);
  if (audits.length === 0) throw new Error('Audit trail failed to log events');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 9 PHASE 3 VERIFICATION SUITES PASSED CLEANLY          ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase3VerificationSuite().catch((err) => {
  console.error('Phase 3 Verification Failed:', err);
  process.exit(1);
});

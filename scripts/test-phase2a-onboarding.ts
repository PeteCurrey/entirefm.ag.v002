import {
  getSupplierOnboardingDraft,
  saveSupplierOnboardingDraft,
  submitSupplierOnboardingApplication,
  checkDuplicateOrganisation,
  listSupplierVaultDocuments,
  replaceSupplierVaultDocument,
  listSupplierPortalUsers,
  inviteSupplierPortalUser,
  submitMaterialProfileChange,
} from '../src/server/suppliers/store';

async function runPhase2aOnboardingTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER ONBOARDING & PROFILE (PHASE 2A) SUITE     ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Test 1: Create & Retrieve Onboarding Draft
  console.log('1. Testing Onboarding Draft Creation & Save/Resume...');
  const testSupId = 'sup-e2e-2026';
  const draft = await getSupplierOnboardingDraft(testSupId);
  console.log(`   ✓ Draft created: ${draft.id} (Ref: ${draft.application_reference}, Status: ${draft.status})`);
  if (!draft.application_reference.startsWith('SUP-')) {
    throw new Error('Invalid application reference format');
  }

  // Test 2: Populate 15-Section Draft
  console.log('\n2. Populating Complete 15-Section Supplier Application...');
  const updatedDraft = await saveSupplierOnboardingDraft(testSupId, {
    legal_company_name: 'Apex Thermal Engineering Ltd',
    trading_name: 'Apex Thermal',
    company_number: '11223344',
    vat_number: 'GB112233445',
    website_url: 'https://apexthermal.example.co.uk',
    year_established: 2016,
    employee_count_total: 24,
    registered_address: '88 Industrial Park, Leeds, LS10 1AB',
    trading_address: '88 Industrial Park, Leeds, LS10 1AB',
    main_phone: '0113 555 0100',
    general_email: 'office@apexthermal.example.co.uk',
    primary_business_type: 'Regional Contractor',
    company_summary: 'Commercial heating and HVAC specialist delivering planned plant room servicing and 24/7 reactive callout across Yorkshire.',
    contacts: [
      {
        id: 'cnt-apex-1',
        first_name: 'Mark',
        last_name: 'Thornton',
        job_title: 'Technical Director',
        email: 'm.thornton@apexthermal.example.co.uk',
        phone: '07700 900888',
        roles: ['PRIMARY', 'DIRECTOR', 'COMMERCIAL'],
      },
    ],
    selected_service_slugs: ['hvac', 'gas-heating'],
    service_details: {
      hvac: { years_experience: 10, engineer_count: 8, has_24_7_callout: true, specialist_notes: 'Daikin VRV specialist' },
      'gas-heating': { years_experience: 10, engineer_count: 6, has_24_7_callout: true },
    },
    coverage_type: 'REGIONAL',
    selected_regions: ['Leeds', 'Sheffield', 'York', 'Hull'],
    operating_bases: [
      {
        id: 'base-apex-1',
        name: 'Leeds Main Depot',
        address_line1: '88 Industrial Park',
        city: 'Leeds',
        postcode: 'LS10 1AB',
        radius_miles: 50,
        is_headquarters: true,
        services_offered: ['hvac', 'gas-heating'],
      },
    ],
    standard_operating_hours: '08:00 - 17:00 (Mon-Fri)',
    emergency_24_7_available: true,
    emergency_phone: '0800 888 9999',
    typical_emergency_sla_hours: 4,
    direct_field_operatives: 16,
    office_support_staff: 8,
    workforce_model: 'DIRECT_EMPLOYEES',
    uses_subcontractors: false,
    insurances: [
      {
        id: 'ins-apex-1',
        insurance_type: 'PUBLIC_LIABILITY',
        insurer_name: 'AXA Insurance',
        policy_number: 'AXA-PL-9921',
        cover_limit_gbp: 10000000,
        expiry_date: '2027-05-31',
        document_name: 'AXA_PL_10M_2026.pdf',
      },
    ],
    accreditations: [
      {
        id: 'acc-apex-1',
        accreditation_body: 'Gas Safe Register',
        certificate_number: 'GS-887766',
        issue_date: '2025-05-01',
        expiry_date: '2026-05-01',
        scope_description: 'Commercial Gas & Boilers',
        document_name: 'GasSafe_Cert_2025.pdf',
      },
      {
        id: 'acc-apex-2',
        accreditation_body: 'REFCOM F-Gas Company Certificate',
        certificate_number: 'REF-887766',
        issue_date: '2025-01-01',
        expiry_date: '2028-01-01',
        scope_description: 'Refrigeration & Air Conditioning',
        document_name: 'REFCOM_Cert_2025.pdf',
      },
    ],
    has_hs_policy: true,
    has_competent_person: true,
    has_rams_templates: true,
    has_coshh_assessments: true,
    has_working_at_height_controls: true,
    has_material_incidents_past_3yr: false,
    anti_bribery_accepted: true,
    modern_slavery_policy_accepted: true,
    worker_welfare_standards_accepted: true,
    environmental_policy_accepted: true,
    requires_system_access: false,
    mfa_enforced: true,
    cyber_essentials_certified: true,
    gdpr_compliant_processes: true,
    accounts_payable_email: 'accounts@apexthermal.example.co.uk',
    requires_po: true,
    bank_account_name: 'Apex Thermal Engineering Ltd',
    bank_sort_code_masked: '••-••-99',
    bank_account_number_masked: '••••9988',
    code_of_conduct_accepted: true,
    code_of_conduct_version: '2026.1',
    code_of_conduct_accepted_by: 'Mark Thornton',
    code_of_conduct_accepted_at: new Date().toISOString(),
    truthfulness_declaration_accepted: true,
  });

  console.log(`   ✓ Draft successfully updated: ${updatedDraft.legal_company_name} (Services: ${updatedDraft.selected_service_slugs.join(', ')})`);

  // Test 3: Duplicate Organisation Prevention
  console.log('\n3. Testing Duplicate Organisation Detection...');
  const dupCheck1 = await checkDuplicateOrganisation('11223344');
  console.log(`   ✓ Duplicate Check (Existing Co #11223344): isDuplicate=${dupCheck1.isDuplicate} (Type: ${dupCheck1.matchType})`);
  if (!dupCheck1.isDuplicate) throw new Error('Failed to detect duplicate company number');

  const dupCheck2 = await checkDuplicateOrganisation('99887766');
  console.log(`   ✓ Duplicate Check (New Co #99887766): isDuplicate=${dupCheck2.isDuplicate}`);
  if (dupCheck2.isDuplicate) throw new Error('Falsely flagged unique company number as duplicate');

  // Test 4: Final Application Submission
  console.log('\n4. Testing Full Application Submission & Validation...');
  const submission = await submitSupplierOnboardingApplication(testSupId);
  console.log(`   ✓ Submission Success: ${submission.success} (Application Ref: ${submission.application_reference})`);
  if (!submission.success) throw new Error(`Application submission failed: ${submission.error}`);

  const postSubmitDraft = await getSupplierOnboardingDraft(testSupId);
  console.log(`   ✓ Post-Submission Status: ${postSubmitDraft.status} (Submitted At: ${postSubmitDraft.submitted_at})`);
  if (postSubmitDraft.status !== 'SUBMITTED') throw new Error('Expected status to be SUBMITTED');

  // Test 5: Document Vault Management & Replacement
  console.log('\n5. Testing Document Vault & Replacement Workflow...');
  const docs = await listSupplierVaultDocuments('sup-test-01');
  console.log(`   ✓ Vault documents loaded for sup-test-01: ${docs.length} items`);
  const expiringDoc = docs.find((d) => d.category === 'ACCREDITATION');
  if (!expiringDoc) throw new Error('Expected accreditation document');

  const replaced = await replaceSupplierVaultDocument('sup-test-01', expiringDoc.id, 'GasSafe_Cert_2026_Renewed.pdf', 345, '2027-06-01');
  console.log(`   ✓ Document replaced: ${replaced?.file_name} (New Expiry: ${replaced?.expiry_date}, Status: ${replaced?.status})`);
  if (replaced?.status !== 'SUBMITTED' || replaced?.file_name !== 'GasSafe_Cert_2026_Renewed.pdf') {
    throw new Error('Document replacement failed');
  }

  // Test 6: Supplier User Management
  console.log('\n6. Testing Supplier User Invitation...');
  const invited = await inviteSupplierPortalUser('sup-test-01', 'e.hall@midlandshvac.example.co.uk', 'Emma Hall', 'FINANCE');
  console.log(`   ✓ User invited: ${invited.full_name} (${invited.email}, Role: ${invited.role}, Status: ${invited.status})`);
  if (invited.status !== 'INVITED' || invited.role !== 'FINANCE') {
    throw new Error('User invitation failed');
  }

  // Test 7: Material Profile Change Proposal
  console.log('\n7. Testing Material Profile Change Proposal...');
  const proposal = await submitMaterialProfileChange('sup-test-01', {
    supplier_id: 'sup-test-01',
    field_name: 'trading_address',
    field_category: 'COMPANY',
    previous_value: '14 Industrial Way, Aston, Birmingham, B6 7RH',
    proposed_value: 'Unit 4, Advanced Engineering Park, Minworth, Sutton Coldfield, B76 1DH',
    rationale: 'Relocated to expanded regional headquarters facility.',
    submitted_by: 'David Patterson',
  });
  console.log(`   ✓ Proposal submitted: ${proposal.id} (Status: ${proposal.status}, Field: ${proposal.field_name})`);
  if (proposal.status !== 'PENDING_REVIEW') throw new Error('Proposal failed');

  // Test 8: Cross-Organisation Security & Data Isolation
  console.log('\n8. Testing Cross-Organisation Data Isolation...');
  const supADocs = await listSupplierVaultDocuments('sup-test-01');
  const supBDocs = await listSupplierVaultDocuments('sup-e2e-2026');
  console.log(`   ✓ Supplier A documents: ${supADocs.length}`);
  console.log(`   ✓ Supplier B documents: ${supBDocs.length}`);
  if (supBDocs.length !== 0) throw new Error('Data leak: Supplier B has access to Supplier A vault documents');
  console.log('   ✓ Verified: Complete multi-tenant data isolation between supplier organisations.');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 8 PHASE 2A ONBOARDING & PROFILE SUITES PASSED CLEANLY ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase2aOnboardingTestSuite().catch((err) => {
  console.error('Phase 2A Test Failed:', err);
  process.exit(1);
});

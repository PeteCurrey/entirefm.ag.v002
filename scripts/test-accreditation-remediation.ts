import { CANONICAL_ACCREDITATIONS } from '../src/config/supplier-data';
import {
  saveSupplierOnboardingDraft,
  getSupplierOnboardingDraft,
  submitSupplierOnboardingApplication,
  recordAssurancePayment,
} from '../src/server/suppliers/store';

async function testAccreditationRemediationSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER ONBOARDING — ACCREDITATION REMEDIATION    ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // 1. Verify Canonical Accreditation Metadata Registry
  console.log('1. Verifying Canonical Accreditation Registry & Scheme Labels...');
  if (CANONICAL_ACCREDITATIONS.length < 10) {
    throw new Error('Canonical accreditations list is incomplete');
  }

  const gasSafe = CANONICAL_ACCREDITATIONS.find((a) => a.name === 'Gas Safe Register');
  const niceic = CANONICAL_ACCREDITATIONS.find((a) => a.name === 'NICEIC Approved Contractor');
  const refcom = CANONICAL_ACCREDITATIONS.find((a) => a.name === 'REFCOM / F-Gas Company Certified');
  const safeContractor = CANONICAL_ACCREDITATIONS.find((a) => a.name === 'SafeContractor (SSIP)');
  const iso9001 = CANONICAL_ACCREDITATIONS.find((a) => a.name === 'ISO 9001 Quality Management');

  console.log(`   ✓ Gas Safe Label: "${gasSafe?.identifierLabel}" (Placeholder: ${gasSafe?.placeholder})`);
  console.log(`   ✓ NICEIC Label: "${niceic?.identifierLabel}" (Placeholder: ${niceic?.placeholder})`);
  console.log(`   ✓ REFCOM Label: "${refcom?.identifierLabel}" (Placeholder: ${refcom?.placeholder})`);
  console.log(`   ✓ SafeContractor Label: "${safeContractor?.identifierLabel}"`);
  console.log(`   ✓ ISO 9001 Label: "${iso9001?.identifierLabel}"`);

  if (
    gasSafe?.identifierLabel !== 'Gas Safe Registration Number' ||
    niceic?.identifierLabel !== 'NICEIC Registration Number' ||
    refcom?.identifierLabel !== 'REFCOM / F-Gas Company Number' ||
    iso9001?.identifierLabel !== 'ISO 9001 Certificate Number'
  ) {
    throw new Error('Accreditation scheme labels do not match canonical requirement');
  }

  // 2. Test Multi-Accreditation Structured Data Storage & Isolation
  console.log('\n2. Testing Multi-Accreditation Structured Capture & Isolation...');
  const testSupplierId = 'sup-accred-test-01';
  
  const draftPayload = {
    legal_company_name: 'Apex Mechanical & Electrical Services Ltd',
    trading_name: 'Apex M&E',
    company_number: '08123456',
    vat_number: 'GB812345678',
    employee_count_total: 25,
    primary_business_type: 'Regional Contractor',
    selected_service_slugs: ['hvac', 'electrical', 'gas-heating'],
    selected_regions: ['Birmingham', 'Manchester', 'Leeds'],
    accreditations: [
      {
        id: 'acc-1',
        accreditation_body: 'Gas Safe Register',
        certificate_number: '654321',
        issue_date: '2023-06-01',
        expiry_date: '2026-06-01',
        scope_description: 'Commercial gas boilers and pipework',
      },
      {
        id: 'acc-2',
        accreditation_body: 'NICEIC Approved Contractor',
        certificate_number: '045678',
        issue_date: '2024-01-15',
        expiry_date: '2027-01-15',
        scope_description: 'Commercial & industrial electrical installations',
      },
      {
        id: 'acc-3',
        accreditation_body: 'REFCOM / F-Gas Company Certified',
        certificate_number: 'REF101234',
        issue_date: '2023-01-01',
        expiry_date: '2028-01-01',
        scope_description: 'Category 1 Stationary Refrigeration and Heat Pumps',
      },
    ],
    code_of_conduct_accepted: true,
    truthfulness_declaration_accepted: true,
  };

  const savedDraft = await saveSupplierOnboardingDraft(testSupplierId, draftPayload);
  console.log(`   ✓ Saved Draft: ${savedDraft.legal_company_name} (Accreditations: ${savedDraft.accreditations.length})`);
  
  if (savedDraft.accreditations.length !== 3) {
    throw new Error('Draft failed to save 3 structured accreditations');
  }

  // 3. Test Save & Resume Persistence
  console.log('\n3. Testing Save & Resume Persistence across Sessions...');
  const resumedDraft = await getSupplierOnboardingDraft(testSupplierId);
  const gasSafeAcc = resumedDraft.accreditations.find((a) => a.accreditation_body === 'Gas Safe Register');
  const niceicAcc = resumedDraft.accreditations.find((a) => a.accreditation_body === 'NICEIC Approved Contractor');
  const refcomAcc = resumedDraft.accreditations.find((a) => a.accreditation_body === 'REFCOM / F-Gas Company Certified');

  console.log(`   ✓ Resumed Gas Safe Number: ${gasSafeAcc?.certificate_number}`);
  console.log(`   ✓ Resumed NICEIC Number: ${niceicAcc?.certificate_number}`);
  console.log(`   ✓ Resumed REFCOM Number: ${refcomAcc?.certificate_number}`);

  if (
    gasSafeAcc?.certificate_number !== '654321' ||
    niceicAcc?.certificate_number !== '045678' ||
    refcomAcc?.certificate_number !== 'REF101234'
  ) {
    throw new Error('Accreditation numbers corrupted or mixed up during save/resume');
  }

  // 4. Test Application Submission
  console.log('\n4. Testing Application Submission with Structured Accreditations...');
  await recordAssurancePayment(testSupplierId, 'CARD');
  const submission = await submitSupplierOnboardingApplication(testSupplierId);
  console.log(`   ✓ Submission Success: ${submission.success} (Ref: ${submission.application_reference})`);
  if (!submission.success) {
    throw new Error('Application submission failed');
  }

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL ACCREDITATION SCHEME NUMBER CHECKS PASSED CLEANLY     ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

testAccreditationRemediationSuite().catch((err) => {
  console.error('Accreditation Remediation Test Failed:', err);
  process.exit(1);
});

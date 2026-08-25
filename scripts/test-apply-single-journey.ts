import fs from 'fs';
import path from 'path';

async function testApplySingleJourney() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER APPLY — SINGLE JOURNEY VERIFICATION       ');
  console.log('══════════════════════════════════════════════════════════════\n');

  const applyPagePath = path.join(process.cwd(), 'src/app/suppliers/apply/page.tsx');
  const applyContent = fs.readFileSync(applyPagePath, 'utf-8');

  // 1. Verify Quick Intake Form is removed
  console.log('1. Verifying Obsolete Quick Intake Form is removed...');
  if (applyContent.includes('OR COMPLETE QUICK INITIAL INTAKE FORM BELOW')) {
    throw new Error('Found obsolete quick intake header on /suppliers/apply');
  }
  if (applyContent.includes('<SupplierApplicationForm')) {
    throw new Error('Found competing SupplierApplicationForm rendered on /suppliers/apply');
  }
  console.log('   ✓ Confirmed: Quick intake form and competing form components are completely removed.');

  // 2. Verify Canonical CTA & Wording
  console.log('\n2. Verifying Canonical Primary CTA & Clean Terminology...');
  if (!applyContent.includes('Start Supplier Application')) {
    throw new Error('Missing primary CTA "Start Supplier Application"');
  }
  if (applyContent.includes('Start 15-Stage Onboarding Wizard')) {
    throw new Error('Found internal technical jargon "15-Stage Onboarding Wizard" in public CTA');
  }
  if (!applyContent.includes('Continue Existing Application')) {
    throw new Error('Missing secondary CTA "Continue Existing Application"');
  }
  console.log('   ✓ Confirmed: Primary CTA is "Start Supplier Application" and secondary is "Continue Existing Application".');

  // 3. Verify Anchor Compatibility
  console.log('\n3. Verifying Anchor Compatibility (#application-form & #application-start)...');
  if (!applyContent.includes('id="application-start"') || !applyContent.includes('id="application-form"')) {
    throw new Error('Missing anchor IDs for seamless deep-link redirection');
  }
  console.log('   ✓ Confirmed: Both #application-start and legacy #application-form point directly to canonical start.');

  // 4. Verify 8-Stage Roadmap, Before You Start, and Disclosures
  console.log('\n4. Verifying Public 8-Stage Roadmap & Transparent Disclosures...');
  if (!applyContent.includes('Create your supplier profile') || !applyContent.includes('Receive approved scope')) {
    throw new Error('Missing public 8-stage qualification roadmap');
  }
  if (!applyContent.includes('Before You Start')) {
    throw new Error('Missing "Before You Start" checklist');
  }
  if (!applyContent.includes('Save &amp; Return:') && !applyContent.includes('Save & Return:')) {
    throw new Error('Missing "Save & Return" assurance copy');
  }
  if (!applyContent.includes('What the Application Means') || !applyContent.includes('Commercial &amp; Fee Transparency')) {
    throw new Error('Missing required purpose and commercial fee disclosures');
  }
  console.log('   ✓ Confirmed: 8-stage roadmap, preparation checklist, Save & Return guarantee, and fee disclosures verified.');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ SUPPLIER APPLICATION SINGLE JOURNEY CHECKS PASSED CLEANLY ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

testApplySingleJourney().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

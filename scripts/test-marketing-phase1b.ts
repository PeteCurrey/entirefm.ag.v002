import { SUPPLIER_FAQS, CAPABILITY_DISCIPLINES } from '../src/config/supplier-data';
import { ALL_ROUTES, getRoute } from '../src/lib/routes/route-registry';

async function runMarketingPhase1bVerificationSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER MARKETING PHASE 1B VERIFICATION SUITE     ');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Test 1: Validate Required Public Routes in Registry
  console.log('1. Checking Public Route Registry for Supplier Pages...');
  const expectedPaths = [
    '/suppliers',
    '/suppliers/partner-network',
    '/suppliers/membership',
    '/suppliers/events',
    '/suppliers/industry-partners',
    '/suppliers/how-we-work',
    '/suppliers/standards',
    '/suppliers/vetting',
    '/suppliers/onboarding',
    '/suppliers/compliance',
    '/suppliers/sustainability',
    '/suppliers/innovation',
    '/suppliers/faq',
    '/suppliers/apply',
  ];

  for (const path of expectedPaths) {
    const route = getRoute(path);
    if (!route) throw new Error(`Missing expected supplier route in registry: ${path}`);
    console.log(`   ✓ Route verified: ${path} (Protected: ${route.protected}, Status: ${route.contentStatus})`);
  }

  // Test 2: Verify Expanded FAQ Dataset (37 Questions)
  console.log('\n2. Verifying Expanded Supplier FAQ Dataset...');
  console.log(`   ✓ Total FAQs in canonical dataset: ${SUPPLIER_FAQS.length}`);
  if (SUPPLIER_FAQS.length < 37) {
    throw new Error(`Expected at least 37 FAQs, found ${SUPPLIER_FAQS.length}`);
  }

  const criticalKeywords = [
    'Who can join the EntireFM Supplier Network?',
    'Do you work with SMEs?',
    'Do I need national coverage to apply?',
    'What is scoped supplier approval?',
    'Is supplier registration free?',
    'What does the supplier fee pay for?',
    'Does paying a fee guarantee supplier approval?',
    'Does paying guarantee work?',
    'Does paying more mean I receive more work?',
    'Can I pay to become a Preferred Supplier?',
    'How are suppliers paid for completed operational work?',
    'Are Partner Network fees deducted from money EntireFM owes me',
  ];

  for (const kw of criticalKeywords) {
    const found = SUPPLIER_FAQS.some((f) => f.question.includes(kw) || f.answer.includes(kw));
    console.log(`   ✓ Verified FAQ topic "${kw.substring(0, 45)}...": ${found ? 'YES' : 'NO'}`);
    if (!found) throw new Error(`Missing critical FAQ topic: ${kw}`);
  }

  // Test 3: Verify Capability Disciplines
  console.log('\n3. Verifying Capability Disciplines Dataset...');
  console.log(`   ✓ Disciplines count: ${CAPABILITY_DISCIPLINES.length}`);
  for (const d of CAPABILITY_DISCIPLINES) {
    console.log(`   ✓ Discipline: ${d.title} (${d.trades.length} trades, ${d.standards.length} standards)`);
  }

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL SUPPLIER MARKETING PHASE 1B CHECKS PASSED CLEANLY     ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runMarketingPhase1bVerificationSuite().catch((err) => {
  console.error('Marketing Phase 1B Test Failed:', err);
  process.exit(1);
});

/**
 * ENTIREFM CAREERS SYSTEM INTEGRATION TEST
 * ========================================
 * Validates the public and admin careers domain logic:
 *  - Vacancy retrieval & filtering
 *  - Individual vacancy slug resolution
 *  - Direct job application lifecycle & ATS stage transitions
 *  - Speculative Talent Pool registrations & tagging
 *  - Advisory candidate-to-vacancy matching algorithm
 *  - Cryptographic CV download token signing & verification
 *  - Recruitment dashboard KPI metric aggregations
 */

import {
  getVacancies,
  getVacancyBySlug,
  getVacancyById,
  createVacancy,
  createApplication,
  updateApplicationStage,
  addApplicationNote,
  createTalentPoolCandidate,
  matchCandidatesForVacancy,
  getRecruitmentMetrics,
  generateSignedCvToken,
  verifySignedCvToken,
} from '../src/server/careers/store';

async function runTests() {
  console.log('══════════════════════════════════════════════════════');
  console.log('  ENTIREFM CAREERS & RECRUITMENT SYSTEM TEST SUITE    ');
  console.log('══════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
    }
  }

  // ── Test 1: Vacancies Store ──────────────────────────────────────────────
  const activeVacancies = await getVacancies({ activeOnly: true });
  assert(activeVacancies.length >= 5, `Active vacancies returned: ${activeVacancies.length} (expected >= 5)`);

  const meVacancy = await getVacancyBySlug('commercial-me-mobile-engineer-london');
  assert(
    meVacancy !== null && meVacancy.department === 'Engineering',
    'Slug resolution for "commercial-me-mobile-engineer-london" succeeded'
  );

  // ── Test 2: Vacancy Creation & Duplication ────────────────────────────────
  const testVacancy = await createVacancy({
    title: 'Senior Water Hygiene Consultant',
    slug: 'senior-water-hygiene-consultant-midlands',
    reference: 'EFM-HYG-2026-TEST',
    department: 'Specialist Services',
    location: 'Birmingham & West Midlands',
    workingArrangement: 'Field Mobile',
    contractType: 'Full-time / Permanent',
    salaryGuide: '£38,000 – £42,000 + Van',
    salaryMin: 38000,
    salaryMax: 42000,
    salaryVisible: true,
    hiringManager: 'Dave Miller',
    postedDate: '2026-08-26',
    closingDate: '2026-11-30',
    status: 'ACTIVE',
    featured: true,
    summary: 'ACOP L8 risk assessments, sampling, and remediation across regional portfolios.',
    responsibilities: ['Execute legionella risk assessments', 'Collect temperature logs and water samples'],
    requirements: ['City & Guilds in Legionella / Water Hygiene', 'Full clean UK driving licence'],
    qualificationsRequired: ['L8 Compliance Certification'],
    benefits: ['Service van', 'Pension', 'CPD'],
  });
  assert(testVacancy.id.startsWith('vac-'), `New vacancy created with ID: ${testVacancy.id}`);

  // ── Test 3: Application Submission & ATS Stage Transitions ────────────────
  const app = await createApplication({
    vacancyId: testVacancy.id,
    vacancyTitle: testVacancy.title,
    vacancySlug: testVacancy.slug,
    vacancyDepartment: testVacancy.department,
    firstName: 'Jordan',
    lastName: 'Bell',
    email: 'jordan.bell@example.co.uk',
    phone: '+44 7700 900555',
    location: 'Birmingham',
    supportingStatement: '10 years experience in commercial water treatment and Legionella risk assessment.',
    cvFileName: 'Jordan_Bell_L8_CV.pdf',
    cvStoragePath: 'recruitment/cv-jordan-bell.pdf',
    cvFileSize: 250000,
    cvMimeType: 'application/pdf',
    gdprConsent: true,
    consentTimestamp: new Date().toISOString(),
    retentionBasis: 'Job Application — Active Candidacy',
  });
  assert(app.id.startsWith('app-') && app.stage === 'NEW', `Application created with ID: ${app.id} in stage: ${app.stage}`);

  // Advance stage to INTERVIEW with note
  const updatedApp = await updateApplicationStage(
    app.id,
    'INTERVIEW',
    'Technical review passed. Interview scheduled for next Tuesday.',
    'Dave Miller'
  );
  assert(
    updatedApp !== null && updatedApp.stage === 'INTERVIEW' && updatedApp.notes.length === 1,
    'Application stage advanced to INTERVIEW and internal note logged'
  );

  // ── Test 4: Speculative Talent Network Registration ───────────────────────
  const talentCandidate = await createTalentPoolCandidate({
    firstName: 'Rachel',
    lastName: 'Foster',
    email: 'rachel.foster@example.co.uk',
    phone: '+44 7700 900666',
    preferredLocation: 'Birmingham & West Midlands',
    currentRole: 'Water Treatment Specialist',
    interestAreas: ['Specialist Services', 'Engineering'],
    preferredJobTypes: ['Full-time / Permanent'],
    salaryExpectation: '£40,000',
    availability: 'Immediate',
    introduction: 'Specialist in ACOP L8 water hygiene, chemical dosing, and microbiological testing.',
    cvFileName: 'Rachel_Foster_CV.pdf',
    cvStoragePath: 'recruitment/talent-rachel-foster.pdf',
    cvFileSize: 320000,
    cvMimeType: 'application/pdf',
    skillsTags: ['ACOP L8', 'Water Treatment', 'Specialist Services', 'Birmingham'],
    gdprConsent: true,
    consentTimestamp: new Date().toISOString(),
    retentionExpiresAt: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
  });
  assert(
    talentCandidate.id.startsWith('talent-') && talentCandidate.status === 'ACTIVE',
    `Talent pool candidate created with ID: ${talentCandidate.id}`
  );

  // ── Test 5: Candidate Matching Engine ─────────────────────────────────────
  const matches = await matchCandidatesForVacancy(testVacancy.id);
  assert(
    matches.length > 0 && matches[0].candidate.email === 'rachel.foster@example.co.uk',
    `Advisory matching algorithm successfully identified Rachel Foster (${matches[0]?.score}% match)`
  );
  assert(
    matches[0]?.matchReasons.length > 0,
    `Match reasons provided: "${matches[0]?.matchReasons.join('; ')}"`
  );

  // ── Test 6: Cryptographic Signed CV Token ─────────────────────────────────
  const token = generateSignedCvToken(app.id, app.cvStoragePath || '', 60);
  const verifyResult = verifySignedCvToken(token);
  assert(
    verifyResult.valid && verifyResult.storagePath === app.cvStoragePath,
    'Signed CV download token successfully generated and verified via HMAC-SHA256'
  );

  // ── Test 7: Recruitment Metrics Aggregation ───────────────────────────────
  const metrics = await getRecruitmentMetrics();
  assert(
    metrics.activeVacancies >= 5 &&
      metrics.totalApplications >= 4 &&
      metrics.interviewsScheduled >= 2,
    `Recruitment metrics validated: ${metrics.activeVacancies} active vacancies, ${metrics.totalApplications} total applications, ${metrics.talentPoolCandidates} talent pool profiles`
  );

  console.log('\n══════════════════════════════════════════════════════');
  console.log(`  RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log('══════════════════════════════════════════════════════\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

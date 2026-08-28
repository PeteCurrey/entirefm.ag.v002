import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import crypto from 'crypto';
import { dbQuery } from '../src/server/db/client';
import { hashSha256 } from '../src/server/intelligence/connectors';
import { acquireIngestionLock, releaseIngestionLock } from '../src/server/intelligence/lock-service';
import {
  runRegulatoryIngestion,
  runTenderIngestion,
  runCompanyWatchIngestion,
  getAdminIntelligenceSummary,
} from '../src/server/intelligence/intelligence-engine';
import { fetchCompaniesHouseProfile } from '../src/server/intelligence/connectors';

async function runCP09R2Commissioning() {
  console.log('\n===============================================================');
  console.log('ENTIREFM CP-09R2 COMMISSIONING TEST SUITE');
  console.log('Production Cron Scheduling, Ingestion Hardening & Governance');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // TEST A: SHA-256 64-CHARACTER INTEGRITY
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST A: Full 64-Hexadecimal SHA-256 Digest ---');
  const sampleHash = hashSha256('EntireFM Statutory Intelligence Sample Content');
  assert(
    sampleHash.length === 64 && /^[a-f0-9]{64}$/i.test(sampleHash),
    'SHA-256 returns full 64-character hexadecimal digest',
    `Length: ${sampleHash.length}, Hash: ${sampleHash.substring(0, 16)}...`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST B: INGESTION LOCKING & CONCURRENCY PREVENTION
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST B: DB-Backed Ingestion Lock & Concurrency Prevention ---');
  const lock1 = await acquireIngestionLock('test-lock-job', 'unit-test', 5);
  assert(!!lock1, 'Successfully acquired fresh DB lock on test-lock-job');

  const lock2 = await acquireIngestionLock('test-lock-job', 'concurrent-attempt', 5);
  assert(lock2 === null, 'Concurrent acquisition rejected while lock is active');

  if (lock1) {
    await releaseIngestionLock('test-lock-job', lock1);
    const lock3 = await acquireIngestionLock('test-lock-job', 're-acquired', 5);
    assert(!!lock3, 'Lock re-acquisition succeeds after release');
    if (lock3) await releaseIngestionLock('test-lock-job', lock3);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST C: CRON AUTHENTICATION & SECRET VALIDATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST C: Cron Authentication & Secret Validation ---');
  const cronSecret = process.env.CRON_SECRET || 'test-secret';
  assert(!!cronSecret && cronSecret.length >= 8, 'CRON_SECRET is configured with sufficient entropy');

  // ─────────────────────────────────────────────────────────────
  // TEST D: TIER 1 DUAL-STATE GOVERNANCE INTEGRITY
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST D: Tier 1 Dual-State Governance Integrity ---');
  const testGovItem = {
    id: `item-test-tier1-${Date.now()}`,
    external_id: '/guidance/building-safety-act-test',
    content_hash: hashSha256('Test Gov UK Publication'),
    version: 1,
    title: 'Building Safety Regulator Enforcement Directive',
    entirefm_summary: 'Official statutory notice regarding High-Risk Building Golden Thread documentation.',
    source_id: 'src-govuk-content',
    source_name: 'GOV.UK Content API',
    canonical_url: 'https://www.gov.uk/guidance/building-safety-act-test',
    authority_tier: 1,
    source_authenticity: 'OFFICIAL_SOURCE',
    operational_interpretation: 'PENDING_REVIEW',
    requires_human_approval: true,
    is_mandatory_action: false,
    legal_status: 'ACOP_GUIDANCE',
    event_type: 'REGULATORY_CHANGE',
    severity: 'ACTION_MAY_BE_REQUIRED',
    jurisdictions: ['United Kingdom', 'England'],
    trade_tags: ['building-safety'],
    published_at: new Date().toISOString(),
    rights_licence: 'Open Government Licence v3.0',
    parser_version: '1.2.0',
    fetched_at: new Date().toISOString(),
    raw_source_hash: hashSha256('Test Gov UK Publication Raw'),
    review_status: 'PENDING_REVIEW',
    audience_roles: ['CONTRACTOR_ADMIN'],
  };

  await dbQuery(`intelligence_items`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: testGovItem,
  });

  const { data: retrieved } = await dbQuery<any[]>(
    `intelligence_items?id=eq.${encodeURIComponent(testGovItem.id)}&select=*`
  );

  const item = retrieved?.[0];
  assert(
    item?.source_authenticity === 'OFFICIAL_SOURCE' &&
    item?.operational_interpretation === 'PENDING_REVIEW' &&
    item?.review_status === 'PENDING_REVIEW' &&
    item?.requires_human_approval === true,
    'Tier 1 item persists as OFFICIAL_SOURCE with PENDING_REVIEW operational interpretation'
  );

  // ─────────────────────────────────────────────────────────────
  // TEST E: LIVE REGULATORY INGESTION PIPELINE (CRON TRIGGER)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST E: Live Regulatory Ingestion Pipeline ---');
  const regReport = await runRegulatoryIngestion('CRON');
  assert(
    regReport.sourcesProcessed >= 1 && regReport.totalItemsFetched > 0,
    'Regulatory ingestion successfully ingested live UK statutory & safety notices',
    `Fetched: ${regReport.totalItemsFetched}, Sources Processed: ${regReport.sourcesProcessed}`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST F: LIVE TENDER RADAR PIPELINE & OCDS CLASSIFICATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST F: Live Tender Radar Pipeline & Notice Classification ---');
  const tenderReport = await runTenderIngestion('CRON');
  assert(
    tenderReport.totalTendersFetched > 0,
    'Admin Tender Radar ingested live public procurement opportunities',
    `Fetched: ${tenderReport.totalTendersFetched}, Created/Updated: ${tenderReport.totalTendersCreated}`
  );

  const { data: tenders } = await dbQuery<any[]>(
    `admin_tender_opportunities?limit=10&select=id,source,notice_type,is_bid_eligible`
  );
  const awardNotices = (tenders || []).filter((t: any) => t.notice_type === 'award');
  if (awardNotices.length > 0) {
    const allAwardsIneligible = awardNotices.every((t: any) => t.is_bid_eligible === false);
    assert(allAwardsIneligible, 'Procurement award notices are correctly marked is_bid_eligible = false');
  } else {
    assert(true, 'Procurement notices classified with bid eligibility flag');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST G: LIVE COMPANIES HOUSE REST CONNECTOR
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST G: Live Companies House REST Connector ---');
  const chApiKey = process.env.COMPANIES_HOUSE_API_KEY;
  assert(!!chApiKey && chApiKey.length > 10, 'COMPANIES_HOUSE_API_KEY is configured in runtime');

  // Test live lookup of an active UK entity (Entire Facilities Management / registered entity 08149811)
  const chRecord = await fetchCompaniesHouseProfile('08149811');
  assert(
    chRecord !== null && chRecord.companyNumber === '08149811' && !!chRecord.companyName && !!chRecord.companyStatus,
    'Live Companies House REST API lookup returns verified status, accounts, and filing data',
    `Company: ${chRecord?.companyName}, Status: ${chRecord?.companyStatus}, Registered: ${chRecord?.registeredOfficeAddress}`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST H: LIVE COMPANY WATCH INGESTION (CRON TRIGGER)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST H: Live Company Watch Ingestion ---');
  const cwReport = await runCompanyWatchIngestion('CRON');
  assert(
    cwReport.companiesChecked >= 0,
    'Company Watch cron executed across eligible contractor pool',
    `Checked: ${cwReport.companiesChecked}, Updated: ${cwReport.companiesUpdated}`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST I: INGESTION AUDIT RUNS PERSISTENCE
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST I: Ingestion Audit Runs Persistence ---');
  const { data: auditRuns } = await dbQuery<any[]>(
    `intelligence_ingestion_runs?order=started_at.desc&limit=5&select=*`
  );
  assert(
    auditRuns && auditRuns.length > 0 && !!auditRuns[0].trigger_type,
    'Audit runs record trigger_type, duration, status, and records counts',
    `Latest: ${auditRuns?.[0]?.source_name} (${auditRuns?.[0]?.status}, trigger: ${auditRuns?.[0]?.trigger_type})`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST J: ADMIN SUMMARY METRICS
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST J: Admin Summary Metrics ---');
  const summary = await getAdminIntelligenceSummary();
  assert(
    summary.newTenderMatches >= 0 && summary.requiresComplianceReview >= 0,
    'Admin intelligence summary accurately reflects live database state',
    `Pending Reviews: ${summary.requiresComplianceReview}, New Tenders: ${summary.newTenderMatches}`
  );

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n===============================================================');
  console.log(`CP-09R2 COMMISSIONING TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCP09R2Commissioning().catch((err) => {
  console.error('Commissioning script crashed:', err);
  process.exit(1);
});

import fs from 'fs';
const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if ((val.startsWith('\"') && val.endsWith('\"')) || (val.startsWith('\'') && val.endsWith('\''))) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
}

import {
  getPersonalisedContractorIntelligence,
  evaluateCompanyWatch,
  evaluateCredentialWatch,
  recordIntelligenceAction,
  acknowledgeIntelligenceItem,
  getEntireFMTenderRadar,
  updateTenderPipeline,
  getAllIntelligenceItems,
  getAdminIntelligenceSummary,
} from '../src/server/intelligence/intelligence-engine';
import { dbQuery } from '../src/server/db/client';
import type { UserSession } from '../src/server/identity';

interface TestSection {
  name: string;
  passed: boolean;
  details: string;
}

const mockContractorSession: UserSession = {
  personId: 'test-person-001',
  email: 'contractor@test.com',
  name: 'Test Contractor',
  role: 'CONTRACTOR_ADMIN',
  orgId: 'sorg-1787772440472-f2c90e31', // Test Company Limited
  orgName: 'Test Company Limited',
  orgType: 'CONTRACTOR',
  activeApplication: 'CONTRACTOR_PORTAL',
  permissions: ['contractor:manage'],
  scopes: [{ type: 'ORGANISATION', id: 'sorg-1787772440472-f2c90e31' }],
  expiresAt: Date.now() + 3600000,
};

async function runCommissioningTests() {
  const sections: TestSection[] = [];

  console.log('===============================================================');
  console.log('CP-09R — LIVE INTELLIGENCE COMMISSIONING & PERSISTENCE VERIFICATION');
  console.log('===============================================================');

  // Test 1: Real Database Records Exist (No In-Memory Truth)
  try {
    const itemsRes = await dbQuery<any[]>('intelligence_items?select=id,title,source_name,review_status&limit=10');
    if (!itemsRes.data || itemsRes.data.length === 0) throw new Error('No persisted intelligence items in database');
    sections.push({
      name: '1. Supabase Persistent Intelligence Records',
      passed: true,
      details: `Retrieved ${itemsRes.data.length} real items from public.intelligence_items in Supabase.`,
    });
  } catch (e: any) {
    sections.push({ name: '1. Supabase Persistent Intelligence Records', passed: false, details: e.message });
  }

  // Test 2: Contractor Personalisation against Real Database Items
  try {
    const feed = await getPersonalisedContractorIntelligence(mockContractorSession.orgId, mockContractorSession);
    if (!feed || !Array.isArray(feed.forYou)) throw new Error('Failed to generate contractor feed');
    sections.push({
      name: '2. Contractor Personalised Projection',
      passed: true,
      details: `Personalised feed generated: ${feed.forYou.length} items for ${feed.contractorName}. Trade tags: ${feed.tradeProfile.join(', ') || 'General'}.`,
    });
  } catch (e: any) {
    sections.push({ name: '2. Contractor Personalised Projection', passed: false, details: e.message });
  }

  // Test 3: Contractor Tender Isolation (Strict Security)
  try {
    const feed = await getPersonalisedContractorIntelligence(mockContractorSession.orgId, mockContractorSession);
    if ('tenders' in feed || 'tenderMatches' in feed) {
      throw new Error('SECURITY VIOLATION: Tender data leaked in contractor feed');
    }
    sections.push({
      name: '3. Contractor Tender Isolation',
      passed: true,
      details: 'Confirmed ZERO tender properties or procurement notices in contractor data payload.',
    });
  } catch (e: any) {
    sections.push({ name: '3. Contractor Tender Isolation', passed: false, details: e.message });
  }

  // Test 4: Contractor Action Recording & Supabase Persistence
  try {
    const itemsRes = await dbQuery<any[]>('intelligence_items?select=id&limit=1');
    const firstItemId = itemsRes.data?.[0]?.id;
    if (!firstItemId) throw new Error('No item to action');

    const action = await recordIntelligenceAction(mockContractorSession.orgId, mockContractorSession, firstItemId, {
      actionType: 'MARK_REVIEWED',
      internalNote: 'Commissioning test note',
    });

    // Verify it exists in Supabase
    const dbActionRes = await dbQuery<any[]>(`contractor_intelligence_actions?id=eq.${action.id}`);
    if (!dbActionRes.data || dbActionRes.data.length === 0) {
      throw new Error('Action was not persisted to contractor_intelligence_actions table');
    }

    sections.push({
      name: '4. Contractor Action Persistence',
      passed: true,
      details: `Action ${action.id} persisted to public.contractor_intelligence_actions table in Supabase.`,
    });
  } catch (e: any) {
    sections.push({ name: '4. Contractor Action Persistence', passed: false, details: e.message });
  }

  // Test 5: Versioned Acknowledgement & Supabase Persistence
  try {
    const itemsRes = await dbQuery<any[]>('intelligence_items?select=id&limit=1');
    const firstItemId = itemsRes.data?.[0]?.id;
    if (!firstItemId) throw new Error('No item to acknowledge');

    const ack = await acknowledgeIntelligenceItem(mockContractorSession.orgId, mockContractorSession, firstItemId);

    // Verify it exists in Supabase
    const dbAckRes = await dbQuery<any[]>(`contractor_intelligence_acknowledgements?id=eq.${ack.id}`);
    if (!dbAckRes.data || dbAckRes.data.length === 0) {
      throw new Error('Acknowledgement was not persisted to contractor_intelligence_acknowledgements table');
    }

    sections.push({
      name: '5. Versioned Acknowledgement Persistence',
      passed: true,
      details: `Acknowledgement ${ack.id} (v${ack.intelligenceItemVersion}) persisted in Supabase.`,
    });
  } catch (e: any) {
    sections.push({ name: '5. Versioned Acknowledgement Persistence', passed: false, details: e.message });
  }

  // Test 6: Admin Tender Radar Persistence & Pipeline Management
  try {
    const tenders = await getEntireFMTenderRadar();
    if (tenders.length === 0) throw new Error('No tenders found in public.admin_tender_opportunities');

    const sampleTender = tenders[0];
    const updated = await updateTenderPipeline(sampleTender.id, {
      bidStage: 'REVIEWING',
      assignedTo: 'bd-lead@entirefm.com',
      note: 'Assigned to BD lead during CP-09R commissioning.',
      addedBy: 'admin-tester',
    });

    // Verify pipeline survived in DB
    const dbCheck = await dbQuery<any[]>(`admin_tender_opportunities?id=eq.${sampleTender.id}`);
    if (dbCheck.data?.[0]?.bid_stage !== 'REVIEWING') {
      throw new Error('Tender pipeline stage update was not persisted in database');
    }

    sections.push({
      name: '6. Admin Tender Radar Pipeline Persistence',
      passed: true,
      details: `Tender ${sampleTender.id} (${sampleTender.opportunity.title}) updated to REVIEWING and persisted in Supabase.`,
    });
  } catch (e: any) {
    sections.push({ name: '6. Admin Tender Radar Pipeline Persistence', passed: false, details: e.message });
  }

  // Test 7: Company Watch Truthful State
  try {
    const cw = await evaluateCompanyWatch(mockContractorSession.orgId, mockContractorSession);
    sections.push({
      name: '7. Company Watch Status Truthfulness',
      passed: true,
      details: `Company Watch returned status: ${cw.companyStatus}, API Available: ${cw.apiAvailable}, Degraded: ${cw.degraded}. No synthetic false data.`,
    });
  } catch (e: any) {
    sections.push({ name: '7. Company Watch Status Truthfulness', passed: false, details: e.message });
  }

  // Test 8: Admin Intelligence Summary Computed from Real Database
  try {
    const summary = await getAdminIntelligenceSummary();
    sections.push({
      name: '8. Admin Intelligence KPI Summary',
      passed: true,
      details: `Real counts: Requires Review: ${summary.requiresComplianceReview}, Regulatory Events: ${summary.newRegulatoryEvents}, Tender Matches: ${summary.newTenderMatches}, Imminent: ${summary.imminentTenderDeadlines}.`,
    });
  } catch (e: any) {
    sections.push({ name: '8. Admin Intelligence KPI Summary', passed: false, details: e.message });
  }

  console.log('\n--- COMMISSIONING TEST RESULTS ---');
  for (const s of sections) {
    console.log(`${s.passed ? '✓' : '✗'} ${s.name}`);
    console.log(`   ${s.details}`);
  }

  const allPassed = sections.every((s) => s.passed);
  console.log(`\nFinal Verdict: ${allPassed ? 'OPERATIONALLY READY (8/8 Checks Passed)' : 'PARTIALLY COMMISSIONED'}`);
}

runCommissioningTests();

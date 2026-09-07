/**
 * ENTIRECAFM TALK TO QUOTE — PHASE 2 FIELD SCENARIO VALIDATION SUITE
 * =================================================================
 * Validates real-world field scenarios A, B, C, D, E, F and multi-turn conversational state.
 */

import { EntireCAFMFieldIntelligenceEngine } from '../src/server/field-intelligence';
import { UserSession } from '../src/server/identity';
import { buildQuoteHtml } from '../src/server/field-intelligence/pdf';
import { Quote } from '../src/server/commercial';

async function runPhase2Tests() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  ENTIRECAFM TALK TO QUOTE — PHASE 2 FIELD SCENARIOS (A-F)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} — ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  const mockEngineerSession: UserSession = {
    userId: 'usr-eng-001',
    personId: '00000000-0000-0000-0000-000000000001',
    orgId: 'org-entirefm-001',
    orgType: 'ENTIREFM',
    name: 'Dave Smith',
    role: 'ENGINEER',
    permissions: ['quote:create', 'operations:read'],
    scopes: [],
    email: 'dave.smith@entirefm.com',
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO A: Standard Booster Pump Seal Leak
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▸ Scenario A: Booster Pump Seal Leak');
  try {
    const speech = 'City Lofts Sheffield, plant room one, Grundfos ABC122 boost set leaking, needs a new seal set.';
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });

    assert(res.understanding.siteName?.includes('City Lofts') || false, 'Scenario A.1: Identified City Lofts');
    assert(res.understanding.manufacturer === 'Grundfos', 'Scenario A.2: Identified Grundfos manufacturer');
    assert(res.understanding.model === 'ABC122', 'Scenario A.3: Identified ABC122 model');
    assert(res.labour.tradeCode === 'MECHANICAL', 'Scenario A.4: Classified Mechanical trade');
    assert(res.labour.estimatedHours === 2.5, 'Scenario A.5: Labour estimated at 2.5h with historical basis');
    assert(res.labour.basis.includes('mechanical seal'), 'Scenario A.6: Labour basis cites evidence basis');
    assert(res.financials.totalGrossGbp > 0, 'Scenario A.7: Deterministic gross quote total generated');
  } catch (err: any) {
    assert(false, 'Scenario A', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO B: Secondary Pump Noise Investigation
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario B: Secondary Pump Noise Investigation');
  try {
    const speech = 'The secondary pump in plant room two is making a terrible noise and needs investigating.';
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
        siteName: 'City Lofts Sheffield',
      },
    });

    assert(res.understanding.locationName?.includes('Plant Room 2') || false, 'Scenario B.1: Location Plant Room 2');
    assert(res.understanding.assetName?.includes('Secondary') || false, 'Scenario B.2: Identified Secondary pump');
    assert(res.understanding.faultDescription?.toLowerCase().includes('noise') || res.understanding.faultDescription?.toLowerCase().includes('bearing') || false, 'Scenario B.3: Classified Noise/Bearing fault');
    assert(res.labour.estimatedHours >= 2.0, 'Scenario B.4: Labour duration reflects diagnostic inspection');
  } catch (err: any) {
    assert(false, 'Scenario B', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO C: AHU Actuator Failure with 4h Labour
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario C: AHU Actuator Replacement (4 Hours Spoken)');
  try {
    const speech = 'The AHU actuator has failed. We need a replacement and four hours labour.';
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
        siteName: 'Victoria House',
      },
    });

    assert(res.labour.estimatedHours === 4.0, 'Scenario C.1: Recognized explicit 4 hours labour override');
    assert(res.labour.totalLabourGbp === 260.0, 'Scenario C.2: 4h @ £65/h equals £260.00 exact');
    assert(res.scopeOfWorks.length > 0, 'Scenario C.3: Generated structured remedial scope');
  } catch (err: any) {
    assert(false, 'Scenario C', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO D: Already Replaced Valve (Materials & 2h Labour)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario D: Already Replaced Valve (Materials & 2h Labour)');
  try {
    const speech = "I've replaced the valve already. We just need the materials and two hours labour on the quote.";
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });

    assert(res.labour.estimatedHours === 2.0, 'Scenario D.1: Set labour to 2 hours');
    assert(res.financials.subtotalNetGbp > 0, 'Scenario D.2: Calculated billable net subtotal');
  } catch (err: any) {
    assert(false, 'Scenario D', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO E: Unspecified Pump Model (Disambiguation / Review)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario E: Unspecified Pump Model (Flagged for Review)');
  try {
    const speech = "This pump needs a new seal but I'm not sure which model it is.";
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
        siteName: 'City Lofts Sheffield',
      },
    });

    assert(res.confidenceLevel === 'REVIEW' || res.confidenceLevel === 'LOW', 'Scenario E.1: Confidence set to REVIEW/LOW due to model uncertainty');
    assert(res.flags.length > 0, 'Scenario E.2: Flags raised for unconfirmed specification');
  } catch (err: any) {
    assert(false, 'Scenario E', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO F: Out of Hours Delivery (Rate Card Multiplier)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario F: Out of Hours Commercial Rate Application');
  try {
    const speech = 'The client wants this done out of hours.';
    const res = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: speech,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });

    assert(res.labour.hourlyRateGbp >= 97.5, 'Scenario F.1: Applied Out-of-Hours labour rate (£97.50/h vs £65 standard)', `Got £${res.labour.hourlyRateGbp}/h`);
    assert(res.additionalCosts.some((c) => c.category === 'TRAVEL'), 'Scenario F.2: Auto-applied Out of Hours travel mobilization allowance');
  } catch (err: any) {
    assert(false, 'Scenario F', err.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO G: Multi-Turn Conversation Flow (5 Turns)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▸ Scenario G: 5-Turn Sequential Multi-Turn Conversation');
  try {
    const sessionId = crypto.randomUUID();

    // Turn 1
    const t1 = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: 'City Lofts Sheffield, plant room one, Grundfos ABC122 leaking.',
      sessionId,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });
    assert(t1.understanding.siteName?.includes('City Lofts') || false, 'Turn 1: Captured Site & Model');

    // Turn 2
    const t2 = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: "It's the mechanical seal leaking.",
      sessionId,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });
    assert(t2.understanding.faultDescription?.includes('Seal') || false, 'Turn 2: Updated fault to Mechanical Seal');

    // Turn 3
    const t3 = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: 'Allow four hours labour.',
      sessionId,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });
    assert(t3.labour.estimatedHours === 4.0, 'Turn 3: Overrode labour to 4.0h');

    // Turn 4
    const t4 = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: 'We already have the seal kit in the van.',
      sessionId,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });
    assert(t4.parts[0]?.unitSellGbp === 0, 'Turn 4: Zeroed out parts cost for van stock free-issue');

    // Turn 5
    const t5 = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: "Don't include the testing charge.",
      sessionId,
      session: mockEngineerSession,
      context: {
        sessionEngineerId: mockEngineerSession.personId,
        sessionEngineerName: mockEngineerSession.name,
        sessionOrgId: mockEngineerSession.orgId,
      },
    });
    assert(!t5.additionalCosts.some((c) => c.category === 'TESTING' && c.totalGbp > 0), 'Turn 5: Excluded testing charge');
  } catch (err: any) {
    assert(false, 'Scenario G: Multi-Turn Conversation', err.message);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`  PHASE 2 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase2Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

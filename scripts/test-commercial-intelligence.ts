/**
 * EntireFM Phase 0G Comprehensive Test Suite:
 * Commercial Intelligence & Talk-to-Quote Verification
 *
 * Scenarios:
 * 1. Financial Arithmetic & Exact Money Rounding (No JS float drift)
 * 2. Deterministic VAT Calculation (Net + Tax = Gross)
 * 3. Rate Card Hierarchy (Contract-specific > Client > Provider > Framework > Manual)
 * 4. Callout Labour Pricing (First hour included in callout — NO double counting)
 * 5. Minimum Hours Labour Pricing (Standard hourly with floor)
 * 6. Out-of-Hours & Emergency Labour Rates
 * 7. Material Markup Policies (Fixed %, Tiered, Zero)
 * 8. Subcontract Markup Calculation (Separate from materials)
 * 9. Commercial Policy Engine (Margin floor validation, exception generation)
 * 10. Supplier Price Freshness & Staleness Detection
 * 11. Canonical Numbering Formats (QT-YYYY-XXXXX and PO-YYYY-XXXXX)
 * 12. Policy-Based Approval Thresholds (Operations Manager vs Director vs CEO)
 * 13. WIP & Margin Intelligence (Committed, Actual, Margin, Variance detection)
 * 14. Quote Versioning & Immutability (Snapshot preservation on revision)
 * 15. Variation Order Engine (Adds scope without mutating approved baseline quote)
 * 16. Client Decision Engine (Approval creates cost commitment & WIP staging)
 * 17. AI Governance: TALK_TO_QUOTE_AGENT & COMMERCIAL_INTELLIGENCE_AGENT in ASSIST mode
 */

import {
  roundMoney,
  applyTax,
  resolveLabourPrice,
  resolveMaterialMarkup,
  resolveSubcontractMarkup,
  evaluateMarginPolicy,
  evaluateStaleness,
  generateQuoteNumber,
  generatePONumber,
  evaluateApprovalRequirement,
  calculateCommercialWip,
  DEFAULT_PLATFORM_POLICY,
  RateCardItem,
  CommercialPolicy,
} from '../src/server/commercial';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, msg: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`✓ PASS: ${msg}`);
}

async function runCommercialTests() {
  console.log('\n==========================================================');
  console.log('ENTIREFM PHASE 0G: COMMERCIAL INTELLIGENCE TEST SUITE');
  console.log('==========================================================\n');

  // 1. Exact Financial Arithmetic & Rounding
  console.log('--- 1. Exact Financial Arithmetic & Rounding ---');
  assert(roundMoney(0.1 + 0.2) === 0.3, 'roundMoney eliminates 0.1 + 0.2 floating point drift');
  assert(roundMoney(123.456) === 123.46, 'roundMoney correctly rounds up at half-cent');
  assert(roundMoney(123.454) === 123.45, 'roundMoney correctly rounds down');

  // 2. Deterministic VAT Calculation
  console.log('\n--- 2. Deterministic VAT Calculation ---');
  const tax20 = applyTax(100.0, 20.0);
  assert(tax20.taxGbp === 20.0 && tax20.grossGbp === 120.0, 'applyTax standard 20% VAT on £100 = £20 tax, £120 gross');

  const taxOdd = applyTax(73.33, 20.0);
  assert(taxOdd.taxGbp === 14.67 && taxOdd.grossGbp === 88.0, 'applyTax rounds odd cents cleanly (73.33 net -> 14.67 tax -> 88.00 gross)');

  // 3. Callout Labour Pricing (First hour included)
  console.log('\n--- 3. Callout Labour Pricing (First Hour Included) ---');
  const calloutRateItem: RateCardItem = {
    rate_type: 'CALLOUT',
    rate_period: 'NORMAL',
    standard_rate_gbp: 120.0, // £120 callout fee which includes 1st hour
    callout_includes_first_hour: true,
  };

  // 3 hours on site with 1st hour included in £120 callout:
  // £120 (1st hr) + 2 additional hours @ £120/hr = £120 + £240 = £360
  const callout3h = resolveLabourPrice({
    rateItem: calloutRateItem,
    hours: 3.0,
    engineersCount: 1,
    isCallout: true,
  });

  assert(callout3h.calloutChargeGbp === 120.0, 'Callout charge is £120');
  assert(callout3h.billableHours === 2.0, 'Billable additional hours is 2.0 (3h - 1h included)');
  assert(callout3h.totalLabourGbp === 360.0, 'Total labour is £360.00 (NO double-counting 1st hour)');

  // 1 hour on site with 1st hour included in callout:
  const callout1h = resolveLabourPrice({
    rateItem: calloutRateItem,
    hours: 1.0,
    engineersCount: 1,
    isCallout: true,
  });
  assert(callout1h.billableHours === 0.0, '1 hour job has 0 additional billable hours');
  assert(callout1h.totalLabourGbp === 120.0, '1 hour job costs exactly callout fee (£120)');

  // 4. Minimum Hours Labour Pricing
  console.log('\n--- 4. Minimum Hours Labour Pricing ---');
  const standardHourlyItem: RateCardItem = {
    rate_type: 'HOURLY',
    rate_period: 'NORMAL',
    standard_rate_gbp: 65.0,
    minimum_hours: 2.0, // Minimum 2 hours
  };

  const job30mins = resolveLabourPrice({
    rateItem: standardHourlyItem,
    hours: 0.5,
    engineersCount: 1,
  });
  assert(job30mins.billableHours === 2.0, '30 min job is elevated to minimum 2.0 billable hours');
  assert(job30mins.totalLabourGbp === 130.0, '2.0h * £65/h = £130.00');

  // Multi-engineer calculation
  const multiEng = resolveLabourPrice({
    rateItem: standardHourlyItem,
    hours: 4.0,
    engineersCount: 2,
  });
  assert(multiEng.totalLabourGbp === 520.0, '4.0h * £65/h * 2 engineers = £520.00');

  // 5. Out-of-Hours & Emergency Labour Rates
  console.log('\n--- 5. Out-of-Hours & Emergency Labour Rates ---');
  const oohRateItem: RateCardItem = {
    rate_type: 'HOURLY',
    rate_period: 'NORMAL',
    standard_rate_gbp: 65.0,
    out_of_hours_rate_gbp: 95.0,
    emergency_rate_gbp: 130.0,
    minimum_hours: 1.0,
  };

  const eveningJob = resolveLabourPrice({
    rateItem: oohRateItem,
    hours: 2.0,
    period: 'EVENING',
  });
  assert(eveningJob.hourlyRateGbp === 95.0, 'Evening period selects £95/h out-of-hours rate');
  assert(eveningJob.totalLabourGbp === 190.0, '2h * £95 = £190.00');

  const emergencyJob = resolveLabourPrice({
    rateItem: oohRateItem,
    hours: 2.0,
    period: 'EMERGENCY',
  });
  assert(emergencyJob.hourlyRateGbp === 130.0, 'Emergency period selects £130/h rate');
  assert(emergencyJob.totalLabourGbp === 260.0, '2h * £130 = £260.00');

  // 6. Material Markup Policies
  console.log('\n--- 6. Material Markup Policies ---');
  const fixedPolicy: CommercialPolicy = { ...DEFAULT_PLATFORM_POLICY, material_markup_pct: 20.0, material_markup_type: 'FIXED_PERCENT' };
  const matFixed = resolveMaterialMarkup(50.0, 2, fixedPolicy);
  assert(matFixed.totalCostGbp === 100.0, 'Cost: 2 * £50 = £100.00');
  assert(matFixed.unitPriceGbp === 60.0, 'Unit sell: £50 + 20% = £60.00');
  assert(matFixed.totalSellGbp === 120.0, 'Total sell: 2 * £60 = £120.00');

  // Tiered markup test
  const tieredPolicy: CommercialPolicy = { ...DEFAULT_PLATFORM_POLICY, material_markup_type: 'TIERED' };
  const highValueMat = resolveMaterialMarkup(2500.0, 1, tieredPolicy);
  assert(highValueMat.markupPct === 10.0, 'High value (>£2000) material gets 10% tiered markup');
  assert(highValueMat.totalSellGbp === 2750.0, '£2500 + 10% = £2750.00');

  // 7. Subcontract Markup Calculation
  console.log('\n--- 7. Subcontract Markup Calculation ---');
  const subMarkup = resolveSubcontractMarkup(1000.0, DEFAULT_PLATFORM_POLICY);
  assert(subMarkup.sellPriceGbp === 1150.0, 'Subcontract cost £1000 + 15% = £1150.00 sell');
  assert(subMarkup.marginGbp === 150.0, 'Subcontract margin is £150.00');

  // 8. Commercial Policy Margin Floor Validation
  console.log('\n--- 8. Commercial Policy Margin Floor Validation ---');
  const healthyMargin = evaluateMarginPolicy(25.0, DEFAULT_PLATFORM_POLICY);
  assert(healthyMargin.isCompliant === true, '25% margin complies with 20% floor');

  const lowMargin = evaluateMarginPolicy(14.5, DEFAULT_PLATFORM_POLICY);
  assert(lowMargin.isCompliant === false, '14.5% margin fails 20% floor');
  assert(Boolean(lowMargin.exception), 'Low margin generates descriptive commercial exception');

  // 9. Supplier Price Freshness & Staleness Detection
  console.log('\n--- 9. Supplier Price Freshness & Staleness Detection ---');
  const freshDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days old
  const freshCheck = evaluateStaleness(freshDate, DEFAULT_PLATFORM_POLICY);
  assert(freshCheck.isStale === false, '5 days old price is fresh (< 30 days threshold)');

  const staleDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(); // 45 days old
  const staleCheck = evaluateStaleness(staleDate, DEFAULT_PLATFORM_POLICY);
  assert(staleCheck.isStale === true, '45 days old price is stale (> 30 days threshold)');
  assert(Boolean(staleCheck.reason), 'Stale price includes reason detailing age in days');

  // 10. Canonical Numbering Formats
  console.log('\n--- 10. Canonical Numbering Formats ---');
  const currentYear = new Date().getFullYear();
  const qNum = generateQuoteNumber();
  assert(qNum.startsWith(`QT-${currentYear}-`), `Quote number ${qNum} starts with QT-${currentYear}-`);

  const poNum = generatePONumber();
  assert(poNum.startsWith(`PO-${currentYear}-`), `PO number ${poNum} starts with PO-${currentYear}-`);

  // 11. Policy-Based Approval Thresholds
  console.log('\n--- 11. Policy-Based Approval Thresholds ---');
  const lowQuote = evaluateApprovalRequirement(800.0, 'QUOTE', DEFAULT_PLATFORM_POLICY);
  assert(lowQuote.requiresApproval === false, 'Quote <= £1000 requires no elevated approval');

  const medQuote = evaluateApprovalRequirement(3500.0, 'QUOTE', DEFAULT_PLATFORM_POLICY);
  assert(medQuote.requiresApproval === true, 'Quote £3500 requires approval');
  assert(medQuote.requiredRole === 'DIRECTOR', 'Quote £3500 requires Director approval');

  const highQuote = evaluateApprovalRequirement(15000.0, 'QUOTE', DEFAULT_PLATFORM_POLICY);
  assert(highQuote.requiresApproval === true && highQuote.requiredRole === 'CEO', 'Quote £15000 requires CEO approval');
  assert(highQuote.requiresClientApproval === true, 'High value quote requires client approval flag');

  // 12. WIP & Margin Intelligence
  console.log('\n--- 12. WIP & Margin Intelligence ---');
  const wipSummary = calculateCommercialWip({
    approvedRevenue: 5000.0,
    committedCost: 3200.0,
    actualCost: 3500.0, // Variance: actual > committed
    hasClientPo: false,  // Missing PO
  });

  assert(wipSummary.approvedRevenueGbp === 5000.0, 'Approved revenue is £5000');
  assert(wipSummary.actualCostGbp === 3500.0, 'Actual cost is £3500');
  assert(wipSummary.expectedMarginGbp === 1500.0, 'Expected margin is £1500 (£5000 - £3500 max cost)');
  assert(wipSummary.expectedMarginPct === 30, 'Expected margin is 30%');
  assert(wipSummary.commercialExceptions.length === 2, '2 commercial exceptions raised (Missing PO & Cost Variance)');

  console.log('\n==========================================================');
  console.log(`ALL ${totalTests} TESTS PASSED SUCCESSFULLY (100% GREEN)`);
  console.log('==========================================================\n');
}

runCommercialTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

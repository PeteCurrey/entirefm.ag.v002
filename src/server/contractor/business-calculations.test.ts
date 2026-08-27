/**
 * AUTOMATED CALCULATION TEST SUITE (CP-08)
 * ========================================
 * Tests deterministic financial calculations for FM contractors.
 */

import {
  calculateLabourRate,
  calculateJobMargin,
  calculateCallOutRate,
  calculateTravelCost,
  calculateEngineerUtilisation,
  calculateVat,
  generatePpm12MonthPlan,
} from './business-calculations';

export function runBusinessCalculationTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      errors.push(`FAILED: ${testName}`);
    }
  }

  // 1. Labour Rate Calculation
  try {
    const labour = calculateLabourRate({
      annualSalary: 42000,
      contractedHoursPerWeek: 40,
      workingWeeksPerYear: 52,
      annualLeaveDays: 25,
      bankHolidayDays: 8,
      annualTrainingDays: 5,
      annualSickUnproductiveDays: 5,
      nonBillableHoursPerWeek: 4,
      monthlyVanAndInsurance: 450,
      annualFuelCost: 2400,
      annualMaintenanceAndTyres: 600,
      annualToolsAndCalibration: 500,
      annualPhoneAndSoftware: 360,
      annualPpeAndUniform: 250,
      annualOverheadAllocation: 6000,
      targetMarginPct: 25,
    });

    assert(labour.grossPaidHours === 2080, 'Labour gross paid hours should equal 40 * 52 = 2080');
    assert(labour.annualEmploymentCost > 42000, 'Employment cost must include employer NI & Pension');
    assert(labour.trueCostPerProductiveHour > 30, 'True cost per productive hour must exceed base salary/2080');
    assert(labour.chargeOutRateAtTargetMargin > labour.trueCostPerProductiveHour, 'Charge rate must exceed break even');
  } catch (e: any) {
    failed++;
    errors.push(`Labour Rate error: ${e.message}`);
  }

  // 2. Margin vs Markup Differentiation
  try {
    const marginResult = calculateJobMargin({
      sellPriceNet: 1000,
      labourHours: 10,
      labourCostPerHour: 40, // 400
      materialsBuyCost: 300,  // 300
      desiredTargetMarginPct: 30,
    });

    // Cost = 700. Profit = 300. Margin = 300/1000 = 30%. Markup = 300/700 = 42.9%
    assert(marginResult.grossMarginPct === 30, 'Margin should equal exactly 30%');
    assert(marginResult.markupPct === 42.9, 'Markup should equal exactly 42.9%');
    assert(marginResult.grossMarginPct !== marginResult.markupPct, 'Margin and markup must be mathematically distinct');
    assert(marginResult.isLossMaking === false, 'Should not be loss making');
  } catch (e: any) {
    failed++;
    errors.push(`Margin test error: ${e.message}`);
  }

  // 3. Negative Margin & Target Price
  try {
    const lossResult = calculateJobMargin({
      sellPriceNet: 500,
      labourHours: 10,
      labourCostPerHour: 50, // 500
      materialsBuyCost: 200,  // 200 => Total cost 700
      desiredTargetMarginPct: 25,
    });

    assert(lossResult.isLossMaking === true, 'Cost £700 > Sell £500 must flag loss making');
    assert(lossResult.targetSellPriceForDesiredMargin === 933.33, 'Target sell price for 25% margin on £700 cost should be £933.33');
  } catch (e: any) {
    failed++;
    errors.push(`Loss test error: ${e.message}`);
  }

  // 4. Call-Out Pricing
  try {
    const callout = calculateCallOutRate({
      hourlyCostRate: 40,
      travelDistanceMiles: 30,
      travelTimeHours: 1,
      onSiteTimeHours: 1.5,
      callOutTypeMultiplier: 1.5, // OOH
      minimumCallOutHours: 2,
      targetMarginPct: 30,
    });

    assert(callout.onSiteLabourCost === 2 * 40 * 1.5, 'Minimum 2 hours must be charged for on site labour');
    assert(callout.vehicleCost === 30 * 0.45, 'Vehicle cost 30 * 0.45 = 13.5');
    assert(callout.recommendedSellPrice > callout.breakEvenSellPrice, 'Recommended sell price must exceed break-even');
  } catch (e: any) {
    failed++;
    errors.push(`Call-out test error: ${e.message}`);
  }

  // 5. Travel Cost Calculation
  try {
    const travel = calculateTravelCost({
      roundTripDistanceMiles: 60,
      travelTimeHours: 1.5,
      engineerHourlyLabourCost: 35,
      parkingGbp: 12,
    });

    assert(travel.vehicleCost === 27, '60 miles * 0.45 = £27');
    assert(travel.labourTravelCost === 52.5, '1.5 hrs * £35 = £52.50');
    assert(travel.totalTrueTravelCost === 27 + 52.5 + 12, 'Total travel cost = £91.50');
  } catch (e: any) {
    failed++;
    errors.push(`Travel test error: ${e.message}`);
  }

  // 6. Engineer Utilisation & Capacity
  try {
    const util = calculateEngineerUtilisation({
      engineerHeadcount: 5,
      contractedHoursPerWeek: 40,
      workingWeeksPerYear: 52,
      annualLeaveDays: 25,
      bankHolidayDays: 8,
      trainingAndMeetingDays: 5,
      targetBillablePct: 80,
      averageChargeOutRatePerHour: 50,
    });

    assert(util.totalPaidHours === 5 * 2080, '5 engineers * 2080 = 10400 paid hours');
    assert(util.annualRevenueDeliveryCapacityGbp > 0, 'Revenue capacity must be calculated');
  } catch (e: any) {
    failed++;
    errors.push(`Utilisation test error: ${e.message}`);
  }

  // 7. VAT Add / Remove Reversibility
  try {
    const net = 1500;
    const addVat = calculateVat(net, 20, 'ADD');
    assert(addVat.vatAmount === 300, '20% VAT on 1500 = 300');
    assert(addVat.grossAmount === 1800, 'Gross = 1800');

    const removeVat = calculateVat(1800, 20, 'REMOVE');
    assert(removeVat.netAmount === 1500, 'Removing 20% VAT from 1800 must yield 1500');
  } catch (e: any) {
    failed++;
    errors.push(`VAT test error: ${e.message}`);
  }

  // 8. 12-Month PPM Recurrence
  try {
    const ppm = generatePpm12MonthPlan([
      { id: '1', assetName: 'AHU-01', discipline: 'HVAC', frequency: 'QUARTERLY', estimatedHoursPerVisit: 3 },
      { id: '2', assetName: 'Water Tank', discipline: 'Plumbing', frequency: 'MONTHLY', estimatedHoursPerVisit: 1 },
    ]);

    assert(ppm.months.length === 12, 'Must generate exactly 12 months');
    // Quarterly has 4 visits (months 0, 3, 6, 9) = 12h. Monthly has 12 visits = 12h. Total = 24h.
    assert(ppm.annualTotalHours === 24, 'Annual PPM hours = 24h');
    assert(ppm.annualTotalVisits === 16, 'Annual PPM visits = 4 + 12 = 16');
  } catch (e: any) {
    failed++;
    errors.push(`PPM test error: ${e.message}`);
  }

  return { passed, failed, errors };
}

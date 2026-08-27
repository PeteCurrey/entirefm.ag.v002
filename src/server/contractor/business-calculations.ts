/**
 * ENTIREFM CONTRACTOR BUSINESS CALCULATION ENGINE (CP-08)
 * ========================================================
 * Pure deterministic financial calculation core.
 * Lobby-ready, sister-platform ready, and independently testable.
 *
 * Covers:
 * 1. Labour Rate & True Cost per Productive Hour
 * 2. Job Margin & Markup Economics
 * 3. Call-Out & Emergency Pricing
 * 4. Mileage & Travel Cost Allocation
 * 5. Engineer Utilisation & Revenue Delivery Capacity
 * 6. VAT Calculations (Add / Remove)
 * 7. 12-Month PPM Recurrence Planning
 */

// ─────────────────────────────────────────────────────────────
// 1. LABOUR RATE & TRUE COST PER PRODUCTIVE HOUR
// ─────────────────────────────────────────────────────────────
export interface LabourRateInputs {
  annualSalary: number;
  employerNiRatePct?: number; // default 13.8%
  employerPensionRatePct?: number; // default 3.0%
  annualBonusOrAllowances?: number;
  contractedHoursPerWeek: number; // e.g. 40
  workingWeeksPerYear: number; // e.g. 52
  annualLeaveDays: number; // e.g. 25
  bankHolidayDays: number; // e.g. 8
  annualTrainingDays: number; // e.g. 5
  annualSickUnproductiveDays: number; // e.g. 5
  nonBillableHoursPerWeek: number; // e.g. 4 (admin, loading, meetings)
  monthlyVanAndInsurance: number; // e.g. 450
  annualFuelCost: number; // e.g. 2400
  annualMaintenanceAndTyres: number; // e.g. 600
  annualToolsAndCalibration: number; // e.g. 500
  annualPhoneAndSoftware: number; // e.g. 360
  annualPpeAndUniform: number; // e.g. 250
  annualOverheadAllocation: number; // e.g. 6000 (fixed) or % of cost
  targetMarginPct: number; // e.g. 25%
}

export interface LabourRateOutputs {
  grossPaidHours: number;
  deductibleNonWorkingHours: number;
  netProductiveHours: number;
  annualBillableHours: number;
  annualEmploymentCost: number;
  annualVanAndTravelDirectCost: number;
  annualToolsAndSundriesCost: number;
  totalDirectCostPerOperative: number;
  totalFullyLoadedAnnualCost: number;
  trueCostPerProductiveHour: number; // Break-even
  chargeOutRateAtTargetMargin: number;
  equivalentDayRate: number; // 8-hour day
  minimumCallOutChargeSuggested: number;
  marginAtTargetRate: number;
  markupAtTargetRatePct: number;
  scenarios: {
    conservative: { billableHours: number; breakEven: number; targetRate: number };
    base: { billableHours: number; breakEven: number; targetRate: number };
    target: { billableHours: number; breakEven: number; targetRate: number };
  };
}

export function calculateLabourRate(inputs: LabourRateInputs): LabourRateOutputs {
  const niRate = (inputs.employerNiRatePct ?? 13.8) / 100;
  const pensionRate = (inputs.employerPensionRatePct ?? 3.0) / 100;

  // 1. Employment Cost
  const salary = Math.max(0, inputs.annualSalary);
  const bonus = Math.max(0, inputs.annualBonusOrAllowances || 0);
  const employerNi = salary * niRate;
  const employerPension = salary * pensionRate;
  const annualEmploymentCost = salary + bonus + employerNi + employerPension;

  // 2. Working Time & Hours
  const dailyHours = inputs.contractedHoursPerWeek > 0 ? inputs.contractedHoursPerWeek / 5 : 8;
  const grossPaidHours = inputs.contractedHoursPerWeek * inputs.workingWeeksPerYear;

  const leaveHours = inputs.annualLeaveDays * dailyHours;
  const bankHolHours = inputs.bankHolidayDays * dailyHours;
  const trainingHours = inputs.annualTrainingDays * dailyHours;
  const sickHours = inputs.annualSickUnproductiveDays * dailyHours;
  const totalDaysOffHours = leaveHours + bankHolHours + trainingHours + sickHours;

  const netAvailableWeeks = Math.max(0, inputs.workingWeeksPerYear - (inputs.annualLeaveDays + inputs.bankHolidayDays + inputs.annualTrainingDays + inputs.annualSickUnproductiveDays) / 5);
  const nonBillableAdminHours = inputs.nonBillableHoursPerWeek * netAvailableWeeks;

  const deductibleNonWorkingHours = totalDaysOffHours + nonBillableAdminHours;
  const netProductiveHours = Math.max(1, grossPaidHours - totalDaysOffHours);
  const annualBillableHours = Math.max(1, grossPaidHours - deductibleNonWorkingHours);

  // 3. Direct Operative Expenses
  const vanCost = (inputs.monthlyVanAndInsurance || 0) * 12 + (inputs.annualFuelCost || 0) + (inputs.annualMaintenanceAndTyres || 0);
  const toolsAndSundries = (inputs.annualToolsAndCalibration || 0) + (inputs.annualPhoneAndSoftware || 0) + (inputs.annualPpeAndUniform || 0);
  const totalDirectCostPerOperative = annualEmploymentCost + vanCost + toolsAndSundries;

  // 4. Overhead Allocation
  const totalFullyLoadedAnnualCost = totalDirectCostPerOperative + (inputs.annualOverheadAllocation || 0);

  // 5. True Cost & Rates
  const trueCostPerProductiveHour = totalFullyLoadedAnnualCost / annualBillableHours;

  // Target Selling Rate: Price = Cost / (1 - Margin%)
  const marginFrac = Math.min(0.9, Math.max(0, (inputs.targetMarginPct || 0) / 100));
  const chargeOutRateAtTargetMargin = marginFrac < 1 ? trueCostPerProductiveHour / (1 - marginFrac) : trueCostPerProductiveHour;
  const equivalentDayRate = chargeOutRateAtTargetMargin * 8;
  const minimumCallOutChargeSuggested = chargeOutRateAtTargetMargin * 1.5;

  const markupAtTargetRatePct = trueCostPerProductiveHour > 0 ? ((chargeOutRateAtTargetMargin - trueCostPerProductiveHour) / trueCostPerProductiveHour) * 100 : 0;

  // Scenarios
  const consHours = Math.max(1, annualBillableHours * 0.85);
  const targetHours = Math.max(1, annualBillableHours * 1.1);

  return {
    grossPaidHours: Math.round(grossPaidHours),
    deductibleNonWorkingHours: Math.round(deductibleNonWorkingHours),
    netProductiveHours: Math.round(netProductiveHours),
    annualBillableHours: Math.round(annualBillableHours),
    annualEmploymentCost: Math.round(annualEmploymentCost * 100) / 100,
    annualVanAndTravelDirectCost: Math.round(vanCost * 100) / 100,
    annualToolsAndSundriesCost: Math.round(toolsAndSundries * 100) / 100,
    totalDirectCostPerOperative: Math.round(totalDirectCostPerOperative * 100) / 100,
    totalFullyLoadedAnnualCost: Math.round(totalFullyLoadedAnnualCost * 100) / 100,
    trueCostPerProductiveHour: Math.round(trueCostPerProductiveHour * 100) / 100,
    chargeOutRateAtTargetMargin: Math.round(chargeOutRateAtTargetMargin * 100) / 100,
    equivalentDayRate: Math.round(equivalentDayRate * 100) / 100,
    minimumCallOutChargeSuggested: Math.round(minimumCallOutChargeSuggested * 100) / 100,
    marginAtTargetRate: inputs.targetMarginPct,
    markupAtTargetRatePct: Math.round(markupAtTargetRatePct * 10) / 10,
    scenarios: {
      conservative: {
        billableHours: Math.round(consHours),
        breakEven: Math.round((totalFullyLoadedAnnualCost / consHours) * 100) / 100,
        targetRate: Math.round(((totalFullyLoadedAnnualCost / consHours) / (1 - marginFrac)) * 100) / 100,
      },
      base: {
        billableHours: Math.round(annualBillableHours),
        breakEven: Math.round(trueCostPerProductiveHour * 100) / 100,
        targetRate: Math.round(chargeOutRateAtTargetMargin * 100) / 100,
      },
      target: {
        billableHours: Math.round(targetHours),
        breakEven: Math.round((totalFullyLoadedAnnualCost / targetHours) * 100) / 100,
        targetRate: Math.round(((totalFullyLoadedAnnualCost / targetHours) / (1 - marginFrac)) * 100) / 100,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 2. JOB MARGIN & MARKUP CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface JobMarginInputs {
  sellPriceNet: number;
  labourHours: number;
  labourCostPerHour: number;
  materialsBuyCost: number;
  materialsWasteDeliveryPct?: number; // e.g. 5%
  plantAndAccessHireCost?: number;
  subcontractCost?: number;
  travelAndParkingCost?: number;
  otherDirectCosts?: number;
  allocatedOverheadPct?: number; // e.g. 10%
  desiredTargetMarginPct?: number; // e.g. 30%
}

export interface JobMarginOutputs {
  sellPriceNet: number;
  totalDirectCost: number;
  totalCostWithOverhead: number;
  grossProfitGbp: number;
  grossMarginPct: number; // (Sell - Cost) / Sell
  markupPct: number; // (Sell - Cost) / Cost
  targetSellPriceForDesiredMargin: number;
  isLossMaking: boolean;
  isBelowTargetMargin: boolean;
  sensitivity: {
    ifExtra4HoursLabour: { newCost: number; newMarginPct: number };
    ifMaterialsPlus10Pct: { newCost: number; newMarginPct: number };
  };
}

export function calculateJobMargin(inputs: JobMarginInputs): JobMarginOutputs {
  const labourCost = Math.max(0, inputs.labourHours * inputs.labourCostPerHour);
  const wasteFrac = (inputs.materialsWasteDeliveryPct || 0) / 100;
  const materialsCost = Math.max(0, inputs.materialsBuyCost * (1 + wasteFrac));
  const plantCost = Math.max(0, inputs.plantAndAccessHireCost || 0);
  const subcontractCost = Math.max(0, inputs.subcontractCost || 0);
  const travelCost = Math.max(0, inputs.travelAndParkingCost || 0);
  const otherCost = Math.max(0, inputs.otherDirectCosts || 0);

  const totalDirectCost = labourCost + materialsCost + plantCost + subcontractCost + travelCost + otherCost;
  const overheadFrac = (inputs.allocatedOverheadPct || 0) / 100;
  const totalCostWithOverhead = totalDirectCost * (1 + overheadFrac);

  const sellPrice = Math.max(0, inputs.sellPriceNet);
  const grossProfitGbp = sellPrice - totalCostWithOverhead;
  const grossMarginPct = sellPrice > 0 ? (grossProfitGbp / sellPrice) * 100 : 0;
  const markupPct = totalCostWithOverhead > 0 ? (grossProfitGbp / totalCostWithOverhead) * 100 : 0;

  const targetMarginFrac = Math.min(0.9, Math.max(0, (inputs.desiredTargetMarginPct ?? 30) / 100));
  const targetSellPriceForDesiredMargin = targetMarginFrac < 1 ? totalCostWithOverhead / (1 - targetMarginFrac) : totalCostWithOverhead;

  // Sensitivity
  const extraLabourCost = totalCostWithOverhead + 4 * inputs.labourCostPerHour * (1 + overheadFrac);
  const extraLabourMargin = sellPrice > 0 ? ((sellPrice - extraLabourCost) / sellPrice) * 100 : 0;

  const extraMatCost = totalCostWithOverhead + (inputs.materialsBuyCost * 0.1) * (1 + overheadFrac);
  const extraMatMargin = sellPrice > 0 ? ((sellPrice - extraMatCost) / sellPrice) * 100 : 0;

  return {
    sellPriceNet: Math.round(sellPrice * 100) / 100,
    totalDirectCost: Math.round(totalDirectCost * 100) / 100,
    totalCostWithOverhead: Math.round(totalCostWithOverhead * 100) / 100,
    grossProfitGbp: Math.round(grossProfitGbp * 100) / 100,
    grossMarginPct: Math.round(grossMarginPct * 10) / 10,
    markupPct: Math.round(markupPct * 10) / 10,
    targetSellPriceForDesiredMargin: Math.round(targetSellPriceForDesiredMargin * 100) / 100,
    isLossMaking: grossProfitGbp < 0,
    isBelowTargetMargin: grossMarginPct < (inputs.desiredTargetMarginPct ?? 30),
    sensitivity: {
      ifExtra4HoursLabour: {
        newCost: Math.round(extraLabourCost * 100) / 100,
        newMarginPct: Math.round(extraLabourMargin * 10) / 10,
      },
      ifMaterialsPlus10Pct: {
        newCost: Math.round(extraMatCost * 100) / 100,
        newMarginPct: Math.round(extraMatMargin * 10) / 10,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 3. CALL-OUT & EMERGENCY PRICING CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface CallOutInputs {
  hourlyCostRate: number;
  travelDistanceMiles: number;
  travelTimeHours: number;
  onSiteTimeHours: number;
  vehicleCostPerMile?: number; // default £0.45/mi
  parkingAndTollsGbp?: number;
  materialsCostGbp?: number;
  callOutTypeMultiplier: number; // 1.0 Normal, 1.5 OOH, 2.0 Bank Holiday/Emergency
  minimumCallOutHours?: number; // default 2
  targetMarginPct?: number; // default 30%
}

export interface CallOutOutputs {
  totalDirectCost: number;
  vehicleCost: number;
  travelLabourCost: number;
  onSiteLabourCost: number;
  breakEvenSellPrice: number;
  recommendedSellPrice: number;
  suggestedMinimumCharge: number;
  grossMarginPct: number;
}

export function calculateCallOutRate(inputs: CallOutInputs): CallOutOutputs {
  const vehicleCostPerMile = inputs.vehicleCostPerMile ?? 0.45;
  const vehicleCost = inputs.travelDistanceMiles * vehicleCostPerMile;
  const baseHourly = Math.max(0, inputs.hourlyCostRate);

  const travelLabourCost = inputs.travelTimeHours * baseHourly * inputs.callOutTypeMultiplier;
  const chargedOnSiteHours = Math.max(inputs.onSiteTimeHours, inputs.minimumCallOutHours ?? 2);
  const onSiteLabourCost = chargedOnSiteHours * baseHourly * inputs.callOutTypeMultiplier;
  const parkingAndTolls = inputs.parkingAndTollsGbp || 0;
  const materials = inputs.materialsCostGbp || 0;

  const totalDirectCost = vehicleCost + travelLabourCost + onSiteLabourCost + parkingAndTolls + materials;
  const marginFrac = Math.min(0.9, Math.max(0, (inputs.targetMarginPct ?? 30) / 100));

  const recommendedSellPrice = marginFrac < 1 ? totalDirectCost / (1 - marginFrac) : totalDirectCost;
  const minAttendanceCost = vehicleCost + travelLabourCost + (inputs.minimumCallOutHours ?? 2) * baseHourly * inputs.callOutTypeMultiplier + parkingAndTolls;
  const suggestedMinimumCharge = marginFrac < 1 ? minAttendanceCost / (1 - marginFrac) : minAttendanceCost;

  return {
    totalDirectCost: Math.round(totalDirectCost * 100) / 100,
    vehicleCost: Math.round(vehicleCost * 100) / 100,
    travelLabourCost: Math.round(travelLabourCost * 100) / 100,
    onSiteLabourCost: Math.round(onSiteLabourCost * 100) / 100,
    breakEvenSellPrice: Math.round(totalDirectCost * 100) / 100,
    recommendedSellPrice: Math.round(recommendedSellPrice * 100) / 100,
    suggestedMinimumCharge: Math.round(suggestedMinimumCharge * 100) / 100,
    grossMarginPct: inputs.targetMarginPct ?? 30,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. MILEAGE & TRAVEL COST CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface TravelCostInputs {
  roundTripDistanceMiles: number;
  vehicleFuelAndWearCostPerMile?: number; // default £0.45
  travelTimeHours: number;
  engineerHourlyLabourCost: number;
  parkingGbp?: number;
  tollsAndUlezGbp?: number;
  overnightAccommodationGbp?: number;
}

export interface TravelCostOutputs {
  vehicleCost: number;
  labourTravelCost: number;
  otherTravelCost: number;
  totalTrueTravelCost: number;
  costPerMile: number;
  recommendedRecoverableTravelPrice: number;
}

export function calculateTravelCost(inputs: TravelCostInputs): TravelCostOutputs {
  const ratePerMile = inputs.vehicleFuelAndWearCostPerMile ?? 0.45;
  const vehicleCost = inputs.roundTripDistanceMiles * ratePerMile;
  const labourTravelCost = inputs.travelTimeHours * inputs.engineerHourlyLabourCost;
  const otherTravelCost = (inputs.parkingGbp || 0) + (inputs.tollsAndUlezGbp || 0) + (inputs.overnightAccommodationGbp || 0);

  const totalTrueTravelCost = vehicleCost + labourTravelCost + otherTravelCost;
  const costPerMile = inputs.roundTripDistanceMiles > 0 ? totalTrueTravelCost / inputs.roundTripDistanceMiles : 0;
  const recommendedRecoverableTravelPrice = totalTrueTravelCost * 1.25; // 20% margin on travel

  return {
    vehicleCost: Math.round(vehicleCost * 100) / 100,
    labourTravelCost: Math.round(labourTravelCost * 100) / 100,
    otherTravelCost: Math.round(otherTravelCost * 100) / 100,
    totalTrueTravelCost: Math.round(totalTrueTravelCost * 100) / 100,
    costPerMile: Math.round(costPerMile * 100) / 100,
    recommendedRecoverableTravelPrice: Math.round(recommendedRecoverableTravelPrice * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. ENGINEER UTILISATION & REVENUE CAPACITY
// ─────────────────────────────────────────────────────────────
export interface UtilisationInputs {
  engineerHeadcount: number;
  contractedHoursPerWeek: number; // e.g. 40
  workingWeeksPerYear: number; // e.g. 52
  annualLeaveDays: number; // e.g. 25
  bankHolidayDays: number; // e.g. 8
  trainingAndMeetingDays: number; // e.g. 6
  targetBillablePct: number; // e.g. 75%
  averageChargeOutRatePerHour?: number; // e.g. £55
}

export interface UtilisationOutputs {
  totalPaidHours: number;
  totalProductiveHours: number;
  targetBillableHoursAnnual: number;
  targetBillableHoursMonthly: number;
  targetBillableHoursWeekly: number;
  annualRevenueDeliveryCapacityGbp: number;
  monthlyRevenueDeliveryCapacityGbp: number;
}

export function calculateEngineerUtilisation(inputs: UtilisationInputs): UtilisationOutputs {
  const headcount = Math.max(1, inputs.engineerHeadcount);
  const dailyHours = inputs.contractedHoursPerWeek / 5;
  const singleGrossHours = inputs.contractedHoursPerWeek * inputs.workingWeeksPerYear;
  const singleDeductibleDays = inputs.annualLeaveDays + inputs.bankHolidayDays + inputs.trainingAndMeetingDays;
  const singleProductiveHours = Math.max(0, singleGrossHours - singleDeductibleDays * dailyHours);

  const totalPaidHours = singleGrossHours * headcount;
  const totalProductiveHours = singleProductiveHours * headcount;
  const billableFrac = Math.min(1, Math.max(0, inputs.targetBillablePct / 100));

  const targetBillableHoursAnnual = totalProductiveHours * billableFrac;
  const targetBillableHoursMonthly = targetBillableHoursAnnual / 12;
  const targetBillableHoursWeekly = targetBillableHoursAnnual / 52;

  const rate = inputs.averageChargeOutRatePerHour || 0;
  const annualRevenueDeliveryCapacityGbp = targetBillableHoursAnnual * rate;
  const monthlyRevenueDeliveryCapacityGbp = annualRevenueDeliveryCapacityGbp / 12;

  return {
    totalPaidHours: Math.round(totalPaidHours),
    totalProductiveHours: Math.round(totalProductiveHours),
    targetBillableHoursAnnual: Math.round(targetBillableHoursAnnual),
    targetBillableHoursMonthly: Math.round(targetBillableHoursMonthly),
    targetBillableHoursWeekly: Math.round(targetBillableHoursWeekly),
    annualRevenueDeliveryCapacityGbp: Math.round(annualRevenueDeliveryCapacityGbp),
    monthlyRevenueDeliveryCapacityGbp: Math.round(monthlyRevenueDeliveryCapacityGbp),
  };
}

// ─────────────────────────────────────────────────────────────
// 6. VAT CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface VatCalculationOutputs {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  vatRatePct: number;
}

export function calculateVat(amount: number, vatRatePct = 20, direction: 'ADD' | 'REMOVE' = 'ADD'): VatCalculationOutputs {
  const rateFrac = vatRatePct / 100;
  let net: number;
  let vat: number;
  let gross: number;

  if (direction === 'ADD') {
    net = amount;
    vat = net * rateFrac;
    gross = net + vat;
  } else {
    gross = amount;
    net = gross / (1 + rateFrac);
    vat = gross - net;
  }

  return {
    netAmount: Math.round(net * 100) / 100,
    vatAmount: Math.round(vat * 100) / 100,
    grossAmount: Math.round(gross * 100) / 100,
    vatRatePct,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. 12-MONTH PPM PLANNER GENERATOR
// ─────────────────────────────────────────────────────────────
export type PpmFrequency = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SIX_MONTHLY' | 'ANNUAL';

export interface PpmAssetTaskInput {
  id: string;
  assetName: string;
  discipline: string;
  frequency: PpmFrequency;
  estimatedHoursPerVisit: number;
  startMonthOffset?: number; // 0 = Jan/Start
}

export interface PpmScheduleMonth {
  monthNumber: number; // 1-12
  monthLabel: string;
  scheduledTasks: Array<{
    assetId: string;
    assetName: string;
    discipline: string;
    frequency: PpmFrequency;
    estimatedHours: number;
  }>;
  totalHours: number;
}

export function generatePpm12MonthPlan(
  tasks: PpmAssetTaskInput[],
  startMonth = new Date().getMonth() + 1
): {
  months: PpmScheduleMonth[];
  annualTotalHours: number;
  annualTotalVisits: number;
} {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months: PpmScheduleMonth[] = [];

  for (let i = 0; i < 12; i++) {
    const actualMonthIndex = (startMonth - 1 + i) % 12;
    months.push({
      monthNumber: i + 1,
      monthLabel: monthNames[actualMonthIndex],
      scheduledTasks: [],
      totalHours: 0,
    });
  }

  let annualTotalHours = 0;
  let annualTotalVisits = 0;

  for (const task of tasks) {
    const hours = Math.max(0.5, task.estimatedHoursPerVisit);
    for (let m = 0; m < 12; m++) {
      let isScheduled = false;
      if (task.frequency === 'WEEKLY' || task.frequency === 'MONTHLY') {
        isScheduled = true;
      } else if (task.frequency === 'QUARTERLY' && m % 3 === 0) {
        isScheduled = true;
      } else if (task.frequency === 'SIX_MONTHLY' && m % 6 === 0) {
        isScheduled = true;
      } else if (task.frequency === 'ANNUAL' && m === 0) {
        isScheduled = true;
      }

      if (isScheduled) {
        months[m].scheduledTasks.push({
          assetId: task.id,
          assetName: task.assetName,
          discipline: task.discipline,
          frequency: task.frequency,
          estimatedHours: hours,
        });
        months[m].totalHours += hours;
        annualTotalHours += hours;
        annualTotalVisits += 1;
      }
    }
  }

  return {
    months,
    annualTotalHours: Math.round(annualTotalHours * 10) / 10,
    annualTotalVisits,
  };
}

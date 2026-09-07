/**
 * ASSET LIFECYCLE & CAPEX CALCULATION ENGINE
 * ===========================================
 * Computes remaining useful life (RUL), condition factor impacts,
 * regional replacement cost scaling, urgent at-risk equipment prioritization,
 * and rolling 10-year capital expenditure forecast buckets.
 *
 * Current year is dynamic: resolves from system date `new Date().getFullYear()`.
 */

import {
  getCapexAssetById,
  AssetCondition,
  CONDITION_FACTORS,
  CAPEX_REGIONS,
  CapexAssetDefinition,
} from './capex-taxonomy';

export interface CapexItemInput {
  id: string; // Unique row key
  assetId: string; // References capex-taxonomy asset id
  customName?: string; // Optional user label (e.g. "Main Plant Room Boiler 1")
  installYear: number;
  condition: AssetCondition;
  quantity: number;
  costOverride?: number; // Optional user override for replacement cost (£)
}

export type UrgencyStatus =
  | 'AT_RISK_NOW' // RUL <= 0 (past or at expected end-of-life)
  | 'IMMINENT_1_3_YRS' // 1 <= RUL <= 3
  | 'MEDIUM_4_7_YRS' // 4 <= RUL <= 7
  | 'LONG_8_10_YRS' // 8 <= RUL <= 10
  | 'POST_10_YRS'; // RUL > 10 (beyond 10-yr planning horizon)

export interface CalculatedCapexAsset {
  id: string;
  assetId: string;
  displayName: string;
  categoryName: string;
  categoryId: string;
  installYear: number;
  ageYears: number;
  condition: AssetCondition;
  quantity: number;
  nominalLifespan: number;
  adjustedLifespan: number;
  remainingUsefulLife: number; // RUL in years
  replacementDueYear: number;
  isAtRiskNow: boolean;
  unitCost: number;
  totalCost: number;
  urgencyStatus: UrgencyStatus;
  governanceNote: string;
}

export interface TenYearForecastYear {
  year: number;
  relativeYear: number; // 1 to 10
  totalSpend: number;
  assetCount: number;
  assets: CalculatedCapexAsset[];
}

export interface CapexForecastSummary {
  currentYear: number;
  horizonStartYear: number;
  horizonEndYear: number;
  totalTenYearCapex: number;
  immediateAtRiskCapital: number;
  immediateAtRiskCount: number;
  totalAssetsCount: number;
  totalAssetUnits: number;
  averageAssetAge: number;
  oldestAssetAge: number;
  forecastYears: TenYearForecastYear[];
  atRiskAssets: CalculatedCapexAsset[];
  postHorizonAssets: CalculatedCapexAsset[];
  regionalMultiplier: number;
  regionKey: string;
  regionName: string;
  categorySpendBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    totalSpend: number;
    percentOfTotal: number;
  }>;
}

export interface CapexCalculationOptions {
  regionKey?: string;
  currentYear?: number;
}

/**
 * Calculates single asset metrics against dynamic current year and condition.
 */
export function calculateSingleAsset(
  item: CapexItemInput,
  options?: CapexCalculationOptions
): CalculatedCapexAsset {
  const currentYear = options?.currentYear ?? new Date().getFullYear();
  const regionKey = options?.regionKey ?? 'national';
  const regionConfig = CAPEX_REGIONS[regionKey] || CAPEX_REGIONS.national;
  const regionMultiplier = regionConfig.multiplier;

  const assetDef: CapexAssetDefinition | undefined = getCapexAssetById(item.assetId);

  const nominalLifespan = assetDef ? assetDef.nominalYears : 15;
  const conditionConfig = CONDITION_FACTORS[item.condition] || CONDITION_FACTORS.Fair;
  const conditionFactor = conditionConfig.factor;

  // Adjusted service life in years (rounded)
  const adjustedLifespan = Math.max(1, Math.round(nominalLifespan * conditionFactor));

  // Current age in years
  const ageYears = Math.max(0, currentYear - item.installYear);

  // Remaining Useful Life (RUL)
  const remainingUsefulLife = adjustedLifespan - ageYears;

  // Expected replacement year
  const replacementDueYear = item.installYear + adjustedLifespan;

  // At risk now if RUL <= 0
  const isAtRiskNow = remainingUsefulLife <= 0;

  // Calculate unit cost with regional multiplier or user override
  const baseCost = item.costOverride !== undefined && item.costOverride > 0
    ? item.costOverride
    : (assetDef ? assetDef.defaultCost : 10000);

  const unitCost = Math.round(baseCost * (item.costOverride ? 1 : regionMultiplier));
  const quantity = Math.max(1, item.quantity || 1);
  const totalCost = unitCost * quantity;

  // Urgency classification
  let urgencyStatus: UrgencyStatus;
  if (isAtRiskNow) {
    urgencyStatus = 'AT_RISK_NOW';
  } else if (remainingUsefulLife <= 3) {
    urgencyStatus = 'IMMINENT_1_3_YRS';
  } else if (remainingUsefulLife <= 7) {
    urgencyStatus = 'MEDIUM_4_7_YRS';
  } else if (remainingUsefulLife <= 10) {
    urgencyStatus = 'LONG_8_10_YRS';
  } else {
    urgencyStatus = 'POST_10_YRS';
  }

  const displayName = item.customName?.trim()
    ? item.customName.trim()
    : (assetDef ? assetDef.name : 'Commercial Plant Asset');

  return {
    id: item.id,
    assetId: item.assetId,
    displayName,
    categoryName: assetDef ? assetDef.categoryName : 'General Plant',
    categoryId: assetDef ? assetDef.categoryId : 'general',
    installYear: item.installYear,
    ageYears,
    condition: item.condition,
    quantity,
    nominalLifespan,
    adjustedLifespan,
    remainingUsefulLife,
    replacementDueYear,
    isAtRiskNow,
    unitCost,
    totalCost,
    urgencyStatus,
    governanceNote: assetDef ? assetDef.governanceNote : 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
  };
}

/**
 * Generates the full 10-year rolling capital forecast and estate summary.
 */
export function calculateCapexForecast(
  items: CapexItemInput[],
  options?: CapexCalculationOptions
): CapexForecastSummary {
  const currentYear = options?.currentYear ?? new Date().getFullYear();
  const regionKey = options?.regionKey ?? 'national';
  const regionConfig = CAPEX_REGIONS[regionKey] || CAPEX_REGIONS.national;

  const horizonStartYear = currentYear;
  const horizonEndYear = currentYear + 9; // 10 years inclusive (e.g. 2026..2035)

  const calculatedAssets = items.map((item) => calculateSingleAsset(item, { currentYear, regionKey }));

  // Initialise 10 forecast years
  const forecastMap = new Map<number, CalculatedCapexAsset[]>();
  for (let y = horizonStartYear; y <= horizonEndYear; y++) {
    forecastMap.set(y, []);
  }

  const atRiskAssets: CalculatedCapexAsset[] = [];
  const postHorizonAssets: CalculatedCapexAsset[] = [];

  let immediateAtRiskCapital = 0;
  let immediateAtRiskCount = 0;

  for (const asset of calculatedAssets) {
    if (asset.isAtRiskNow) {
      atRiskAssets.push(asset);
      immediateAtRiskCapital += asset.totalCost;
      immediateAtRiskCount += asset.quantity;
      // Also schedule at-risk plant in current year (Year 1) as immediate renewal backlog
      const currentYearList = forecastMap.get(horizonStartYear);
      if (currentYearList) {
        currentYearList.push(asset);
      }
    } else if (asset.replacementDueYear >= horizonStartYear && asset.replacementDueYear <= horizonEndYear) {
      const yearList = forecastMap.get(asset.replacementDueYear);
      if (yearList) {
        yearList.push(asset);
      }
    } else if (asset.replacementDueYear > horizonEndYear) {
      postHorizonAssets.push(asset);
    } else {
      // Past replacement due year but not caught earlier (defensive)
      atRiskAssets.push(asset);
      immediateAtRiskCapital += asset.totalCost;
      immediateAtRiskCount += asset.quantity;
      const currentYearList = forecastMap.get(horizonStartYear);
      if (currentYearList) {
        currentYearList.push(asset);
      }
    }
  }

  // Build ordered 10-year array
  const forecastYears: TenYearForecastYear[] = [];
  let totalTenYearCapex = 0;

  for (let i = 0; i < 10; i++) {
    const yr = horizonStartYear + i;
    const yearAssets = forecastMap.get(yr) || [];
    const yearSpend = yearAssets.reduce((sum, a) => sum + a.totalCost, 0);
    const assetCount = yearAssets.reduce((sum, a) => sum + a.quantity, 0);
    totalTenYearCapex += yearSpend;

    forecastYears.push({
      year: yr,
      relativeYear: i + 1,
      totalSpend: yearSpend,
      assetCount,
      assets: yearAssets,
    });
  }

  // Sort at-risk assets by oldest / most overdue first
  atRiskAssets.sort((a, b) => a.remainingUsefulLife - b.remainingUsefulLife);

  // Total assets and averages
  const totalAssetsCount = calculatedAssets.length;
  const totalAssetUnits = calculatedAssets.reduce((sum, a) => sum + a.quantity, 0);
  const totalAgeSum = calculatedAssets.reduce((sum, a) => sum + a.ageYears * a.quantity, 0);
  const averageAssetAge = totalAssetUnits > 0 ? Math.round((totalAgeSum / totalAssetUnits) * 10) / 10 : 0;
  const oldestAssetAge = calculatedAssets.reduce((max, a) => Math.max(max, a.ageYears), 0);

  // Category breakdown for 10-year spend
  const categorySpendMap = new Map<string, { name: string; spend: number }>();
  for (const year of forecastYears) {
    for (const a of year.assets) {
      const existing = categorySpendMap.get(a.categoryId) || { name: a.categoryName, spend: 0 };
      existing.spend += a.totalCost;
      categorySpendMap.set(a.categoryId, existing);
    }
  }

  const categorySpendBreakdown = Array.from(categorySpendMap.entries())
    .map(([catId, val]) => ({
      categoryId: catId,
      categoryName: val.name,
      totalSpend: val.spend,
      percentOfTotal: totalTenYearCapex > 0 ? Math.round((val.spend / totalTenYearCapex) * 100) : 0,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend);

  return {
    currentYear,
    horizonStartYear,
    horizonEndYear,
    totalTenYearCapex,
    immediateAtRiskCapital,
    immediateAtRiskCount,
    totalAssetsCount,
    totalAssetUnits,
    averageAssetAge,
    oldestAssetAge,
    forecastYears,
    atRiskAssets,
    postHorizonAssets,
    regionalMultiplier: regionConfig.multiplier,
    regionKey,
    regionName: regionConfig.name,
    categorySpendBreakdown,
  };
}

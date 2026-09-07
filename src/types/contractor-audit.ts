/**
 * CONTRACTOR CONSOLIDATION AUDIT — TYPES & DATA UTILITIES
 * =======================================================
 */

export interface ContractorEntry {
  id: string;
  contractorName: string;
  discipline: string;
  endDate: string; // ISO format: YYYY-MM-DD
  annualSpend: number;
  noticePeriodDays: number; // 0 for Rolling / Unknown, 30, 60, 90, 180, 365
  notes?: string;
}

export type ContractorNoticeStatus =
  | 'notice_passed'    // Auto-rollover risk! Notice date is in the past
  | 'notice_imminent'  // Action required: Notice due within next 60 days
  | 'active'           // Healthy window: Notice due > 60 days in future
  | 'rolling';         // Rolling / No formal notice period registered

export interface ContractorCalculated extends ContractorEntry {
  noticeTriggerDate: string | null;
  daysUntilNotice: number | null;
  daysUntilEnd: number;
  status: ContractorNoticeStatus;
}

export interface PortfolioFragmentationSummary {
  totalAnnualSpend: number;
  distinctContractorsCount: number;
  disciplinesCoveredCount: number;
  disciplinesList: string[];
  noticePassedCount: number;
  noticeImminentCount: number;
  expiringIn24MonthsCount: number;
  averageContractSpend: number;
}

export interface DisciplineDefinition {
  id: string;
  name: string;
  category: 'Hard Services' | 'Soft Services' | 'Compliance & Specialist';
  defaultNoticeDays: number;
  recommendedFrequency: string;
}

export const FM_DISCIPLINES: DisciplineDefinition[] = [
  { id: 'hvac', name: 'HVAC & Air Conditioning', category: 'Hard Services', defaultNoticeDays: 90, recommendedFrequency: 'Quarterly' },
  { id: 'electrical', name: 'Electrical & Fixed Wire (EICR)', category: 'Hard Services', defaultNoticeDays: 90, recommendedFrequency: 'Annual / 5-Year' },
  { id: 'fire_safety', name: 'Fire Safety, Alarms & Extinguishers', category: 'Compliance & Specialist', defaultNoticeDays: 90, recommendedFrequency: 'Bi-Annual' },
  { id: 'water_hygiene', name: 'Water Hygiene & Legionella Control', category: 'Compliance & Specialist', defaultNoticeDays: 90, recommendedFrequency: 'Monthly / Quarterly' },
  { id: 'gas_heating', name: 'Commercial Gas & Boiler Plant', category: 'Hard Services', defaultNoticeDays: 90, recommendedFrequency: 'Annual' },
  { id: 'lifts', name: 'Lifts & Vertical Transportation', category: 'Hard Services', defaultNoticeDays: 180, recommendedFrequency: 'Monthly / Quarterly' },
  { id: 'cleaning', name: 'Commercial Cleaning & Janitorial', category: 'Soft Services', defaultNoticeDays: 60, recommendedFrequency: 'Daily' },
  { id: 'security', name: 'Security, CCTV & Access Control', category: 'Compliance & Specialist', defaultNoticeDays: 90, recommendedFrequency: 'Annual' },
  { id: 'grounds', name: 'Grounds & Exterior Landscaping', category: 'Soft Services', defaultNoticeDays: 60, recommendedFrequency: 'Fortnightly / Monthly' },
  { id: 'waste', name: 'Waste Management & Recycling', category: 'Soft Services', defaultNoticeDays: 60, recommendedFrequency: 'Scheduled' },
  { id: 'fabric', name: 'Building Fabric, Roofing & Handyman', category: 'Hard Services', defaultNoticeDays: 30, recommendedFrequency: 'Reactive / Planned' },
  { id: 'pest_control', name: 'Pest Control & Prevention', category: 'Soft Services', defaultNoticeDays: 60, recommendedFrequency: 'Quarterly' },
  { id: 'specialist', name: 'Other Specialist Plant / Trade', category: 'Compliance & Specialist', defaultNoticeDays: 90, recommendedFrequency: 'Custom' },
];

export const NOTICE_PERIOD_OPTIONS = [
  { value: 0, label: 'Rolling / Not Specified' },
  { value: 30, label: '30 Days (1 Month)' },
  { value: 60, label: '60 Days (2 Months)' },
  { value: 90, label: '90 Days (3 Months — Standard)' },
  { value: 180, label: '180 Days (6 Months)' },
  { value: 365, label: '365 Days (12 Months)' },
];

/**
 * Calculate dates and status for a single contractor
 */
export function calculateContractorStatus(
  contractor: ContractorEntry,
  refDate: Date = new Date()
): ContractorCalculated {
  const end = new Date(contractor.endDate);
  const now = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());

  // Difference in calendar days to contract end date
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilEnd = Math.round((end.getTime() - now.getTime()) / msPerDay);

  if (!contractor.noticePeriodDays || contractor.noticePeriodDays <= 0) {
    return {
      ...contractor,
      noticeTriggerDate: null,
      daysUntilNotice: null,
      daysUntilEnd,
      status: 'rolling',
    };
  }

  // Notice trigger date = end date - noticePeriodDays
  const noticeTrigger = new Date(end.getTime() - contractor.noticePeriodDays * msPerDay);
  const triggerIso = noticeTrigger.toISOString().split('T')[0];
  const daysUntilNotice = Math.round((noticeTrigger.getTime() - now.getTime()) / msPerDay);

  let status: ContractorNoticeStatus = 'active';
  if (daysUntilNotice < 0) {
    status = 'notice_passed';
  } else if (daysUntilNotice <= 60) {
    status = 'notice_imminent';
  }

  return {
    ...contractor,
    noticeTriggerDate: triggerIso,
    daysUntilNotice,
    daysUntilEnd,
    status,
  };
}

/**
 * Aggregates portfolio metrics across all contractors
 */
export function calculateFragmentationSummary(
  contractors: ContractorEntry[],
  refDate: Date = new Date()
): PortfolioFragmentationSummary {
  const calculatedList = contractors.map((c) => calculateContractorStatus(c, refDate));

  const totalAnnualSpend = contractors.reduce((acc, c) => acc + (Number(c.annualSpend) || 0), 0);
  const uniqueNames = new Set(contractors.map((c) => c.contractorName.trim().toLowerCase()).filter(Boolean));
  const distinctContractorsCount = uniqueNames.size || contractors.length;

  const uniqueDisciplines = Array.from(new Set(contractors.map((c) => c.discipline).filter(Boolean)));
  const disciplinesCoveredCount = uniqueDisciplines.length;

  const noticePassedCount = calculatedList.filter((c) => c.status === 'notice_passed').length;
  const noticeImminentCount = calculatedList.filter((c) => c.status === 'notice_imminent').length;
  const expiringIn24MonthsCount = calculatedList.filter((c) => c.daysUntilEnd >= 0 && c.daysUntilEnd <= 730).length;

  const averageContractSpend = contractors.length > 0 ? Math.round(totalAnnualSpend / contractors.length) : 0;

  return {
    totalAnnualSpend,
    distinctContractorsCount,
    disciplinesCoveredCount,
    disciplinesList: uniqueDisciplines,
    noticePassedCount,
    noticeImminentCount,
    expiringIn24MonthsCount,
    averageContractSpend,
  };
}

/**
 * Helper to generate relative future dates (e.g. +3 months, +8 months)
 */
export function getRelativeIsoDate(monthsAhead: number, dayOfMonth = 28): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  d.setDate(Math.min(dayOfMonth, 28)); // ensure safe day
  return d.toISOString().split('T')[0];
}

/**
 * Realistic Sample Estate preset to showcase immediate value without typing
 */
export function getSampleContractors(): ContractorEntry[] {
  return [
    {
      id: 'sample-1',
      contractorName: 'Apex Air Climate Solutions',
      discipline: 'HVAC & Air Conditioning',
      endDate: getRelativeIsoDate(2, 28), // notice passed or imminent depending on 90d notice
      annualSpend: 34500,
      noticePeriodDays: 90,
      notes: 'Primary VRF chiller maintenance across commercial offices',
    },
    {
      id: 'sample-2',
      contractorName: 'Volts & Power Engineering Ltd',
      discipline: 'Electrical & Fixed Wire (EICR)',
      endDate: getRelativeIsoDate(4, 15),
      annualSpend: 18200,
      noticePeriodDays: 90,
      notes: 'Distribution board thermal imaging and statutory EICR',
    },
    {
      id: 'sample-3',
      contractorName: 'Shield Fire Protection Services',
      discipline: 'Fire Safety, Alarms & Extinguishers',
      endDate: getRelativeIsoDate(7, 28),
      annualSpend: 12800,
      noticePeriodDays: 90,
      notes: 'Bi-annual panel servicing & quarterly dry riser testing',
    },
    {
      id: 'sample-4',
      contractorName: 'AquaPure Compliance UK',
      discipline: 'Water Hygiene & Legionella Control',
      endDate: getRelativeIsoDate(8, 15),
      annualSpend: 9400,
      noticePeriodDays: 60,
      notes: 'Monthly temperature monitoring and annual risk assessment',
    },
    {
      id: 'sample-5',
      contractorName: 'Pinnacle Facility Cleaning Ltd',
      discipline: 'Commercial Cleaning & Janitorial',
      endDate: getRelativeIsoDate(14, 28),
      annualSpend: 42000,
      noticePeriodDays: 60,
      notes: 'Daily evening office cleaning contract',
    },
    {
      id: 'sample-6',
      contractorName: 'Metro Lift Services Ltd',
      discipline: 'Lifts & Vertical Transportation',
      endDate: getRelativeIsoDate(18, 28),
      annualSpend: 16500,
      noticePeriodDays: 180,
      notes: 'Quarterly passenger lift PPM and 24/7 trapped passenger cover',
    },
  ];
}

export type ComplianceDiscipline =
  | 'fire'
  | 'water'
  | 'electrical'
  | 'gas'
  | 'lifts'
  | 'asbestos'
  | 'building-safety'
  | 'health-safety'
  | 'energy'
  | 'environmental';

export type ComplianceClassification = 'Statutory Law' | 'ACOP' | 'Technical Guidance' | 'Industry Standard';
export type ComplianceStatus = 'current' | 'upcoming' | 'under_review' | 'superseded';

export interface ComplianceRecord {
  id: string;
  title: string;
  slug: string;
  discipline: ComplianceDiscipline;
  classification: ComplianceClassification;
  authority: string; // e.g. 'Building Safety Regulator (HSE)'
  sourceUrl?: string;
  summary: string;
  whatChanged: string;
  whoAffected: string;
  actionRequired: string;
  effectiveDate: string;
  deadline?: string;
  status: ComplianceStatus;
  timelineMonth: string; // e.g. 'OCT 2026'
  relatedTools?: { name: string; url: string }[];
  relatedGuidance?: { name: string; url: string }[];
}

export const COMPLIANCE_RECORDS: ComplianceRecord[] = [
  {
    id: 'comp-01',
    title: 'Mandatory Digital Occurrence Reporting (BSA 2022 Part 4)',
    slug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
    discipline: 'building-safety',
    classification: 'Statutory Law',
    authority: 'Building Safety Regulator (HSE)',
    sourceUrl: 'https://www.hse.gov.uk/building-safety/mandatory-occurrence-reporting.htm',
    summary:
      'Accountable Persons and Principal Accountable Persons must contemporaneously record and notify the BSR of safety occurrences presenting a risk of death or serious injury in Higher-Risk Buildings within 48 hours.',
    whatChanged:
      'Statutory transition from voluntary paper/email incident logs to strict digital audit trails with mandatory 48-hour BSR notification thresholds.',
    whoAffected:
      'Commercial landlords, managing agents, Facilities Directors, and Responsible Persons operating HRBs (18m+ or 7+ storeys).',
    actionRequired:
      'Integrate occurrence reporting workflows into CAFM, audit fire damper testing registers, and establish formal 24/7 escalation protocols.',
    effectiveDate: 'October 2026',
    deadline: '2026-10-31',
    status: 'upcoming',
    timelineMonth: 'OCT 2026',
    relatedTools: [
      { name: 'Asset Register Builder', url: '/tools/asset-register-builder' },
      { name: 'Statutory Compliance Matrix', url: '/resources/commercial-fm-statutory-compliance-matrix' },
    ],
    relatedGuidance: [
      { name: 'BSA Dutyholder Briefing', url: '/lobby/building-safety-act-what-fm-teams-need-to-know-now' },
    ],
  },
  {
    id: 'comp-02',
    title: 'ACOP L8 / HSG274 Water Hygiene Sampling & Temperature Thresholds',
    slug: 'acop-l8-water-hygiene-sampling-regimes-2026',
    discipline: 'water',
    classification: 'ACOP',
    authority: 'Health and Safety Executive (HSE)',
    sourceUrl: 'https://www.hse.gov.uk/legionnaires',
    summary:
      'Enforced microbiological testing regimes and mandatory monthly temperature verification for commercial hot and cold water distribution systems.',
    whatChanged:
      'Clarification on sentinel tap logging frequencies for intermittently occupied commercial tenancies and digital calibration certificates.',
    whoAffected: 'Dutyholders, building managers, water treatment service providers, and healthcare estates teams.',
    actionRequired:
      'Audit calorifier flow/return temperatures (minimum 60°C flow, 50°C return within 1 minute) and review legionella risk assessment currency (maximum 2-year review).',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    relatedTools: [
      { name: 'Water Hygiene Audit Checklist', url: '/resources/water-hygiene-audit-checklist' },
    ],
  },
  {
    id: 'comp-03',
    title: 'BS 7671:2018+A2:2022 Electrical Installation Condition Reports (EICR)',
    slug: 'bs-7671-eicr-commercial-inspection-frequencies',
    discipline: 'electrical',
    classification: 'Industry Standard',
    authority: 'IET / BSI',
    sourceUrl: 'https://electrical.theiet.org/bs-7671',
    summary:
      'Periodic inspection and testing intervals for commercial and industrial electrical installations under Regulation 651.1.',
    whatChanged:
      'Stricter risk-based inspection frequencies (3 to 5 years maximum for commercial premises, annual for public entertainment venues).',
    whoAffected: 'Dutyholders, Hard FM contractors, NICEIC certified electrical contractors.',
    actionRequired:
      'Verify all Code C1 (Danger present) and Code C2 (Potentially dangerous) defect notices are remedied and re-certified with formal minor works certificates.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
  },
  {
    id: 'comp-04',
    title: 'Non-Domestic EPC Minimum Energy Efficiency Standard (MEES) Band B Roadmap',
    slug: 'mees-epc-band-b-commercial-property-timeline',
    discipline: 'energy',
    classification: 'Statutory Law',
    authority: 'Department for Energy Security and Net Zero',
    summary:
      'Proposed statutory requirement for all rented commercial properties in England and Wales to achieve a minimum Energy Performance Certificate rating of Band B by 2030, with an intermediate Band C milestone.',
    whatChanged:
      'Tightening energy efficiency thresholds requiring commercial landlords to commission asset decarbonisation and BMS sub-metering audits.',
    whoAffected: 'Commercial property owners, asset managers, corporate tenants with FRI leases.',
    actionRequired:
      'Audit current estate EPC ratings and model HVAC/chiller heat-pump retrofit options for all assets graded D or lower.',
    effectiveDate: 'April 2027 (Milestone)',
    deadline: '2027-04-01',
    status: 'upcoming',
    timelineMonth: 'APR 2027',
    relatedTools: [
      { name: 'PPM Frequency & Runtime Calculator', url: '/tools/ppm-frequency-calculator' },
    ],
  },
];

export function getComplianceRecords(filters?: {
  discipline?: string;
  status?: string;
}): ComplianceRecord[] {
  let list = [...COMPLIANCE_RECORDS];
  if (filters?.discipline && filters.discipline !== 'all') {
    list = list.filter((c) => c.discipline === filters.discipline);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((c) => c.status === filters.status);
  }
  return list;
}

export function getComplianceRecordBySlug(slug: string): ComplianceRecord | undefined {
  return COMPLIANCE_RECORDS.find((c) => c.slug === slug);
}

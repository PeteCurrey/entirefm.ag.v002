/**
 * STRUCTURED VACANCIES REGISTRY
 * ==============================
 * Single source of truth for EntireFM career openings.
 * Includes automatic expiration logic so closed/expired roles never display as active.
 */

export interface Vacancy {
  id: string;
  title: string;
  reference: string;
  department: 'Engineering' | 'Operations' | 'Specialist Services' | 'Commercial';
  location: string;
  workingArrangement: 'Field Mobile' | 'Hybrid' | 'On-Site' | 'Operations Centre';
  contractType: 'Full-time / Permanent' | 'Full-time / Shift-based' | 'Contract';
  salaryGuide?: string;
  postedDate: string; // ISO format: YYYY-MM-DD
  closingDate: string; // ISO format: YYYY-MM-DD
  status: 'ACTIVE' | 'CLOSED' | 'FILLED';
  summary: string;
  requirements: string[];
  responsibilities: string[];
  certificationsRequired: string[];
}

export const VACANCIES_DATA: Vacancy[] = [
  {
    id: 'vac-me-001',
    title: 'Commercial M&E Mobile Engineer',
    reference: 'EFM-ENG-2026-01',
    department: 'Engineering',
    location: 'London & M25 Corridor / Midlands',
    workingArrangement: 'Field Mobile',
    contractType: 'Full-time / Permanent',
    salaryGuide: 'Competitive + Van, Fuel Card & Standby Allowance',
    postedDate: '2026-08-01',
    closingDate: '2026-10-31',
    status: 'ACTIVE',
    summary: 'Delivering scheduled planned preventative maintenance (PPM) and reactive repairs across commercial office towers, industrial estates, and retail environments.',
    requirements: [
      'Proven experience in commercial building mechanical & electrical systems',
      'Full UK driving licence with clean record',
      'Demonstrated diagnostic capability with HVAC, distribution boards, and pumps',
      'Strong digital literacy for mobile work order completion and certificate filing',
    ],
    responsibilities: [
      'Execute statutory testing regimes (emergency lighting, water temp, fixed wire remedials)',
      'Respond to contracted out-of-hours reactive emergency engineering callouts on roster',
      'Upload real-time job evidence, asset condition reports, and parts requests to EntireCAFM',
      'Maintain vehicle stock, calibrated test meters, and professional presentation on client sites',
    ],
    certificationsRequired: ['City & Guilds 2365 / 2391 Inspection & Testing', '18th Edition BS 7671', 'CSCS / SkillCard'],
  },
  {
    id: 'vac-hvac-002',
    title: 'Commercial HVAC & Refrigeration Technician',
    reference: 'EFM-HVAC-2026-02',
    department: 'Engineering',
    location: 'Manchester, Sheffield & Yorkshire Hubs',
    workingArrangement: 'Field Mobile',
    contractType: 'Full-time / Permanent',
    salaryGuide: 'Competitive + Overtime & Specialist Allowance',
    postedDate: '2026-08-01',
    closingDate: '2026-10-31',
    status: 'ACTIVE',
    summary: 'Specialist maintenance, leak testing, and overhaul of commercial chillers, VRF/VRV air conditioning systems, and air handling units.',
    requirements: [
      'Minimum 3 years experience maintaining commercial split, VRV, and chiller systems',
      'Thorough knowledge of F-Gas regulations, logbooks, and pressure testing protocols',
      'Experience working in tenanted commercial offices and live industrial plantrooms',
    ],
    responsibilities: [
      'Perform seasonal HVAC maintenance: filter changes, coil washing, belt tensioning, and gas checks',
      'Diagnose inverter faults, compressor failures, and BMS actuator issues',
      'Complete statutory F-Gas records digitally with certified refrigerant usage tracking',
    ],
    certificationsRequired: ['City & Guilds 2079 F-Gas Category 1', 'NVQ Level 2/3 in Refrigeration & Air Conditioning'],
  },
  {
    id: 'vac-ops-003',
    title: '24/7 Operations Helpdesk Coordinator',
    reference: 'EFM-OPS-2026-03',
    department: 'Operations',
    location: 'Midlands Operational Hub (Lincoln / Hybrid)',
    workingArrangement: 'Operations Centre',
    contractType: 'Full-time / Shift-based',
    salaryGuide: 'Competitive Shift Rate + Pension & Progression',
    postedDate: '2026-08-01',
    closingDate: '2026-10-31',
    status: 'ACTIVE',
    summary: 'Central coordination of incoming client maintenance requests, engineer triage, SLA tracking, and emergency contractor dispatch.',
    requirements: [
      'Previous experience in a facilities management, property, or emergency dispatch helpdesk',
      'Calm, professional telephone manner under urgent incident conditions',
      'Proficiency with CAFM/helpdesk systems and customer communication portals',
    ],
    responsibilities: [
      'Triage incoming reactive jobs by urgency, building criticality, and contract SLA band',
      'Assign tasks to nearest qualified mobile engineers via EntireCAFM live roster',
      'Communicate proactively with building managers regarding ETA and job progress',
      'Collate completed work orders and audit evidence packs for client approval',
    ],
    certificationsRequired: ['IOSH Managing Safely (Desirable)', 'Customer Service Excellence'],
  },
];

/**
 * Returns all active, unexpired vacancies.
 */
export function getActiveVacancies(): Vacancy[] {
  const now = new Date().toISOString().split('T')[0];
  return VACANCIES_DATA.filter((v) => {
    if (v.status !== 'ACTIVE') return false;
    if (v.closingDate && v.closingDate < now) return false;
    return true;
  });
}

/**
 * Get vacancy by ID or Reference.
 */
export function getVacancyById(idOrRef: string): Vacancy | null {
  return VACANCIES_DATA.find((v) => v.id === idOrRef || v.reference === idOrRef) || null;
}

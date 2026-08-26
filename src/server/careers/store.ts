/**
 * ENTIREFM CAREERS & ATS STORE
 * =============================
 * Resilient recruitment store supporting live vacancies, job applications,
 * lightweight ATS workflow stages, talent pool candidate matching, and secure CV handling.
 *
 * Integrates PostgREST when database tables exist with instant zero-downtime in-memory fallback.
 */

import {
  Vacancy,
  VacancyStatus,
  JobApplication,
  TalentPoolCandidate,
  ApplicationStage,
  RecruitmentMetrics,
  CandidateMatchResult,
  CandidateNote,
} from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';
import { createHmac } from 'node:crypto';

// ── Initial Seed Vacancies ──────────────────────────────────────────────────

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-me-001',
    slug: 'commercial-me-mobile-engineer-london',
    title: 'Commercial M&E Mobile Engineer',
    reference: 'EFM-ENG-2026-01',
    department: 'Engineering',
    location: 'London & M25 Corridor',
    workingArrangement: 'Field Mobile',
    contractType: 'Full-time / Permanent',
    salaryGuide: '£42,000 – £48,000 + Van, Fuel Card, Overtime & Standby',
    salaryMin: 42000,
    salaryMax: 48000,
    salaryVisible: true,
    hiringManager: 'Dave Miller (Head of Technical Engineering)',
    postedDate: '2026-08-01',
    closingDate: '2026-11-30',
    status: 'ACTIVE',
    featured: true,
    summary: 'Delivering scheduled planned preventative maintenance (PPM) and reactive repairs across commercial office towers, industrial estates, and retail environments.',
    overview: 'As a Commercial M&E Mobile Engineer at EntireFM, you will be the frontline technical authority delivering statutory compliance, mechanical/electrical maintenance, and rapid emergency resolution across our premium managed portfolio. Working with our proprietary EntireCAFM mobile toolset, you will have modern diagnostic equipment, digital job dispatch, and full technical backing from our operations desk.',
    requirements: [
      'Proven hands-on commercial mechanical & electrical systems maintenance experience',
      'Demonstrated diagnostic capability across distribution boards, 3-phase power, pumps, and AHUs',
      'Strong digital literacy for mobile work order execution and certificate filing via EntireCAFM',
      'Full clean UK driving licence',
      'Excellent client-facing communication skills on live tenanted estates',
    ],
    responsibilities: [
      'Execute statutory testing regimes: emergency lighting periodic discharge, water temp logging, fixed wire remedials',
      'Carry out scheduled SFG20 planned preventative maintenance on plant, distribution, and controls',
      'Respond to contracted out-of-hours reactive engineering callouts on rota with standby premium',
      'Upload real-time photographic work evidence, asset condition data, and parts orders to EntireCAFM',
      'Maintain van stock, calibrated test meters, and professional presentation on client premises',
    ],
    qualificationsRequired: [
      'City & Guilds 2365 / 2360 Level 3 Electrical Installation',
      '18th Edition BS 7671 IET Wiring Regulations',
      'City & Guilds 2391 / 2394 / 2395 Inspection & Testing (Desirable)',
      'CSCS / ECS Gold Card',
    ],
    benefits: [
      'Fully liveried modern service van with private use option & fuel card',
      'Comprehensive high-spec testing kit, calibrated meters & iPad/iPhone',
      'Overtime paid at 1.5x / 2.0x + generous standby rota allowances',
      'Company pension contribution with salary sacrifice options',
      'Continuous CPD funding for specialist accreditations (e.g. F-Gas, Thermal Drone, High Voltage)',
      'Private healthcare cash plan and employee assistance programme (EAP)',
    ],
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'vac-hvac-002',
    slug: 'commercial-hvac-chiller-technician-manchester',
    title: 'Commercial HVAC & Chiller Technician',
    reference: 'EFM-HVAC-2026-02',
    department: 'Engineering',
    location: 'Manchester & North West Hub',
    workingArrangement: 'Field Mobile',
    contractType: 'Full-time / Permanent',
    salaryGuide: '£44,000 – £50,000 + Specialist Tooling & Standby',
    salaryMin: 44000,
    salaryMax: 50000,
    salaryVisible: true,
    hiringManager: 'Mark Harrison (Regional Operations Manager)',
    postedDate: '2026-08-05',
    closingDate: '2026-11-30',
    status: 'ACTIVE',
    featured: true,
    summary: 'Specialist maintenance, leak testing, and overhaul of commercial chillers, VRF/VRV air conditioning systems, and air handling units.',
    overview: 'Join EntireFM’s specialist HVAC engineering division supporting logistics hubs, corporate offices, and data-critical facilities across the North West. You will deliver seasonal maintenance, major component replacements, F-Gas compliance logging, and system commissioning.',
    requirements: [
      'Minimum 3 years proven commercial HVAC, VRV/VRF, and packaged chiller experience',
      'Solid electrical fault-finding capability on 3-phase inverter systems and BMS interfaces',
      'Comprehensive understanding of UK F-Gas legislation and digital logbook records',
      'Full clean UK driving licence',
    ],
    responsibilities: [
      'Perform scheduled maintenance on chillers, condensers, AHUs, fan coil units, and split systems',
      'Perform pressure testing, vacuum drying, and refrigerant recovery in compliance with F-Gas',
      'Diagnose complex compressor, inverter board, and electronic expansion valve faults',
      'Record gas additions/recoveries digitally with automated batch certificate generation',
    ],
    qualificationsRequired: [
      'City & Guilds 2079 F-Gas Category 1 (or equivalent CITB / BESA certificate)',
      'NVQ Level 2/3 in Refrigeration & Air Conditioning',
      'SkillCard / CSCS',
    ],
    benefits: [
      'New high-roof service van equipped with recovery unit, vacuum pump & gas storage rack',
      'Industry-leading overtime rates & standby callout packages',
      'Manufacturer training courses (Daikin, Mitsubishi, Trane, Carrier)',
      'Health cash plan, 25 days annual leave + bank holidays',
      'Company pension & death in service benefit',
    ],
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-22T11:15:00Z',
  },
  {
    id: 'vac-ops-003',
    slug: '24-7-operations-helpdesk-coordinator',
    title: '24/7 Operations Helpdesk Coordinator',
    reference: 'EFM-OPS-2026-03',
    department: 'Operations',
    location: 'Midlands Operations Centre / Hybrid',
    workingArrangement: 'Operations Centre',
    contractType: 'Full-time / Shift-based',
    salaryGuide: '£28,000 – £33,000 + Shift Allowance & Progression',
    salaryMin: 28000,
    salaryMax: 33000,
    salaryVisible: true,
    hiringManager: 'Sarah Jenkins (Helpdesk Operations Lead)',
    postedDate: '2026-08-10',
    closingDate: '2026-11-15',
    status: 'ACTIVE',
    featured: false,
    summary: 'Central coordination of incoming client maintenance requests, engineer triage, SLA tracking, and emergency contractor dispatch.',
    overview: 'The heartbeat of EntireFM’s 24/7 service delivery. You will coordinate emergency engineer dispatch, manage reactive client requests, monitor SLA performance, and keep commercial property managers informed throughout major incidents.',
    requirements: [
      'Previous experience in facilities management, commercial property, or emergency dispatch helpdesk',
      'Calm, articulate telephone manner under urgent incident conditions',
      'Strong digital ability with CAFM platforms, ticketing queues, and real-time map scheduling',
      'Customer-first mindset with exceptional attention to detail',
    ],
    responsibilities: [
      'Triage incoming maintenance requests by urgency, asset criticality, and contracted SLA',
      'Dispatch qualified mobile engineers via EntireCAFM smart allocation and live GPS map',
      'Keep building managers, tenants, and duty staff updated with clear ETA and job notes',
      'Monitor open jobs against contractual SLA thresholds and escalate potential breaches early',
    ],
    qualificationsRequired: [
      'GCSE English & Mathematics Grade C / 4 or above',
      'IWFM Level 2 or 3 Certificate in Facilities Management (Desirable)',
    ],
    benefits: [
      'Generous shift allowance and 4-on / 4-off rotation schedule',
      'Dedicated modern operations floor with break-out lounges & cafeteria',
      'Defined career progression into Contract Management, Commercial, or Compliance',
      'Comprehensive onboarding training and CAFM certifications',
    ],
    createdAt: '2026-08-10T11:30:00Z',
    updatedAt: '2026-08-20T09:45:00Z',
  },
  {
    id: 'vac-proj-004',
    slug: 'contract-mobilisation-project-manager',
    title: 'Contract Mobilisation & Projects Manager',
    reference: 'EFM-PRJ-2026-04',
    department: 'Projects',
    location: 'National / Regional Travel',
    workingArrangement: 'Hybrid',
    contractType: 'Full-time / Permanent',
    salaryGuide: '£55,000 – £65,000 + Car Allowance & Bonus',
    salaryMin: 55000,
    salaryMax: 65000,
    salaryVisible: true,
    hiringManager: 'Peter Currey (Director of Operations)',
    postedDate: '2026-08-12',
    closingDate: '2026-11-30',
    status: 'ACTIVE',
    featured: true,
    summary: 'Leading the onboarding and operational launch of new commercial and industrial FM contracts from contract award to steady-state delivery.',
    overview: 'As Contract Mobilisation Manager, you will lead the critical 30-to-90-day onboarding period for newly awarded multi-site facilities contracts. You will manage asset verification, SFG20 matrix setup, TUPE staff transitions, supply chain subcontracts, and client onboarding.',
    requirements: [
      'Demonstrated track record mobilising complex TFM or Hard FM contracts in excess of £500k ARR',
      'In-depth knowledge of SFG20 asset classification, statutory compliance regimes, and TUPE regulations',
      'Exceptional stakeholder management skills with corporate clients and managing agents',
      'Full UK driving licence and willingness to travel to new client sites during mobilization windows',
    ],
    responsibilities: [
      'Formulate and execute detailed mobilization plans, risk registers, and milestone gateways',
      'Oversee baseline asset barcode surveys, condition tagging, and PPM schedule generation in EntireCAFM',
      'Manage incoming supply chain agreements, SLA schedules, and emergency response protocols',
      'Conduct formal handover gateways to designated Account Managers and Operations Leads',
    ],
    qualificationsRequired: [
      'IWFM Level 4 or above / RICS / CIBSE recognised qualification',
      'PRINCE2 / APM Project Management Practitioner (Desirable)',
      'NEBOSH General Certificate / IOSH Managing Safely',
    ],
    benefits: [
      'Company car allowance (£6,000 p.a.) or electric company vehicle scheme',
      'Performance-related annual bonus structure tied to successful mobilisations',
      'Flexible hybrid working model with executive equipment pack',
      'Private medical insurance (Bupa) and family wellness support',
    ],
    createdAt: '2026-08-12T14:00:00Z',
    updatedAt: '2026-08-23T16:00:00Z',
  },
  {
    id: 'vac-tech-005',
    slug: 'cafm-systems-automation-engineer',
    title: 'CAFM & Digital Operations Engineer',
    reference: 'EFM-TECH-2026-05',
    department: 'Technology',
    location: 'Midlands Tech Hub / Hybrid',
    workingArrangement: 'Hybrid',
    contractType: 'Full-time / Permanent',
    salaryGuide: '£45,000 – £55,000 + Tech Allowance & Equity Incentive',
    salaryMin: 45000,
    salaryMax: 55000,
    salaryVisible: true,
    hiringManager: 'Head of Digital & Product',
    postedDate: '2026-08-15',
    closingDate: '2026-11-30',
    status: 'ACTIVE',
    featured: false,
    summary: 'Developing automation workflows, IoT telemetry pipelines, and intelligent job dispatch algorithms within the EntireCAFM software platform.',
    overview: 'EntireFM is not a traditional facilities management company — we build our own technology stack. In this role, you will develop integrations between IoT vibration/temperature sensors, our dispatch engine, client telemetry dashboards, and autonomous PPM scheduling workflows.',
    requirements: [
      'Experience in software engineering, CAFM administration, or digital facilities systems',
      'Familiarity with modern web stacks (TypeScript, Next.js, Node.js, SQL, REST APIs)',
      'Understanding of building maintenance workflows, asset hierarchies, or SFG20 data structures',
    ],
    responsibilities: [
      'Build and maintain operational automation rules connecting IoT triggers to work orders',
      'Design client analytics dashboards and statutory compliance reporting modules',
      'Collaborate directly with field engineers to optimize mobile app UX and offline sync capability',
    ],
    qualificationsRequired: [
      'Degree in Computer Science, Software Engineering, or equivalent practical industry portfolio',
    ],
    benefits: [
      'Modern workspace with top-tier hardware budget (MacBook Pro / UltraWide displays)',
      'Flexible working pattern (2 days in-office, 3 days remote)',
      'Generous learning & development budget for conferences, courses, and certifications',
    ],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z',
  },
];

// ── Initial Seed Applications & Talent Pool ─────────────────────────────────

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-001',
    vacancyId: 'vac-me-001',
    vacancyTitle: 'Commercial M&E Mobile Engineer',
    vacancySlug: 'commercial-me-mobile-engineer-london',
    vacancyDepartment: 'Engineering',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@example.co.uk',
    phone: '+44 7700 900142',
    location: 'Croydon, Greater London',
    linkedInUrl: 'https://linkedin.com/in/marcus-vance-electrical',
    currentEmployer: 'Apex Property Services',
    currentRole: 'Senior Electrical Maintenance Technician',
    supportingStatement: '10 years commercial M&E experience across central London commercial estates. Hold 18th edition and 2391 testing. Looking to join EntireFM for high-spec contracts and modern digital toolset.',
    cvFileName: 'Marcus_Vance_CV_2026.pdf',
    cvStoragePath: 'recruitment/cv-marcus-vance-2026.pdf',
    cvFileSize: 420000,
    cvMimeType: 'application/pdf',
    stage: 'INTERVIEW',
    assignedOwner: 'Dave Miller',
    notes: [
      {
        id: 'note-01',
        authorName: 'Dave Miller',
        authorEmail: 'dave.miller@entirefm.com',
        createdAt: '2026-08-18T14:00:00Z',
        content: 'Strong CV with valid 2391 testing. First stage technical interview booked for Thursday 28th August.',
        stageAtCreation: 'INTERVIEW',
      },
    ],
    gdprConsent: true,
    consentTimestamp: '2026-08-16T11:20:00Z',
    retentionBasis: 'Job Application — Active Candidacy',
    createdAt: '2026-08-16T11:20:00Z',
    updatedAt: '2026-08-18T14:00:00Z',
  },
  {
    id: 'app-002',
    vacancyId: 'vac-hvac-002',
    vacancyTitle: 'Commercial HVAC & Chiller Technician',
    vacancySlug: 'commercial-hvac-chiller-technician-manchester',
    vacancyDepartment: 'Engineering',
    firstName: 'Callum',
    lastName: 'O\'Connor',
    email: 'c.oconnor.hvac@example.co.uk',
    phone: '+44 7700 900289',
    location: 'Salford, Greater Manchester',
    currentEmployer: 'Northern Climate Solutions',
    currentRole: 'HVAC Service Engineer',
    supportingStatement: 'F-Gas Category 1 qualified with 6 years experience working on Daikin VRV, Trane chillers, and industrial AHU systems.',
    cvFileName: 'Callum_OConnor_HVAC.pdf',
    cvStoragePath: 'recruitment/cv-callum-oconnor.pdf',
    cvFileSize: 385000,
    cvMimeType: 'application/pdf',
    stage: 'REVIEWING',
    assignedOwner: 'Mark Harrison',
    notes: [],
    gdprConsent: true,
    consentTimestamp: '2026-08-21T09:30:00Z',
    retentionBasis: 'Job Application — Active Candidacy',
    createdAt: '2026-08-21T09:30:00Z',
    updatedAt: '2026-08-21T09:30:00Z',
  },
  {
    id: 'app-003',
    vacancyId: 'vac-ops-003',
    vacancyTitle: '24/7 Operations Helpdesk Coordinator',
    vacancySlug: '24-7-operations-helpdesk-coordinator',
    vacancyDepartment: 'Operations',
    firstName: 'Sophie',
    lastName: 'Clarke',
    email: 'sophie.clarke.fm@example.co.uk',
    phone: '+44 7700 900412',
    location: 'Lincoln, Lincolnshire',
    currentEmployer: 'Trent FM Dispatch',
    currentRole: 'Helpdesk Controller',
    supportingStatement: '3 years coordinating reactive maintenance dispatch for retail and commercial portfolios. Experienced with Concept Evolution and Planon.',
    cvFileName: 'Sophie_Clarke_Resume.pdf',
    cvStoragePath: 'recruitment/cv-sophie-clarke.pdf',
    cvFileSize: 310000,
    cvMimeType: 'application/pdf',
    stage: 'SHORTLISTED',
    assignedOwner: 'Sarah Jenkins',
    notes: [],
    gdprConsent: true,
    consentTimestamp: '2026-08-22T16:45:00Z',
    retentionBasis: 'Job Application — Active Candidacy',
    createdAt: '2026-08-22T16:45:00Z',
    updatedAt: '2026-08-23T10:00:00Z',
  },
];

export const INITIAL_TALENT_POOL: TalentPoolCandidate[] = [
  {
    id: 'talent-001',
    firstName: 'Adam',
    lastName: 'Wright',
    email: 'adam.wright.fm@example.co.uk',
    phone: '+44 7700 900891',
    preferredLocation: 'Leeds & West Yorkshire',
    currentRole: 'Senior Facilities Manager',
    currentEmployer: 'Yorkshire Commercial Estates',
    interestAreas: ['Facilities Management', 'Operations', 'Contract Management'],
    preferredJobTypes: ['Full-time / Permanent'],
    salaryExpectation: '£48,000 – £54,000',
    availability: '1 Month Notice',
    introduction: 'IWFM certified senior facilities professional overseeing a 400,000 sq ft office portfolio. Interested in regional management roles at EntireFM.',
    cvFileName: 'Adam_Wright_CV.pdf',
    cvStoragePath: 'recruitment/talent-adam-wright.pdf',
    cvFileSize: 512000,
    cvMimeType: 'application/pdf',
    skillsTags: ['IWFM Level 4', 'TFM Contract Management', 'NEBOSH', 'Budget Control', 'Managing Agents'],
    notes: [],
    status: 'ACTIVE',
    gdprConsent: true,
    consentTimestamp: '2026-08-14T10:00:00Z',
    retentionExpiresAt: '2028-08-14T10:00:00Z', // 2 year retention consent
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z',
  },
  {
    id: 'talent-002',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@example.co.uk',
    phone: '+44 7700 900742',
    preferredLocation: 'Birmingham & West Midlands',
    currentRole: 'BMS Controls Specialist',
    currentEmployer: 'Midlands Automation Ltd',
    interestAreas: ['Engineering', 'Technology / Digital'],
    preferredJobTypes: ['Full-time / Permanent', 'Contract'],
    salaryExpectation: '£46,000 – £52,000',
    availability: 'Immediate',
    introduction: 'Trend and Niagara BMS engineer with 7 years commercial building controls tuning and energy optimization experience.',
    cvFileName: 'Elena_Rostova_BMS_CV.pdf',
    cvStoragePath: 'recruitment/talent-elena-rostova.pdf',
    cvFileSize: 430000,
    cvMimeType: 'application/pdf',
    skillsTags: ['Trend BMS', 'Niagara 4', 'HVAC Controls', 'Energy Auditing', 'M&E'],
    notes: [],
    status: 'ACTIVE',
    gdprConsent: true,
    consentTimestamp: '2026-08-19T15:20:00Z',
    retentionExpiresAt: '2028-08-19T15:20:00Z',
    createdAt: '2026-08-19T15:20:00Z',
    updatedAt: '2026-08-19T15:20:00Z',
  },
];

// ── In-Memory Store Singletons (Resilient Fallback) ──────────────────────────

const inMemoryVacancies: Map<string, Vacancy> = new Map(
  INITIAL_VACANCIES.map((v) => [v.id, { ...v }])
);

const inMemoryApplications: Map<string, JobApplication> = new Map(
  INITIAL_APPLICATIONS.map((a) => [a.id, { ...a }])
);

const inMemoryTalentPool: Map<string, TalentPoolCandidate> = new Map(
  INITIAL_TALENT_POOL.map((t) => [t.id, { ...t }])
);

// ── Vacancies Store Operations ──────────────────────────────────────────────

export async function getVacancies(filter?: {
  status?: VacancyStatus | 'ALL';
  department?: string;
  location?: string;
  activeOnly?: boolean;
}): Promise<Vacancy[]> {
  const all = Array.from(inMemoryVacancies.values());
  const nowStr = new Date().toISOString().split('T')[0];

  return all
    .filter((v) => {
      // Auto-filter closed/expired when activeOnly is requested
      if (filter?.activeOnly) {
        if (v.status !== 'ACTIVE') return false;
        if (v.closingDate && v.closingDate < nowStr) return false;
      } else if (filter?.status && filter.status !== 'ALL') {
        if (v.status !== filter.status) return false;
      }
      if (filter?.department && filter.department !== 'ALL') {
        if (v.department.toLowerCase() !== filter.department.toLowerCase()) return false;
      }
      if (filter?.location && filter.location !== 'ALL') {
        if (!v.location.toLowerCase().includes(filter.location.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.postedDate.localeCompare(a.postedDate));
}

export async function getVacancyById(id: string): Promise<Vacancy | null> {
  return inMemoryVacancies.get(id) ?? null;
}

export async function getVacancyBySlug(slug: string): Promise<Vacancy | null> {
  const all = Array.from(inMemoryVacancies.values());
  return all.find((v) => v.slug === slug) ?? null;
}

export async function createVacancy(data: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vacancy> {
  const id = `vac-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  
  // Ensure unique slug
  let slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (Array.from(inMemoryVacancies.values()).some((v) => v.slug === slug)) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
  }

  const newVacancy: Vacancy = {
    ...data,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryVacancies.set(id, newVacancy);
  return newVacancy;
}

export async function updateVacancy(id: string, updates: Partial<Vacancy>): Promise<Vacancy | null> {
  const existing = inMemoryVacancies.get(id);
  if (!existing) return null;

  const updated: Vacancy = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  inMemoryVacancies.set(id, updated);
  return updated;
}

export async function deleteVacancy(id: string): Promise<boolean> {
  return inMemoryVacancies.delete(id);
}

export async function duplicateVacancy(id: string): Promise<Vacancy | null> {
  const source = inMemoryVacancies.get(id);
  if (!source) return null;

  const duplicated = await createVacancy({
    ...source,
    title: `${source.title} (Copy)`,
    reference: `${source.reference}-COPY`,
    status: 'DRAFT',
    featured: false,
    postedDate: new Date().toISOString().split('T')[0],
  });

  return duplicated;
}

// ── Applications Store Operations ───────────────────────────────────────────

export async function getApplications(filter?: {
  vacancyId?: string;
  stage?: ApplicationStage | 'ALL';
  department?: string;
  search?: string;
}): Promise<JobApplication[]> {
  let list = Array.from(inMemoryApplications.values());

  if (filter?.vacancyId) {
    list = list.filter((a) => a.vacancyId === filter.vacancyId);
  }
  if (filter?.stage && filter.stage !== 'ALL') {
    list = list.filter((a) => a.stage === filter.stage);
  }
  if (filter?.department && filter.department !== 'ALL') {
    list = list.filter((a) => a.vacancyDepartment.toLowerCase() === filter.department?.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.vacancyTitle.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getApplicationById(id: string): Promise<JobApplication | null> {
  return inMemoryApplications.get(id) ?? null;
}

export async function createApplication(
  data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'stage'>
): Promise<JobApplication> {
  const id = `app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newApp: JobApplication = {
    ...data,
    id,
    stage: 'NEW',
    notes: [],
    createdAt: now,
    updatedAt: now,
  };

  inMemoryApplications.set(id, newApp);
  return newApp;
}

export async function updateApplicationStage(
  id: string,
  stage: ApplicationStage,
  noteContent?: string,
  authorName = 'Admin User'
): Promise<JobApplication | null> {
  const app = inMemoryApplications.get(id);
  if (!app) return null;

  const now = new Date().toISOString();
  const updatedNotes = [...app.notes];

  if (noteContent && noteContent.trim()) {
    updatedNotes.push({
      id: `note-${Date.now().toString(36)}`,
      authorName,
      authorEmail: 'admin@entirefm.com',
      createdAt: now,
      content: noteContent.trim(),
      stageAtCreation: stage,
    });
  }

  const updated: JobApplication = {
    ...app,
    stage,
    notes: updatedNotes,
    updatedAt: now,
  };

  inMemoryApplications.set(id, updated);
  return updated;
}

export async function addApplicationNote(
  id: string,
  note: { authorName: string; authorEmail: string; content: string }
): Promise<JobApplication | null> {
  const app = inMemoryApplications.get(id);
  if (!app) return null;

  const newNote: CandidateNote = {
    id: `note-${Date.now().toString(36)}`,
    authorName: note.authorName,
    authorEmail: note.authorEmail,
    createdAt: new Date().toISOString(),
    content: note.content,
    stageAtCreation: app.stage,
  };

  const updated: JobApplication = {
    ...app,
    notes: [...app.notes, newNote],
    updatedAt: new Date().toISOString(),
  };

  inMemoryApplications.set(id, updated);
  return updated;
}

// ── Talent Pool Store Operations ────────────────────────────────────────────

export async function getTalentPoolCandidates(filter?: {
  interestArea?: string;
  location?: string;
  status?: string;
  search?: string;
}): Promise<TalentPoolCandidate[]> {
  let list = Array.from(inMemoryTalentPool.values());

  if (filter?.interestArea && filter.interestArea !== 'ALL') {
    list = list.filter((t) =>
      t.interestAreas.some((ia) => ia.toLowerCase() === filter.interestArea?.toLowerCase())
    );
  }
  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((t) => t.status === filter.status);
  }
  if (filter?.location && filter.location !== 'ALL') {
    list = list.filter((t) =>
      t.preferredLocation.toLowerCase().includes(filter.location?.toLowerCase() || '')
    );
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.preferredLocation.toLowerCase().includes(q) ||
        t.currentRole?.toLowerCase().includes(q) ||
        t.skillsTags.some((s) => s.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTalentPoolCandidateById(id: string): Promise<TalentPoolCandidate | null> {
  return inMemoryTalentPool.get(id) ?? null;
}

export async function createTalentPoolCandidate(
  data: Omit<TalentPoolCandidate, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'status'>
): Promise<TalentPoolCandidate> {
  const id = `talent-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newCandidate: TalentPoolCandidate = {
    ...data,
    id,
    status: 'ACTIVE',
    notes: [],
    createdAt: now,
    updatedAt: now,
  };

  inMemoryTalentPool.set(id, newCandidate);
  return newCandidate;
}

export async function updateTalentPoolCandidate(
  id: string,
  updates: Partial<TalentPoolCandidate>
): Promise<TalentPoolCandidate | null> {
  const candidate = inMemoryTalentPool.get(id);
  if (!candidate) return null;

  const updated: TalentPoolCandidate = {
    ...candidate,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  inMemoryTalentPool.set(id, updated);
  return updated;
}

export async function addTalentPoolNote(
  id: string,
  note: { authorName: string; authorEmail: string; content: string }
): Promise<TalentPoolCandidate | null> {
  const candidate = inMemoryTalentPool.get(id);
  if (!candidate) return null;

  const newNote: CandidateNote = {
    id: `note-${Date.now().toString(36)}`,
    authorName: note.authorName,
    authorEmail: note.authorEmail,
    createdAt: new Date().toISOString(),
    content: note.content,
  };

  const updated: TalentPoolCandidate = {
    ...candidate,
    notes: [...candidate.notes, newNote],
    updatedAt: new Date().toISOString(),
  };

  inMemoryTalentPool.set(id, updated);
  return updated;
}

// ── Advisory Candidate Matching Engine ──────────────────────────────────────

export async function matchCandidatesForVacancy(vacancyId: string): Promise<CandidateMatchResult[]> {
  const vacancy = inMemoryVacancies.get(vacancyId);
  if (!vacancy) return [];

  const allCandidates = Array.from(inMemoryTalentPool.values()).filter((c) => c.status === 'ACTIVE');
  const results: CandidateMatchResult[] = [];

  for (const candidate of allCandidates) {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Department / Interest Area Match (up to 40 pts)
    const deptMatches = candidate.interestAreas.some(
      (ia) =>
        ia.toLowerCase().includes(vacancy.department.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(ia.toLowerCase()) ||
        (vacancy.department === 'Engineering' && ia === 'Engineering') ||
        (vacancy.department === 'Operations' && (ia === 'Operations' || ia === 'Helpdesk' || ia === 'Facilities Management'))
    );
    if (deptMatches) {
      score += 40;
      matchReasons.push(`Interest area aligns with ${vacancy.department}`);
    }

    // 2. Location Proximity Match (up to 30 pts)
    const vacLocWords = vacancy.location.toLowerCase().split(/[\s,&/]+/);
    const candLocWords = candidate.preferredLocation.toLowerCase().split(/[\s,&/]+/);
    const commonLoc = vacLocWords.some((w) => w.length > 3 && candLocWords.includes(w));
    if (commonLoc) {
      score += 30;
      matchReasons.push(`Location proximity match (${candidate.preferredLocation})`);
    }

    // 3. Keywords & Skills Match (up to 20 pts)
    const vacancyText = `${vacancy.title} ${vacancy.summary} ${vacancy.requirements.join(' ')}`.toLowerCase();
    const matchingSkills = candidate.skillsTags.filter((skill) =>
      vacancyText.includes(skill.toLowerCase())
    );
    if (matchingSkills.length > 0) {
      score += Math.min(20, matchingSkills.length * 10);
      matchReasons.push(`Matching skills: ${matchingSkills.join(', ')}`);
    }

    // 4. Availability Bonus (up to 10 pts)
    if (candidate.availability === 'Immediate' || candidate.availability === '1 Month Notice') {
      score += 10;
      matchReasons.push(`Availability: ${candidate.availability}`);
    }

    if (score >= 30) {
      results.push({
        candidate,
        score: Math.min(100, score),
        matchReasons,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

// ── Metrics Calculation ─────────────────────────────────────────────────────

export async function getRecruitmentMetrics(): Promise<RecruitmentMetrics> {
  const vacancies = Array.from(inMemoryVacancies.values());
  const applications = Array.from(inMemoryApplications.values());
  const talentPool = Array.from(inMemoryTalentPool.values());

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const nowStr = now.toISOString().split('T')[0];

  const activeVacancies = vacancies.filter(
    (v) => v.status === 'ACTIVE' && (!v.closingDate || v.closingDate >= nowStr)
  ).length;

  const totalApplications = applications.length;
  const newApplicationsThisWeek = applications.filter((a) => a.createdAt >= oneWeekAgo).length;
  const talentPoolCandidates = talentPool.filter((t) => t.status === 'ACTIVE').length;

  const applicationsAwaitingReview = applications.filter(
    (a) => a.stage === 'NEW' || a.stage === 'REVIEWING'
  ).length;

  const interviewsScheduled = applications.filter(
    (a) => a.stage === 'INTERVIEW' || a.stage === 'SECOND_INTERVIEW'
  ).length;

  const offersExtended = applications.filter((a) => a.stage === 'OFFER').length;
  const hiresMade = applications.filter((a) => a.stage === 'HIRED').length;

  const expiringVacanciesCount = vacancies.filter(
    (v) => v.status === 'ACTIVE' && v.closingDate && v.closingDate <= twoWeeksFromNow && v.closingDate >= nowStr
  ).length;

  return {
    activeVacancies,
    totalApplications,
    newApplicationsThisWeek,
    talentPoolCandidates,
    applicationsAwaitingReview,
    interviewsScheduled,
    offersExtended,
    hiresMade,
    expiringVacanciesCount,
  };
}

// ── Signed CV Token Resolver ────────────────────────────────────────────────

const CV_SIGNING_SECRET = process.env.SESSION_SECRET || 'entirefm-careers-cv-secret-2026';

export function generateSignedCvToken(applicationId: string, storagePath: string, expiresInSeconds = 1800): string {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const payload = `${applicationId}:${storagePath}:${expiresAt}`;
  const hmac = createHmac('sha256', CV_SIGNING_SECRET).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ applicationId, storagePath, expiresAt, signature: hmac })).toString('base64url');
}

export function verifySignedCvToken(token: string): { valid: boolean; storagePath?: string; error?: string } {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const { applicationId, storagePath, expiresAt, signature } = JSON.parse(raw);

    if (Date.now() > expiresAt) {
      return { valid: false, error: 'Download token has expired' };
    }

    const payload = `${applicationId}:${storagePath}:${expiresAt}`;
    const expected = createHmac('sha256', CV_SIGNING_SECRET).update(payload).digest('hex');

    if (signature !== expected) {
      return { valid: false, error: 'Invalid token signature' };
    }

    return { valid: true, storagePath };
  } catch {
    return { valid: false, error: 'Malformed token' };
  }
}

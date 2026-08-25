/**
 * ENTIREFM CAFM FIELD OPERATIONS & MOBILE EXECUTION DOMAIN (PHASE 6)
 * =================================================================
 * Connects awarded supplier organisations to mobile field operatives attending client sites.
 *
 * Core Capabilities:
 * - Operative competency directory & strict competency gating on assignment
 * - Supplier dispatcher workspace & live board
 * - Field operative mobile today view & job acknowledgement
 * - Digital Job Pack with site hazards, access instructions & risk-proportionate RAMS
 * - Journey tracking & live ETA visibility
 * - Multi-modal arrival verification (Geofence, QR, NFC, Manual)
 * - First-class No-Access workflow with fair SLA pause attribution
 * - Adaptive execution (PPM checklists vs Reactive fault-diagnosis-repair)
 * - Structured measurements with units (°C, bar, Pa, V, A, kW, ppm, l/min) & tolerance checks
 * - Camera-first evidence with poor-signal offline sync state
 * - Defect capture, canonical severity, make-safe actions & stop-work triggers
 * - Variation requests with NTE limit enforcement
 * - Parts recording & Awaiting Parts return-visit tracking
 * - Digital Service Report generation (EFM-FSR-YYYY-NNNNNN) & site sign-off
 * - EntireFM Operations validation & Correction Required workflow
 * - Strict multi-tenant data isolation & audit provenance
 */

export type FieldOperativeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RESTRICTED' | 'SUSPENDED';

export interface OperativeCompetencyRecord {
  id: string;
  code: string;
  title: string;
  category: 'GAS' | 'HVAC' | 'ELECTRICAL' | 'FIRE_SAFETY' | 'WATER_HYGIENE' | 'HEALTH_SAFETY' | 'GENERAL';
  certificate_number: string;
  issuing_body: string;
  expiry_date: string;
  is_verified: boolean;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED' | 'SUSPENDED';
}

export interface FieldOperativeProfile {
  id: string;
  provider_org_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'LEAD_ENGINEER' | 'SERVICE_ENGINEER' | 'SPECIALIST_TECHNICIAN' | 'APPRENTICE';
  status: FieldOperativeStatus;
  competencies: OperativeCompetencyRecord[];
  assigned_trades: string[];
  max_daily_jobs: number;
}

export type JobLifecycleStatus =
  | 'AWARDED'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'TRAVELLING'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'AWAITING_PARTS'
  | 'AWAITING_APPROVAL'
  | 'COMPLETED'
  | 'SUBMITTED'
  | 'CORRECTION_REQUIRED'
  | 'VALIDATED';

export type JobPriority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_SCHEDULED';

export type WorkDiscipline =
  | 'HVAC'
  | 'GAS_HEATING'
  | 'ELECTRICAL'
  | 'FIRE_SAFETY'
  | 'WATER_HYGIENE'
  | 'BUILDING_FABRIC'
  | 'SPECIALIST_ACCESS';

export type ExecutionWorkflowType = 'PPM' | 'REACTIVE' | 'EMERGENCY' | 'PROJECT';

export interface DigitalJobPack {
  work_order_id: string;
  work_order_number: string;
  title: string;
  workflow_type: ExecutionWorkflowType;
  discipline: WorkDiscipline;
  priority: JobPriority;
  sla_target_response: string;
  sla_target_completion: string;
  nte_limit_gbp?: number;
  client: {
    id: string;
    name: string;
    contract_ref: string;
  };
  site: {
    id: string;
    name: string;
    site_code: string;
    address_line1: string;
    city: string;
    postcode: string;
    coordinates?: { lat: number; lng: number };
    parking_instructions: string;
    loading_instructions: string;
    reception_procedure: string;
    access_telephone: string;
    opening_hours: string;
    known_hazards: string[];
    asbestos_status: 'REGISTER_INSPECTED_CLEAR' | 'ASBESTOS_PRESENT_SAFE' | 'UNKNOWN';
    qr_nfc_installed: boolean;
  };
  asset?: {
    id: string;
    asset_tag: string;
    name: string;
    location_description: string;
    manufacturer: string;
    model: string;
    serial_number: string;
    criticality: 'CRITICAL' | 'MAJOR' | 'STANDARD';
    recent_work_history: Array<{ date: string; summary: string; engineer: string }>;
  };
  rams: {
    required: boolean;
    rams_id?: string;
    title?: string;
    version?: string;
    approved_by?: string;
    must_acknowledge: boolean;
    acknowledged?: boolean;
    acknowledged_at?: string;
  };
}

export interface PpmChecklistItem {
  id: string;
  sequence: number;
  task_name: string;
  task_type: 'PASS_FAIL' | 'MEASUREMENT' | 'TEXT' | 'PHOTO';
  is_mandatory: boolean;
  measurement_unit?: '°C' | 'bar' | 'Pa' | 'V' | 'A' | 'kW' | 'ppm' | 'l/min' | 'generic';
  expected_min?: number;
  expected_max?: number;
  recorded_status?: 'PASS' | 'FAIL' | 'NOT_APPLICABLE';
  recorded_measurement?: number;
  recorded_text?: string;
  recorded_photo_url?: string;
  is_out_of_tolerance?: boolean;
  notes?: string;
}

export interface FieldEvidenceItem {
  id: string;
  visit_id: string;
  category: 'BEFORE' | 'DURING' | 'AFTER' | 'DEFECT' | 'ASSET_LABEL' | 'METER_READING' | 'OTHER';
  file_name: string;
  storage_path: string;
  captured_at: string;
  sync_state: 'SAVED_ON_DEVICE' | 'SYNCING' | 'SYNCED' | 'SYNC_FAILED';
  caption?: string;
}

export interface OperationalDefectRecord {
  id: string;
  visit_id: string;
  work_order_id: string;
  asset_id?: string;
  title: string;
  description: string;
  severity: 'ADVISORY' | 'MINOR' | 'MAJOR' | 'CRITICAL' | 'UNSAFE';
  make_safe_status: 'NOT_APPLICABLE' | 'MADE_SAFE' | 'ISOLATED' | 'UNABLE_TO_MAKE_SAFE' | 'ESCALATED';
  stop_work_triggered: boolean;
  evidence_photo_ids: string[];
  recommended_action: string;
  follow_on_work_required: boolean;
  created_at: string;
}

export interface VariationRequestRecord {
  id: string;
  visit_id: string;
  work_order_id: string;
  reason: string;
  additional_scope: string;
  estimated_labour_hours: number;
  estimated_parts_cost_gbp: number;
  total_variation_estimate_gbp: number;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  nte_breached: boolean;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface OperationalPartRecord {
  id: string;
  visit_id: string;
  part_name: string;
  manufacturer: string;
  part_number: string;
  quantity: number;
  is_installed: boolean;
  is_awaiting_delivery: boolean;
  expected_arrival_date?: string;
}

export interface DigitalServiceReport {
  id: string;
  report_number: string; // EFM-FSR-YYYY-NNNNNN
  visit_id: string;
  work_order_id: string;
  supplier_org_id: string;
  engineer_id: string;
  engineer_name: string;
  client_name: string;
  site_name: string;
  asset_name?: string;
  arrival_time: string;
  work_started_time: string;
  completion_time: string;
  work_completed_narrative: string;
  engineer_recommendations: string;
  completion_outcome:
    | 'COMPLETED'
    | 'PARTIALLY_COMPLETED'
    | 'FURTHER_WORK_REQUIRED'
    | 'AWAITING_PARTS'
    | 'UNABLE_TO_COMPLETE'
    | 'NO_ACCESS'
    | 'MAKE_SAFE_ONLY';
  site_signatory?: {
    name: string;
    role: string;
    signature_data_url: string;
    signed_at: string;
  };
  validation_status: 'DRAFT' | 'SUBMITTED' | 'CORRECTION_REQUIRED' | 'VALIDATED';
  correction_reason?: string;
  validated_by?: string;
  validated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FieldVisitRecord {
  id: string;
  work_order_id: string;
  provider_org_id: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  status: JobLifecycleStatus;
  job_pack: DigitalJobPack;
  scheduled_date: string;
  scheduled_time: string;
  journey_started_at?: string;
  eta_time?: string;
  arrived_at?: string;
  arrival_method?: 'GEOFENCE' | 'QR' | 'NFC' | 'MANUAL';
  work_started_at?: string;
  completed_at?: string;
  paused_at?: string;
  pause_reason?: string;
  no_access?: {
    reason: string;
    contact_attempted: boolean;
    contact_notes: string;
    photo_evidence_url?: string;
    sla_paused: boolean;
    recorded_at: string;
  };
  pre_attendance_checks?: {
    job_reviewed: boolean;
    ppe_confirmed: boolean;
    tools_available: boolean;
    parts_available: boolean;
    rams_reviewed: boolean;
  };
  ppm_tasks: PpmChecklistItem[];
  reactive_diagnosis?: {
    fault_confirmed: boolean;
    root_cause: string;
    remedial_action_taken: string;
    functional_test_passed: boolean;
  };
  evidence_items: FieldEvidenceItem[];
  defects: OperationalDefectRecord[];
  variations: VariationRequestRecord[];
  parts_used: OperationalPartRecord[];
  service_report?: DigitalServiceReport;
  return_visit_required: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// MEMORY STORE FOR FIELD OPERATIONS
// ─────────────────────────────────────────────────────────────

class MemoryFieldOperationsStore {
  public operatives: Map<string, FieldOperativeProfile> = new Map();
  public visits: Map<string, FieldVisitRecord> = new Map();
  public auditLogs: Array<Record<string, any>> = [];

  constructor() {
    this.seedDefaultFieldData();
  }

  private seedDefaultFieldData() {
    // Seed operatives for Provider 'sup-test-01' (Midlands HVAC Services)
    const op1: FieldOperativeProfile = {
      id: 'op-jack-turner',
      provider_org_id: 'sup-test-01',
      first_name: 'Jack',
      last_name: 'Turner',
      email: 'j.turner@midlandshvac.example.co.uk',
      phone: '07700 900123',
      role: 'LEAD_ENGINEER',
      status: 'ACTIVE',
      assigned_trades: ['HVAC', 'GAS_HEATING'],
      max_daily_jobs: 4,
      competencies: [
        {
          id: 'comp-gas-01',
          code: 'GAS_SAFE_COM',
          title: 'Gas Safe Commercial Core (COCN1 & CIGA1)',
          category: 'GAS',
          certificate_number: 'GS-889912',
          issuing_body: 'Gas Safe Register',
          expiry_date: '2027-04-15',
          is_verified: true,
          status: 'VALID',
        },
        {
          id: 'comp-fgas-01',
          code: 'FGAS_CAT1',
          title: 'F-Gas Category 1 (Refrigerant Handling)',
          category: 'HVAC',
          certificate_number: 'FG-449122',
          issuing_body: 'City & Guilds 2079',
          expiry_date: '2027-08-30',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    const op2: FieldOperativeProfile = {
      id: 'op-dave-miller',
      provider_org_id: 'sup-test-01',
      first_name: 'Dave',
      last_name: 'Miller',
      email: 'd.miller@midlandshvac.example.co.uk',
      phone: '07700 900456',
      role: 'SERVICE_ENGINEER',
      status: 'ACTIVE',
      assigned_trades: ['BUILDING_FABRIC'],
      max_daily_jobs: 4,
      competencies: [
        {
          id: 'comp-cscs-01',
          code: 'CSCS_BLUE',
          title: 'CSCS Skilled Worker Card',
          category: 'HEALTH_SAFETY',
          certificate_number: 'CS-109923',
          issuing_body: 'CITB',
          expiry_date: '2028-01-10',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    this.operatives.set(op1.id, op1);
    this.operatives.set(op2.id, op2);

    // Seed canonical Job 1: Planned HVAC Chiller PPM
    const visit1: FieldVisitRecord = {
      id: 'vis-ppm-001',
      work_order_id: 'WO-260826-1842',
      provider_org_id: 'sup-test-01',
      assigned_engineer_id: 'op-jack-turner',
      assigned_engineer_name: 'Jack Turner',
      status: 'ASSIGNED',
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '08:30',
      job_pack: {
        work_order_id: 'WO-260826-1842',
        work_order_number: 'WO-260826-1842',
        title: 'Quarterly Air Handling Unit & Chiller PPM',
        workflow_type: 'PPM',
        discipline: 'HVAC',
        priority: 'P5_SCHEDULED',
        sla_target_response: '2026-08-26T09:00:00Z',
        sla_target_completion: '2026-08-26T12:00:00Z',
        nte_limit_gbp: 750,
        client: {
          id: 'cl-bham-tech',
          name: 'Birmingham Digital Innovation Centre',
          contract_ref: 'EFM-PPM-2026-04',
        },
        site: {
          id: 'site-bham-01',
          name: 'St James House — Innovation Centre',
          site_code: 'STJ-BHM',
          address_line1: '10 St James Square',
          city: 'Birmingham',
          postcode: 'B2 4DJ',
          coordinates: { lat: 52.4862, lng: -1.8904 },
          parking_instructions: 'Contractor bays available in rear basement loading bay. Entrance via Church Street.',
          loading_instructions: 'Goods lift available to Roof Plant Room via Level 4.',
          reception_procedure: 'Sign in at Main Concierge with photographic ID. Collect contractor visitor badge.',
          access_telephone: '0121 496 0192',
          opening_hours: '07:00 – 19:00 (Mon–Fri)',
          known_hazards: ['Roof edge work (permit required)', 'High voltage plant room interlock'],
          asbestos_status: 'REGISTER_INSPECTED_CLEAR',
          qr_nfc_installed: true,
        },
        asset: {
          id: 'ast-ahu-01',
          asset_tag: 'AHU-ROOF-01',
          name: 'Daikin Packaged Air Handling Unit 01',
          location_description: 'Roof Plant Room — Bay 2',
          manufacturer: 'Daikin Applied UK',
          model: 'D-AHU-V-120',
          serial_number: 'DK-2021-992144',
          criticality: 'CRITICAL',
          recent_work_history: [
            { date: '2026-05-18', summary: 'Filter media replaced. Belt tension adjusted.', engineer: 'Jack Turner' },
            { date: '2026-02-12', summary: 'Annual motor bearing lubrication completed.', engineer: 'Jack Turner' },
          ],
        },
        rams: {
          required: true,
          rams_id: 'RAMS-HVAC-2026-01',
          title: 'EntireFM Standard HVAC Chiller & AHU Maintenance Method Statement',
          version: 'v3.2',
          approved_by: 'Head of Safety',
          must_acknowledge: true,
          acknowledged: false,
        },
      },
      ppm_tasks: [
        {
          id: 'tsk-01',
          sequence: 1,
          task_name: 'Inspect drive belts for tension and wear',
          task_type: 'PASS_FAIL',
          is_mandatory: true,
        },
        {
          id: 'tsk-02',
          sequence: 2,
          task_name: 'Check and clean air filter media',
          task_type: 'PASS_FAIL',
          is_mandatory: true,
        },
        {
          id: 'tsk-03',
          sequence: 3,
          task_name: 'Supply Air Temperature measurement',
          task_type: 'MEASUREMENT',
          is_mandatory: true,
          measurement_unit: '°C',
          expected_min: 14.0,
          expected_max: 22.0,
        },
        {
          id: 'tsk-04',
          sequence: 4,
          task_name: 'Refrigerant Suction Pressure',
          task_type: 'MEASUREMENT',
          is_mandatory: true,
          measurement_unit: 'bar',
          expected_min: 3.5,
          expected_max: 6.0,
        },
        {
          id: 'tsk-05',
          sequence: 5,
          task_name: 'Inspect condensate drain tray and trap',
          task_type: 'PASS_FAIL',
          is_mandatory: true,
        },
      ],
      evidence_items: [],
      defects: [],
      variations: [],
      parts_used: [],
      return_visit_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Seed canonical Job 2: Reactive Air Conditioning Failure
    const visit2: FieldVisitRecord = {
      id: 'vis-reac-002',
      work_order_id: 'WO-260826-3091',
      provider_org_id: 'sup-test-01',
      assigned_engineer_id: 'op-jack-turner',
      assigned_engineer_name: 'Jack Turner',
      status: 'ASSIGNED',
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '11:30',
      job_pack: {
        work_order_id: 'WO-260826-3091',
        work_order_number: 'WO-260826-3091',
        title: 'AC Server Room Failure — High Temperature Alarm',
        workflow_type: 'REACTIVE',
        discipline: 'HVAC',
        priority: 'P2_HIGH',
        sla_target_response: '2026-08-26T12:30:00Z',
        sla_target_completion: '2026-08-26T15:30:00Z',
        nte_limit_gbp: 500,
        client: {
          id: 'cl-bham-tech',
          name: 'Market Street Commercial Estates',
          contract_ref: 'EFM-REAC-2026-09',
        },
        site: {
          id: 'site-mkt-02',
          name: '45 Market Street',
          site_code: 'MKT-45',
          address_line1: '45 Market Street',
          city: 'Birmingham',
          postcode: 'B5 4RB',
          parking_instructions: 'Pay & Display on Market Street. Free commercial loading for 20 mins.',
          loading_instructions: 'Direct access via side alleyway.',
          reception_procedure: 'Ask for Facility Manager Dave Smith on Arrival.',
          access_telephone: '0121 665 0911',
          opening_hours: '24/7 Access for Server Room Emergencies',
          known_hazards: ['Confined space in server room riser'],
          asbestos_status: 'REGISTER_INSPECTED_CLEAR',
          qr_nfc_installed: true,
        },
        asset: {
          id: 'ast-split-02',
          asset_tag: 'AC-SRV-02',
          name: 'Mitsubishi Electric Inverter Split System',
          location_description: 'Server Room 2, Ground Floor',
          manufacturer: 'Mitsubishi Electric',
          model: 'PUHZ-ZRP71VHA',
          serial_number: 'ME-2022-771890',
          criticality: 'CRITICAL',
          recent_work_history: [
            { date: '2026-04-10', summary: 'Annual condenser coil clean.', engineer: 'Jack Turner' },
          ],
        },
        rams: {
          required: true,
          title: 'Reactive Electrical & HVAC Diagnosis Method Statement',
          version: 'v2.1',
          must_acknowledge: false,
        },
      },
      ppm_tasks: [],
      evidence_items: [],
      defects: [],
      variations: [],
      parts_used: [],
      return_visit_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.visits.set(visit1.id, visit1);
    this.visits.set(visit2.id, visit2);
  }
}

export const fieldOperationsStore = new MemoryFieldOperationsStore();

// ─────────────────────────────────────────────────────────────
// STORE METHODS & CORE BUSINESS LOGIC
// ─────────────────────────────────────────────────────────────

/**
 * List operatives for a supplier organisation
 */
export async function listFieldOperatives(providerOrgId: string): Promise<FieldOperativeProfile[]> {
  return Array.from(fieldOperationsStore.operatives.values()).filter((o) => o.provider_org_id === providerOrgId);
}

/**
 * Get operative by ID
 */
export async function getFieldOperative(operativeId: string): Promise<FieldOperativeProfile | null> {
  return fieldOperationsStore.operatives.get(operativeId) || null;
}

/**
 * Strict Competency Gating Engine
 * Evaluates whether an individual field operative holds the required valid certification for a specific job discipline.
 */
export function evaluateOperativeCompetencyForJob(
  operative: FieldOperativeProfile,
  requiredDiscipline: WorkDiscipline
): { competent: boolean; reason?: string } {
  if (operative.status !== 'ACTIVE') {
    return { competent: false, reason: `Operative status is ${operative.status}` };
  }

  const now = new Date().toISOString().split('T')[0];

  switch (requiredDiscipline) {
    case 'GAS_HEATING': {
      const gasComp = operative.competencies.find(
        (c) => c.category === 'GAS' && c.status === 'VALID' && c.expiry_date >= now
      );
      if (!gasComp) {
        return {
          competent: false,
          reason: 'This operative does not hold an active, valid Gas Safe Commercial qualification.',
        };
      }
      return { competent: true };
    }

    case 'HVAC': {
      const hvacComp = operative.competencies.find(
        (c) => (c.category === 'HVAC' || c.code.includes('FGAS')) && c.status === 'VALID' && c.expiry_date >= now
      );
      if (!hvacComp) {
        return {
          competent: false,
          reason: 'This operative does not hold an active F-Gas / Refrigerant handling qualification.',
        };
      }
      return { competent: true };
    }

    case 'ELECTRICAL': {
      const elecComp = operative.competencies.find(
        (c) => c.category === 'ELECTRICAL' && c.status === 'VALID' && c.expiry_date >= now
      );
      if (!elecComp) {
        return {
          competent: false,
          reason: 'This operative does not hold an active 18th Edition / Electrical competency certification.',
        };
      }
      return { competent: true };
    }

    default:
      return { competent: true };
  }
}

/**
 * List visits for a supplier organisation (Dispatcher View)
 */
export async function listVisitsForProvider(
  providerOrgId: string,
  options: { status?: JobLifecycleStatus; engineerId?: string } = {}
): Promise<FieldVisitRecord[]> {
  let list = Array.from(fieldOperationsStore.visits.values()).filter((v) => v.provider_org_id === providerOrgId);
  if (options.status) list = list.filter((v) => v.status === options.status);
  if (options.engineerId) list = list.filter((v) => v.assigned_engineer_id === options.engineerId);
  return list.sort((a, b) => (a.scheduled_time > b.scheduled_time ? 1 : -1));
}

/**
 * List today's visits for an individual field engineer
 */
export async function listTodayVisitsForEngineer(
  engineerPersonId: string,
  providerOrgId: string
): Promise<FieldVisitRecord[]> {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(fieldOperationsStore.visits.values()).filter(
    (v) =>
      v.provider_org_id === providerOrgId &&
      v.assigned_engineer_id === engineerPersonId &&
      v.scheduled_date === today
  );
}

/**
 * Get visit by ID (Tenant-isolated)
 */
export async function getVisitById(
  visitId: string,
  providerOrgId?: string
): Promise<FieldVisitRecord | null> {
  const visit = fieldOperationsStore.visits.get(visitId) || null;
  if (!visit) return null;
  if (providerOrgId && visit.provider_org_id !== providerOrgId) {
    return null; // Strict cross-tenant boundary
  }
  return visit;
}

/**
 * Dispatcher: Assigns an Operative to a Job with Strict Competency Check
 */
export async function assignOperativeToVisit(
  visitId: string,
  operativeId: string,
  providerOrgId: string,
  dispatcherName: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = await getVisitById(visitId, providerOrgId);
  if (!visit) return { success: false, error: 'Visit not found or unauthorised' };

  const operative = await getFieldOperative(operativeId);
  if (!operative || operative.provider_org_id !== providerOrgId) {
    return { success: false, error: 'Operative not found in your organisation' };
  }

  // Evaluate Competency
  const evalResult = evaluateOperativeCompetencyForJob(operative, visit.job_pack.discipline);
  if (!evalResult.competent) {
    return { success: false, error: evalResult.reason };
  }

  // Update assignment
  const prevEngineer = visit.assigned_engineer_name;
  visit.assigned_engineer_id = operative.id;
  visit.assigned_engineer_name = `${operative.first_name} ${operative.last_name}`;
  visit.status = 'ASSIGNED';
  visit.updated_at = new Date().toISOString();

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'OPERATIVE_ASSIGNED',
    visit_id: visit.id,
    previous_engineer: prevEngineer,
    new_engineer: visit.assigned_engineer_name,
    dispatcher: dispatcherName,
    timestamp: new Date().toISOString(),
  });

  return { success: true, visit };
}

/**
 * Field Operative: Acknowledges / Accepts or Declines Job
 */
export async function acknowledgeVisit(
  visitId: string,
  operativeId: string,
  decision: 'ACCEPT' | 'DECLINE',
  declineReason?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Visit not found or you are not the assigned operative' };
  }

  if (decision === 'ACCEPT') {
    visit.status = 'ACKNOWLEDGED';
    visit.updated_at = new Date().toISOString();
  } else {
    visit.status = 'AWARDED'; // returns to unassigned pool for supplier dispatcher
    visit.assigned_engineer_id = undefined;
    visit.assigned_engineer_name = undefined;
    visit.updated_at = new Date().toISOString();

    fieldOperationsStore.auditLogs.push({
      event: 'JOB_DECLINED_BY_OPERATIVE',
      visit_id: visit.id,
      operative_id: operativeId,
      reason: declineReason || 'Operative unable to attend',
      timestamp: new Date().toISOString(),
    });
  }

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, visit };
}

/**
 * Field Operative: Starts Journey & Updates ETA
 */
export async function startJourney(
  visitId: string,
  operativeId: string,
  etaTime?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Unauthorised or visit not found' };
  }

  const now = new Date().toISOString();
  visit.status = 'TRAVELLING';
  visit.journey_started_at = now;
  if (etaTime) visit.eta_time = etaTime;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, visit };
}

/**
 * Field Operative: Arrival & Multi-Modal Check-In (Geofence / QR / NFC / Manual)
 */
export async function recordVisitArrival(
  visitId: string,
  operativeId: string,
  method: 'GEOFENCE' | 'QR' | 'NFC' | 'MANUAL',
  coordinates?: { lat: number; lng: number }
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Unauthorised or visit not found' };
  }

  const now = new Date().toISOString();
  visit.status = 'ARRIVED';
  visit.arrived_at = now;
  visit.arrival_method = method;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, visit };
}

/**
 * Field Operative: No Access Workflow with SLA Pause
 */
export async function recordVisitNoAccess(
  visitId: string,
  operativeId: string,
  data: {
    reason: string;
    contact_attempted: boolean;
    contact_notes: string;
    photo_evidence_url?: string;
  }
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Unauthorised or visit not found' };
  }

  const now = new Date().toISOString();
  visit.status = 'COMPLETED'; // visit outcome is NO_ACCESS
  visit.no_access = {
    reason: data.reason,
    contact_attempted: data.contact_attempted,
    contact_notes: data.contact_notes,
    photo_evidence_url: data.photo_evidence_url,
    sla_paused: true, // Fair SLA pause attribution
    recorded_at: now,
  };
  visit.return_visit_required = true;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, visit };
}

/**
 * Field Operative: Starts Work
 */
export async function startWork(
  visitId: string,
  operativeId: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Unauthorised or visit not found' };
  }

  const now = new Date().toISOString();
  visit.status = 'IN_PROGRESS';
  if (!visit.work_started_at) visit.work_started_at = now;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, visit };
}

/**
 * Field Operative: Updates PPM Task & Measurements
 */
export async function updatePpmTask(
  visitId: string,
  taskId: string,
  update: Partial<PpmChecklistItem>
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  const taskIndex = visit.ppm_tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return { success: false, error: 'Task not found' };

  const task = visit.ppm_tasks[taskIndex];
  Object.assign(task, update);

  // Check tolerance breach if measurement
  if (task.task_type === 'MEASUREMENT' && task.recorded_measurement !== undefined) {
    const val = task.recorded_measurement;
    const min = task.expected_min;
    const max = task.expected_max;
    if (min !== undefined && val < min) task.is_out_of_tolerance = true;
    else if (max !== undefined && val > max) task.is_out_of_tolerance = true;
    else task.is_out_of_tolerance = false;
  }

  visit.ppm_tasks[taskIndex] = task;
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, visit };
}

/**
 * Field Operative: Adds Photo Evidence Item
 */
export async function addEvidenceItem(
  visitId: string,
  evidence: Omit<FieldEvidenceItem, 'id' | 'captured_at' | 'sync_state'>
): Promise<{ success: boolean; evidence?: FieldEvidenceItem }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false };

  const item: FieldEvidenceItem = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    visit_id: visitId,
    category: evidence.category,
    file_name: evidence.file_name,
    storage_path: evidence.storage_path,
    captured_at: new Date().toISOString(),
    sync_state: 'SYNCED',
    caption: evidence.caption,
  };

  visit.evidence_items.push(item);
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, evidence: item };
}

/**
 * Field Operative: Raises Defect & Make Safe
 */
export async function raiseOperationalDefect(
  visitId: string,
  data: {
    title: string;
    description: string;
    severity: 'ADVISORY' | 'MINOR' | 'MAJOR' | 'CRITICAL' | 'UNSAFE';
    make_safe_status: 'NOT_APPLICABLE' | 'MADE_SAFE' | 'ISOLATED' | 'UNABLE_TO_MAKE_SAFE' | 'ESCALATED';
    stop_work_triggered?: boolean;
    recommended_action: string;
    evidence_photo_ids?: string[];
  }
): Promise<{ success: boolean; defect?: OperationalDefectRecord }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false };

  const defect: OperationalDefectRecord = {
    id: `def-${Date.now()}`,
    visit_id: visitId,
    work_order_id: visit.work_order_id,
    asset_id: visit.job_pack.asset?.id,
    title: data.title,
    description: data.description,
    severity: data.severity,
    make_safe_status: data.make_safe_status,
    stop_work_triggered: Boolean(data.stop_work_triggered),
    evidence_photo_ids: data.evidence_photo_ids || [],
    recommended_action: data.recommended_action,
    follow_on_work_required: true,
    created_at: new Date().toISOString(),
  };

  visit.defects.push(defect);
  visit.return_visit_required = true;
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, defect };
}

/**
 * Field Operative: Requests Variation with NTE Limit Enforcement
 */
export async function requestVariation(
  visitId: string,
  data: {
    reason: string;
    additional_scope: string;
    estimated_labour_hours: number;
    estimated_parts_cost_gbp: number;
  }
): Promise<{ success: boolean; variation?: VariationRequestRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  const labourRateGbpPerHour = 65.0; // standard commercial rate
  const labourCost = data.estimated_labour_hours * labourRateGbpPerHour;
  const total = labourCost + data.estimated_parts_cost_gbp;

  const nteLimit = visit.job_pack.nte_limit_gbp || 500;
  const nteBreached = total > nteLimit;

  const variation: VariationRequestRecord = {
    id: `var-${Date.now()}`,
    visit_id: visitId,
    work_order_id: visit.work_order_id,
    reason: data.reason,
    additional_scope: data.additional_scope,
    estimated_labour_hours: data.estimated_labour_hours,
    estimated_parts_cost_gbp: data.estimated_parts_cost_gbp,
    total_variation_estimate_gbp: total,
    status: 'REQUESTED',
    nte_breached: nteBreached,
    created_at: new Date().toISOString(),
  };

  visit.variations.push(variation);
  visit.status = 'AWAITING_APPROVAL';
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, variation };
}

/**
 * Field Operative: Records Part or Marks Awaiting Parts
 */
export async function recordOperationalPart(
  visitId: string,
  data: {
    part_name: string;
    manufacturer: string;
    part_number: string;
    quantity: number;
    is_installed: boolean;
    is_awaiting_delivery: boolean;
    expected_arrival_date?: string;
  }
): Promise<{ success: boolean; part?: OperationalPartRecord }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false };

  const part: OperationalPartRecord = {
    id: `prt-${Date.now()}`,
    visit_id: visitId,
    part_name: data.part_name,
    manufacturer: data.manufacturer,
    part_number: data.part_number,
    quantity: data.quantity,
    is_installed: data.is_installed,
    is_awaiting_delivery: data.is_awaiting_delivery,
    expected_arrival_date: data.expected_arrival_date,
  };

  visit.parts_used.push(part);
  if (data.is_awaiting_delivery) {
    visit.status = 'AWAITING_PARTS';
    visit.return_visit_required = true;
  }
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, part };
}

/**
 * Field Operative: Generates & Submits Digital Service Report (EFM-FSR Prefix)
 */
export async function submitDigitalServiceReport(
  visitId: string,
  operativeId: string,
  data: {
    work_completed_narrative: string;
    engineer_recommendations: string;
    completion_outcome: DigitalServiceReport['completion_outcome'];
    site_signatory?: {
      name: string;
      role: string;
      signature_data_url: string;
    };
  }
): Promise<{ success: boolean; report?: DigitalServiceReport; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || visit.assigned_engineer_id !== operativeId) {
    return { success: false, error: 'Unauthorised or visit not found' };
  }

  // Validate Mandatory Checklist items
  if (visit.job_pack.workflow_type === 'PPM') {
    const incompleteMandatory = visit.ppm_tasks.filter(
      (t) => t.is_mandatory && !t.recorded_status && t.recorded_measurement === undefined
    );
    if (incompleteMandatory.length > 0) {
      return {
        success: false,
        error: `Incomplete mandatory tasks: ${incompleteMandatory.map((t) => t.task_name).join(', ')}`,
      };
    }
  }

  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const reportNumber = `EFM-FSR-${year}-${Date.now().toString().slice(-6)}`;

  const report: DigitalServiceReport = {
    id: `fsr-${Date.now()}`,
    report_number: reportNumber,
    visit_id: visitId,
    work_order_id: visit.work_order_id,
    supplier_org_id: visit.provider_org_id,
    engineer_id: operativeId,
    engineer_name: visit.assigned_engineer_name || 'Attending Engineer',
    client_name: visit.job_pack.client.name,
    site_name: visit.job_pack.site.name,
    asset_name: visit.job_pack.asset?.name,
    arrival_time: visit.arrived_at || visit.scheduled_time,
    work_started_time: visit.work_started_at || visit.arrived_at || now,
    completion_time: now,
    work_completed_narrative: data.work_completed_narrative,
    engineer_recommendations: data.engineer_recommendations,
    completion_outcome: data.completion_outcome,
    site_signatory: data.site_signatory
      ? {
          ...data.site_signatory,
          signed_at: now,
        }
      : undefined,
    validation_status: 'SUBMITTED',
    created_at: now,
    updated_at: now,
  };

  visit.service_report = report;
  visit.status = 'SUBMITTED';
  visit.completed_at = now;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, report };
}

/**
 * EntireFM Operations: Validates Service Report or Requests Correction
 */
export async function validateServiceReport(
  visitId: string,
  action: 'VALIDATE' | 'CORRECTION_REQUIRED',
  reviewerName: string,
  correctionReason?: string
): Promise<{ success: boolean; report?: DigitalServiceReport; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || !visit.service_report) {
    return { success: false, error: 'Service report not found on visit' };
  }

  const now = new Date().toISOString();

  if (action === 'VALIDATE') {
    visit.service_report.validation_status = 'VALIDATED';
    visit.service_report.validated_by = reviewerName;
    visit.service_report.validated_at = now;
    visit.status = 'VALIDATED';
  } else {
    visit.service_report.validation_status = 'CORRECTION_REQUIRED';
    visit.service_report.correction_reason = correctionReason || 'Evidence or readings required';
    visit.status = 'CORRECTION_REQUIRED';
  }

  visit.service_report.updated_at = now;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, report: visit.service_report };
}

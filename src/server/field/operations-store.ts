/**
 * ENTIREFM CAFM FIELD OPERATIONS & MOBILE EXECUTION DOMAIN (PHASE 6 & 6R)
 * =======================================================================
 * Production-hardened field operations store connecting awarded supplier organisations
 * to mobile field operatives attending client sites.
 *
 * Hardened Capabilities:
 * - Operative competency directory & execution-time revalidation
 * - Mobile idempotency protection (arrival, work start, defects, variations, reports)
 * - Poor-signal resilience & queued sync states (Saved on device, Waiting for connection, Syncing, Synced, Sync failed)
 * - Unsynced evidence submission gate (prevents incomplete submissions)
 * - Concurrency protection against stale reassigned execution
 * - Multi-operative attendance (Lead + Assistant/Specialist) on single canonical visit
 * - Revision history & versioning for service reports (Revision 1 -> Correction -> Revision 2 -> Validated)
 * - Safe client milestone projection (stripping internal margins/disputes)
 * - Strict multi-tenant RBAC & protected report generation
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
  | 'VALIDATED'
  | 'CANCELLED';

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

export type EvidenceSyncState =
  | 'SAVED_ON_DEVICE'
  | 'WAITING_FOR_CONNECTION'
  | 'SYNCING'
  | 'SYNCED'
  | 'SYNC_FAILED';

export interface FieldEvidenceItem {
  id: string;
  visit_id: string;
  category: 'BEFORE' | 'DURING' | 'AFTER' | 'DEFECT' | 'ASSET_LABEL' | 'METER_READING' | 'OTHER';
  file_name: string;
  storage_path: string;
  captured_at: string;
  sync_state: EvidenceSyncState;
  caption?: string;
  file_size_bytes?: number;
}

export interface OperationalDefectRecord {
  id: string;
  idempotency_key?: string;
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
  idempotency_key?: string;
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

export interface ServiceReportRevision {
  revision_number: number;
  submitted_at: string;
  submitted_by_id: string;
  submitted_by_name: string;
  work_completed_narrative: string;
  engineer_recommendations: string;
  completion_outcome: string;
  site_signatory?: {
    name: string;
    role: string;
  };
  validation_status: 'SUBMITTED' | 'CORRECTION_REQUIRED' | 'VALIDATED';
  correction_reason?: string;
}

export interface DigitalServiceReport {
  id: string;
  report_number: string; // EFM-FSR-YYYY-NNNNNN
  revision_number: number;
  revision_history: ServiceReportRevision[];
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

export interface AdditionalOperativeAttendance {
  operative_id: string;
  operative_name: string;
  role_on_visit: 'ASSISTANT' | 'SPECIALIST' | 'APPRENTICE' | 'SAFETY_OBSERVER';
  arrived_at?: string;
  departed_at?: string;
}

export interface FieldVisitRecord {
  id: string;
  work_order_id: string;
  provider_org_id: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  additional_operatives?: AdditionalOperativeAttendance[];
  is_cancelled?: boolean;
  cancellation_reason?: string;
  cancelled_at?: string;
  status: JobLifecycleStatus;
  job_pack: DigitalJobPack;
  scheduled_date: string;
  scheduled_time: string;
  journey_started_at?: string;
  eta_time?: string;
  arrived_at?: string;
  arrival_method?: 'GEOFENCE' | 'QR' | 'NFC' | 'MANUAL';
  arrival_idempotency_key?: string;
  work_started_at?: string;
  work_started_idempotency_key?: string;
  ppm_tasks: PpmChecklistItem[];
  evidence_items: FieldEvidenceItem[];
  defects: OperationalDefectRecord[];
  variations: VariationRequestRecord[];
  parts_used: OperationalPartRecord[];
  service_report?: DigitalServiceReport;
  submission_idempotency_key?: string;
  no_access?: {
    reason: string;
    contact_attempted: boolean;
    contact_notes: string;
    photo_evidence_url?: string;
    sla_paused: boolean;
    recorded_at: string;
  };
  return_visit_required: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// IN-MEMORY STORAGE & SEED ENGINE
// ─────────────────────────────────────────────────────────────

class MemoryFieldOperationsStore {
  operatives: Map<string, FieldOperativeProfile> = new Map();
  visits: Map<string, FieldVisitRecord> = new Map();
  auditLogs: Array<Record<string, any>> = new Map().values() as any;
  idempotencyCache: Map<string, { timestamp: string; result: any }> = new Map();
  supplierComplianceStatus: Map<string, 'APPROVED' | 'COMPLIANCE_HOLD' | 'SUSPENDED'> = new Map();

  constructor() {
    this.auditLogs = [];
    this.seed();
  }

  seed() {
    this.supplierComplianceStatus.set('sup-test-01', 'APPROVED');
    this.supplierComplianceStatus.set('sup-other-organisation', 'APPROVED');
    this.supplierComplianceStatus.set('sup-suspended-01', 'COMPLIANCE_HOLD');

    // 1. Qualified Lead Engineer (Gas + HVAC F-Gas)
    const op1: FieldOperativeProfile = {
      id: 'op-jack-turner',
      provider_org_id: 'sup-test-01',
      first_name: 'Jack',
      last_name: 'Turner',
      email: 'jack.turner@apexthermal.co.uk',
      phone: '07700 900142',
      role: 'LEAD_ENGINEER',
      status: 'ACTIVE',
      assigned_trades: ['HVAC', 'GAS_HEATING'],
      max_daily_jobs: 4,
      competencies: [
        {
          id: 'cmp-01',
          code: 'FGAS_CAT1',
          title: 'City & Guilds 2079 F-Gas Category 1',
          category: 'HVAC',
          certificate_number: 'FGAS-2024-88912',
          issuing_body: 'City & Guilds',
          expiry_date: '2028-06-30',
          is_verified: true,
          status: 'VALID',
        },
        {
          id: 'cmp-02',
          code: 'GAS_SAFE_COCN1',
          title: 'Commercial Core Gas Safety (COCN1)',
          category: 'GAS',
          certificate_number: 'GS-882190-UK',
          issuing_body: 'Gas Safe Register',
          expiry_date: '2027-11-15',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    // 2. Service Engineer (Building Fabric only, NO Gas/HVAC)
    const op2: FieldOperativeProfile = {
      id: 'op-dave-miller',
      provider_org_id: 'sup-test-01',
      first_name: 'Dave',
      last_name: 'Miller',
      email: 'dave.miller@apexthermal.co.uk',
      phone: '07700 900551',
      role: 'SERVICE_ENGINEER',
      status: 'ACTIVE',
      assigned_trades: ['BUILDING_FABRIC'],
      max_daily_jobs: 5,
      competencies: [
        {
          id: 'cmp-03',
          code: 'CSCS_FABRIC',
          title: 'CSCS Skilled Worker — Carpentry & Building Maintenance',
          category: 'GENERAL',
          certificate_number: 'CSCS-991204',
          issuing_body: 'CITB',
          expiry_date: '2027-01-01',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    // 3. Assistant Operative
    const op3: FieldOperativeProfile = {
      id: 'op-sam-taylor',
      provider_org_id: 'sup-test-01',
      first_name: 'Sam',
      last_name: 'Taylor',
      email: 'sam.taylor@apexthermal.co.uk',
      phone: '07700 900892',
      role: 'APPRENTICE',
      status: 'ACTIVE',
      assigned_trades: ['HVAC'],
      max_daily_jobs: 3,
      competencies: [
        {
          id: 'cmp-04',
          code: 'CSCS_APPRENTICE',
          title: 'CSCS Trainee / Apprentice Card',
          category: 'HEALTH_SAFETY',
          certificate_number: 'CSCS-AP-4412',
          issuing_body: 'CITB',
          expiry_date: '2027-09-30',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    // 4. Qualified Senior HVAC Technician (F-Gas Certified)
    const op4: FieldOperativeProfile = {
      id: 'op-alex-rivers',
      provider_org_id: 'sup-test-01',
      first_name: 'Alex',
      last_name: 'Rivers',
      email: 'alex.rivers@apexthermal.co.uk',
      phone: '07700 900663',
      role: 'SPECIALIST_TECHNICIAN',
      status: 'ACTIVE',
      assigned_trades: ['HVAC'],
      max_daily_jobs: 4,
      competencies: [
        {
          id: 'cmp-05',
          code: 'FGAS_CAT1',
          title: 'City & Guilds 2079 F-Gas Category 1',
          category: 'HVAC',
          certificate_number: 'FGAS-2025-91002',
          issuing_body: 'City & Guilds',
          expiry_date: '2029-01-15',
          is_verified: true,
          status: 'VALID',
        },
      ],
    };

    this.operatives.set(op1.id, op1);
    this.operatives.set(op2.id, op2);
    this.operatives.set(op3.id, op3);
    this.operatives.set(op4.id, op4);

    // Initial Seed Visit 1 (PPM)
    const visit1: FieldVisitRecord = {
      id: 'vis-ppm-001',
      work_order_id: 'WO-260826-1842',
      provider_org_id: 'sup-test-01',
      assigned_engineer_id: undefined, // unassigned initially
      status: 'AWARDED',
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '09:00',
      job_pack: {
        work_order_id: 'WO-260826-1842',
        work_order_number: 'WO-260826-1842',
        title: 'Quarterly Air Handling Unit & Chiller PPM',
        workflow_type: 'PPM',
        discipline: 'HVAC',
        priority: 'P3_MEDIUM',
        sla_target_response: '2026-08-26T10:00:00Z',
        sla_target_completion: '2026-08-26T17:00:00Z',
        nte_limit_gbp: 750,
        client: {
          id: 'cl-meridian',
          name: 'Meridian Office Parks Ltd',
          contract_ref: 'EFM-PPM-2026-04',
        },
        site: {
          id: 'site-st-james-01',
          name: 'St James House — Innovation Centre',
          site_code: 'SJH-01',
          address_line1: '10 St James Road',
          city: 'Birmingham',
          postcode: 'B15 1TP',
          coordinates: { lat: 52.4862, lng: -1.8904 },
          parking_instructions: 'Contractor bays 4-6 at rear of building. Code 4892#.',
          loading_instructions: 'Goods lift available via basement entrance B.',
          reception_procedure: 'Present EntireFM digital credentials at main security desk.',
          access_telephone: '0121 496 0192',
          opening_hours: '07:00 - 19:00 Mon-Fri',
          known_hazards: [
            'Roof edge work (permit required)',
            'High voltage plant room interlock',
          ],
          asbestos_status: 'REGISTER_INSPECTED_CLEAR',
          qr_nfc_installed: true,
        },
        asset: {
          id: 'ast-ahu-01',
          asset_tag: 'AHU-ROOF-01',
          name: 'Daikin Packaged Air Handling Unit 01',
          location_description: 'Roof Plant Deck — Area C',
          manufacturer: 'Daikin Applied',
          model: 'D-AHU-400-V',
          serial_number: 'DK-2023-908122',
          criticality: 'CRITICAL',
          recent_work_history: [
            { date: '2026-05-20', summary: 'Quarterly belt replacement and filter clean.', engineer: 'Jack Turner' },
            { date: '2026-02-14', summary: 'Winter pre-season inspection.', engineer: 'Jack Turner' },
          ],
        },
        rams: {
          required: true,
          rams_id: 'RAMS-HVAC-2026-01',
          title: 'EntireFM Standard HVAC Chiller & AHU Maintenance Method Statement',
          version: 'v3.2',
          approved_by: 'EntireFM H&S Director',
          must_acknowledge: true,
          acknowledged: false,
        },
      },
      ppm_tasks: [
        {
          id: 'tsk-01',
          sequence: 1,
          task_name: 'Inspect and clean air filter media',
          task_type: 'PASS_FAIL',
          is_mandatory: true,
        },
        {
          id: 'tsk-02',
          sequence: 2,
          task_name: 'Check fan drive belt tension and alignment',
          task_type: 'PASS_FAIL',
          is_mandatory: true,
        },
        {
          id: 'tsk-03',
          sequence: 3,
          task_name: 'Measure supply air temperature',
          task_type: 'MEASUREMENT',
          is_mandatory: true,
          measurement_unit: '°C',
          expected_min: 16.0,
          expected_max: 22.0,
        },
        {
          id: 'tsk-04',
          sequence: 4,
          task_name: 'Measure compressor discharge pressure',
          task_type: 'MEASUREMENT',
          is_mandatory: true,
          measurement_unit: 'bar',
          expected_min: 3.5,
          expected_max: 5.5,
        },
        {
          id: 'tsk-05',
          sequence: 5,
          task_name: 'Verify electrical termination torque settings',
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

    // Initial Seed Visit 2 (Reactive)
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

export async function listFieldOperatives(providerOrgId: string): Promise<FieldOperativeProfile[]> {
  return Array.from(fieldOperationsStore.operatives.values()).filter((o) => o.provider_org_id === providerOrgId);
}

export async function getFieldOperative(operativeId: string): Promise<FieldOperativeProfile | null> {
  return fieldOperationsStore.operatives.get(operativeId) || null;
}

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

export async function listVisitsForProvider(
  providerOrgId: string,
  options: { status?: JobLifecycleStatus; engineerId?: string } = {}
): Promise<FieldVisitRecord[]> {
  let list = Array.from(fieldOperationsStore.visits.values()).filter((v) => v.provider_org_id === providerOrgId);
  if (options.status) list = list.filter((v) => v.status === options.status);
  if (options.engineerId) list = list.filter((v) => v.assigned_engineer_id === options.engineerId);
  return list.sort((a, b) => (a.scheduled_time > b.scheduled_time ? 1 : -1));
}

export async function listTodayVisitsForEngineer(
  engineerPersonId: string,
  providerOrgId: string
): Promise<FieldVisitRecord[]> {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(fieldOperationsStore.visits.values()).filter(
    (v) =>
      v.provider_org_id === providerOrgId &&
      (v.assigned_engineer_id === engineerPersonId ||
        v.additional_operatives?.some((o) => o.operative_id === engineerPersonId)) &&
      v.scheduled_date === today &&
      !v.is_cancelled
  );
}

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
 * Dispatcher: Assigns or Reassigns an Operative with Strict Competency Check
 */
export async function assignOperativeToVisit(
  visitId: string,
  operativeId: string,
  providerOrgId: string,
  dispatcherName: string,
  reassignmentReason?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = await getVisitById(visitId, providerOrgId);
  if (!visit) return { success: false, error: 'Visit not found or unauthorised' };

  if (visit.is_cancelled) {
    return { success: false, error: 'Cannot assign operative to a cancelled work order' };
  }

  const operative = await getFieldOperative(operativeId);
  if (!operative || operative.provider_org_id !== providerOrgId) {
    return { success: false, error: 'Operative not found in your organisation' };
  }

  // Evaluate Competency
  const evalResult = evaluateOperativeCompetencyForJob(operative, visit.job_pack.discipline);
  if (!evalResult.competent) {
    return { success: false, error: evalResult.reason };
  }

  // Record audit history
  const prevEngineerId = visit.assigned_engineer_id;
  const prevEngineerName = visit.assigned_engineer_name;

  visit.assigned_engineer_id = operative.id;
  visit.assigned_engineer_name = `${operative.first_name} ${operative.last_name}`;
  visit.status = 'ASSIGNED';
  visit.updated_at = new Date().toISOString();

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: prevEngineerId ? 'OPERATIVE_REASSIGNED' : 'OPERATIVE_ASSIGNED',
    visit_id: visit.id,
    previous_engineer_id: prevEngineerId,
    previous_engineer_name: prevEngineerName,
    new_engineer_id: operative.id,
    new_engineer_name: visit.assigned_engineer_name,
    dispatcher: dispatcherName,
    reason: reassignmentReason || (prevEngineerId ? 'Dispatcher operational re-route' : 'Initial assignment'),
    timestamp: new Date().toISOString(),
  });

  return { success: true, visit };
}

/**
 * Multi-Operative Attendance: Adds an Assistant or Specialist Operative to a Single Visit
 */
export async function addAdditionalOperativeToVisit(
  visitId: string,
  operativeId: string,
  roleOnVisit: AdditionalOperativeAttendance['role_on_visit'],
  requestingLeadOperativeId: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (visit.assigned_engineer_id !== requestingLeadOperativeId) {
    return { success: false, error: 'Only the designated Lead Engineer can add secondary operatives to this attendance' };
  }

  const operative = await getFieldOperative(operativeId);
  if (!operative || operative.provider_org_id !== visit.provider_org_id) {
    return { success: false, error: 'Additional operative not found in your organisation' };
  }

  if (!visit.additional_operatives) visit.additional_operatives = [];

  const existing = visit.additional_operatives.find((o) => o.operative_id === operativeId);
  if (existing) {
    return { success: true, visit, error: 'Operative already registered on this attendance' };
  }

  visit.additional_operatives.push({
    operative_id: operative.id,
    operative_name: `${operative.first_name} ${operative.last_name}`,
    role_on_visit: roleOnVisit,
    arrived_at: new Date().toISOString(),
  });

  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'ADDITIONAL_OPERATIVE_ATTENDANCE_RECORDED',
    visit_id: visit.id,
    operative_id: operative.id,
    role_on_visit: roleOnVisit,
    lead_engineer_id: requestingLeadOperativeId,
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
  declineReason?: string,
  idempotencyKey?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (visit.assigned_engineer_id !== operativeId) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  if (visit.is_cancelled) {
    return { success: false, error: 'This work order has been cancelled by EntireFM Operations.' };
  }

  if (decision === 'ACCEPT') {
    visit.status = 'ACKNOWLEDGED';
    visit.updated_at = new Date().toISOString();
  } else {
    visit.status = 'AWARDED';
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
  const result = { success: true, visit };

  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, {
      timestamp: new Date().toISOString(),
      result,
    });
  }

  return result;
}

/**
 * Field Operative: Starts Journey & Updates ETA
 */
export async function startJourney(
  visitId: string,
  operativeId: string,
  etaTime?: string,
  idempotencyKey?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (visit.assigned_engineer_id !== operativeId) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  if (visit.is_cancelled) {
    return { success: false, error: 'This work order has been cancelled by EntireFM Operations.' };
  }

  const now = new Date().toISOString();
  visit.status = 'TRAVELLING';
  if (!visit.journey_started_at) visit.journey_started_at = now;
  if (etaTime) visit.eta_time = etaTime;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);
  const result = { success: true, visit };

  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, {
      timestamp: now,
      result,
    });
  }

  return result;
}

/**
 * Field Operative: Arrival & Multi-Modal Check-In (Geofence / QR / NFC / Manual)
 * Idempotency Protected
 */
export async function recordVisitArrival(
  visitId: string,
  operativeId: string,
  method: 'GEOFENCE' | 'QR' | 'NFC' | 'MANUAL',
  coordinates?: { lat: number; lng: number },
  idempotencyKey?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (visit.assigned_engineer_id !== operativeId && !visit.additional_operatives?.some((o) => o.operative_id === operativeId)) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  if (visit.is_cancelled) {
    return { success: false, error: 'This work order has been cancelled by EntireFM Operations.' };
  }

  // Idempotency: If already arrived, do not overwrite timestamp or generate duplicate events
  if (visit.status === 'ARRIVED' || visit.status === 'IN_PROGRESS') {
    const result = { success: true, visit };
    if (idempotencyKey) fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: new Date().toISOString(), result });
    return result;
  }

  const now = new Date().toISOString();
  visit.status = 'ARRIVED';
  visit.arrived_at = now;
  visit.arrival_method = method;
  if (idempotencyKey) visit.arrival_idempotency_key = idempotencyKey;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'VISIT_ARRIVAL_VERIFIED',
    visit_id: visit.id,
    operative_id: operativeId,
    method,
    coordinates: coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'NOT_CAPTURED_PRIVACY',
    timestamp: now,
  });

  const result = { success: true, visit };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: now, result });
  }

  return result;
}

/**
 * Field Operative: Starts Work with Execution-Time Competency & Supplier Status Revalidation
 */
export async function startWork(
  visitId: string,
  operativeId: string,
  idempotencyKey?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  // 1. Concurrency Check: Operative Reassignment
  if (visit.assigned_engineer_id !== operativeId) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  // 2. Cancellation Check
  if (visit.is_cancelled) {
    return {
      success: false,
      error: 'This work order has been cancelled by EntireFM Operations. Contact Helpdesk if work has already commenced.',
    };
  }

  // 3. Execution-Time Competency Revalidation
  const operative = await getFieldOperative(operativeId);
  if (!operative) return { success: false, error: 'Operative record not found' };

  const evalResult = evaluateOperativeCompetencyForJob(operative, visit.job_pack.discipline);
  if (!evalResult.competent) {
    return {
      success: false,
      error: `Competency Revalidation Failed: ${evalResult.reason}`,
    };
  }

  // 4. Execution-Time Supplier Approval Revalidation
  const supplierStatus = fieldOperationsStore.supplierComplianceStatus.get(visit.provider_org_id) || 'APPROVED';
  if (supplierStatus !== 'APPROVED') {
    return {
      success: false,
      error: 'Supplier Approval Revalidation Failed: Supplier organisation is currently on compliance hold.',
    };
  }

  const now = new Date().toISOString();
  visit.status = 'IN_PROGRESS';
  if (!visit.work_started_at) visit.work_started_at = now;
  if (idempotencyKey) visit.work_started_idempotency_key = idempotencyKey;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'WORK_COMMENCED',
    visit_id: visit.id,
    operative_id: operativeId,
    timestamp: now,
  });

  const result = { success: true, visit };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: now, result });
  }

  return result;
}

/**
 * Field Operative: Updates PPM Task & Measurements
 */
export async function updatePpmTask(
  visitId: string,
  taskId: string,
  update: Partial<PpmChecklistItem>,
  operativeId?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (operativeId && visit.assigned_engineer_id !== operativeId && !visit.additional_operatives?.some((o) => o.operative_id === operativeId)) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  if (visit.is_cancelled) {
    return { success: false, error: 'This work order has been cancelled by EntireFM Operations.' };
  }

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
 * Field Operative: Adds Photo Evidence Item with Sync State Support
 */
export async function addEvidenceItem(
  visitId: string,
  evidence: Omit<FieldEvidenceItem, 'id' | 'captured_at'>,
  operativeId?: string
): Promise<{ success: boolean; evidence?: FieldEvidenceItem; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (operativeId && visit.assigned_engineer_id !== operativeId && !visit.additional_operatives?.some((o) => o.operative_id === operativeId)) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  const item: FieldEvidenceItem = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    visit_id: visitId,
    category: evidence.category,
    file_name: evidence.file_name,
    storage_path: evidence.storage_path,
    captured_at: new Date().toISOString(),
    sync_state: evidence.sync_state || 'SYNCED',
    caption: evidence.caption,
    file_size_bytes: evidence.file_size_bytes || 1024 * 450,
  };

  visit.evidence_items.push(item);
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, evidence: item };
}

/**
 * Field Operative: Raises Defect & Make Safe (Idempotency Protected)
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
  },
  idempotencyKey?: string,
  operativeId?: string
): Promise<{ success: boolean; defect?: OperationalDefectRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (operativeId && visit.assigned_engineer_id !== operativeId && !visit.additional_operatives?.some((o) => o.operative_id === operativeId)) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  // Idempotency: Deduplicate by title & visit
  const existing = visit.defects.find((d) => (idempotencyKey && d.idempotency_key === idempotencyKey) || d.title === data.title);
  if (existing) {
    const result = { success: true, defect: existing };
    if (idempotencyKey) fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: new Date().toISOString(), result });
    return result;
  }

  const defect: OperationalDefectRecord = {
    id: `def-${Date.now()}`,
    idempotency_key: idempotencyKey,
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

  fieldOperationsStore.auditLogs.push({
    event: 'OPERATIONAL_DEFECT_RECORDED',
    visit_id: visit.id,
    defect_id: defect.id,
    severity: defect.severity,
    stop_work: defect.stop_work_triggered,
    timestamp: defect.created_at,
  });

  const result = { success: true, defect };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: defect.created_at, result });
  }

  return result;
}

/**
 * Field Operative: Requests Variation with NTE Limit Enforcement (Idempotency Protected)
 */
export async function requestVariation(
  visitId: string,
  data: {
    reason: string;
    additional_scope: string;
    estimated_labour_hours: number;
    estimated_parts_cost_gbp: number;
  },
  idempotencyKey?: string,
  operativeId?: string
): Promise<{ success: boolean; variation?: VariationRequestRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (operativeId && visit.assigned_engineer_id !== operativeId && !visit.additional_operatives?.some((o) => o.operative_id === operativeId)) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  // Idempotency: Deduplicate by key or scope
  const existing = visit.variations.find((v) => (idempotencyKey && v.idempotency_key === idempotencyKey) || v.reason === data.reason);
  if (existing) {
    const result = { success: true, variation: existing };
    if (idempotencyKey) fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: new Date().toISOString(), result });
    return result;
  }

  const labourRateGbpPerHour = 65.0;
  const labourCost = data.estimated_labour_hours * labourRateGbpPerHour;
  const total = labourCost + data.estimated_parts_cost_gbp;
  const nteLimit = visit.job_pack.nte_limit_gbp || 500;
  const nteBreached = total > nteLimit;

  const variation: VariationRequestRecord = {
    id: `var-${Date.now()}`,
    idempotency_key: idempotencyKey,
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
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'VARIATION_REQUESTED',
    visit_id: visit.id,
    variation_id: variation.id,
    total_estimate_gbp: total,
    nte_breached: nteBreached,
    timestamp: variation.created_at,
  });

  const result = { success: true, variation };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: variation.created_at, result });
  }

  return result;
}

/**
 * Field Operative: Records Part
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
  if (part.is_awaiting_delivery) {
    visit.status = 'AWAITING_PARTS';
    visit.return_visit_required = true;
  }
  visit.updated_at = new Date().toISOString();
  fieldOperationsStore.visits.set(visit.id, visit);

  return { success: true, part };
}

/**
 * Field Operative: Submits Digital Service Report
 * Hardened with:
 * - Lead Operative Enforcement
 * - Idempotency Deduplication
 * - Mandatory Unsynced Evidence Check
 * - Version History & Revision Tracking
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
  },
  idempotencyKey?: string
): Promise<{ success: boolean; report?: DigitalServiceReport; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  // Lead Operative Check
  if (visit.assigned_engineer_id !== operativeId) {
    return {
      success: false,
      error: 'Only the designated Lead Operative is authorised to submit the final service report for this visit.',
    };
  }

  if (visit.is_cancelled) {
    return { success: false, error: 'Cannot submit a service report for a cancelled work order.' };
  }

  // Mandatory Unsynced Evidence Gate
  const unsyncedEvidence = visit.evidence_items.filter(
    (ev) => ev.sync_state === 'SAVED_ON_DEVICE' || ev.sync_state === 'WAITING_FOR_CONNECTION' || ev.sync_state === 'SYNCING'
  );
  if (unsyncedEvidence.length > 0) {
    return {
      success: false,
      error: `${unsyncedEvidence.length} piece(s) of photo evidence are still waiting to upload. Connect to network and complete sync before submitting report.`,
    };
  }

  const now = new Date().toISOString();
  const operative = await getFieldOperative(operativeId);
  const engineerName = operative ? `${operative.first_name} ${operative.last_name}` : visit.assigned_engineer_name || 'Engineer';

  const existingReport = visit.service_report;
  const currentRevisionNumber = existingReport ? existingReport.revision_number + 1 : 1;
  const existingHistory = existingReport ? existingReport.revision_history : [];

  const newRevisionEntry: ServiceReportRevision = {
    revision_number: currentRevisionNumber,
    submitted_at: now,
    submitted_by_id: operativeId,
    submitted_by_name: engineerName,
    work_completed_narrative: data.work_completed_narrative,
    engineer_recommendations: data.engineer_recommendations,
    completion_outcome: data.completion_outcome,
    site_signatory: data.site_signatory ? { name: data.site_signatory.name, role: data.site_signatory.role } : undefined,
    validation_status: 'SUBMITTED',
  };

  const report: DigitalServiceReport = {
    id: existingReport ? existingReport.id : `rep-${Date.now()}`,
    report_number: existingReport
      ? existingReport.report_number
      : `EFM-FSR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    revision_number: currentRevisionNumber,
    revision_history: [...existingHistory, newRevisionEntry],
    visit_id: visit.id,
    work_order_id: visit.work_order_id,
    supplier_org_id: visit.provider_org_id,
    engineer_id: operativeId,
    engineer_name: engineerName,
    client_name: visit.job_pack.client.name,
    site_name: visit.job_pack.site.name,
    asset_name: visit.job_pack.asset?.name,
    arrival_time: visit.arrived_at || now,
    work_started_time: visit.work_started_at || now,
    completion_time: now,
    work_completed_narrative: data.work_completed_narrative,
    engineer_recommendations: data.engineer_recommendations,
    completion_outcome: data.completion_outcome,
    site_signatory: data.site_signatory
      ? {
          name: data.site_signatory.name,
          role: data.site_signatory.role,
          signature_data_url: data.site_signatory.signature_data_url,
          signed_at: now,
        }
      : undefined,
    validation_status: 'SUBMITTED',
    correction_reason: undefined,
    created_at: existingReport ? existingReport.created_at : now,
    updated_at: now,
  };

  visit.service_report = report;
  visit.status = 'SUBMITTED';
  if (idempotencyKey) visit.submission_idempotency_key = idempotencyKey;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'DIGITAL_SERVICE_REPORT_SUBMITTED',
    visit_id: visit.id,
    report_id: report.id,
    report_number: report.report_number,
    revision: currentRevisionNumber,
    operative_id: operativeId,
    outcome: report.completion_outcome,
    timestamp: now,
  });

  const result = { success: true, report };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: now, result });
  }

  return result;
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
    return { success: false, error: 'Visit or service report not found' };
  }

  const now = new Date().toISOString();
  const report = visit.service_report;

  if (action === 'VALIDATE') {
    report.validation_status = 'VALIDATED';
    report.validated_by = reviewerName;
    report.validated_at = now;
    report.updated_at = now;
    visit.status = 'VALIDATED';

    fieldOperationsStore.auditLogs.push({
      event: 'SERVICE_REPORT_VALIDATED',
      visit_id: visit.id,
      report_number: report.report_number,
      reviewer: reviewerName,
      timestamp: now,
    });
  } else {
    report.validation_status = 'CORRECTION_REQUIRED';
    report.correction_reason = correctionReason || 'Further documentation or evidence required';
    report.updated_at = now;
    visit.status = 'CORRECTION_REQUIRED';

    fieldOperationsStore.auditLogs.push({
      event: 'SERVICE_REPORT_CORRECTION_REQUESTED',
      visit_id: visit.id,
      report_number: report.report_number,
      reviewer: reviewerName,
      reason: report.correction_reason,
      timestamp: now,
    });
  }

  visit.updated_at = now;
  fieldOperationsStore.visits.set(visit.id, visit);
  return { success: true, report };
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
  },
  idempotencyKey?: string
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  if (idempotencyKey && fieldOperationsStore.idempotencyCache.has(idempotencyKey)) {
    return fieldOperationsStore.idempotencyCache.get(idempotencyKey)!.result;
  }

  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  if (visit.assigned_engineer_id !== operativeId) {
    return {
      success: false,
      error: 'This job has been reassigned to another operative and is no longer available for execution from your account.',
    };
  }

  const now = new Date().toISOString();
  visit.status = 'COMPLETED';
  visit.no_access = {
    reason: data.reason,
    contact_attempted: data.contact_attempted,
    contact_notes: data.contact_notes,
    photo_evidence_url: data.photo_evidence_url,
    sla_paused: true,
    recorded_at: now,
  };
  visit.return_visit_required = true;
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'NO_ACCESS_RECORDED',
    visit_id: visit.id,
    operative_id: operativeId,
    reason: data.reason,
    sla_paused: true,
    timestamp: now,
  });

  const result = { success: true, visit };
  if (idempotencyKey) {
    fieldOperationsStore.idempotencyCache.set(idempotencyKey, { timestamp: now, result });
  }

  return result;
}

/**
 * EntireFM Operations: Cancels a Work Order / Visit
 */
export async function cancelVisit(
  visitId: string,
  reason: string,
  cancelledBy: string = 'EntireFM Operations Controller'
): Promise<{ success: boolean; visit?: FieldVisitRecord; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit) return { success: false, error: 'Visit not found' };

  const now = new Date().toISOString();
  visit.is_cancelled = true;
  visit.cancellation_reason = reason;
  visit.cancelled_at = now;
  visit.status = 'CANCELLED';
  visit.updated_at = now;

  fieldOperationsStore.visits.set(visit.id, visit);

  fieldOperationsStore.auditLogs.push({
    event: 'WORK_ORDER_CANCELLED',
    visit_id: visit.id,
    reason,
    cancelled_by: cancelledBy,
    timestamp: now,
  });

  return { success: true, visit };
}

/**
 * Client-Safe Milestone Mapper
 * Strips internal contractor margins, buy rates, dispute notes, and internal EntireFM chatter.
 */
export function mapToClientSafeMilestone(visit: FieldVisitRecord): {
  work_order_number: string;
  client_milestone: string;
  public_status_notes: string;
  site_name: string;
  asset_name?: string;
  updated_at: string;
  is_client_visible: boolean;
} {
  let client_milestone = 'Scheduled';
  let public_status_notes = 'Attendance planned with approved service partner.';

  switch (visit.status) {
    case 'AWARDED':
    case 'ASSIGNED':
      client_milestone = 'Engineer Assigned';
      public_status_notes = 'Certified service engineer allocated for scheduled visit.';
      break;
    case 'ACKNOWLEDGED':
    case 'TRAVELLING':
      client_milestone = 'En Route';
      public_status_notes = visit.eta_time ? `Engineer travelling to site. Estimated arrival: ${visit.eta_time}.` : 'Engineer travelling to site.';
      break;
    case 'ARRIVED':
      client_milestone = 'On Site';
      public_status_notes = 'Engineer has verified arrival on site.';
      break;
    case 'IN_PROGRESS':
      client_milestone = 'Work in Progress';
      public_status_notes = 'Maintenance and inspection currently underway in accordance with RAMS.';
      break;
    case 'AWAITING_PARTS':
      client_milestone = 'Awaiting Specialist Parts';
      public_status_notes = 'Diagnostic complete. Specialist replacement components on order for follow-on attendance.';
      break;
    case 'SUBMITTED':
      client_milestone = 'Work Completed — Awaiting Quality Sign-Off';
      public_status_notes = 'On-site execution completed. Service report submitted for quality review.';
      break;
    case 'CORRECTION_REQUIRED':
      client_milestone = 'Work Completed — In Review';
      public_status_notes = 'Under technical review with EntireFM operations team.';
      break;
    case 'VALIDATED':
      client_milestone = 'Completed & Validated';
      public_status_notes = 'Service report verified and signed off by EntireFM Operations.';
      break;
    case 'CANCELLED':
      client_milestone = 'Cancelled';
      public_status_notes = 'Work order closed by client instruction or duplicate request.';
      break;
    default:
      client_milestone = 'Scheduled';
  }

  return {
    work_order_number: visit.job_pack.work_order_number,
    client_milestone,
    public_status_notes,
    site_name: visit.job_pack.site.name,
    asset_name: visit.job_pack.asset?.name,
    updated_at: visit.updated_at,
    is_client_visible: true,
  };
}

/**
 * Protected Service Report Document / PDF Generator
 * Strictly validates caller role, tenancy, and validation status.
 */
export async function generateServiceReportDocument(
  visitId: string,
  session: { personId?: string; orgId?: string; role: string }
): Promise<{ success: boolean; document?: Record<string, any>; error?: string }> {
  const visit = fieldOperationsStore.visits.get(visitId);
  if (!visit || !visit.service_report) {
    return { success: false, error: 'Service report not found' };
  }

  // Role & Tenant Security Checks
  if (session.role === 'FIELD_ENGINEER') {
    if (visit.assigned_engineer_id !== session.personId && !visit.additional_operatives?.some((o) => o.operative_id === session.personId)) {
      return { success: false, error: 'Unauthorised: You are not assigned to this service report' };
    }
  } else if (session.role === 'CONTRACTOR' || session.role === 'SUPPLIER_DISPATCHER') {
    if (visit.provider_org_id !== session.orgId) {
      return { success: false, error: 'Unauthorised: Report belongs to another supplier organisation' };
    }
  } else if (session.role === 'CLIENT') {
    // Client can only view validated reports
    if (visit.service_report.validation_status !== 'VALIDATED') {
      return { success: false, error: 'Service report is under operational review and not yet released to client' };
    }
  } else if (!['CEO', 'ADMINISTRATOR', 'OPERATIONS_MANAGER', 'ENTIREFM_ADMIN'].includes(session.role)) {
    return { success: false, error: 'Unauthorised: Insufficient privileges to generate service report document' };
  }

  const report = visit.service_report;
  const document = {
    document_title: 'EntireFM Digital Field Service Report',
    report_reference: report.report_number,
    revision: report.revision_number,
    generated_at: new Date().toISOString(),
    status: report.validation_status,
    header: {
      brand: 'EntireFM Facilities Management',
      client_name: report.client_name,
      contract_ref: visit.job_pack.client.contract_ref,
      supplier_organisation: 'Apex Thermal & Climate Engineering Ltd',
      lead_engineer: report.engineer_name,
      additional_engineers: visit.additional_operatives?.map((o) => `${o.operative_name} (${o.role_on_visit})`).join(', ') || 'None',
    },
    site_and_asset: {
      site_name: report.site_name,
      address: `${visit.job_pack.site.address_line1}, ${visit.job_pack.site.city}, ${visit.job_pack.site.postcode}`,
      asset_tag: visit.job_pack.asset?.asset_tag || 'N/A',
      asset_name: visit.job_pack.asset?.name || 'N/A',
      manufacturer: visit.job_pack.asset?.manufacturer || 'N/A',
      serial_number: visit.job_pack.asset?.serial_number || 'N/A',
    },
    attendance_timeline: {
      scheduled_time: visit.scheduled_time,
      journey_started: visit.journey_started_at,
      arrived_at: report.arrival_time,
      work_started: report.work_started_time,
      completed_at: report.completion_time,
    },
    ppm_readings: visit.ppm_tasks.map((t) => ({
      task: t.task_name,
      type: t.task_type,
      status: t.recorded_status || (t.recorded_measurement !== undefined ? `${t.recorded_measurement} ${t.measurement_unit}` : 'N/A'),
      out_of_tolerance: t.is_out_of_tolerance || false,
    })),
    work_completed: {
      narrative: report.work_completed_narrative,
      recommendations: report.engineer_recommendations,
      outcome: report.completion_outcome,
    },
    defects_reported: visit.defects.map((d) => ({
      title: d.title,
      severity: d.severity,
      make_safe: d.make_safe_status,
      stop_work: d.stop_work_triggered,
    })),
    parts_utilised: visit.parts_used.map((p) => ({
      part_name: p.part_name,
      part_number: p.part_number,
      quantity: p.quantity,
      status: p.is_installed ? 'Installed' : 'Awaiting Delivery',
    })),
    site_sign_off: report.site_signatory || { name: 'Unsigned / Pre-Validation' },
    entirefm_validation: {
      validated_by: report.validated_by || 'Pending Validation',
      validated_at: report.validated_at,
    },
  };

  return { success: true, document };
}

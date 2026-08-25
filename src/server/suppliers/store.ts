/**
 * ENTIREFM SUPPLIER STRATEGY & INTELLIGENCE REPOSITORY
 * ===================================================
 * Complete single source of truth for supplier strategy, target recruitment,
 * OEM relationships, technology innovators, and coverage targets.
 */

import {
  SupplierOrganisationRecord,
  SupplierTargetRecord,
  SupplierOemRecord,
  SupplierTechnologyRecord,
  CoverageTarget,
  SupplyChainGapAlert,
  RecruitmentRequirementRecord,
  SupplierAuditRecord,
  ExecutiveSupplyChainMetrics,
} from './types';
import { dbQuery } from '../db/client';
import { computeSupplyChainGaps, DEFAULT_COVERAGE_TARGETS } from './gap-engine';

class MemorySupplierStore {
  public organisations: Map<string, SupplierOrganisationRecord> = new Map();
  public targets: Map<string, SupplierTargetRecord> = new Map();
  public oems: Map<string, SupplierOemRecord> = new Map();
  public techPartners: Map<string, SupplierTechnologyRecord> = new Map();
  public coverageTargets: Map<string, CoverageTarget> = new Map();
  public recruitmentRequirements: Map<string, RecruitmentRequirementRecord> = new Map();
  public auditLogs: SupplierAuditRecord[] = [];

  constructor() {
    this.seedInitialTargetsAndOems();
    this.seedInitialCoverageTargets();
  }

  private seedInitialCoverageTargets() {
    for (const tgt of DEFAULT_COVERAGE_TARGETS) {
      this.coverageTargets.set(tgt.id, tgt);
    }
  }

  private seedInitialTargetsAndOems() {
    // Seed initial strategic targets (NOT approved suppliers; explicitly POTENTIAL TARGETS)
    const initialTargets: SupplierTargetRecord[] = [
      {
        id: 'tgt-001',
        company_name: 'Apex M&E Engineering Ltd',
        website_url: 'https://apexme.example.co.uk',
        supplier_types: ['REGIONAL_CONTRACTOR', 'SPECIALIST_CONTRACTOR'],
        services: ['Electrical Systems', 'HVAC & Chillers'],
        geography: ['Manchester', 'Leeds', 'Sheffield'],
        strategic_rationale: ['GEOGRAPHIC_GAP', '24_7_CAPABILITY', 'RESILIENCE'],
        priority: 'HIGH',
        target_status: 'DISCUSSION',
        key_contact_name: 'Sarah Jenkins (Commercial Director)',
        key_contact_email: 's.jenkins@apexme.example.co.uk',
        key_contact_phone: '0114 200 1234',
        last_contact_date: '2026-08-20',
        next_action: 'Issue Stage 2 Onboarding Assurance Questionnaire',
        owner: 'Procurement Desk',
        source: 'MANUAL_RESEARCH',
        notes: 'Strong 15-van commercial engineering footprint in South Yorkshire and Greater Manchester.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'tgt-002',
        company_name: 'Caledonian Environmental & Drainage',
        website_url: 'https://caledoniandrainage.example.co.uk',
        supplier_types: ['SPECIALIST_CONTRACTOR', 'LOCAL_SME'],
        services: ['Commercial Drainage', 'CCTV Drain Surveys', 'Interceptor Cleaning'],
        geography: ['Birmingham', 'West Midlands'],
        strategic_rationale: ['GEOGRAPHIC_GAP', '24_7_CAPABILITY', 'SINGLE_SUPPLIER_RISK'],
        priority: 'CRITICAL',
        target_status: 'RESEARCHING',
        key_contact_name: 'Marcus Bell',
        key_contact_email: 'm.bell@caledoniandrainage.example.co.uk',
        owner: 'Operations Manager',
        source: 'GAP_ALERT',
        notes: 'Identified to resolve single-supplier vulnerability for 24/7 drainage in Birmingham.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'tgt-003',
        company_name: 'Vanguard Rope Access & Façade Engineering',
        website_url: 'https://vanguardaccess.example.co.uk',
        supplier_types: ['SPECIALIST_CONTRACTOR'],
        services: ['Specialist Rope Access', 'Façade Inspection', 'BMU Cradle Maintenance'],
        geography: ['London', 'National Coverage'],
        strategic_rationale: ['SPECIALIST_COMPETENCY', 'NATIONAL_COVERAGE'],
        priority: 'HIGH',
        target_status: 'CONTACT_REQUIRED',
        owner: 'Technical Director',
        source: 'MANUAL_RESEARCH',
        notes: 'IRATA Member Company with 30 certified Level 3 operatives across high-rise assets.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const t of initialTargets) {
      this.targets.set(t.id, t);
    }

    // Seed OEM Framework Ecosystems (POTENTIAL TARGET & STRATEGIC RELATIONSHIPS)
    const initialOems: SupplierOemRecord[] = [
      {
        id: 'oem-001',
        brand_name: 'Daikin Applied UK',
        product_category: 'HVAC / Chillers & VRV',
        ecosystem_description: 'Global HVAC manufacturer specialising in VRV/VRF systems, commercial chillers, and air handling equipment.',
        relationship_level: 'COMMERCIAL_DISCUSSION',
        direct_support_available: true,
        approved_installer_access: true,
        technical_escalation_route: true,
        parts_access: true,
        training_availability: true,
        warranty_support: true,
        geographic_coverage: ['National UK Coverage'],
        strategic_notes: 'Seeking factory-approved service provider alignment for commercial client estates.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'oem-002',
        brand_name: 'Schneider Electric',
        product_category: 'BMS & Smart Building Controls',
        ecosystem_description: 'EcoStruxure architecture, building management controls, and smart energy sub-metering infrastructure.',
        relationship_level: 'APPROVED_SERVICE_RELATIONSHIP',
        direct_support_available: true,
        approved_installer_access: true,
        technical_escalation_route: true,
        parts_access: true,
        training_availability: true,
        warranty_support: true,
        geographic_coverage: ['National UK Coverage'],
        strategic_notes: 'Direct API integration into EntireCAFM telemetry stream for predictive maintenance.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'oem-003',
        brand_name: 'KONE Lifts & Escalators',
        product_category: 'Vertical Transportation',
        ecosystem_description: 'Commercial passenger and goods lift manufacturer with connected 24/7 telemetry and maintenance frameworks.',
        relationship_level: 'TARGET',
        direct_support_available: false,
        approved_installer_access: false,
        technical_escalation_route: false,
        parts_access: true,
        training_availability: false,
        warranty_support: true,
        geographic_coverage: ['National UK Coverage'],
        strategic_notes: 'Targeting OEM technical escalation agreement for KONE installations across retail portfolios.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const o of initialOems) {
      this.oems.set(o.id, o);
    }

    // Seed Technology Innovators
    const initialTech: SupplierTechnologyRecord[] = [
      {
        id: 'tech-001',
        company_name: 'VibeSense Telemetry Systems',
        technology_category: 'IOT_SENSORS',
        technology_summary: 'LoRaWAN tri-axial vibration and bearing temperature sensors for industrial pumps, AHUs, and chillers.',
        integration_opportunity: 'Real-time REST / MQTT webhook into EntireCAFM to trigger automatic dynamic SFG20 work orders.',
        client_use_case: 'Critical data centre and manufacturing plant uptime protection.',
        pilot_potential: 'HIGH',
        api_availability: true,
        commercial_model: 'SUBSCRIPTION',
        relationship_stage: 'POC_PILOT',
        strategic_priority: 'HIGH',
        contact_name: 'Dr. James Anderson',
        contact_email: 'j.anderson@vibesense.example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'tech-002',
        company_name: 'AeroThermal Drone Inspection Ltd',
        technology_category: 'DRONES',
        technology_summary: 'Sub-millimetre aerial photogrammetry and radiometric FLIR roof insulation thermography.',
        integration_opportunity: 'Direct CAD / BIM orthomosaic upload into EntireFM Asset 360 viewer.',
        client_use_case: 'Preventative roof membrane maintenance and solar PV hot-spot diagnostic audits.',
        pilot_potential: 'HIGH',
        api_availability: true,
        commercial_model: 'USAGE',
        relationship_stage: 'COMMERCIAL_PARTNER',
        strategic_priority: 'HIGH',
        contact_name: 'Liam Wright',
        contact_email: 'lwright@aerothermal.example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const tc of initialTech) {
      this.techPartners.set(tc.id, tc);
    }
  }
}

export const supplierMemoryStore = new MemorySupplierStore();

/**
 * Lists all supplier organisations with optional filters
 */
export async function listSupplierOrganisations(options: {
  serviceSlug?: string;
  relationshipLevel?: string;
  complianceStatus?: string;
  city?: string;
  isNational?: boolean;
  emergencyOnly?: boolean;
  search?: string;
} = {}): Promise<SupplierOrganisationRecord[]> {
  let list = Array.from(supplierMemoryStore.organisations.values());

  if (options.serviceSlug) {
    list = list.filter((s) => s.services.some((srv) => srv.service_slug === options.serviceSlug));
  }
  if (options.relationshipLevel) {
    list = list.filter((s) => s.relationship_level === options.relationshipLevel);
  }
  if (options.complianceStatus) {
    list = list.filter((s) => s.compliance_status === options.complianceStatus);
  }
  if (options.city) {
    const q = options.city.toLowerCase();
    list = list.filter(
      (s) =>
        s.is_national ||
        s.headquarters_city.toLowerCase() === q ||
        s.coverage.some((c) => c.boundary_value.toLowerCase().includes(q))
    );
  }
  if (options.isNational) {
    list = list.filter((s) => s.is_national);
  }
  if (options.emergencyOnly) {
    list = list.filter((s) => s.emergency_24_7 || s.coverage.some((c) => c.emergency_24_7));
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.legal_name.toLowerCase().includes(q) ||
        (s.trading_name && s.trading_name.toLowerCase().includes(q)) ||
        s.services.some((srv) => srv.service_name.toLowerCase().includes(q)) ||
        s.coverage.some((c) => c.boundary_value.toLowerCase().includes(q)) ||
        s.headquarters_city.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0));
}

/**
 * Get supplier organisation by ID
 */
export async function getSupplierOrganisation(id: string): Promise<SupplierOrganisationRecord | null> {
  return supplierMemoryStore.organisations.get(id) || null;
}

/**
 * Save / Update Supplier Organisation with duplicate check
 */
export async function saveSupplierOrganisation(
  supplier: Partial<SupplierOrganisationRecord> & { legal_name: string },
  actorId: string = 'system'
): Promise<{ success: boolean; supplier?: SupplierOrganisationRecord; error?: string; duplicateWarning?: string }> {
  // Duplicate check
  const existingByNumber = supplier.company_number
    ? Array.from(supplierMemoryStore.organisations.values()).find(
        (s) => s.company_number && s.company_number === supplier.company_number && s.id !== supplier.id
      )
    : null;

  const existingByName = Array.from(supplierMemoryStore.organisations.values()).find(
    (s) => s.legal_name.toLowerCase() === supplier.legal_name.toLowerCase() && s.id !== supplier.id
  );

  let duplicateWarning: string | undefined;
  if (existingByNumber || existingByName) {
    duplicateWarning = `Possible duplicate organisation detected: "${(existingByNumber || existingByName)?.legal_name}" (ID: ${(existingByNumber || existingByName)?.id}).`;
  }

  const id = supplier.id || `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const record: SupplierOrganisationRecord = {
    id,
    legal_name: supplier.legal_name,
    trading_name: supplier.trading_name,
    company_number: supplier.company_number,
    vat_number: supplier.vat_number,
    domain: supplier.domain,
    supplier_types: supplier.supplier_types || ['SPECIALIST_CONTRACTOR'],
    relationship_level: supplier.relationship_level || 'PROSPECT',
    compliance_status: supplier.compliance_status || 'NOT_ONBOARDED',
    risk_level: supplier.risk_level || 'MEDIUM',
    relationship_owner: supplier.relationship_owner,
    headquarters_city: supplier.headquarters_city || 'Sheffield',
    headquarters_postcode: supplier.headquarters_postcode || 'S9 2TT',
    full_address: supplier.full_address || 'Commercial Estate, UK',
    phone: supplier.phone || '0114 000 0000',
    email: supplier.email || 'info@supplier.example.co.uk',
    website_url: supplier.website_url,
    is_national: Boolean(supplier.is_national),
    emergency_24_7: Boolean(supplier.emergency_24_7),
    services: supplier.services || [],
    coverage: supplier.coverage || [],
    contacts: supplier.contacts || [],
    notes: supplier.notes,
    performance_score: supplier.performance_score || 85,
    first_time_fix_rate: supplier.first_time_fix_rate || 90,
    sla_adherence_rate: supplier.sla_adherence_rate || 95,
    created_at: supplier.created_at || now,
    updated_at: now,
  };

  const old = supplierMemoryStore.organisations.get(id);
  supplierMemoryStore.organisations.set(id, record);

  // Audit log
  supplierMemoryStore.auditLogs.push({
    id: `aud-${Date.now()}`,
    entity_type: 'ORGANISATION',
    entity_id: id,
    change_type: old ? 'UPDATE' : 'CREATE',
    changed_by: actorId,
    changed_at: now,
    old_value: old ? JSON.stringify({ rel: old.relationship_level, comp: old.compliance_status }) : undefined,
    new_value: JSON.stringify({ rel: record.relationship_level, comp: record.compliance_status }),
  });

  return { success: true, supplier: record, duplicateWarning };
}

/**
 * List Targets
 */
export async function listSupplierTargets(status?: string, priority?: string): Promise<SupplierTargetRecord[]> {
  let list = Array.from(supplierMemoryStore.targets.values());
  if (status) list = list.filter((t) => t.target_status === status);
  if (priority) list = list.filter((t) => t.priority === priority);
  return list.sort((a, b) => (b.priority === 'CRITICAL' ? 1 : -1));
}

/**
 * Save Target Partner
 */
export async function saveSupplierTarget(
  target: Partial<SupplierTargetRecord> & { company_name: string },
  actorId: string = 'system'
): Promise<SupplierTargetRecord> {
  const id = target.id || `tgt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const record: SupplierTargetRecord = {
    id,
    company_name: target.company_name,
    website_url: target.website_url,
    supplier_types: target.supplier_types || ['SPECIALIST_CONTRACTOR'],
    services: target.services || [],
    geography: target.geography || [],
    strategic_rationale: target.strategic_rationale || ['GEOGRAPHIC_GAP'],
    priority: target.priority || 'MEDIUM',
    target_status: target.target_status || 'IDENTIFIED',
    key_contact_name: target.key_contact_name,
    key_contact_email: target.key_contact_email,
    key_contact_phone: target.key_contact_phone,
    last_contact_date: target.last_contact_date,
    next_action: target.next_action,
    owner: target.owner || 'Procurement Desk',
    source: target.source || 'MANUAL_RESEARCH',
    notes: target.notes,
    created_at: target.created_at || now,
    updated_at: now,
  };
  supplierMemoryStore.targets.set(id, record);
  return record;
}

/**
 * List OEMs
 */
export async function listSupplierOems(): Promise<SupplierOemRecord[]> {
  return Array.from(supplierMemoryStore.oems.values());
}

/**
 * List Tech Partners
 */
export async function listSupplierTechPartners(): Promise<SupplierTechnologyRecord[]> {
  return Array.from(supplierMemoryStore.techPartners.values());
}

/**
 * Compute Supply Chain Gaps Live
 */
export async function getLiveSupplyChainGaps(): Promise<SupplyChainGapAlert[]> {
  const suppliers = Array.from(supplierMemoryStore.organisations.values());
  const targets = Array.from(supplierMemoryStore.coverageTargets.values());
  return computeSupplyChainGaps(suppliers, targets);
}

/**
 * Get Executive Metrics
 */
export async function getExecutiveSupplyChainMetrics(): Promise<ExecutiveSupplyChainMetrics> {
  const orgs = Array.from(supplierMemoryStore.organisations.values());
  const targets = Array.from(supplierMemoryStore.targets.values());
  const gaps = await getLiveSupplyChainGaps();

  const approved = orgs.filter((s) => s.relationship_level === 'APPROVED_SUPPLIER').length;
  const preferred = orgs.filter((s) => s.relationship_level === 'PREFERRED_SUPPLIER').length;
  const strategic = orgs.filter((s) => s.relationship_level === 'STRATEGIC_PARTNER').length;
  const underReview = orgs.filter((s) => s.compliance_status === 'UNDER_REVIEW').length;
  const unengagedTargets = targets.filter(
    (t) => t.target_status === 'IDENTIFIED' || t.target_status === 'RESEARCHING' || t.target_status === 'CONTACT_REQUIRED'
  ).length;

  return {
    totalOrganisations: orgs.length,
    approvedSuppliers: approved,
    preferredSuppliers: preferred,
    strategicPartners: strategic,
    suppliersUnderReview: underReview,
    activeApplications: 0, // Computed dynamically from lead store
    complianceIssues: orgs.filter((s) => s.compliance_status === 'COMPLIANCE_HOLD' || s.compliance_status === 'EXPIRED').length,
    expiringDocuments: 0,
    geographicCoverageGaps: gaps.filter((g) => g.gap_type === 'NO_APPROVED_SUPPLIER').length,
    capabilityGaps: gaps.filter((g) => g.gap_type === 'COVERAGE_DEFICIT').length,
    singleSupplierDependencies: gaps.filter((g) => g.gap_type === 'SINGLE_SUPPLIER_DEPENDENCY').length,
    strategicTargetsNotYetEngaged: unengagedTargets,
  };
}


import {
  SupplierOnboardingDraft,
  SupplierDocumentVaultItem,
  SupplierUserRecord,
  MaterialChangeProposal,
  SupplierSupportTicket,
  OperatingBaseRecord,
} from './types';

// In-Memory Drafts & Portal Data
const onboardingDrafts = new Map<string, SupplierOnboardingDraft>();
const supplierDocuments = new Map<string, SupplierDocumentVaultItem[]>();
const supplierUsers = new Map<string, SupplierUserRecord[]>();
const materialProposals = new Map<string, MaterialChangeProposal[]>();
const supportTickets = new Map<string, SupplierSupportTicket[]>();

// Seed default draft for demo / testing
const defaultDraftId = 'draft-sup-test-01';
onboardingDrafts.set('sup-test-01', {
  id: defaultDraftId,
  supplier_id: 'sup-test-01',
  application_reference: 'SUP-260825-9921',
  created_at: '2026-08-25T20:00:00Z',
  updated_at: '2026-08-25T21:30:00Z',
  status: 'DRAFT',
  current_step: 3,
  legal_company_name: 'Midlands Mechanical & HVAC Services Ltd',
  trading_name: 'Midlands HVAC Pro',
  company_number: '08923412',
  vat_number: 'GB982341290',
  website_url: 'https://midlandshvac.example.co.uk',
  year_established: 2014,
  employee_count_total: 18,
  registered_address: '14 Industrial Way, Aston, Birmingham, B6 7RH',
  trading_address: '14 Industrial Way, Aston, Birmingham, B6 7RH',
  main_phone: '0121 555 0192',
  general_email: 'info@midlandshvac.example.co.uk',
  primary_business_type: 'Regional Contractor',
  company_summary: 'Specialist commercial building engineering firm providing planned chiller maintenance, commercial gas boilers, and 24/7 reactive HVAC callout across the West Midlands.',
  contacts: [
    {
      id: 'cnt-01',
      first_name: 'David',
      last_name: 'Patterson',
      job_title: 'Managing Director',
      email: 'd.patterson@midlandshvac.example.co.uk',
      phone: '07700 900123',
      roles: ['PRIMARY', 'DIRECTOR', 'COMMERCIAL'],
    },
    {
      id: 'cnt-02',
      first_name: 'Sarah',
      last_name: 'Jenkins',
      job_title: 'Operations & Compliance Lead',
      email: 's.jenkins@midlandshvac.example.co.uk',
      phone: '07700 900124',
      roles: ['OPERATIONS', 'COMPLIANCE', 'EMERGENCY_24_7'],
    },
  ],
  selected_service_slugs: ['hvac', 'gas-heating'],
  service_details: {
    hvac: { years_experience: 12, engineer_count: 8, has_24_7_callout: true, specialist_notes: 'Daikin, Mitsubishi & Carrier VRV/Chiller specialist' },
    'gas-heating': { years_experience: 12, engineer_count: 6, has_24_7_callout: true, specialist_notes: 'Commercial Gas Safe registered' },
  },
  coverage_type: 'REGIONAL',
  selected_regions: ['Birmingham', 'Coventry', 'Wolverhampton', 'Leicester'],
  operating_bases: [
    {
      id: 'base-01',
      name: 'Birmingham Head Depot',
      address_line1: '14 Industrial Way, Aston',
      city: 'Birmingham',
      postcode: 'B6 7RH',
      radius_miles: 45,
      is_headquarters: true,
      services_offered: ['hvac', 'gas-heating'],
    },
  ],
  standard_operating_hours: '08:00 - 17:00 (Mon-Fri)',
  emergency_24_7_available: true,
  emergency_phone: '0800 555 9999',
  planned_maintenance_offered: true,
  reactive_maintenance_offered: true,
  project_works_offered: true,
  typical_emergency_sla_hours: 4,
  direct_field_operatives: 12,
  office_support_staff: 6,
  workforce_model: 'DIRECT_EMPLOYEES',
  uses_subcontractors: false,
  insurances: [
    {
      id: 'ins-01',
      insurance_type: 'PUBLIC_LIABILITY',
      insurer_name: 'Aviva Insurance Ltd',
      policy_number: 'AV-PL-889921',
      cover_limit_gbp: 10000000,
      expiry_date: '2027-04-30',
      document_name: 'Aviva_PL_10M_2026.pdf',
    },
    {
      id: 'ins-02',
      insurance_type: 'EMPLOYERS_LIABILITY',
      insurer_name: 'Aviva Insurance Ltd',
      policy_number: 'AV-EL-889922',
      cover_limit_gbp: 10000000,
      expiry_date: '2027-04-30',
      document_name: 'Aviva_EL_10M_2026.pdf',
    },
  ],
  accreditations: [
    {
      id: 'acc-01',
      accreditation_body: 'Gas Safe Register',
      certificate_number: 'GS-554921',
      issue_date: '2025-06-01',
      expiry_date: '2026-06-01',
      scope_description: 'Commercial Heating, Pipework & Plant',
      document_name: 'GasSafe_Cert_2025.pdf',
    },
    {
      id: 'acc-02',
      accreditation_body: 'REFCOM / F-Gas Company Certificate',
      certificate_number: 'REF-100921',
      issue_date: '2025-01-01',
      expiry_date: '2028-01-01',
      scope_description: 'Stationary Refrigeration, Air Conditioning & Heat Pump',
      document_name: 'REFCOM_Elite_2025.pdf',
    },
  ],
  has_hs_policy: true,
  has_competent_person: true,
  has_rams_templates: true,
  has_coshh_assessments: true,
  has_working_at_height_controls: true,
  has_material_incidents_past_3yr: false,
  anti_bribery_accepted: true,
  modern_slavery_policy_accepted: true,
  worker_welfare_standards_accepted: true,
  environmental_policy_accepted: true,
  requires_system_access: false,
  mfa_enforced: true,
  cyber_essentials_certified: true,
  gdpr_compliant_processes: true,
  uploaded_document_ids: ['doc-01', 'doc-02', 'doc-03'],
  accounts_payable_email: 'accounts@midlandshvac.example.co.uk',
  requires_po: true,
  bank_account_name: 'Midlands Mechanical & HVAC Services Ltd',
  bank_sort_code_masked: '••-••-42',
  bank_account_number_masked: '••••4821',
  code_of_conduct_accepted: true,
  code_of_conduct_version: '2026.1',
  code_of_conduct_accepted_by: 'David Patterson',
  code_of_conduct_accepted_at: '2026-08-25T21:00:00Z',
  truthfulness_declaration_accepted: true,
  step_states: {
    '1': { step_number: 1, step_key: 'company', title: 'Company Profile', status: 'COMPLETE' },
    '2': { step_number: 2, step_key: 'contacts', title: 'Contacts', status: 'COMPLETE' },
    '3': { step_number: 3, step_key: 'services', title: 'Services', status: 'IN_PROGRESS' },
  },
});

// Seed sample documents for vault
supplierDocuments.set('sup-test-01', [
  {
    id: 'doc-01',
    supplier_id: 'sup-test-01',
    document_type: 'Public Liability Insurance (£10m)',
    category: 'INSURANCE',
    file_name: 'Aviva_PL_10M_2026.pdf',
    file_size_kb: 480,
    uploaded_at: '2026-08-25T20:10:00Z',
    expiry_date: '2027-04-30',
    status: 'ACCEPTED',
    download_url: '/api/supplier/documents/doc-01',
  },
  {
    id: 'doc-02',
    supplier_id: 'sup-test-01',
    document_type: 'Gas Safe Company Certificate',
    category: 'ACCREDITATION',
    file_name: 'GasSafe_Cert_2025.pdf',
    file_size_kb: 320,
    uploaded_at: '2026-08-25T20:15:00Z',
    expiry_date: '2026-06-01',
    status: 'ACCEPTED',
    download_url: '/api/supplier/documents/doc-02',
  },
  {
    id: 'doc-03',
    supplier_id: 'sup-test-01',
    document_type: 'REFCOM Elite F-Gas Certificate',
    category: 'ACCREDITATION',
    file_name: 'REFCOM_Elite_2025.pdf',
    file_size_kb: 290,
    uploaded_at: '2026-08-25T20:20:00Z',
    expiry_date: '2028-01-01',
    status: 'ACCEPTED',
    download_url: '/api/supplier/documents/doc-03',
  },
]);

// Seed users
supplierUsers.set('sup-test-01', [
  {
    id: 'usr-01',
    supplier_id: 'sup-test-01',
    email: 'd.patterson@midlandshvac.example.co.uk',
    full_name: 'David Patterson',
    role: 'SUPPLIER_ADMIN',
    status: 'ACTIVE',
    created_at: '2026-08-25T20:00:00Z',
    last_login: '2026-08-25T21:45:00Z',
  },
  {
    id: 'usr-02',
    supplier_id: 'sup-test-01',
    email: 's.jenkins@midlandshvac.example.co.uk',
    full_name: 'Sarah Jenkins',
    role: 'OPERATIONS',
    status: 'ACTIVE',
    created_at: '2026-08-25T20:05:00Z',
    last_login: '2026-08-25T21:30:00Z',
  },
]);

/**
 * Check if company registration number or VAT is already registered
 */
export async function checkDuplicateOrganisation(companyNumber: string, vatNumber?: string): Promise<{ isDuplicate: boolean; matchType?: string }> {
  const normalisedCo = companyNumber.trim().toUpperCase();
  for (const draft of onboardingDrafts.values()) {
    if (draft.company_number.trim().toUpperCase() === normalisedCo) {
      return { isDuplicate: true, matchType: 'COMPANY_NUMBER' };
    }
    if (vatNumber && draft.vat_number && draft.vat_number.trim().toUpperCase() === vatNumber.trim().toUpperCase()) {
      return { isDuplicate: true, matchType: 'VAT_NUMBER' };
    }
  }
  return { isDuplicate: false };
}

/**
 * Get or create onboarding draft
 */
export async function getSupplierOnboardingDraft(supplierId: string): Promise<SupplierOnboardingDraft> {
  let draft = onboardingDrafts.get(supplierId);
  if (!draft) {
    const ref = `SUP-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    draft = {
      id: `draft-${Date.now()}`,
      supplier_id: supplierId,
      application_reference: ref,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'DRAFT',
      current_step: 1,
      legal_company_name: '',
      trading_name: '',
      company_number: '',
      vat_number: '',
      website_url: '',
      year_established: new Date().getFullYear(),
      employee_count_total: 1,
      registered_address: '',
      trading_address: '',
      main_phone: '',
      general_email: '',
      primary_business_type: 'Regional Contractor',
      company_summary: '',
      contacts: [],
      selected_service_slugs: [],
      service_details: {},
      coverage_type: 'REGIONAL',
      selected_regions: [],
      operating_bases: [],
      standard_operating_hours: '08:00 - 17:00 (Mon-Fri)',
      emergency_24_7_available: false,
      planned_maintenance_offered: true,
      reactive_maintenance_offered: true,
      project_works_offered: false,
      typical_emergency_sla_hours: 4,
      direct_field_operatives: 1,
      office_support_staff: 1,
      workforce_model: 'DIRECT_EMPLOYEES',
      uses_subcontractors: false,
      insurances: [],
      accreditations: [],
      has_hs_policy: false,
      has_competent_person: false,
      has_rams_templates: false,
      has_coshh_assessments: false,
      has_working_at_height_controls: false,
      has_material_incidents_past_3yr: false,
      anti_bribery_accepted: false,
      modern_slavery_policy_accepted: false,
      worker_welfare_standards_accepted: false,
      environmental_policy_accepted: false,
      requires_system_access: false,
      mfa_enforced: false,
      cyber_essentials_certified: false,
      gdpr_compliant_processes: false,
      uploaded_document_ids: [],
      accounts_payable_email: '',
      requires_po: true,
      bank_account_name: '',
      bank_sort_code_masked: '',
      bank_account_number_masked: '',
      code_of_conduct_accepted: false,
      code_of_conduct_version: '2026.1',
      code_of_conduct_accepted_by: '',
      truthfulness_declaration_accepted: false,
      step_states: {},
    };
    onboardingDrafts.set(supplierId, draft);
  }
  return draft;
}

/**
 * Save draft updates
 */
export async function saveSupplierOnboardingDraft(supplierId: string, updates: Partial<SupplierOnboardingDraft>): Promise<SupplierOnboardingDraft> {
  const existing = await getSupplierOnboardingDraft(supplierId);
  const updated: SupplierOnboardingDraft = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  onboardingDrafts.set(supplierId, updated);
  return updated;
}

/**
 * Submit full onboarding application
 */
export async function submitSupplierOnboardingApplication(supplierId: string): Promise<{ success: boolean; application_reference: string; error?: string }> {
  const draft = await getSupplierOnboardingDraft(supplierId);

  // Validate mandatory fields
  if (!draft.legal_company_name || !draft.company_number) {
    return { success: false, application_reference: draft.application_reference, error: 'Company Profile information is incomplete.' };
  }
  if (draft.selected_service_slugs.length === 0) {
    return { success: false, application_reference: draft.application_reference, error: 'At least one service discipline must be selected.' };
  }
  if (!draft.code_of_conduct_accepted || !draft.truthfulness_declaration_accepted) {
    return { success: false, application_reference: draft.application_reference, error: 'Mandatory declarations and Code of Conduct must be accepted.' };
  }

  draft.status = 'SUBMITTED';
  draft.submitted_at = new Date().toISOString();
  draft.updated_at = new Date().toISOString();
  onboardingDrafts.set(supplierId, draft);

  return { success: true, application_reference: draft.application_reference };
}

/**
 * List Vault Documents for a Supplier (Strict Organisation Isolation)
 */
export async function listSupplierVaultDocuments(supplierId: string): Promise<SupplierDocumentVaultItem[]> {
  return supplierDocuments.get(supplierId) || [];
}

/**
 * Replace a Vault Document
 */
export async function replaceSupplierVaultDocument(supplierId: string, documentId: string, newFileName: string, newFileSizeKb: number, newExpiryDate?: string): Promise<SupplierDocumentVaultItem | null> {
  const docs = supplierDocuments.get(supplierId) || [];
  const target = docs.find((d) => d.id === documentId);
  if (!target) return null;

  target.file_name = newFileName;
  target.file_size_kb = newFileSizeKb;
  target.uploaded_at = new Date().toISOString();
  if (newExpiryDate) target.expiry_date = newExpiryDate;
  target.status = 'SUBMITTED';
  target.rejection_reason = undefined;
  target.action_required = undefined;

  return target;
}

/**
 * List Supplier Portal Users
 */
export async function listSupplierPortalUsers(supplierId: string): Promise<SupplierUserRecord[]> {
  return supplierUsers.get(supplierId) || [];
}

/**
 * Invite new Supplier Portal User
 */
export async function inviteSupplierPortalUser(supplierId: string, email: string, fullName: string, role: SupplierUserRecord['role']): Promise<SupplierUserRecord> {
  const current = supplierUsers.get(supplierId) || [];
  const newUser: SupplierUserRecord = {
    id: `usr-${Date.now()}`,
    supplier_id: supplierId,
    email,
    full_name: fullName,
    role,
    status: 'INVITED',
    created_at: new Date().toISOString(),
  };
  current.push(newUser);
  supplierUsers.set(supplierId, current);
  return newUser;
}

/**
 * Submit Material Profile Change
 */
export async function submitMaterialProfileChange(supplierId: string, proposal: Omit<MaterialChangeProposal, 'id' | 'submitted_at' | 'status'>): Promise<MaterialChangeProposal> {
  const current = materialProposals.get(supplierId) || [];
  const rec: MaterialChangeProposal = {
    ...proposal,
    id: `prop-${Date.now()}`,
    submitted_at: new Date().toISOString(),
    status: 'PENDING_REVIEW',
  };
  current.push(rec);
  materialProposals.set(supplierId, current);
  return rec;
}

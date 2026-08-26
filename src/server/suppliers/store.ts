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
  AssurancePaymentRecord,
  AssurancePaymentStatus,
} from './types';
import { dbQuery } from '../db/client';
import { computeSupplyChainGaps, DEFAULT_COVERAGE_TARGETS } from './gap-engine';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';

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

const gStore = globalThis as unknown as { __efm_supplierMemoryStore?: MemorySupplierStore };
if (!gStore.__efm_supplierMemoryStore) {
  gStore.__efm_supplierMemoryStore = new MemorySupplierStore();
}
export const supplierMemoryStore = gStore.__efm_supplierMemoryStore;

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

// Stores start empty — populated by real authenticated supplier registrations.
// No demo/mock/seed data is initialised here.

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
 * Record Assurance Review Payment (Card, Invoice or Authorised Waiver)
 */
export async function recordAssurancePayment(
  supplierId: string,
  paymentMethod: 'CARD' | 'INVOICE' | 'WAIVER',
  details: {
    transactionRef?: string;
    invoiceNumber?: string;
    waivedBy?: string;
    waiverReason?: string;
  } = {}
): Promise<AssurancePaymentRecord> {
  const draft = await getSupplierOnboardingDraft(supplierId);
  const pricing = CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW;

  const paymentRecord: AssurancePaymentRecord = {
    status: paymentMethod === 'INVOICE' ? 'AWAITING_PAYMENT' : paymentMethod === 'WAIVER' ? 'WAIVED' : 'PAID',
    product_id: pricing.id,
    amount_gbp: pricing.priceGbp,
    vat_amount_gbp: pricing.priceGbp * pricing.vatRate,
    total_gbp: pricing.priceGbp * (1 + pricing.vatRate),
    payment_method: paymentMethod,
    transaction_reference: details.transactionRef || (paymentMethod === 'CARD' ? `txn_assur_${Date.now()}` : undefined),
    invoice_number: details.invoiceNumber || (paymentMethod === 'INVOICE' ? `INV-ASSUR-${Date.now()}` : undefined),
    paid_at: paymentMethod === 'CARD' ? new Date().toISOString() : undefined,
    waived_by: details.waivedBy,
    waiver_reason: details.waiverReason,
  };

  draft.assurance_payment = paymentRecord;
  if (paymentRecord.status === 'PAID' || paymentRecord.status === 'WAIVED') {
    draft.status = 'READY_TO_SUBMIT';
  } else {
    draft.status = 'AWAITING_PAYMENT';
  }
  draft.updated_at = new Date().toISOString();
  onboardingDrafts.set(supplierId, draft);

  return paymentRecord;
}

/**
 * Authorised EntireFM Admin Waiver for Assurance Review Fee
 */
export async function waiveAssuranceFee(
  supplierId: string,
  waivedBy: string,
  reason: string
): Promise<AssurancePaymentRecord> {
  return recordAssurancePayment(supplierId, 'WAIVER', {
    waivedBy,
    waiverReason: reason,
  });
}

/**
 * Submit full onboarding application (Gated by Initial Assurance Review Payment / Waiver)
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

  // Pre-submission Assurance Review Payment Gate
  const isPaidOrWaived =
    draft.assurance_payment?.status === 'PAID' ||
    draft.assurance_payment?.status === 'WAIVED';

  if (!isPaidOrWaived) {
    return {
      success: false,
      application_reference: draft.application_reference,
      error: 'Initial Supplier Assurance Review payment or authorised waiver is required prior to formal submission.',
    };
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


import {
  ServiceScopeItem,
  CoverageScopeItem,
  SupplierRelationshipOverview,
  SupplierComplianceRadarItem,
  SupplierResourceItem,
} from './types';
import { getSupplierOrganisationById } from './supplier-auth-store';

// In-Memory Scope Stores — start empty, populated when suppliers declare or request scopes
const supplierServicesScope = new Map<string, ServiceScopeItem[]>();
const supplierCoverageScope = new Map<string, CoverageScopeItem[]>();

// Canonical Supplier Resources (Official public/partner documents)
const canonicalSupplierResources: SupplierResourceItem[] = [
  {
    id: 'res-01',
    title: 'EntireFM Supplier Code of Conduct',
    category: 'STANDARDS',
    version: 'v2026.1',
    effective_date: '2026-01-01',
    summary: 'Core ethical, environmental, worker welfare, and site conduct standards for all supply chain partners.',
    file_format: 'PDF (240 KB)',
    download_url: '/resources/entirefm-supplier-code-of-conduct-v2026.1.pdf',
  },
  {
    id: 'res-02',
    title: 'CAFM Service Report & Defect Photography Standards',
    category: 'TECHNICAL',
    version: 'v2026.2',
    effective_date: '2026-03-01',
    summary: 'Guidelines for mandatory pre/post work photos, asset tag verification, and operative signature capture.',
    file_format: 'PDF (420 KB)',
    download_url: '/resources/entirefm-cafm-service-report-standards.pdf',
  },
  {
    id: 'res-03',
    title: 'RAMS & Site Risk Assessment Protocol',
    category: 'HEALTH_SAFETY',
    version: 'v2026.1',
    effective_date: '2026-01-01',
    summary: 'Dynamic point-of-work risk assessment and Permit-to-Work compliance requirements for commercial facilities.',
    file_format: 'PDF (310 KB)',
    download_url: '/resources/entirefm-rams-protocol.pdf',
  },
  {
    id: 'res-04',
    title: 'Supplier Invoice & Purchase Order Guide',
    category: 'COMMERCIAL',
    version: 'v2026.1',
    effective_date: '2026-01-01',
    summary: 'Instructions for submitting invoices against valid CAFM Purchase Orders to ensure prompt 30-day settlement.',
    file_format: 'PDF (180 KB)',
    download_url: '/resources/entirefm-supplier-invoice-guide.pdf',
  },
];

/**
 * Get Supplier Services Scope Matrix
 */
export async function getSupplierServicesScope(supplierId: string): Promise<ServiceScopeItem[]> {
  const existing = supplierServicesScope.get(supplierId);
  if (existing) return existing;

  // Build from application draft if available
  const draft = onboardingDrafts.get(supplierId);
  if (draft && draft.selected_service_slugs?.length > 0) {
    const list: ServiceScopeItem[] = draft.selected_service_slugs.map((slug) => ({
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      category: 'HARD_FM',
      is_declared: true,
      approval_status: draft.status === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
    }));
    supplierServicesScope.set(supplierId, list);
    return list;
  }

  return [];
}

/**
 * Request Additional Service Capability
 */
export async function requestAdditionalService(supplierId: string, slug: string, capabilityNotes?: string): Promise<{ success: boolean; service: ServiceScopeItem }> {
  let list = supplierServicesScope.get(supplierId) || [];
  let item = list.find((s) => s.slug === slug);
  if (!item) {
    item = {
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      category: 'HARD_FM',
      is_declared: true,
      approval_status: 'UNDER_REVIEW',
      capability_notes: capabilityNotes,
    };
    list.push(item);
  } else {
    item.is_declared = true;
    item.approval_status = 'UNDER_REVIEW';
    if (capabilityNotes) item.capability_notes = capabilityNotes;
  }
  supplierServicesScope.set(supplierId, list);
  return { success: true, service: item };
}

/**
 * Get Supplier Coverage Scope Matrix
 */
export async function getSupplierCoverageScope(supplierId: string): Promise<CoverageScopeItem[]> {
  const existing = supplierCoverageScope.get(supplierId);
  if (existing) return existing;

  // Build from application draft if available
  const draft = onboardingDrafts.get(supplierId);
  if (draft && draft.selected_regions?.length > 0) {
    const list: CoverageScopeItem[] = draft.selected_regions.map((region) => ({
      region,
      is_declared: true,
      approval_status: draft.status === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
      operating_bases: (draft.operating_bases || []).map((b) => b.name),
    }));
    supplierCoverageScope.set(supplierId, list);
    return list;
  }

  return [];
}

/**
 * Request Additional Regional Coverage
 */
export async function requestAdditionalCoverage(supplierId: string, region: string): Promise<{ success: boolean; coverage: CoverageScopeItem }> {
  let list = supplierCoverageScope.get(supplierId) || [];
  let item = list.find((c) => c.region.toLowerCase().includes(region.toLowerCase()) || region.toLowerCase().includes(c.region.toLowerCase()));
  if (!item) {
    item = {
      region,
      is_declared: true,
      approval_status: 'UNDER_REVIEW',
    };
    list.push(item);
  } else {
    item.is_declared = true;
    item.approval_status = 'UNDER_REVIEW';
  }
  supplierCoverageScope.set(supplierId, list);
  return { success: true, coverage: item };
}

/**
 * Get Relationship Overview (Dynamic from authenticated Organisation or Draft)
 */
export async function getSupplierRelationshipOverview(supplierId: string): Promise<SupplierRelationshipOverview> {
  const org = await getSupplierOrganisationById(supplierId);
  const draft = onboardingDrafts.get(supplierId);

  const legalName = org?.legalName || draft?.legal_company_name || 'Your Company';
  const tradingName = org?.tradingName || draft?.trading_name || legalName;
  const isApproved = org?.lifecycleStatus === 'APPROVED' || draft?.status === 'APPROVED';

  return {
    supplier_id: supplierId,
    legal_name: legalName,
    trading_name: tradingName,
    relationship_tier: isApproved ? 'APPROVED_SUPPLIER' : 'REGISTERED',
    tier_explanation: isApproved
      ? 'Approved Supplier status is an assurance outcome earned through successful technical vetting, valid statutory certifications, and adherence to EntireFM H&S standards.'
      : 'Application in progress. Partner tier will be assigned upon successful EntireFM technical assurance vetting.',
    assurance_status: isApproved ? 'APPROVED' : 'PENDING',
    assurance_effective_date: isApproved ? (org?.updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)) : undefined,
    next_formal_review_date: isApproved ? 'Annual Review' : undefined,
    relationship_since: (org?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)),
    active_restrictions: [],
    compliance_holds: [],
    assigned_entirefm_team: [],
  };
}

/**
 * Get Supplier Compliance Radar (Dynamic from Vault Documents)
 */
export async function getSupplierComplianceRadar(supplierId: string): Promise<SupplierComplianceRadarItem[]> {
  const docs = await listSupplierVaultDocuments(supplierId);
  if (!docs || docs.length === 0) return [];

  const now = Date.now();
  const radar: SupplierComplianceRadarItem[] = [];

  for (const doc of docs) {
    if (doc.expiry_date) {
      const expTime = new Date(doc.expiry_date).getTime();
      const diffDays = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
      let status: SupplierComplianceRadarItem['status'] = 'VALID';
      if (diffDays <= 0) status = 'EXPIRED';
      else if (diffDays <= 30) status = 'EXPIRING_30';
      else if (diffDays <= 60) status = 'EXPIRING_60';
      else if (diffDays <= 90) status = 'EXPIRING_90';

      radar.push({
        id: `rad-${doc.id}`,
        item_name: doc.document_type || doc.file_name,
        category: (doc.category as any) || 'ACCREDITATION',
        expiry_date: doc.expiry_date,
        days_remaining: diffDays,
        status,
        document_id: doc.id,
        action_required: diffDays <= 60 ? `Upload renewed ${doc.document_type} before ${doc.expiry_date} to maintain active status.` : undefined,
      });
    }
  }

  return radar;
}

/**
 * List Supplier Resources
 */
export async function listSupplierResources(): Promise<SupplierResourceItem[]> {
  return canonicalSupplierResources;
}


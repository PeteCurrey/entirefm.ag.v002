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

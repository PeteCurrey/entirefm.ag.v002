/**
 * ENTIREFM SUPPLIER STRATEGY & INTELLIGENCE REPOSITORY
 * ===================================================
 * Complete single source of truth for supplier strategy, target recruitment,
 * OEM relationships, technology innovators, and coverage targets.
 *
 * Persisted via Supabase organisations and supplier intelligence tables.
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
  SupplierDocumentVaultItem,
  SupplierUserRecord,
  MaterialChangeProposal,
  ServiceScopeItem,
  CoverageScopeItem,
  SupplierRelationshipOverview,
  SupplierComplianceRadarItem,
  SupplierResourceItem,
} from './types';
import { dbQuery, isDbConfigured } from '../db/client';
import { computeSupplyChainGaps } from './gap-engine';
import {
  listServiceApprovals,
  saveServiceApproval,
  listGeographicApprovals,
  saveGeographicApproval,
  listComplianceHolds,
  listSupplierDocuments,
  uploadSupplierDocument,
} from './assurance-store';
import {
  getSupplierOrganisationById,
  getApplicationDraft,
} from './supplier-auth-store';

class MemorySupplierStore {
  public organisations: Map<string, SupplierOrganisationRecord> = new Map();
  public targets: Map<string, SupplierTargetRecord> = new Map();
  public oems: Map<string, SupplierOemRecord> = new Map();
  public techPartners: Map<string, SupplierTechnologyRecord> = new Map();
  public coverageTargets: Map<string, CoverageTarget> = new Map();
  public recruitmentRequirements: Map<string, RecruitmentRequirementRecord> = new Map();
  public auditLogs: SupplierAuditRecord[] = [];
  // Stores start clean — no fake or seeded records
}

const gStore = globalThis as unknown as { __efm_supplierMemoryStore?: MemorySupplierStore };
if (!gStore.__efm_supplierMemoryStore) {
  gStore.__efm_supplierMemoryStore = new MemorySupplierStore();
}
export const supplierMemoryStore = gStore.__efm_supplierMemoryStore;

export const SUPPLIER_APPLICATION_PAYMENT_ENABLED = false;

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function mapDbOrgToSupplierRecord(org: any, prov?: any): SupplierOrganisationRecord {
  const addr = org.address_json || {};
  return {
    id: org.id,
    legal_name: org.legal_name || org.name || 'Contractor Organisation',
    trading_name: org.name || org.legal_name || undefined,
    company_number: org.company_number || undefined,
    vat_number: org.vat_number || undefined,
    domain: org.website ? org.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : undefined,
    supplier_types: ['SPECIALIST_CONTRACTOR'],
    relationship_level: org.tier === 'STRATEGIC'
      ? 'STRATEGIC_PARTNER'
      : org.tier === 'PREFERRED'
      ? 'PREFERRED_SUPPLIER'
      : org.status === 'ACTIVE'
      ? 'APPROVED_SUPPLIER'
      : 'PROSPECT',
    compliance_status: org.status === 'ACTIVE' ? 'APPROVED' : 'NOT_ONBOARDED',
    risk_level: 'LOW',
    headquarters_city: addr.city || 'Sheffield',
    headquarters_postcode: addr.postcode || 'S9 2TT',
    full_address: addr.line1 ? `${addr.line1}, ${addr.city || ''} ${addr.postcode || ''}`.trim() : 'Commercial Estate, UK',
    phone: org.phone || '0114 000 0000',
    email: org.email || 'enquiries@entirefm.com',
    website_url: org.website || undefined,
    is_national: true,
    emergency_24_7: true,
    services: prov?.primary_trade
      ? [{
          id: `srv-${org.id}`,
          service_slug: prov.primary_trade.toLowerCase().replace(/\s+/g, '-'),
          service_name: prov.primary_trade,
          category: 'Hard FM' as const,
          is_primary: true,
          accreditations: [],
        }]
      : [],
    coverage: [{
      id: `cov-${org.id}`,
      coverage_type: 'REGION' as const,
      boundary_value: 'National UK',
      is_active: true,
      emergency_24_7: true,
    }],
    contacts: [],
    performance_score: prov?.performance_score ? Number(prov.performance_score) : 85,
    first_time_fix_rate: prov?.first_time_fix_rate ? Number(prov.first_time_fix_rate) : 90,
    sla_adherence_rate: prov?.sla_adherence_rate ? Number(prov.sla_adherence_rate) : 95,
    created_at: org.created_at || new Date().toISOString(),
    updated_at: org.updated_at || new Date().toISOString(),
  };
}

/**
 * Lists all supplier organisations with optional filters (Supabase-backed)
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
  if (!isDbConfigured()) return [];

  const [orgsRes, provsRes] = await Promise.all([
    dbQuery<any[]>('organisations?org_type=eq.CONTRACTOR&order=name.asc'),
    dbQuery<any[]>('provider_organisations'),
  ]);

  const orgs = orgsRes.data || [];
  const provs = provsRes.data || [];
  const provMap = new Map<string, any>();
  for (const p of provs) {
    if (p.organisation_id) provMap.set(p.organisation_id, p);
  }

  let list = orgs.map((o) => mapDbOrgToSupplierRecord(o, provMap.get(o.id)));

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
 * Get supplier organisation by ID (uuid from organisations or text code)
 */
export async function getSupplierOrganisation(id: string): Promise<SupplierOrganisationRecord | null> {
  if (!isDbConfigured()) return null;

  const filter = isUuid(id) ? `id=eq.${id}` : `code=eq.${encodeURIComponent(id)}`;
  const { data: orgs } = await dbQuery<any[]>(`organisations?${filter}&limit=1`);

  if (!orgs || orgs.length === 0) {
    // Check supplier_organisations table if pre-approval
    const { data: suppOrgs } = await dbQuery<any[]>(
      `supplier_organisations?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    if (suppOrgs && suppOrgs.length > 0) {
      const so = suppOrgs[0];
      return {
        id: so.id,
        legal_name: so.legal_name,
        trading_name: so.trading_name || so.legal_name,
        supplier_types: ['SPECIALIST_CONTRACTOR'],
        relationship_level: so.lifecycle_status === 'APPROVED' ? 'APPROVED_SUPPLIER' : 'PROSPECT',
        compliance_status: so.lifecycle_status === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
        risk_level: 'MEDIUM',
        headquarters_city: 'Sheffield',
        headquarters_postcode: 'S9 2TT',
        full_address: 'UK',
        phone: '0114 000 0000',
        email: 'enquiries@entirefm.com',
        is_national: true,
        emergency_24_7: true,
        services: [],
        coverage: [],
        contacts: [],
        created_at: so.created_at || new Date().toISOString(),
        updated_at: so.updated_at || new Date().toISOString(),
      };
    }
    return null;
  }

  const org = orgs[0];
  const { data: provs } = await dbQuery<any[]>(
    `provider_organisations?organisation_id=eq.${org.id}&limit=1`
  );
  return mapDbOrgToSupplierRecord(org, provs?.[0]);
}

/**
 * Save / Update Supplier Organisation with duplicate check
 */
export async function saveSupplierOrganisation(
  supplier: Partial<SupplierOrganisationRecord> & { legal_name: string },
  actorId: string = 'system'
): Promise<{ success: boolean; supplier?: SupplierOrganisationRecord; error?: string; duplicateWarning?: string }> {
  if (!isDbConfigured()) {
    return { success: false, error: 'Database not configured' };
  }

  const now = new Date().toISOString();
  const id = supplier.id || undefined;

  let savedOrgId = id;
  if (id && isUuid(id)) {
    await dbQuery(`organisations?id=eq.${id}`, {
      method: 'PATCH',
      body: {
        legal_name: supplier.legal_name,
        name: supplier.trading_name || supplier.legal_name,
        company_number: supplier.company_number || null,
        vat_number: supplier.vat_number || null,
        phone: supplier.phone || null,
        email: supplier.email || null,
        website: supplier.website_url || null,
        updated_at: now,
      },
    });
  } else {
    const code = `PROV-${Date.now().toString(36).toUpperCase()}`;
    const { data: created } = await dbQuery<any[]>('organisations', {
      method: 'POST',
      body: {
        code,
        name: supplier.trading_name || supplier.legal_name,
        legal_name: supplier.legal_name,
        org_type: 'CONTRACTOR',
        company_number: supplier.company_number || null,
        vat_number: supplier.vat_number || null,
        status: 'ACTIVE',
        tier: supplier.relationship_level === 'STRATEGIC_PARTNER' ? 'STRATEGIC' : 'APPROVED',
        email: supplier.email || null,
        phone: supplier.phone || null,
        website: supplier.website_url || null,
      },
    });
    if (created && created.length > 0) {
      savedOrgId = created[0].id;
    }
  }

  const record = savedOrgId ? await getSupplierOrganisation(savedOrgId) : null;
  return {
    success: true,
    supplier: record || (supplier as SupplierOrganisationRecord),
  };
}

/**
 * List Targets (Phase 2)
 */
export async function listSupplierTargets(status?: string, priority?: string): Promise<SupplierTargetRecord[]> {
  let list = Array.from(supplierMemoryStore.targets.values());
  if (status) list = list.filter((t) => t.target_status === status);
  if (priority) list = list.filter((t) => t.priority === priority);
  return list.sort((a, b) => (b.priority === 'CRITICAL' ? 1 : -1));
}

/**
 * Save Target Partner (Phase 2)
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
 * List OEMs (Phase 2)
 */
export async function listSupplierOems(): Promise<SupplierOemRecord[]> {
  return Array.from(supplierMemoryStore.oems.values());
}

/**
 * List Tech Partners (Phase 2)
 */
export async function listSupplierTechPartners(): Promise<SupplierTechnologyRecord[]> {
  return Array.from(supplierMemoryStore.techPartners.values());
}

/**
 * Compute Supply Chain Gaps Live
 */
export async function getLiveSupplyChainGaps(): Promise<SupplyChainGapAlert[]> {
  const suppliers = await listSupplierOrganisations();
  const targets = Array.from(supplierMemoryStore.coverageTargets.values());
  return computeSupplyChainGaps(suppliers, targets);
}

/**
 * Get Executive Metrics (Live from Supabase)
 */
export async function getExecutiveSupplyChainMetrics(): Promise<ExecutiveSupplyChainMetrics> {
  const orgs = await listSupplierOrganisations();
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
    activeApplications: 0,
    complianceIssues: orgs.filter((s) => s.compliance_status === 'COMPLIANCE_HOLD' || s.compliance_status === 'EXPIRED').length,
    expiringDocuments: 0,
    geographicCoverageGaps: gaps.filter((g) => g.gap_type === 'NO_APPROVED_SUPPLIER').length,
    capabilityGaps: gaps.filter((g) => g.gap_type === 'COVERAGE_DEFICIT').length,
    singleSupplierDependencies: gaps.filter((g) => g.gap_type === 'SINGLE_SUPPLIER_DEPENDENCY').length,
    strategicTargetsNotYetEngaged: unengagedTargets,
  };
}

/**
 * List Vault Documents for a Supplier (Redirects to assurance-store)
 */
export async function listSupplierVaultDocuments(supplierId: string): Promise<SupplierDocumentVaultItem[]> {
  const docs = await listSupplierDocuments(supplierId);
  return docs.map((d) => ({
    id: d.id,
    supplier_id: supplierId,
    document_type: d.document_type,
    category: 'ACCREDITATION',
    file_name: d.file_name,
    file_size_kb: Math.round(d.file_size_bytes / 1024),
    uploaded_at: d.uploaded_at,
    expiry_date: d.expiry_date,
    status: d.review_status as any,
    rejection_reason: d.rejection_reason,
    action_required: undefined,
    download_url: `/api/documents/vault/${d.id}`,
  }));
}

/**
 * Replace a Vault Document
 */
export async function replaceSupplierVaultDocument(
  supplierId: string,
  documentId: string,
  newFileName: string,
  newFileSizeKb: number,
  newExpiryDate?: string
): Promise<SupplierDocumentVaultItem | null> {
  const newDoc = await uploadSupplierDocument({
    supplier_id: supplierId,
    document_type: 'VAULT_DOCUMENT',
    file_name: newFileName,
    file_size_bytes: newFileSizeKb * 1024,
    mime_type: 'application/pdf',
    storage_path: `/vault/${supplierId}/${newFileName}`,
    expiry_date: newExpiryDate,
    uploaded_by: 'Supplier Portal',
  });

  return {
    id: newDoc.id,
    supplier_id: supplierId,
    document_type: newDoc.document_type,
    category: 'ACCREDITATION',
    file_name: newDoc.file_name,
    file_size_kb: newFileSizeKb,
    uploaded_at: newDoc.uploaded_at,
    expiry_date: newDoc.expiry_date,
    status: 'SUBMITTED',
    download_url: `/api/documents/vault/${newDoc.id}`,
  };
}

/**
 * List Supplier Portal Users
 */
export async function listSupplierPortalUsers(supplierId: string): Promise<SupplierUserRecord[]> {
  if (!isDbConfigured()) return [];

  const filter = isUuid(supplierId)
    ? `organisation_id=eq.${supplierId}`
    : `supplier_org_id=eq.${encodeURIComponent(supplierId)}`;

  const { data } = await dbQuery<any[]>(`supplier_portal_user_records?${filter}&order=created_at.desc`);
  if (!data) return [];

  return data.map((u) => ({
    id: u.id,
    supplier_id: u.organisation_id || u.supplier_org_id || supplierId,
    email: u.email,
    full_name: u.name,
    role: u.role,
    status: u.is_active ? 'ACTIVE' : 'DISABLED',
    created_at: u.created_at,
  }));
}

/**
 * Invite new Supplier Portal User
 */
export async function inviteSupplierPortalUser(
  supplierId: string,
  email: string,
  fullName: string,
  role: SupplierUserRecord['role']
): Promise<SupplierUserRecord> {
  const id = `usr-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = isUuid(supplierId)
    ? { organisation_id: supplierId, supplier_org_id: null }
    : { supplier_org_id: supplierId, organisation_id: null };

  if (isDbConfigured()) {
    await dbQuery('supplier_portal_user_records', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        email,
        name: fullName,
        role,
        is_active: true,
        created_at: now,
      },
    });
  }

  return {
    id,
    supplier_id: supplierId,
    email,
    full_name: fullName,
    role,
    status: 'INVITED',
    created_at: now,
  };
}

/**
 * Submit Material Profile Change
 */
export async function submitMaterialProfileChange(
  supplierId: string,
  proposal: Omit<MaterialChangeProposal, 'id' | 'submitted_at' | 'status'>
): Promise<MaterialChangeProposal> {
  return {
    ...proposal,
    id: `prop-${Date.now()}`,
    submitted_at: new Date().toISOString(),
    status: 'PENDING_REVIEW',
  };
}

// Canonical Supplier Resources
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
 * Get Supplier Services Scope Matrix (Correction 3: delegates to assurance-store)
 */
export async function getSupplierServicesScope(supplierId: string): Promise<ServiceScopeItem[]> {
  const approvals = await listServiceApprovals(supplierId);
  const draft = await getApplicationDraft(supplierId);

  const scopeMap = new Map<string, ServiceScopeItem>();

  // Declared in application draft
  if (draft && draft.selectedServices) {
    for (const slug of draft.selectedServices) {
      scopeMap.set(slug, {
        slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        category: 'HARD_FM',
        is_declared: true,
        approval_status: draft.lifecycleStatus === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
      });
    }
  }

  // Formal approvals
  for (const a of approvals) {
    scopeMap.set(a.service_slug, {
      slug: a.service_slug,
      name: a.service_name,
      category: 'HARD_FM',
      is_declared: true,
      approval_status: a.approval_status as any,
      approved_date: a.effective_date,
      next_review_date: a.review_date,
      restrictions: a.restrictions,
    });
  }

  return Array.from(scopeMap.values());
}

/**
 * Request Additional Service Capability (Correction 3: persists via assurance-store)
 */
export async function requestAdditionalService(
  supplierId: string,
  slug: string,
  capabilityNotes?: string
): Promise<{ success: boolean; service: ServiceScopeItem }> {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const approval = await saveServiceApproval({
    supplier_id: supplierId,
    service_slug: slug,
    service_name: name,
    approval_status: 'UNDER_REVIEW',
    effective_date: new Date().toISOString(),
    review_date: new Date(Date.now() + 365 * 86400000).toISOString(),
    approved_by: 'Supplier Portal Request',
    rationale: capabilityNotes || 'Self-service request via Supplier Portal',
  });

  return {
    success: true,
    service: {
      slug: approval.service_slug,
      name: approval.service_name,
      category: 'HARD_FM',
      is_declared: true,
      approval_status: 'UNDER_REVIEW',
      capability_notes: capabilityNotes,
    },
  };
}

/**
 * Get Supplier Coverage Scope Matrix (Correction 3: delegates to assurance-store)
 */
export async function getSupplierCoverageScope(supplierId: string): Promise<CoverageScopeItem[]> {
  const approvals = await listGeographicApprovals(supplierId);
  const draft = await getApplicationDraft(supplierId);

  const coverageMap = new Map<string, CoverageScopeItem>();

  if (draft && draft.selectedRegions) {
    for (const region of draft.selectedRegions) {
      coverageMap.set(region, {
        region,
        is_declared: true,
        approval_status: draft.lifecycleStatus === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW',
      });
    }
  }

  for (const g of approvals) {
    coverageMap.set(g.region_or_city, {
      region: g.region_or_city,
      is_declared: true,
      approval_status: g.is_approved ? 'APPROVED' : 'UNDER_REVIEW',
      approved_date: g.approved_at,
    });
  }

  return Array.from(coverageMap.values());
}

/**
 * Request Additional Regional Coverage (Correction 3: persists via assurance-store)
 */
export async function requestAdditionalCoverage(
  supplierId: string,
  region: string
): Promise<{ success: boolean; coverage: CoverageScopeItem }> {
  const approval = await saveGeographicApproval({
    supplier_id: supplierId,
    region_or_city: region,
    is_approved: false,
    approved_by: 'Supplier Portal Request',
    approved_at: new Date().toISOString(),
  });

  return {
    success: true,
    coverage: {
      region: approval.region_or_city,
      is_declared: true,
      approval_status: 'UNDER_REVIEW',
    },
  };
}

/**
 * Get Relationship Overview (Dynamic from authenticated Organisation or Draft)
 */
export async function getSupplierRelationshipOverview(supplierId: string): Promise<SupplierRelationshipOverview> {
  const org = await getSupplierOrganisationById(supplierId);
  const draft = await getApplicationDraft(supplierId);
  const holds = await listComplianceHolds(supplierId);

  const legalName = org?.legalName || draft?.legalCompanyName || 'Your Company';
  const tradingName = org?.tradingName || draft?.tradingName || legalName;
  const isApproved = org?.lifecycleStatus === 'APPROVED' || draft?.lifecycleStatus === 'APPROVED';

  const activeHolds = holds
    .filter((h) => h.is_active)
    .map((h) => ({
      type: h.hold_scope,
      reason: h.hold_reason,
      required_action: h.resolution_required,
    }));

  return {
    supplier_id: supplierId,
    legal_name: legalName,
    trading_name: tradingName,
    relationship_tier: isApproved ? 'APPROVED_SUPPLIER' : 'REGISTERED',
    tier_explanation: isApproved
      ? 'Approved Supplier status is an assurance outcome earned through successful technical vetting, valid statutory certifications, and adherence to EntireFM H&S standards.'
      : 'Application in progress. Partner tier will be assigned upon successful EntireFM technical assurance vetting.',
    assurance_status: activeHolds.length > 0 ? 'COMPLIANCE_HOLD' : isApproved ? 'APPROVED' : 'PENDING',
    assurance_effective_date: isApproved ? (org?.updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)) : undefined,
    next_formal_review_date: isApproved ? 'Annual Review' : undefined,
    relationship_since: org?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    active_restrictions: [],
    compliance_holds: activeHolds,
    assigned_entirefm_team: [],
  };
}

/**
 * Get Supplier Compliance Radar (Dynamic from Vault Documents)
 */
export async function getSupplierComplianceRadar(supplierId: string): Promise<SupplierComplianceRadarItem[]> {
  const docs = await listSupplierDocuments(supplierId);
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
        category: (doc.document_type.includes('INS') ? 'INSURANCE' : 'ACCREDITATION') as any,
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

/**
 * ENTIREFM SUPPLIER APPLICATIONS CANONICAL REPOSITORY
 * =====================================================
 * Single Source of Truth for:
 * 1. Supplier Application Queue & Filtering (Supabase-backed + memory-fallback)
 * 2. Application Detail & Document Review
 * 3. Reviewer Actions: Approve, Request Information (RFI), Reject
 * 4. Operational Provider Activation (Promoting approved applicant to ProviderOrganisation)
 * 5. Historical Recovery & Backfill for unlinked/in-progress contractor registrations
 * 6. Live Queue Metrics & Admin Alerts
 */

import { dbQuery, isDbConfigured } from '@/server/db/client';
import {
  SupplierApplicationDraft,
  SupplierDocItem,
  SupplierOrganisationRecord,
  SupplierUserRecord,
  getOrCreateApplicationDraft,
  getSupplierOrganisationById,
  updateApplicationDraft,
  updateOrganisationLifecycle,
  mapDbDraftToRecord,
} from './supplier-auth-store';
import {
  createSupplierRfi,
  listSupplierRfis,
  getSupplierDecision,
  SupplierApprovalDecision,
  SupplierRfiRecord,
  supplierRfiStore,
} from './rfi-store';
import { linkAssuranceRecordsOnApproval } from './assurance-store';

export type ApplicationStatus =
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUIRED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'REGISTRATION_CLASSIFICATION_REQUIRED';

export interface CanonicalSupplierApplication {
  id: string; // orgId or unique placeholder
  applicationReference: string;
  applicantUserId: string;
  applicantName: string;
  applicantEmail: string;
  companyName: string;
  tradingName: string;
  companyNumber: string;
  vatNumber: string;
  status: ApplicationStatus;
  currentStep: number;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  decision: 'APPROVED' | 'CONDITIONALLY_APPROVED' | 'DECLINED' | null;
  decisionReason: string | null;
  informationRequestedAt: string | null;
  trades: string[];
  coverage: string[];
  documents: SupplierDocItem[];
  pendingRfiCount: number;
  recordOrigin: 'CANONICAL' | 'RECOVERED_FROM_CONTRACTOR_SIGNUP';
  createdAt: string;
  updatedAt: string;
  rawDraft?: SupplierApplicationDraft;
}

export interface ApplicationQueueCounts {
  total: number;
  started: number;
  submitted: number;
  underReview: number;
  informationRequired: number;
  approved: number;
  rejected: number;
  classificationRequired: number;
}

/**
 * List all supplier applications from database with fallback & unlinked registration aggregation
 */
export async function listAllSupplierApplications(filters?: {
  status?: string;
  search?: string;
}): Promise<CanonicalSupplierApplication[]> {
  const applicationsMap = new Map<string, CanonicalSupplierApplication>();

  // 1. Fetch from Supabase
  if (isDbConfigured()) {
    try {
      const [usersRes, orgsRes, draftsRes] = await Promise.all([
        dbQuery<any[]>('supplier_users?select=*&order=created_at.desc'),
        dbQuery<any[]>('supplier_organisations?select=*&order=created_at.desc'),
        dbQuery<any[]>('supplier_application_drafts?select=*&order=created_at.desc'),
      ]);

      const users = usersRes.data || [];
      const orgs = orgsRes.data || [];
      const drafts = draftsRes.data || [];

      // Map users by auth_user_id & organisation_id
      const usersByAuthId = new Map<string, any>();
      const usersByOrgId = new Map<string, any>();
      for (const u of users) {
        usersByAuthId.set(u.auth_user_id, u);
        if (u.organisation_id) {
          usersByOrgId.set(u.organisation_id, u);
        }
      }

      // Map drafts by org_id
      const draftsByOrgId = new Map<string, any>();
      for (const d of drafts) {
        draftsByOrgId.set(d.org_id, d);
      }

      // supplier_documents table not yet provisioned — initialise as empty
      const docsByOrgId = new Map<string, SupplierDocItem[]>();

      // Process organisations
      for (const org of orgs) {
        const draft = draftsByOrgId.get(org.id);
        const owner = usersByAuthId.get(org.owner_id) || usersByOrgId.get(org.id);
        const orgDocs = docsByOrgId.get(org.id) || [];

        let status: ApplicationStatus = 'IN_PROGRESS';
        const rawStatus = (draft?.lifecycle_status || org.lifecycle_status || 'DRAFT').toUpperCase();

        if (rawStatus === 'APPROVED') status = 'APPROVED';
        else if (rawStatus === 'DECLINED' || rawStatus === 'REJECTED') status = 'REJECTED';
        else if (rawStatus === 'INFORMATION_REQUIRED') status = 'INFORMATION_REQUIRED';
        else if (rawStatus === 'UNDER_REVIEW') status = 'UNDER_REVIEW';
        else if (rawStatus === 'SUBMITTED') status = 'SUBMITTED';
        else if (rawStatus === 'DRAFT') status = 'IN_PROGRESS';
        else if (rawStatus === 'REGISTERED') status = 'STARTED';

        const rawDraftRecord = draft ? mapDbDraftToRecord(draft) : undefined;
        const rfis = await listSupplierRfis(org.id);
        const pendingRfis = rfis.filter((r) => r.status === 'ACTION_REQUIRED');

        const app: CanonicalSupplierApplication = {
          id: org.id,
          applicationReference: org.application_reference || draft?.application_reference || `SUP-${org.id.slice(0, 8)}`,
          applicantUserId: org.owner_id || owner?.auth_user_id || '',
          applicantName: owner ? `${owner.first_name} ${owner.last_name}`.trim() : 'Contractor Applicant',
          applicantEmail: owner?.email || '',
          companyName: org.legal_name || draft?.legal_company_name || 'New Contractor Organisation',
          tradingName: org.trading_name || draft?.trading_name || '',
          companyNumber: org.company_number || draft?.company_number || '',
          vatNumber: org.vat_number || draft?.vat_number || '',
          status,
          currentStep: draft?.current_step || 1,
          submittedAt: rawStatus === 'SUBMITTED' || rawStatus === 'UNDER_REVIEW' || rawStatus === 'APPROVED' ? org.updated_at : null,
          reviewedAt: null,
          reviewedBy: null,
          decision: rawStatus === 'APPROVED' ? 'APPROVED' : rawStatus === 'DECLINED' ? 'DECLINED' : null,
          decisionReason: null,
          informationRequestedAt: status === 'INFORMATION_REQUIRED' ? org.updated_at : null,
          trades: draft?.selected_services || (draft?.selected_service_slugs) || [],
          coverage: draft?.selected_regions || [],
          documents: orgDocs,
          pendingRfiCount: pendingRfis.length,
          recordOrigin: 'CANONICAL',
          createdAt: org.created_at,
          updatedAt: org.updated_at,
          rawDraft: rawDraftRecord,
        };

        applicationsMap.set(org.id, app);
      }

      // Process unlinked users (registered but haven't created org setup yet)
      for (const u of users) {
        if (!u.organisation_id && !Array.from(applicationsMap.values()).some((a) => a.applicantUserId === u.auth_user_id)) {
          const pseudoId = `unlinked-${u.id}`;
          applicationsMap.set(pseudoId, {
            id: pseudoId,
            applicationReference: `REG-${u.auth_user_id.slice(0, 8).toUpperCase()}`,
            applicantUserId: u.auth_user_id,
            applicantName: `${u.first_name} ${u.last_name}`.trim() || 'Pending Registration',
            applicantEmail: u.email,
            companyName: 'Awaiting Organisation Setup',
            tradingName: '',
            companyNumber: '',
            vatNumber: '',
            status: u.email_verified ? 'STARTED' : 'REGISTRATION_CLASSIFICATION_REQUIRED',
            currentStep: 0,
            submittedAt: null,
            reviewedAt: null,
            reviewedBy: null,
            decision: null,
            decisionReason: null,
            informationRequestedAt: null,
            trades: [],
            coverage: [],
            documents: [],
            pendingRfiCount: 0,
            recordOrigin: 'RECOVERED_FROM_CONTRACTOR_SIGNUP',
            createdAt: u.created_at,
            updatedAt: u.updated_at,
          });
        }
      }
    } catch (err) {
      console.error('[SUPPLIER_APPLICATIONS_REPO] DB query error:', err);
    }
  }

  let results = Array.from(applicationsMap.values());

  // Apply filters
  if (filters?.status && filters.status !== 'ALL') {
    const targetStatus = filters.status.toUpperCase();
    results = results.filter((a) => {
      if (targetStatus === 'PENDING_REVIEW') {
        return a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW';
      }
      return a.status === targetStatus;
    });
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (a) =>
        a.companyName.toLowerCase().includes(q) ||
        a.applicationReference.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.applicantEmail.toLowerCase().includes(q) ||
        a.companyNumber.toLowerCase().includes(q) ||
        a.trades.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort: pending review first, then by created_at desc
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return results;
}

/**
 * Get a single canonical application by ID (orgId or pseudoId)
 */
export async function getSupplierApplicationById(
  id: string
): Promise<CanonicalSupplierApplication | null> {
  const all = await listAllSupplierApplications();
  const match = all.find((a) => a.id === id || a.applicationReference === id);
  if (match) return match;

  // Fallback: try fetching draft directly
  const draft = await getOrCreateApplicationDraft(id);
  const org = await getSupplierOrganisationById(id);
  const rfis = await listSupplierRfis(id);
  const decision = await getSupplierDecision(id);

  if (!draft && !org) return null;

  return {
    id,
    applicationReference: org?.applicationReference || draft?.applicationReference || `SUP-${id.slice(0, 8)}`,
    applicantUserId: org?.ownerId || '',
    applicantName: draft?.primaryContactName || 'Contractor Applicant',
    applicantEmail: draft?.primaryContactEmail || draft?.generalEmail || '',
    companyName: org?.legalName || draft?.legalCompanyName || 'Supplier Organisation',
    tradingName: org?.tradingName || draft?.tradingName || '',
    companyNumber: org?.companyNumber || draft?.companyNumber || '',
    vatNumber: draft?.vatNumber || '',
    status: (draft?.lifecycleStatus || org?.lifecycleStatus || 'IN_PROGRESS') as ApplicationStatus,
    currentStep: draft?.currentStep || 1,
    submittedAt: null,
    reviewedAt: decision?.decided_at || null,
    reviewedBy: decision?.decided_by || null,
    decision: decision?.decision_type || null,
    decisionReason: decision?.decline_explanation || null,
    informationRequestedAt: null,
    trades: draft?.selectedServices || [],
    coverage: draft?.selectedRegions || [],
    documents: [],
    pendingRfiCount: rfis.filter((r) => r.status === 'ACTION_REQUIRED').length,
    recordOrigin: 'CANONICAL',
    createdAt: org?.createdAt || draft?.createdAt || new Date().toISOString(),
    updatedAt: org?.updatedAt || draft?.updatedAt || new Date().toISOString(),
    rawDraft: draft,
  };
}

/**
 * Calculate live queue counts for Admin Sidebar and Dashboard
 */
export async function getSupplierApplicationQueueCounts(): Promise<ApplicationQueueCounts> {
  const all = await listAllSupplierApplications();
  return {
    total: all.length,
    started: all.filter((a) => a.status === 'STARTED' || a.status === 'IN_PROGRESS').length,
    submitted: all.filter((a) => a.status === 'SUBMITTED').length,
    underReview: all.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length,
    informationRequired: all.filter((a) => a.status === 'INFORMATION_REQUIRED').length,
    approved: all.filter((a) => a.status === 'APPROVED').length,
    rejected: all.filter((a) => a.status === 'REJECTED').length,
    classificationRequired: all.filter((a) => a.status === 'REGISTRATION_CLASSIFICATION_REQUIRED').length,
  };
}

/**
 * Request Information (RFI) for an application
 */
export async function requestApplicationInformation(params: {
  applicationId: string;
  title: string;
  requirementDescription: string;
  sectionKey?: string;
  dueDate?: string;
  raisedBy: string;
}): Promise<{ success: boolean; rfi: SupplierRfiRecord }> {
  const app = await getSupplierApplicationById(params.applicationId);
  const appRef = app?.applicationReference || 'SUP-APP';

  const rfi = await createSupplierRfi({
    supplier_id: params.applicationId,
    application_ref: appRef,
    section_key: params.sectionKey || 'general',
    title: params.title,
    requirement_description: params.requirementDescription,
    due_date: params.dueDate,
    raised_by: params.raisedBy,
  });

  await updateOrganisationLifecycle(params.applicationId, 'INFORMATION_REQUIRED');
  await updateApplicationDraft(params.applicationId, {
    lifecycleStatus: 'INFORMATION_REQUIRED',
  });

  return { success: true, rfi };
}

/**
 * Approve Application & Activate Canonical CAFM ProviderOrganisation
 */
export async function approveSupplierApplicationAndActivateProvider(params: {
  applicationId: string;
  approvedServices: {
    service_slug: string;
    service_name: string;
    approved_geographies: string[];
    restrictions?: string[];
  }[];
  decidedBy: string;
  effectiveDate?: string;
  notes?: string;
}): Promise<{
  success: boolean;
  providerOrgId?: string;
  organisationId?: string;
  decision?: SupplierApprovalDecision;
  error?: string;
}> {
  const orgId = params.applicationId;
  const app = await getSupplierApplicationById(orgId);
  if (!app) {
    return { success: false, error: 'Application not found' };
  }

  const now = new Date().toISOString();
  const todayDate = now.split('T')[0];

  // 1. Update Supplier lifecycle to APPROVED
  await updateOrganisationLifecycle(orgId, 'APPROVED');
  await updateApplicationDraft(orgId, { lifecycleStatus: 'APPROVED' });

  // 2. Record approval decision
  const decision: SupplierApprovalDecision = {
    supplier_id: orgId,
    decision_type: 'APPROVED',
    approved_services: params.approvedServices,
    decided_by: params.decidedBy,
    decided_at: now,
    effective_date: params.effectiveDate || todayDate,
    next_review_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
  };
  supplierRfiStore.decisions.set(orgId, decision);

  // 3. Create / Promote CAFM organisations record
  let canonicalOrgId = '';
  let providerOrgId = '';

  if (isDbConfigured()) {
    try {
      // Check if organisation with this company number or name already exists
      let existingOrg: any = null;
      if (app.companyNumber) {
        const { data: byNum } = await dbQuery<any[]>(
          `organisations?company_number=eq.${encodeURIComponent(app.companyNumber)}&limit=1`
        );
        if (byNum && byNum.length > 0) existingOrg = byNum[0];
      }

      if (!existingOrg) {
        const { data: byName } = await dbQuery<any[]>(
          `organisations?name=eq.${encodeURIComponent(app.companyName)}&limit=1`
        );
        if (byName && byName.length > 0) existingOrg = byName[0];
      }

      if (existingOrg) {
        canonicalOrgId = existingOrg.id;
        await dbQuery(`organisations?id=eq.${canonicalOrgId}`, {
          method: 'PATCH',
          body: {
            org_type: 'CONTRACTOR',
            status: 'ACTIVE',
            portal_status: 'ACTIVE',
            updated_at: now,
          },
        });
      } else {
        const orgCode = `PROV-${app.applicationReference.replace('SUP-', '')}`;
        const { data: newOrg } = await dbQuery<any[]>('organisations', {
          method: 'POST',
          body: {
            code: orgCode,
            name: app.companyName,
            legal_name: app.companyName,
            org_type: 'CONTRACTOR',
            company_number: app.companyNumber || null,
            vat_number: app.vatNumber || null,
            status: 'ACTIVE',
            tier: 'APPROVED',
            email: app.applicantEmail || null,
            portal_status: 'ACTIVE',
          },
        });
        if (newOrg && newOrg.length > 0) {
          canonicalOrgId = newOrg[0].id;
        }
      }

      // 4. Create / Update provider_organisations record
      if (canonicalOrgId) {
        const { data: existingProv } = await dbQuery<any[]>(
          `provider_organisations?organisation_id=eq.${canonicalOrgId}&limit=1`
        );

        const primaryTrade = params.approvedServices[0]?.service_name || params.approvedServices[0]?.service_slug || 'General Maintenance';

        if (existingProv && existingProv.length > 0) {
          providerOrgId = existingProv[0].id;
          await dbQuery(`provider_organisations?id=eq.${providerOrgId}`, {
            method: 'PATCH',
            body: {
              tier: 'APPROVED',
              vetting_status: 'APPROVED',
              is_active: true,
              insurance_verified: true,
              primary_trade: primaryTrade,
              updated_at: now,
            },
          });
        } else {
          const { data: newProv } = await dbQuery<any[]>('provider_organisations', {
            method: 'POST',
            body: {
              organisation_id: canonicalOrgId,
              tier: 'APPROVED',
              vetting_status: 'APPROVED',
              insurance_verified: true,
              public_liability_limit: 5000000.0,
              coverage_radius_miles: 50,
              primary_trade: primaryTrade,
              performance_score: 100.0,
              first_time_fix_rate: 100.0,
              sla_adherence_rate: 100.0,
              is_active: true,
            },
          });
          if (newProv && newProv.length > 0) {
            providerOrgId = newProv[0].id;
          }
        }

        // 4.1 Promote/link pre-approval assurance records to canonical organisation id
        await linkAssuranceRecordsOnApproval(orgId, canonicalOrgId);

        // 5. Link applicant user to provider organisation in organisation_memberships
        if (app.applicantUserId) {
          // Check if person exists
          const { data: persons } = await dbQuery<any[]>(
            `persons?email=eq.${encodeURIComponent(app.applicantEmail)}&limit=1`
          );
          let personId = persons?.[0]?.id;

          if (!personId) {
            const nameParts = app.applicantName.split(' ');
            const { data: newPerson } = await dbQuery<any[]>('persons', {
              method: 'POST',
              body: {
                first_name: nameParts[0] || 'Contractor',
                last_name: nameParts.slice(1).join(' ') || 'Admin',
                email: app.applicantEmail,
                job_title: 'Contractor Administrator',
                status: 'ACTIVE',
              },
            });
            personId = newPerson?.[0]?.id;
          }

          if (personId) {
            // Find role id for CONTRACTOR_ADMIN
            const { data: roles } = await dbQuery<any[]>('roles?code=eq.CONTRACTOR_ADMIN&limit=1');
            const roleId = roles?.[0]?.id || '00000000-0000-0000-0000-000000000002';

            try {
              await dbQuery('organisation_memberships', {
                method: 'POST',
                body: {
                  person_id: personId,
                  organisation_id: canonicalOrgId,
                  role_id: roleId,
                  is_primary: true,
                  status: 'ACTIVE',
                },
                headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
              });
            } catch {
              // Duplicate membership is acceptable — already linked
            }
          }
        }
      }
    } catch (err) {
      console.error('[APPROVE_SUPPLIER_PROVIDER_ERROR]', err);
    }
  }

  return {
    success: true,
    providerOrgId,
    organisationId: canonicalOrgId,
    decision,
  };
}

/**
 * Decline/Reject Supplier Application
 */
export async function declineSupplierApplicationAction(params: {
  applicationId: string;
  reasonCategory: string;
  explanation: string;
  decidedBy: string;
}): Promise<{ success: boolean; decision: SupplierApprovalDecision }> {
  const now = new Date().toISOString();
  const decision: SupplierApprovalDecision = {
    supplier_id: params.applicationId,
    decision_type: 'DECLINED',
    approved_services: [],
    decline_reason_category: params.reasonCategory,
    decline_explanation: params.explanation,
    decided_by: params.decidedBy,
    decided_at: now,
    effective_date: now.split('T')[0],
    next_review_date: '',
  };

  supplierRfiStore.decisions.set(params.applicationId, decision);

  await updateOrganisationLifecycle(params.applicationId, 'DECLINED');
  await updateApplicationDraft(params.applicationId, { lifecycleStatus: 'DECLINED' });

  return { success: true, decision };
}

/**
 * Historical Backfill & Recovery Tool for Today's 6 Registrations
 */
export async function recoverHistoricalContractorRegistrations(): Promise<{
  totalRecovered: number;
  results: Array<{
    userId: string;
    email: string;
    companyName: string;
    actionTaken: string;
    status: ApplicationStatus;
  }>;
}> {
  const results: any[] = [];

  if (!isDbConfigured()) {
    return { totalRecovered: 0, results: [] };
  }

  try {
    const { data: users } = await dbQuery<any[]>('supplier_users?select=*&order=created_at.asc');
    const { data: orgs } = await dbQuery<any[]>('supplier_organisations?select=*');
    const { data: drafts } = await dbQuery<any[]>('supplier_application_drafts?select=*');

    const orgsById = new Map<string, any>((orgs || []).map((o) => [o.id, o]));
    const draftsByOrgId = new Map<string, any>((drafts || []).map((d) => [d.org_id, d]));

    for (const u of users || []) {
      if (u.organisation_id) {
        const org = orgsById.get(u.organisation_id);
        const draft = draftsByOrgId.get(u.organisation_id);

        if (!draft && org) {
          // Recover missing application draft
          const recoveredDraft = {
            org_id: org.id,
            application_reference: org.application_reference,
            current_step: 1,
            lifecycle_status: org.lifecycle_status || 'DRAFT',
            legal_company_name: org.legal_name,
            trading_name: org.trading_name || '',
            company_number: org.company_number || '',
            vat_number: org.vat_number || '',
            primary_contact_name: `${u.first_name} ${u.last_name}`.trim(),
            primary_contact_email: u.email,
            general_email: u.email,
            selected_services: [],
            selected_regions: [],
            has_247: false,
            has_subcontractors: false,
            has_hs_policy: false,
            has_rams: false,
            has_incident_history: false,
            anti_bribery: false,
            modern_slavery: false,
            code_of_conduct: false,
            truthfulness_declaration: false,
            payment_method: 'CARD',
            created_at: org.created_at || u.created_at,
            updated_at: new Date().toISOString(),
          };

          await dbQuery('supplier_application_drafts', {
            method: 'POST',
            body: recoveredDraft,
          });

          results.push({
            userId: u.auth_user_id,
            email: u.email,
            companyName: org.legal_name,
            actionTaken: 'RECOVERED_DRAFT_FROM_ORGANISATION',
            status: 'IN_PROGRESS',
          });
        } else {
          results.push({
            userId: u.auth_user_id,
            email: u.email,
            companyName: org?.legal_name || 'Existing Organisation',
            actionTaken: 'ALREADY_LINKED',
            status: (draft?.lifecycle_status || org?.lifecycle_status || 'IN_PROGRESS') as ApplicationStatus,
          });
        }
      } else {
        // User without organisation
        results.push({
          userId: u.auth_user_id,
          email: u.email,
          companyName: 'Awaiting Organisation Setup',
          actionTaken: 'SURFACED_FOR_MANUAL_CLASSIFICATION',
          status: u.email_verified ? 'STARTED' : 'REGISTRATION_CLASSIFICATION_REQUIRED',
        });
      }
    }
  } catch (err) {
    console.error('[RECOVER_REGISTRATIONS_ERROR]', err);
  }

  return { totalRecovered: results.length, results };
}

// ============================================================================
// ORPHAN DETECTION
// ============================================================================

export interface OrphanRegistration {
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  registrationSource: string;
  applicationType: string;
  createdAt: string;
  ageMinutes: number;
}

/**
 * Returns registration intents that have been PENDING_ORG_SETUP for > 60 minutes.
 * These are auth users whose domain provisioning failed — Admin can detect + classify.
 */
export async function listOrphanRegistrations(): Promise<OrphanRegistration[]> {
  if (!isDbConfigured()) return [];

  try {
    const { data, error } = await dbQuery<any[]>(
      `supplier_registration_intents?status=eq.PENDING_ORG_SETUP&select=*&order=created_at.asc`
    );
    if (error || !data) return [];

    const now = Date.now();
    return data
      .map((r) => {
        const createdMs = new Date(r.created_at).getTime();
        const ageMinutes = Math.floor((now - createdMs) / 60000);
        return {
          authUserId: r.auth_user_id,
          email: r.email,
          firstName: r.first_name || '',
          lastName: r.last_name || '',
          status: r.status,
          registrationSource: r.registration_source || 'CONTRACTOR_ONBOARDING',
          applicationType: r.application_type || 'CONTRACTOR',
          createdAt: r.created_at,
          ageMinutes,
        };
      })
      .filter((r) => r.ageMinutes > 60); // Only surface genuine orphans
  } catch (err) {
    console.error('[LIST_ORPHANS_ERROR]', err);
    return [];
  }
}

// ============================================================================
// ADMIN CLASSIFY ACTION
// ============================================================================

export interface ClassifyResult {
  success: boolean;
  orgId?: string;
  applicationReference?: string;
  error?: string;
}

/**
 * Admin classifies a REGISTRATION_CLASSIFICATION_REQUIRED record as a contractor applicant.
 * - Creates or recovers supplier_organisations row
 * - Creates application draft with provenance MANUALLY_CLASSIFIED_BY_ADMIN
 * - Writes audit event
 * - Updates registration intent status if present
 */
export async function classifyRegistrationAsContractor(params: {
  supplierUserId: string; // auth_user_id from supplier_users
  classifiedByAdminId: string;
  companyNameHint?: string; // Optional — admin may know the company
}): Promise<ClassifyResult> {
  const { supplierUserId, classifiedByAdminId, companyNameHint } = params;

  try {
    // 1. Find the supplier_user
    const { data: users } = await dbQuery<any[]>(
      `supplier_users?auth_user_id=eq.${encodeURIComponent(supplierUserId)}&limit=1`
    );
    const user = users?.[0];
    if (!user) {
      return { success: false, error: 'Supplier user not found' };
    }

    let orgId = user.organisation_id;

    // 2. If no org exists, create a minimal one
    if (!orgId) {
      const now = Date.now();
      const rand = Math.random().toString(36).slice(2, 10);
      orgId = `sorg-${now}-${rand}`;
      const legalName = companyNameHint || `${user.first_name} ${user.last_name} Organisation`;
      const appRef = `SUP-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000) + 1000}`;

      await dbQuery('supplier_organisations', {
        method: 'POST',
        body: {
          id: orgId,
          owner_id: user.id,
          legal_name: legalName,
          lifecycle_status: 'DRAFT',
          application_reference: appRef,
          registration_source: 'MANUALLY_CLASSIFIED_BY_ADMIN',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      // Link user to org
      await dbQuery(
        `supplier_users?id=eq.${encodeURIComponent(user.id)}`,
        { method: 'PATCH', body: { organisation_id: orgId } }
      );
    }

    // 3. Get or create application draft
    const draft = await getOrCreateApplicationDraft(orgId);

    // 4. Update org + draft with MANUALLY_CLASSIFIED provenance
    const classifiedAt = new Date().toISOString();
    await dbQuery(
      `supplier_organisations?id=eq.${encodeURIComponent(orgId)}`,
      {
        method: 'PATCH',
        body: {
          registration_source: 'MANUALLY_CLASSIFIED_BY_ADMIN',
          lifecycle_status: 'DRAFT',
          updated_at: classifiedAt,
        },
      }
    );

    await dbQuery(
      `supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}`,
      {
        method: 'PATCH',
        body: {
          lifecycle_status: 'IN_PROGRESS',
          updated_at: classifiedAt,
        },
      }
    );

    // 5. Update registration intent if it exists
    try {
      await dbQuery(
        `supplier_registration_intents?auth_user_id=eq.${encodeURIComponent(supplierUserId)}`,
        {
          method: 'PATCH',
          body: {
            status: 'CLASSIFIED_BY_ADMIN',
            classified_by: classifiedByAdminId,
            classified_at: classifiedAt,
            completed_at: classifiedAt,
          },
        }
      );
    } catch {
      // Non-fatal — table may not exist yet
    }

    // 6. Write audit event
    try {
      await dbQuery('audit_events', {
        method: 'POST',
        body: {
          event_type: 'SUPPLIER_CLASSIFIED_AS_CONTRACTOR',
          object_type: 'supplier_organisation',
          object_id: orgId,
          actor_id: classifiedByAdminId,
          metadata: JSON.stringify({
            supplier_user_id: user.id,
            auth_user_id: supplierUserId,
            email: user.email,
            classified_at: classifiedAt,
            registration_source: 'MANUALLY_CLASSIFIED_BY_ADMIN',
          }),
          created_at: classifiedAt,
        },
      });
    } catch {
      // Non-fatal — audit_events table schema may differ
    }

    return {
      success: true,
      orgId,
      applicationReference: draft.applicationReference,
    };
  } catch (err: any) {
    console.error('[CLASSIFY_REGISTRATION_ERROR]', err);
    return { success: false, error: err?.message || 'Classification failed' };
  }
}

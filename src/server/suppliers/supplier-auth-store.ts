/**
 * ENTIREFM SUPPLIER DOMAIN & ORGANISATION REPOSITORY
 * ====================================================
 * Canonical Source of Truth for:
 * 1. Supplier Domain User records (linked to canonical Supabase Auth user UUIDs)
 * 2. Supplier Organisations & multi-tenant isolation
 * 3. Supplier Application Drafts & Lifecycle states
 * 4. Supplier Invitations & Team RBAC
 * 5. Lifecycle-aware resume routing & portal status presentation
 *
 * PERSISTENCE ARCHITECTURE:
 * Persisted durably to Supabase via PostgREST (dbQuery).
 * In-memory global store is maintained as an active read-through cache
 * and zero-downtime offline fallback.
 *
 * NON-NEGOTIABLE SECURITY INVARIANT:
 * This store NEVER handles, hashes, or stores user passwords or credentials.
 * Supabase Auth is the sole authority for credentials, passwords, email verification, and recovery.
 */

import { randomBytes } from 'node:crypto';
import { supabaseAdminGetUser, type SupabaseAuthUser } from '@/server/auth/supabase-auth';
import { dbQuery, isDbConfigured } from '@/server/db/client';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SupplierLifecycleStatus =
  | 'REGISTERED'
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUIRED'
  | 'CONDITIONAL_APPROVAL'
  | 'APPROVED'
  | 'DECLINED';

export type SupplierRole =
  | 'SUPPLIER_ADMIN'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'FINANCE'
  | 'FIELD_USER'
  | 'VIEWER';

export interface SupplierUserRecord {
  id: string;
  auth_user_id: string; // Supabase Auth User UUID (Canonical Authority)
  email: string; // Denormalised contact email only
  first_name: string;
  last_name: string;
  organisation_id: string | null;
  role: SupplierRole;
  status: 'ACTIVE' | 'SUSPENDED';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierOrganisationRecord {
  id: string;
  legalName: string;
  tradingName: string | null;
  companyNumber: string | null;
  vatNumber: string | null;
  ownerId: string; // auth_user_id of primary admin
  applicationReference: string;
  lifecycleStatus: SupplierLifecycleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierApplicationDraft {
  orgId: string;
  applicationReference: string;
  currentStep: number;
  lifecycleStatus: SupplierLifecycleStatus;
  legalCompanyName: string;
  tradingName: string;
  companyNumber: string;
  vatNumber: string;
  websiteUrl: string;
  yearEstablished: string;
  employeeCount: string;
  tradingAddress: string;
  mainPhone: string;
  generalEmail: string;
  businessType: string;
  companySummary: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  opsContactName: string;
  opsContactEmail: string;
  selectedServices: string[];
  selectedRegions: string[];
  has247: boolean;
  emergencySlaHours: string;
  hasSubcontractors: boolean;
  directEngineers: string;
  plInsurer: string;
  plPolicyNumber: string;
  plCoverLimit: string;
  plExpiryDate: string;
  selectedAccreditations: string[];
  accreditationNumbers: Record<string, string>;
  gasSafeNumber: string;
  gasSafeExpiry: string;
  fGasNumber: string;
  fGasExpiry: string;
  hasHsPolicy: boolean;
  hasRams: boolean;
  hasIncidentHistory: boolean;
  antiBribery: boolean;
  modernSlavery: boolean;
  codeOfConduct: boolean;
  truthfulnessDeclaration: boolean;
  paymentMethod: 'CARD' | 'INVOICE' | 'WAIVER';
  waiverReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInvitationRecord {
  id: string;
  organisationId: string;
  email: string;
  role: SupplierRole;
  invitedByAuthId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  token: string;
  createdAt: string;
  expiresAt: string;
}

// ── Application Reference Generator ──────────────────────────────────────────

export function generateApplicationReference(): string {
  const now = new Date();
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SUP-${yymmdd}-${rand}`;
}

// ── In-Memory Domain Cache (Preserved via globalThis Singletons) ─────────────

interface GlobalSupplierStore {
  supplierUsersByAuthId: Map<string, SupplierUserRecord>;
  authIdByEmail: Map<string, string>;
  supplierOrganisations: Map<string, SupplierOrganisationRecord>;
  supplierApplicationDrafts: Map<string, SupplierApplicationDraft>;
  supplierInvitations: Map<string, SupplierInvitationRecord>;
}

const g = globalThis as unknown as { __efm_supplier_store?: GlobalSupplierStore };

if (!g.__efm_supplier_store) {
  g.__efm_supplier_store = {
    supplierUsersByAuthId: new Map(),
    authIdByEmail: new Map(),
    supplierOrganisations: new Map(),
    supplierApplicationDrafts: new Map(),
    supplierInvitations: new Map(),
  };
}

const store = g.__efm_supplier_store;

const supplierUsersByAuthId = store.supplierUsersByAuthId;
const authIdByEmail = store.authIdByEmail;
const supplierOrganisations = store.supplierOrganisations;
const supplierApplicationDrafts = store.supplierApplicationDrafts;
const supplierInvitations = store.supplierInvitations;

// ── Database Row Converters ──────────────────────────────────────────────────

function mapDbUserToRecord(row: any): SupplierUserRecord {
  return {
    id: row.id,
    auth_user_id: row.auth_user_id,
    email: row.email,
    first_name: row.first_name || '',
    last_name: row.last_name || '',
    organisation_id: row.organisation_id || null,
    role: (row.role || 'SUPPLIER_ADMIN') as SupplierRole,
    status: (row.status || 'ACTIVE') as 'ACTIVE' | 'SUSPENDED',
    email_verified: Boolean(row.email_verified),
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

function mapUserRecordToDb(user: SupplierUserRecord): Record<string, any> {
  return {
    id: user.id,
    auth_user_id: user.auth_user_id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    organisation_id: user.organisation_id,
    role: user.role,
    status: user.status,
    email_verified: user.email_verified,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function mapDbOrgToRecord(row: any): SupplierOrganisationRecord {
  return {
    id: row.id,
    legalName: row.legal_name,
    tradingName: row.trading_name || null,
    companyNumber: row.company_number || null,
    vatNumber: row.vat_number || null,
    ownerId: row.owner_id,
    applicationReference: row.application_reference,
    lifecycleStatus: (row.lifecycle_status || 'DRAFT') as SupplierLifecycleStatus,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function mapOrgRecordToDb(org: SupplierOrganisationRecord): Record<string, any> {
  return {
    id: org.id,
    legal_name: org.legalName,
    trading_name: org.tradingName,
    company_number: org.companyNumber,
    vat_number: org.vatNumber,
    owner_id: org.ownerId,
    application_reference: org.applicationReference,
    lifecycle_status: org.lifecycleStatus,
    created_at: org.createdAt,
    updated_at: org.updatedAt,
  };
}

function mapDbDraftToRecord(row: any): SupplierApplicationDraft {
  return {
    orgId: row.org_id,
    applicationReference: row.application_reference,
    currentStep: typeof row.current_step === 'number' ? row.current_step : 1,
    lifecycleStatus: (row.lifecycle_status || 'DRAFT') as SupplierLifecycleStatus,
    legalCompanyName: row.legal_company_name || '',
    tradingName: row.trading_name || '',
    companyNumber: row.company_number || '',
    vatNumber: row.vat_number || '',
    websiteUrl: row.website_url || '',
    yearEstablished: row.year_established || '',
    employeeCount: row.employee_count || '',
    tradingAddress: row.trading_address || '',
    mainPhone: row.main_phone || '',
    generalEmail: row.general_email || '',
    businessType: row.business_type || '',
    companySummary: row.company_summary || '',
    primaryContactName: row.primary_contact_name || '',
    primaryContactEmail: row.primary_contact_email || '',
    primaryContactPhone: row.primary_contact_phone || '',
    opsContactName: row.ops_contact_name || '',
    opsContactEmail: row.ops_contact_email || '',
    selectedServices: Array.isArray(row.selected_services) ? row.selected_services : [],
    selectedRegions: Array.isArray(row.selected_regions) ? row.selected_regions : [],
    has247: Boolean(row.has_247),
    emergencySlaHours: row.emergency_sla_hours || '',
    hasSubcontractors: Boolean(row.has_subcontractors),
    directEngineers: row.direct_engineers || '',
    plInsurer: row.pl_insurer || '',
    plPolicyNumber: row.pl_policy_number || '',
    plCoverLimit: row.pl_cover_limit || '',
    plExpiryDate: row.pl_expiry_date || '',
    selectedAccreditations: Array.isArray(row.selected_accreditations) ? row.selected_accreditations : [],
    accreditationNumbers:
      row.accreditation_numbers && typeof row.accreditation_numbers === 'object'
        ? row.accreditation_numbers
        : {},
    gasSafeNumber: row.gas_safe_number || '',
    gasSafeExpiry: row.gas_safe_expiry || '',
    fGasNumber: row.f_gas_number || '',
    fGasExpiry: row.f_gas_expiry || '',
    hasHsPolicy: Boolean(row.has_hs_policy),
    hasRams: Boolean(row.has_rams),
    hasIncidentHistory: Boolean(row.has_incident_history),
    antiBribery: Boolean(row.anti_bribery),
    modernSlavery: Boolean(row.modern_slavery),
    codeOfConduct: Boolean(row.code_of_conduct),
    truthfulnessDeclaration: Boolean(row.truthfulness_declaration),
    paymentMethod: (row.payment_method || 'CARD') as 'CARD' | 'INVOICE' | 'WAIVER',
    waiverReason: row.waiver_reason || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function mapDraftRecordToDb(draft: SupplierApplicationDraft): Record<string, any> {
  return {
    org_id: draft.orgId,
    application_reference: draft.applicationReference,
    current_step: draft.currentStep,
    lifecycle_status: draft.lifecycleStatus,
    legal_company_name: draft.legalCompanyName,
    trading_name: draft.tradingName,
    company_number: draft.companyNumber,
    vat_number: draft.vatNumber,
    website_url: draft.websiteUrl,
    year_established: draft.yearEstablished,
    employee_count: draft.employeeCount,
    trading_address: draft.tradingAddress,
    main_phone: draft.mainPhone,
    general_email: draft.generalEmail,
    business_type: draft.businessType,
    company_summary: draft.companySummary,
    primary_contact_name: draft.primaryContactName,
    primary_contact_email: draft.primaryContactEmail,
    primary_contact_phone: draft.primaryContactPhone,
    ops_contact_name: draft.opsContactName,
    ops_contact_email: draft.opsContactEmail,
    selected_services: draft.selectedServices,
    selected_regions: draft.selectedRegions,
    has_247: draft.has247,
    emergency_sla_hours: draft.emergencySlaHours,
    has_subcontractors: draft.hasSubcontractors,
    direct_engineers: draft.directEngineers,
    pl_insurer: draft.plInsurer,
    pl_policy_number: draft.plPolicyNumber,
    pl_cover_limit: draft.plCoverLimit,
    pl_expiry_date: draft.plExpiryDate,
    selected_accreditations: draft.selectedAccreditations,
    accreditation_numbers: draft.accreditationNumbers,
    gas_safe_number: draft.gasSafeNumber,
    gas_safe_expiry: draft.gasSafeExpiry,
    f_gas_number: draft.fGasNumber,
    f_gas_expiry: draft.fGasExpiry,
    has_hs_policy: draft.hasHsPolicy,
    has_rams: draft.hasRams,
    has_incident_history: draft.hasIncidentHistory,
    anti_bribery: draft.antiBribery,
    modern_slavery: draft.modernSlavery,
    code_of_conduct: draft.codeOfConduct,
    truthfulness_declaration: draft.truthfulnessDeclaration,
    payment_method: draft.paymentMethod,
    waiver_reason: draft.waiverReason,
    created_at: draft.createdAt,
    updated_at: draft.updatedAt,
  };
}

function mapDbInvitationToRecord(row: any): SupplierInvitationRecord {
  return {
    id: row.id,
    organisationId: row.organisation_id,
    email: row.email,
    role: (row.role || 'SUPPLIER_ADMIN') as SupplierRole,
    invitedByAuthId: row.invited_by_auth_id,
    status: (row.status || 'PENDING') as 'PENDING' | 'ACCEPTED' | 'REVOKED',
    token: row.token,
    createdAt: row.created_at || new Date().toISOString(),
    expiresAt: row.expires_at || new Date().toISOString(),
  };
}

function mapInvitationRecordToDb(inv: SupplierInvitationRecord): Record<string, any> {
  return {
    id: inv.id,
    organisation_id: inv.organisationId,
    email: inv.email,
    role: inv.role,
    invited_by_auth_id: inv.invitedByAuthId,
    status: inv.status,
    token: inv.token,
    created_at: inv.createdAt,
    expires_at: inv.expiresAt,
  };
}

// ── Supplier User Operations (Linked to Supabase Auth & PostgREST) ────────────

export interface ProvisionSupplierUserResult {
  success: boolean;
  user?: SupplierUserRecord;
  error?: string;
  isNew?: boolean;
}

/**
 * Creates or idempotently links a supplier domain record for an authenticated Supabase user.
 * ZERO password handling — authentication was already performed by Supabase.
 */
export async function createOrLinkSupplierUser(
  authUserId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: SupplierRole = 'SUPPLIER_ADMIN',
  emailVerified: boolean = false
): Promise<ProvisionSupplierUserResult> {
  const normEmail = email.trim().toLowerCase();

  // 1. Check existing record from DB first, then fallback to cache
  let existing = await getSupplierUserByAuthId(authUserId);

  if (existing) {
    existing.email = normEmail;
    existing.first_name = firstName.trim() || existing.first_name;
    existing.last_name = lastName.trim() || existing.last_name;
    existing.email_verified = emailVerified || existing.email_verified;
    existing.updated_at = new Date().toISOString();

    // Persist update to DB if configured
    if (isDbConfigured()) {
      await dbQuery(`supplier_users?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
        method: 'PATCH',
        body: mapUserRecordToDb(existing),
      });
    }

    supplierUsersByAuthId.set(authUserId, existing);
    authIdByEmail.set(normEmail, authUserId);
    return { success: true, user: existing, isNew: false };
  }

  const domainUserId = `suser-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  const user: SupplierUserRecord = {
    id: domainUserId,
    auth_user_id: authUserId,
    email: normEmail,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    organisation_id: null,
    role,
    status: 'ACTIVE',
    email_verified: emailVerified,
    created_at: now,
    updated_at: now,
  };

  // Check if user had any pending invitations
  if (isDbConfigured()) {
    const { data: invs } = await dbQuery<any[]>(
      `supplier_invitations?email=eq.${encodeURIComponent(normEmail)}&status=eq.PENDING&limit=1`
    );
    if (invs && invs.length > 0) {
      const inv = mapDbInvitationToRecord(invs[0]);
      user.organisation_id = inv.organisationId;
      user.role = inv.role;
      await dbQuery(`supplier_invitations?id=eq.${encodeURIComponent(inv.id)}`, {
        method: 'PATCH',
        body: { status: 'ACCEPTED' },
      });
    }
  }

  // Also check local invitations cache for fallback
  if (!user.organisation_id) {
    for (const inv of supplierInvitations.values()) {
      if (inv.email === normEmail && inv.status === 'PENDING') {
        user.organisation_id = inv.organisationId;
        user.role = inv.role;
        inv.status = 'ACCEPTED';
        break;
      }
    }
  }

  // Persist new user to Supabase
  if (isDbConfigured()) {
    await dbQuery('supplier_users', {
      method: 'POST',
      body: mapUserRecordToDb(user),
    });
  }

  supplierUsersByAuthId.set(authUserId, user);
  authIdByEmail.set(normEmail, authUserId);

  return { success: true, user, isNew: true };
}

export async function getSupplierUserByAuthId(
  authUserId: string
): Promise<SupplierUserRecord | null> {
  if (!authUserId) return null;

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_users?auth_user_id=eq.${encodeURIComponent(authUserId)}&limit=1`
    );
    if (!error && data && data.length > 0) {
      const record = mapDbUserToRecord(data[0]);
      supplierUsersByAuthId.set(authUserId, record);
      authIdByEmail.set(record.email, authUserId);
      return record;
    }
  }

  return supplierUsersByAuthId.get(authUserId) || null;
}

export async function getSupplierUserByEmail(
  email: string
): Promise<SupplierUserRecord | null> {
  const normEmail = email.trim().toLowerCase();
  if (!normEmail) return null;

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_users?email=eq.${encodeURIComponent(normEmail)}&limit=1`
    );
    if (!error && data && data.length > 0) {
      const record = mapDbUserToRecord(data[0]);
      supplierUsersByAuthId.set(record.auth_user_id, record);
      authIdByEmail.set(normEmail, record.auth_user_id);
      return record;
    }
  }

  const authId = authIdByEmail.get(normEmail);
  if (!authId) return null;
  return supplierUsersByAuthId.get(authId) || null;
}

export async function setSupplierUserEmailVerified(
  authUserId: string,
  verified: boolean = true
): Promise<void> {
  const now = new Date().toISOString();
  if (isDbConfigured()) {
    await dbQuery(`supplier_users?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
      method: 'PATCH',
      body: { email_verified: verified, updated_at: now },
    });
  }

  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.email_verified = verified;
    user.updated_at = now;
  }
}

export async function setSupplierUserOrganisation(
  authUserId: string,
  orgId: string
): Promise<void> {
  const now = new Date().toISOString();
  if (isDbConfigured()) {
    await dbQuery(`supplier_users?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
      method: 'PATCH',
      body: { organisation_id: orgId, updated_at: now },
    });
  }

  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.organisation_id = orgId;
    user.updated_at = now;
  }
}

export async function setSupplierUserStatus(
  authUserId: string,
  status: 'ACTIVE' | 'SUSPENDED'
): Promise<void> {
  const now = new Date().toISOString();
  if (isDbConfigured()) {
    await dbQuery(`supplier_users?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
      method: 'PATCH',
      body: { status, updated_at: now },
    });
  }

  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.status = status;
    user.updated_at = now;
  }
}

export interface SupplierAuthValidationResult {
  valid: boolean;
  reason?: 'VALID' | 'AUTH_USER_NOT_FOUND' | 'SERVICE_UNAVAILABLE' | 'UNVERIFIED' | 'SUSPENDED';
  authUser: SupabaseAuthUser | null;
  supplierUser: SupplierUserRecord | null;
  isVerified: boolean;
}

export async function validateSupplierAuthUser(
  authUserId: string
): Promise<SupplierAuthValidationResult> {
  if (!authUserId) {
    return { valid: false, reason: 'AUTH_USER_NOT_FOUND', authUser: null, supplierUser: null, isVerified: false };
  }

  // 1. Validate against canonical Supabase Auth
  let authUser: SupabaseAuthUser | null = null;
  const adminRes = await supabaseAdminGetUser(authUserId);

  if (adminRes.data) {
    authUser = adminRes.data;
  } else if (adminRes.error && adminRes.error.status === 404) {
    // Definitively deleted or non-existent in Supabase Auth
    supplierUsersByAuthId.delete(authUserId);
    return { valid: false, reason: 'AUTH_USER_NOT_FOUND', authUser: null, supplierUser: null, isVerified: false };
  } else if (adminRes.error && (adminRes.error.message?.includes('not configured') || adminRes.error.status === 500)) {
    // Fallback for offline testing environments without Supabase credentials
    const localUser = await getSupplierUserByAuthId(authUserId);
    if (!localUser) {
      return { valid: false, reason: 'AUTH_USER_NOT_FOUND', authUser: null, supplierUser: null, isVerified: false };
    }
    return {
      valid: localUser.status === 'ACTIVE',
      reason: localUser.status === 'ACTIVE' ? 'VALID' : 'SUSPENDED',
      authUser: {
        id: localUser.auth_user_id,
        email: localUser.email,
        email_confirmed_at: localUser.email_verified ? localUser.created_at : null,
        created_at: localUser.created_at,
      },
      supplierUser: localUser,
      isVerified: localUser.email_verified,
    };
  } else {
    // Other error / not found in Supabase Auth
    supplierUsersByAuthId.delete(authUserId);
    return { valid: false, reason: 'AUTH_USER_NOT_FOUND', authUser: null, supplierUser: null, isVerified: false };
  }

  // 2. Resolve or Idempotently Provision Domain User
  let supplierUser = await getSupplierUserByAuthId(authUserId);
  const isVerified = Boolean(authUser.email_confirmed_at);

  if (!supplierUser) {
    // Valid Supabase user exists, but domain user missing -> idempotently restore domain record
    const meta = authUser.user_metadata || {};
    const prov = await createOrLinkSupplierUser(
      authUser.id,
      authUser.email,
      meta.first_name || 'Supplier',
      meta.last_name || 'User',
      'SUPPLIER_ADMIN',
      isVerified
    );
    supplierUser = prov.user || null;
  } else if (isVerified && !supplierUser.email_verified) {
    supplierUser.email_verified = true;
    await setSupplierUserEmailVerified(authUserId, true);
  }

  if (supplierUser && supplierUser.status === 'SUSPENDED') {
    return { valid: false, reason: 'SUSPENDED', authUser, supplierUser, isVerified };
  }

  return {
    valid: true,
    reason: 'VALID',
    authUser,
    supplierUser,
    isVerified,
  };
}

// ── Organisation Operations ───────────────────────────────────────────────────

export interface CreateOrganisationResult {
  success: boolean;
  organisation?: SupplierOrganisationRecord;
  duplicate?: boolean;
  error?: string;
}

export async function createSupplierOrganisation(
  ownerAuthUserId: string,
  legalName: string,
  tradingName?: string,
  companyNumber?: string
): Promise<CreateOrganisationResult> {
  const normLegalName = legalName.trim();
  const normTradingName = tradingName?.trim() || null;
  const normCompanyNumber = companyNumber?.trim() ? companyNumber.trim().toUpperCase() : null;

  // 1. If user already has an organisation linked, return it idempotently
  const existingUser = await getSupplierUserByAuthId(ownerAuthUserId);
  if (existingUser?.organisation_id) {
    const existingOrg = await getSupplierOrganisationById(existingUser.organisation_id);
    if (existingOrg) {
      await getOrCreateApplicationDraft(existingOrg.id);
      return { success: true, organisation: existingOrg };
    }
  }

  // 2. Duplicate check by Companies House number
  if (normCompanyNumber) {
    if (isDbConfigured()) {
      const { data: matchedOrgs } = await dbQuery<any[]>(
        `supplier_organisations?company_number=eq.${encodeURIComponent(normCompanyNumber)}&limit=1`
      );
      if (matchedOrgs && matchedOrgs.length > 0) {
        const org = mapDbOrgToRecord(matchedOrgs[0]);
        if (org.ownerId === ownerAuthUserId) {
          if (existingUser) {
            await setSupplierUserOrganisation(ownerAuthUserId, org.id);
          }
          await getOrCreateApplicationDraft(org.id);
          return { success: true, organisation: org };
        }
        return {
          success: false,
          duplicate: true,
          error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
        };
      }
    }

    // In-memory duplicate check
    for (const org of supplierOrganisations.values()) {
      if (org.companyNumber?.toUpperCase() === normCompanyNumber) {
        if (org.ownerId === ownerAuthUserId) {
          if (existingUser) {
            existingUser.organisation_id = org.id;
            existingUser.role = 'SUPPLIER_ADMIN';
            existingUser.updated_at = new Date().toISOString();
          }
          await getOrCreateApplicationDraft(org.id);
          return { success: true, organisation: org };
        }
        return {
          success: false,
          duplicate: true,
          error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
        };
      }
    }
  }

  // 3. Duplicate check by legal name
  if (isDbConfigured()) {
    const { data: matchedOrgs } = await dbQuery<any[]>(
      `supplier_organisations?legal_name=ilike.${encodeURIComponent(normLegalName)}&limit=1`
    );
    if (matchedOrgs && matchedOrgs.length > 0) {
      const org = mapDbOrgToRecord(matchedOrgs[0]);
      if (org.ownerId === ownerAuthUserId) {
        if (existingUser) {
          await setSupplierUserOrganisation(ownerAuthUserId, org.id);
        }
        await getOrCreateApplicationDraft(org.id);
        return { success: true, organisation: org };
      }
      return {
        success: false,
        duplicate: true,
        error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
      };
    }
  }

  const normNameLower = normLegalName.toLowerCase();
  for (const org of supplierOrganisations.values()) {
    if (org.legalName.trim().toLowerCase() === normNameLower) {
      if (org.ownerId === ownerAuthUserId) {
        if (existingUser) {
          existingUser.organisation_id = org.id;
          existingUser.role = 'SUPPLIER_ADMIN';
          existingUser.updated_at = new Date().toISOString();
        }
        await getOrCreateApplicationDraft(org.id);
        return { success: true, organisation: org };
      }
      return {
        success: false,
        duplicate: true,
        error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
      };
    }
  }

  // 4. Provision organisation atomically
  const orgId = `sorg-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();
  const appRef = generateApplicationReference();

  const organisation: SupplierOrganisationRecord = {
    id: orgId,
    legalName: normLegalName,
    tradingName: normTradingName,
    companyNumber: normCompanyNumber,
    vatNumber: null,
    ownerId: ownerAuthUserId,
    applicationReference: appRef,
    lifecycleStatus: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };

  // Persist to Supabase
  if (isDbConfigured()) {
    await dbQuery('supplier_organisations', {
      method: 'POST',
      body: mapOrgRecordToDb(organisation),
    });
  }

  supplierOrganisations.set(orgId, organisation);

  // 5. Link user to organisation with SUPPLIER_ADMIN role
  await setSupplierUserOrganisation(ownerAuthUserId, orgId);

  // 6. Atomically provision canonical DRAFT application with pre-populated company data
  await getOrCreateApplicationDraft(orgId);

  return { success: true, organisation };
}

export async function getSupplierOrganisationById(
  orgId: string
): Promise<SupplierOrganisationRecord | null> {
  if (!orgId) return null;

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_organisations?id=eq.${encodeURIComponent(orgId)}&limit=1`
    );
    if (!error && data && data.length > 0) {
      const record = mapDbOrgToRecord(data[0]);
      supplierOrganisations.set(orgId, record);
      return record;
    }
  }

  return supplierOrganisations.get(orgId) || null;
}

export async function updateOrganisationLifecycle(
  orgId: string,
  status: SupplierLifecycleStatus
): Promise<void> {
  const now = new Date().toISOString();
  if (isDbConfigured()) {
    await dbQuery(`supplier_organisations?id=eq.${encodeURIComponent(orgId)}`, {
      method: 'PATCH',
      body: { lifecycle_status: status, updated_at: now },
    });
  }

  const org = supplierOrganisations.get(orgId);
  if (org) {
    org.lifecycleStatus = status;
    org.updatedAt = now;
  }
}

// ── Application Draft Operations ──────────────────────────────────────────────

/**
 * Idempotent: returns existing draft or creates a blank one.
 * Blank initial state — no mock data, populated only with legitimate org data.
 */
export async function getOrCreateApplicationDraft(
  orgId: string
): Promise<SupplierApplicationDraft> {
  if (!orgId) throw new Error('Organisation ID is required to get or create draft');

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&limit=1`
    );
    if (!error && data && data.length > 0) {
      const record = mapDbDraftToRecord(data[0]);
      supplierApplicationDrafts.set(orgId, record);
      return record;
    }
  }

  const existing = supplierApplicationDrafts.get(orgId);
  if (existing) return existing;

  const org = await getSupplierOrganisationById(orgId);
  const now = new Date().toISOString();

  const draft: SupplierApplicationDraft = {
    orgId,
    applicationReference: org?.applicationReference || generateApplicationReference(),
    currentStep: 1,
    lifecycleStatus: 'DRAFT',
    legalCompanyName: org?.legalName || '',
    tradingName: org?.tradingName || '',
    companyNumber: org?.companyNumber || '',
    vatNumber: '',
    websiteUrl: '',
    yearEstablished: '',
    employeeCount: '',
    tradingAddress: '',
    mainPhone: '',
    generalEmail: '',
    businessType: '',
    companySummary: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    opsContactName: '',
    opsContactEmail: '',
    selectedServices: [],
    selectedRegions: [],
    has247: false,
    emergencySlaHours: '',
    hasSubcontractors: false,
    directEngineers: '',
    plInsurer: '',
    plPolicyNumber: '',
    plCoverLimit: '',
    plExpiryDate: '',
    selectedAccreditations: [],
    accreditationNumbers: {},
    gasSafeNumber: '',
    gasSafeExpiry: '',
    fGasNumber: '',
    fGasExpiry: '',
    hasHsPolicy: false,
    hasRams: false,
    hasIncidentHistory: false,
    antiBribery: false,
    modernSlavery: false,
    codeOfConduct: false,
    truthfulnessDeclaration: false,
    paymentMethod: 'CARD',
    waiverReason: '',
    createdAt: now,
    updatedAt: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_application_drafts', {
      method: 'POST',
      body: mapDraftRecordToDb(draft),
    });
  }

  supplierApplicationDrafts.set(orgId, draft);

  if (org && org.lifecycleStatus === 'REGISTERED') {
    await updateOrganisationLifecycle(orgId, 'DRAFT');
  }

  return draft;
}

export async function updateApplicationDraft(
  orgId: string,
  updates: Partial<SupplierApplicationDraft>
): Promise<SupplierApplicationDraft | null> {
  const draft = await getOrCreateApplicationDraft(orgId);
  if (!draft) return null;

  const updated: SupplierApplicationDraft = {
    ...draft,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (isDbConfigured()) {
    await dbQuery(`supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}`, {
      method: 'PATCH',
      body: mapDraftRecordToDb(updated),
    });
  }

  supplierApplicationDrafts.set(orgId, updated);
  return updated;
}

export async function getApplicationDraft(
  orgId: string
): Promise<SupplierApplicationDraft | null> {
  if (!orgId) return null;

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&limit=1`
    );
    if (!error && data && data.length > 0) {
      const record = mapDbDraftToRecord(data[0]);
      supplierApplicationDrafts.set(orgId, record);
      return record;
    }
  }

  return supplierApplicationDrafts.get(orgId) || null;
}

// ── Resume Logic ──────────────────────────────────────────────────────────────

export type ResumeDestination =
  | '/supplier-portal/register'
  | '/supplier-portal/org-setup'
  | '/supplier-portal/onboarding'
  | '/supplier-portal/actions'
  | '/supplier-portal';

export async function resolveResumeDestination(authUserId: string): Promise<ResumeDestination> {
  let user = await getSupplierUserByAuthId(authUserId);
  if (!user) {
    const authState = await validateSupplierAuthUser(authUserId);
    user = authState.supplierUser || null;
  }
  if (!user) return '/supplier-portal/register';
  if (!user.organisation_id) return '/supplier-portal/org-setup';

  const org = await getSupplierOrganisationById(user.organisation_id);
  if (!org) return '/supplier-portal/org-setup';

  switch (org.lifecycleStatus) {
    case 'REGISTERED':
    case 'DRAFT':
    case 'PAYMENT_PENDING':
      return '/supplier-portal/onboarding';
    case 'INFORMATION_REQUIRED':
      return '/supplier-portal/actions';
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'CONDITIONAL_APPROVAL':
    case 'APPROVED':
    case 'DECLINED':
      return '/supplier-portal';
    default:
      return '/supplier-portal/onboarding';
  }
}

// ── Portal Status Helpers ─────────────────────────────────────────────────────

export interface PortalStatusDisplay {
  orgName: string;
  statusLabel: string;
  statusColour: 'green' | 'amber' | 'slate';
  isApproved: boolean;
}

export function getPortalStatusDisplay(
  org: SupplierOrganisationRecord | null
): PortalStatusDisplay {
  if (!org) {
    return {
      orgName: 'New Supplier Application',
      statusLabel: 'Draft',
      statusColour: 'slate',
      isApproved: false,
    };
  }

  switch (org.lifecycleStatus) {
    case 'APPROVED':
      return {
        orgName: org.tradingName || org.legalName,
        statusLabel: '● Approved Supplier',
        statusColour: 'green',
        isApproved: true,
      };
    case 'UNDER_REVIEW':
    case 'SUBMITTED':
      return {
        orgName: org.tradingName || org.legalName,
        statusLabel: 'Under Review',
        statusColour: 'amber',
        isApproved: false,
      };
    case 'INFORMATION_REQUIRED':
    case 'CONDITIONAL_APPROVAL':
      return {
        orgName: org.tradingName || org.legalName,
        statusLabel: 'Action Required',
        statusColour: 'amber',
        isApproved: false,
      };
    case 'DECLINED':
      return {
        orgName: org.tradingName || org.legalName,
        statusLabel: 'Application Declined',
        statusColour: 'slate',
        isApproved: false,
      };
    default:
      return {
        orgName: org.tradingName || org.legalName || 'New Supplier Application',
        statusLabel: 'Application in Progress',
        statusColour: 'slate',
        isApproved: false,
      };
  }
}

// ── Supplier Team Invitation Operations ───────────────────────────────────────

export async function inviteSupplierUser(
  inviterAuthUserId: string,
  orgId: string,
  email: string,
  role: SupplierRole
): Promise<{ success: boolean; invitation?: SupplierInvitationRecord; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const token = randomBytes(24).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const invitation: SupplierInvitationRecord = {
    id: `inv-${Date.now()}`,
    organisationId: orgId,
    email: normEmail,
    role,
    invitedByAuthId: inviterAuthUserId,
    status: 'PENDING',
    token,
    createdAt: now.toISOString(),
    expiresAt,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_invitations', {
      method: 'POST',
      body: mapInvitationRecordToDb(invitation),
    });
  }

  supplierInvitations.set(token, invitation);

  // If user already exists, link immediately
  const existingUser = await getSupplierUserByEmail(normEmail);
  if (existingUser) {
    await setSupplierUserOrganisation(existingUser.auth_user_id, orgId);
    if (isDbConfigured()) {
      await dbQuery(`supplier_users?auth_user_id=eq.${encodeURIComponent(existingUser.auth_user_id)}`, {
        method: 'PATCH',
        body: { role },
      });
    }
    existingUser.role = role;
    invitation.status = 'ACCEPTED';
    if (isDbConfigured()) {
      await dbQuery(`supplier_invitations?id=eq.${encodeURIComponent(invitation.id)}`, {
        method: 'PATCH',
        body: { status: 'ACCEPTED' },
      });
    }
  }

  return { success: true, invitation };
}

export async function listSupplierUsersByOrg(orgId: string): Promise<SupplierUserRecord[]> {
  if (!orgId) return [];

  if (isDbConfigured()) {
    const { data, error } = await dbQuery<any[]>(
      `supplier_users?organisation_id=eq.${encodeURIComponent(orgId)}&order=created_at.asc`
    );
    if (!error && data) {
      return data.map(mapDbUserToRecord);
    }
  }

  return Array.from(supplierUsersByAuthId.values()).filter((u) => u.organisation_id === orgId);
}

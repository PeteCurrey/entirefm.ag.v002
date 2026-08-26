/**
 * ENTIREFM SUPPLIER DOMAIN & ORGANISATION REPOSITORY
 * ====================================================
 * Single Source of Truth for:
 * 1. Supplier Domain User records (linked to canonical Supabase Auth user UUIDs)
 * 2. Supplier Organisations & multi-tenant isolation
 * 3. Supplier Application Drafts & Lifecycle states
 * 4. Supplier Invitations & Team RBAC
 * 5. Lifecycle-aware resume routing & portal status presentation
 *
 * NON-NEGOTIABLE SECURITY INVARIANT:
 * This store NEVER handles, hashes, or stores user passwords or credentials.
 * Supabase Auth is the sole authority for credentials, passwords, email verification, and recovery.
 */

import { randomBytes } from 'node:crypto';

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

// ── In-Memory Domain Stores ───────────────────────────────────────────────────

/** auth_user_id (Supabase UUID) → SupplierUserRecord */
const supplierUsersByAuthId = new Map<string, SupplierUserRecord>();
/** normalized email → auth_user_id */
const authIdByEmail = new Map<string, string>();
/** orgId → SupplierOrganisationRecord */
const supplierOrganisations = new Map<string, SupplierOrganisationRecord>();
/** orgId → SupplierApplicationDraft */
const supplierApplicationDrafts = new Map<string, SupplierApplicationDraft>();
/** token / id → SupplierInvitationRecord */
const supplierInvitations = new Map<string, SupplierInvitationRecord>();

// ── Supplier User Operations (Linked to Supabase Auth) ────────────────────────

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
  const existing = supplierUsersByAuthId.get(authUserId);

  if (existing) {
    // Update contact metadata if changed
    existing.email = normEmail;
    existing.first_name = firstName.trim() || existing.first_name;
    existing.last_name = lastName.trim() || existing.last_name;
    existing.email_verified = emailVerified || existing.email_verified;
    existing.updated_at = new Date().toISOString();
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

  supplierUsersByAuthId.set(authUserId, user);
  authIdByEmail.set(normEmail, authUserId);

  // Check if user had any pending invitations
  for (const inv of supplierInvitations.values()) {
    if (inv.email === normEmail && inv.status === 'PENDING') {
      user.organisation_id = inv.organisationId;
      user.role = inv.role;
      inv.status = 'ACCEPTED';
      break;
    }
  }

  return { success: true, user, isNew: true };
}

export async function getSupplierUserByAuthId(
  authUserId: string
): Promise<SupplierUserRecord | null> {
  return supplierUsersByAuthId.get(authUserId) || null;
}

export async function getSupplierUserByEmail(
  email: string
): Promise<SupplierUserRecord | null> {
  const authId = authIdByEmail.get(email.trim().toLowerCase());
  if (!authId) return null;
  return supplierUsersByAuthId.get(authId) || null;
}

export async function setSupplierUserEmailVerified(
  authUserId: string,
  verified: boolean = true
): Promise<void> {
  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.email_verified = verified;
    user.updated_at = new Date().toISOString();
  }
}

export async function setSupplierUserOrganisation(
  authUserId: string,
  orgId: string
): Promise<void> {
  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.organisation_id = orgId;
    user.updated_at = new Date().toISOString();
  }
}

export async function setSupplierUserStatus(
  authUserId: string,
  status: 'ACTIVE' | 'SUSPENDED'
): Promise<void> {
  const user = supplierUsersByAuthId.get(authUserId);
  if (user) {
    user.status = status;
    user.updated_at = new Date().toISOString();
  }
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
  // Duplicate check by Companies House number
  if (companyNumber) {
    const normalised = companyNumber.trim().toUpperCase();
    for (const org of supplierOrganisations.values()) {
      if (org.companyNumber?.toUpperCase() === normalised) {
        return {
          success: false,
          duplicate: true,
          error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
        };
      }
    }
  }

  // Duplicate check by legal name
  const normName = legalName.trim().toLowerCase();
  for (const org of supplierOrganisations.values()) {
    if (org.legalName.trim().toLowerCase() === normName) {
      return {
        success: false,
        duplicate: true,
        error: 'This organisation may already have an EntireFM supplier account. Please contact supplier support or request access.',
      };
    }
  }

  const orgId = `sorg-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  const organisation: SupplierOrganisationRecord = {
    id: orgId,
    legalName: legalName.trim(),
    tradingName: tradingName?.trim() || null,
    companyNumber: companyNumber?.trim() || null,
    vatNumber: null,
    ownerId: ownerAuthUserId,
    applicationReference: generateApplicationReference(),
    lifecycleStatus: 'REGISTERED',
    createdAt: now,
    updatedAt: now,
  };

  supplierOrganisations.set(orgId, organisation);

  // Link user to organisation
  await setSupplierUserOrganisation(ownerAuthUserId, orgId);

  return { success: true, organisation };
}

export async function getSupplierOrganisationById(
  orgId: string
): Promise<SupplierOrganisationRecord | null> {
  return supplierOrganisations.get(orgId) || null;
}

export async function updateOrganisationLifecycle(
  orgId: string,
  status: SupplierLifecycleStatus
): Promise<void> {
  const org = supplierOrganisations.get(orgId);
  if (org) {
    org.lifecycleStatus = status;
    org.updatedAt = new Date().toISOString();
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
  const existing = supplierApplicationDrafts.get(orgId);
  if (existing) return existing;

  const org = supplierOrganisations.get(orgId);
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

  supplierApplicationDrafts.set(orgId, draft);

  if (org && org.lifecycleStatus === 'REGISTERED') {
    org.lifecycleStatus = 'DRAFT';
    org.updatedAt = now;
  }

  return draft;
}

export async function updateApplicationDraft(
  orgId: string,
  updates: Partial<SupplierApplicationDraft>
): Promise<SupplierApplicationDraft | null> {
  const draft = supplierApplicationDrafts.get(orgId);
  if (!draft) return null;
  const updated = { ...draft, ...updates, updatedAt: new Date().toISOString() };
  supplierApplicationDrafts.set(orgId, updated);
  return updated;
}

export async function getApplicationDraft(
  orgId: string
): Promise<SupplierApplicationDraft | null> {
  return supplierApplicationDrafts.get(orgId) || null;
}

// ── Resume Logic ──────────────────────────────────────────────────────────────

export type ResumeDestination =
  | '/supplier-portal/org-setup'
  | '/supplier-portal/onboarding'
  | '/supplier-portal/actions'
  | '/supplier-portal';

export async function resolveResumeDestination(authUserId: string): Promise<ResumeDestination> {
  const user = supplierUsersByAuthId.get(authUserId);
  if (!user || !user.organisation_id) return '/supplier-portal/org-setup';

  const org = supplierOrganisations.get(user.organisation_id);
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

  supplierInvitations.set(token, invitation);

  // If user already exists, link immediately
  const existingUser = await getSupplierUserByEmail(normEmail);
  if (existingUser) {
    existingUser.organisation_id = orgId;
    existingUser.role = role;
    invitation.status = 'ACCEPTED';
  }

  return { success: true, invitation };
}

export async function listSupplierUsersByOrg(orgId: string): Promise<SupplierUserRecord[]> {
  return Array.from(supplierUsersByAuthId.values()).filter((u) => u.organisation_id === orgId);
}

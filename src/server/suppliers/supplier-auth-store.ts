/**
 * ENTIREFM SUPPLIER AUTHENTICATION STORE
 * =======================================
 * In-memory supplier user registry, organisation management, and application
 * lifecycle tracking. Mirrors the server-side store pattern used across the platform.
 *
 * Lifecycle states:
 *   REGISTERED → DRAFT → PAYMENT_PENDING → SUBMITTED → UNDER_REVIEW
 *   → INFORMATION_REQUIRED → APPROVED | DECLINED | CONDITIONAL_APPROVAL
 */

import { createHmac, randomBytes } from 'node:crypto';

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

export interface SupplierAuthUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  emailVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
  organisationId: string | null;
}

export interface SupplierOrganisationRecord {
  id: string;
  legalName: string;
  tradingName: string | null;
  companyNumber: string | null;
  vatNumber: string | null;
  ownerId: string;
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

// ── Password Utilities (HMAC-SHA256 — consistent with existing auth pattern) ──

const AUTH_SECRET =
  process.env.ADMIN_PASSWORD || process.env.AUTH_SECRET || 'entirefm-unified-ops-secret-key-2026';

/**
 * Hash a plain-text password with a random salt using HMAC-SHA256.
 * Returns `salt:hash` format.
 */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', AUTH_SECRET).update(`${salt}:${plain}`).digest('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain-text password against a stored `salt:hash`.
 */
export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = createHmac('sha256', AUTH_SECRET).update(`${salt}:${plain}`).digest('hex');
  // Constant-time comparison
  if (expected.length !== hash.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── Application Reference Generator ──────────────────────────────────────────

export function generateApplicationReference(): string {
  const now = new Date();
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SUP-${yymmdd}-${rand}`;
}

// ── In-Memory Stores ──────────────────────────────────────────────────────────

/** Email → SupplierAuthUser */
const supplierUsersByEmail = new Map<string, SupplierAuthUser>();
/** userId → SupplierAuthUser */
const supplierUsersById = new Map<string, SupplierAuthUser>();
/** orgId → SupplierOrganisationRecord */
const supplierOrganisations = new Map<string, SupplierOrganisationRecord>();
/** orgId → SupplierApplicationDraft */
const supplierApplicationDrafts = new Map<string, SupplierApplicationDraft>();

// ── User Operations ───────────────────────────────────────────────────────────

export interface CreateSupplierUserResult {
  success: boolean;
  user?: SupplierAuthUser;
  error?: string;
}

export async function createSupplierUser(
  email: string,
  plainPassword: string,
  firstName: string,
  lastName: string
): Promise<CreateSupplierUserResult> {
  const normEmail = email.trim().toLowerCase();

  if (supplierUsersByEmail.has(normEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please sign in.' };
  }

  const passwordHash = hashPassword(plainPassword);
  const id = `suser-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  const user: SupplierAuthUser = {
    id,
    email: normEmail,
    passwordHash,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    createdAt: now,
    emailVerified: false,
    status: 'ACTIVE',
    organisationId: null,
  };

  supplierUsersByEmail.set(normEmail, user);
  supplierUsersById.set(id, user);

  return { success: true, user };
}

export async function findSupplierByEmail(email: string): Promise<SupplierAuthUser | null> {
  return supplierUsersByEmail.get(email.trim().toLowerCase()) || null;
}

export async function findSupplierById(id: string): Promise<SupplierAuthUser | null> {
  return supplierUsersById.get(id) || null;
}

export async function markEmailVerified(userId: string): Promise<void> {
  const user = supplierUsersById.get(userId);
  if (user) {
    user.emailVerified = true;
    supplierUsersByEmail.set(user.email, user);
  }
}

export async function updateUserOrganisation(userId: string, orgId: string): Promise<void> {
  const user = supplierUsersById.get(userId);
  if (user) {
    user.organisationId = orgId;
    supplierUsersByEmail.set(user.email, user);
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
  ownerId: string,
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

  // Fuzzy duplicate check by legal name
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
    ownerId,
    applicationReference: generateApplicationReference(),
    lifecycleStatus: 'REGISTERED',
    createdAt: now,
    updatedAt: now,
  };

  supplierOrganisations.set(orgId, organisation);

  // Link user to organisation
  await updateUserOrganisation(ownerId, orgId);

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
 * Blank initial state — no mock data, no pre-population except
 * legitimate org-setup fields.
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
    // Only pre-populate from legitimate org-setup data
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

  // Transition org to DRAFT status
  if (org) {
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

export async function resolveResumeDestination(userId: string): Promise<ResumeDestination> {
  const user = supplierUsersById.get(userId);
  if (!user || !user.organisationId) return '/supplier-portal/org-setup';

  const org = supplierOrganisations.get(user.organisationId);
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

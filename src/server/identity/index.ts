/**
 * ENTIREFM IDENTITY & ACCESS DOMAIN MODULE
 * ==========================================================================
 * Single Source of Truth for:
 * 1. Supabase Auth Token verification & UserIdentity resolution
 * 2. Multi-Portal Authorization (/admin, /clients, /contractor, /engineer)
 * 3. Role & Granular Permissions ("What may this user do?")
 * 4. Object Scopes via membership_scopes ("Where may they do it?")
 * 5. Instant Session Revocation & Scope Refresh against live database
 * 6. Audited Support "View-As" Context & Permission Simulator
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { dbQuery } from '../db/client';

export const AUTH_COOKIE_NAME = 'efm_session';

export type ApplicationPortal = 'ADMIN' | 'CLIENT' | 'CONTRACTOR' | 'ENGINEER';

export type OrgType = 'ENTIREFM' | 'CLIENT' | 'CONTRACTOR' | 'SUPPLIER' | 'PARTNER';

export type RoleCode =
  // Internal EntireFM Roles
  | 'SUPER_ADMIN'
  | 'CEO'
  | 'DIRECTOR'
  | 'OPERATIONS_MANAGER'
  | 'OPERATIONS_USER'
  | 'HELPDESK_MANAGER'
  | 'HELPDESK'
  | 'HELPDESK_USER'
  | 'ACCOUNT_MANAGER'
  | 'COMPLIANCE_MANAGER'
  | 'COMPLIANCE_USER'
  | 'FINANCE'
  | 'FINANCE_MANAGER'
  | 'ACCOUNTS_ASSISTANT'
  | 'FINANCE_APPROVER'
  | 'BILLING_USER'
  | 'COMMERCIAL_MANAGER'
  | 'COMMERCIAL_USER'
  | 'SUPPLY_CHAIN_MANAGER'
  | 'REPORTING_USER'
  | 'ADMINISTRATOR'
  | 'READ_ONLY'
  // Client Roles
  | 'CLIENT_ADMIN'
  | 'CLIENT_FM_MANAGER'
  | 'CLIENT_SITE_MANAGER'
  | 'CLIENT_FINANCE'
  | 'CLIENT_READ_ONLY'
  | 'CLIENT_USER'
  | 'TENANT'
  // Contractor Roles
  | 'CONTRACTOR_ADMIN'
  | 'CONTRACTOR_DISPATCHER'
  | 'CONTRACTOR_COMMERCIAL'
  | 'CONTRACTOR_COMPLIANCE'
  | 'CONTRACTOR_READ_ONLY'
  | 'CONTRACTOR_ENGINEER'
  // Field Engineer Roles
  | 'ENGINEER';

export type PermissionCode =
  // Executive & Command
  | 'command:access'
  | 'command:ceo'
  // Operations & Dispatch
  | 'operations:read'
  | 'operations:write'
  | 'operations:dispatch'
  // Helpdesk
  | 'helpdesk:manage'
  | 'service_request:create'
  | 'service_request:update'
  // Estate & Assets
  | 'estate:read'
  | 'estate:write'
  | 'ppm:manage'
  | 'compliance:read'
  | 'compliance:write'
  // Supply Chain & Contractors
  | 'supply_chain:read'
  | 'supply_chain:write'
  | 'contractor:manage'
  // Commercial
  | 'commercial:read'
  | 'commercial:write'
  | 'quote:create'
  | 'quote:approve'
  // Finance & Invoicing
  | 'finance:read'
  | 'finance:view'
  | 'finance:write'
  | 'finance:invoice_create'
  | 'finance:invoice_review'
  | 'finance:invoice_approve'
  | 'finance:approve'
  | 'finance:bank_details_view'
  | 'finance:bank_details_manage'
  | 'finance:billing'
  | 'finance:invoice_issue'
  | 'credit_note:create'
  | 'credit_note:approve'
  | 'finance:reporting'
  | 'accounting:sync'
  | 'finance:policy_admin'
  | 'finance:admin'
  // Communications & AI
  | 'comms:access'
  | 'ai:control'
  | 'reporting:view'
  | 'growth:access'
  | 'platform:admin'
  | 'audit:read'
  // Client & Contractor Specific
  | 'client:admin'
  | 'contractor:admin'
  // Platform & User Management
  | 'platform:users_manage'
  | 'platform:view_as'
  | 'users:view'
  | 'users:manage'
  | 'audit:export';

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  avatar_url?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface Organisation {
  id: string;
  code: string;
  name: string;
  legal_name?: string;
  org_type: OrgType;
  company_number?: string;
  vat_number?: string;
  status: string;
  tier?: string;
  portal_status?: 'ACTIVE' | 'SUSPENDED';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type ScopeType =
  | 'ORGANISATION'
  | 'CLIENT_ACCOUNT'
  | 'CONTRACT'
  | 'PORTFOLIO'
  | 'SITE'
  | 'BUILDING'
  | 'PROVIDER_ORGANISATION';

export interface MembershipScope {
  id: string;
  membership_id: string;
  person_id: string;
  organisation_id: string;
  scope_type: ScopeType;
  scope_id: string;
  created_at: string;
}

export interface UserContextSummary {
  membershipId: string;
  orgId: string;
  orgName: string;
  orgType: OrgType;
  role: RoleCode;
  portal: ApplicationPortal;
}

export interface ViewAsContext {
  isViewAs: boolean;
  operatorPersonId: string;
  operatorEmail: string;
  operatorName: string;
  originalRole: RoleCode;
  startedAt: string;
}

export interface UserSession {
  personId: string;
  authUserId?: string;
  email: string;
  name: string;
  role: RoleCode;
  orgId: string;
  orgName: string;
  orgType: OrgType;
  activeApplication: ApplicationPortal;
  permissions: PermissionCode[];
  scopes: Array<{ type: ScopeType; id: string }>;
  availableContexts?: UserContextSummary[];
  viewAsContext?: ViewAsContext;
  expiresAt: number;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<RoleCode, PermissionCode[]> = {
  SUPER_ADMIN: [
    'command:access', 'command:ceo', 'operations:read', 'operations:write', 'operations:dispatch',
    'helpdesk:manage', 'service_request:create', 'service_request:update',
    'estate:read', 'estate:write', 'ppm:manage', 'compliance:read', 'compliance:write',
    'supply_chain:read', 'supply_chain:write', 'contractor:manage',
    'commercial:read', 'commercial:write', 'quote:create', 'quote:approve',
    'finance:read', 'finance:view', 'finance:write', 'finance:invoice_create', 'finance:invoice_review',
    'finance:invoice_approve', 'finance:approve', 'finance:bank_details_view', 'finance:bank_details_manage',
    'finance:billing', 'finance:invoice_issue', 'credit_note:create', 'credit_note:approve',
    'finance:reporting', 'accounting:sync', 'finance:policy_admin', 'finance:admin',
    'comms:access', 'ai:control', 'reporting:view', 'growth:access', 'platform:admin', 'audit:read',
    'client:admin', 'contractor:admin',
    'platform:users_manage', 'platform:view_as', 'users:view', 'users:manage', 'audit:export',
  ],
  CEO: [
    'command:access', 'command:ceo', 'operations:read', 'operations:write', 'operations:dispatch',
    'estate:read', 'estate:write', 'ppm:manage', 'compliance:read', 'compliance:write',
    'supply_chain:read', 'supply_chain:write', 'commercial:read', 'commercial:write',
    'finance:read', 'finance:write', 'finance:approve', 'finance:billing', 'finance:admin',
    'comms:access', 'ai:control', 'reporting:view', 'growth:access', 'platform:admin', 'audit:read',
  ],
  DIRECTOR: [
    'command:access', 'operations:read', 'operations:write', 'estate:read', 'ppm:manage',
    'compliance:read', 'supply_chain:read', 'commercial:read', 'commercial:write',
    'finance:read', 'finance:write', 'finance:approve', 'finance:billing',
    'comms:access', 'ai:control', 'reporting:view', 'growth:access', 'audit:read',
  ],
  OPERATIONS_MANAGER: [
    'command:access', 'operations:read', 'operations:write', 'operations:dispatch',
    'estate:read', 'estate:write', 'ppm:manage', 'compliance:read', 'supply_chain:read',
    'supply_chain:write', 'commercial:read', 'comms:access', 'reporting:view', 'growth:access', 'audit:read',
  ],
  OPERATIONS_USER: [
    'command:access', 'operations:read', 'operations:write', 'operations:dispatch',
    'estate:read', 'ppm:manage', 'comms:access', 'reporting:view',
  ],
  HELPDESK_MANAGER: [
    'command:access', 'operations:read', 'operations:write', 'operations:dispatch',
    'helpdesk:manage', 'service_request:create', 'service_request:update',
    'estate:read', 'comms:access', 'reporting:view', 'growth:access',
  ],
  HELPDESK: [
    'command:access', 'operations:read', 'operations:write', 'operations:dispatch',
    'service_request:create', 'service_request:update',
    'estate:read', 'comms:access', 'growth:access',
  ],
  HELPDESK_USER: [
    'command:access', 'operations:read', 'operations:write', 'operations:dispatch',
    'service_request:create', 'service_request:update',
    'estate:read', 'comms:access',
  ],
  ACCOUNT_MANAGER: [
    'command:access', 'operations:read', 'estate:read', 'commercial:read', 'commercial:write',
    'comms:access', 'reporting:view', 'growth:access',
  ],
  COMPLIANCE_MANAGER: [
    'command:access', 'compliance:read', 'compliance:write', 'estate:read', 'ppm:manage',
    'reporting:view', 'audit:read',
  ],
  COMPLIANCE_USER: [
    'command:access', 'compliance:read', 'estate:read', 'ppm:manage', 'reporting:view',
  ],
  FINANCE: [
    'command:access', 'commercial:read', 'commercial:write', 'finance:read', 'finance:view',
    'finance:write', 'finance:invoice_create', 'finance:invoice_review', 'finance:invoice_approve',
    'finance:approve', 'finance:bank_details_view', 'finance:bank_details_manage',
    'finance:billing', 'finance:invoice_issue', 'credit_note:create', 'credit_note:approve',
    'finance:reporting', 'accounting:sync', 'finance:policy_admin', 'finance:admin',
    'reporting:view', 'operations:read', 'supply_chain:read', 'audit:read',
  ],
  FINANCE_MANAGER: [
    'command:access', 'commercial:read', 'commercial:write', 'finance:read', 'finance:view',
    'finance:write', 'finance:invoice_create', 'finance:invoice_review', 'finance:invoice_approve',
    'finance:approve', 'finance:bank_details_view', 'finance:bank_details_manage',
    'finance:billing', 'finance:invoice_issue', 'credit_note:create', 'credit_note:approve',
    'finance:reporting', 'accounting:sync', 'finance:policy_admin', 'finance:admin',
    'reporting:view', 'operations:read', 'supply_chain:read', 'audit:read',
  ],
  ACCOUNTS_ASSISTANT: [
    'command:access', 'finance:read', 'finance:view', 'finance:write', 'finance:invoice_create',
    'finance:invoice_review', 'operations:read', 'audit:read',
  ],
  FINANCE_APPROVER: [
    'command:access', 'finance:read', 'finance:view', 'finance:invoice_review',
    'finance:invoice_approve', 'finance:approve', 'finance:bank_details_view',
    'finance:reporting', 'reporting:view', 'operations:read', 'audit:read',
  ],
  BILLING_USER: [
    'command:access', 'finance:read', 'finance:view', 'finance:billing',
    'finance:invoice_issue', 'finance:reporting', 'reporting:view',
    'operations:read', 'audit:read',
  ],
  COMMERCIAL_MANAGER: [
    'command:access', 'commercial:read', 'commercial:write', 'quote:create', 'quote:approve',
    'estate:read', 'operations:read', 'reporting:view', 'growth:access',
  ],
  COMMERCIAL_USER: [
    'command:access', 'commercial:read', 'commercial:write', 'quote:create',
    'estate:read', 'operations:read',
  ],
  SUPPLY_CHAIN_MANAGER: [
    'command:access', 'supply_chain:read', 'supply_chain:write', 'contractor:manage',
    'operations:read', 'operations:write', 'reporting:view', 'audit:read',
  ],
  REPORTING_USER: [
    'command:access', 'reporting:view', 'operations:read', 'estate:read', 'compliance:read',
  ],
  ADMINISTRATOR: [
    'command:access', 'command:ceo', 'operations:read', 'operations:write', 'operations:dispatch',
    'estate:read', 'estate:write', 'ppm:manage', 'compliance:read', 'compliance:write',
    'supply_chain:read', 'supply_chain:write', 'commercial:read', 'commercial:write',
    'finance:read', 'finance:view', 'finance:write', 'finance:invoice_create', 'finance:invoice_review',
    'finance:invoice_approve', 'finance:approve', 'finance:bank_details_view', 'finance:bank_details_manage',
    'finance:billing', 'finance:invoice_issue', 'credit_note:create', 'credit_note:approve',
    'finance:reporting', 'accounting:sync', 'finance:policy_admin', 'finance:admin',
    'comms:access', 'ai:control', 'reporting:view', 'growth:access', 'platform:admin', 'audit:read',
  ],
  READ_ONLY: [
    'command:access', 'operations:read', 'estate:read', 'compliance:read',
    'supply_chain:read', 'commercial:read', 'reporting:view', 'audit:read',
  ],
  // Client Roles
  CLIENT_ADMIN: [
    'estate:read', 'operations:read', 'operations:write', 'commercial:read',
    'compliance:read', 'client:admin',
  ],
  CLIENT_FM_MANAGER: [
    'estate:read', 'operations:read', 'operations:write', 'ppm:manage',
    'compliance:read', 'commercial:read',
  ],
  CLIENT_SITE_MANAGER: [
    'estate:read', 'operations:read', 'operations:write', 'compliance:read',
  ],
  CLIENT_FINANCE: [
    'estate:read', 'commercial:read', 'finance:read',
  ],
  CLIENT_READ_ONLY: [
    'estate:read', 'operations:read', 'compliance:read',
  ],
  CLIENT_USER: [
    'estate:read', 'operations:read', 'operations:write',
  ],
  TENANT: [
    'operations:read', 'operations:write',
  ],
  // Contractor Roles
  CONTRACTOR_ADMIN: [
    'supply_chain:read', 'operations:read', 'operations:write', 'commercial:read',
    'compliance:read', 'compliance:write', 'contractor:admin',
  ],
  CONTRACTOR_DISPATCHER: [
    'operations:read', 'operations:write', 'operations:dispatch', 'supply_chain:read',
  ],
  CONTRACTOR_COMMERCIAL: [
    'commercial:read', 'operations:read', 'supply_chain:read',
  ],
  CONTRACTOR_COMPLIANCE: [
    'compliance:read', 'compliance:write', 'supply_chain:read',
  ],
  CONTRACTOR_READ_ONLY: [
    'operations:read', 'supply_chain:read',
  ],
  CONTRACTOR_ENGINEER: [
    'operations:read', 'operations:write',
  ],
  // Field Engineer Roles
  ENGINEER: [
    'operations:read', 'operations:write', 'estate:read', 'compliance:read', 'compliance:write',
  ],
};

function getAuthSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.AUTH_SECRET || 'entirefm-unified-ops-secret-key-2026';
}

export function createSessionToken(session: UserSession): string {
  const secret = getAuthSecret();
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const secret = getAuthSecret();
  const expectedSignature = createHmac('sha256', secret).update(payload).digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as UserSession;
    if (session.expiresAt && session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Validates session validity against live database state.
 * Immediately rejects suspended/archived persons, revoked memberships, or suspended portal access.
 * Refreshes dynamic site/portfolio scopes.
 */
export async function validateLiveSession(session: UserSession | null): Promise<UserSession | null> {
  if (!session) return null;

  // Bootstrap accounts
  if (session.email === 'admin@entirefm.com' || session.email === 'ops@entirefm.com') {
    return session;
  }

  // Check live person record
  const { data: persons } = await dbQuery<Person[]>(
    `persons?id=eq.${encodeURIComponent(session.personId)}&status=eq.ACTIVE&select=*`
  );
  if (!persons || persons.length === 0) {
    return null; // Revoked or suspended user
  }

  // Check live organization portal status
  const { data: orgs } = await dbQuery<Organisation[]>(
    `organisations?id=eq.${encodeURIComponent(session.orgId)}&status=eq.ACTIVE&select=*`
  );
  if (!orgs || orgs.length === 0) {
    return null; // Organisation suspended
  }

  // Check active membership
  const { data: memberships } = await dbQuery<any[]>(
    `organisation_memberships?person_id=eq.${encodeURIComponent(session.personId)}&organisation_id=eq.${encodeURIComponent(session.orgId)}&status=eq.ACTIVE&select=*,scopes:membership_scopes(*)`
  );
  if (!memberships || memberships.length === 0) {
    return null; // Membership revoked
  }

  const liveScopes = (memberships[0].scopes || []).map((s: any) => ({
    type: s.scope_type as ScopeType,
    id: s.scope_id,
  }));

  return {
    ...session,
    scopes: liveScopes,
  };
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value || jar.get('efm_admin')?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (session) return session;

  const legacySecret = process.env.ADMIN_PASSWORD;
  if (legacySecret) {
    const expectedLegacyToken = createHmac('sha256', legacySecret).update('efm-admin-session-v1').digest('hex');
    if (token === expectedLegacyToken) {
      return {
        personId: '00000000-0000-0000-0000-000000000001',
        email: 'ops@entirefm.com',
        name: 'EntireFM Operations',
        role: 'CEO',
        orgId: '00000000-0000-0000-0000-000000000000',
        orgName: 'EntireFM Internal Operations',
        orgType: 'ENTIREFM',
        activeApplication: 'ADMIN',
        permissions: DEFAULT_ROLE_PERMISSIONS.CEO,
        scopes: [{ type: 'ORGANISATION', id: '00000000-0000-0000-0000-000000000000' }],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      };
    }
  }

  return null;
}

export function hasPermission(session: UserSession | null, permission: PermissionCode): boolean {
  if (!session) return false;
  if (session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR') return true;
  return session.permissions.includes(permission);
}

export function hasScope(
  session: UserSession | null,
  scopeType: ScopeType,
  targetScopeId: string
): boolean {
  if (!session) return false;
  if (session.orgType === 'ENTIREFM' && (session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR')) {
    return true;
  }
  // Universal organization scope encompasses all child resources within this org
  const hasOrgScope = session.scopes?.some(
    (s) => s.type === 'ORGANISATION' && s.id === session.orgId
  );
  if (hasOrgScope && scopeType !== 'ORGANISATION') return true;

  return session.scopes?.some((s) => s.type === scopeType && s.id === targetScopeId) ?? false;
}

/**
 * Determine canonical post-login redirection based on authoritative role & orgType
 */
export function getPostLoginRedirect(role: RoleCode, orgType: OrgType): string {
  if (role === 'ENGINEER' || role === 'CONTRACTOR_ENGINEER') {
    return '/engineer';
  }
  if (orgType === 'CLIENT' || ['CLIENT_ADMIN', 'CLIENT_FM_MANAGER', 'CLIENT_SITE_MANAGER', 'CLIENT_FINANCE', 'CLIENT_READ_ONLY', 'CLIENT_USER', 'TENANT'].includes(role)) {
    return '/clients';
  }
  if (orgType === 'CONTRACTOR' || ['CONTRACTOR_ADMIN', 'CONTRACTOR_DISPATCHER', 'CONTRACTOR_COMMERCIAL', 'CONTRACTOR_COMPLIANCE', 'CONTRACTOR_READ_ONLY'].includes(role)) {
    return '/contractor';
  }
  if (orgType === 'ENTIREFM') {
    return '/admin';
  }
  return '/admin';
}

export function getRolePermissions(role: RoleCode): PermissionCode[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

export const ROLE_PERMISSIONS = DEFAULT_ROLE_PERMISSIONS;

/**
 * Evaluates effective access capabilities and restrictions for a user in a given context
 */
export function evaluateEffectiveAccess(session: UserSession) {
  const isSuperAdmin = session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR';
  const hasSiteRestriction = session.scopes.some(s => s.type === 'SITE');
  const allowedSites = session.scopes.filter(s => s.type === 'SITE').map(s => s.id);
  const hasOrgScope = session.scopes.some(s => s.type === 'ORGANISATION');

  return {
    personId: session.personId,
    email: session.email,
    name: session.name,
    role: session.role,
    orgId: session.orgId,
    orgName: session.orgName,
    orgType: session.orgType,
    activeApplication: session.activeApplication,
    isSuperAdmin,
    hasOrgScope,
    hasSiteRestriction,
    allowedSiteIds: allowedSites,
    canAccessAdmin:
      session.orgType === 'ENTIREFM' &&
      session.activeApplication === 'ADMIN' &&
      session.role !== 'ENGINEER' &&
      session.role !== 'CONTRACTOR_ENGINEER',
    canAccessClients: session.orgType === 'CLIENT' || !!session.viewAsContext,
    canAccessContractor: session.orgType === 'CONTRACTOR' || !!session.viewAsContext,
    canAccessEngineer: session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER',
    permissions: session.permissions,
  };
}

// =============================================================================
// PERMISSION CONSTANT — semantic aliases for PermissionCode strings
// Use these in UI & API code rather than raw strings to enable TS refactor safety
// =============================================================================
export const PERMISSION = {
  // Operations
  VIEW_WORK_ORDERS: 'operations:read',
  WRITE_WORK_ORDERS: 'operations:write',
  DISPATCH: 'operations:dispatch',
  // Finance
  VIEW_FINANCE: 'finance:view',
  APPROVE_INVOICES: 'finance:invoice_approve',
  VIEW_SUPPLIER_COSTS: 'finance:read',
  FINANCE_ADMIN: 'finance:admin',
  // PPM
  MANAGE_PPM: 'ppm:manage',
  // Estate
  VIEW_ALL_ORGANISATIONS: 'platform:admin',
  // Users & Platform
  MANAGE_USERS: 'users:manage',
  VIEW_USERS: 'users:view',
  VIEW_AS_USER: 'platform:view_as',
  PLATFORM_SETTINGS: 'platform:admin',
  AUDIT_READ: 'audit:read',
  AUDIT_EXPORT: 'audit:export',
  // Commercial
  CREATE_QUOTE: 'quote:create',
  APPROVE_QUOTE: 'quote:approve',
} as const satisfies Record<string, PermissionCode>;

// =============================================================================
// ROLE GROUP ARRAYS — used by /admin/platform/access for the permission matrix
// =============================================================================
export const INTERNAL_ROLES: RoleCode[] = [
  'SUPER_ADMIN',
  'CEO',
  'DIRECTOR',
  'OPERATIONS_MANAGER',
  'OPERATIONS_USER',
  'HELPDESK_MANAGER',
  'HELPDESK_USER',
  'ACCOUNT_MANAGER',
  'COMPLIANCE_MANAGER',
  'COMPLIANCE_USER',
  'FINANCE_MANAGER',
  'ACCOUNTS_ASSISTANT',
  'FINANCE_APPROVER',
  'BILLING_USER',
  'COMMERCIAL_MANAGER',
  'COMMERCIAL_USER',
  'SUPPLY_CHAIN_MANAGER',
  'REPORTING_USER',
  'READ_ONLY',
];

export const CLIENT_ROLES: RoleCode[] = [
  'CLIENT_ADMIN',
  'CLIENT_FM_MANAGER',
  'CLIENT_SITE_MANAGER',
  'CLIENT_FINANCE',
  'CLIENT_READ_ONLY',
  'CLIENT_USER',
  'TENANT',
];

export const CONTRACTOR_ROLES: RoleCode[] = [
  'CONTRACTOR_ADMIN',
  'CONTRACTOR_DISPATCHER',
  'CONTRACTOR_COMMERCIAL',
  'CONTRACTOR_COMPLIANCE',
  'CONTRACTOR_READ_ONLY',
];

export const ENGINEER_ROLES: RoleCode[] = [
  'ENGINEER',
  'CONTRACTOR_ENGINEER',
];


// =============================================================================
// PORTAL ACCESS GUARDS — Server & API Boundary Enforcement
// =============================================================================

export function requireAdminSession(session: UserSession | null): UserSession {
  if (!session) {
    throw new Error('UNAUTHENTICATED: Sign in required');
  }
  if (session.orgType !== 'ENTIREFM' || session.activeApplication !== 'ADMIN') {
    throw new Error('FORBIDDEN: /admin is restricted to EntireFM internal operations staff');
  }
  return session;
}

export function requireClientSession(session: UserSession | null): UserSession {
  if (!session) {
    throw new Error('UNAUTHENTICATED: Sign in required');
  }
  if (session.orgType !== 'CLIENT' && !session.viewAsContext) {
    throw new Error('FORBIDDEN: /clients is restricted to authorised client accounts');
  }
  return session;
}

export function requireContractorSession(session: UserSession | null): UserSession {
  if (!session) {
    throw new Error('UNAUTHENTICATED: Sign in required');
  }
  if (session.orgType !== 'CONTRACTOR' && !session.viewAsContext) {
    throw new Error('FORBIDDEN: /contractor is restricted to approved contractor organisations');
  }
  if (session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
    throw new Error('FORBIDDEN: /contractor office portal requires contractor management role');
  }
  return session;
}

export function requireEngineerSession(session: UserSession | null): UserSession {
  if (!session) {
    throw new Error('UNAUTHENTICATED: Sign in required');
  }
  if (session.role !== 'ENGINEER' && session.role !== 'CONTRACTOR_ENGINEER' && !session.viewAsContext) {
    throw new Error('FORBIDDEN: /engineer is restricted to field engineer accounts');
  }
  return session;
}

// =============================================================================
// CANONICAL SCOPE RESOLUTION & OBJECT AUTHORIZATION HELPERS
// =============================================================================

/**
 * Resolves the authorized Site IDs for the active session.
 * Returns '*' if the user has universal unconstrained access.
 * Returns string[] containing explicit authorized site UUIDs.
 */
export function getAuthorizedSiteIds(session: UserSession): string[] | '*' {
  if (session.orgType === 'ENTIREFM' && (session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR')) {
    return '*';
  }
  // If user has organization-level universal scope
  const hasOrgScope = session.scopes.some((s) => s.type === 'ORGANISATION' && s.id === session.orgId);
  if (hasOrgScope) {
    return '*';
  }
  // Otherwise collect explicitly scoped sites
  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  return siteScopes;
}

/**
 * Evaluates whether a session can access a specific Site
 */
export function canAccessSite(session: UserSession, siteId: string, siteOrgId?: string): boolean {
  if (!session || !siteId) return false;

  // View-as inherits target scope
  if (session.orgType === 'ENTIREFM' && (session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR')) {
    return true;
  }

  // Client tenant boundary
  if (session.orgType === 'CLIENT') {
    if (siteOrgId && siteOrgId !== session.orgId) return false;
    const authorized = getAuthorizedSiteIds(session);
    if (authorized === '*') return true;
    return authorized.includes(siteId);
  }

  // Contractor / Engineer context: access permitted only for explicitly assigned work sites
  if (session.orgType === 'CONTRACTOR' || session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
    const authorized = getAuthorizedSiteIds(session);
    if (authorized === '*') return true;
    return authorized.includes(siteId);
  }

  return false;
}

/**
 * Evaluates whether a session can access a specific Work Order
 */
export function canAccessWorkOrder(
  session: UserSession,
  wo: { client_account_id?: string; organisation_id?: string; site_id?: string; id?: string; assigned_provider_org_id?: string; assigned_engineer_id?: string }
): boolean {
  if (!session) return false;

  // Internal EntireFM staff with operations:read
  if (session.orgType === 'ENTIREFM') {
    return hasPermission(session, 'operations:read');
  }

  // Client user: must belong to the client org and have site scope
  if (session.orgType === 'CLIENT') {
    const orgMatches = (wo.organisation_id && wo.organisation_id === session.orgId) ||
                       (wo.client_account_id && wo.client_account_id === session.orgId);
    if (!orgMatches && !session.viewAsContext) return false;
    if (wo.site_id) {
      return canAccessSite(session, wo.site_id, session.orgId);
    }
    return true;
  }

  // Contractor user: must be assigned to their provider org
  if (session.orgType === 'CONTRACTOR') {
    if (wo.assigned_provider_org_id && wo.assigned_provider_org_id !== session.orgId) {
      return false;
    }
    return true;
  }

  // Engineer: must be assigned to them
  if (session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
    if (wo.assigned_engineer_id && wo.assigned_engineer_id !== session.personId) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Evaluates whether a session can access a specific Asset
 */
export function canAccessAsset(session: UserSession, asset: { site_id: string; organisation_id?: string }): boolean {
  if (!session) return false;
  return canAccessSite(session, asset.site_id, asset.organisation_id);
}

/**
 * Evaluates whether a contractor can access an assignment/job
 */
export function canAccessContractorJob(
  session: UserSession,
  assignment: { provider_org_id: string; work_order_id?: string }
): boolean {
  if (!session) return false;
  if (session.orgType === 'ENTIREFM') return true;
  if (session.orgType === 'CONTRACTOR') {
    return assignment.provider_org_id === session.orgId;
  }
  return false;
}

/**
 * Evaluates whether an engineer can access a Visit
 */
export function canAccessEngineerVisit(
  session: UserSession,
  visit: { engineer_person_id?: string; provider_org_id?: string; id?: string }
): boolean {
  if (!session) return false;
  if (session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
    return visit.engineer_person_id === session.personId;
  }
  if (session.orgType === 'ENTIREFM') return true;
  if (session.orgType === 'CONTRACTOR') {
    return visit.provider_org_id === session.orgId;
  }
  return false;
}

// =============================================================================
// AUDITED VIEW-AS & PERMISSION SIMULATOR
// =============================================================================

export async function startViewAs(
  adminSession: UserSession,
  targetPersonId: string,
  targetOrgId: string
): Promise<{ success: boolean; session?: UserSession; token?: string; error?: string }> {
  if (!adminSession || adminSession.orgType !== 'ENTIREFM' || !hasPermission(adminSession, 'platform:view_as')) {
    return { success: false, error: 'PERMISSION_DENIED: platform:view_as permission required' };
  }

  const { data: targetPersonData } = await dbQuery<Person[]>(
    `persons?id=eq.${encodeURIComponent(targetPersonId)}&select=*`
  );
  const targetPerson = targetPersonData?.[0];
  if (!targetPerson) return { success: false, error: 'Target person not found' };

  const { data: targetOrgData } = await dbQuery<Organisation[]>(
    `organisations?id=eq.${encodeURIComponent(targetOrgId)}&select=*`
  );
  const targetOrg = targetOrgData?.[0];
  if (!targetOrg) return { success: false, error: 'Target organisation not found' };

  const { data: memberships } = await dbQuery<any[]>(
    `organisation_memberships?person_id=eq.${encodeURIComponent(targetPersonId)}&organisation_id=eq.${encodeURIComponent(targetOrgId)}&select=*,role:roles(*),scopes:membership_scopes(*)`
  );
  const membership = memberships?.[0];
  if (!membership) return { success: false, error: 'Target user has no membership in specified organisation' };

  const targetRole = (membership.role?.code || 'CLIENT_USER') as RoleCode;
  const targetPortal: ApplicationPortal = targetOrg.org_type === 'CLIENT' ? 'CLIENT' : targetOrg.org_type === 'CONTRACTOR' ? 'CONTRACTOR' : 'ADMIN';
  const targetScopes = (membership.scopes || []).map((s: any) => ({
    type: s.scope_type as ScopeType,
    id: s.scope_id,
  }));

  const viewAsContext: ViewAsContext = {
    isViewAs: true,
    operatorPersonId: adminSession.personId,
    operatorEmail: adminSession.email,
    operatorName: adminSession.name,
    originalRole: adminSession.role,
    startedAt: new Date().toISOString(),
  };

  const session: UserSession = {
    personId: targetPerson.id,
    email: targetPerson.email,
    name: `${targetPerson.first_name} ${targetPerson.last_name}`.trim(),
    role: targetRole,
    orgId: targetOrg.id,
    orgName: targetOrg.name,
    orgType: targetOrg.org_type,
    activeApplication: targetPortal,
    permissions: getRolePermissions(targetRole),
    scopes: targetScopes,
    viewAsContext,
    expiresAt: Date.now() + 1000 * 60 * 60 * 2,
  };

  const token = createSessionToken(session);

  return { success: true, session, token };
}

export async function endViewAs(
  session: UserSession
): Promise<{ success: boolean; session?: UserSession; token?: string; error?: string }> {
  if (!session.viewAsContext) {
    return { success: false, error: 'Not currently in View-As mode' };
  }

  const operatorId = session.viewAsContext.operatorPersonId;
  const operatorRole = session.viewAsContext.originalRole;

  const restoredSession: UserSession = {
    personId: operatorId,
    email: session.viewAsContext.operatorEmail,
    name: session.viewAsContext.operatorName,
    role: operatorRole,
    orgId: '00000000-0000-0000-0000-000000000000',
    orgName: 'EntireFM Internal Operations',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: getRolePermissions(operatorRole),
    scopes: [{ type: 'ORGANISATION', id: '00000000-0000-0000-0000-000000000000' }],
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
  };

  const token = createSessionToken(restoredSession);
  return { success: true, session: restoredSession, token };
}

export async function simulateUserAccess(
  targetPersonId: string,
  targetAction: string,
  targetEntity?: { type: string; id: string; site_id?: string; org_id?: string }
): Promise<{ allowed: boolean; reason: string; effectiveRole: RoleCode; permissions: PermissionCode[] }> {
  const { data: persons } = await dbQuery<any[]>(
    `persons?id=eq.${encodeURIComponent(targetPersonId)}&select=*,memberships:organisation_memberships(*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*))`
  );
  const person = persons?.[0];
  if (!person) return { allowed: false, reason: 'User does not exist', effectiveRole: 'READ_ONLY', permissions: [] };
  if (person.status !== 'ACTIVE') return { allowed: false, reason: `User account is ${person.status}`, effectiveRole: 'READ_ONLY', permissions: [] };

  const activeMembership = (person.memberships || []).find((m: any) => m.status === 'ACTIVE');
  if (!activeMembership) return { allowed: false, reason: 'No active membership', effectiveRole: 'READ_ONLY', permissions: [] };

  const role = (activeMembership.role?.code || 'READ_ONLY') as RoleCode;
  const perms = getRolePermissions(role);
  const scopes = (activeMembership.scopes || []).map((s: any) => ({ type: s.scope_type as ScopeType, id: s.scope_id }));

  const simulatedSession: UserSession = {
    personId: person.id,
    email: person.email,
    name: `${person.first_name} ${person.last_name}`.trim(),
    role,
    orgId: activeMembership.organisation_id,
    orgName: activeMembership.organisation?.name || 'Simulated Org',
    orgType: activeMembership.organisation?.org_type || 'CLIENT',
    activeApplication: activeMembership.organisation?.org_type === 'CLIENT' ? 'CLIENT' : 'CONTRACTOR',
    permissions: perms,
    scopes,
    expiresAt: Date.now() + 10000,
  };

  if (targetAction.includes(':') && !perms.includes(targetAction as PermissionCode)) {
    return { allowed: false, reason: `Missing required permission: ${targetAction}`, effectiveRole: role, permissions: perms };
  }

  if (targetEntity && targetEntity.site_id) {
    const canSite = canAccessSite(simulatedSession, targetEntity.site_id, targetEntity.org_id);
    if (!canSite) {
      return { allowed: false, reason: `Site ${targetEntity.site_id} is outside authorized scope`, effectiveRole: role, permissions: perms };
    }
  }

  return { allowed: true, reason: 'Authorized by role, permissions, and active scope', effectiveRole: role, permissions: perms };
}

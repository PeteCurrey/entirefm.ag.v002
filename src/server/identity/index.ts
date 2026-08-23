/**
 * ENTIREFM IDENTITY & ACCESS DOMAIN MODULE
 * ========================================
 * Implements Person, UserIdentity, Organisation, Membership, Roles, and Granular Permissions.
 * Server-enforced security boundaries.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { dbQuery } from '../db/client';

export const AUTH_COOKIE_NAME = 'efm_session';

export type OrgType = 'ENTIREFM' | 'CLIENT' | 'CONTRACTOR' | 'SUPPLIER' | 'PARTNER';

export type RoleCode =
  | 'CEO'
  | 'DIRECTOR'
  | 'OPERATIONS_MANAGER'
  | 'HELPDESK'
  | 'ACCOUNT_MANAGER'
  | 'COMPLIANCE_MANAGER'
  | 'FINANCE'
  | 'ENGINEER'
  | 'ADMINISTRATOR'
  | 'READ_ONLY'
  | 'CLIENT_ADMIN'
  | 'CLIENT_USER'
  | 'TENANT'
  | 'CONTRACTOR_ADMIN'
  | 'CONTRACTOR_DISPATCHER'
  | 'CONTRACTOR_ENGINEER';

export type PermissionCode =
  | 'command:access'
  | 'command:ceo'
  | 'operations:read'
  | 'operations:write'
  | 'operations:dispatch'
  | 'estate:read'
  | 'estate:write'
  | 'ppm:manage'
  | 'compliance:read'
  | 'compliance:write'
  | 'supply_chain:read'
  | 'supply_chain:write'
  | 'commercial:read'
  | 'commercial:write'
  | 'comms:access'
  | 'ai:control'
  | 'reporting:view'
  | 'growth:access'
  | 'platform:admin'
  | 'audit:read';

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
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  personId: string;
  email: string;
  name: string;
  role: RoleCode;
  orgId: string;
  orgName: string;
  orgType: OrgType;
  permissions: PermissionCode[];
  expiresAt: number;
}

const DEFAULT_ROLE_PERMISSIONS: Record<RoleCode, PermissionCode[]> = {
  CEO: [
    'command:access',
    'command:ceo',
    'operations:read',
    'operations:write',
    'operations:dispatch',
    'estate:read',
    'estate:write',
    'ppm:manage',
    'compliance:read',
    'compliance:write',
    'supply_chain:read',
    'supply_chain:write',
    'commercial:read',
    'commercial:write',
    'comms:access',
    'ai:control',
    'reporting:view',
    'growth:access',
    'platform:admin',
    'audit:read',
  ],
  DIRECTOR: [
    'command:access',
    'operations:read',
    'operations:write',
    'estate:read',
    'ppm:manage',
    'compliance:read',
    'supply_chain:read',
    'commercial:read',
    'commercial:write',
    'comms:access',
    'ai:control',
    'reporting:view',
    'growth:access',
    'audit:read',
  ],
  OPERATIONS_MANAGER: [
    'command:access',
    'operations:read',
    'operations:write',
    'operations:dispatch',
    'estate:read',
    'estate:write',
    'ppm:manage',
    'compliance:read',
    'supply_chain:read',
    'supply_chain:write',
    'commercial:read',
    'comms:access',
    'reporting:view',
    'growth:access',
    'audit:read',
  ],
  HELPDESK: [
    'command:access',
    'operations:read',
    'operations:write',
    'operations:dispatch',
    'estate:read',
    'comms:access',
    'growth:access',
  ],
  ACCOUNT_MANAGER: [
    'command:access',
    'operations:read',
    'estate:read',
    'commercial:read',
    'commercial:write',
    'comms:access',
    'reporting:view',
    'growth:access',
  ],
  COMPLIANCE_MANAGER: [
    'command:access',
    'compliance:read',
    'compliance:write',
    'estate:read',
    'ppm:manage',
    'reporting:view',
    'audit:read',
  ],
  FINANCE: [
    'command:access',
    'commercial:read',
    'commercial:write',
    'reporting:view',
    'operations:read',
    'audit:read',
  ],
  ENGINEER: [
    'operations:read',
    'operations:write',
    'estate:read',
    'compliance:read',
    'compliance:write',
  ],
  ADMINISTRATOR: [
    'command:access',
    'command:ceo',
    'operations:read',
    'operations:write',
    'operations:dispatch',
    'estate:read',
    'estate:write',
    'ppm:manage',
    'compliance:read',
    'compliance:write',
    'supply_chain:read',
    'supply_chain:write',
    'commercial:read',
    'commercial:write',
    'comms:access',
    'ai:control',
    'reporting:view',
    'growth:access',
    'platform:admin',
    'audit:read',
  ],
  READ_ONLY: [
    'command:access',
    'operations:read',
    'estate:read',
    'compliance:read',
    'supply_chain:read',
    'commercial:read',
    'reporting:view',
    'audit:read',
  ],
  CLIENT_ADMIN: ['estate:read', 'operations:read', 'operations:write', 'commercial:read'],
  CLIENT_USER: ['estate:read', 'operations:read', 'operations:write'],
  TENANT: ['operations:read', 'operations:write'],
  CONTRACTOR_ADMIN: ['supply_chain:read', 'operations:read', 'operations:write', 'commercial:read'],
  CONTRACTOR_DISPATCHER: ['operations:read', 'operations:write', 'operations:dispatch'],
  CONTRACTOR_ENGINEER: ['operations:read', 'operations:write'],
};

function getAuthSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.AUTH_SECRET || 'entirefm-unified-ops-secret-key-2026';
}

/**
 * Sign session payload into an HMAC tamper-proof token
 */
export function createSessionToken(session: UserSession): string {
  const secret = getAuthSecret();
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

/**
 * Verify and decode an HMAC session token
 */
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
 * Get current authenticated user session from Next.js server cookie context
 */
export async function getCurrentSession(): Promise<UserSession | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value || jar.get('efm_admin')?.value;
  if (!token) return null;

  // Handle standard session token
  const session = verifySessionToken(token);
  if (session) return session;

  // Backward compatibility with legacy admin password token
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
        permissions: DEFAULT_ROLE_PERMISSIONS.CEO,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      };
    }
  }

  return null;
}

/**
 * Verify whether a session has a specific permission code
 */
export function hasPermission(session: UserSession | null, permission: PermissionCode): boolean {
  if (!session) return false;
  if (session.role === 'CEO' || session.role === 'ADMINISTRATOR') return true;
  return session.permissions.includes(permission);
}

/**
 * Determine default destination portal based on user role and org type
 */
export function getPostLoginRedirect(role: RoleCode, orgType: OrgType): string {
  if (role === 'ENGINEER' || role === 'CONTRACTOR_ENGINEER') {
    return '/engineer';
  }
  if (orgType === 'CLIENT' || ['CLIENT_ADMIN', 'CLIENT_USER', 'TENANT'].includes(role)) {
    return '/client';
  }
  if (orgType === 'CONTRACTOR' || ['CONTRACTOR_ADMIN', 'CONTRACTOR_DISPATCHER'].includes(role)) {
    return '/contractor';
  }
  if (orgType === 'ENTIREFM' || ['CEO', 'DIRECTOR', 'OPERATIONS_MANAGER', 'HELPDESK', 'ACCOUNT_MANAGER', 'COMPLIANCE_MANAGER', 'FINANCE', 'ADMINISTRATOR', 'READ_ONLY'].includes(role)) {
    return '/admin';
  }
  return '/admin';
}

/**
 * Get permission list for any given role
 */
export function getRolePermissions(role: RoleCode): PermissionCode[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

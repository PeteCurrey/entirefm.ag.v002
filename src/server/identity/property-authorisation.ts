/**
 * ENTIREFM PROPERTY AUTHORISATION & EFFECTIVE SCOPE ENGINE
 * ==============================================================================
 * Single Source of Truth for:
 * 1. Role Authority vs Property Scope Separation
 * 2. Role Precedence & Multi-Role Conflict Resolution
 * 3. Scope Formula:
 *    Effective Scope =
 *        UNION(valid positive grants)
 *        INTERSECT(mandatory security boundaries / property restrictions)
 *        EXCEPT(explicit denies / revocations)
 *        EXCEPT(inactive / suspended resources)
 * 4. Action-Specific Checks ('property:search' vs 'job:create')
 * 5. Safe Response Projections (zero client-data leakage)
 *
 * TENANCY & ACCESS PRINCIPLE:
 * "Legitimate access is additive. Security restrictions are narrowing."
 * A broader role never erases a narrower explicit restriction, and a narrower
 * role never arbitrarily erases another legitimate positive grant.
 * The browser NEVER determines what properties the user can access.
 */

import { dbQuery } from '../db/client';
import { UserSession, RoleCode, ScopeType, hasPermission } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

export type PropertyAction = 'property:search' | 'property:view' | 'job:create';

export interface PropertySearchResult {
  id: string;
  name: string;
  postcode?: string;
}

export interface PropertyScopeResult {
  allowed: boolean;
  isPlatformWide: boolean;
  /** Allowed organisation UUIDs (UNION of valid positive organisation scopes) */
  allowedOrgIds?: string[];
  /** Allowed site UUIDs (if narrowed by explicit SITE restrictions) */
  allowedSiteIds?: string[];
  /** Explicitly denied site UUIDs */
  deniedSiteIds?: string[];
  grants: string[];
  restrictions: string[];
  denials: string[];
  reason?: string;
}

export interface PropertyAccessDecision {
  allowed: boolean;
  action: PropertyAction;
  propertyId: string;
  grants: string[];
  restrictions: string[];
  denials: string[];
  reason?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROLE PRECEDENCE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const PLATFORM_ADMIN_ROLES: ReadonlySet<RoleCode> = new Set<RoleCode>([
  'SUPER_ADMIN',
  'CEO',
  'DIRECTOR',
  'ADMINISTRATOR',
]);

const INTERNAL_OPERATIONS_ROLES: ReadonlySet<RoleCode> = new Set<RoleCode>([
  'OPERATIONS_MANAGER',
  'OPERATIONS_USER',
  'HELPDESK_MANAGER',
  'HELPDESK',
  'HELPDESK_USER',
  'COMPLIANCE_MANAGER',
  'COMPLIANCE_USER',
  'COMMERCIAL_MANAGER',
  'COMMERCIAL_USER',
  'SUPPLY_CHAIN_MANAGER',
  'REPORTING_USER',
]);

const CLIENT_ROLES: ReadonlySet<RoleCode> = new Set<RoleCode>([
  'CLIENT_ADMIN',
  'CLIENT_FM_MANAGER',
  'CLIENT_SITE_MANAGER',
  'CLIENT_FINANCE',
  'CLIENT_READ_ONLY',
  'CLIENT_USER',
  'TENANT',
]);

const CONTRACTOR_ROLES: ReadonlySet<RoleCode> = new Set<RoleCode>([
  'CONTRACTOR_ADMIN',
  'CONTRACTOR_DISPATCHER',
  'CONTRACTOR_COMMERCIAL',
  'CONTRACTOR_COMPLIANCE',
  'CONTRACTOR_READ_ONLY',
  'CONTRACTOR_ENGINEER',
  'ENGINEER',
]);

// ─────────────────────────────────────────────────────────────────────────────
// ACTION AUTHORITY CHECKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks whether the user's role and identity permits discovering properties
 * through the Log a Job interface.
 *
 * CRITICAL TENANT ISOLATION RULE:
 * Contractors and suppliers must NEVER discover client properties via Log a Job.
 * Unauthenticated requests are rejected.
 */
export function canSearchProperties(session: UserSession | null): boolean {
  if (!session) return false;

  // Contractors & Suppliers are strictly prohibited from discovering client estates
  if (session.orgType === 'CONTRACTOR' || session.orgType === 'SUPPLIER') {
    return false;
  }

  // Internal EntireFM staff and Client users are permitted
  if (session.orgType === 'ENTIREFM' || session.orgType === 'CLIENT') {
    return true;
  }

  // View-as support context inherits permitted client/admin visibility
  if (session.viewAsContext?.isViewAs) {
    return true;
  }

  return false;
}

/**
 * Checks whether the user has general authority to create a job / service request.
 */
export function hasJobCreationAuthority(session: UserSession | null): boolean {
  if (!session) return false;

  // Platform Admins & Operations always have write authority
  if (session.orgType === 'ENTIREFM') {
    return (
      PLATFORM_ADMIN_ROLES.has(session.role) ||
      INTERNAL_OPERATIONS_ROLES.has(session.role) ||
      hasPermission(session, 'operations:write') ||
      hasPermission(session, 'service_request:create')
    );
  }

  // Client users permitted to submit maintenance requests
  if (session.orgType === 'CLIENT') {
    // Exclude strict read-only / finance roles that do not log maintenance
    if (session.role === 'CLIENT_READ_ONLY' || session.role === 'CLIENT_FINANCE') {
      return false;
    }
    return true; // CLIENT_ADMIN, CLIENT_FM_MANAGER, CLIENT_SITE_MANAGER, CLIENT_USER, TENANT
  }

  if (session.viewAsContext?.isViewAs) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SEARCH SCOPE RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the effective property search scope for an authenticated session.
 *
 * Formula:
 * Effective Scope =
 *   UNION(valid positive grants)
 *   INTERSECT(mandatory security boundaries / property restrictions)
 *   EXCEPT(explicit denies / revocations)
 *   EXCEPT(inactive / suspended resources)
 */
export async function resolvePropertySearchScope(
  session: UserSession | null
): Promise<PropertyScopeResult> {
  const grants: string[] = [];
  const restrictions: string[] = [];
  const denials: string[] = [];

  // 1. Authentication check
  if (!session) {
    return {
      allowed: false,
      isPlatformWide: false,
      grants,
      restrictions,
      denials,
      reason: 'UNAUTHENTICATED',
    };
  }

  // 2. Prohibit contractor/supplier estate discovery
  if (!canSearchProperties(session)) {
    denials.push('CONTRACTOR_DISCOVERY_PROHIBITED');
    return {
      allowed: false,
      isPlatformWide: false,
      grants,
      restrictions,
      denials,
      reason: 'Contractors and suppliers are not permitted to discover client properties via Log a Job.',
    };
  }

  // 3. Evaluate Platform / Super Admin
  const isPlatformAdmin =
    session.orgType === 'ENTIREFM' && PLATFORM_ADMIN_ROLES.has(session.role);

  if (isPlatformAdmin) {
    grants.push(`platform_admin:${session.role}`);
    return {
      allowed: true,
      isPlatformWide: true,
      grants,
      restrictions,
      denials,
    };
  }

  // 4. Evaluate Internal EntireFM Operations & Account Managers
  if (session.orgType === 'ENTIREFM') {
    const isAccountManager = session.role === 'ACCOUNT_MANAGER';
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
    const orgScopes = session.scopes
      .filter((s) => s.type === 'ORGANISATION' || s.type === 'CLIENT_ACCOUNT')
      .map((s) => s.id);

    // If account manager, resolve assigned client accounts from DB
    let managedOrgIds: string[] = [];
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    if (isAccountManager && session.personId && isUuid(session.personId)) {
      const { data: accounts } = await dbQuery<any[]>(
        `client_accounts?account_manager_id=eq.${encodeURIComponent(session.personId)}&status=eq.ACTIVE&select=organisation_id`
      );
      if (accounts && accounts.length > 0) {
        managedOrgIds = accounts.map((a) => a.organisation_id).filter(Boolean);
        grants.push(...managedOrgIds.map((id) => `account_manager_org:${id}`));
      }
    }

    // UNION all positive organisation scopes
    const positiveOrgs = Array.from(new Set([...orgScopes, ...managedOrgIds]));

    // If specific site scopes exist, they act as narrowing restrictions
    if (siteScopes.length > 0) {
      restrictions.push(`narrowed_sites:${siteScopes.join(',')}`);
      grants.push('internal_operations_scoped');
      return {
        allowed: true,
        isPlatformWide: false,
        allowedOrgIds: positiveOrgs.length > 0 ? positiveOrgs : undefined,
        allowedSiteIds: siteScopes,
        grants,
        restrictions,
        denials,
      };
    }

    if (positiveOrgs.length > 0) {
      grants.push('internal_operations_scoped_orgs');
      return {
        allowed: true,
        isPlatformWide: false,
        allowedOrgIds: positiveOrgs,
        grants,
        restrictions,
        denials,
      };
    }

    // Unrestricted internal operations (no specific scoping applied)
    grants.push('internal_operations_platform_visibility');
    return {
      allowed: true,
      isPlatformWide: true,
      grants,
      restrictions,
      denials,
    };
  }

  // 5. Evaluate Client Users & Client Administrators
  if (session.orgType === 'CLIENT') {
    // Collect all valid positive organisation grants (session org + availableContexts if active)
    const positiveOrgIds = new Set<string>([session.orgId]);
    grants.push(`client_org:${session.orgId}`);

    if (session.availableContexts && session.availableContexts.length > 0) {
      for (const ctx of session.availableContexts) {
        if (ctx.orgType === 'CLIENT' && ctx.orgId) {
          positiveOrgIds.add(ctx.orgId);
          grants.push(`client_org_context:${ctx.orgId}`);
        }
      }
    }

    // 6. Check for property-level restrictions (SITE scopes)
    // CRITICAL NARROWING RULE:
    // If a client user has explicit SITE scopes, those restrictions NARROW the organisation scope!
    // It is NEVER org UNION siteScopes; it is org INTERSECT siteScopes.
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);

    if (siteScopes.length > 0) {
      restrictions.push(`explicit_site_restriction:${siteScopes.length}_sites`);
      return {
        allowed: true,
        isPlatformWide: false,
        allowedOrgIds: Array.from(positiveOrgIds),
        allowedSiteIds: siteScopes, // Narrows to only these specific sites
        grants,
        restrictions,
        denials,
      };
    }

    // Full organisation scope (no site-level restriction)
    return {
      allowed: true,
      isPlatformWide: false,
      allowedOrgIds: Array.from(positiveOrgIds),
      grants,
      restrictions,
      denials,
    };
  }

  return {
    allowed: false,
    isPlatformWide: false,
    grants,
    restrictions,
    denials,
    reason: 'UNKNOWN_OR_UNAUTHORIZED_ORG_TYPE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PREDICTIVE PROPERTY SEARCH (SERVER-SIDE SECURE QUERY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Searches properties within the user's effective authorised scope.
 * - Server-side authorization check first
 * - Active properties only (status = 'ACTIVE')
 * - Clamped result limit (default 15, max 25)
 * - Returns ONLY safe DTO fields: { id, name, postcode? }
 * - Zero client names or internal metadata exposed
 */
export async function searchAuthorisedProperties(
  session: UserSession | null,
  rawQuery: string,
  maxLimit: number = 15
): Promise<PropertySearchResult[]> {
  const query = (rawQuery || '').trim();
  if (query.length < 2) {
    return [];
  }

  // 1. Resolve effective authorization scope
  const scope = await resolvePropertySearchScope(session);
  if (!scope.allowed) {
    return [];
  }

  const limit = Math.min(Math.max(1, maxLimit), 25);

  // 2. Build PostgREST query components
  // Sanitize query to avoid breaking PostgREST URI syntax
  const sanitizedQuery = query.replace(/[^\w\s\-,.'&]/g, '').trim();
  if (!sanitizedQuery) {
    return [];
  }

  let endpoint = `sites?status=eq.ACTIVE&name=ilike.*${encodeURIComponent(sanitizedQuery)}*`;

  // Apply scope boundaries
  if (!scope.isPlatformWide) {
    if (scope.allowedSiteIds && scope.allowedSiteIds.length > 0) {
      // Narrowed to explicit site UUIDs
      const siteList = scope.allowedSiteIds.map(encodeURIComponent).join(',');
      endpoint += `&id=in.(${siteList})`;
    } else if (scope.allowedOrgIds && scope.allowedOrgIds.length > 0) {
      // Scoped to authorised organisation UUIDs
      const orgList = scope.allowedOrgIds.map(encodeURIComponent).join(',');
      endpoint += `&organisation_id=in.(${orgList})`;
    } else {
      // No authorised scopes found
      return [];
    }
  }

  // Exclude explicit denials if present
  if (scope.deniedSiteIds && scope.deniedSiteIds.length > 0) {
    const deniedList = scope.deniedSiteIds.map(encodeURIComponent).join(',');
    endpoint += `&id=not.in.(${deniedList})`;
  }

  // Safe field projection: id, name, postcode ONLY
  endpoint += `&select=id,name,postcode&limit=${limit * 2}`;

  const { data: sites, error } = await dbQuery<any[]>(endpoint);
  if (error || !sites) {
    console.error('[PROPERTY_SEARCH] Database query error:', error);
    return [];
  }

  // 3. Intelligent in-memory ranking:
  // - Starts-with match on property name (highest priority)
  // - Word-start match (second priority)
  // - Partial match / alphabetical (third priority)
  const lowerQuery = query.toLowerCase();

  const ranked = [...sites].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    const aStarts = nameA.startsWith(lowerQuery);
    const bStarts = nameB.startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    const aWord = nameA.split(/\s+/).some((w: string) => w.startsWith(lowerQuery));
    const bWord = nameB.split(/\s+/).some((w: string) => w.startsWith(lowerQuery));
    if (aWord && !bWord) return -1;
    if (!aWord && bWord) return 1;

    return (a.name || '').localeCompare(b.name || '');
  });

  // 4. Map to safe DTO (strictly id, name, postcode)
  return ranked.slice(0, limit).map((s) => {
    const result: PropertySearchResult = {
      id: s.id,
      name: s.name,
    };
    if (s.postcode) {
      result.postcode = s.postcode;
    }
    return result;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POINT-OF-MUTATION AUTHORISATION CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates whether an authenticated session is authorised to create a job /
 * work order against a specific property ID.
 *
 * CRITICAL SECURITY PRINCIPLE:
 * The frontend search results are NEVER trusted as the authority for job creation.
 * The backend independently validates:
 * 1. User authentication & active status
 * 2. User has job-creation authority (role & permissions)
 * 3. Target site exists and is ACTIVE
 * 4. Target site's organisation is ACTIVE (not suspended)
 * 5. Target site falls strictly within the user's effective property scope
 * 6. Site is not explicitly denied
 */
export async function canCreateJobForProperty(
  session: UserSession | null,
  propertyId: string
): Promise<PropertyAccessDecision> {
  return resolvePropertyAccess(session, propertyId, 'job:create');
}

/**
 * Resolves full property access for any action ('property:search' | 'property:view' | 'job:create').
 * Returns a diagnostic decision object for audited server-side evaluation.
 */
export async function resolvePropertyAccess(
  session: UserSession | null,
  propertyId: string,
  action: PropertyAction
): Promise<PropertyAccessDecision> {
  const grants: string[] = [];
  const restrictions: string[] = [];
  const denials: string[] = [];

  // 1. Authentication check
  if (!session) {
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials: ['UNAUTHENTICATED'],
      reason: 'Authentication required.',
    };
  }

  // 2. Prohibit contractor/supplier cross-client discovery and job logging
  if (
    (session.orgType === 'CONTRACTOR' || session.orgType === 'SUPPLIER') &&
    (action === 'property:search' || action === 'job:create')
  ) {
    denials.push('CONTRACTOR_ACCESS_PROHIBITED');
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: 'Contractors and suppliers cannot initiate client service requests via Log a Job.',
    };
  }

  // 3. Action authority check
  if (action === 'job:create' && !hasJobCreationAuthority(session)) {
    denials.push('ACTION_UNAUTHORIZED');
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: `User role ${session.role} does not possess job creation authority.`,
    };
  }

  // 4. Fetch target property record from database
  const { data: sites, error } = await dbQuery<any[]>(
    `sites?id=eq.${encodeURIComponent(propertyId)}&select=id,name,status,organisation_id`
  );
  const site = sites?.[0];

  if (error || !site) {
    denials.push('PROPERTY_NOT_FOUND');
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: 'The selected property does not exist.',
    };
  }

  // 5. Exclude archived / inactive properties
  if (site.status !== 'ACTIVE') {
    denials.push('PROPERTY_INACTIVE_OR_ARCHIVED');
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: 'Archived or inactive properties cannot be selected for new maintenance work.',
    };
  }

  // 6. Check organisation status (exclude suspended client accounts)
  if (site.organisation_id) {
    const { data: orgs } = await dbQuery<any[]>(
      `organisations?id=eq.${encodeURIComponent(site.organisation_id)}&select=id,status`
    );
    const org = orgs?.[0];
    if (org && org.status !== 'ACTIVE') {
      denials.push('ORGANISATION_SUSPENDED');
      return {
        allowed: false,
        action,
        propertyId,
        grants,
        restrictions,
        denials,
        reason: 'The client organisation for this property is suspended or inactive.',
      };
    }
  }

  // 7. Resolve user's effective property scope
  const scope = await resolvePropertySearchScope(session);
  grants.push(...scope.grants);
  restrictions.push(...scope.restrictions);

  if (!scope.allowed) {
    denials.push(...scope.denials);
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: scope.reason || 'Property is outside user authorisation scope.',
    };
  }

  // 8. Platform Admin has universal unconstrained access to active properties
  if (scope.isPlatformWide) {
    return {
      allowed: true,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
    };
  }

  // 9. Narrowing site restrictions check
  if (scope.allowedSiteIds && scope.allowedSiteIds.length > 0) {
    if (!scope.allowedSiteIds.includes(propertyId)) {
      denials.push('EXPLICIT_SITE_RESTRICTION_EXCLUSION');
      return {
        allowed: false,
        action,
        propertyId,
        grants,
        restrictions,
        denials,
        reason: 'User account has explicit property restrictions that exclude this property.',
      };
    }
  }

  // 10. Organisation boundary check
  if (scope.allowedOrgIds && scope.allowedOrgIds.length > 0) {
    if (!site.organisation_id || !scope.allowedOrgIds.includes(site.organisation_id)) {
      denials.push('ORGANISATION_BOUNDARY_VIOLATION');
      return {
        allowed: false,
        action,
        propertyId,
        grants,
        restrictions,
        denials,
        reason: 'Property does not belong to any organisation authorised for this user.',
      };
    }
  }

  // 11. Explicit denials check
  if (scope.deniedSiteIds && scope.deniedSiteIds.includes(propertyId)) {
    denials.push('EXPLICIT_PROPERTY_DENY');
    return {
      allowed: false,
      action,
      propertyId,
      grants,
      restrictions,
      denials,
      reason: 'Access to this property has been explicitly revoked.',
    };
  }

  return {
    allowed: true,
    action,
    propertyId,
    grants,
    restrictions,
    denials,
  };
}

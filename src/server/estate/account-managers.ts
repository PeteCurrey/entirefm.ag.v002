/**
 * ENTIREFM ACCOUNT MANAGER ELIGIBILITY MODULE
 * ============================================
 * Queries the canonical persons + organisation_memberships tables to return
 * active EntireFM internal staff who are eligible to be assigned as an
 * Account Manager on a Client Account.
 *
 * Eligible internal roles (can manage client relationships):
 *   ACCOUNT_MANAGER, OPERATIONS_MANAGER, DIRECTOR, CEO, SUPER_ADMIN,
 *   ADMINISTRATOR, COMMERCIAL_MANAGER, HELPDESK_MANAGER
 *
 * Canonical identity:
 *   person.id  → client_accounts.account_manager_id (UUID FK)
 *   person.first_name + person.last_name → display label
 */

import { dbQuery } from '../db/client';

export const ACCOUNT_MANAGER_ELIGIBLE_ROLES = [
  'ACCOUNT_MANAGER',
  'OPERATIONS_MANAGER',
  'DIRECTOR',
  'CEO',
  'SUPER_ADMIN',
  'ADMINISTRATOR',
  'COMMERCIAL_MANAGER',
  'HELPDESK_MANAGER',
] as const;

export type AccountManagerEligibleRole = (typeof ACCOUNT_MANAGER_ELIGIBLE_ROLES)[number];

export interface EligibleAccountManager {
  /** UUID — use this as the value for account_manager_id */
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  /** The role code they hold in the ENTIREFM org */
  role_code: string;
  /** The human-readable role name */
  role_name: string;
}

/**
 * Returns active EntireFM internal team members who are eligible to act as
 * Account Managers. Only persons with an ACTIVE membership to an ENTIREFM
 * organisation holding one of the eligible roles are returned.
 *
 * Uses the service role key — safe server-only call.
 */
export async function listEligibleAccountManagers(): Promise<EligibleAccountManager[]> {
  try {
    // Query persons who have an active membership in an ENTIREFM org
    // with an eligible role code, and whose person record is ACTIVE.
    const { data, error } = await dbQuery<any[]>(
      `organisation_memberships?select=person_id,role:roles(code,name),person:persons(id,first_name,last_name,email,phone,job_title,status),organisation:organisations(org_type)&status=eq.ACTIVE&organisation.org_type=eq.ENTIREFM&order=person.last_name.asc`
    );

    if (error || !data) {
      console.error('[ACCOUNT_MANAGERS] Query error:', error);
      return [];
    }

    const eligibleRoleSet = new Set<string>(ACCOUNT_MANAGER_ELIGIBLE_ROLES);

    return data
      .filter((m: any) => {
        const person = m.person;
        const role = m.role;
        const org = m.organisation;

        return (
          person &&
          person.status === 'ACTIVE' &&
          org &&
          org.org_type === 'ENTIREFM' &&
          role &&
          eligibleRoleSet.has(role.code)
        );
      })
      .map((m: any) => ({
        id: m.person.id,
        first_name: m.person.first_name,
        last_name: m.person.last_name,
        email: m.person.email,
        phone: m.person.phone || undefined,
        job_title: m.person.job_title || undefined,
        role_code: m.role.code,
        role_name: m.role.name,
      }))
      .reduce<EligibleAccountManager[]>((acc, mgr) => {
        // De-duplicate by person ID (person may have multiple memberships)
        if (!acc.find((x) => x.id === mgr.id)) acc.push(mgr);
        return acc;
      }, []);
  } catch (err: any) {
    console.error('[ACCOUNT_MANAGERS] Unexpected error:', err);
    return [];
  }
}

/**
 * Validates that a given person ID is eligible to be assigned as an account
 * manager. Returns the person record on success, null on failure.
 */
export async function validateAccountManager(
  personId: string
): Promise<EligibleAccountManager | null> {
  if (!personId || typeof personId !== 'string') return null;

  try {
    const { data: persons, error: personError } = await dbQuery<any[]>(
      `persons?id=eq.${encodeURIComponent(personId)}&status=eq.ACTIVE&select=id,first_name,last_name,email,phone,job_title`
    );

    if (personError || !persons || persons.length === 0) {
      return null;
    }

    const person = persons[0];

    // Verify they have an active ENTIREFM membership with eligible role
    const eligibleRoleList = ACCOUNT_MANAGER_ELIGIBLE_ROLES.map((r) =>
      encodeURIComponent(r)
    ).join(',');

    const { data: memberships, error: memError } = await dbQuery<any[]>(
      `organisation_memberships?person_id=eq.${encodeURIComponent(personId)}&status=eq.ACTIVE&select=role:roles(code,name),organisation:organisations(org_type)&organisation.org_type=eq.ENTIREFM`
    );

    if (memError || !memberships || memberships.length === 0) {
      return null;
    }

    const eligibleRoleSet = new Set<string>(ACCOUNT_MANAGER_ELIGIBLE_ROLES);
    const eligibleMembership = memberships.find(
      (m: any) =>
        m.organisation?.org_type === 'ENTIREFM' && eligibleRoleSet.has(m.role?.code)
    );

    if (!eligibleMembership) return null;

    return {
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      email: person.email,
      phone: person.phone || undefined,
      job_title: person.job_title || undefined,
      role_code: eligibleMembership.role.code,
      role_name: eligibleMembership.role.name,
    };
  } catch (err: any) {
    console.error('[ACCOUNT_MANAGERS] Validation error:', err);
    return null;
  }
}

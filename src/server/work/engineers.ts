/**
 * ENTIREFM INTERNAL ENGINEER ELIGIBILITY MODULE
 * ===============================================
 * Queries the canonical persons + organisation_memberships tables to return
 * active EntireFM internal staff who are eligible to be assigned as an
 * internal engineer / lead engineer on a Work Order or Visit.
 *
 * Eligible internal roles:
 *   ENGINEER, OPERATIONS_MANAGER, OPERATIONS_USER, DIRECTOR, CEO, ADMINISTRATOR, SUPER_ADMIN
 *
 * Canonical identity:
 *   person.id -> work_orders.lead_engineer_id / visits.assigned_resource_id
 */

import { dbQuery } from '../db/client';

export const ENGINEER_ELIGIBLE_ROLES = [
  'ENGINEER',
  'OPERATIONS_MANAGER',
  'OPERATIONS_USER',
  'DIRECTOR',
  'CEO',
  'ADMINISTRATOR',
  'SUPER_ADMIN',
] as const;

export type EngineerEligibleRole = (typeof ENGINEER_ELIGIBLE_ROLES)[number];

export interface EligibleInternalEngineer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  role_code: string;
  role_name: string;
}

/**
 * Returns active EntireFM internal team members who are eligible to act as
 * Internal Engineers. Only persons with an ACTIVE membership to an ENTIREFM
 * organisation holding one of the eligible roles are returned.
 */
export async function listEligibleInternalEngineers(): Promise<EligibleInternalEngineer[]> {
  try {
    const { data, error } = await dbQuery<any[]>(
      `organisation_memberships?select=person_id,role:roles(code,name),person:persons(id,first_name,last_name,email,phone,job_title,status),organisation:organisations(org_type)&status=eq.ACTIVE&organisation.org_type=eq.ENTIREFM&order=joined_at.desc`
    );

    if (error || !data) {
      console.error('[INTERNAL_ENGINEERS] Query error:', error);
      return [];
    }

    const eligibleRoleSet = new Set<string>(ENGINEER_ELIGIBLE_ROLES);

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
      .reduce<EligibleInternalEngineer[]>((acc, eng) => {
        if (!acc.find((x) => x.id === eng.id)) acc.push(eng);
        return acc;
      }, [])
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
  } catch (err: any) {
    console.error('[INTERNAL_ENGINEERS] Unexpected error:', err);
    return [];
  }
}

/**
 * Validates that a given person ID is an active EntireFM internal staff member
 * eligible to be assigned as an engineer.
 */
export async function validateInternalEngineer(
  personId: string
): Promise<EligibleInternalEngineer | null> {
  if (!personId || typeof personId !== 'string') return null;

  try {
    const { data: persons, error: personError } = await dbQuery<any[]>(
      `persons?id=eq.${encodeURIComponent(personId)}&status=eq.ACTIVE&select=id,first_name,last_name,email,phone,job_title`
    );

    if (personError || !persons || persons.length === 0) {
      return null;
    }

    const person = persons[0];

    const { data: memberships, error: memError } = await dbQuery<any[]>(
      `organisation_memberships?person_id=eq.${encodeURIComponent(personId)}&status=eq.ACTIVE&select=role:roles(code,name),organisation:organisations(org_type)&organisation.org_type=eq.ENTIREFM`
    );

    if (memError || !memberships || memberships.length === 0) {
      return null;
    }

    const eligibleRoleSet = new Set<string>(ENGINEER_ELIGIBLE_ROLES);
    const eligibleMembership = memberships.find(
      (m: any) =>
        m.organisation?.org_type === 'ENTIREFM' && eligibleRoleSet.has(m.role?.code)
    );

    if (!eligibleMembership) {
      return null;
    }

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
    console.error('[INTERNAL_ENGINEERS] Validation error:', err);
    return null;
  }
}

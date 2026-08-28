/**
 * ENTIREFM FIELD REPORTING ENGINE — PERMISSIONS & ACCESS CONTROL
 * ================================================================
 * Strict server-side security boundaries:
 *   - Internal EntireFM Engineers & Admins
 *   - Contractor / Supplier Engineers (isolated strictly to their own assigned jobs)
 *   - Client Accounts (read-only access strictly to ISSUED/APPROVED reports for their sites)
 */

import type { UserSession } from '../identity';
import type { ReportInstance } from './types';

/**
 * Determine if a user session is permitted to read a report instance.
 */
export function canUserAccessReport(
  session: UserSession | null,
  instance: ReportInstance
): { allowed: boolean; reason?: string } {
  if (!session) {
    return { allowed: false, reason: 'Unauthenticated' };
  }

  // 1. Internal EntireFM Team (Full Access or Scoped by Role)
  if (session.orgType === 'ENTIREFM') {
    return { allowed: true };
  }

  // 2. Contractor / Supplier Isolation
  if (session.orgType === 'CONTRACTOR' || session.orgType === 'SUPPLIER') {
    // Must belong to the same organisation as the report OR be the directly assigned engineer
    const isMatchingOrg = session.orgId === instance.organisation_id;
    const isAssigned = session.personId === instance.assigned_engineer_id || session.authUserId === instance.assigned_engineer_id;

    if (isMatchingOrg || isAssigned) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Contractor organisation is not authorised to view this report',
    };
  }

  // 3. Client Isolation
  if (session.orgType === 'CLIENT') {
    // Clients can ONLY view APPROVED or ISSUED reports
    const isControlledPublished = instance.status === 'APPROVED' || instance.status === 'ISSUED';
    if (!isControlledPublished) {
      return {
        allowed: false,
        reason: 'Client accounts cannot view in-progress or unapproved draft reports',
      };
    }

    // Must match the client's organisation or client_account_id
    if (session.orgId === instance.client_account_id || session.orgId === instance.organisation_id) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Client organisation is not associated with this report estate',
    };
  }

  return { allowed: false, reason: 'Unknown organisation access tier' };
}

/**
 * Determine if a user session is permitted to edit/sign a report instance.
 */
export function canUserEditReport(
  session: UserSession | null,
  instance: ReportInstance
): { allowed: boolean; reason?: string } {
  const readCheck = canUserAccessReport(session, instance);
  if (!readCheck.allowed) return readCheck;

  // Once ISSUED or SUPERSEDED, a report is an immutable controlled record
  if (instance.status === 'ISSUED' || instance.status === 'SUPERSEDED') {
    return {
      allowed: false,
      reason: 'Issued reports are immutable controlled documents and cannot be edited',
    };
  }

  // Clients cannot edit field reports
  if (session?.orgType === 'CLIENT') {
    return { allowed: false, reason: 'Client users have read-only access to reports' };
  }

  return { allowed: true };
}

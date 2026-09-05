/**
 * ENTIREFM CONTRACTOR ELIGIBILITY ENGINE (Phase 0M)
 * =================================================
 * Deterministic Hard Eligibility Gate Evaluator.
 *
 * Rule:
 *   AI CAN NEVER OVERRIDE ELIGIBILITY.
 *   If a provider fails any legal, technical, compliance, geographic, or client
 *   restriction check, they are strictly excluded from dispatch consideration.
 *
 * All gates fail CLOSED:
 *   - Contractors without trades on file are strictly excluded.
 *   - Contractors without geographic coverage or exceeding coverage radius are strictly excluded.
 *   - P1 Critical jobs require verified emergency_24_7_capable === true.
 */

import { HardEligibilityGate } from './types';
import { TradeCategory, UrgencyLevel } from '../helpdesk/types';

export interface ContractorEligibilityContext {
  supplier: {
    id: string;
    name: string;
    code: string;
    status: string;
    org_type: string;
    portal_status?: string;
    trades?: string[];
    covered_cities?: string[];
    is_national?: boolean;
    is_suspended?: boolean;
    compliance_approved?: boolean;
    emergency_24_7_capable?: boolean;
    distance_miles?: number | null;
    coverage_radius_miles?: number;
    blacklisted_client_ids?: string[];
    blacklisted_site_ids?: string[];
  };
  requirement: {
    trade: TradeCategory;
    sub_trade?: string;
    site_id?: string;
    site_city?: string;
    site_postcode?: string;
    client_id?: string;
    priority: UrgencyLevel;
  };
}

export function evaluateContractorEligibility(
  context: ContractorEligibilityContext
): HardEligibilityGate {
  const { supplier, requirement } = context;
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  const exclusionReasons: string[] = [];

  // Gate 1: Active Contractor Organisation Status
  if (supplier.status === 'ACTIVE' && (supplier.org_type === 'CONTRACTOR' || supplier.org_type === 'SUPPLIER')) {
    passedChecks.push('ACTIVE_CONTRACTOR_ORGANISATION');
  } else {
    failedChecks.push('INACTIVE_ORGANISATION');
    exclusionReasons.push(`Supplier organisation status '${supplier.status}' / type '${supplier.org_type}' is not active for dispatch`);
  }

  // Gate 2: Compliance & Suspension Check
  if (supplier.is_suspended) {
    failedChecks.push('CONTRACTOR_SUSPENDED');
    exclusionReasons.push('Contractor has an active administrative or compliance suspension');
  } else {
    passedChecks.push('COMPLIANCE_CLEAR');
  }

  // Gate 3: Trade & Discipline Capability (Strict Fail-Closed)
  const reqTrade = requirement.trade.toUpperCase();
  const suppTrades = (supplier.trades || []).map((t) => t.toUpperCase());

  if (suppTrades.length === 0) {
    failedChecks.push('TRADE_MISMATCH');
    exclusionReasons.push('Contractor profile incomplete: no trade discipline on file');
  } else {
    const hasTradeMatch =
      suppTrades.includes(reqTrade) ||
      suppTrades.includes('GENERAL_MAINTENANCE') ||
      (suppTrades.includes('MECHANICAL') && (reqTrade === 'HVAC' || reqTrade === 'PLUMBING')) ||
      (suppTrades.includes('ELECTRICAL') && reqTrade === 'FIRE_LIFE_SAFETY');

    if (hasTradeMatch) {
      passedChecks.push('TRADE_DISCIPLINE_MATCH');
    } else {
      failedChecks.push('TRADE_MISMATCH');
      exclusionReasons.push(`Supplier does not provide required trade discipline '${requirement.trade}'`);
    }
  }

  // Gate 4: Geographic Coverage & Proximity (Strict Fail-Closed)
  const dist = supplier.distance_miles;
  const maxRadius = supplier.coverage_radius_miles;

  // If distance was computed and stated coverage radius is provided, enforce stated coverage radius
  if (dist != null && maxRadius != null && dist > maxRadius) {
    failedChecks.push('OUTSIDE_GEOGRAPHIC_AREA');
    exclusionReasons.push(
      `Site distance (${dist.toFixed(1)} miles) exceeds contractor stated coverage radius of ${maxRadius} miles`
    );
  } else {
    const reqCity = (requirement.site_city || '').trim().toLowerCase();
    const coveredCities = (supplier.covered_cities || [])
      .map((c) => c.toLowerCase().trim())
      .filter(Boolean);

    const hasCityMatch = reqCity.length > 0 && coveredCities.some((c) => reqCity.includes(c) || c.includes(reqCity));
    const isWithinRadius = dist != null && maxRadius != null && dist <= maxRadius;
    const isGeoCovered = Boolean(supplier.is_national) || hasCityMatch || isWithinRadius;

    if (isGeoCovered) {
      passedChecks.push('GEOGRAPHIC_COVERAGE_APPROVED');
    } else if (!supplier.is_national && coveredCities.length === 0 && dist == null) {
      failedChecks.push('OUTSIDE_GEOGRAPHIC_AREA');
      exclusionReasons.push(
        'Contractor profile incomplete: no geographic coverage or operating depot on file'
      );
    } else {
      failedChecks.push('OUTSIDE_GEOGRAPHIC_AREA');
      exclusionReasons.push(
        dist == null
          ? `Cannot verify geographic match: no depot coordinates or matching coverage city for '${requirement.site_city || 'site'}'`
          : `Supplier does not cover location '${requirement.site_city || 'site'}'`
      );
    }
  }

  // Gate 5: 24/7 Emergency Capability for P1 Critical Jobs (Strict Fail-Closed)
  if (requirement.priority === 'P1_CRITICAL') {
    if (supplier.emergency_24_7_capable === true) {
      passedChecks.push('EMERGENCY_RESPONSE_CAPABLE');
    } else {
      failedChecks.push('NO_24_7_EMERGENCY_COVER');
      exclusionReasons.push('P1 Critical job requires verified 24/7 emergency response capability');
    }
  }

  // Gate 6: Client & Site Blacklist / Restrictions
  if (requirement.client_id && supplier.blacklisted_client_ids?.includes(requirement.client_id)) {
    failedChecks.push('CLIENT_RESTRICTION');
    exclusionReasons.push('Contractor is restricted from client estate per contract governance');
  } else if (requirement.site_id && supplier.blacklisted_site_ids?.includes(requirement.site_id)) {
    failedChecks.push('SITE_RESTRICTION');
    exclusionReasons.push('Contractor is restricted from this specific physical site');
  } else {
    passedChecks.push('NO_CLIENT_RESTRICTIONS');
  }

  const isEligible = failedChecks.length === 0;

  return {
    is_eligible: isEligible,
    passed_checks: passedChecks,
    failed_checks: failedChecks,
    exclusion_reasons: exclusionReasons,
  };
}

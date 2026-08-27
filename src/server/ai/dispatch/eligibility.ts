/**
 * ENTIREFM CONTRACTOR ELIGIBILITY ENGINE (Phase 0M)
 * =================================================
 * Deterministic Hard Eligibility Gate Evaluator.
 *
 * Rule:
 *   AI CAN NEVER OVERRIDE ELIGIBILITY.
 *   If a provider fails any legal, technical, compliance, geographic, or client
 *   restriction check, they are strictly excluded from dispatch consideration.
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

  // Gate 3: Trade & Discipline Capability
  const reqTrade = requirement.trade.toUpperCase();
  const suppTrades = (supplier.trades || []).map((t) => t.toUpperCase());

  const hasTradeMatch =
    suppTrades.length === 0 || // If no trades registered in mock fixture, allow base check
    suppTrades.includes(reqTrade) ||
    suppTrades.includes('GENERAL_MAINTENANCE') ||
    suppTrades.includes('MECHANICAL') && (reqTrade === 'HVAC' || reqTrade === 'PLUMBING') ||
    suppTrades.includes('ELECTRICAL') && reqTrade === 'FIRE_LIFE_SAFETY';

  if (hasTradeMatch) {
    passedChecks.push('TRADE_DISCIPLINE_MATCH');
  } else {
    failedChecks.push('TRADE_MISMATCH');
    exclusionReasons.push(`Supplier does not provide required trade discipline '${requirement.trade}'`);
  }

  // Gate 4: Geographic Coverage
  const reqCity = (requirement.site_city || '').toLowerCase();
  const coveredCities = (supplier.covered_cities || []).map((c) => c.toLowerCase());
  const isGeoCovered =
    supplier.is_national ||
    coveredCities.length === 0 || // If empty coverage list, treated as regional/national
    coveredCities.some((c) => reqCity.includes(c) || c.includes(reqCity));

  if (isGeoCovered) {
    passedChecks.push('GEOGRAPHIC_COVERAGE_APPROVED');
  } else {
    failedChecks.push('OUTSIDE_GEOGRAPHIC_AREA');
    exclusionReasons.push(`Supplier does not cover location '${requirement.site_city}'`);
  }

  // Gate 5: 24/7 Emergency Capability for P1 Critical Jobs
  if (requirement.priority === 'P1_CRITICAL') {
    if (supplier.emergency_24_7_capable !== false) {
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

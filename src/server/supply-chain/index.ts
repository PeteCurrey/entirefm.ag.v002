/**
 * ENTIREFM SUPPLY CHAIN DOMAIN MODULE (Phase 0A-R Hardened)
 * ========================================================
 * Complete Supply Chain Schema:
 * Provider -> Location -> Resource -> Trade -> Competency -> Coverage -> Performance -> Restrictions.
 * Foundation for AI dispatch ranking.
 */

import { dbQuery } from '../db/client';

export interface ProviderLocation {
  id: string;
  provider_org_id: string;
  name: string;
  address_line1: string;
  city: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  is_hq: boolean;
  is_dispatch_point: boolean;
  emergency_available: boolean;
  operating_hours_json?: Record<string, any>;
  created_at: string;
}

export interface ProviderResource {
  id: string;
  provider_org_id: string;
  person_id: string;
  employment_status: 'EMPLOYED' | 'SUBCONTRACTOR' | 'FREELANCE';
  trades_json?: string[];
  competencies_json?: string[];
  availability_json?: Record<string, any>;
  home_postcode?: string;
  latitude?: number;
  longitude?: number;
  max_daily_jobs: number;
  is_active: boolean;
  person?: { first_name: string; last_name: string; email: string; phone?: string };
}

export interface CoverageArea {
  id: string;
  provider_org_id: string;
  location_id?: string;
  coverage_type: 'POSTCODE_DISTRICT' | 'RADIUS_MILES' | 'REGION' | 'GEO_POLYGON';
  boundary_value: string;
  radius_miles?: number;
  priority_rank: number;
  is_active: boolean;
}

export interface ProviderPerformance {
  id: string;
  provider_org_id: string;
  period_start: string;
  period_end: string;
  acceptance_rate: number;
  response_time_avg_mins?: number;
  attendance_time_avg_mins?: number;
  sla_achievement_rate: number;
  first_time_fix_rate: number;
  completion_quality_score: number;
  recall_rate: number;
  invoice_accuracy_rate: number;
  cancellation_rate: number;
}

export interface ProviderRestriction {
  id: string;
  provider_org_id: string;
  client_account_id?: string;
  site_id?: string;
  restriction_type:
    | 'BLOCKED'
    | 'APPROVED_ONLY'
    | 'SPEND_CEILING'
    | 'TRADE_RESTRICTION'
    | 'COMPLIANCE_HOLD'
    | 'EMERGENCY_ONLY'
    | 'PREFERRED'
    | 'PROHIBITED';
  spend_ceiling_gbp?: number;
  reason: string;
  applied_by_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProviderOrganisation {
  id: string;
  organisation_id: string;
  tier: string;
  vetting_status: string;
  insurance_verified: boolean;
  public_liability_limit?: number;
  insurance_expiry?: string;
  coverage_radius_miles?: number;
  primary_trade?: string;
  performance_score: number;
  first_time_fix_rate: number;
  sla_adherence_rate: number;
  is_active: boolean;
  created_at: string;
  organisation?: { name: string; code: string; phone?: string; email?: string };
}

export interface Trade {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
}

export interface Accreditation {
  id: string;
  provider_org_id: string;
  body_name: string;
  certificate_number: string;
  valid_from: string;
  valid_to: string;
  status: string;
  document_url?: string;
  created_at: string;
}

export interface RateCard {
  id: string;
  provider_org_id?: string;
  client_account_id?: string;
  name: string;
  currency: string;
  effective_from: string;
  effective_to?: string;
  is_default: boolean;
  status: string;
  created_at: string;
}

export async function listProviders(): Promise<ProviderOrganisation[]> {
  const { data } = await dbQuery<ProviderOrganisation[]>(
    'provider_organisations?select=*,organisation:organisations(name,code,phone,email)&order=performance_score.desc'
  );
  return data || [];
}

export async function listTrades(): Promise<Trade[]> {
  const { data } = await dbQuery<Trade[]>('trades?select=*&order=category.asc,name.asc');
  return data || [];
}

export async function listProviderRestrictions(providerOrgId: string): Promise<ProviderRestriction[]> {
  const { data } = await dbQuery<ProviderRestriction[]>(
    `provider_restrictions?provider_org_id=eq.${encodeURIComponent(providerOrgId)}&is_active=eq.true&select=*`
  );
  return data || [];
}

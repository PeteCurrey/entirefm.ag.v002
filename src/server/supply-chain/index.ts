/**
 * ENTIREFM SUPPLY CHAIN DOMAIN MODULE
 * ===================================
 * Provider network, contractor vetting, trades, competencies, and rate cards.
 */

import { dbQuery } from '../db/client';

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

export async function listRateCards(): Promise<RateCard[]> {
  const { data } = await dbQuery<RateCard[]>('rate_cards?select=*&order=created_at.desc');
  return data || [];
}

/**
 * ENTIREFM ESTATE & ASSET DOMAIN MODULE (Phase 0B CAFM Operations Core)
 * ====================================================================
 * Canonical Estate Hierarchy:
 * ClientAccount -> Contract -> Portfolio -> Site -> Building -> FloorZone -> Space -> System -> Asset -> Component
 */

import { dbQuery } from '../db/client';

export interface ClientAccount {
  id: string;
  organisation_id: string;
  account_number: string;
  name: string;
  account_status: 'PROSPECT' | 'ONBOARDING' | 'ACTIVE' | 'AT_RISK' | 'SUSPENDED' | 'CHURNED';
  account_tier: 'ENTERPRISE' | 'CORPORATE' | 'REGIONAL' | 'SME';
  primary_contact_id?: string;
  account_manager_id?: string;
  created_at: string;
  organisation?: { name: string; code: string; phone?: string; email?: string };
  account_manager?: { first_name: string; last_name: string; email: string };
}

export interface Contract {
  id: string;
  client_account_id: string;
  contract_reference: string;
  name: string;
  contract_type: 'TOTAL_FM' | 'HARD_FM' | 'SOFT_FM' | 'PPM_ONLY' | 'REACTIVE_ONLY' | 'STATUTORY_ONLY';
  start_date: string;
  end_date: string;
  billing_method: 'FIXED_ANNUAL' | 'MONTHLY_ARREARS' | 'TIME_AND_MATERIALS' | 'SCHEDULE_OF_RATES';
  annual_value_gbp?: number;
  status: 'DRAFT' | 'ACTIVE' | 'RENEWAL_DUE' | 'EXPIRED' | 'TERMINATED';
  created_at: string;
  client_account?: { name: string; account_number: string };
}

export interface Portfolio {
  id: string;
  client_account_id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
}

export interface Site {
  id: string;
  organisation_id: string;
  client_account_id?: string;
  portfolio_id?: string;
  site_code: string;
  name: string;
  site_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';
  site_manager_id?: string;
  access_instructions?: string;
  security_clearance_required: boolean;
  created_at: string;
  organisation?: { name: string };
  client_account?: { name: string };
}

export interface Building {
  id: string;
  site_id: string;
  building_code: string;
  name: string;
  gross_internal_area_sqm?: number;
  total_floors?: number;
  status: string;
  created_at: string;
}

export interface Space {
  id: string;
  floor_zone_id?: string;
  site_id: string;
  space_code: string;
  name: string;
  space_type: string;
  status: string;
  created_at: string;
}

export interface Asset {
  id: string;
  site_id: string;
  building_id?: string;
  space_id?: string;
  asset_reference: string;
  name: string;
  category: string;
  system_category?: string;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  qr_code?: string;
  nfc_tag_id?: string;
  install_date?: string;
  warranty_expiry_date?: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNSERVICEABLE' | 'DECOMMISSIONED';
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  statutory_compliance_required: boolean;
  status: 'IN_SERVICE' | 'STANDBY' | 'DEFECTIVE' | 'UNDER_REPAIR' | 'OUT_OF_SERVICE' | 'DISPOSED';
  created_at: string;
  site?: { name: string; site_code: string; address_line1?: string; postcode?: string };
}

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const { data } = await dbQuery<ClientAccount[]>(
    'client_accounts?select=*,organisation:organisations(name,code,phone,email),account_manager:persons(first_name,last_name,email)&order=created_at.desc'
  );
  return data || [];
}

export async function listContracts(clientAccountId?: string): Promise<Contract[]> {
  let endpoint = 'contracts?select=*,client_account:client_accounts(name,account_number)&order=created_at.desc';
  if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
  const { data } = await dbQuery<Contract[]>(endpoint);
  return data || [];
}

export async function listPortfolios(clientAccountId?: string): Promise<Portfolio[]> {
  let endpoint = 'portfolios?select=*&order=name.asc';
  if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
  const { data } = await dbQuery<Portfolio[]>(endpoint);
  return data || [];
}

export async function listSites(filters?: { clientAccountId?: string; status?: string }): Promise<Site[]> {
  let endpoint = 'sites?select=*,organisation:organisations(name),client_account:client_accounts(name)&order=name.asc';
  if (filters?.clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<Site[]>(endpoint);
  return data || [];
}

export async function listAssets(filters?: { siteId?: string; category?: string; criticality?: string }): Promise<Asset[]> {
  let endpoint = 'assets?select=*,site:sites(name,site_code,address_line1,postcode)&order=asset_reference.asc';
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.category) endpoint += `&category=eq.${encodeURIComponent(filters.category)}`;
  if (filters?.criticality) endpoint += `&criticality=eq.${encodeURIComponent(filters.criticality)}`;
  const { data } = await dbQuery<Asset[]>(endpoint);
  return data || [];
}

export async function listBuildings(siteId?: string): Promise<Building[]> {
  let endpoint = 'buildings?select=*&order=name.asc';
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  const { data } = await dbQuery<Building[]>(endpoint);
  return data || [];
}

export async function listSpaces(siteId?: string): Promise<Space[]> {
  let endpoint = 'spaces?select=*&order=name.asc';
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  const { data } = await dbQuery<Space[]>(endpoint);
  return data || [];
}

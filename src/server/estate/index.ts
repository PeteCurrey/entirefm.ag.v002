/**
 * ENTIREFM ESTATE DOMAIN MODULE
 * ==============================
 * Canonical Estate Hierarchy:
 * Organisation -> ClientAccount -> Contract -> Portfolio -> Site -> Building -> FloorZone -> Space -> System -> Asset -> Component
 */

import { dbQuery } from '../db/client';

export interface ClientAccount {
  id: string;
  organisation_id: string;
  account_code: string;
  account_manager_id?: string;
  status: string;
  billing_currency: string;
  created_at: string;
  organisation?: { name: string; code: string };
}

export interface Contract {
  id: string;
  client_account_id: string;
  contract_ref: string;
  name: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  renewal_date?: string;
  annual_value_gbp?: number;
  status: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  client_account_id: string;
  contract_id?: string;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Site {
  id: string;
  portfolio_id?: string;
  organisation_id: string;
  site_code: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  access_notes?: string;
  status: string;
  created_at: string;
  organisation?: { name: string };
}

export interface Building {
  id: string;
  site_id: string;
  building_code: string;
  name: string;
  floors_above?: number;
  floors_below?: number;
  gross_internal_area?: number;
  construction_year?: number;
  status: string;
  created_at: string;
}

export interface Asset {
  id: string;
  site_id: string;
  building_id?: string;
  floor_zone_id?: string;
  space_id?: string;
  system_id?: string;
  parent_asset_id?: string;
  asset_reference: string;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  qr_code?: string;
  nfc_tag?: string;
  installation_date?: string;
  warranty_expiry?: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DEFECTIVE';
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'MISSION_CRITICAL';
  statutory_relevance: boolean;
  status: 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'DECOMMISSIONED';
  ownership?: string;
  metadata?: Record<string, any>;
  created_at: string;
  site?: { name: string; site_code: string };
}

export async function listSites(orgId?: string): Promise<Site[]> {
  let endpoint = 'sites?select=*,organisation:organisations(name)&order=name.asc';
  if (orgId) {
    endpoint += `&organisation_id=eq.${encodeURIComponent(orgId)}`;
  }
  const { data } = await dbQuery<Site[]>(endpoint);
  return data || [];
}

export async function getSiteById(id: string): Promise<Site | null> {
  const { data } = await dbQuery<Site[]>(`sites?id=eq.${encodeURIComponent(id)}&select=*,organisation:organisations(name)`);
  return data && data.length > 0 ? data[0] : null;
}

export async function listAssets(filters?: { siteId?: string; category?: string; criticality?: string }): Promise<Asset[]> {
  let endpoint = 'assets?select=*,site:sites(name,site_code)&order=created_at.desc';
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.category) endpoint += `&category=eq.${encodeURIComponent(filters.category)}`;
  if (filters?.criticality) endpoint += `&criticality=eq.${encodeURIComponent(filters.criticality)}`;
  const { data } = await dbQuery<Asset[]>(endpoint);
  return data || [];
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const { data } = await dbQuery<Asset[]>(`assets?id=eq.${encodeURIComponent(id)}&select=*,site:sites(name,site_code)`);
  return data && data.length > 0 ? data[0] : null;
}

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const { data } = await dbQuery<ClientAccount[]>('client_accounts?select=*,organisation:organisations(name,code)&order=created_at.desc');
  return data || [];
}

export async function listContracts(): Promise<Contract[]> {
  const { data } = await dbQuery<Contract[]>('contracts?select=*&order=created_at.desc');
  return data || [];
}

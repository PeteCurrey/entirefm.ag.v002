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

// ── FALLBACK SEED DATA (Resilient FM Estate Sandbox) ──────────────────────────

const FALLBACK_CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'client-001',
    organisation_id: 'org-bl-01',
    account_number: 'CLA-2026-001',
    name: 'British Land Commercial Real Estate',
    account_status: 'ACTIVE',
    account_tier: 'ENTERPRISE',
    created_at: '2026-01-15T09:00:00Z',
    organisation: {
      name: 'British Land Commercial Real Estate',
      code: 'BL-CRE',
      email: 'facilities@britishland.example.com',
      phone: '+44 20 7486 4466',
    },
    account_manager: {
      first_name: 'Sarah',
      last_name: 'Jenkins',
      email: 's.jenkins@entirefm.com',
    },
  },
  {
    id: 'client-002',
    organisation_id: 'org-sav-02',
    account_number: 'CLA-2026-002',
    name: 'Savills Property Asset Management',
    account_status: 'ACTIVE',
    account_tier: 'ENTERPRISE',
    created_at: '2026-01-20T10:30:00Z',
    organisation: {
      name: 'Savills Property Asset Management',
      code: 'SAV-AM',
      email: 'uk-operations@savills.example.com',
      phone: '+44 20 7499 8644',
    },
    account_manager: {
      first_name: 'David',
      last_name: 'Hughes',
      email: 'd.hughes@entirefm.com',
    },
  },
  {
    id: 'client-003',
    organisation_id: 'org-aviva-03',
    account_number: 'CLA-2026-003',
    name: 'Aviva Investors Real Estate',
    account_status: 'ACTIVE',
    account_tier: 'ENTERPRISE',
    created_at: '2026-02-01T14:15:00Z',
    organisation: {
      name: 'Aviva Investors Real Estate',
      code: 'AV-RE',
      email: 'estate.cafm@avivainvestors.example.com',
      phone: '+44 20 7809 6000',
    },
    account_manager: {
      first_name: 'Sarah',
      last_name: 'Jenkins',
      email: 's.jenkins@entirefm.com',
    },
  },
  {
    id: 'client-004',
    organisation_id: 'org-segro-04',
    account_number: 'CLA-2026-004',
    name: 'SEGRO European Logistics Parks',
    account_status: 'ACTIVE',
    account_tier: 'CORPORATE',
    created_at: '2026-02-10T11:00:00Z',
    organisation: {
      name: 'SEGRO European Logistics Parks',
      code: 'SEGRO-UK',
      email: 'logistics.fm@segro.example.com',
      phone: '+44 20 7451 9100',
    },
    account_manager: {
      first_name: 'Michael',
      last_name: 'Zhang',
      email: 'm.zhang@entirefm.com',
    },
  },
  {
    id: 'client-005',
    organisation_id: 'org-ws-05',
    account_number: 'CLA-2026-005',
    name: 'Workspace Group Workplace Hubs',
    account_status: 'ACTIVE',
    account_tier: 'CORPORATE',
    created_at: '2026-02-18T08:45:00Z',
    organisation: {
      name: 'Workspace Group Workplace Hubs',
      code: 'WS-GRP',
      email: 'property.services@workspace.example.com',
      phone: '+44 20 7138 3300',
    },
    account_manager: {
      first_name: 'Emma',
      last_name: 'Watson',
      email: 'e.watson@entirefm.com',
    },
  },
  {
    id: 'client-006',
    organisation_id: 'org-peel-06',
    account_number: 'CLA-2026-006',
    name: 'Peel L&P Ports & Industrial Estates',
    account_status: 'ONBOARDING',
    account_tier: 'CORPORATE',
    created_at: '2026-03-01T15:20:00Z',
    organisation: {
      name: 'Peel L&P Ports & Industrial Estates',
      code: 'PEEL-LP',
      email: 'engineering@peellp.example.com',
      phone: '+44 161 629 8200',
    },
    account_manager: {
      first_name: 'David',
      last_name: 'Hughes',
      email: 'd.hughes@entirefm.com',
    },
  },
  {
    id: 'client-007',
    organisation_id: 'org-crown-07',
    account_number: 'CLA-2026-007',
    name: 'The Crown Estate Regional Retail',
    account_status: 'ACTIVE',
    account_tier: 'ENTERPRISE',
    created_at: '2026-03-10T12:00:00Z',
    organisation: {
      name: 'The Crown Estate Regional Retail',
      code: 'TCE-REG',
      email: 'procurement@thecrownestate.example.com',
      phone: '+44 20 7851 5000',
    },
    account_manager: {
      first_name: 'Sarah',
      last_name: 'Jenkins',
      email: 's.jenkins@entirefm.com',
    },
  },
  {
    id: 'client-008',
    organisation_id: 'org-der-08',
    account_number: 'CLA-2026-008',
    name: 'Derwent London Workplace Estate',
    account_status: 'ACTIVE',
    account_tier: 'REGIONAL',
    created_at: '2026-03-15T09:30:00Z',
    organisation: {
      name: 'Derwent London Workplace Estate',
      code: 'DL-WORK',
      email: 'building.ops@derwentlondon.example.com',
      phone: '+44 20 7659 3000',
    },
    account_manager: {
      first_name: 'Emma',
      last_name: 'Watson',
      email: 'e.watson@entirefm.com',
    },
  },
];

const FALLBACK_CONTRACTS: Contract[] = [
  {
    id: 'con-001',
    client_account_id: 'client-001',
    contract_reference: 'CNT-2026-001-TFM',
    name: 'Total FM & Hard Services Agreement',
    contract_type: 'TOTAL_FM',
    start_date: '2026-01-01',
    end_date: '2028-12-31',
    billing_method: 'MONTHLY_ARREARS',
    annual_value_gbp: 480000,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    client_account: {
      name: 'British Land Commercial Real Estate',
      account_number: 'CLA-2026-001',
    },
  },
  {
    id: 'con-002',
    client_account_id: 'client-002',
    contract_reference: 'CNT-2026-002-HFM',
    name: 'Hard FM Mechanical & Electrical Maintenance',
    contract_type: 'HARD_FM',
    start_date: '2026-02-01',
    end_date: '2029-01-31',
    billing_method: 'FIXED_ANNUAL',
    annual_value_gbp: 320000,
    status: 'ACTIVE',
    created_at: '2026-01-20T00:00:00Z',
    client_account: {
      name: 'Savills Property Asset Management',
      account_number: 'CLA-2026-002',
    },
  },
  {
    id: 'con-003',
    client_account_id: 'client-003',
    contract_reference: 'CNT-2026-003-PPM',
    name: 'Statutory Compliance & Planned Maintenance',
    contract_type: 'PPM_ONLY',
    start_date: '2026-03-01',
    end_date: '2027-02-28',
    billing_method: 'MONTHLY_ARREARS',
    annual_value_gbp: 185000,
    status: 'ACTIVE',
    created_at: '2026-02-01T00:00:00Z',
    client_account: {
      name: 'Aviva Investors Real Estate',
      account_number: 'CLA-2026-003',
    },
  },
];

const FALLBACK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'port-001',
    client_account_id: 'client-001',
    name: 'London Central & City Commercial Portfolio',
    code: 'LON-CENTRAL',
    description: 'Prime Grade-A commercial office developments across City of London and West End.',
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'port-002',
    client_account_id: 'client-002',
    name: 'North West Regional Logistics & Business Parks',
    code: 'NW-LOGISTICS',
    description: 'Distribution depots, logistics warehouses, and industrial parks in Greater Manchester and Merseyside.',
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'port-003',
    client_account_id: 'client-004',
    name: 'Midlands Freight & Logistics Spine',
    code: 'MID-FREIGHT',
    description: 'Multi-modal distribution hubs along M1/M6 corridors.',
    created_at: '2026-02-10T11:00:00Z',
  },
];

export async function listClientAccounts(): Promise<ClientAccount[]> {
  try {
    const { data, error } = await dbQuery<ClientAccount[]>(
      'client_accounts?select=*,organisation:organisations(name,code,phone,email),account_manager:persons(first_name,last_name,email)&order=created_at.desc'
    );
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching client accounts from DB:', err);
  }
  return FALLBACK_CLIENT_ACCOUNTS;
}

export async function listContracts(clientAccountId?: string): Promise<Contract[]> {
  try {
    let endpoint = 'contracts?select=*,client_account:client_accounts(name,account_number)&order=created_at.desc';
    if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
    const { data, error } = await dbQuery<Contract[]>(endpoint);
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching contracts from DB:', err);
  }
  if (clientAccountId) {
    return FALLBACK_CONTRACTS.filter((c) => c.client_account_id === clientAccountId);
  }
  return FALLBACK_CONTRACTS;
}

export async function listPortfolios(clientAccountId?: string): Promise<Portfolio[]> {
  try {
    let endpoint = 'portfolios?select=*&order=name.asc';
    if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
    const { data, error } = await dbQuery<Portfolio[]>(endpoint);
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching portfolios from DB:', err);
  }
  if (clientAccountId) {
    return FALLBACK_PORTFOLIOS.filter((p) => p.client_account_id === clientAccountId);
  }
  return FALLBACK_PORTFOLIOS;
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

/**
 * ENTIREFM ESTATE & ASSET DOMAIN MODULE (Phase 0B CAFM Operations Core)
 * ====================================================================
 * Canonical Estate Hierarchy:
 * ClientAccount -> Contract -> Portfolio -> Site -> Building -> FloorZone -> Space -> System -> Asset -> Component
 */

import { dbQuery } from '../db/client';
import { geocodePostcode } from '../geo/geocoding';

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

// ── CANONICAL ESTATE DATA SERVICES (Zero Mock Fallbacks) ──────────────────────────

export async function listClientAccounts(): Promise<ClientAccount[]> {
  try {
    const { data, error } = await dbQuery<ClientAccount[]>(
      'client_accounts?select=id,name,account_number,account_status,account_tier,account_manager_id,primary_contact_id,organisation_id,created_at,organisation:organisations(name,code,phone,email),account_manager:persons!client_accounts_account_manager_id_fkey(first_name,last_name,email)&order=created_at.desc'
    );
    if (!error && data) {
      return data;
    }
    if (error) {
      console.error('Error fetching client accounts from DB:', error);
    }
  } catch (err) {
    console.error('Error fetching client accounts from DB:', err);
  }
  return [];
}

export async function getClientAccount(id: string): Promise<ClientAccount | null> {
  const { data } = await dbQuery<ClientAccount[]>(
    `client_accounts?id=eq.${encodeURIComponent(id)}&select=id,name,account_number,account_status,account_tier,account_manager_id,primary_contact_id,organisation_id,created_at,organisation:organisations(name,code,phone,email),account_manager:persons!client_accounts_account_manager_id_fkey(first_name,last_name,email)&limit=1`
  );
  return data?.[0] || null;
}


export async function createClientAccount(params: {
  name: string;
  account_tier?: 'ENTERPRISE' | 'CORPORATE' | 'REGIONAL' | 'SME';
  account_status?: 'PROSPECT' | 'ONBOARDING' | 'ACTIVE' | 'AT_RISK' | 'SUSPENDED' | 'CHURNED';
  account_number?: string;
  email?: string;
  phone?: string;
  organisation_code?: string;
  organisation_id?: string;
  account_manager_id?: string;
  primary_contact_id?: string;
}): Promise<ClientAccount> {
  let orgId = params.organisation_id;

  // Resolve or create organisation if not supplied
  if (!orgId) {
    const rawCode = (params.organisation_code || params.name.substring(0, 6)).trim();
    const cleanCode = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, '') || `ORG-${Date.now().toString().slice(-4)}`;

    // 1. Check if an organisation with this code already exists
    const { data: existingByCode } = await dbQuery<any[]>(
      `organisations?code=eq.${encodeURIComponent(cleanCode)}&limit=1&select=id,name`
    );

    if (existingByCode?.[0]) {
      orgId = existingByCode[0].id;
    } else {
      // 2. Attempt creation. If collision occurs, retry with unique suffix
      let { data: orgData, error: orgError } = await dbQuery<any[]>('organisations', {
        method: 'POST',
        body: {
          name: params.name,
          code: cleanCode,
          org_type: 'CLIENT',
          email: params.email || null,
          phone: params.phone || null,
          status: 'ACTIVE',
        },
      });

      if (orgError && orgError.includes('23505')) {
        const fallbackCode = `${cleanCode}-${Math.floor(1000 + Math.random() * 9000)}`;
        const retry = await dbQuery<any[]>('organisations', {
          method: 'POST',
          body: {
            name: params.name,
            code: fallbackCode,
            org_type: 'CLIENT',
            email: params.email || null,
            phone: params.phone || null,
            status: 'ACTIVE',
          },
        });
        orgData = retry.data;
        orgError = retry.error;
      }

      if (orgError || !orgData?.[0]) {
        throw new Error(`Failed to create organisation: ${orgError || 'Unknown error'}`);
      }
      orgId = orgData[0].id;
    }
  }

  let primaryContactId = params.primary_contact_id || null;

  // If primary contact wasn't directly passed by ID but email was provided, resolve or create person & membership
  if (!primaryContactId && params.email) {
    try {
      const emailLower = params.email.trim().toLowerCase();
      const { data: existingPerson } = await dbQuery<any[]>(
        `persons?email=eq.${encodeURIComponent(emailLower)}&limit=1`
      );
      if (existingPerson && existingPerson.length > 0) {
        primaryContactId = existingPerson[0].id;
      } else {
        const nameParts = params.name.trim().split(/\s+/);
        const firstName = nameParts[0] || 'Client';
        const lastName = nameParts.slice(1).join(' ') || 'Admin';

        const { data: newPerson } = await dbQuery<any[]>('persons', {
          method: 'POST',
          body: {
            first_name: firstName,
            last_name: lastName,
            email: emailLower,
            phone: params.phone || null,
            job_title: 'Client Administrator',
            status: 'ACTIVE',
            metadata: { auto_provisioned: true, client_org_id: orgId },
          },
        });
        if (newPerson && newPerson.length > 0) {
          primaryContactId = newPerson[0].id;
        }
      }

      // Ensure membership in this organisation with CLIENT_ADMIN role
      if (primaryContactId && orgId) {
        const { data: existingMembership } = await dbQuery<any[]>(
          `organisation_memberships?person_id=eq.${encodeURIComponent(primaryContactId)}&organisation_id=eq.${encodeURIComponent(orgId)}&limit=1`
        );
        if (!existingMembership || existingMembership.length === 0) {
          const { data: roleRow } = await dbQuery<any[]>(
            `roles?code=eq.CLIENT_ADMIN&limit=1`
          );
          const roleId = roleRow?.[0]?.id || 'febc08c9-c92c-4068-b26d-ae77a35ef230';

          await dbQuery('organisation_memberships', {
            method: 'POST',
            body: {
              person_id: primaryContactId,
              organisation_id: orgId,
              role_id: roleId,
              is_primary: true,
              status: 'ACTIVE',
            },
          });
        }
      }
    } catch (contactErr) {
      console.warn('[CreateClientAccount:ContactLinkageWarn]', contactErr);
    }
  }

  let accountNumber = params.account_number || `CLA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let { data, error } = await dbQuery<ClientAccount[]>('client_accounts', {
    method: 'POST',
    body: {
      organisation_id: orgId,
      // account_code is the legacy unique key, kept for backwards compatibility
      account_code: accountNumber,
      account_number: accountNumber,
      name: params.name,
      account_status: params.account_status || 'ACTIVE',
      account_tier: params.account_tier || 'CORPORATE',
      account_manager_id: params.account_manager_id || null,
      primary_contact_id: primaryContactId,
    },
  });

  if (error && error.includes('23505')) {
    accountNumber = `CLA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const retry = await dbQuery<ClientAccount[]>('client_accounts', {
      method: 'POST',
      body: {
        organisation_id: orgId,
        account_code: accountNumber,
        account_number: accountNumber,
        name: params.name,
        account_status: params.account_status || 'ACTIVE',
        account_tier: params.account_tier || 'CORPORATE',
        account_manager_id: params.account_manager_id || null,
        primary_contact_id: params.primary_contact_id || null,
      },
    });
    data = retry.data;
    error = retry.error;
  }

  if (error || !data?.[0]) {
    throw new Error(`Failed to create client account: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function listContracts(clientAccountId?: string): Promise<Contract[]> {
  try {
    let endpoint = 'contracts?select=*,client_account:client_accounts(name,account_number)&order=created_at.desc';
    if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
    const { data, error } = await dbQuery<Contract[]>(endpoint);
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching contracts from DB:', err);
  }
  return [];
}

export async function getContract(id: string): Promise<Contract | null> {
  const { data } = await dbQuery<Contract[]>(
    `contracts?id=eq.${encodeURIComponent(id)}&select=*,client_account:client_accounts(name,account_number)&limit=1`
  );
  return data?.[0] || null;
}

export async function createContract(params: {
  client_account_id: string;
  name: string;
  contract_reference?: string;
  contract_type?: 'TOTAL_FM' | 'HARD_FM' | 'SOFT_FM' | 'PPM_ONLY' | 'REACTIVE_ONLY' | 'STATUTORY_ONLY';
  start_date: string;
  end_date: string;
  billing_method?: 'FIXED_ANNUAL' | 'MONTHLY_ARREARS' | 'TIME_AND_MATERIALS' | 'SCHEDULE_OF_RATES';
  annual_value_gbp?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'RENEWAL_DUE' | 'EXPIRED' | 'TERMINATED';
}): Promise<Contract> {
  const ref = params.contract_reference || `CNT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data, error } = await dbQuery<Contract[]>('contracts', {
    method: 'POST',
    body: {
      client_account_id: params.client_account_id,
      contract_reference: ref,
      name: params.name,
      contract_type: params.contract_type || 'HARD_FM',
      start_date: params.start_date,
      end_date: params.end_date,
      billing_method: params.billing_method || 'MONTHLY_ARREARS',
      annual_value_gbp: params.annual_value_gbp || null,
      status: params.status || 'ACTIVE',
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create contract: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function listPortfolios(clientAccountId?: string): Promise<Portfolio[]> {
  try {
    let endpoint = 'portfolios?select=*&order=name.asc';
    if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
    const { data, error } = await dbQuery<Portfolio[]>(endpoint);
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching portfolios from DB:', err);
  }
  return [];
}

export async function listSites(filters?: { clientAccountId?: string; status?: string }): Promise<Site[]> {
  let endpoint = 'sites?select=*,organisation:organisations(name),client_account:client_accounts(name)&order=name.asc';
  if (filters?.clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<Site[]>(endpoint);
  return data || [];
}

export async function getSite(id: string): Promise<Site | null> {
  const { data } = await dbQuery<Site[]>(
    `sites?id=eq.${encodeURIComponent(id)}&select=*,organisation:organisations(name),client_account:client_accounts(name)&limit=1`
  );
  return data?.[0] || null;
}

export async function createSite(params: {
  name: string;
  site_code?: string;
  organisation_id?: string;
  client_account_id?: string;
  portfolio_id?: string;
  site_type?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country?: string;
  access_instructions?: string;
  security_clearance_required?: boolean;
  status?: 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';
}): Promise<Site> {
  let orgId = params.organisation_id;
  if (!orgId && params.client_account_id) {
    const client = await getClientAccount(params.client_account_id);
    orgId = client?.organisation_id;
  }
  if (!orgId) {
    const { data: orgs } = await dbQuery<any[]>('organisations?limit=1');
    orgId = orgs?.[0]?.id;
  }
  if (!orgId) {
    throw new Error('Organisation ID is required to create a site.');
  }

  const siteCode = params.site_code || `STE-${params.name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

  let latitude: number | null = null;
  let longitude: number | null = null;
  if (params.postcode) {
    try {
      const coords = await geocodePostcode(params.postcode, params.country || 'GB');
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    } catch {
      // Non-blocking geocoding failure
    }
  }

  const { data, error } = await dbQuery<Site[]>('sites', {
    method: 'POST',
    body: {
      organisation_id: orgId,
      client_account_id: params.client_account_id || null,
      portfolio_id: params.portfolio_id || null,
      site_code: siteCode,
      name: params.name,
      site_type: params.site_type || 'COMMERCIAL_OFFICE',
      address_line1: params.address_line1,
      address_line2: params.address_line2 || null,
      city: params.city,
      county: params.county || null,
      postcode: params.postcode,
      country: params.country || 'United Kingdom',
      latitude,
      longitude,
      access_instructions: params.access_instructions || null,
      security_clearance_required: params.security_clearance_required ?? false,
      status: params.status || 'ACTIVE',
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create site: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function listAssets(filters?: { siteId?: string; category?: string; criticality?: string }): Promise<Asset[]> {
  let endpoint = 'assets?select=*,site:sites(name,site_code,address_line1,postcode)&order=asset_reference.asc';
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.category) endpoint += `&category=eq.${encodeURIComponent(filters.category)}`;
  if (filters?.criticality) endpoint += `&criticality=eq.${encodeURIComponent(filters.criticality)}`;
  const { data } = await dbQuery<Asset[]>(endpoint);
  return data || [];
}

export async function getAsset(id: string): Promise<Asset | null> {
  const { data } = await dbQuery<Asset[]>(
    `assets?id=eq.${encodeURIComponent(id)}&select=*,site:sites(name,site_code,address_line1,postcode)&limit=1`
  );
  return data?.[0] || null;
}

export async function createAsset(params: {
  site_id: string;
  name: string;
  asset_reference?: string;
  category: string;
  system_category?: string;
  building_id?: string;
  space_id?: string;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  qr_code?: string;
  install_date?: string;
  warranty_expiry_date?: string;
  condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNSERVICEABLE' | 'DECOMMISSIONED';
  criticality?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  statutory_compliance_required?: boolean;
  status?: 'IN_SERVICE' | 'STANDBY' | 'DEFECTIVE' | 'UNDER_REPAIR' | 'OUT_OF_SERVICE' | 'DISPOSED';
}): Promise<Asset> {
  const ref = params.asset_reference || `AST-${params.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data, error } = await dbQuery<Asset[]>('assets', {
    method: 'POST',
    body: {
      site_id: params.site_id,
      name: params.name,
      asset_reference: ref,
      category: params.category,
      system_category: params.system_category || null,
      building_id: params.building_id || null,
      space_id: params.space_id || null,
      manufacturer: params.manufacturer || null,
      model_number: params.model_number || null,
      serial_number: params.serial_number || null,
      qr_code: params.qr_code || null,
      install_date: params.install_date || null,
      warranty_expiry_date: params.warranty_expiry_date || null,
      condition: params.condition || 'GOOD',
      criticality: params.criticality || 'MEDIUM',
      statutory_compliance_required: params.statutory_compliance_required ?? false,
      status: params.status || 'IN_SERVICE',
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create asset: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function listBuildings(siteId?: string): Promise<Building[]> {
  let endpoint = 'buildings?select=*&order=name.asc';
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  const { data } = await dbQuery<Building[]>(endpoint);
  return data || [];
}

export async function createBuilding(params: {
  site_id: string;
  name: string;
  building_code?: string;
  gross_internal_area_sqm?: number;
  total_floors?: number;
  status?: string;
}): Promise<Building> {
  const code = params.building_code || `BLD-${Math.floor(100 + Math.random() * 900)}`;
  const { data, error } = await dbQuery<Building[]>('buildings', {
    method: 'POST',
    body: {
      site_id: params.site_id,
      name: params.name,
      building_code: code,
      gross_internal_area_sqm: params.gross_internal_area_sqm || null,
      total_floors: params.total_floors || 1,
      status: params.status || 'ACTIVE',
    },
  });
  if (error || !data?.[0]) throw new Error(`Failed to create building: ${error}`);
  return data[0];
}

export async function listSpaces(siteId?: string): Promise<Space[]> {
  let endpoint = 'spaces?select=*&order=name.asc';
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  const { data } = await dbQuery<Space[]>(endpoint);
  return data || [];
}

export async function createSpace(params: {
  site_id: string;
  name: string;
  space_code?: string;
  floor_zone_id?: string;
  space_type?: string;
  status?: string;
}): Promise<Space> {
  const code = params.space_code || `SPC-${Math.floor(100 + Math.random() * 900)}`;
  const { data, error } = await dbQuery<Space[]>('spaces', {
    method: 'POST',
    body: {
      site_id: params.site_id,
      name: params.name,
      space_code: code,
      floor_zone_id: params.floor_zone_id || null,
      space_type: params.space_type || 'OFFICE',
      status: params.status || 'ACTIVE',
    },
  });
  if (error || !data?.[0]) throw new Error(`Failed to create space: ${error}`);
  return data[0];
}

export async function updateSite(
  id: string,
  params: {
    name?: string;
    site_code?: string;
    client_account_id?: string | null;
    portfolio_id?: string | null;
    site_type?: string;
    address_line1?: string;
    address_line2?: string | null;
    city?: string;
    county?: string | null;
    postcode?: string;
    country?: string;
    access_instructions?: string | null;
    security_clearance_required?: boolean;
    status?: 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';
  }
): Promise<Site> {
  const updates: Record<string, any> = { ...params, updated_at: new Date().toISOString() };
  if (params.client_account_id) {
    const client = await getClientAccount(params.client_account_id);
    if (client?.organisation_id) {
      updates.organisation_id = client.organisation_id;
    }
  }

  const { error } = await dbQuery(`sites?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: updates,
  });

  if (error) {
    throw new Error(`Failed to update site: ${error}`);
  }

  const updated = await getSite(id);
  if (!updated) {
    throw new Error(`Site not found after update: ${id}`);
  }
  return updated;
}

export async function updateClientAccount(
  id: string,
  params: {
    name?: string;
    account_tier?: 'ENTERPRISE' | 'CORPORATE' | 'REGIONAL' | 'SME';
    account_status?: 'PROSPECT' | 'ONBOARDING' | 'ACTIVE' | 'AT_RISK' | 'SUSPENDED' | 'CHURNED';
    account_manager_id?: string | null;
    email?: string | null;
    phone?: string | null;
    organisation_code?: string | null;
  }
): Promise<ClientAccount> {
  const clientUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (params.name !== undefined) clientUpdates.name = params.name;
  if (params.account_tier !== undefined) clientUpdates.account_tier = params.account_tier;
  if (params.account_status !== undefined) clientUpdates.account_status = params.account_status;
  if (params.account_manager_id !== undefined) clientUpdates.account_manager_id = params.account_manager_id;

  const { error: clientError } = await dbQuery(`client_accounts?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: clientUpdates,
  });

  if (clientError) {
    throw new Error(`Failed to update client account: ${clientError}`);
  }

  if (params.name !== undefined || params.email !== undefined || params.phone !== undefined || params.organisation_code !== undefined) {
    const existing = await getClientAccount(id);
    if (existing?.organisation_id) {
      const orgUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (params.name !== undefined) orgUpdates.name = params.name;
      if (params.email !== undefined) orgUpdates.email = params.email;
      if (params.phone !== undefined) orgUpdates.phone = params.phone;
      if (params.organisation_code !== undefined) orgUpdates.code = params.organisation_code;

      await dbQuery(`organisations?id=eq.${encodeURIComponent(existing.organisation_id)}`, {
        method: 'PATCH',
        body: orgUpdates,
      });
    }
  }

  const updated = await getClientAccount(id);
  if (!updated) {
    throw new Error(`Client account not found after update: ${id}`);
  }
  return updated;
}


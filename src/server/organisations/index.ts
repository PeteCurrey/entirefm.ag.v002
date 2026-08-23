/**
 * ENTIREFM ORGANISATIONS DOMAIN MODULE
 * ====================================
 * Organisation lifecycle, multi-tenant isolation, and membership management.
 */

import { dbQuery } from '../db/client';
import { Organisation, OrgType } from '../identity';

export async function listOrganisations(type?: OrgType): Promise<Organisation[]> {
  let endpoint = 'organisations?select=*&order=created_at.desc';
  if (type) {
    endpoint += `&org_type=eq.${encodeURIComponent(type)}`;
  }
  const { data } = await dbQuery<Organisation[]>(endpoint);
  return data || [];
}

export async function getOrganisationById(id: string): Promise<Organisation | null> {
  const { data } = await dbQuery<Organisation[]>(`organisations?id=eq.${encodeURIComponent(id)}&select=*`);
  return data && data.length > 0 ? data[0] : null;
}

export async function createOrganisation(org: {
  code: string;
  name: string;
  legal_name?: string;
  org_type: OrgType;
  company_number?: string;
  vat_number?: string;
  tier?: string;
}): Promise<Organisation | null> {
  const { data } = await dbQuery<Organisation[]>('organisations', {
    method: 'POST',
    body: org,
  });
  return data && data.length > 0 ? data[0] : null;
}

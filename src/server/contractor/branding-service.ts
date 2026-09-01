/**
 * ENTIREFM CONTRACTOR BRANDING SERVICE
 * ====================================
 * Manages custom white-label contractor brand profiles for independent documents,
 * quotes, invoices, and job packs.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';

export interface ContractorBrandProfile {
  id?: string;
  organisation_id: string;
  company_name: string;
  trading_name?: string;
  logo_url?: string;
  brand_color_primary: string;
  brand_color_secondary: string;
  vat_number?: string;
  company_number?: string;
  phone?: string;
  email?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postcode?: string;
  document_prefix: string;
  quote_prefix: string;
  invoice_prefix: string;
  footer_text: string;
  settings?: Record<string, any>;
}

export async function getContractorBrandProfile(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorBrandProfile> {
  const { data: profiles } = await dbQuery<any[]>(
    `contractor_brand_profiles?organisation_id=eq.${encodeURIComponent(contractorOrgId)}`
  );

  if (profiles && profiles.length > 0) {
    return profiles[0];
  }

  // Return sensible default derived from organisation details
  return {
    organisation_id: contractorOrgId,
    company_name: session.orgName || 'Contractor Engineering Services Ltd',
    brand_color_primary: '#0284c7',
    brand_color_secondary: '#0f172a',
    document_prefix: 'DOC-',
    quote_prefix: 'QT-',
    invoice_prefix: 'INV-',
    footer_text: 'Thank you for choosing our professional services.',
    settings: {},
  };
}

export async function saveContractorBrandProfile(
  profile: Partial<ContractorBrandProfile> & { organisation_id: string },
  session: UserSession
): Promise<{ success: boolean; profile?: ContractorBrandProfile; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== profile.organisation_id) {
    return { success: false, error: 'Unauthorized to update another organisation branding' };
  }

  const payload = {
    organisation_id: profile.organisation_id,
    company_name: profile.company_name || session.orgName,
    trading_name: profile.trading_name || null,
    logo_url: profile.logo_url || null,
    brand_color_primary: profile.brand_color_primary || '#0284c7',
    brand_color_secondary: profile.brand_color_secondary || '#0f172a',
    vat_number: profile.vat_number || null,
    company_number: profile.company_number || null,
    phone: profile.phone || null,
    email: profile.email || null,
    website: profile.website || null,
    address_line1: profile.address_line1 || null,
    address_line2: profile.address_line2 || null,
    city: profile.city || null,
    postcode: profile.postcode || null,
    document_prefix: profile.document_prefix || 'DOC-',
    quote_prefix: profile.quote_prefix || 'QT-',
    invoice_prefix: profile.invoice_prefix || 'INV-',
    footer_text: profile.footer_text || 'Thank you for your business.',
    settings: profile.settings || {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await dbQuery<any[]>(`contractor_brand_profiles`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: payload,
  });

  if (error) {
    console.error('[BRAND_PROFILE_SAVE_ERROR]', error);
    return { success: false, error };
  }

  return { success: true, profile: data?.[0] || payload };
}

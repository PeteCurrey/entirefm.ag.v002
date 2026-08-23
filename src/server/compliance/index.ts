/**
 * ENTIREFM COMPLIANCE DOMAIN MODULE
 * =================================
 * Versioned compliance rules, statutory obligations tracking, certificates, and expiries.
 */

import { dbQuery } from '../db/client';

export interface ComplianceSource {
  id: string;
  code: string;
  name: string;
  source_type: 'STATUTORY' | 'STANDARD' | 'INDUSTRY_GUIDANCE' | 'BEST_PRACTICE';
  jurisdiction: string;
  publishing_body: string;
  url?: string;
  created_at: string;
}

export interface ComplianceRule {
  id: string;
  source_id: string;
  code: string;
  title: string;
  category: string;
  statutory_level: string;
  created_at: string;
}

export interface ComplianceObligation {
  id: string;
  site_id: string;
  building_id?: string;
  asset_id?: string;
  compliance_rule_version_id: string;
  frequency_days: number;
  last_performed_at?: string;
  next_due_at: string;
  grace_period_days: number;
  status: 'COMPLIANT' | 'DUE_SOON' | 'OVERDUE' | 'EXEMPT';
  assigned_contractor_id?: string;
  created_at: string;
  site?: { name: string; site_code: string };
  asset?: { name: string; asset_reference: string };
}

export interface Certificate {
  id: string;
  site_id: string;
  building_id?: string;
  asset_id?: string;
  certificate_type: string;
  certificate_number: string;
  issued_by_org: string;
  issued_date: string;
  expiry_date: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED';
  document_url?: string;
  created_at: string;
  site?: { name: string; site_code: string };
}

export async function listComplianceObligations(status?: string): Promise<ComplianceObligation[]> {
  let endpoint = 'compliance_obligations?select=*,site:sites(name,site_code),asset:assets(name,asset_reference)&order=next_due_at.asc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<ComplianceObligation[]>(endpoint);
  return data || [];
}

export async function listCertificates(status?: string): Promise<Certificate[]> {
  let endpoint = 'certificates?select=*,site:sites(name,site_code)&order=expiry_date.asc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<Certificate[]>(endpoint);
  return data || [];
}

export async function listComplianceSources(): Promise<ComplianceSource[]> {
  const { data } = await dbQuery<ComplianceSource[]>('compliance_sources?select=*&order=name.asc');
  return data || [];
}

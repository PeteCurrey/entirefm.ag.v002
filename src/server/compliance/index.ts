/**
 * ENTIREFM COMPLIANCE DOMAIN MODULE (Phase 0A-R Hardened)
 * =======================================================
 * Versioned compliance rules, statutory obligations, applicability assessments,
 * recurring compliance tasks, and exception management.
 */

import { dbQuery } from '../db/client';

export interface ApplicabilityAssessment {
  id: string;
  client_account_id?: string;
  site_id?: string;
  building_id?: string;
  asset_id?: string;
  system_id?: string;
  compliance_rule_id: string;
  rule_version_id?: string;
  is_applicable: 'YES' | 'NO' | 'UNKNOWN';
  input_facts_json?: Record<string, any>;
  reasoning: string;
  assessed_by_id?: string;
  assessed_at: string;
}

export interface ComplianceTask {
  id: string;
  compliance_obligation_id: string;
  work_order_id?: string;
  task_type: 'INSPECTION' | 'TEST' | 'SERVICE' | 'AUDIT' | 'CERTIFICATE_RENEWAL' | 'REVIEW';
  target_due_date: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  passed?: boolean;
  engineer_notes?: string;
  completed_at?: string;
}

export interface ComplianceException {
  id: string;
  compliance_obligation_id?: string;
  site_id: string;
  asset_id?: string;
  exception_type:
    | 'INACCESSIBLE_ASSET'
    | 'MISSING_EVIDENCE'
    | 'OVERDUE_STATUTORY'
    | 'FAILED_INSPECTION'
    | 'INVALID_CERTIFICATE'
    | 'CONTRACTOR_COMPETENCY';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  reason: string;
  mitigation_plan?: string;
  remediation_due_date?: string;
  owner_person_id?: string;
  status: 'OPEN' | 'MITIGATED' | 'RESOLVED';
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

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
  let endpoint =
    'compliance_obligations?select=*,site:sites(name,site_code),asset:assets(name,asset_reference)&order=next_due_at.asc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<ComplianceObligation[]>(endpoint);
  return data || [];
}

export async function listComplianceExceptions(status = 'OPEN'): Promise<ComplianceException[]> {
  const { data } = await dbQuery<ComplianceException[]>(
    `compliance_exceptions?status=eq.${encodeURIComponent(status)}&select=*&order=created_at.desc`
  );
  return data || [];
}

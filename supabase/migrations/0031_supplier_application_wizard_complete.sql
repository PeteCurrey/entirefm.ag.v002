/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0031 — COMPLETE SUPPLIER APPLICATION WIZARD SCHEMA
 * ============================================================================
 * Adds all necessary columns to supplier_application_drafts and establishes
 * the supplier_documents table for durable document vault persistence.
 */

-- Ensure supplier_application_drafts has all extended fields
ALTER TABLE public.supplier_application_drafts
  ADD COLUMN IF NOT EXISTS contacts_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS service_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_services text,
  ADD COLUMN IF NOT EXISTS coverage_type text NOT NULL DEFAULT 'REGIONAL',
  ADD COLUMN IF NOT EXISTS operating_bases jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS operational_radius_miles integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS national_mobilisation boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS service_delivery_types jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS standard_operating_hours text DEFAULT '08:00 - 17:00 (Mon-Fri)',
  ADD COLUMN IF NOT EXISTS emergency_24_7_staffing text,
  ADD COLUMN IF NOT EXISTS emergency_contact_mechanism text,
  ADD COLUMN IF NOT EXISTS response_time_p1 text,
  ADD COLUMN IF NOT EXISTS response_time_p2 text,
  ADD COLUMN IF NOT EXISTS response_time_p3 text,
  ADD COLUMN IF NOT EXISTS vehicle_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS branded_fleet boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS gps_tracking boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vehicle_stock boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS specialist_equipment_available boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS specialist_equipment_details text,
  ADD COLUMN IF NOT EXISTS work_management_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS engineer_device_capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS field_operatives_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qualified_engineers_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supervisors_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS office_staff_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS apprentices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employment_model text DEFAULT 'DIRECT_EMPLOYEES',
  ADD COLUMN IF NOT EXISTS qualifications_held jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_qualifications text,
  ADD COLUMN IF NOT EXISTS subcontractor_pct integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subcontractor_trades jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subcontractor_approval_process text,
  ADD COLUMN IF NOT EXISTS sub_checks_competency boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_insurance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_hs boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_accreditation boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_monitors_performance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_entirefm_compliance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_standards_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS el_insurer text,
  ADD COLUMN IF NOT EXISTS el_policy_number text,
  ADD COLUMN IF NOT EXISTS el_cover_limit text,
  ADD COLUMN IF NOT EXISTS el_expiry_date text,
  ADD COLUMN IF NOT EXISTS pi_applicable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pi_insurer text,
  ADD COLUMN IF NOT EXISTS pi_policy_number text,
  ADD COLUMN IF NOT EXISTS pi_cover_limit text,
  ADD COLUMN IF NOT EXISTS pi_expiry_date text,
  ADD COLUMN IF NOT EXISTS hs_policy_review_date text,
  ADD COLUMN IF NOT EXISTS competent_person_name text,
  ADD COLUMN IF NOT EXISTS competent_person_role text,
  ADD COLUMN IF NOT EXISTS competent_person_type text DEFAULT 'INTERNAL',
  ADD COLUMN IF NOT EXISTS rams_approver_role text,
  ADD COLUMN IF NOT EXISTS rams_provided_pre_attendance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS rams_operatives_briefed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS high_risk_controls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS incident_riddor_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_lti_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_improvement_notices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_prohibition_notices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_prosecutions_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_details text,
  ADD COLUMN IF NOT EXISTS training_matrix_maintained boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS certifications_monitored boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS toolbox_talks_regular boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS site_inductions_supported boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS modern_slavery_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS modern_slavery_statement boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS modern_slavery_supply_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS anti_bribery_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gifts_hospitality_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS conflicts_interest_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS equality_diversity_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS right_to_work_checks boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS fair_employment_practices boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS whistleblowing_procedure boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS disclosure_criminal_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_fraud_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_bribery_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_regulatory_enforcement boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_insolvency_disqualification boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_details text,
  ADD COLUMN IF NOT EXISTS sanctions_confirmed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS infosec_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS data_protection_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gdpr_procedures boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS dpo_contact_name text,
  ADD COLUMN IF NOT EXISTS dpo_contact_email text,
  ADD COLUMN IF NOT EXISTS cyber_certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cyber_cert_number text,
  ADD COLUMN IF NOT EXISTS cyber_controls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS processes_personal_data boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS personal_data_safeguards text,
  ADD COLUMN IF NOT EXISTS cyber_breach_past_3yr boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cyber_breach_details text,
  ADD COLUMN IF NOT EXISTS turnover_band text,
  ADD COLUMN IF NOT EXISTS largest_contract_band text,
  ADD COLUMN IF NOT EXISTS max_mobilisation_size text,
  ADD COLUMN IF NOT EXISTS multi_site_capability boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS accounts_payable_email text,
  ADD COLUMN IF NOT EXISTS requires_po boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS declarant_name text,
  ADD COLUMN IF NOT EXISTS declarant_role text,
  ADD COLUMN IF NOT EXISTS declarant_user_id text,
  ADD COLUMN IF NOT EXISTS declared_at timestamptz,
  ADD COLUMN IF NOT EXISTS code_of_conduct_version text DEFAULT '2026.1',
  ADD COLUMN IF NOT EXISTS legal_acceptances jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS document_vault jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Create supplier_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id                  text        PRIMARY KEY,
  supplier_id         text        NOT NULL,
  category            text        NOT NULL,
  document_type       text        NOT NULL,
  file_name           text        NOT NULL,
  file_size_bytes     bigint      DEFAULT 0,
  file_url            text,
  issue_date          text,
  expiry_date         text,
  status              text        NOT NULL DEFAULT 'UPLOADED',
  uploaded_by         text,
  uploaded_at         timestamptz NOT NULL DEFAULT now(),
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_documents_supplier_id ON public.supplier_documents (supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_documents_category ON public.supplier_documents (category);
CREATE INDEX IF NOT EXISTS idx_supplier_documents_doc_type ON public.supplier_documents (document_type);

-- Enable RLS
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_documents' AND tablename = 'supplier_documents') THEN
    DROP POLICY IF EXISTS service_role_supplier_documents ON public.supplier_documents;
CREATE POLICY service_role_supplier_documents ON public.supplier_documents FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

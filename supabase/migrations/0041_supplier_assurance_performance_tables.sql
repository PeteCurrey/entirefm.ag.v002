-- ============================================================================
-- ENTIREFM MIGRATION 0041: SUPPLIER ASSURANCE & PERFORMANCE INTELLIGENCE TABLES
-- ============================================================================
-- Replaces ephemeral in-memory storage for assurance and performance stores.
-- Dual-Identity Support:
--   - supplier_org_id (text -> public.supplier_organisations(id)) for pre-approval onboarding
--   - organisation_id (uuid -> public.organisations(id)) for post-approval providers
--   - Exactly one owner column must be NOT NULL per row (enforced by CHECK constraint).
-- ============================================================================

-- 1. SUPPLIER ONBOARDING PLANS
CREATE TABLE IF NOT EXISTS public.supplier_onboarding_plans (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  rule_version                text NOT NULL DEFAULT 'v3.0.0-canonical',
  generated_at                timestamptz NOT NULL DEFAULT now(),
  risk_level                  text NOT NULL DEFAULT 'MEDIUM',
  total_applicable_items      int NOT NULL DEFAULT 0,
  total_mandatory_items       int NOT NULL DEFAULT 0,
  completed_mandatory_items   int NOT NULL DEFAULT 0,
  completion_percentage       numeric(5, 2) NOT NULL DEFAULT 0.0,
  is_onboarding_complete      boolean NOT NULL DEFAULT false,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_onboarding_plans_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_onboarding_plans_supplier_org_id ON public.supplier_onboarding_plans(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_plans_organisation_id ON public.supplier_onboarding_plans(organisation_id);

-- 2. ASSURANCE PLAN ITEMS (Child of Onboarding Plan)
CREATE TABLE IF NOT EXISTS public.supplier_assurance_plan_items (
  id                          text PRIMARY KEY,
  plan_id                     text NOT NULL REFERENCES public.supplier_onboarding_plans(id) ON DELETE CASCADE,
  requirement_id              text NOT NULL,
  internal_code               text NOT NULL,
  title                       text NOT NULL,
  category                    text NOT NULL,
  description                 text,
  is_mandatory                boolean NOT NULL DEFAULT true,
  evidence_type               text NOT NULL DEFAULT 'DOCUMENT_UPLOAD',
  consequence_on_expiry       text NOT NULL DEFAULT 'WARNING',
  status                      text NOT NULL DEFAULT 'NOT_SUBMITTED',
  evidence_document_id        text,
  evidence_notes              text,
  rejection_reason            text,
  assigned_reviewer_role      text NOT NULL DEFAULT 'compliance_manager',
  reviewed_by                 text,
  reviewed_at                 timestamptz,
  expiry_date                 timestamptz,
  waived_reason               text,
  waived_by                   text,
  waived_at                   timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_items_plan_id ON public.supplier_assurance_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_requirement_id ON public.supplier_assurance_plan_items(requirement_id);

-- 3. DOCUMENT VAULT RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_document_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  requirement_id              text,
  document_type               text NOT NULL,
  file_name                   text NOT NULL,
  file_size_bytes             bigint NOT NULL DEFAULT 0,
  mime_type                   text NOT NULL DEFAULT 'application/octet-stream',
  storage_path                text NOT NULL,
  issued_by                   text,
  certificate_number          text,
  issue_date                  timestamptz,
  effective_date              timestamptz,
  expiry_date                 timestamptz,
  document_state              text NOT NULL DEFAULT 'CURRENT',
  review_status               text NOT NULL DEFAULT 'SUBMITTED',
  reviewed_by                 text,
  reviewed_at                 timestamptz,
  rejection_reason            text,
  version                     int NOT NULL DEFAULT 1,
  replaced_by_id              text,
  uploaded_by                 text NOT NULL DEFAULT 'system',
  uploaded_at                 timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_document_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_doc_records_supplier_org_id ON public.supplier_document_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_doc_records_organisation_id ON public.supplier_document_records(organisation_id);
CREATE INDEX IF NOT EXISTS idx_doc_records_doc_type ON public.supplier_document_records(document_type);

-- 4. STRUCTURED INSURANCE RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_insurance_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  insurance_type              text NOT NULL,
  insurer_name                text NOT NULL,
  policy_number               text NOT NULL,
  limit_gbp                   numeric(12, 2) NOT NULL DEFAULT 0.0,
  required_limit_gbp          numeric(12, 2) NOT NULL DEFAULT 0.0,
  is_below_required_limit     boolean NOT NULL DEFAULT false,
  start_date                  timestamptz NOT NULL,
  expiry_date                 timestamptz NOT NULL,
  document_id                 text,
  status                      text NOT NULL DEFAULT 'VALID',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_insurance_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_insurance_records_supplier_org_id ON public.supplier_insurance_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_insurance_records_organisation_id ON public.supplier_insurance_records(organisation_id);

-- 5. HEALTH & SAFETY ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_hs_assessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  assessed_by                 text NOT NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  overall_outcome             text NOT NULL DEFAULT 'PASS',
  competent_person_name       text,
  riddor_incidents_last_3_years int NOT NULL DEFAULT 0,
  rams_methodology_quality    text NOT NULL DEFAULT 'ACCEPTABLE',
  working_at_height_controls  boolean NOT NULL DEFAULT false,
  lone_working_procedures     boolean NOT NULL DEFAULT false,
  coshh_governance            boolean NOT NULL DEFAULT false,
  asbestos_awareness          boolean NOT NULL DEFAULT false,
  notes                       text NOT NULL DEFAULT '',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_hs_assessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_hs_assessments_supplier_org_id ON public.supplier_hs_assessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_hs_assessments_organisation_id ON public.supplier_hs_assessments(organisation_id);

-- 6. INFORMATION SECURITY ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_infosec_assessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  data_access_level           text NOT NULL DEFAULT 'NONE',
  assessed_by                 text NOT NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  has_iso27001                boolean NOT NULL DEFAULT false,
  has_cyber_essentials        boolean NOT NULL DEFAULT false,
  mfa_enforced                boolean NOT NULL DEFAULT false,
  data_encrypted_at_rest      boolean NOT NULL DEFAULT false,
  cyber_insurance_limit_gbp   numeric(12, 2) NOT NULL DEFAULT 0.0,
  gdpr_dpa_signed             boolean NOT NULL DEFAULT false,
  status                      text NOT NULL DEFAULT 'COMPLIANT',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_infosec_assessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_infosec_assessments_supplier_org_id ON public.supplier_infosec_assessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_infosec_assessments_organisation_id ON public.supplier_infosec_assessments(organisation_id);

-- 7. BANK DETAIL RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_bank_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  account_name                text NOT NULL,
  bank_name                   text NOT NULL,
  sort_code_masked            text NOT NULL,
  account_number_masked       text NOT NULL,
  verification_status         text NOT NULL DEFAULT 'VERIFICATION_REQUIRED',
  submitted_by                text NOT NULL,
  submitted_at                timestamptz NOT NULL DEFAULT now(),
  verified_by                 text,
  verified_at                 timestamptz,
  rejection_reason            text,
  audit_note                  text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_bank_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_bank_records_supplier_org_id ON public.supplier_bank_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_bank_records_organisation_id ON public.supplier_bank_records(organisation_id);

-- 8. REMEDIATION ACTIONS
CREATE TABLE IF NOT EXISTS public.supplier_remediation_actions (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  requirement_id              text,
  issue_summary               text NOT NULL,
  detailed_remediation_required text NOT NULL,
  severity                    text NOT NULL DEFAULT 'MEDIUM',
  assigned_to_role            text NOT NULL DEFAULT 'compliance_manager',
  supplier_contact            text,
  raised_date                 timestamptz NOT NULL DEFAULT now(),
  due_date                    timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'OPEN',
  resolution_notes            text,
  closed_by                   text,
  closed_at                   timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_remediation_actions_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_remediation_actions_supplier_org_id ON public.supplier_remediation_actions(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_remediation_actions_organisation_id ON public.supplier_remediation_actions(organisation_id);

-- 9. SERVICE APPROVALS
CREATE TABLE IF NOT EXISTS public.supplier_service_approvals (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  approval_status             text NOT NULL DEFAULT 'UNDER_REVIEW',
  effective_date              timestamptz NOT NULL DEFAULT now(),
  review_date                 timestamptz NOT NULL,
  restrictions                text[] DEFAULT '{}',
  approved_by                 text NOT NULL,
  rationale                   text NOT NULL DEFAULT '',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_service_approvals_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_service_approvals_supplier_org_id ON public.supplier_service_approvals(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_service_approvals_organisation_id ON public.supplier_service_approvals(organisation_id);

-- 10. GEOGRAPHIC APPROVALS
CREATE TABLE IF NOT EXISTS public.supplier_geographic_approvals (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  region_or_city              text NOT NULL,
  is_approved                 boolean NOT NULL DEFAULT true,
  approved_by                 text NOT NULL,
  approved_at                 timestamptz NOT NULL DEFAULT now(),
  restrictions                text[] DEFAULT '{}',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_geo_approvals_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_geo_approvals_supplier_org_id ON public.supplier_geographic_approvals(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_geo_approvals_organisation_id ON public.supplier_geographic_approvals(organisation_id);

-- 11. COMPLIANCE HOLDS
CREATE TABLE IF NOT EXISTS public.supplier_compliance_holds (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  hold_reason                 text NOT NULL,
  hold_scope                  text NOT NULL DEFAULT 'GLOBAL',
  affected_service_slug       text,
  affected_city               text,
  affected_client_id          text,
  raised_by                   text NOT NULL,
  raised_at                   timestamptz NOT NULL DEFAULT now(),
  review_date                 timestamptz NOT NULL,
  resolution_required         text NOT NULL,
  is_active                   boolean NOT NULL DEFAULT true,
  resolved_by                 text,
  resolved_at                 timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_compliance_holds_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_compliance_holds_supplier_org_id ON public.supplier_compliance_holds(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_compliance_holds_organisation_id ON public.supplier_compliance_holds(organisation_id);

-- 12. SUPPLIER AGREEMENTS
CREATE TABLE IF NOT EXISTS public.supplier_agreements (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  agreement_type              text NOT NULL,
  version                     text NOT NULL DEFAULT 'v2026.1',
  status                      text NOT NULL DEFAULT 'ISSUED',
  issued_at                   timestamptz NOT NULL DEFAULT now(),
  signed_at                   timestamptz,
  signatory_name              text,
  signatory_title             text,
  signatory_email             text,
  ip_address                  text,
  document_id                 text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_agreements_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_agreements_supplier_org_id ON public.supplier_agreements(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_agreements_organisation_id ON public.supplier_agreements(organisation_id);

-- 13. SUPPLIER REASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_reassessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  frequency                   text NOT NULL DEFAULT '12_MONTHS',
  last_reassessment_date      timestamptz,
  next_reassessment_due_date  timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'DUE',
  annual_declaration_signed   boolean NOT NULL DEFAULT false,
  annual_declaration_signed_at timestamptz,
  reviewed_by                 text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_reassessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_reassessments_supplier_org_id ON public.supplier_reassessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_reassessments_organisation_id ON public.supplier_reassessments(organisation_id);

-- 14. ASSURANCE AUDIT LOGS (Immutable)
CREATE TABLE IF NOT EXISTS public.supplier_assurance_audit_logs (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  actor                       text NOT NULL,
  action                      text NOT NULL,
  entity_type                 text NOT NULL,
  entity_id                   text NOT NULL,
  old_value                   text,
  new_value                   text,
  reason                      text,
  timestamp                   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_assurance_audit_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_assurance_audit_supplier_org_id ON public.supplier_assurance_audit_logs(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_assurance_audit_organisation_id ON public.supplier_assurance_audit_logs(organisation_id);

-- 15. SUPPLIER PORTAL USER RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_portal_user_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  email                       text NOT NULL,
  name                        text NOT NULL,
  role                        text NOT NULL DEFAULT 'OPERATIONS',
  is_active                   boolean NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_portal_users_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_portal_user_records_supplier_org_id ON public.supplier_portal_user_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_portal_user_records_organisation_id ON public.supplier_portal_user_records(organisation_id);

-- 16. SUPPLIER SCORECARDS
CREATE TABLE IF NOT EXISTS public.supplier_scorecards (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  measurement_window          text NOT NULL DEFAULT '90_DAYS',
  overall_status              text NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  overall_performance_index   numeric(5, 2) NOT NULL DEFAULT 0.0,
  total_completed_jobs        int NOT NULL DEFAULT 0,
  sufficiency_status          text NOT NULL DEFAULT 'NO_DATA',
  sla_attendance_rate         jsonb NOT NULL DEFAULT '{}'::jsonb,
  first_time_fix_rate         jsonb NOT NULL DEFAULT '{}'::jsonb,
  attendance_reliability_rate jsonb NOT NULL DEFAULT '{}'::jsonb,
  evidence_acceptance_rate    jsonb NOT NULL DEFAULT '{}'::jsonb,
  invoice_accuracy_rate       jsonb NOT NULL DEFAULT '{}'::jsonb,
  client_feedback_rating      jsonb NOT NULL DEFAULT '{}'::jsonb,
  safety_incident_count       jsonb NOT NULL DEFAULT '{}'::jsonb,
  service_breakdowns          jsonb NOT NULL DEFAULT '[]'::jsonb,
  geographic_breakdowns       jsonb NOT NULL DEFAULT '[]'::jsonb,
  active_pip_id               text,
  eligible_for_preferred_review boolean NOT NULL DEFAULT false,
  last_calculated_at          timestamptz NOT NULL DEFAULT now(),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_scorecards_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_scorecards_supplier_org_id ON public.supplier_scorecards(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_organisation_id ON public.supplier_scorecards(organisation_id);

-- 17. SUPPLIER QUALITY DEFECTS
CREATE TABLE IF NOT EXISTS public.supplier_quality_defects (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  work_order_id               text NOT NULL,
  service_slug                text NOT NULL,
  site_id                     text,
  issue_title                 text NOT NULL,
  description                 text NOT NULL,
  severity                    text NOT NULL DEFAULT 'MODERATE',
  raised_by                   text NOT NULL,
  raised_at                   timestamptz NOT NULL DEFAULT now(),
  root_cause                  text NOT NULL DEFAULT 'PROCESS',
  is_supplier_attributable    boolean NOT NULL DEFAULT true,
  remediation_required        text NOT NULL DEFAULT '',
  resolved_at                 timestamptz,
  resolution_notes            text,
  CONSTRAINT chk_quality_defects_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_quality_defects_supplier_org_id ON public.supplier_quality_defects(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_quality_defects_organisation_id ON public.supplier_quality_defects(organisation_id);

-- 18. PERFORMANCE IMPROVEMENT PLANS (PIPs)
CREATE TABLE IF NOT EXISTS public.supplier_performance_improvement_plans (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  reason                      text NOT NULL,
  target_metrics              jsonb NOT NULL DEFAULT '[]'::jsonb,
  action_plan                 text NOT NULL DEFAULT '',
  owner_role                  text NOT NULL DEFAULT 'Operations Manager',
  supplier_contact            text NOT NULL DEFAULT '',
  start_date                  timestamptz NOT NULL DEFAULT now(),
  target_date                 timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'ACTIVE',
  review_notes                text,
  closed_at                   timestamptz,
  closed_by                   text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_pips_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_pips_supplier_org_id ON public.supplier_performance_improvement_plans(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_pips_organisation_id ON public.supplier_performance_improvement_plans(organisation_id);

-- 19. PERFORMANCE REVIEWS & QBRs
CREATE TABLE IF NOT EXISTS public.supplier_performance_reviews (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  review_period               text NOT NULL,
  review_type                 text NOT NULL DEFAULT 'QUARTERLY',
  reviewer_name               text NOT NULL,
  reviewer_role               text NOT NULL DEFAULT 'Procurement Director',
  attendees                   text[] NOT NULL DEFAULT '{}',
  metrics_snapshot            jsonb NOT NULL DEFAULT '{}'::jsonb,
  strengths                   text[] NOT NULL DEFAULT '{}',
  areas_for_improvement       text[] NOT NULL DEFAULT '{}',
  decisions                   text[] NOT NULL DEFAULT '{}',
  relationship_tier_recommendation text,
  next_review_date            timestamptz NOT NULL,
  conducted_at                timestamptz NOT NULL DEFAULT now(),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_reviews_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_reviews_supplier_org_id ON public.supplier_performance_reviews(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_reviews_organisation_id ON public.supplier_performance_reviews(organisation_id);

-- 20. SERVICE BENCHMARKS
CREATE TABLE IF NOT EXISTS public.supplier_service_benchmarks (
  id                          text PRIMARY KEY,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  region_or_city              text NOT NULL DEFAULT 'National UK',
  total_suppliers_measured    int NOT NULL DEFAULT 0,
  median_sla_rate             numeric(5, 2) NOT NULL DEFAULT 0.0,
  median_ftf_rate             numeric(5, 2) NOT NULL DEFAULT 0.0,
  median_evidence_rate        numeric(5, 2) NOT NULL DEFAULT 0.0,
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_benchmarks_service_region ON public.supplier_service_benchmarks(service_slug, region_or_city);

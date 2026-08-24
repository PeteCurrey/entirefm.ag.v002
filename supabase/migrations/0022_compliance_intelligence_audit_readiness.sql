-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0022: COMPLIANCE INTELLIGENCE & AUDIT READINESS (Phase 0J)
-- ============================================================================
-- Extends the compliance domain into a complete operational compliance
-- intelligence, applicability assessment, certificate lifecycle, exception
-- management, immutable audit snapshot, and audit readiness system.
-- ============================================================================

-- 1. EXTEND COMPLIANCE SOURCES
ALTER TABLE public.compliance_sources
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'CURRENT', -- CURRENT, SUPERSEDED, DRAFT, NOT_CONFIGURED, LICENSE_REQUIRED, UNDER_REVIEW
  ADD COLUMN IF NOT EXISTS version text NOT NULL DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS effective_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS superseded_date date,
  ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS review_owner_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS may_store_content boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS license_required boolean NOT NULL DEFAULT false;

-- 2. EXTEND COMPLIANCE RULES
ALTER TABLE public.compliance_rules
  ADD COLUMN IF NOT EXISTS rule_family text NOT NULL DEFAULT 'GENERAL', -- FIRE_SAFETY, WATER_HYGIENE, ELECTRICAL, GAS_SAFETY, HVAC_PRESSURE, LIFTS_LIFTING, ASBESTOS, ENVIRONMENTAL, HEALTH_SAFETY
  ADD COLUMN IF NOT EXISTS applies_to_system_types text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS default_responsibility text NOT NULL DEFAULT 'ENTIREFM', -- LANDLORD, TENANT, CLIENT, ENTIREFM, SPECIALIST_CONTRACTOR, MANUFACTURER, OTHER
  ADD COLUMN IF NOT EXISTS contractual_override_allowed boolean NOT NULL DEFAULT true;

-- 3. EXTEND COMPLIANCE RULE VERSIONS
ALTER TABLE public.compliance_rule_versions
  ADD COLUMN IF NOT EXISTS superseded_by_version_id uuid REFERENCES public.compliance_rule_versions(id),
  ADD COLUMN IF NOT EXISTS source_section_reference text,
  ADD COLUMN IF NOT EXISTS statutory_basis text NOT NULL DEFAULT 'STATUTORY_DUTY'; -- STATUTORY_DUTY, APPROVED_CODE, GUIDANCE, STANDARD, MANUFACTURER, CONTRACTUAL, BEST_PRACTICE

-- 4. EXTEND APPLICABILITY ASSESSMENTS
ALTER TABLE public.applicability_assessments
  ADD COLUMN IF NOT EXISTS applicability_result text NOT NULL DEFAULT 'YES', -- YES, NO, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS calculation_path jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS human_override boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS override_reason text,
  ADD COLUMN IF NOT EXISTS override_by_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS override_at timestamptz;

-- 5. EXTEND COMPLIANCE OBLIGATIONS
ALTER TABLE public.compliance_obligations
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS system_id uuid REFERENCES public.systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS responsible_party text NOT NULL DEFAULT 'ENTIREFM', -- LANDLORD, TENANT, CLIENT, ENTIREFM, SPECIALIST_CONTRACTOR, MANUFACTURER, OTHER
  ADD COLUMN IF NOT EXISTS entirefm_contracted boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS event_trigger_type text, -- INSTALLATION, ALTERATION, INCIDENT, DEFECT, CERTIFICATE_EXPIRY, RULE_CHANGE, REPAIR
  ADD COLUMN IF NOT EXISTS criticality text NOT NULL DEFAULT 'HIGH', -- CRITICAL, HIGH, MEDIUM, LOW
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS evidence_requirements_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS current_evidence_id uuid,
  ADD COLUMN IF NOT EXISTS current_certificate_id uuid;

-- 6. EXTEND COMPLIANCE TASKS
ALTER TABLE public.compliance_tasks
  ADD COLUMN IF NOT EXISTS inspection_result text DEFAULT 'REVIEW_REQUIRED', -- PASS, FAIL, ADVISORY, NOT_TESTED, NOT_ACCESSIBLE, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS event_trigger_type text,
  ADD COLUMN IF NOT EXISTS ppm_occurrence_id uuid,
  ADD COLUMN IF NOT EXISTS evidence_document_id uuid REFERENCES public.documents(id);

-- 7. EXTEND COMPLIANCE EXCEPTIONS
ALTER TABLE public.compliance_exceptions
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS opened_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS responsible_org_id uuid REFERENCES public.organisations(id),
  ADD COLUMN IF NOT EXISTS accepted_risk_by_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS accepted_risk_reason text,
  ADD COLUMN IF NOT EXISTS accepted_risk_at timestamptz,
  ADD COLUMN IF NOT EXISTS remediation_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS escalation_level text NOT NULL DEFAULT 'NONE', -- NONE, MANAGER, LEADERSHIP, EXECUTIVE
  ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'OPEN'; -- OPEN, ACKNOWLEDGED, REMEDIATION_PLANNED, IN_PROGRESS, AWAITING_EVIDENCE, RESOLVED, ACCEPTED_RISK, CLOSED

-- 8. EXTEND CERTIFICATES
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS system_id uuid REFERENCES public.systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_obligation_id uuid REFERENCES public.compliance_obligations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS provider_org_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS issuing_engineer_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS file_checksum_sha256 text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS extraction_status text NOT NULL DEFAULT 'COMPLETE', -- PENDING, EXTRACTING, COMPLETE, FAILED, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS validation_status text NOT NULL DEFAULT 'VALID', -- VALID, INVALID, WRONG_SITE, EXPIRED_PROVIDER, REJECTED, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS duplicate_of_id uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS confidence_json jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT true;

-- 9. CREATE COMPLIANCE EVIDENCE VALIDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_evidence_validations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id        uuid REFERENCES public.certificates(id) ON DELETE CASCADE,
  document_id           uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  obligation_id         uuid REFERENCES public.compliance_obligations(id) ON DELETE CASCADE,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  asset_id              uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  validation_result     text NOT NULL DEFAULT 'VALID', -- VALID, INVALID, WRONG_SITE, EXPIRED_COMPETENCY, DEFICIENT_DATA, SUSPECT_DUPLICATE, REJECTED
  site_match            boolean NOT NULL DEFAULT true,
  date_valid            boolean NOT NULL DEFAULT true,
  provider_competency_valid boolean NOT NULL DEFAULT true,
  inspection_passed     boolean NOT NULL DEFAULT true,
  confidence_score      numeric(3,2) NOT NULL DEFAULT 1.00,
  field_confidences_json jsonb DEFAULT '{}'::jsonb,
  validation_notes      text,
  validated_by_id       uuid REFERENCES public.persons(id),
  is_ai_validated       boolean NOT NULL DEFAULT false,
  ai_agent_id           uuid REFERENCES public.ai_agents(id),
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 10. CREATE COMPLIANCE AUDIT SNAPSHOTS TABLE (Immutable point-in-time state)
CREATE TABLE IF NOT EXISTS public.compliance_audit_snapshots (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  snapshot_name         text NOT NULL,
  as_of_date            timestamptz NOT NULL DEFAULT now(),
  snapshot_hash         text NOT NULL,
  total_obligations     integer NOT NULL DEFAULT 0,
  compliant_count       integer NOT NULL DEFAULT 0,
  overdue_count         integer NOT NULL DEFAULT 0,
  exceptions_count      integer NOT NULL DEFAULT 0,
  evidence_count        integer NOT NULL DEFAULT 0,
  snapshot_data_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_person_id  uuid REFERENCES public.persons(id),
  is_locked             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 11. CREATE COMPLIANCE AUDIT PACKS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_audit_packs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id           uuid NOT NULL REFERENCES public.compliance_audit_snapshots(id) ON DELETE CASCADE,
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  pack_reference        text NOT NULL UNIQUE,
  title                 text NOT NULL,
  compliance_domain     text NOT NULL DEFAULT 'ALL', -- ALL, FIRE_SAFETY, WATER_HYGIENE, ELECTRICAL, GAS, HVAC, LIFTS
  date_from             date NOT NULL,
  date_to               date NOT NULL,
  export_format         text NOT NULL DEFAULT 'STRUCTURED_INDEX', -- STRUCTURED_INDEX, PDF_REPORT, EVIDENCE_BUNDLE
  is_client_sanitised   boolean NOT NULL DEFAULT true,
  generated_by_id       uuid REFERENCES public.persons(id),
  summary_stats_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 12. CREATE COMPLIANCE AUDIT PACK ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_audit_pack_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_pack_id         uuid NOT NULL REFERENCES public.compliance_audit_packs(id) ON DELETE CASCADE,
  obligation_id         uuid REFERENCES public.compliance_obligations(id) ON DELETE SET NULL,
  rule_version_id       uuid REFERENCES public.compliance_rule_versions(id) ON DELETE SET NULL,
  certificate_id        uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  document_id           uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  work_order_id         uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  visit_id              uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  exception_id          uuid REFERENCES public.compliance_exceptions(id) ON DELETE SET NULL,
  item_type             text NOT NULL, -- OBLIGATION, RULE_REFERENCE, CERTIFICATE, WORK_RECORD, EXCEPTION, REMEDIATION, AUDIT_TRAIL
  title                 text NOT NULL,
  description           text,
  evidence_provenance   text NOT NULL,
  document_checksum     text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 13. CREATE COMPLIANCE RULE IMPACT ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_rule_impact_assessments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_rule_id    uuid NOT NULL REFERENCES public.compliance_rules(id) ON DELETE CASCADE,
  previous_version_id   uuid REFERENCES public.compliance_rule_versions(id) ON DELETE SET NULL,
  new_version_id        uuid NOT NULL REFERENCES public.compliance_rule_versions(id) ON DELETE CASCADE,
  affected_clients_count integer NOT NULL DEFAULT 0,
  affected_sites_count  integer NOT NULL DEFAULT 0,
  affected_systems_count integer NOT NULL DEFAULT 0,
  affected_obligations_count integer NOT NULL DEFAULT 0,
  assessment_summary    text NOT NULL,
  requires_human_review boolean NOT NULL DEFAULT true,
  status                text NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, APPROVED, REJECTED, APPLIED
  reviewed_by_id        uuid REFERENCES public.persons(id),
  reviewed_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 14. CREATE COMPLIANCE MOBILISATION GAPS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_mobilisation_gaps (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  compliance_rule_id    uuid NOT NULL REFERENCES public.compliance_rules(id) ON DELETE CASCADE,
  gap_type              text NOT NULL, -- MISSING_CERTIFICATE, UNKNOWN_INSPECTION_DATE, OVERDUE_REQUIREMENT, APPLICABILITY_DATA_GAP, SOURCE_NOT_CONFIGURED
  gap_status            text NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, EVIDENCE_OBTAINED, EXEMPTION_CONFIRMED, RESOLVED
  severity              text NOT NULL DEFAULT 'MAJOR', -- CRITICAL, MAJOR, MINOR
  description           text NOT NULL,
  recommendation        text NOT NULL,
  target_resolution_date date,
  resolved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 15. CREATE COMPLIANCE KPI REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.compliance_kpi_registry (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_code           text NOT NULL UNIQUE,
  metric_name           text NOT NULL,
  category              text NOT NULL, -- OBLIGATIONS, EVIDENCE, EXCEPTIONS, CERTIFICATES, GOVERNANCE
  calculation_formula   text NOT NULL,
  numerator_desc        text,
  denominator_desc      text,
  authority             text NOT NULL DEFAULT 'EntireFM Compliance Intelligence Framework v1.0',
  description           text NOT NULL,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Seed Canonical Compliance KPIs
INSERT INTO public.compliance_kpi_registry (metric_code, metric_name, category, calculation_formula, numerator_desc, denominator_desc, description)
VALUES
  ('APPLICABLE_OBLIGATIONS', 'Applicable Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE is_applicable = YES)', 'All active applicable obligations across scope', 'N/A', 'Total number of active statutory and contractual duties established by applicability assessment.'),
  ('COMPLIANT_OBLIGATIONS', 'Compliant Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE status = COMPLIANT)', 'Obligations with valid unexpired evidence and no open critical exception', 'N/A', 'Number of obligations meeting full statutory or contractual compliance requirements.'),
  ('OVERDUE_OBLIGATIONS', 'Overdue Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE status = OVERDUE)', 'Obligations past due date with no valid evidence', 'N/A', 'Obligations that have passed their required statutory/contractual completion window.'),
  ('EVIDENCE_PENDING', 'Evidence Pending Count', 'EVIDENCE', 'COUNT(compliance_obligations WHERE status = EVIDENCE_PENDING)', 'Obligations where work is done but evidence document is unattached or unvalidated', 'N/A', 'Obligations awaiting document attachment or validation.'),
  ('VALIDATION_PENDING', 'Validation Pending Count', 'EVIDENCE', 'COUNT(compliance_evidence_validations WHERE validation_result = REVIEW_REQUIRED)', 'Validations awaiting human or AI review', 'N/A', 'Evidence documents requiring review before compliance status can be awarded.'),
  ('OPEN_COMPLIANCE_EXCEPTIONS', 'Open Exceptions Count', 'EXCEPTIONS', 'COUNT(compliance_exceptions WHERE state IN (OPEN, ACKNOWLEDGED, REMEDIATION_PLANNED, IN_PROGRESS, AWAITING_EVIDENCE))', 'All non-closed, non-mitigated compliance exceptions', 'N/A', 'Active operational compliance exceptions across the estate.'),
  ('CRITICAL_COMPLIANCE_EXCEPTIONS', 'Critical Exceptions Count', 'EXCEPTIONS', 'COUNT(compliance_exceptions WHERE severity = CRITICAL AND state != CLOSED)', 'Critical severity open compliance exceptions', 'N/A', 'High-risk statutory non-compliance issues requiring immediate remediation.'),
  ('CERTIFICATES_EXPIRING_30D', 'Certificates Expiring (30 Days)', 'CERTIFICATES', 'COUNT(certificates WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30)', 'Certificates expiring within 30 days', 'N/A', 'Certificates approaching expiry threshold requiring renewal scheduling.'),
  ('CERTIFICATES_EXPIRED', 'Certificates Expired Count', 'CERTIFICATES', 'COUNT(certificates WHERE expiry_date < CURRENT_DATE AND status != SUPERSEDED)', 'Expired active certificates', 'N/A', 'Certificates past their validity date without active replacement.'),
  ('RULES_UNDER_REVIEW', 'Rules Under Review Count', 'GOVERNANCE', 'COUNT(compliance_rules WHERE status = UNDER_REVIEW)', 'Compliance rules undergoing legal/technical review', 'N/A', 'Rules pending version approval or impact reassessment.')
ON CONFLICT (metric_code) DO NOTHING;

-- 16. SEED AI AGENTS FOR COMPLIANCE (ASSIST Autonomy Only)
INSERT INTO public.ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  ('33333333-3333-3333-3333-000000000001', 'COMPLIANCE_APPLICABILITY_AGENT', 'Compliance Applicability Agent', 'Interprets site and asset estate attributes against versioned compliance rules and suggests applicability candidates with clear audit provenance. Operates in ASSIST mode only; cannot create legal facts.', 'Assists compliance officers in evaluating rule applicability across estates with explainable reasoning.', 'ASSIST', true, 15.00, 0.85, now()),
  ('33333333-3333-3333-3333-000000000002', 'COMPLIANCE_EVIDENCE_AGENT', 'Compliance Evidence Agent', 'Classifies uploaded compliance documents, extracts certificate numbers, dates, test results, and validates site match. Flags low confidence for human review. Operates in ASSIST mode only; cannot alter failed evidence.', 'Assists in extracting and validating certificate metadata against obligations.', 'ASSIST', true, 20.00, 0.85, now()),
  ('33333333-3333-3333-3333-000000000003', 'COMPLIANCE_AUDIT_AGENT', 'Compliance Audit Agent', 'Assembles structured audit readiness packs, verifies complete evidence chains, summarises open exceptions and provenance. Operates in ASSIST mode only; cannot certify compliance or sign statutory declarations.', 'Prepares audit documentation packages and checks evidence completeness.', 'ASSIST', true, 15.00, 0.85, now())
ON CONFLICT (code) DO NOTHING;

-- 17. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_site ON public.compliance_obligations (site_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_client ON public.compliance_obligations (client_account_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_next_due ON public.compliance_obligations (next_due_at);
CREATE INDEX IF NOT EXISTS idx_compliance_exceptions_site ON public.compliance_exceptions (site_id, state);
CREATE INDEX IF NOT EXISTS idx_compliance_exceptions_client ON public.compliance_exceptions (client_account_id, state);
CREATE INDEX IF NOT EXISTS idx_certificates_site_exp ON public.certificates (site_id, expiry_date);
CREATE INDEX IF NOT EXISTS idx_certificates_client ON public.certificates (client_account_id);
CREATE INDEX IF NOT EXISTS idx_certificates_checksum ON public.certificates (file_checksum_sha256);
CREATE INDEX IF NOT EXISTS idx_compliance_snapshots_site ON public.compliance_audit_snapshots (site_id, as_of_date DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_packs_snap ON public.compliance_audit_packs (snapshot_id);

-- 18. RLS POLICIES
ALTER TABLE public.compliance_evidence_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rule_impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_mobilisation_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_kpi_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on compliance_evidence_validations" ON public.compliance_evidence_validations FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_audit_snapshots" ON public.compliance_audit_snapshots FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_audit_packs" ON public.compliance_audit_packs FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_audit_pack_items" ON public.compliance_audit_pack_items FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_rule_impact_assessments" ON public.compliance_rule_impact_assessments FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_mobilisation_gaps" ON public.compliance_mobilisation_gaps FOR ALL USING (true);
CREATE POLICY "Service role full access on compliance_kpi_registry" ON public.compliance_kpi_registry FOR ALL USING (true);

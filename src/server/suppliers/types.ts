/**
 * ENTIREFM SUPPLIER STRATEGY & INTELLIGENCE DOMAIN
 * ================================================
 * Types for strategic supplier landscape, targets, geographic coverage,
 * deterministic gap analysis, OEMs, and recruitment requirements.
 */

export type CommercialRelationship =
  | 'PROSPECT'
  | 'TARGET_PARTNER'
  | 'APPLICATION'
  | 'APPROVED_SUPPLIER'
  | 'PREFERRED_SUPPLIER'
  | 'STRATEGIC_PARTNER'
  | 'OEM_PARTNER'
  | 'TECHNOLOGY_PARTNER'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'OFFBOARDED';

export type SupplierComplianceStatus =
  | 'NOT_ONBOARDED'
  | 'UNDER_REVIEW'
  | 'CONDITIONALLY_APPROVED'
  | 'APPROVED'
  | 'COMPLIANCE_HOLD'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'OFFBOARDED';

export type SupplierType =
  | 'LOCAL_SME'
  | 'REGIONAL_CONTRACTOR'
  | 'NATIONAL_CONTRACTOR'
  | 'SPECIALIST_CONTRACTOR'
  | 'MANUFACTURER'
  | 'OEM'
  | 'DISTRIBUTOR'
  | 'TECHNOLOGY_PROVIDER'
  | 'CONSULTANT'
  | 'PROFESSIONAL_SERVICES'
  | 'LABOUR_PROVIDER'
  | 'EQUIPMENT_HIRE'
  | 'OTHER';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TargetPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TargetStatus =
  | 'IDENTIFIED'
  | 'RESEARCHING'
  | 'CONTACT_REQUIRED'
  | 'CONTACTED'
  | 'DISCUSSION'
  | 'ONBOARDING_INVITED'
  | 'ONBOARDING'
  | 'PARTNER'
  | 'DECLINED'
  | 'NO_RESPONSE'
  | 'NOT_SUITABLE';

export type StrategicRationale =
  | 'GEOGRAPHIC_GAP'
  | 'CAPABILITY_GAP'
  | 'CLIENT_REQUIREMENT'
  | 'OEM_RELATIONSHIP'
  | 'NATIONAL_COVERAGE'
  | '24_7_CAPABILITY'
  | 'SPECIALIST_COMPETENCY'
  | 'COMMERCIAL_OPPORTUNITY'
  | 'TECHNOLOGY'
  | 'INNOVATION'
  | 'RESILIENCE'
  | 'SINGLE_SUPPLIER_RISK'
  | 'SUSTAINABILITY'
  | 'STRATEGIC_BRAND'
  | 'OTHER';

export type OemRelationshipLevel =
  | 'NO_RELATIONSHIP'
  | 'TARGET'
  | 'INTRODUCTION'
  | 'COMMERCIAL_DISCUSSION'
  | 'ACCOUNT_OPEN'
  | 'APPROVED_SERVICE_RELATIONSHIP'
  | 'STRATEGIC_OEM_PARTNER';

export type TechnologyCategory =
  | 'IOT_SENSORS'
  | 'BUILDING_ANALYTICS'
  | 'BMS_INTEGRATION'
  | 'ENERGY_MONITORING'
  | 'PREDICTIVE_MAINTENANCE'
  | 'ROBOTICS'
  | 'DRONES'
  | 'COMPUTER_VISION'
  | 'DIGITAL_TWINS'
  | 'ASSET_TAGGING'
  | 'SMART_BUILDINGS'
  | 'CAFM_INTEGRATION';

export interface SupplierContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role:
    | 'ACCOUNT_MANAGER'
    | 'OPERATIONS'
    | 'TECHNICAL'
    | 'COMMERCIAL'
    | 'FINANCE'
    | 'DIRECTOR'
    | 'EMERGENCY'
    | 'ON_CALL'
    | 'COMPLIANCE'
    | 'OTHER';
  is_primary: boolean;
}

export interface SupplierCoverageEntry {
  id: string;
  coverage_type: 'NATION' | 'REGION' | 'COUNTY' | 'CITY' | 'RADIUS' | 'POSTCODE';
  boundary_value: string; // e.g. "London", "Manchester", "Yorkshire", "M1-M9"
  radius_miles?: number;
  emergency_24_7: boolean;
  is_active: boolean;
}

export interface SupplierServiceEntry {
  id: string;
  service_slug: string;
  service_name: string;
  category:
    | 'Hard FM'
    | 'Fire & Life Safety'
    | 'Vertical Transportation'
    | 'Building Fabric'
    | 'Specialist Access'
    | 'Soft FM'
    | 'Compliance'
    | 'Projects'
    | 'Technology';
  is_primary: boolean;
  accreditations: string[];
}

export interface SupplierOrganisationRecord {
  id: string;
  legal_name: string;
  trading_name?: string;
  company_number?: string;
  vat_number?: string;
  domain?: string;
  supplier_types: SupplierType[];
  relationship_level: CommercialRelationship;
  compliance_status: SupplierComplianceStatus;
  risk_level: RiskLevel;
  relationship_owner?: string;
  headquarters_city: string;
  headquarters_postcode: string;
  full_address: string;
  phone: string;
  email: string;
  website_url?: string;
  is_national: boolean;
  emergency_24_7: boolean;
  services: SupplierServiceEntry[];
  coverage: SupplierCoverageEntry[];
  contacts: SupplierContact[];
  notes?: string;
  performance_score?: number;
  first_time_fix_rate?: number;
  sla_adherence_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierTargetRecord {
  id: string;
  company_name: string;
  website_url?: string;
  supplier_types: SupplierType[];
  services: string[];
  geography: string[];
  strategic_rationale: StrategicRationale[];
  priority: TargetPriority;
  target_status: TargetStatus;
  key_contact_name?: string;
  key_contact_email?: string;
  key_contact_phone?: string;
  last_contact_date?: string;
  next_action?: string;
  owner: string;
  source: 'MANUAL_RESEARCH' | 'PUBLIC_APPLICATION' | 'CLIENT_REQUEST' | 'GAP_ALERT' | 'OEM_REFERRAL';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierOemRecord {
  id: string;
  brand_name: string;
  product_category: string; // e.g. "HVAC / Chillers", "Commercial Boilers", "Lifts", "BMS Controls"
  ecosystem_description: string;
  relationship_level: OemRelationshipLevel;
  direct_support_available: boolean;
  approved_installer_access: boolean;
  technical_escalation_route: boolean;
  parts_access: boolean;
  training_availability: boolean;
  warranty_support: boolean;
  account_manager?: string;
  geographic_coverage: string[];
  strategic_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierTechnologyRecord {
  id: string;
  company_name: string;
  technology_category: TechnologyCategory;
  technology_summary: string;
  integration_opportunity: string;
  client_use_case: string;
  pilot_potential: 'HIGH' | 'MEDIUM' | 'EVALUATING' | 'NOT_APPLICABLE';
  api_availability: boolean;
  commercial_model: 'SUBSCRIPTION' | 'USAGE' | 'HARDWARE' | 'RESELLER' | 'BESPOKE';
  relationship_stage: 'RESEARCH' | 'INTRO_CALL' | 'POC_PILOT' | 'COMMERCIAL_PARTNER' | 'INACTIVE';
  strategic_priority: TargetPriority;
  contact_name?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CoverageTarget {
  id: string;
  service_slug: string;
  service_name: string;
  region_or_city: string;
  min_approved_suppliers: number;
  min_preferred_suppliers: number;
  min_emergency_24_7_suppliers: number;
  notes?: string;
}

export interface SupplyChainGapAlert {
  id: string;
  gap_type:
    | 'NO_APPROVED_SUPPLIER'
    | 'SINGLE_SUPPLIER_DEPENDENCY'
    | 'NO_24_7_COVERAGE'
    | 'NO_PREFERRED_PARTNER'
    | 'COVERAGE_DEFICIT';
  service_name: string;
  service_slug: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  approved_count: number;
  preferred_count: number;
  emergency_count: number;
  target_approved: number;
  identified_at: string;
}

export interface RecruitmentRequirementRecord {
  id: string;
  title: string;
  trade_discipline: string;
  region_or_city: string;
  required_supplier_count: number;
  current_supplier_count: number;
  priority: TargetPriority;
  status:
    | 'OPEN'
    | 'RESEARCHING'
    | 'TARGETS_IDENTIFIED'
    | 'OUTREACH'
    | 'ONBOARDING'
    | 'FULFILLED'
    | 'ON_HOLD'
    | 'CLOSED';
  owner: string;
  target_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierAuditRecord {
  id: string;
  entity_type: 'ORGANISATION' | 'TARGET' | 'OEM' | 'TECH' | 'REQUIREMENT';
  entity_id: string;
  change_type: string;
  changed_by: string;
  changed_at: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
}

export interface ExecutiveSupplyChainMetrics {
  totalOrganisations: number;
  approvedSuppliers: number;
  preferredSuppliers: number;
  strategicPartners: number;
  suppliersUnderReview: number;
  activeApplications: number;
  complianceIssues: number;
  expiringDocuments: number;
  geographicCoverageGaps: number;
  capabilityGaps: number;
  singleSupplierDependencies: number;
  strategicTargetsNotYetEngaged: number;
}


/**
 * CANONICAL SUPPLIER ONBOARDING & PARTNER PROFILE TYPES (PHASE 2A)
 * ===============================================================
 */

export interface OperatingBaseRecord {
  id: string;
  name: string;
  address_line1: string;
  city: string;
  postcode: string;
  radius_miles: number;
  is_headquarters: boolean;
  services_offered: string[];
}

export interface SupplierContactDraft {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
  phone: string;
  roles: ('PRIMARY' | 'OPERATIONS' | 'COMMERCIAL' | 'FINANCE' | 'COMPLIANCE' | 'HEALTH_SAFETY' | 'EMERGENCY_24_7' | 'DIRECTOR')[];
}

export interface SupplierInsuranceDraft {
  id: string;
  insurance_type: 'PUBLIC_LIABILITY' | 'EMPLOYERS_LIABILITY' | 'PROFESSIONAL_INDEMNITY' | 'PRODUCT_LIABILITY' | 'CYBER';
  insurer_name: string;
  policy_number: string;
  cover_limit_gbp: number;
  expiry_date: string;
  document_url?: string;
  document_name?: string;
}

export interface SupplierAccreditationDraft {
  id: string;
  accreditation_body: string; // e.g. Gas Safe, NICEIC, REFCOM, IRATA, CHAS
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  scope_description: string;
  document_url?: string;
  document_name?: string;
}

export interface OnboardingStepState {
  step_number: number;
  step_key: string;
  title: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE' | 'ACTION_REQUIRED';
  last_updated?: string;
}

export interface SupplierOnboardingDraft {
  id: string;
  supplier_id: string;
  application_reference: string; // e.g. SUP-260825-4821
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  current_step: number;
  
  // Section 01: Company Profile
  legal_company_name: string;
  trading_name: string;
  company_number: string;
  vat_number: string;
  website_url: string;
  year_established: number;
  employee_count_total: number;
  registered_address: string;
  trading_address: string;
  main_phone: string;
  general_email: string;
  primary_business_type: string;
  company_summary: string;
  logo_url?: string;

  // Section 02: Contacts
  contacts: SupplierContactDraft[];

  // Section 03: Services
  selected_service_slugs: string[];
  service_details: Record<string, {
    years_experience: number;
    engineer_count: number;
    has_24_7_callout: boolean;
    specialist_notes?: string;
  }>;

  // Section 04: Coverage
  coverage_type: 'NATIONAL' | 'REGIONAL' | 'RADIUS';
  selected_regions: string[];
  operating_bases: OperatingBaseRecord[];

  // Section 05: Operations
  standard_operating_hours: string;
  emergency_24_7_available: boolean;
  emergency_phone?: string;
  planned_maintenance_offered: boolean;
  reactive_maintenance_offered: boolean;
  project_works_offered: boolean;
  typical_emergency_sla_hours: number;

  // Section 06: Workforce & Subcontracting
  direct_field_operatives: number;
  office_support_staff: number;
  workforce_model: 'DIRECT_EMPLOYEES' | 'SUBCONTRACTORS' | 'MIXED' | 'AGENCY';
  uses_subcontractors: boolean;
  subcontractor_services?: string[];
  subcontractor_vetting_process?: string;

  // Section 07: Insurance
  insurances: SupplierInsuranceDraft[];

  // Section 08: Accreditations
  accreditations: SupplierAccreditationDraft[];

  // Section 09: Health & Safety
  has_hs_policy: boolean;
  has_competent_person: boolean;
  has_rams_templates: boolean;
  has_coshh_assessments: boolean;
  has_working_at_height_controls: boolean;
  has_material_incidents_past_3yr: boolean;
  incident_history_notes?: string;

  // Section 10: Governance & Ethics
  anti_bribery_accepted: boolean;
  modern_slavery_policy_accepted: boolean;
  worker_welfare_standards_accepted: boolean;
  environmental_policy_accepted: boolean;

  // Section 11: Information Security (Dynamic)
  requires_system_access: boolean;
  mfa_enforced: boolean;
  cyber_essentials_certified: boolean;
  gdpr_compliant_processes: boolean;

  // Section 12: Documents
  uploaded_document_ids: string[];

  // Section 13: Commercial Information
  accounts_payable_email: string;
  requires_po: boolean;
  bank_account_name: string;
  bank_sort_code_masked: string;
  bank_account_number_masked: string;

  // Section 14: Declarations
  code_of_conduct_accepted: boolean;
  code_of_conduct_version: string;
  code_of_conduct_accepted_by: string;
  code_of_conduct_accepted_at?: string;
  truthfulness_declaration_accepted: boolean;

  step_states: Record<string, OnboardingStepState>;
}

export interface SupplierDocumentVaultItem {
  id: string;
  supplier_id: string;
  document_type: string;
  category: 'INSURANCE' | 'ACCREDITATION' | 'HEALTH_SAFETY' | 'GOVERNANCE' | 'COMMERCIAL' | 'TECHNICAL';
  file_name: string;
  file_size_kb: number;
  uploaded_at: string;
  expiry_date?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRING' | 'EXPIRED';
  rejection_reason?: string;
  action_required?: string;
  download_url: string;
}

export interface SupplierUserRecord {
  id: string;
  supplier_id: string;
  email: string;
  full_name: string;
  role: 'SUPPLIER_ADMIN' | 'OPERATIONS' | 'COMPLIANCE' | 'FINANCE' | 'FIELD_USER' | 'VIEWER';
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  created_at: string;
  last_login?: string;
}

export interface MaterialChangeProposal {
  id: string;
  supplier_id: string;
  field_name: string;
  field_category: string;
  previous_value: string;
  proposed_value: string;
  rationale: string;
  submitted_by: string;
  submitted_at: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

export interface SupplierSupportTicket {
  id: string;
  supplier_id: string;
  subject: string;
  category: 'ONBOARDING' | 'COMPLIANCE' | 'BILLING' | 'PORTAL' | 'OPERATIONS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  messages: {
    sender_type: 'SUPPLIER' | 'ENTIREFM';
    sender_name: string;
    message: string;
    sent_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

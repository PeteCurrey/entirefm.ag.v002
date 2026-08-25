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

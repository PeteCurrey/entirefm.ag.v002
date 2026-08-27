/**
 * ENTIREFM AI HELPDESK & TRIAGE ARCHITECTURE (Phase 0M)
 * ======================================================
 * Canonical types for structured intake, multi-channel parsing,
 * entity resolution, deterministic SLA calculation, and exception routing.
 */

export type InboundHelpdeskChannel =
  | 'CLIENT_PORTAL'
  | 'WEBSITE'
  | 'EMAIL'
  | 'PHONE_TRANSCRIPTION'
  | 'ADMIN_OPERATOR';

export type UrgencyLevel =
  | 'P1_CRITICAL'
  | 'P2_HIGH'
  | 'P3_MEDIUM'
  | 'P4_LOW'
  | 'P5_ROUTINE';

export type TradeCategory =
  | 'HVAC'
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'FIRE_LIFE_SAFETY'
  | 'BUILDING_FABRIC'
  | 'CLEANING'
  | 'SECURITY'
  | 'DRAINAGE'
  | 'PEST_CONTROL'
  | 'GROUNDS'
  | 'OTHER';

export type TriageActionRecommendation =
  | 'AUTO_DISPATCH'
  | 'HUMAN_REVIEW'
  | 'REQUEST_MORE_INFO'
  | 'QUOTE_REQUIRED';

export type TriageStatus =
  | 'READY_FOR_DISPATCH'
  | 'REQUIRES_OPERATOR_TRIAGE'
  | 'MODEL_DISAGREEMENT'
  | 'UNRESOLVED_ESTATE';

export interface StructuredHelpdeskIntake {
  raw_input: string;
  channel: InboundHelpdeskChannel;
  client_hint?: string;
  site_hint?: string;
  building_hint?: string;
  space_hint?: string;
  asset_hint?: string;
  issue_summary: string;
  service_category: string;
  trade: TradeCategory;
  sub_trade: string;
  suggested_priority: UrgencyLevel;
  urgency_reason: string;
  access_requirements?: string;
  estimated_scope: string;
  confidence_score: number; // 0.0 to 1.0
  missing_information: string[];
  recommended_next_action: TriageActionRecommendation;
}

export interface ResolvedTriageResult {
  intake: StructuredHelpdeskIntake;
  resolved_client_id?: string;
  resolved_client_name?: string;
  resolved_site_id?: string;
  resolved_site_name?: string;
  resolved_building_id?: string;
  resolved_space_id?: string;
  resolved_asset_id?: string;
  resolved_asset_name?: string;
  resolved_contract_id?: string;
  canonical_priority: UrgencyLevel;
  canonical_sla_hours: number;
  sla_resolution_due_at: string;
  triage_status: TriageStatus;
  model_provider: string;
  model_name: string;
  disagreement_notes?: string[];
  audit_run_id?: string;
}

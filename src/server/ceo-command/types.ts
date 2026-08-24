/**
 * ENTIREFM CEO COMMAND — TYPE DEFINITIONS (Phase 0I)
 * =====================================================
 * All interfaces for the Enterprise Intelligence layer.
 * These types are read-only; CEO Command never mutates canonical data.
 */

export type SignalSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
export type DataStatus = 'LIVE' | 'STALE' | 'NO_DATA' | 'NOT_CONFIGURED' | 'RESTRICTED' | 'ZERO' | 'LICENSE_REQUIRED';
export type QueryIntentCategory =
  | 'OPERATIONS' | 'CLIENTS' | 'CONTRACTS' | 'ESTATE' | 'ASSETS'
  | 'PPM' | 'COMPLIANCE' | 'SUPPLY_CHAIN' | 'COMMERCIAL' | 'FINANCE'
  | 'AI_AUTOMATION' | 'PLATFORM_HEALTH' | 'DATA_PROVENANCE' | 'EXECUTIVE_BRIEF'
  | 'UNKNOWN';

export type ToolStatus = 'SUCCESS' | 'RESTRICTED' | 'ERROR' | 'EMPTY' | 'LICENSE_REQUIRED';

export interface DateRange {
  label: string;
  from: string;   // ISO date string
  to: string;     // ISO date string
  computed_at: string;
}

export interface EntityRef {
  type: 'SITE' | 'CLIENT' | 'PROVIDER' | 'ASSET' | 'WORK_ORDER' | 'CONTRACT' | 'PPM_OCCURRENCE' | 'CERTIFICATE';
  id: string;
  label?: string;
  href?: string;
}

export interface ToolRun {
  tool_id: string;
  domain: QueryIntentCategory;
  status: ToolStatus;
  required_permission: string;
  permission_granted: boolean;
  executed_at: string;
  duration_ms?: number;
  result_summary?: string;
  restriction_reason?: string;
}

export interface EvidenceItem {
  label: string;
  value: string | number | null;
  unit?: string;
  data_status: DataStatus;
  source_service?: string;
  metric_version?: string;
  computed_at?: string;
  source_updated_at?: string;
  period?: DateRange;
  coverage_pct?: number;
  entities?: EntityRef[];
}

export interface DecompositionComponent {
  component: string;
  contribution_sign: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  value?: number | null;
  unit?: string;
  explanation?: string;
  data_status: DataStatus;
}

export interface EnterpriseSignal {
  id?: string;
  signal_type: string;
  domain: QueryIntentCategory;
  severity: SignalSeverity;
  title: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  client_id?: string;
  contract_id?: string;
  site_id?: string;
  provider_id?: string;
  detected_at: string;
  metric_code?: string;
  source_rule: string;
  state: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  owner?: string;
  resolved_at?: string;
  evidence?: EvidenceItem[];
  href?: string;
}

export interface ExecutiveAnswer {
  question: string;
  direct_answer: string;
  key_drivers: string[];
  evidence: EvidenceItem[];
  data_status: DataStatus;
  possible_actions?: Array<{ label: string; href?: string; type: 'NAVIGATE' | 'INFORM' | 'RESTRICTED' }>;
  fact_vs_interpretation: {
    facts: string[];
    calculations: string[];
    interpretations: string[];
    recommendations: string[];
  };
  tool_runs: ToolRun[];
  follow_up_context?: {
    entities?: EntityRef[];
    date_range?: DateRange;
    filters?: Record<string, string>;
  };
  computed_at: string;
}

export interface QuerySession {
  id: string;
  person_id: string;
  started_at: string;
  last_message_at: string;
  context_entities?: EntityRef[];
  context_date_range?: DateRange;
  context_filters?: Record<string, string>;
  messages: QueryMessage[];
}

export interface QueryMessage {
  id: string;
  session_id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  intent_category?: QueryIntentCategory;
  resolved_date_range?: DateRange;
  answer?: ExecutiveAnswer;
  created_at: string;
}

export interface EnterpriseMetricDefinition {
  id: string;
  metric_code: string;
  metric_name: string;
  domain: QueryIntentCategory;
  description: string;
  required_permission: string;
  canonical_service: string;
  formula_description?: string;
  freshness_max_minutes?: number;
  metric_version: string;
  data_coverage_note?: string;
  is_active: boolean;
}

export interface PlatformIntegration {
  name: string;
  type: 'ACCOUNTING' | 'CRM' | 'HR' | 'ERP' | 'ITSM' | 'IOT';
  state: 'LIVE' | 'TEST' | 'INTERFACE_ONLY' | 'NOT_CONFIGURED' | 'DEGRADED' | 'FAILED' | 'DISABLED';
  last_sync_at?: string;
  note?: string;
}

export interface ZeroDataSummary {
  clients: number;
  sites: number;
  contractors: number;
  open_work_orders: number;
  active_contracts: number;
  ppm_plans: number;
  has_operational_data: boolean;
}

export interface CeoCommandDashboard {
  zero_data_summary: ZeroDataSummary;
  signals: EnterpriseSignal[];
  what_changed: Array<{
    type: string;
    description: string;
    occurred_at: string;
    severity: SignalSeverity;
    href?: string;
  }>;
  needs_decision_count: number;
  computed_at: string;
}

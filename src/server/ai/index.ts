/**
 * ENTIREFM AI CONTROL PLANE DOMAIN MODULE (Phase 0A-R Hardened)
 * ==============================================================
 * Comprehensive Governance Architecture:
 * Agent -> Version -> Run -> Action -> Tool Permission -> Autonomy Policy -> Escalation -> Human Override -> Cost Ledger.
 */

import { dbQuery } from '../db/client';

export type AIAutonomyLevel = 'OFF' | 'MANUAL' | 'ASSIST' | 'CONTROLLED_AUTO';

export interface AIAgentVersion {
  id: string;
  ai_agent_id: string;
  version_tag: string;
  model_id: string;
  system_policy_json: Record<string, any>;
  tool_configuration_json: Record<string, any>;
  confidence_threshold: number;
  spend_threshold_gbp: number;
  is_deployed: boolean;
  deployed_at?: string;
  retired_at?: string;
  created_at: string;
}

export interface AIToolPermission {
  id: string;
  ai_agent_id: string;
  tool_name: string;
  is_allowed: boolean;
  max_monetary_scope_gbp?: number;
  requires_human_approval: boolean;
  allowed_entity_types?: string[];
  created_at: string;
}

export interface AIAutonomyPolicy {
  id: string;
  ai_agent_id: string;
  autonomy_level: AIAutonomyLevel;
  max_monetary_threshold_gbp: number;
  min_confidence_threshold: number;
  allowed_work_types?: string[];
  allowed_trades?: string[];
  allowed_priorities?: string[];
  operating_hours_restriction?: string;
}

export interface AIEscalation {
  id: string;
  ai_run_id: string;
  ai_action_id?: string;
  reason: string;
  confidence_score: number;
  proposed_action_json: Record<string, any>;
  monetary_value_gbp?: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assigned_reviewer_role: string;
  assigned_reviewer_id?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  decision?: string;
  resolved_at?: string;
}

export interface AIHumanOverride {
  id: string;
  ai_action_id: string;
  ai_agent_id: string;
  original_ai_recommendation_json: Record<string, any>;
  human_decision_json: Record<string, any>;
  reason: string;
  actor_person_id: string;
  created_at: string;
}

export interface AIAgent {
  id: string;
  code: string;
  name: string;
  description?: string;
  role_description: string;
  autonomy_level: AIAutonomyLevel;
  is_active: boolean;
  max_daily_budget_gbp: number;
  confidence_threshold: number;
  created_at: string;
}

export interface AIRun {
  id: string;
  ai_agent_id: string;
  trigger_event: string;
  correlation_id: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ESCALATED';
  tokens_used?: number;
  total_cost_gbp?: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
  agent?: { name: string; code: string };
}

export interface AIAction {
  id: string;
  ai_run_id: string;
  ai_agent_id: string;
  action_type: string;
  target_object_type: string;
  target_object_id: string;
  payload: Record<string, any>;
  requires_approval: boolean;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'OVERRIDDEN';
  created_at: string;
  agent?: { name: string; code: string };
}

export async function listAIAgents(): Promise<AIAgent[]> {
  const { data } = await dbQuery<AIAgent[]>('ai_agents?select=*&order=name.asc');
  return data || [];
}

export async function listAIActions(status?: string): Promise<AIAction[]> {
  let endpoint = 'ai_actions?select=*,agent:ai_agents(name,code)&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<AIAction[]>(endpoint);
  return data || [];
}

export async function listAIRuns(limit = 20): Promise<AIRun[]> {
  const { data } = await dbQuery<AIRun[]>(
    `ai_runs?select=*,agent:ai_agents(name,code)&order=started_at.desc&limit=${limit}`
  );
  return data || [];
}

export async function listAIEscalations(status = 'PENDING'): Promise<AIEscalation[]> {
  const { data } = await dbQuery<AIEscalation[]>(
    `ai_escalations?status=eq.${encodeURIComponent(status)}&select=*&order=confidence_score.asc`
  );
  return data || [];
}

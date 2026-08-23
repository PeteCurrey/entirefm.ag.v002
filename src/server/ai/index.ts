/**
 * ENTIREFM AI CONTROL PLANE DOMAIN MODULE
 * =======================================
 * Governance, Autonomy Policies, Tool Permissions, Action Approval Queue,
 * and AI Cost Ledgers.
 */

import { dbQuery } from '../db/client';

export type AIAutonomyLevel = 'OFF' | 'MANUAL' | 'ASSIST' | 'CONTROLLED_AUTO';

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
  const { data } = await dbQuery<AIRun[]>(`ai_runs?select=*,agent:ai_agents(name,code)&order=started_at.desc&limit=${limit}`);
  return data || [];
}

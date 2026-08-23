/**
 * ENTIREFM WORKFLOWS & AUTOMATION DOMAIN MODULE (Phase 0A-R Hardened)
 * ===================================================================
 * Workflow Engine Primitives & Idempotent Event Outbox Processor.
 */

import { dbQuery } from '../db/client';

export interface WorkflowStepRun {
  id: string;
  workflow_run_id: string;
  step_name: string;
  step_type: 'ACTION' | 'CONDITION' | 'TRIGGER' | 'HUMAN_APPROVAL' | 'AI_INFERENCE';
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'RETRIED' | 'SKIPPED' | 'WAITING_HUMAN_APPROVAL';
  input_state?: Record<string, any>;
  output_state?: Record<string, any>;
  error_details?: string;
  retry_count: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface WorkflowDefinition {
  id: string;
  code: string;
  name: string;
  description?: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_version_id: string;
  context_object_type?: string;
  context_object_id?: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'TIMED_OUT';
  started_at: string;
  completed_at?: string;
  error_details?: string;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  event_trigger: string;
  conditions_json: any[];
  actions_json: any[];
  is_active: boolean;
  created_at: string;
}

export async function listWorkflowDefinitions(): Promise<WorkflowDefinition[]> {
  const { data } = await dbQuery<WorkflowDefinition[]>('workflow_definitions?select=*&order=name.asc');
  return data || [];
}

export async function listWorkflowRuns(limit = 20): Promise<WorkflowRun[]> {
  const { data } = await dbQuery<WorkflowRun[]>(`workflow_runs?select=*&order=started_at.desc&limit=${limit}`);
  return data || [];
}

export async function listWorkflowStepRuns(workflowRunId: string): Promise<WorkflowStepRun[]> {
  const { data } = await dbQuery<WorkflowStepRun[]>(
    `workflow_step_runs?workflow_run_id=eq.${encodeURIComponent(workflowRunId)}&select=*&order=started_at.asc`
  );
  return data || [];
}

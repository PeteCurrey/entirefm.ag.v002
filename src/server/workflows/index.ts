/**
 * ENTIREFM WORKFLOWS & AUTOMATION DOMAIN MODULE
 * =============================================
 * Workflow definitions, versions, and execution runs.
 */

import { dbQuery } from '../db/client';

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

export async function listAutomationRules(): Promise<AutomationRule[]> {
  const { data } = await dbQuery<AutomationRule[]>('automation_rules?select=*&order=created_at.desc');
  return data || [];
}

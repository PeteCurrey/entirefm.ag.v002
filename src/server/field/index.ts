/**
 * ENTIREFM FIELD INTELLIGENCE DOMAIN MODULE (Phase 0A-R)
 * ======================================================
 * Foundation for multi-modal field capture and engineer intelligence:
 * Capture -> Observation -> Defect -> Recommendation.
 */

import { dbQuery } from '../db/client';

export type FieldCaptureType =
  | 'VOICE'
  | 'PHOTO'
  | 'VIDEO'
  | 'TEXT'
  | 'QR_SCAN'
  | 'BARCODE_SCAN'
  | 'NFC_SCAN'
  | 'METER_READING'
  | 'MEASUREMENT'
  | 'DOCUMENT'
  | 'LOCATION';

export interface FieldCapture {
  id: string;
  captured_by_id?: string;
  organisation_id: string;
  client_account_id?: string;
  site_id?: string;
  building_id?: string;
  asset_id?: string;
  work_order_id?: string;
  visit_id?: string;
  task_id?: string;
  capture_type: FieldCaptureType;
  raw_storage_path?: string;
  latitude?: number;
  longitude?: number;
  source_device_meta?: Record<string, any>;
  ai_processing_status: 'UNPROCESSED' | 'PROCESSING' | 'EXTRACTED' | 'FAILED';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Observation {
  id: string;
  field_capture_id?: string;
  asset_id?: string;
  system_id?: string;
  site_id: string;
  visit_id?: string;
  work_order_id?: string;
  observed_by_id?: string;
  observation_type:
    | 'UNUSUAL_NOISE'
    | 'DETERIORATION'
    | 'CORROSION'
    | 'LEAK_EVIDENCE'
    | 'MISSING_LABEL'
    | 'ABNORMAL_READING'
    | 'ACCESSIBILITY_ISSUE'
    | 'GENERAL';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reading_value?: number;
  reading_unit?: string;
  is_defect_candidate: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Defect {
  id: string;
  observation_id?: string;
  asset_id?: string;
  system_id?: string;
  site_id: string;
  building_id?: string;
  discovered_by_id?: string;
  discovered_at: string;
  category: 'MECHANICAL' | 'ELECTRICAL' | 'FABRIC' | 'STATUTORY_NON_COMPLIANCE' | 'SAFETY_HAZARD';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  description: string;
  recommended_action?: string;
  current_state: 'IDENTIFIED' | 'QUOTE_REQUESTED' | 'WORK_ORDER_CREATED' | 'MONITORED' | 'RESOLVED';
  created_at: string;
}

export interface Recommendation {
  id: string;
  observation_id?: string;
  defect_id?: string;
  asset_id?: string;
  site_id: string;
  recommendation_type: 'MONITOR' | 'INVESTIGATE' | 'REPAIR' | 'REPLACE' | 'QUOTE' | 'ESCALATE' | 'NO_ACTION';
  reasoning: string;
  estimated_cost_gbp?: number;
  urgency: 'IMMEDIATE' | 'WITHIN_30_DAYS' | 'NEXT_PPM' | 'CAPITAL_PLAN';
  is_ai_generated: boolean;
  ai_confidence?: number;
  verified_by_id?: string;
  created_at: string;
}

export async function listDefects(siteId?: string): Promise<Defect[]> {
  let endpoint = 'defects?select=*&order=discovered_at.desc';
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  const { data } = await dbQuery<Defect[]>(endpoint);
  return data || [];
}

export async function listObservations(workOrderId?: string): Promise<Observation[]> {
  let endpoint = 'observations?select=*&order=created_at.desc';
  if (workOrderId) endpoint += `&work_order_id=eq.${encodeURIComponent(workOrderId)}`;
  const { data } = await dbQuery<Observation[]>(endpoint);
  return data || [];
}

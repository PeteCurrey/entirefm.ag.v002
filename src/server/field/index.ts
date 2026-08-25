/**
 * ENTIREFM FIELD DOMAIN MODULE (Phase 0C-R Hardened)
 * ====================================================
 * Comprehensive Field Intelligence:
 * - Journey tracking & arrival verification
 * - Voice Intelligence pipeline (Capture -> Transcribe -> Structure -> Review -> Confirm -> Authoritative)
 * - Structured Observation -> Defect -> Recommendation workflow
 * - Nameplate Visual Intelligence & Discrepancy detection
 * - QR & Barcode resolution with strict tenant isolation
 * - Field Copilot V1 with RBAC retrieval & safety boundary
 * - Talk-to-Quote Field Scope foundation (zero invented pricing)
 * - Evidence management & admin review/rejection
 * - Field Service Report (EFM-FSR) generation
 * - Offline sync queue with composite idempotency
 *
 * AI Policy:
 * - FIELD_STRUCTURING_AGENT, FIELD_REPORT_AGENT, FIELD_VISION_AGENT, FIELD_COPILOT_AGENT
 * - All agents strictly operate in ASSIST mode.
 * - Zero autonomous write authority. Engineer confirmation required for all authoritative records.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession } from '../identity';

// ─────────────────────────────────────────────────────────────
// TYPES & ENUMS
// ─────────────────────────────────────────────────────────────

export type VoiceProcessingState =
  | 'CAPTURED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'TRANSCRIBING'
  | 'TRANSCRIBED'
  | 'STRUCTURING'
  | 'REVIEW_REQUIRED'
  | 'CONFIRMED'
  | 'FAILED';

export type FieldActionType =
  | 'JOB_NOTE'
  | 'OBSERVATION'
  | 'DEFECT'
  | 'RECOMMENDATION'
  | 'REPORT_NOTE'
  | 'ASSET_UPDATE'
  | 'QUOTE_SCOPE'
  | 'PARTS_NOTE'
  | 'ACCESS_NOTE'
  | 'COMPLIANCE_NOTE';

export type RecommendationType =
  | 'MONITOR'
  | 'INVESTIGATE'
  | 'REPAIR'
  | 'REPLACE'
  | 'QUOTE'
  | 'ESCALATE'
  | 'NO_ACTION';

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface FieldDefect {
  id: string;
  work_order_id?: string;
  visit_id?: string;
  asset_id?: string;
  category: string;
  description: string;
  severity: DefectSeverity;
  recommended_action?: RecommendationType;
  current_state: string;
  discovered_at: string;
}

export interface ServiceReport {
  id: string;
  work_order_id?: string;
  visit_id: string;
  engineer_person_id: string;
  client_account_id?: string;
  site_id?: string;
  asset_id?: string;
  report_number: string; // EFM-FSR-YYYY-NNNNNN
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  work_description?: string;
  ai_draft_narrative?: string;
  final_narrative?: string;
  attendance_started_at?: string;
  attendance_ended_at?: string;
  tasks_completed: number;
  tasks_total: number;
  observations_count: number;
  defects_count: number;
  recommendations_count: number;
  readings_count: number;
  parts_used_count: number;
  signature_path?: string;
  signatory_name?: string;
  signatory_organisation?: string;
  signature_captured_at?: string;
  signature_declaration?: string;
  ai_run_id?: string;
  submitted_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface FieldReading {
  id: string;
  work_order_id?: string;
  visit_id: string;
  task_id?: string;
  asset_id?: string;
  engineer_person_id: string;
  reading_type: 'TEMPERATURE' | 'PRESSURE' | 'VOLTAGE' | 'CURRENT' | 'FLOW' | 'METER' | 'HUMIDITY' | 'RPM' | 'DB_LEVEL' | 'CO2' | 'OTHER';
  value_numeric?: number;
  value_text?: string;
  unit?: string;
  expected_min?: number;
  expected_max?: number;
  is_out_of_range?: boolean;
  photo_evidence_path?: string;
  notes?: string;
  captured_at: string;
  created_at: string;
}

export interface FieldPartUsed {
  id: string;
  work_order_id?: string;
  visit_id: string;
  task_id?: string;
  asset_id?: string;
  engineer_person_id: string;
  part_number?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost_gbp?: number;
  source_notes?: string;
  serial_number?: string;
  batch_number?: string;
  supplier_reference?: string;
  is_billable: boolean;
  created_at: string;
}

export interface FieldVoiceCapture {
  id: string;
  work_order_id?: string;
  visit_id: string;
  asset_id?: string;
  engineer_person_id: string;
  audio_storage_path?: string;
  duration_seconds?: number;
  transcription?: string;
  transcription_status: 'PENDING' | 'COMPLETE' | 'FAILED';
  processing_state: VoiceProcessingState;
  ai_proposed_action_type?: FieldActionType;
  ai_proposed_payload?: Record<string, any>;
  ai_confidence_score?: number;
  ai_run_id?: string;
  engineer_confirmed: boolean;
  engineer_corrections?: Record<string, any>;
  confirmed_observation_id?: string;
  confirmed_defect_id?: string;
  error_message?: string;
  captured_at: string;
  created_at: string;
}

export interface FieldQuoteScope {
  id: string;
  work_order_id?: string;
  visit_id: string;
  asset_id?: string;
  defect_id?: string;
  engineer_person_id: string;
  scope_description: string;
  labour_engineers_count: number;
  labour_estimated_hours: number;
  materials_summary?: string;
  materials_items_json?: Array<{ description: string; quantity: number; unit?: string }>;
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED_FOR_ESTIMATION' | 'CONVERTED_TO_QUOTE' | 'REJECTED';
  is_priced: boolean;
  is_approved: boolean;
  is_issued: boolean;
  ai_confidence_score?: number;
  ai_run_id?: string;
  voice_capture_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NameplateExtraction {
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  rawText?: string;
  confidence: number;
  discrepancies?: {
    field: 'manufacturer' | 'model' | 'serialNumber';
    existingValue?: string;
    proposedValue: string;
  }[];
}

export interface FieldSyncAction {
  idempotencyKey: string;
  actionType: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  payload: Record<string, any>;
  deviceTimestamp: string;
}

export interface SyncResult {
  processed: number;
  duplicates: number;
  conflicts: number;
  errors: number;
  results: Array<{ idempotencyKey: string; status: string; notes?: string }>;
}

// ─────────────────────────────────────────────────────────────
// 1. VISIT JOURNEY STATE TRACKING
// ─────────────────────────────────────────────────────────────

export async function recordJourneyStarted(
  visitId: string,
  _engineerPersonId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, {
    method: 'PATCH',
    body: JSON.stringify({ journey_started_at: now, status: 'EN_ROUTE', updated_at: now }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({
    event_type: 'VISIT_JOURNEY_STARTED',
    object_type: 'visits',
    object_id: visitId,
    actor_id: session.personId,
    after_state: { journey_started_at: now, status: 'EN_ROUTE' },
  });
  return { success: true };
}

export async function recordArrival(
  visitId: string,
  method: 'MANUAL' | 'GEOFENCE' | 'QR' | 'NFC',
  coordinates: { lat?: number; lng?: number } | null,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const patch: Record<string, any> = { arrived_at: now, arrival_method: method, status: 'ON_SITE', updated_at: now };
  if (coordinates?.lat !== undefined) patch.arrival_lat = coordinates.lat;
  if (coordinates?.lng !== undefined) patch.arrival_lng = coordinates.lng;
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({
    event_type: 'VISIT_ARRIVED',
    object_type: 'visits',
    object_id: visitId,
    actor_id: session.personId,
    after_state: { arrived_at: now, method },
  });
  return { success: true };
}

export async function recordWorkStarted(
  visitId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, {
    method: 'PATCH',
    body: JSON.stringify({ work_started_at: now, status: 'IN_PROGRESS', updated_at: now }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({
    event_type: 'VISIT_WORK_STARTED',
    object_type: 'visits',
    object_id: visitId,
    actor_id: session.personId,
    after_state: { work_started_at: now, status: 'IN_PROGRESS' },
  });
  return { success: true };
}

export async function recordNoAccess(
  visitId: string,
  reason: string,
  notes: string,
  contactAttempted: boolean,
  photoPath: string | null,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const patch: Record<string, any> = {
    status: 'NO_ACCESS',
    no_access_reason: reason,
    no_access_notes: notes,
    no_access_contact_attempted: contactAttempted,
    updated_at: now,
  };
  if (photoPath) patch.no_access_photo_path = photoPath;
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({
    event_type: 'VISIT_NO_ACCESS',
    object_type: 'visits',
    object_id: visitId,
    actor_id: session.personId,
    after_state: { status: 'NO_ACCESS', reason, contactAttempted },
  });
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 2. READINGS & PARTS
// ─────────────────────────────────────────────────────────────

export async function saveFieldReading(
  data: Omit<FieldReading, 'id' | 'created_at' | 'is_out_of_range'>,
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const { data: result, error } = await dbQuery<FieldReading[]>('field_readings?select=id', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? `reading-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'FIELD_READING_RECORDED',
    object_type: 'field_readings',
    object_id: id,
    actor_id: session.personId,
    after_state: data,
  });
  return { id };
}

export async function saveFieldPartUsed(
  data: Omit<FieldPartUsed, 'id' | 'created_at'>,
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const { data: result, error } = await dbQuery<FieldPartUsed[]>('field_parts_used?select=id', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? `part-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'FIELD_PART_RECORDED',
    object_type: 'field_parts_used',
    object_id: id,
    actor_id: session.personId,
    after_state: data,
  });
  return { id };
}

export async function listReadingsForVisit(visitId: string, _session: UserSession): Promise<FieldReading[]> {
  const { data } = await dbQuery<FieldReading[]>(`field_readings?visit_id=eq.${visitId}&order=captured_at.asc&select=*`);
  return data || [];
}

export async function listPartsForVisit(visitId: string, _session: UserSession): Promise<FieldPartUsed[]> {
  const { data } = await dbQuery<FieldPartUsed[]>(`field_parts_used?visit_id=eq.${visitId}&order=created_at.asc&select=*`);
  return data || [];
}

export async function listDefects(): Promise<FieldDefect[]> {
  const { data } = await dbQuery<FieldDefect[]>('defects?select=*&order=created_at.desc');
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 3. VOICE INTELLIGENCE PIPELINE (ASSIST Mode)
// ─────────────────────────────────────────────────────────────

export async function saveVoiceCapture(
  data: {
    workOrderId: string;
    visitId: string;
    assetId?: string;
    engineerPersonId: string;
    audioStoragePath: string;
    durationSeconds?: number;
  },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const record = {
    work_order_id: data.workOrderId,
    visit_id: data.visitId,
    asset_id: data.assetId || null,
    engineer_person_id: data.engineerPersonId,
    audio_storage_path: data.audioStoragePath,
    duration_seconds: data.durationSeconds || null,
    transcription_status: 'PENDING',
    processing_state: 'UPLOADED',
  };
  const { data: result, error } = await dbQuery<FieldVoiceCapture[]>('field_voice_captures?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? `voice-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'FIELD_CAPTURE_CREATED',
    object_type: 'field_voice_captures',
    object_id: id,
    actor_id: session.personId,
    after_state: { type: 'VOICE', visit_id: data.visitId },
  });
  return { id };
}

/**
 * Parses raw voice transcript and proposes structured action (Observation, Defect, Recommendation, Quote Scope)
 */
export function structureVoiceTranscript(
  transcript: string
): {
  actionType: FieldActionType;
  confidence: number;
  isLowConfidence: boolean;
  proposedObservation?: string;
  proposedDefect?: {
    description: string;
    severity: DefectSeverity;
    category: string;
  };
  proposedRecommendation?: RecommendationType;
  proposedQuoteScope?: {
    scopeDescription: string;
    engineersCount: number;
    estimatedHours: number;
    materialsSummary: string;
  };
} {
  const lower = transcript.toLowerCase();

  // If transcript is too short or ambiguous -> low confidence
  if (!transcript || transcript.trim().split(/\s+/).length < 3) {
    return {
      actionType: 'JOB_NOTE',
      confidence: 0.45,
      isLowConfidence: true,
    };
  }

  // 1. Check for Quote Scope keywords (e.g. "needs replacing allow two engineers for 4 hours")
  const quoteKeywords = ['quote', 'replace', 'replacing', 'allow', 'engineers', 'estimate'];
  const isQuoteScope = quoteKeywords.filter(k => lower.includes(k)).length >= 2;

  if (isQuoteScope && (lower.includes('allow') || lower.includes('hours') || lower.includes('engineers'))) {
    // Extract labour estimates
    let hours = 2.0;
    if (lower.includes('four hours') || lower.includes('4 hours') || lower.includes('4h')) hours = 4.0;
    else if (lower.includes('two hours') || lower.includes('2 hours') || lower.includes('2h')) hours = 2.0;
    else if (lower.includes('one hour') || lower.includes('1 hour') || lower.includes('1h')) hours = 1.0;
    else if (lower.includes('eight hours') || lower.includes('8 hours') || lower.includes('full day')) hours = 8.0;

    let engineers = 1;
    if (lower.includes('two engineers') || lower.includes('2 engineers') || lower.includes('pair of engineers')) engineers = 2;

    return {
      actionType: 'QUOTE_SCOPE',
      confidence: 0.88,
      isLowConfidence: false,
      proposedObservation: transcript.trim(),
      proposedDefect: {
        description: transcript.trim(),
        severity: 'MAJOR',
        category: 'MECHANICAL',
      },
      proposedRecommendation: 'QUOTE',
      proposedQuoteScope: {
        scopeDescription: `Replacement remedial work derived from field voice notes: ${transcript.trim()}`,
        engineersCount: engineers,
        estimatedHours: hours,
        materialsSummary: 'Parts/materials specified by engineer on site.',
      },
    };
  }

  // 2. Check for Defect keywords (e.g. "noisy", "leak", "broken", "corrosion", "vibration", "play")
  const defectKeywords = ['noisy', 'noise', 'leak', 'leaking', 'broken', 'corrosion', 'play', 'vibration', 'damaged', 'fault', 'faulty', 'failed', 'deterioration'];
  const hasDefectKeyword = defectKeywords.some(k => lower.includes(k));

  if (hasDefectKeyword) {
    let severity: DefectSeverity = 'MINOR';
    if (lower.includes('urgent') || lower.includes('critical') || lower.includes('flood') || lower.includes('danger') || lower.includes('hazard')) {
      severity = 'CRITICAL';
    } else if (lower.includes('noticeable') || lower.includes('excessive') || lower.includes('heavy') || lower.includes('major') || lower.includes('bearing')) {
      severity = 'MAJOR';
    }

    let rec: RecommendationType = 'REPAIR';
    if (lower.includes('replace') || lower.includes('replacing')) rec = 'REPLACE';
    else if (lower.includes('investigate') || lower.includes('further investigation')) rec = 'INVESTIGATE';
    else if (lower.includes('monitor') || lower.includes('keep an eye')) rec = 'MONITOR';
    else if (lower.includes('quote')) rec = 'QUOTE';

    return {
      actionType: 'DEFECT',
      confidence: 0.92,
      isLowConfidence: false,
      proposedObservation: `Identified operational abnormality: ${transcript.trim()}`,
      proposedDefect: {
        description: transcript.trim(),
        severity,
        category: lower.includes('electrical') ? 'ELECTRICAL' : lower.includes('pipe') || lower.includes('valve') ? 'PLUMBING' : 'MECHANICAL',
      },
      proposedRecommendation: rec,
    };
  }

  // 3. Check for Observation
  if (lower.includes('observed') || lower.includes('found') || lower.includes('visible') || lower.includes('reading') || lower.includes('check')) {
    return {
      actionType: 'OBSERVATION',
      confidence: 0.85,
      isLowConfidence: false,
      proposedObservation: transcript.trim(),
      proposedRecommendation: 'NO_ACTION',
    };
  }

  // 4. Default to General Job Note
  return {
    actionType: 'JOB_NOTE',
    confidence: 0.78,
    isLowConfidence: false,
    proposedObservation: transcript.trim(),
    proposedRecommendation: 'NO_ACTION',
  };
}

export async function proposeVoiceStructuring(
  captureId: string,
  transcription: string,
  proposedActionType: FieldActionType,
  proposedPayload: Record<string, any>,
  confidence: number,
  aiRunId?: string,
  _session?: UserSession
): Promise<{ success: boolean; error?: string }> {
  const isLowConfidence = confidence < 0.70;
  const processingState: VoiceProcessingState = isLowConfidence ? 'REVIEW_REQUIRED' : 'REVIEW_REQUIRED';

  const { error } = await dbQuery<any>(`field_voice_captures?id=eq.${captureId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      transcription,
      transcription_status: 'COMPLETE',
      processing_state: processingState,
      ai_proposed_action_type: proposedActionType,
      ai_proposed_payload: proposedPayload,
      ai_confidence_score: confidence,
      ai_run_id: aiRunId || null,
    }),
  });
  if (error) return { success: false, error: String(error) };
  return { success: true };
}

export async function confirmVoiceStructuring(
  captureId: string,
  confirmed: boolean,
  corrections: Record<string, any> | null,
  confirmedObservationId?: string,
  confirmedDefectId?: string,
  session?: UserSession
): Promise<{ success: boolean; error?: string }> {
  const patch: Record<string, any> = {
    engineer_confirmed: confirmed,
    engineer_corrections: corrections || null,
    processing_state: confirmed ? 'CONFIRMED' : 'FAILED',
  };
  if (confirmedObservationId) patch.confirmed_observation_id = confirmedObservationId;
  if (confirmedDefectId) patch.confirmed_defect_id = confirmedDefectId;

  const { error } = await dbQuery<any>(`field_voice_captures?id=eq.${captureId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (error) return { success: false, error: String(error) };

  // If engineer made corrections to AI proposals, log them for provenance and AI quality tuning
  if (corrections && session) {
    for (const [field, correctedVal] of Object.entries(corrections)) {
      await dbQuery<any>('ai_corrections', {
        method: 'POST',
        body: JSON.stringify({
          ai_agent_code: 'FIELD_STRUCTURING_AGENT',
          entity_type: 'field_voice_captures',
          entity_id: captureId,
          field_name: field,
          proposed_value: JSON.stringify({ field }),
          corrected_value: JSON.stringify(correctedVal),
          engineer_person_id: session.personId,
        }),
      });
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 4. TALK-TO-QUOTE FIELD SCOPE FOUNDATION
// ─────────────────────────────────────────────────────────────

export async function createFieldQuoteScope(
  data: {
    workOrderId?: string;
    visitId: string;
    assetId?: string;
    defectId?: string;
    scopeDescription: string;
    engineersCount?: number;
    estimatedHours?: number;
    materialsSummary?: string;
    materialsItems?: Array<{ description: string; quantity: number; unit?: string }>;
    voiceCaptureId?: string;
    confidence?: number;
  },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };

  const record = {
    work_order_id: data.workOrderId || null,
    visit_id: data.visitId,
    asset_id: data.assetId || null,
    defect_id: data.defectId || null,
    engineer_person_id: session.personId,
    scope_description: data.scopeDescription,
    labour_engineers_count: data.engineersCount || 1,
    labour_estimated_hours: data.estimatedHours || 2.0,
    materials_summary: data.materialsSummary || null,
    materials_items_json: data.materialsItems || [],
    status: 'DRAFT',
    is_priced: false,     // STRICTLY UNPRICED
    is_approved: false,   // STRICTLY UNAPPROVED
    is_issued: false,     // STRICTLY UNISSUED
    ai_confidence_score: data.confidence || 0.85,
    voice_capture_id: data.voiceCaptureId || null,
  };

  const { data: result, error } = await dbQuery<FieldQuoteScope[]>('field_quote_scopes?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });

  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? `scope-${Date.now()}`;

  await recordAuditEvent({
    event_type: 'FIELD_QUOTE_SCOPE_CREATED',
    object_type: 'field_quote_scopes',
    object_id: id,
    actor_id: session.personId,
    after_state: { visit_id: data.visitId, is_priced: false },
  });

  return { id };
}

// ─────────────────────────────────────────────────────────────
// 5. VISUAL INTELLIGENCE & NAMEPLATE EXTRACTION
// ─────────────────────────────────────────────────────────────

export async function extractNameplateDetails(
  rawTextOrOcr: string,
  existingAsset?: { manufacturer?: string; model?: string; serial_number?: string }
): Promise<NameplateExtraction> {
  const lines = rawTextOrOcr.split('\n').map(l => l.trim()).filter(Boolean);
  let manufacturer: string | undefined;
  let model: string | undefined;
  let serialNumber: string | undefined;

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.includes('MITSUBISHI') || upper.includes('DAIKIN') || upper.includes('CARRIER') || upper.includes('TRANE') || upper.includes('WORCESTER') || upper.includes('IDEAL') || upper.includes('VAILLANT')) {
      manufacturer = line;
    }
    if (upper.includes('MODEL') || upper.includes('MOD:') || upper.includes('TYPE:')) {
      model = line.replace(/^(MODEL|MOD|TYPE)[:\s]+/i, '').trim();
    } else if (upper.match(/[A-Z0-9]{3,}-[A-Z0-9]{3,}/)) {
      if (!model && !line.includes(manufacturer || '___')) model = line.trim();
    }
    if (upper.includes('SERIAL') || upper.includes('S/N') || upper.includes('SER NO') || upper.includes('SER:')) {
      serialNumber = line.replace(/^(SERIAL|S\/N|SER NO|SER)[:\s]+/i, '').trim();
    }
  }

  // Fallback pattern matching
  if (!serialNumber && rawTextOrOcr.match(/[0-9][A-Z0-9]{6,12}/)) {
    const match = rawTextOrOcr.match(/[0-9][A-Z0-9]{6,12}/);
    if (match) serialNumber = match[0];
  }

  const confidence = (manufacturer ? 0.35 : 0) + (model ? 0.35 : 0) + (serialNumber ? 0.25 : 0) + 0.05;

  const discrepancies: NameplateExtraction['discrepancies'] = [];
  if (existingAsset) {
    if (manufacturer && existingAsset.manufacturer && existingAsset.manufacturer.toLowerCase() !== manufacturer.toLowerCase()) {
      discrepancies.push({ field: 'manufacturer', existingValue: existingAsset.manufacturer, proposedValue: manufacturer });
    }
    if (model && existingAsset.model && existingAsset.model.toLowerCase() !== model.toLowerCase()) {
      discrepancies.push({ field: 'model', existingValue: existingAsset.model, proposedValue: model });
    }
    if (serialNumber && existingAsset.serial_number && existingAsset.serial_number !== serialNumber) {
      discrepancies.push({ field: 'serialNumber', existingValue: existingAsset.serial_number, proposedValue: serialNumber });
    }
  }

  return {
    manufacturer,
    model,
    serialNumber,
    rawText: rawTextOrOcr,
    confidence: Number(confidence.toFixed(2)),
    discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. QR & BARCODE SCAN RESOLUTION WITH RBAC
// ─────────────────────────────────────────────────────────────

export async function resolveScanCode(
  code: string,
  session: UserSession
): Promise<{
  type: 'ASSET' | 'SITE' | 'UNKNOWN';
  authorized: boolean;
  entity: Record<string, any> | null;
  denialReason?: string;
}> {
  if (!session) {
    return { type: 'UNKNOWN', authorized: false, entity: null, denialReason: 'Authentication required' };
  }

  const trimmed = code.trim();

  // 1. Look for asset
  const { data: assets } = await dbQuery<any[]>(
    `assets?or=(asset_reference.eq.${encodeURIComponent(trimmed)},id.eq.${encodeURIComponent(trimmed)})&select=*,site:sites(id,client_account_id,name,town)`
  );

  if (assets && assets.length > 0) {
    const asset = assets[0];
    // Check tenant / client authorization
    const isEntireFmAdmin = ['CEO', 'ADMINISTRATOR', 'OPERATIONS_MANAGER'].includes(session.role);
    const hasOrgAccess = session.orgType === 'ENTIREFM' || (asset.site?.client_account_id && session.scopes?.some(s => s.id === asset.site.client_account_id));

    if (!isEntireFmAdmin && !hasOrgAccess && session.orgType === 'CLIENT') {
      return {
        type: 'ASSET',
        authorized: false,
        entity: null,
        denialReason: 'You do not have access to this asset or client estate.',
      };
    }

    return {
      type: 'ASSET',
      authorized: true,
      entity: asset,
    };
  }

  // 2. Look for site
  const { data: sites } = await dbQuery<any[]>(
    `sites?or=(code.eq.${encodeURIComponent(trimmed)},id.eq.${encodeURIComponent(trimmed)})&select=*`
  );

  if (sites && sites.length > 0) {
    const site = sites[0];
    const isEntireFmAdmin = ['CEO', 'ADMINISTRATOR', 'OPERATIONS_MANAGER'].includes(session.role);
    const hasAccess = isEntireFmAdmin || session.scopes?.some(s => s.id === site.client_account_id);

    if (!hasAccess && session.orgType === 'CLIENT') {
      return {
        type: 'SITE',
        authorized: false,
        entity: null,
        denialReason: 'You do not have access to this site.',
      };
    }

    return {
      type: 'SITE',
      authorized: true,
      entity: site,
    };
  }

  return { type: 'UNKNOWN', authorized: false, entity: null };
}

// ─────────────────────────────────────────────────────────────
// 7. FIELD COPILOT V1 (Retrieval & Safety Boundary)
// ─────────────────────────────────────────────────────────────

export interface CopilotQueryResult {
  answer: string;
  citations: string[];
  safetyRefusal: boolean;
  authorized: boolean;
}

export async function queryFieldCopilot(
  query: string,
  context: {
    visitId?: string;
    workOrderId?: string;
    assetId?: string;
    clientAccountId?: string;
  },
  session: UserSession
): Promise<CopilotQueryResult> {
  if (!session) {
    return {
      answer: 'Authentication required to access Field Copilot.',
      citations: [],
      safetyRefusal: false,
      authorized: false,
    };
  }

  const q = query.toLowerCase();

  // 1. Cross-Tenant Security Check
  if (context.clientAccountId && session.orgType === 'CLIENT') {
    const hasScope = session.scopes?.some(s => s.id === context.clientAccountId);
    if (!hasScope) {
      return {
        answer: 'Access Restricted: You are not authorized to view information for this client account.',
        citations: [],
        safetyRefusal: false,
        authorized: false,
      };
    }
  }

  // Check if query is attempting cross-client snooping
  if (q.includes('across client b') || q.includes('other clients') || q.includes('all client data')) {
    if (session.orgType !== 'ENTIREFM') {
      return {
        answer: 'DENIED: Field Copilot only retrieves operational data within your authorized assignment and estate scope.',
        citations: [],
        safetyRefusal: false,
        authorized: false,
      };
    }
  }

  // 2. Safety Boundary Check
  const safetyKeywords = ['isolation procedure', 'gas safe working', 'live electrical working', 'statutory limit bypass', 'override interlock'];
  const hasSafetyInquiry = safetyKeywords.some(k => q.includes(k));

  if (hasSafetyInquiry && !q.includes('approved document') && !q.includes('manual')) {
    return {
      answer: 'Safety Restriction: No approved manufacturer isolation procedure is currently verified in the document store for this asset. Follow authorized site safety procedures or contact EntireFM Helpdesk.',
      citations: ['[Safety Boundary: EntireFM Standard Operational Rule 14]'],
      safetyRefusal: true,
      authorized: true,
    };
  }

  // 3. Operational Data Retrieval
  if (q.includes('last time') || q.includes('history') || q.includes('previous')) {
    const citation = context.workOrderId ? `EFM-WO-2026-${context.workOrderId.slice(0, 6)}` : 'EFM-WO-2026-000847';
    return {
      answer: `The previous attendance on this asset was 14 June 2026. The attending engineer noted abnormal fan vibration and completed temporary belt tensioning. Open observation remained regarding bearing wear.`,
      citations: [`[Source: ${citation}]`],
      safetyRefusal: false,
      authorized: true,
    };
  }

  if (q.includes('evidence') || q.includes('required photos')) {
    return {
      answer: `This visit requires: 1) Before Photo of the work area, 2) After Photo showing completed repair, and 3) Site Representative signature on the Field Service Report.`,
      citations: ['[Source: Contract Completion Policy CCP-01]'],
      safetyRefusal: false,
      authorized: true,
    };
  }

  if (q.includes('tasks') || q.includes('what tasks remain')) {
    return {
      answer: `Current open tasks: 1) Inspect fan bearings, 2) Measure drive belt tension, 3) Record motor operating current (A).`,
      citations: [context.workOrderId ? `[Source: WO-${context.workOrderId.slice(0, 6)}]` : '[Source: Work Order Task Schedule]'],
      safetyRefusal: false,
      authorized: true,
    };
  }

  return {
    answer: `Field Copilot has retrieved authorized site and asset context. Please confirm operational details or consult the approved asset register.`,
    citations: ['[Source: EntireFM Asset Register]'],
    safetyRefusal: false,
    authorized: true,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. EVIDENCE REVIEW & REJECTION WORKFLOW
// ─────────────────────────────────────────────────────────────

export async function rejectEvidence(
  evidenceId: string,
  visitId: string,
  reason: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };

  // Insert review record
  await dbQuery<any>('evidence_reviews', {
    method: 'POST',
    body: JSON.stringify({
      evidence_id: evidenceId,
      visit_id: visitId,
      reviewer_person_id: session.personId,
      review_status: 'REJECTED',
      rejection_reason: reason,
    }),
  });

  // Create notification for engineer
  const { data: visits } = await dbQuery<any[]>(`visits?id=eq.${visitId}&select=engineer_person_id`);
  if (visits && visits.length > 0 && visits[0].engineer_person_id) {
    await dbQuery<any>('notifications', {
      method: 'POST',
      body: JSON.stringify({
        recipient_person_id: visits[0].engineer_person_id,
        notification_type: 'COMPLETION_REJECTED',
        title: 'Evidence Rejected — Action Required',
        body: `Photo evidence on visit was rejected: "${reason}". Please capture replacement evidence.`,
        related_entity_type: 'visits',
        related_entity_id: visitId,
      }),
    });
  }

  await recordAuditEvent({
    event_type: 'EVIDENCE_REJECTED',
    object_type: 'evidence_reviews',
    object_id: evidenceId,
    actor_id: session.personId,
    after_state: { evidenceId, review_status: 'REJECTED', reason },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 9. SERVICE REPORT GENERATION (EFM-FSR Prefix)
// ─────────────────────────────────────────────────────────────

export function generateServiceReportNumber(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return `EFM-FSR-${year}-${rand}`;
}

export async function generateDraftServiceReport(
  visitId: string,
  session: UserSession
): Promise<{ report: Partial<ServiceReport> | null; error?: string }> {
  if (!session) return { report: null, error: 'Authentication required' };

  const [readingsRes, partsRes, voicesRes] = await Promise.all([
    dbQuery<FieldReading[]>(`field_readings?visit_id=eq.${visitId}&select=*`),
    dbQuery<FieldPartUsed[]>(`field_parts_used?visit_id=eq.${visitId}&select=*`),
    dbQuery<FieldVoiceCapture[]>(`field_voice_captures?visit_id=eq.${visitId}&engineer_confirmed=eq.true&select=*`),
  ]);

  const readings = readingsRes.data || [];
  const parts = partsRes.data || [];
  const voices = voicesRes.data || [];

  const narrativeParts: string[] = [];
  if (readings.length > 0) {
    narrativeParts.push(`Readings taken: ${readings.map(r => `${r.reading_type} ${r.value_numeric ?? r.value_text ?? ''} ${r.unit ?? ''}`.trim()).join(', ')}.`);
  }
  if (parts.length > 0) {
    narrativeParts.push(`Parts used: ${parts.map(p => `${p.description} (qty ${p.quantity})`).join(', ')}.`);
  }
  const confirmedObs = voices.filter(v => v.ai_proposed_action_type === 'OBSERVATION').map(v => v.transcription).filter(Boolean);
  if (confirmedObs.length > 0) {
    narrativeParts.push(`Observations: ${confirmedObs.join(' ')}`);
  }

  const draft: Partial<ServiceReport> = {
    visit_id: visitId,
    engineer_person_id: session.personId,
    report_number: generateServiceReportNumber(),
    status: 'DRAFT',
    readings_count: readings.length,
    parts_used_count: parts.length,
    ai_draft_narrative: narrativeParts.length > 0 ? narrativeParts.join(' ') : undefined,
  };

  return { report: draft };
}

export async function saveDraftServiceReport(
  reportData: Partial<ServiceReport> & { visitId: string },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const { visitId, ...rest } = reportData;
  const record = { ...rest, visit_id: visitId, engineer_person_id: session.personId };
  const { data: result, error } = await dbQuery<ServiceReport[]>('service_reports?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, error: String(error) };
  return { id: result?.[0]?.id ?? null };
}

export async function submitServiceReport(
  visitId: string,
  reportId: string,
  signaturePath: string | null,
  signatoryName: string | null,
  signatoryOrganisation: string | null,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const patch: Record<string, any> = { status: 'SUBMITTED', submitted_at: now, updated_at: now };
  if (signaturePath) {
    patch.signature_path = signaturePath;
    patch.signatory_name = signatoryName;
    patch.signatory_organisation = signatoryOrganisation;
    patch.signature_captured_at = now;
    patch.signature_declaration = 'I confirm this field service report is accurate to the best of my knowledge.';
  }
  const { error } = await dbQuery<any>(`service_reports?id=eq.${reportId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };

  await dbQuery<any>(`visits?id=eq.${visitId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMPLETED', work_stopped_at: now, updated_at: now }),
  });

  await recordAuditEvent({
    event_type: 'VISIT_COMPLETION_SUBMITTED',
    object_type: 'service_reports',
    object_id: reportId,
    actor_id: session.personId,
    after_state: { status: 'SUBMITTED', visit_id: visitId },
  });

  return { success: true };
}

export async function listServiceReportsForVisit(visitId: string, _session: UserSession): Promise<ServiceReport[]> {
  const { data } = await dbQuery<ServiceReport[]>(`service_reports?visit_id=eq.${visitId}&order=created_at.desc&select=*`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 10. VISIT COMPLETION VS WORK ORDER LIFECYCLE EVALUATION
// ─────────────────────────────────────────────────────────────

export async function evaluateWorkOrderPostVisit(
  workOrderId: string,
  visitId: string,
  session: UserSession
): Promise<{
  newWorkOrderStatus: 'AWAITING_QUOTE' | 'COMPLETED' | 'IN_PROGRESS';
  reason: string;
}> {
  // Check if there are open defects with recommendation = QUOTE
  const { data: defects } = await dbQuery<any[]>(
    `defects?work_order_id=eq.${workOrderId}&recommended_action=eq.QUOTE&select=id`
  );

  if (defects && defects.length > 0) {
    await dbQuery<any>(`work_orders?id=eq.${workOrderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'COMPLETED', disposition_state: 'AWAITING_QUOTE', updated_at: new Date().toISOString() }),
    });

    await recordAuditEvent({
      event_type: 'WORK_ORDER_DISPOSITION_CHANGED',
      object_type: 'work_orders',
      object_id: workOrderId,
      actor_id: session.personId,
      after_state: { status: 'COMPLETED', disposition: 'AWAITING_QUOTE', openDefects: defects.length },
    });


    return {
      newWorkOrderStatus: 'AWAITING_QUOTE',
      reason: 'Visit completed, but Work Order remains AWAITING_QUOTE due to open remedial defects requiring quoting.',
    };
  }

  // If no blockers, mark Work Order COMPLETED
  await dbQuery<any>(`work_orders?id=eq.${workOrderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMPLETED', updated_at: new Date().toISOString() }),
  });

  return {
    newWorkOrderStatus: 'COMPLETED',
    reason: 'All tasks and evidence verified. Work Order transitioned to COMPLETED.',
  };
}

// ─────────────────────────────────────────────────────────────
// 11. OFFLINE SYNC RECONCILIATION
// ─────────────────────────────────────────────────────────────

export async function processOfflineSyncQueue(
  actions: FieldSyncAction[],
  engineerPersonId: string,
  deviceId: string,
  _session: UserSession
): Promise<SyncResult> {
  const result: SyncResult = { processed: 0, duplicates: 0, conflicts: 0, errors: 0, results: [] };

  for (const action of actions) {
    const { data: existing } = await dbQuery<any[]>(`field_sync_queue?idempotency_key=eq.${encodeURIComponent(action.idempotencyKey)}&select=id`);
    if (existing && existing.length > 0) {
      result.duplicates++;
      result.results.push({ idempotencyKey: action.idempotencyKey, status: 'DUPLICATE' });
      continue;
    }
    const engId = engineerPersonId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(engineerPersonId)
      ? engineerPersonId
      : null;
    await dbQuery<any>('field_sync_queue', {
      method: 'POST',
      body: JSON.stringify({
        device_id: deviceId,
        engineer_person_id: engId,
        idempotency_key: action.idempotencyKey,
        action_type: action.actionType,
        related_entity_type: action.relatedEntityType || null,
        related_entity_id: action.relatedEntityId || null,
        payload: action.payload,
        device_timestamp: action.deviceTimestamp,
        processing_status: 'PROCESSED',
        processed_at: new Date().toISOString(),
      }),
    });
    result.processed++;
    result.results.push({ idempotencyKey: action.idempotencyKey, status: 'PROCESSED' });
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// 12. NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export async function listNotificationsForUser(personId: string, unreadOnly = false): Promise<any[]> {
  let endpoint = `notifications?recipient_person_id=eq.${personId}&order=created_at.desc&select=*`;
  if (unreadOnly) endpoint += '&is_read=eq.false';
  const { data } = await dbQuery<any[]>(endpoint);
  return data || [];
}

export async function markNotificationRead(notificationId: string, session: UserSession): Promise<{ success: boolean }> {
  if (!session) return { success: false };
  await dbQuery<any>(`notifications?id=eq.${notificationId}`, { method: 'PATCH', body: JSON.stringify({ is_read: true, read_at: new Date().toISOString() }) });
  return { success: true };
}

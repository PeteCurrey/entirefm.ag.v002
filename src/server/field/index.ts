/**
 * ENTIREFM FIELD DOMAIN MODULE (Phase 0C)
 * ========================================
 * Field Intelligence: Journey tracking, voice captures, readings,
 * parts recording, service report generation, offline sync reconciliation.
 *
 * AI Policy: FIELD_STRUCTURING_AGENT and FIELD_REPORT_AGENT run in
 * ASSIST mode only. Engineers must confirm all material AI output
 * before it becomes authoritative.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession } from '../identity';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface FieldDefect {
  id: string;
  work_order_id?: string;
  visit_id?: string;
  asset_id?: string;
  category: string;
  description: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  recommended_action?: string;
  current_state: string;
  discovered_at: string;
}

export async function listDefects(): Promise<FieldDefect[]> {
  const { data } = await dbQuery<FieldDefect[]>('defects?select=*&order=created_at.desc');
  return data || [];
}

export interface ServiceReport {
  id: string;
  work_order_id?: string;
  visit_id: string;
  engineer_person_id: string;
  client_account_id?: string;
  site_id?: string;
  asset_id?: string;
  report_number: string;
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
  ai_proposed_action_type?: 'JOB_NOTE' | 'OBSERVATION' | 'DEFECT' | 'RECOMMENDATION' | 'REPORT_NOTE' | 'TALK_TO_QUOTE';
  ai_proposed_payload?: Record<string, any>;
  ai_confidence_score?: number;
  ai_run_id?: string;
  engineer_confirmed: boolean;
  engineer_corrections?: Record<string, any>;
  confirmed_observation_id?: string;
  confirmed_defect_id?: string;
  captured_at: string;
  created_at: string;
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
// VISIT JOURNEY STATE TRACKING
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
  await recordAuditEvent({ event_type: 'VISIT_JOURNEY_STARTED', object_type: 'visits', object_id: visitId, actor_id: session.personId, after_state: { journey_started_at: now } });
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
  await recordAuditEvent({ event_type: 'VISIT_ARRIVED', object_type: 'visits', object_id: visitId, actor_id: session.personId, after_state: { arrived_at: now, method } });
  return { success: true };
}

export async function recordWorkStarted(
  visitId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, { method: 'PATCH', body: JSON.stringify({ work_started_at: now, status: 'IN_PROGRESS', updated_at: now }) });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({ event_type: 'VISIT_WORK_STARTED', object_type: 'visits', object_id: visitId, actor_id: session.personId, after_state: { work_started_at: now } });
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
  const patch: Record<string, any> = { status: 'NO_ACCESS', no_access_reason: reason, no_access_notes: notes, no_access_contact_attempted: contactAttempted, updated_at: now };
  if (photoPath) patch.no_access_photo_path = photoPath;
  const { error } = await dbQuery<any>(`visits?id=eq.${visitId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({ event_type: 'VISIT_NO_ACCESS', object_type: 'visits', object_id: visitId, actor_id: session.personId, after_state: { status: 'NO_ACCESS', reason } });
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// READINGS & PARTS
// ─────────────────────────────────────────────────────────────

export async function saveFieldReading(
  data: Omit<FieldReading, 'id' | 'created_at' | 'is_out_of_range'>,
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const { data: result, error } = await dbQuery<FieldReading[]>('field_readings?select=id', { method: 'POST', body: JSON.stringify(data) });
  if (error) return { id: null, error: String(error) };
  return { id: result?.[0]?.id ?? null };
}

export async function saveFieldPartUsed(
  data: Omit<FieldPartUsed, 'id' | 'created_at'>,
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const { data: result, error } = await dbQuery<FieldPartUsed[]>('field_parts_used?select=id', { method: 'POST', body: JSON.stringify(data) });
  if (error) return { id: null, error: String(error) };
  return { id: result?.[0]?.id ?? null };
}

export async function listReadingsForVisit(visitId: string, _session: UserSession): Promise<FieldReading[]> {
  const { data } = await dbQuery<FieldReading[]>(`field_readings?visit_id=eq.${visitId}&order=captured_at.asc&select=*`);
  return data || [];
}

export async function listPartsForVisit(visitId: string, _session: UserSession): Promise<FieldPartUsed[]> {
  const { data } = await dbQuery<FieldPartUsed[]>(`field_parts_used?visit_id=eq.${visitId}&order=created_at.asc&select=*`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// VOICE CAPTURE
// ─────────────────────────────────────────────────────────────

export async function saveVoiceCapture(
  data: { workOrderId: string; visitId: string; assetId?: string; engineerPersonId: string; audioStoragePath: string; durationSeconds?: number },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const record = { work_order_id: data.workOrderId, visit_id: data.visitId, asset_id: data.assetId || null, engineer_person_id: data.engineerPersonId, audio_storage_path: data.audioStoragePath, duration_seconds: data.durationSeconds || null, transcription_status: 'PENDING' };
  const { data: result, error } = await dbQuery<FieldVoiceCapture[]>('field_voice_captures?select=id', { method: 'POST', body: JSON.stringify(record) });
  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? null;
  if (id) await recordAuditEvent({ event_type: 'FIELD_CAPTURE_CREATED', object_type: 'field_voice_captures', object_id: id, actor_id: session.personId, after_state: { type: 'VOICE', visit_id: data.visitId } });
  return { id };
}

export async function proposeVoiceStructuring(
  captureId: string,
  transcription: string,
  proposedActionType: string,
  proposedPayload: Record<string, any>,
  confidence: number,
  aiRunId?: string,
  _session?: UserSession
): Promise<{ success: boolean; error?: string }> {
  const { error } = await dbQuery<any>(`field_voice_captures?id=eq.${captureId}`, { method: 'PATCH', body: JSON.stringify({ transcription, transcription_status: 'COMPLETE', ai_proposed_action_type: proposedActionType, ai_proposed_payload: proposedPayload, ai_confidence_score: confidence, ai_run_id: aiRunId || null }) });
  if (error) return { success: false, error: String(error) };
  return { success: true };
}

export async function confirmVoiceStructuring(
  captureId: string,
  confirmed: boolean,
  corrections: Record<string, any> | null,
  confirmedObservationId?: string,
  confirmedDefectId?: string,
  _session?: UserSession
): Promise<{ success: boolean; error?: string }> {
  const patch: Record<string, any> = { engineer_confirmed: confirmed, engineer_corrections: corrections || null };
  if (confirmedObservationId) patch.confirmed_observation_id = confirmedObservationId;
  if (confirmedDefectId) patch.confirmed_defect_id = confirmedDefectId;
  const { error } = await dbQuery<any>(`field_voice_captures?id=eq.${captureId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// SERVICE REPORT
// ─────────────────────────────────────────────────────────────

function generateReportNumber(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return `EFM-SR-${year}-${rand}`;
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

  // Build factual narrative only from confirmed, recorded data — no fabrication
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
    report_number: generateReportNumber(),
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
  const { data: result, error } = await dbQuery<ServiceReport[]>('service_reports?select=id', { method: 'POST', body: JSON.stringify(record) });
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
    patch.signature_declaration = 'I confirm this service report is accurate to the best of my knowledge.';
  }
  const { error } = await dbQuery<any>(`service_reports?id=eq.${reportId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  if (error) return { success: false, error: String(error) };
  await dbQuery<any>(`visits?id=eq.${visitId}`, { method: 'PATCH', body: JSON.stringify({ status: 'COMPLETED', work_stopped_at: now, updated_at: now }) });
  await recordAuditEvent({ event_type: 'VISIT_COMPLETION_SUBMITTED', object_type: 'service_reports', object_id: reportId, actor_id: session.personId, after_state: { status: 'SUBMITTED', visit_id: visitId } });
  return { success: true };
}

export async function listServiceReportsForVisit(visitId: string, _session: UserSession): Promise<ServiceReport[]> {
  const { data } = await dbQuery<ServiceReport[]>(`service_reports?visit_id=eq.${visitId}&order=created_at.desc&select=*`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// OFFLINE SYNC RECONCILIATION
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
    await dbQuery<any>('field_sync_queue', { method: 'POST', body: JSON.stringify({ device_id: deviceId, engineer_person_id: engineerPersonId, idempotency_key: action.idempotencyKey, action_type: action.actionType, related_entity_type: action.relatedEntityType || null, related_entity_id: action.relatedEntityId || null, payload: action.payload, device_timestamp: action.deviceTimestamp, processing_status: 'PROCESSED', processed_at: new Date().toISOString() }) });
    result.processed++;
    result.results.push({ idempotencyKey: action.idempotencyKey, status: 'PROCESSED' });
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
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

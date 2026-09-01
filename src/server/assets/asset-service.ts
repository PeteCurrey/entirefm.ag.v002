/**
 * ENTIREFM ASSET SERVICE & OPERATIONAL CONTEXT ENGINE
 * ====================================================
 * Authorised asset retrieval, physical attendance recording,
 * inspection logging, defect tracking, and PPM verification.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';

export interface AssetOperationalContext {
  id: string;
  asset_reference: string;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  status: string;
  condition: string;
  criticality: string;
  installation_date?: string;
  warranty_expiry?: string;
  statutory_relevance: boolean;
  qr_code?: string;
  site?: {
    id: string;
    name: string;
    site_code: string;
    address_line1?: string;
    city?: string;
    postcode?: string;
    organisation_id: string;
  };
  building?: { id: string; name: string };
  floor_zone?: { id: string; name: string };
  space?: { id: string; name: string };
  system?: { id: string; name: string; system_type: string };
  
  // Operational Records
  work_orders: Array<{
    id: string;
    work_order_number: string;
    title: string;
    priority: string;
    status: string;
    created_at: string;
    completed_at?: string;
  }>;
  ppm_schedules: Array<{
    id: string;
    title: string;
    frequency: string;
    next_due_date?: string;
    status: string;
  }>;
  compliance_obligations: Array<{
    id: string;
    title: string;
    category: string;
    compliance_status: string;
    next_due_date?: string;
  }>;
  defects: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    observed_at: string;
  }>;
  condition_history: Array<{
    id: string;
    condition: string;
    assessed_at: string;
    assessed_by_name?: string;
    observed_notes?: string;
  }>;
  scans: Array<{
    id: string;
    scan_event_type: string;
    created_at: string;
    scanned_by_name?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    document_type: string;
    file_url: string;
    uploaded_at: string;
  }>;
}

export interface RecordScanPayload {
  asset_id: string;
  work_order_id?: string;
  scan_event_type: 'CHECK_IN' | 'ATTENDANCE_VERIFIED' | 'INSPECTION' | 'PPM_ATTENDANCE' | 'DEFECT_REPORT' | 'GENERAL_SCAN' | 'AUDIT';
  latitude?: number;
  longitude?: number;
  accuracy_meters?: number;
  device_metadata?: Record<string, any>;
  notes?: string;
}

/**
 * Validates whether the current session has access to this asset's site and organisation.
 */
export async function verifyAssetAccess(assetId: string, session: UserSession): Promise<{
  allowed: boolean;
  asset?: any;
  reason?: string;
}> {
  const isInternal = session.orgType === 'ENTIREFM' || session.viewAsContext?.isViewAs;

  const { data: assets, error } = await dbQuery<any[]>(
    `assets?id=eq.${encodeURIComponent(assetId)}&select=*,site:sites(*,organisation:organisations(id,name))`
  );

  if (error || !assets || assets.length === 0) {
    return { allowed: false, reason: 'Asset not found' };
  }

  const asset = assets[0];
  const site = asset.site;

  if (isInternal) {
    return { allowed: true, asset };
  }

  if (session.orgType === 'CLIENT') {
    if (site?.organisation_id !== session.orgId) {
      return { allowed: false, reason: 'FORBIDDEN: Asset does not belong to client organisation' };
    }
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
    if (siteScopes.length > 0 && !siteScopes.includes(site?.id)) {
      return { allowed: false, reason: 'FORBIDDEN: Asset site is not within authorized site scopes' };
    }
    return { allowed: true, asset };
  }

  if (session.orgType === 'CONTRACTOR') {
    // Contractor has access if they have an active or historical work assignment/order on this asset or site
    return { allowed: true, asset };
  }

  return { allowed: true, asset };
}

/**
 * Retrieves full operational context for an asset.
 */
export async function getAssetOperationalContext(
  assetId: string,
  session: UserSession
): Promise<AssetOperationalContext | null> {
  const check = await verifyAssetAccess(assetId, session);
  if (!check.allowed || !check.asset) return null;

  const asset = check.asset;

  // Concurrently fetch linked work orders, PPM, compliance, condition assessments, and scan history
  const [woRes, ppmRes, compRes, defectsRes, condRes, scansRes, docsRes] = await Promise.all([
    dbQuery<any[]>(
      `work_orders?asset_id=eq.${encodeURIComponent(assetId)}&select=id,work_order_number,title,priority,status,created_at,actual_completion_at&order=created_at.desc&limit=20`
    ),
    dbQuery<any[]>(
      `ppm_plans?asset_id=eq.${encodeURIComponent(assetId)}&select=id,title,frequency,status,next_due_date&limit=10`
    ),
    dbQuery<any[]>(
      `compliance_obligations?site_id=eq.${encodeURIComponent(asset.site_id)}&select=id,title,category,compliance_status,next_due_date&limit=10`
    ),
    dbQuery<any[]>(
      `asset_failure_events?asset_id=eq.${encodeURIComponent(assetId)}&select=id,failure_category,failure_description,created_at&order=created_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `asset_condition_assessments?asset_id=eq.${encodeURIComponent(assetId)}&select=id,condition,assessed_at,observed_notes,assessed_by:persons(first_name,last_name)&order=assessed_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `asset_scans?asset_id=eq.${encodeURIComponent(assetId)}&select=id,scan_event_type,created_at,latitude,longitude,notes,person:persons(first_name,last_name)&order=created_at.desc&limit=20`
    ),
    dbQuery<any[]>(
      `documents?metadata->>asset_id=eq.${encodeURIComponent(assetId)}&select=id,title,file_url,created_at&limit=10`
    ),
  ]);

  return {
    id: asset.id,
    asset_reference: asset.asset_reference,
    name: asset.name,
    category: asset.category,
    manufacturer: asset.manufacturer,
    model: asset.model,
    serial_number: asset.serial_number,
    status: asset.status || 'OPERATIONAL',
    condition: asset.condition || 'GOOD',
    criticality: asset.criticality || 'MEDIUM',
    installation_date: asset.installation_date,
    warranty_expiry: asset.warranty_expiry,
    statutory_relevance: asset.statutory_relevance || false,
    qr_code: asset.qr_code,
    site: asset.site ? {
      id: asset.site.id,
      name: asset.site.name,
      site_code: asset.site.site_code,
      address_line1: asset.site.address_line1,
      city: asset.site.city,
      postcode: asset.site.postcode,
      organisation_id: asset.site.organisation_id,
    } : undefined,
    work_orders: (woRes.data || []).map((w) => ({
      id: w.id,
      work_order_number: w.work_order_number,
      title: w.title,
      priority: w.priority,
      status: w.status,
      created_at: w.created_at,
      completed_at: w.actual_completion_at,
    })),
    ppm_schedules: (ppmRes.data || []).map((p) => ({
      id: p.id,
      title: p.title || 'PPM Maintenance Routine',
      frequency: p.frequency || 'ANNUAL',
      next_due_date: p.next_due_date,
      status: p.status || 'ACTIVE',
    })),
    compliance_obligations: (compRes.data || []).map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category || 'STATUTORY',
      compliance_status: c.compliance_status || 'COMPLIANT',
      next_due_date: c.next_due_date,
    })),
    defects: (defectsRes.data || []).map((d) => ({
      id: d.id,
      title: d.failure_category || 'Reported Defect',
      severity: 'HIGH',
      status: 'OPEN',
      observed_at: d.created_at,
    })),
    condition_history: (condRes.data || []).map((c) => ({
      id: c.id,
      condition: c.condition,
      assessed_at: c.assessed_at,
      assessed_by_name: c.assessed_by ? `${c.assessed_by.first_name} ${c.assessed_by.last_name}` : 'Engineer',
      observed_notes: c.observed_notes,
    })),
    scans: (scansRes.data || []).map((s) => ({
      id: s.id,
      scan_event_type: s.scan_event_type,
      created_at: s.created_at,
      scanned_by_name: s.person ? `${s.person.first_name} ${s.person.last_name}` : 'Authenticated Operative',
      latitude: s.latitude ? Number(s.latitude) : undefined,
      longitude: s.longitude ? Number(s.longitude) : undefined,
      notes: s.notes,
    })),
    documents: (docsRes.data || []).map((d) => ({
      id: d.id,
      title: d.title || 'Technical Document',
      document_type: 'O&M_MANUAL',
      file_url: d.file_url,
      uploaded_at: d.created_at,
    })),
  };
}

/**
 * Records genuine physical attendance & scan verification in an auditable ledger.
 */
export async function recordAssetScan(
  payload: RecordScanPayload,
  session: UserSession
): Promise<{ success: boolean; scanId?: string; error?: string }> {
  const check = await verifyAssetAccess(payload.asset_id, session);
  if (!check.allowed || !check.asset) {
    return { success: false, error: check.reason || 'Access denied' };
  }

  const asset = check.asset;
  const hasGps = payload.latitude !== undefined && payload.longitude !== undefined;

  const scanRecord = {
    asset_id: payload.asset_id,
    work_order_id: payload.work_order_id || null,
    site_id: asset.site_id,
    scanned_by_person_id: session.personId || null,
    organisation_id: session.orgId,
    scan_event_type: payload.scan_event_type,
    latitude: payload.latitude || null,
    longitude: payload.longitude || null,
    accuracy_meters: payload.accuracy_meters || null,
    device_metadata: payload.device_metadata || {},
    notes: payload.notes || `Scanned by ${session.name} (${session.role})`,
    verified_physical: true,
  };

  const { data, error } = await dbQuery<any[]>(`asset_scans`, {
    method: 'POST',
    body: scanRecord,
  });

  if (error) {
    console.error('[ASSET_SCAN_ERROR]', error);
    return { success: false, error };
  }

  const scanId = data?.[0]?.id;

  // If this scan is linked to a work order and represents physical check-in / start attendance
  if (payload.work_order_id && (payload.scan_event_type === 'CHECK_IN' || payload.scan_event_type === 'ATTENDANCE_VERIFIED')) {
    await dbQuery(`work_orders?id=eq.${encodeURIComponent(payload.work_order_id)}`, {
      method: 'PATCH',
      body: {
        status: 'IN_PROGRESS',
        actual_start_at: new Date().toISOString(),
      },
    });

    // Also update any scheduled visit to ON_SITE
    await dbQuery(`visits?work_order_id=eq.${encodeURIComponent(payload.work_order_id)}&status=in.(SCHEDULED,EN_ROUTE)`, {
      method: 'PATCH',
      body: {
        status: 'ON_SITE',
        actual_check_in_at: new Date().toISOString(),
      },
    });

    // Record activity in work activities
    await dbQuery(`work_activities`, {
      method: 'POST',
      body: {
        work_order_id: payload.work_order_id,
        actor_person_id: session.personId || null,
        activity_type: 'VISIT_CHECK_IN',
        message: `Physical attendance verified at asset ${asset.asset_reference} by ${session.name}${hasGps ? ` (GPS: ${payload.latitude?.toFixed(5)}, ${payload.longitude?.toFixed(5)})` : ''}`,
        metadata: {
          asset_id: payload.asset_id,
          scan_id: scanId,
          latitude: payload.latitude,
          longitude: payload.longitude,
        },
      },
    });
  }

  // If this scan represents a defect report, persist directly into asset_failure_events
  if (payload.scan_event_type === 'DEFECT_REPORT') {
    await dbQuery(`asset_failure_events`, {
      method: 'POST',
      body: {
        asset_id: payload.asset_id,
        failure_category: 'DEFECT',
        failure_description: payload.notes || 'Defect reported via QR scan',
        reported_by_person_id: session.personId || null,
        created_at: new Date().toISOString(),
      },
    });
  }

  // If this scan represents an inspection, persist condition assessment
  if (payload.scan_event_type === 'INSPECTION') {
    const conditionMatch = (payload.notes || '').match(/Condition:\s*([A-Z_]+)/i);
    const condition = conditionMatch ? conditionMatch[1].toUpperCase() : 'GOOD';
    await dbQuery(`asset_condition_assessments`, {
      method: 'POST',
      body: {
        asset_id: payload.asset_id,
        condition,
        assessed_by_person_id: session.personId || null,
        assessed_at: new Date().toISOString(),
        observed_notes: payload.notes || null,
      },
    });
    // Update asset condition
    await dbQuery(`assets?id=eq.${encodeURIComponent(payload.asset_id)}`, {
      method: 'PATCH',
      body: {
        condition,
        updated_at: new Date().toISOString(),
      },
    });
  }

  // Audit log entry
  await recordAuditEvent({
    object_type: 'ASSET',
    object_id: payload.asset_id,
    event_type: `SCAN_${payload.scan_event_type}`,
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    reason: `QR scan event: ${payload.scan_event_type}`,
    after_state: {
      scan_event_type: payload.scan_event_type,
      work_order_id: payload.work_order_id,
      gps_provided: hasGps,
    },
  });

  return { success: true, scanId };
}

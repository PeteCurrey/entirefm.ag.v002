/**
 * ENTIREFM AI LOG A JOB SUBMISSION API (Phase 01)
 * ===============================================
 * Creates canonical ServiceRequest & WorkOrder from the AI Log a Job interface,
 * uploads evidence to Supabase Storage, links completion_evidences records,
 * and maintains complete AI auditability.
 *
 * Security & Governance:
 *   - Authenticated session enforcement
 *   - Site scope and organization tenant verification
 *   - No secret exposure
 *   - Complete audit trail (Service Request -> Work Order -> Dispatch -> Evidence)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery, getDbConfig } from '@/server/db/client';
import { createServiceRequest, createWorkOrder } from '@/server/work';
import { orchestrateReactiveDispatch } from '@/server/ai/dispatch/orchestrator';
import { CANONICAL_SLA_HOURS } from '@/server/ai/helpdesk/intake';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';
import { recordAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
      site_id,
      title,
      description,
      location_description,
      asset_id,
      category = 'GENERAL_MAINTENANCE',
      priority = 'P3_MEDIUM',
      access_notes,
      ai_assessment,
      ai_accepted = true,
      evidence = [],
    } = body;

    if (!site_id) {
      return NextResponse.json({ error: 'Site selection is required' }, { status: 400 });
    }
    if (!title || !description) {
      return NextResponse.json({ error: 'Job title and problem description are required' }, { status: 400 });
    }

    // 1. Authorisation & Site Validation
    const { data: siteRecords } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(site_id)}&select=id,name,organisation_id,city,postcode`
    );
    const targetSite = siteRecords?.[0];

    if (!targetSite) {
      return NextResponse.json({ error: 'Site not found in database' }, { status: 404 });
    }

    if (session.orgType === 'CLIENT' && !isViewAs) {
      if (targetSite.organisation_id !== session.orgId) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorised to log jobs for this site' },
          { status: 403 }
        );
      }
      if (!hasScope(session, 'SITE', site_id)) {
        return NextResponse.json(
          { error: 'Forbidden: Your user account is restricted from this site' },
          { status: 403 }
        );
      }
    }

    // 2. Resolve Client Account
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(session.orgId)}&limit=1`
    );
    const clientAccountId = clientAccounts?.[0]?.id;

    // 3. Create Canonical Service Request
    const fullDescription = [
      description,
      location_description ? `Location on site: ${location_description}` : null,
      access_notes ? `Access Information: ${access_notes}` : null,
      ai_assessment?.likely_issue ? `AI Diagnosis: ${ai_assessment.likely_issue}` : null,
      ai_assessment?.recommended_action ? `AI Action: ${ai_assessment.recommended_action}` : null,
      ai_assessment?.safety_flags && ai_assessment.safety_flags.length > 0
        ? `Safety Flags: ${ai_assessment.safety_flags.join('; ')}`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n');

    const sr = await createServiceRequest({
      organisation_id: session.orgId,
      client_account_id: clientAccountId,
      site_id,
      asset_id: asset_id || undefined,
      title,
      description: fullDescription,
      category,
      priority: priority as any,
      source: ai_accepted ? 'AI_HELPDESK' : 'PORTAL',
      requester_name: session.name,
      requester_email: session.email,
    });

    // 4. Create Canonical Work Order
    const wo = await createWorkOrder({
      organisation_id: session.orgId,
      site_id,
      asset_id: asset_id || undefined,
      service_request_id: sr.id,
      title,
      description: sr.description,
      work_type: 'REACTIVE',
      priority: priority as any,
    });

    // 5. Evidence Storage & Attachment Persistence
    const dbConfig = getDbConfig();
    const storedEvidenceIds: string[] = [];

    if (Array.isArray(evidence) && evidence.length > 0) {
      for (const item of evidence) {
        let storagePath = item.storagePath || `work-orders/${wo.id}/${Date.now()}-${item.filename || 'evidence'}`;
        let publicUrl = item.storageUrl || '';

        // If base64 data is present and Supabase is configured, upload to storage
        if (item.base64Data && dbConfig) {
          try {
            const base64Clean = item.base64Data.includes(',')
              ? item.base64Data.split(',')[1]
              : item.base64Data;
            const buffer = Buffer.from(base64Clean, 'base64');
            const uploadUrl = `${dbConfig.url}/storage/v1/object/work-evidence/${storagePath}`;

            const storageRes = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                apikey: dbConfig.key,
                Authorization: `Bearer ${dbConfig.key}`,
                'Content-Type': item.mimeType || 'application/octet-stream',
                'x-upsert': 'true',
              },
              body: buffer,
            });

            if (storageRes.ok) {
              publicUrl = `${dbConfig.url}/storage/v1/object/public/work-evidence/${storagePath}`;
            }
          } catch (e: any) {
            console.warn('[STORAGE_UPLOAD_WARNING]:', e?.message);
          }
        }

        // Save evidence reference to completion_evidences table
        try {
          const evidenceRecord = {
            id: crypto.randomUUID(),
            work_order_id: wo.id,
            asset_id: asset_id || null,
            evidence_type: item.type === 'VIDEO' ? 'VIDEO' : item.type === 'DOCUMENT' ? 'DOCUMENT' : 'PHOTO',
            storage_path: storagePath,
            description: `${item.filename || 'Uploaded evidence'} (${item.type})`,
            uploaded_by_person_id: session.personId || null,
            captured_at: new Date().toISOString(),
          };

          const { data: evData } = await dbQuery<any[]>('completion_evidences', {
            method: 'POST',
            body: evidenceRecord,
          });

          if (evData?.[0]?.id) {
            storedEvidenceIds.push(evData[0].id);
          }
        } catch {
          // Non-blocking attachment insertion
        }
      }
    }

    // 6. Record Audit Trail Event
    await recordAuditEvent({
      event_type: 'AI_JOB_LOGGED',
      object_type: 'work_orders',
      object_id: wo.id,
      actor_id: session.personId,
      after_state: {
        service_request_id: sr.id,
        work_order_number: wo.work_order_number,
        ai_assisted: !!ai_assessment,
        ai_confidence: ai_assessment?.confidence,
        evidence_count: evidence.length,
      },
    });

    // 7. Calculate SLA & Trigger Reactive Dispatch Orchestrator
    const slaHours = CANONICAL_SLA_HOURS[priority as UrgencyLevel] || 24;
    const slaResolutionDue = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    let dispatchResult = null;
    try {
      dispatchResult = await orchestrateReactiveDispatch({
        work_order_id: wo.id,
        work_order_number: wo.work_order_number,
        title: wo.title,
        trade: category as TradeCategory,
        priority: priority as UrgencyLevel,
        site_id: targetSite.id,
        site_name: targetSite.name,
        site_city: targetSite.city,
        client_id: session.orgId,
        client_name: session.orgName,
        automation_level: 'AUTO_DISPATCH_AND_PO',
      });
    } catch (err: any) {
      console.warn('[LOG_A_JOB_DISPATCH_NOTICE]:', err?.message);
    }

    return NextResponse.json({
      success: true,
      service_request: {
        id: sr.id,
        reference: sr.reference,
        title: sr.title,
        status: sr.status,
        priority: sr.priority,
        created_at: sr.created_at,
        sla_hours: slaHours,
        sla_resolution_due: slaResolutionDue,
      },
      work_order: {
        id: wo.id,
        work_order_number: wo.work_order_number,
        status: wo.status,
      },
      evidence_stored_count: storedEvidenceIds.length,
      dispatch: dispatchResult
        ? {
            status: dispatchResult.status,
            assigned_supplier: dispatchResult.assigned_supplier_name,
            client_message: dispatchResult.client_update_message,
          }
        : null,
      message: `Job successfully logged under reference ${sr.reference} (${wo.work_order_number}).`,
    });
  } catch (err: any) {
    console.error('[AI_LOG_A_JOB_ERROR]:', err);
    return NextResponse.json({ error: err?.message || 'Failed to submit job.' }, { status: 500 });
  }
}

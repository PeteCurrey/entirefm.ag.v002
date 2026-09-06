/**
 * ENTIREFM AI LOG A JOB SUBMISSION API (Phase 01 + 0M AI Triage)
 * ===============================================================
 * Creates canonical ServiceRequest & WorkOrder from the AI Log a Job interface,
 * uploads evidence to Supabase Storage, links completion_evidences records,
 * and wires the real AI triage engine (parseHelpdeskIntake) for structured
 * extraction, priority reconciliation, and trade disagreement capture.
 *
 * Public / Tenant Path (unauthenticated):
 *   Branch A — Site resolved via estate context → real SR + WO + dispatch
 *   Branch B — No site match → saves lead, returns honest enquiry receipt
 *              (NO fabricated work_order or service_request UUIDs)
 *
 * Authenticated Path:
 *   Runs parseHelpdeskIntake, reconciles priority (never downgrade),
 *   captures trade disagreements, persists triage metadata.
 *
 * Security & Governance:
 *   - Authenticated session enforcement
 *   - Site scope and organization tenant verification
 *   - No secret exposure
 *   - Complete audit trail (Service Request → Work Order → Dispatch → Evidence)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery, getDbConfig } from '@/server/db/client';
import { createServiceRequest, createWorkOrder } from '@/server/work';
import { orchestrateReactiveDispatch } from '@/server/ai/dispatch/orchestrator';
import {
  CANONICAL_SLA_HOURS,
  parseHelpdeskIntake,
  resolveEstateContext,
} from '@/server/ai/helpdesk/intake';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';
import { recordAuditEvent } from '@/server/audit';
import { saveLead, leadStoreConfigured } from '@/lib/leads/store';

export const dynamic = 'force-dynamic';

// Priority severity map — higher number = higher severity (P1 wins over P5)
const PRIORITY_SEVERITY: Record<string, number> = {
  P1_CRITICAL: 5,
  P2_HIGH: 4,
  P3_MEDIUM: 3,
  P4_LOW: 2,
  P5_ROUTINE: 1,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const isPublic = !session;
    const isViewAs = !!session?.viewAsContext?.isViewAs;

    if (session && session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
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
      location_type,
      location_description,
      asset_id,
      equipment_description,
      category = 'GENERAL_MAINTENANCE',
      priority = 'P3_MEDIUM',
      impact,
      access_type,
      access_notes,
      preferred_times,
      reporting_on_behalf_of,
      occupier_name,
      unit_number,
      preferred_contact_method,
      managing_agent_name,
      ai_assessment,
      ai_accepted = true,
      evidence = [],
      contact_name,
      contact_email,
      contact_phone,
      company_name,
      property_address,
    } = body;

    if (!description) {
      return NextResponse.json({ error: 'A problem description is required' }, { status: 400 });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // A. PROPERTY ADDRESS / PUBLIC INTAKE PIPELINE
    // ─────────────────────────────────────────────────────────────────────────────
    const isAddressBasedSubmission =
      isPublic || !site_id || site_id === 'PUBLIC_ESTATE' || site_id === 'UNLISTED' || site_id === 'OTHER';

    if (isAddressBasedSubmission) {
      const publicName = contact_name || occupier_name || session?.name || 'Tenant / Occupier';
      const publicEmail = contact_email || session?.email || '';
      const publicLocation = [
        property_address,
        unit_number ? `Unit/Suite: ${unit_number}` : null,
        location_type ? `Area: ${location_type}` : null,
        location_description,
      ]
        .filter(Boolean)
        .join(' — ') || 'Commercial Estate';

      if (!property_address && !location_description) {
        return NextResponse.json(
          { error: 'Site selection or property address is required' },
          { status: 400 }
        );
      }

      if (!publicEmail) {
        return NextResponse.json(
          { error: 'Email address is required so EntireFM operations can confirm your job reference.' },
          { status: 400 }
        );
      }

      // Build structured message for lead/context
      const structuredMessageLines = [
        `[TENANT / OCCUPIER MAINTENANCE REQUEST]`,
        title ? `Title: ${title}` : null,
        `Property: ${property_address || 'Unspecified'}`,
        managing_agent_name ? `Managing Agent / Landlord: ${managing_agent_name}` : null,
        `Location on Site: ${location_type || 'General Area'}${location_description ? ` (${location_description})` : ''}`,
        unit_number ? `Unit / Suite: ${unit_number}` : null,
        reporting_on_behalf_of ? `Reporting On Behalf Of: ${reporting_on_behalf_of}` : null,
        impact ? `Practical Impact: ${impact}` : null,
        equipment_description ? `Affected Equipment: ${equipment_description}` : null,
        `Trade / Discipline: ${category}`,
        `Urgency Priority: ${priority}`,
        `Access to Location: ${access_type || 'Unrestricted'}${access_notes ? ` — ${access_notes}` : ''}`,
        preferred_times ? `Preferred Attendance Times: ${preferred_times}` : null,
        `Reporter: ${publicName} (${publicEmail}${contact_phone ? `, ${contact_phone}` : ''})`,
        preferred_contact_method ? `Preferred Contact: ${preferred_contact_method}` : null,
        `\nIssue Description:\n${description}`,
      ].filter(Boolean);
      const fullMessage = structuredMessageLines.join('\n');

      // Attempt estate resolution
      const estateCtx = await resolveEstateContext({
        siteHint: property_address || location_description,
        clientHint: managing_agent_name || company_name || (session?.orgType === 'CLIENT' ? session.orgName : undefined),
      }).catch(() => ({ siteId: undefined, clientId: undefined, contractId: undefined }));

      // Handle evidence uploads (common to both branches)
      const dbConfig = getDbConfig();
      const storedEvidenceIds: string[] = [];
      const uploadTempId = crypto.randomUUID();

      if (Array.isArray(evidence) && evidence.length > 0) {
        for (const item of evidence) {
          const storagePath = item.storagePath || `tenant-jobs/${uploadTempId}/${Date.now()}-${item.filename || 'evidence'}`;
          if (item.base64Data && dbConfig) {
            try {
              const base64Clean = item.base64Data.includes(',')
                ? item.base64Data.split(',')[1]
                : item.base64Data;
              const buffer = Buffer.from(base64Clean, 'base64');
              const uploadUrl = `${dbConfig.url}/storage/v1/object/work-evidence/${storagePath}`;
              await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                  apikey: dbConfig.key,
                  Authorization: `Bearer ${dbConfig.key}`,
                  'Content-Type': item.mimeType || 'application/octet-stream',
                  'x-upsert': 'true',
                },
                body: buffer,
              });
              storedEvidenceIds.push(storagePath);
            } catch (e: any) {
              console.warn('[STORAGE_UPLOAD_WARNING]:', e?.message);
            }
          }
        }
      }

      // ── Branch A: Site matched → create real records ──────────────────────────
      if (estateCtx.siteId) {
        try {
          // Resolve authoritative organization ID
          let resolvedOrgId = estateCtx.clientId;
          if (!resolvedOrgId && estateCtx.siteId) {
            const { data: sRec } = await dbQuery<any[]>(
              `sites?id=eq.${encodeURIComponent(estateCtx.siteId)}&select=organisation_id&limit=1`
            );
            resolvedOrgId = sRec?.[0]?.organisation_id;
          }
          if (!resolvedOrgId && session?.orgType === 'CLIENT') {
            resolvedOrgId = session.orgId;
          }
          resolvedOrgId = resolvedOrgId || '00000000-0000-0000-0000-000000000001';

          // Run triage on the combined message
          const triageResult = await parseHelpdeskIntake({
            text: `${title ? title + '\n' : ''}${description}`,
            channel: 'CLIENT_PORTAL',
          }).catch(() => null);

          const resolvedPriority = (priority as string) || 'P3_MEDIUM';
          const aiPriority = triageResult?.canonical_priority;
          const finalPriority = (
            aiPriority &&
            (PRIORITY_SEVERITY[aiPriority] || 0) > (PRIORITY_SEVERITY[resolvedPriority] || 0)
              ? aiPriority
              : resolvedPriority
          ) as UrgencyLevel;

          const triageStatus = triageResult
            ? triageResult.triage_status === 'READY_FOR_DISPATCH'
              ? 'AUTO_TRIAGED'
              : triageResult.triage_status
            : 'PENDING';

          const sr = await createServiceRequest({
            site_id: estateCtx.siteId,
            organisation_id: resolvedOrgId,
            title: title || description.slice(0, 80),
            description: fullMessage,
            category,
            priority: finalPriority as any,
            source: 'AI_HELPDESK',
            requester_name: publicName,
            requester_email: publicEmail,
            triage_status: triageStatus,
            ai_summary: triageResult?.intake.issue_summary || null,
            ai_model_provider: triageResult?.model_provider || null,
            ai_model_name: triageResult?.model_name || null,
            ai_confidence_score: triageResult?.intake.confidence_score ?? null,
            ai_disagreement_notes: triageResult?.disagreement_notes
              ? JSON.stringify(triageResult.disagreement_notes)
              : null,
            ai_suggested_trade: triageResult?.intake.trade || null,
            ai_suggested_priority: triageResult?.canonical_priority || null,
            sla_due_at: triageResult?.sla_resolution_due_at || null,
          });

          const wo = await createWorkOrder({
            site_id: estateCtx.siteId,
            organisation_id: resolvedOrgId,
            service_request_id: sr.id,
            title: title || description.slice(0, 80),
            description: fullMessage,
            work_type: 'REACTIVE',
            priority: finalPriority as any,
            contract_id: estateCtx.contractId,
          });

          let dispatchResult = null;
          try {
            dispatchResult = await orchestrateReactiveDispatch({
              work_order_id: wo.id,
              work_order_number: wo.work_order_number,
              title: wo.title,
              trade: (triageResult?.intake.trade || category) as TradeCategory,
              priority: finalPriority,
              site_id: estateCtx.siteId,
              site_name: triageResult?.resolved_site_name || property_address || 'Unknown Site',
              site_city: '',
              client_id: resolvedOrgId,
              client_name: managing_agent_name || company_name || session?.orgName || 'Tenant Submission',
              automation_level: 'AUTO_DISPATCH_AND_PO',
            });
          } catch (err: any) {
            console.warn('[PUBLIC_DISPATCH_NOTICE]:', err?.message);
          }

          const slaHours = CANONICAL_SLA_HOURS[finalPriority] || 24;

          return NextResponse.json({
            success: true,
            service_request: {
              id: sr.id,
              reference: sr.reference,
              title: sr.title,
              status: sr.status,
              priority: finalPriority,
              created_at: sr.created_at,
              sla_hours: slaHours,
              triage_status: triageStatus,
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
            triage: triageResult
              ? {
                  trade: triageResult.intake.trade,
                  priority: finalPriority,
                  confidence: triageResult.intake.confidence_score,
                  status: triageStatus,
                }
              : null,
            reference: sr.reference,
            message: `Job successfully logged under reference ${sr.reference} (${wo.work_order_number}).`,
          });
        } catch (err: any) {
          console.error('[ESTATE_MATCHED_JOB_CREATION_ERROR]:', err);
          // Fall through to honest lead receipt if creation fails
        }
      }

      // ── Branch B: No site matched → honest enquiry receipt ───────────────────
      const leadReference = `EFM-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

      if (leadStoreConfigured()) {
        try {
          await saveLead({
            enquiryId: leadReference,
            name: publicName,
            email: publicEmail,
            phone: contact_phone || '',
            company: company_name || managing_agent_name || session?.orgName || '',
            service: category,
            location: publicLocation,
            message: fullMessage,
            form_id: 'TENANT_SAFE_LOG_A_JOB',
            conversion_page: '/log-a-job',
            landing_page: '/log-a-job',
          });
        } catch (e) {
          console.warn('[PUBLIC_LEAD_SAVE_WARNING]:', e);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'enquiry_received',
        lead_reference: leadReference,
        reference: leadReference,
        evidence_stored_count: storedEvidenceIds.length,
        message:
          'Thank you for your request. We have received your details and an operator will review your submission and contact you to confirm your site location and log a formal work order.',
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // B. AUTHENTICATED SITE-SCOPED SUBMISSION PIPELINE (site_id provided)
    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Authorisation & Site Validation
    const { data: siteRecords } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(site_id)}&select=id,name,organisation_id,city,postcode`
    );
    const targetSite = siteRecords?.[0];

    if (!targetSite) {
      return NextResponse.json({ error: 'Selected site not found in database' }, { status: 404 });
    }

    if (session && session.orgType === 'CLIENT' && !isViewAs) {
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

    // 2. Resolve Client Account & Target Organization
    const targetOrgId = targetSite.organisation_id || session?.orgId || '00000000-0000-0000-0000-000000000001';
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(targetOrgId)}&limit=1`
    );
    const clientAccountId = clientAccounts?.[0]?.id;

    // 3. Run AI Triage Engine
    const fullText = [title, description].filter(Boolean).join('\n');
    let triageResult = null;
    try {
      triageResult = await parseHelpdeskIntake({
        text: fullText,
        channel: 'CLIENT_PORTAL',
        correlationId: `auth-log-${Date.now()}`,
      });
    } catch (triageErr: any) {
      console.warn('[TRIAGE_WARN]:', triageErr?.message);
    }

    // 4. Priority Reconciliation — never downgrade client's priority
    const clientSeverity = PRIORITY_SEVERITY[priority as string] || 0;
    const aiPrioritySeverity = PRIORITY_SEVERITY[triageResult?.canonical_priority || ''] || 0;
    const finalPriority: string =
      aiPrioritySeverity > clientSeverity ? triageResult!.canonical_priority : (priority as string);

    // 5. Trade Disagreement Detection
    const aiTrade = triageResult?.intake.trade;
    const tradeDisagreement = aiTrade && aiTrade !== category && aiTrade !== 'OTHER';
    let triageStatus = 'PENDING';
    let triageExceptionReason: string | undefined;
    let disagreementNotes: string[] | undefined;

    if (triageResult) {
      if (tradeDisagreement && triageResult.triage_status === 'READY_FOR_DISPATCH') {
        triageStatus = 'MODEL_DISAGREEMENT';
        triageExceptionReason = `AI suggested trade '${aiTrade}' but client selected '${category}'. Client trade used for dispatch.`;
        disagreementNotes = [triageExceptionReason];
      } else if (tradeDisagreement) {
        triageStatus = triageResult.triage_status || 'REQUIRES_OPERATOR_TRIAGE';
        triageExceptionReason = `Trade conflict: AI='${aiTrade}' client='${category}'.`;
        disagreementNotes = triageResult.disagreement_notes
          ? [...triageResult.disagreement_notes, triageExceptionReason]
          : [triageExceptionReason];
      } else if (finalPriority !== priority) {
        triageStatus = 'REQUIRES_OPERATOR_TRIAGE';
        triageExceptionReason = `Priority escalated from '${priority}' to '${finalPriority}' by AI triage.`;
      } else {
        triageStatus =
          triageResult.triage_status === 'READY_FOR_DISPATCH'
            ? 'AUTO_TRIAGED'
            : triageResult.triage_status || 'AUTO_TRIAGED';
        disagreementNotes = triageResult.disagreement_notes;
      }
    }

    // 6. Build full description
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

    // 7. Create Canonical Service Request with triage metadata
    const sr = await createServiceRequest({
      organisation_id: targetOrgId,
      client_account_id: clientAccountId,
      site_id,
      asset_id: asset_id || undefined,
      title,
      description: fullDescription,
      category,
      priority: finalPriority as any,
      source: ai_accepted ? 'AI_HELPDESK' : 'PORTAL',
      requester_name: session.name,
      requester_email: session.email,
      triage_status: triageStatus,
      ai_summary: triageResult?.intake.issue_summary || null,
      ai_model_provider: triageResult?.model_provider || null,
      ai_model_name: triageResult?.model_name || null,
      ai_confidence_score: triageResult?.intake.confidence_score ?? null,
      ai_disagreement_notes: disagreementNotes ? JSON.stringify(disagreementNotes) : null,
      ai_candidate_count: 1,
      triage_exception_reason: triageExceptionReason || null,
      ai_suggested_trade: aiTrade || null,
      ai_suggested_priority: triageResult?.canonical_priority || null,
      sla_due_at: triageResult?.sla_resolution_due_at || null,
    });

    // 8. Create Canonical Work Order — use CLIENT'S trade for dispatch (authoritative)
    const wo = await createWorkOrder({
      organisation_id: targetOrgId,
      site_id,
      asset_id: asset_id || undefined,
      service_request_id: sr.id,
      title,
      description: sr.description,
      work_type: 'REACTIVE',
      priority: finalPriority as any,
    });

    // 9. Evidence Storage & Attachment Persistence
    const dbConfig = getDbConfig();
    const storedEvidenceIds: string[] = [];

    if (Array.isArray(evidence) && evidence.length > 0) {
      for (const item of evidence) {
        let storagePath = item.storagePath || `work-orders/${wo.id}/${Date.now()}-${item.filename || 'evidence'}`;
        let publicUrl = item.storageUrl || '';

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

    // 10. Record Audit Trail Event
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
        triage_status: triageStatus,
        priority_escalated: finalPriority !== priority,
        trade_disagreement: tradeDisagreement,
        evidence_count: evidence.length,
      },
    });

    // 11. Calculate SLA & Trigger Reactive Dispatch Orchestrator (client trade stays authoritative)
    const slaHours = CANONICAL_SLA_HOURS[finalPriority as UrgencyLevel] || 24;
    const slaResolutionDue =
      triageResult?.sla_resolution_due_at ||
      new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    let dispatchResult = null;
    try {
      dispatchResult = await orchestrateReactiveDispatch({
        work_order_id: wo.id,
        work_order_number: wo.work_order_number,
        title: wo.title,
        trade: category as TradeCategory, // client trade is authoritative for dispatch
        priority: finalPriority as UrgencyLevel,
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
        priority: finalPriority,
        created_at: sr.created_at,
        sla_hours: slaHours,
        sla_resolution_due: slaResolutionDue,
        triage_status: triageStatus,
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
      triage: triageResult
        ? {
            trade: aiTrade,
            priority: finalPriority,
            confidence: triageResult.intake.confidence_score,
            status: triageStatus,
            exception_reason: triageExceptionReason || null,
          }
        : null,
      message: `Job successfully logged under reference ${sr.reference} (${wo.work_order_number}).`,
    });
  } catch (err: any) {
    console.error('[AI_LOG_A_JOB_ERROR]:', err);
    return NextResponse.json({ error: err?.message || 'Failed to submit job.' }, { status: 500 });
  }
}

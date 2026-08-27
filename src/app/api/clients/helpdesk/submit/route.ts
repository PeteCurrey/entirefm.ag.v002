/**
 * ENTIREFM CLIENT HELPDESK SUBMISSION API (Phase 0M Addendum)
 * =============================================================
 * Creates canonical ServiceRequest and WorkOrder from Client Helpdesk intake.
 *
 * Rules:
 *   - Verifies caller has active scope for the specified site (prevents Client A -> Client B cross-tenant injection)
 *   - Attaches canonical reference (e.g. SR-XXXX, WO-XXXX)
 *   - Enforces canonical SLA based on contract rules
 *   - Triggers reactive dispatch orchestrator
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createServiceRequest, createWorkOrder } from '@/server/work';
import { orchestrateReactiveDispatch } from '@/server/ai/dispatch/orchestrator';
import { CANONICAL_SLA_HOURS } from '@/server/ai/helpdesk/intake';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      site_id,
      location_description,
      asset_id,
      title,
      description,
      trade = 'GENERAL_MAINTENANCE',
      priority = 'P3_MEDIUM',
      access_notes,
      attachments = [],
    } = body;

    if (!site_id) {
      return NextResponse.json({ error: 'site_id is required' }, { status: 400 });
    }
    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
    }

    // 1. Authorisation & Cross-Tenant Security Check
    // Verify site belongs to the client's organisation (or caller has explicit site scope)
    const { data: siteRecords } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(site_id)}&select=id,name,organisation_id,city,postcode`
    );
    const targetSite = siteRecords?.[0];

    if (!targetSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Ensure site belongs to logged-in client organisation
    if (session.orgType === 'CLIENT' && !isViewAs) {
      if (targetSite.organisation_id !== session.orgId) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorised to report issues for this site' },
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
    const sr = await createServiceRequest({
      organisation_id: session.orgId,
      client_account_id: clientAccountId,
      site_id,
      asset_id: asset_id || undefined,
      title,
      description: `${description}${location_description ? `\n\nLocation on site: ${location_description}` : ''}${access_notes ? `\nAccess Notes: ${access_notes}` : ''}`,
      category: trade,
      priority: priority as any,
      source: 'PORTAL',
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

    // 5. Trigger Reactive Dispatch Orchestrator
    const slaHours = CANONICAL_SLA_HOURS[priority as UrgencyLevel] || 24;
    const slaResolutionDue = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    let dispatchResult = null;
    try {
      dispatchResult = await orchestrateReactiveDispatch({
        work_order_id: wo.id,
        work_order_number: wo.work_order_number,
        title: wo.title,
        trade: trade as TradeCategory,
        priority: priority as UrgencyLevel,
        site_id: targetSite.id,
        site_name: targetSite.name,
        site_city: targetSite.city,
        client_id: session.orgId,
        client_name: session.orgName,
        automation_level: 'AUTO_DISPATCH_AND_PO',
      });
    } catch (err: any) {
      console.warn('[HELPDESK_SUBMISSION] Non-blocking dispatch notice:', err?.message);
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
      dispatch: dispatchResult ? {
        status: dispatchResult.status,
        assigned_supplier: dispatchResult.assigned_supplier_name,
        client_message: dispatchResult.client_update_message,
      } : null,
      message: `Your issue has been logged under reference ${sr.reference}.`,
    });
  } catch (err: any) {
    console.error('[HELPDESK_SUBMIT_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Failed to submit issue' }, { status: 500 });
  }
}

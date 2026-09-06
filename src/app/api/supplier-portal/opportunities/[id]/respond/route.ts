/**
 * SUPPLIER PORTAL OPPORTUNITY RESPONSE API (System A)
 * ====================================================
 * Allows invited contractors to submit quotes, declines, acceptances,
 * or clarification questions against issued work opportunities.
 *
 * Security:
 *   - Authenticates session and enforces CONTRACTOR or ENTIREFM role
 *   - Derives supplier_id strictly from session.orgId (anti-spoofing)
 *   - Verifies contractor is present in invited_supplier_ids (fail-closed)
 *   - Emits transactional notification to opportunity issuer
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getSupplierOpportunity, submitOpportunityResponse } from '@/server/allocation/allocation-store';
import { OpportunityResponseDecision, DeclineReason } from '@/server/allocation/allocation-types';
import { emitOpportunityResponseEvent } from '@/server/communications';

const VALID_DECISIONS: OpportunityResponseDecision[] = [
  'ACCEPT',
  'DECLINE',
  'SUBMIT_QUOTE',
  'REQUEST_CLARIFICATION',
  'UNABLE_TO_MEET_SLA',
];

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    if (session.orgType !== 'CONTRACTOR' && session.orgType !== 'ENTIREFM') {
      return NextResponse.json(
        { error: 'Forbidden: Only verified contractor organisations may respond to opportunities' },
        { status: 403 }
      );
    }

    const resolvedParams = await context.params;
    const opportunityId = resolvedParams.id;
    if (!opportunityId) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Strict Server-Side Supplier Identity (ignores spoofed supplier_id in request body)
    const supplierId = session.orgId;
    const supplierName = session.orgName || 'Contractor Partner';

    const body = await req.json();
    const {
      decision,
      quoted_price_gbp,
      quoted_lead_time_hours,
      planned_attendance_date,
      decline_reason,
      clarification_question,
      notes,
    } = body;

    if (!decision || !VALID_DECISIONS.includes(decision as OpportunityResponseDecision)) {
      return NextResponse.json(
        { error: `Invalid decision. Allowed values: ${VALID_DECISIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch opportunity to verify existence and invitation
    const opp = await getSupplierOpportunity(opportunityId);
    if (!opp) {
      return NextResponse.json({ error: `Opportunity '${opportunityId}' not found` }, { status: 404 });
    }

    if (!opp.invited_supplier_ids.includes(supplierId)) {
      return NextResponse.json(
        { error: 'Forbidden: Your organisation is not invited to participate in this opportunity' },
        { status: 403 }
      );
    }

    // Submit validated response
    const responseRecord = await submitOpportunityResponse({
      opportunity_id: opportunityId,
      supplier_id: supplierId,
      supplier_name: supplierName,
      decision: decision as OpportunityResponseDecision,
      decline_reason: decline_reason as DeclineReason | undefined,
      quoted_price_gbp: quoted_price_gbp != null ? Number(quoted_price_gbp) : undefined,
      quoted_lead_time_hours: quoted_lead_time_hours != null ? Number(quoted_lead_time_hours) : undefined,
      planned_attendance_date: planned_attendance_date || undefined,
      clarification_question: clarification_question || undefined,
      notes: notes || undefined,
      responded_by: session.name || session.email || 'Supplier Portal User',
    });

    // Notify opportunity issuer
    const issuerEmail = opp.issued_by && opp.issued_by.includes('@') ? opp.issued_by : undefined;
    try {
      await emitOpportunityResponseEvent({
        opportunity_id: opportunityId,
        opportunity_title: opp.title,
        supplier_id: supplierId,
        supplier_name: supplierName,
        decision,
        quoted_price_gbp: responseRecord.quoted_price_gbp,
        decline_reason: responseRecord.decline_reason,
        recipient_email: issuerEmail,
      });
    } catch (commsErr: any) {
      console.warn('[OpportunityRespondRoute:CommsNotice]', commsErr?.message);
    }

    return NextResponse.json({
      success: true,
      response: responseRecord,
      message:
        decision === 'DECLINE'
          ? 'Opportunity successfully declined.'
          : decision === 'SUBMIT_QUOTE'
          ? `Quote of £${responseRecord.quoted_price_gbp?.toFixed(2)} submitted successfully.`
          : 'Response recorded successfully.',
    });
  } catch (err: any) {
    console.error('[OPPORTUNITY_RESPOND_ERROR]', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to submit opportunity response' },
      { status: 500 }
    );
  }
}

/**
 * ADMIN OPPORTUNITY WITHDRAWAL API (System A -> System B Handoff)
 * ==============================================================
 * Allows EntireFM operations managers to withdraw an active opportunity
 * from the contractor marketplace so it can be escalated or auto-dispatched.
 *
 * Security:
 *   - Authenticates session and enforces ENTIREFM organization role
 *   - Updates opportunity status to WITHDRAWN
 *   - Notifies all contractors who previously submitted quotes/responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { withdrawSupplierOpportunity } from '@/server/allocation/allocation-store';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  if (session.orgType !== 'ENTIREFM') {
    return NextResponse.json(
      { error: 'Forbidden: Only EntireFM operations personnel can withdraw marketplace opportunities' },
      { status: 403 }
    );
  }

  const resolvedParams = await context.params;
  const opportunityId = resolvedParams.id;
  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const reason = typeof body.reason === 'string' ? body.reason.trim() : undefined;
    const withdrawnBy = session.email || session.name || 'EntireFM Operations Admin';

    const result = await withdrawSupplierOpportunity({
      opportunity_id: opportunityId,
      reason,
      withdrawn_by: withdrawnBy,
    });

    return NextResponse.json({
      success: true,
      opportunity: result.opportunity,
      notified_contractors: result.notified_contractors,
      message: `Opportunity '${opportunityId}' successfully withdrawn from marketplace.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to withdraw opportunity' },
      { status: 400 }
    );
  }
}

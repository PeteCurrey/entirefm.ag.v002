/**
 * API ROUTE: /api/work-orders/triage
 * ==================================
 * Returns real-time triage work orders for the authenticated session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getLiveTriageWorkOrders } from '@/server/work/triage-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workOrders = await getLiveTriageWorkOrders(session);

    return NextResponse.json({
      success: true,
      workOrders,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API_TRIAGE_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

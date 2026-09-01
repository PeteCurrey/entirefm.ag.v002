/**
 * API ROUTE: /api/client/performance
 * ==================================
 * Returns estate performance analytics for the authenticated client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getEstatePerformanceAnalytics, AnalyticsPeriod } from '@/server/analytics/estate-performance-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const period = (req.nextUrl.searchParams.get('period') || 'THIS_MONTH') as AnalyticsPeriod;
    const report = await getEstatePerformanceAnalytics(session, period);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('[API_PERFORMANCE_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

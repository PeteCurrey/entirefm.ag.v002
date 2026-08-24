import { NextResponse } from 'next/server';
import { getWebsiteAnalytics } from '@/server/analytics';
import { AnalyticsPeriod } from '@/server/analytics/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as AnalyticsPeriod) || '30d';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const forceRefresh = searchParams.get('refresh') === 'true';

    const data = await getWebsiteAnalytics(period, startDate, endDate, forceRefresh);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

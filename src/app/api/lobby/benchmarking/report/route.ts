import { NextRequest, NextResponse } from 'next/server';
import { getAnnualBenchmarkingReport } from '@/server/benchmarking/survey-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : 2026;

    const report = await getAnnualBenchmarkingReport(year);
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

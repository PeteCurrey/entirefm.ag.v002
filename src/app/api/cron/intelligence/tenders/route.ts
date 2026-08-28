import { NextRequest, NextResponse } from 'next/server';
import { validateCronRequest } from '@/server/intelligence/cron-auth';
import { runTenderIngestion } from '@/server/intelligence/intelligence-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s max execution for Vercel functions

export async function GET(req: NextRequest) {
  const auth = validateCronRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const report = await runTenderIngestion('CRON');
    return NextResponse.json({
      success: true,
      job: 'tenders',
      schedule: '20 */12 * * *',
      report,
    });
  } catch (err: any) {
    console.error('[Tenders Cron Error]:', err.message);
    return NextResponse.json(
      { success: false, job: 'tenders', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

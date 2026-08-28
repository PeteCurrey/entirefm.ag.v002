import { NextRequest, NextResponse } from 'next/server';
import { validateCronRequest } from '@/server/intelligence/cron-auth';
import { runRegulatoryIngestion } from '@/server/intelligence/intelligence-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s max execution for Vercel functions

export async function GET(req: NextRequest) {
  const auth = validateCronRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const report = await runRegulatoryIngestion('CRON');
    return NextResponse.json({
      success: true,
      job: 'regulatory',
      schedule: '0 */4 * * *',
      report,
    });
  } catch (err: any) {
    console.error('[Regulatory Cron Error]:', err.message);
    return NextResponse.json(
      { success: false, job: 'regulatory', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

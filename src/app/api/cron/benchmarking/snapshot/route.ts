import { NextResponse } from 'next/server';
import { computeAndSnapshotReport } from '@/server/benchmarking/survey-store';

export const dynamic = 'force-dynamic';

/**
 * GET/POST /api/cron/benchmarking/snapshot
 * Executed quarterly via Vercel Cron (schedule: "0 6 1 1,4,7,10 *").
 * Pre-computes authenticated, privacy-suppressed benchmarking aggregates
 * and records a permanent immutable snapshot for public consumption.
 */
export async function GET(req: Request) {
  return handleSnapshot(req, 'cron');
}

export async function POST(req: Request) {
  return handleSnapshot(req, 'cron');
}

async function handleSnapshot(req: Request, runBy: string) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
  }

  const started = Date.now();
  try {
    const url = new URL(req.url);
    const yearParam = url.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const snapshot = await computeAndSnapshotReport(year, runBy);
    const elapsed = Date.now() - started;

    return NextResponse.json({
      ok: true,
      snapshotId: snapshot.id,
      year: snapshot.year,
      quarter: snapshot.quarter,
      totalResponses: snapshot.totalResponses,
      runAt: snapshot.runAt,
      runBy: snapshot.runBy,
      elapsed_ms: elapsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[BenchmarkingSnapshot:cron] Fatal Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

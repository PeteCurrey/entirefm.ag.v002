import { NextResponse } from 'next/server';
import { checkMissedOccurrences } from '@/server/ppm';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/ppm/check-missed
// Called by Vercel Cron at 03:15 daily.
// Scans for uncompleted maintenance occurrences whose window has passed,
// marking them as MISSED and creating audit/exception records.
// Protected by CRON_SECRET bearer token.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  // 1. Auth gate
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
  }

  const started = Date.now();
  console.log('[PPM:check-missed] Starting scheduled missed occurrence sweep', new Date().toISOString());

  try {
    const result = await checkMissedOccurrences({ type: 'CRON' });

    const elapsed = Date.now() - started;
    console.log(`[PPM:check-missed] Completed missed occurrence sweep in ${elapsed}ms: ${result.missedCount} occurrences flagged`);

    return NextResponse.json({
      ok: true,
      missed_count: result.missedCount,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[PPM:check-missed] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

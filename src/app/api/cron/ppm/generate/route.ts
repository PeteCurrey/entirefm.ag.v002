import { NextResponse } from 'next/server';
import { generatePPMWorkOrders } from '@/server/ppm';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/ppm/generate
// Called by Vercel Cron at 03:00 daily.
// Scans for maintenance occurrences entering their lead window (30 days) and
// generates PPM work orders with idempotent deduplication.
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
  console.log('[PPM:generate] Starting scheduled PPM work order generation', new Date().toISOString());

  try {
    const result = await generatePPMWorkOrders(30, { type: 'CRON' });

    const elapsed = Date.now() - started;
    console.log(
      `[PPM:generate] Completed PPM generation in ${elapsed}ms: ${result.generated} generated, ${result.skipped} skipped, ${result.errors.length} errors`
    );

    return NextResponse.json({
      ok: true,
      generated: result.generated,
      skipped: result.skipped,
      errors: result.errors,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[PPM:generate] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

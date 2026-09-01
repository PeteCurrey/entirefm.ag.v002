import { NextResponse } from 'next/server';
import { runChaseSweep } from '@/server/work/orchestrator/chasing-sweep';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/chasing/sweep
// Called by Vercel Cron on a recurring schedule (every 15 mins during active hours).
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
  console.log('[Chasing:sweep] Starting chasing and escalation sweep', new Date().toISOString());

  try {
    const sweepResult = await runChaseSweep(started);

    const elapsed = Date.now() - started;
    console.log(
      `[Chasing:sweep] Processed ${sweepResult.total_evaluated} work orders in ${elapsed}ms: ${sweepResult.chases_sent} chases sent, ${sweepResult.auto_reassigned} re-assigned, ${sweepResult.escalated_to_human} escalated`
    );

    return NextResponse.json({
      ok: true,
      ...sweepResult,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Chasing:sweep] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

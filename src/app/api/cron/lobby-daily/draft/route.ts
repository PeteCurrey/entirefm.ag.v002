import { NextResponse } from 'next/server';
import { runDailyDraftGeneration } from '@/server/lobby-daily/scheduler';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/lobby-daily/draft
// Called by Vercel Cron at 05:00 Europe/London on weekdays.
// Protected by CRON_SECRET bearer token.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
  }

  const started = Date.now();
  console.log('[LobbyDaily:draft] Starting edition draft', new Date().toISOString());

  try {
    const result = await runDailyDraftGeneration();
    const elapsed = Date.now() - started;

    console.log(`[LobbyDaily:draft] Draft complete in ${elapsed}ms`, result);

    return NextResponse.json({
      ok: true,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LobbyDaily:draft] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

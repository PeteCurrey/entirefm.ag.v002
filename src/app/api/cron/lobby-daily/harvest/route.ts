import { NextResponse } from 'next/server';
import { harvestCandidateStories } from '@/server/lobby-daily/candidate-harvester';
import { saveCandidates } from '@/server/lobby-daily/store';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/lobby-daily/harvest
// Called by Vercel Cron at 04:30 Europe/London on weekdays.
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
  console.log('[LobbyDaily:harvest] Starting candidate harvest', new Date().toISOString());

  try {
    const { candidates } = await harvestCandidateStories();
    await saveCandidates(candidates);

    const elapsed = Date.now() - started;
    console.log(`[LobbyDaily:harvest] Harvested ${candidates.length} candidates in ${elapsed}ms`);

    return NextResponse.json({
      ok: true,
      harvested: candidates.length,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LobbyDaily:harvest] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

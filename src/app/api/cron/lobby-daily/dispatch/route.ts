import { NextResponse } from 'next/server';
import { dispatchApprovedEdition, getLondonDateString } from '@/server/lobby-daily/scheduler';
import { getEditionBySlug, getLobbyDailySettings } from '@/server/lobby-daily/store';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/lobby-daily/dispatch
// Called by Vercel Cron at 06:45 Europe/London on weekdays.
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
  console.log('[LobbyDaily:dispatch] Starting scheduled dispatch check', new Date().toISOString());

  try {
    const settings = await getLobbyDailySettings();

    // Check kill switch
    if (settings.emergencyKillSwitch) {
      console.warn('[LobbyDaily:dispatch] Dispatch skipped: Kill-switch is active');
      return NextResponse.json({ ok: false, reason: 'Emergency kill-switch active' });
    }

    const todayDate = getLondonDateString();
    const todaySlug = `lobby-daily-${todayDate}`;
    const edition = await getEditionBySlug(todaySlug);

    if (!edition) {
      console.log(`[LobbyDaily:dispatch] No edition found for today (${todaySlug})`);
      return NextResponse.json({ ok: false, reason: `No edition found for ${todaySlug}` });
    }

    if (edition.status === 'SENT') {
      console.log(`[LobbyDaily:dispatch] Edition ${todaySlug} already sent`);
      return NextResponse.json({ ok: true, reason: 'Already sent', editionId: edition.id });
    }

    if (settings.manualApprovalRequired && edition.status !== 'SCHEDULED') {
      console.log(`[LobbyDaily:dispatch] Edition ${todaySlug} status is '${edition.status}' (must be SCHEDULED to dispatch)`);
      return NextResponse.json({
        ok: false,
        reason: `Edition is awaiting manual approval (current status: ${edition.status})`,
        editionId: edition.id,
      });
    }

    const dispatchResult = await dispatchApprovedEdition(edition.id);
    const elapsed = Date.now() - started;

    console.log(`[LobbyDaily:dispatch] Dispatch finished in ${elapsed}ms:`, dispatchResult);

    return NextResponse.json({
      ok: true,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
      editionId: edition.id,
      dispatchResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LobbyDaily:dispatch] Error during dispatch:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

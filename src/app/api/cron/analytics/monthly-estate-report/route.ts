import { NextResponse } from 'next/server';
import { processMonthlyEstateReports } from '@/server/analytics/monthly-estate-report-service';
import { sendAdminOperationalAlert } from '@/server/notifications/admin-alert';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/cron/analytics/monthly-estate-report
// Called by Vercel Cron on the 1st of each month at 07:00 UTC.
// Generates and dispatches executive estate performance reports to authorised
// client administrators and finance leads with strict idempotency.
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
  console.log('[MonthlyEstateReport:cron] Starting scheduled monthly estate report dispatch', new Date().toISOString());

  try {
    const result = await processMonthlyEstateReports({ period: 'LAST_MONTH' });

    if (result.errors.length > 0) {
      await sendAdminOperationalAlert({
        title: `Monthly Estate Report Autopilot Warning (${result.errors.length} errors)`,
        category: 'OPERATIONS',
        severity: 'WARNING',
        reason: `Monthly Estate Report generator encountered errors during scheduled cron: ${result.errors.map((e) => `${e.orgName}: ${e.error}`).join('; ')}`,
        actionUrl: '/admin/platform/clients',
        details: {
          processed: result.processed,
          skippedDormant: result.skippedDormant,
          sent: result.sent,
          duplicates: result.duplicates,
          errorCount: result.errors.length,
        },
      }).catch((e) => console.error('[MonthlyEstateReport:cron:alert_error]', e));
    }

    const elapsed = Date.now() - started;
    console.log(
      `[MonthlyEstateReport:cron] Completed monthly report dispatch in ${elapsed}ms: ${result.sent} sent, ${result.duplicates} duplicates, ${result.skippedDormant} dormant skipped, ${result.errors.length} errors`
    );

    return NextResponse.json({
      ok: true,
      processed: result.processed,
      skipped_dormant: result.skippedDormant,
      sent: result.sent,
      duplicates: result.duplicates,
      errors: result.errors,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[MonthlyEstateReport:cron] Fatal Error:', message);

    await sendAdminOperationalAlert({
      title: 'Monthly Estate Report Cron Fatal Failure',
      category: 'OPERATIONS',
      severity: 'CRITICAL',
      reason: `Scheduled monthly estate report cron encountered an unhandled exception: ${message}`,
      actionUrl: '/admin/platform/clients',
    }).catch((e) => console.error('[MonthlyEstateReport:cron:fatal_alert_error]', e));

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

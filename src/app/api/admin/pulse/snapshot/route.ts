import { NextResponse } from 'next/server';
import {
  computeAndSnapshotReport,
  getLatestSnapshot,
  getSnapshotHistory,
  getAdminCutCounts,
} from '@/server/benchmarking/survey-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/pulse/snapshot
 * Retrieves latest snapshot, snapshot history, and per-cut response counts for admin visibility.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const yearParam = url.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const [latestSnapshot, history, cutCounts] = await Promise.all([
      getLatestSnapshot(year),
      getSnapshotHistory(year),
      getAdminCutCounts(year),
    ]);

    return NextResponse.json({
      success: true,
      latestSnapshot,
      history,
      cutCounts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/pulse/snapshot
 * Manually initiates an immediate snapshot generation run.
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const yearParam = url.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const snapshot = await computeAndSnapshotReport(year, 'admin');

    return NextResponse.json({
      success: true,
      snapshot,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

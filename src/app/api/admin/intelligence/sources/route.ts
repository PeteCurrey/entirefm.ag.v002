import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { sourceRegistry } from '@/server/intelligence/source-registry';

export const dynamic = 'force-dynamic';

// GET — source registry health dashboard
export async function GET(_request: NextRequest) {
  const session = await getCurrentSession();

  try {
    requireAdminSession(session);
  } catch {
    return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
  }

  try {
    const sources = sourceRegistry.getAllSources();
    const healthSummary = {
      total: sources.length,
      live: sources.filter((s) => s.healthStatus === 'LIVE').length,
      credentialRequired: sources.filter((s) => s.healthStatus === 'CREDENTIAL_REQUIRED').length,
      degraded: sources.filter((s) => s.healthStatus === 'DEGRADED').length,
      failed: sources.filter((s) => s.healthStatus === 'FAILED').length,
      disabled: sources.filter((s) => s.healthStatus === 'DISABLED').length,
    };

    return NextResponse.json({ sources, healthSummary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Source registry unavailable' }, { status: 500 });
  }
}

import { runLiveIngestion } from '@/server/intelligence/intelligence-engine';

// POST — manual sync trigger running genuine live connector fetch
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();

  try {
    requireAdminSession(session);
  } catch {
    return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sourceId, action } = body;

    if (action === 'SYNC') {
      const report = await runLiveIngestion(sourceId || undefined);
      return NextResponse.json({
        message: `Live sync completed for ${sourceId || 'all sources'}. ${report.totalItemsCreated} items and ${report.totalTendersCreated} tenders updated.`,
        report,
        requestedBy: session!.personId,
        completedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Source action failed' }, { status: 500 });
  }
}

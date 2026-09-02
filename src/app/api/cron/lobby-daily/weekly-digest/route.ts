/**
 * GET /api/cron/lobby-daily/weekly-digest
 * ========================================
 * Weekly people-moves & FM intelligence digest compilation job.
 * Gathers the week's authentic appointments from canonical_intelligence_items.
 */

import { NextResponse } from 'next/server';
import { getPeopleMovesWire } from '@/server/wire/wire-store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
  }

  try {
    const items = await getPeopleMovesWire(25);

    const formattedDigest = items.map((item) => ({
      name: item.personName,
      role: item.newRole,
      company: item.organisationName,
      context: item.summary,
      source: item.sourceName,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
    }));

    return NextResponse.json({
      ok: true,
      compiledAt: new Date().toISOString(),
      itemCount: formattedDigest.length,
      digest: formattedDigest,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

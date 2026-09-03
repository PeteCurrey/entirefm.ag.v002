import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getLobbyHomepageCuration,
  saveLobbyHomepageCuration,
  checkCurationStaleness,
} from '@/lib/lobby/curation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    requireAdminSession(session);

    const curation = await getLobbyHomepageCuration();
    const staleness = checkCurationStaleness(curation.updatedAt);

    return NextResponse.json({
      success: true,
      curation,
      staleness,
    });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') || err.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    const admin = requireAdminSession(session);

    const body = await request.json().catch(() => ({}));
    const { slotUpdates } = body;

    if (!slotUpdates || typeof slotUpdates !== 'object') {
      return NextResponse.json({ error: 'slotUpdates object is required' }, { status: 400 });
    }

    const updated = await saveLobbyHomepageCuration(
      slotUpdates,
      admin.email || admin.personId || 'admin'
    );

    const staleness = checkCurationStaleness(updated.updatedAt);

    return NextResponse.json({
      success: true,
      curation: updated,
      staleness,
    });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') || err.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

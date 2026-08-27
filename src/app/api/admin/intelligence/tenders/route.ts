import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getEntireFMTenderRadar,
  updateTenderPipeline,
  type TenderBidStage,
} from '@/server/intelligence/intelligence-engine';

export const dynamic = 'force-dynamic';

/**
 * ADMIN-ONLY — EntireFM Tender Radar
 * ====================================
 * This endpoint MUST return 403 for any non-admin session.
 * Contractor sessions are NEVER permitted to access this endpoint.
 * Tender data is EntireFM internal business development intelligence only.
 */
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();

  // Hard admin-only gate — explicit 403 for any contractor, client, or unauthenticated session
  try {
    requireAdminSession(session);
  } catch {
    return NextResponse.json(
      { error: 'Forbidden — Tender Radar is an EntireFM internal tool only' },
      { status: 403 }
    );
  }

  const minScore = parseInt(request.nextUrl.searchParams.get('minScore') || '0', 10);
  const bidStage = request.nextUrl.searchParams.get('bidStage') as TenderBidStage | undefined;
  const service = request.nextUrl.searchParams.get('service') || undefined;
  const deadlineUrgency = request.nextUrl.searchParams.get('deadlineUrgency') || undefined;

  try {
    const tenders = await getEntireFMTenderRadar({
      minScore: isNaN(minScore) ? 0 : minScore,
      bidStage,
      service,
      deadlineUrgency: deadlineUrgency as any,
    });

    return NextResponse.json({ tenders, count: tenders.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Tender Radar unavailable' }, { status: 500 });
  }
}

// POST — update bid pipeline stage, assign owner, add internal note
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();

  try {
    requireAdminSession(session);
  } catch {
    return NextResponse.json(
      { error: 'Forbidden — Tender management is an EntireFM internal tool only' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { tenderId, bidStage, assignedTo, note } = body;

    if (!tenderId) return NextResponse.json({ error: 'tenderId is required' }, { status: 400 });

    const updated = await updateTenderPipeline(tenderId, {
      bidStage,
      assignedTo,
      note,
      addedBy: session!.personId,
    });

    return NextResponse.json({ tender: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update tender pipeline' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getReplacementReviewCandidates, createReplacementReview } from '@/server/asset-intelligence';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const siteId = url.searchParams.get('siteId') || undefined;

  const candidates = await getReplacementReviewCandidates({ siteId }, session);
  return NextResponse.json(candidates);
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const result = await createReplacementReview({
    assetId: body.assetId,
    triggerSignalId: body.triggerSignalId,
    evidenceSnapshot: body.evidenceSnapshot || {},
    aiRationale: body.aiRationale,
  }, session);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}

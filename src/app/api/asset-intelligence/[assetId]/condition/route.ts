import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { recordConditionAssessment, getConditionAssessmentHistory } from '@/server/asset-intelligence';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  const assessments = await getConditionAssessmentHistory(assetId);
  return NextResponse.json(assessments);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  const body = await request.json();

  const result = await recordConditionAssessment({
    assetId,
    condition: body.condition,
    operationalStatus: body.operationalStatus,
    observedDefects: body.observedDefects,
    observedNotes: body.observedNotes,
    recommendedAction: body.recommendedAction,
    nextReviewDate: body.nextReviewDate,
    confidence: body.confidence,
    aiAssisted: body.aiAssisted,
    aiExtractedObservations: body.aiExtractedObservations,
    assessedBy: session.personId,
  }, session);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json(result, { status: 201 });
}

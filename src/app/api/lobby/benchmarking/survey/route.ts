import { NextRequest, NextResponse } from 'next/server';
import { submitSurveyResponse, getMemberSurveyResponse } from '@/server/benchmarking/survey-store';
import { requireActiveMemberSession } from '@/server/member/member-session';

export async function GET(request: NextRequest) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status });
  }

  try {
    const response = await getMemberSurveyResponse(2026, session.memberId);
    return NextResponse.json({
      success: true,
      hasSubmitted: Boolean(response),
      response,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status });
  }

  try {
    const body = await request.json();
    const {
      salaryBand,
      teamSize,
      primarySector,
      biggestChallenge,
      technologyAdoptionLevel,
      sustainabilityTargetYear,
      region,
      rawResponses,
    } = body;

    if (!salaryBand || !teamSize || !primarySector || !biggestChallenge || !technologyAdoptionLevel) {
      return NextResponse.json({ error: 'All core survey questions are required' }, { status: 400 });
    }

    const submission = await submitSurveyResponse({
      year: 2026,
      memberId: session.memberId,
      salaryBand,
      teamSize,
      primarySector,
      biggestChallenge,
      technologyAdoptionLevel,
      sustainabilityTargetYear: sustainabilityTargetYear || '2030',
      region: region || null,
      rawResponses,
    });

    return NextResponse.json({
      success: true,
      submission,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

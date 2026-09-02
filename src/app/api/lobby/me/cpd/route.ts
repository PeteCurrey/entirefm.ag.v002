import { NextRequest, NextResponse } from 'next/server';
import { getMemberCpdSummary, logCpdActivity } from '@/server/cpd/cpd-store';
import { requireActiveMemberSession } from '@/server/member/member-session';

export async function GET(request: NextRequest) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status });
  }

  try {
    const summary = await getMemberCpdSummary(session.memberId);
    return NextResponse.json({ success: true, summary });
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
    const { activityType, title, description, durationMinutes, sourceRef } = body;

    if (!title || !durationMinutes) {
      return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
    }

    const entry = await logCpdActivity({
      memberId: session.memberId,
      activityType: activityType || 'external_course',
      title,
      description,
      durationMinutes: Number(durationMinutes),
      sourceRef,
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

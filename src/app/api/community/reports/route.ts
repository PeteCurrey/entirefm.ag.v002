import { NextResponse } from 'next/server';
import { createModerationReport } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to report content' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { reportedContentType, reportedContentId, reason, reporterNotes } = body;

    if (!reportedContentType || !reportedContentId || !reason) {
      return NextResponse.json({ error: 'Missing required report fields' }, { status: 400 });
    }

    const report = await createModerationReport({
      reporterMemberId: session.memberId,
      reportedContentType,
      reportedContentId,
      reason,
      reporterNotes,
    });

    return NextResponse.json({ success: true, caseId: report.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

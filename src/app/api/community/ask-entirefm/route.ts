import { NextResponse } from 'next/server';
import { submitAskEntireFM } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to submit questions to Ask EntireFM' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { question, context, topic, attributionPreference } = body;

    if (!question || question.trim().length < 10) {
      return NextResponse.json({ error: 'Question must be at least 10 characters' }, { status: 400 });
    }

    const submission = await submitAskEntireFM({
      memberId: member.id,
      memberName: member.display_name,
      memberHeadline: member.headline,
      question,
      context,
      topic: topic || 'General FM',
      attributionPreference: attributionPreference || 'full_name',
    });

    return NextResponse.json({ success: true, submissionId: submission.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

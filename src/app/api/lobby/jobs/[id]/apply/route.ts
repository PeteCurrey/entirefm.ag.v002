import { NextRequest, NextResponse } from 'next/server';
import { submitJobApplication } from '@/server/jobs/jobs-store';
import { requireActiveMemberSession } from '@/server/member/member-session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required to apply for jobs' }, { status });
  }

  const { id: jobId } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const { coverNote, cvUrl } = body;

    if (!coverNote || coverNote.trim().length < 10) {
      return NextResponse.json(
        { error: 'A short cover note (min 10 characters) is required' },
        { status: 400 }
      );
    }

    const application = await submitJobApplication(jobId, session.memberId, coverNote, cvUrl);

    return NextResponse.json({
      success: true,
      application,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error submitting application' }, { status: 400 });
  }
}

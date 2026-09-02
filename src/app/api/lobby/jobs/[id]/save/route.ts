import { NextRequest, NextResponse } from 'next/server';
import { toggleSaveJob } from '@/server/jobs/jobs-store';
import { requireActiveMemberSession } from '@/server/member/member-session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required to save jobs' }, { status });
  }

  const { id: jobId } = await params;

  try {
    const result = await toggleSaveJob(jobId, session.memberId);
    return NextResponse.json({
      success: true,
      saved: result.saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error saving job' }, { status: 400 });
  }
}

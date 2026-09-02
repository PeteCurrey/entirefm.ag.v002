import { NextResponse } from 'next/server';
import { getModerationCases, resolveModerationCase } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  // Restrict to staff/admin (founder demo ID for now)
  if (!session || session.memberId !== 'mem-00000000-0000-4000-8000-000000000001') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const cases = await getModerationCases(status);
  return NextResponse.json({ cases });
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session || session.memberId !== 'mem-00000000-0000-4000-8000-000000000001') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { caseId, action, internalNotes } = body;

    const resolved = await resolveModerationCase(caseId, action, session.memberId, internalNotes);
    return NextResponse.json({ case: resolved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error actioning report' }, { status: 400 });
  }
}

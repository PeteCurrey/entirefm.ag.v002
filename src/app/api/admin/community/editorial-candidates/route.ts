import { NextResponse } from 'next/server';
import { getEditorialCandidates, nominateEditorialCandidate } from '@/server/knowledge-graph/graph';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session || session.memberId !== 'mem-00000000-0000-4000-8000-000000000001') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const candidates = getEditorialCandidates();
  return NextResponse.json({ candidates });
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session || session.memberId !== 'mem-00000000-0000-4000-8000-000000000001') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const candidate = nominateEditorialCandidate({
      discussionSlug: body.discussionSlug,
      discussionTitle: body.discussionTitle,
      candidateType: body.candidateType,
      authorMemberName: body.authorMemberName,
      nominatedBy: session.displayName || 'Editor',
      editorNotes: body.editorNotes,
    });
    return NextResponse.json({ candidate }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error nominating candidate' }, { status: 400 });
  }
}

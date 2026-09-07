import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { deleteSavedToolOutput, getSavedToolOutput } from '@/server/workspace/workspace-store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  const output = await getSavedToolOutput(session.memberId, id);
  if (!output) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: output }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteSavedToolOutput(session.memberId, id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'DELETE_FAILED' }, { status: 400 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('[WORKSPACE_OUTPUT_DELETE_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'DELETE_FAILED' }, { status: 500 });
  }
}

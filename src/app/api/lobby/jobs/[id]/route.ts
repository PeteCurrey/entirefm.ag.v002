import { NextRequest, NextResponse } from 'next/server';
import { getJobListingBySlugOrId } from '@/server/jobs/jobs-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = getMemberSessionFromRequest(request);
    const job = await getJobListingBySlugOrId(id, session?.memberId);

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

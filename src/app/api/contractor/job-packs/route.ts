import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listJobPacks } from '@/server/contractor/job-pack-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get('orgId') || session.orgId;
  const status = request.nextUrl.searchParams.get('status') || 'ALL';
  const searchQuery = request.nextUrl.searchParams.get('q') || undefined;

  try {
    const list = await listJobPacks(orgId, session, { status, searchQuery });
    return NextResponse.json({ jobPacks: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Access denied' }, { status: 403 });
  }
}

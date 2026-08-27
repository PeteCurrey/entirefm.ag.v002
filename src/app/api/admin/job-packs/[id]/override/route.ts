import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { applyAuthorisedOverride } from '@/server/contractor/job-pack-engine';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'FORBIDDEN: EntireFM staff authentication required' }, { status: 403 });
  }

  const { id } = await params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { reason, scope } = body;
  if (!reason) {
    return NextResponse.json({ error: 'Override reason is required' }, { status: 400 });
  }

  const result = await applyAuthorisedOverride(
    id,
    {
      reason,
      scope: scope || 'Exceptional pre-attendance clearance',
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Override failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

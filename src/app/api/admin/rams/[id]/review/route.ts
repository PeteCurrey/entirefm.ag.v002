import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { reviewRamsByEntirefm } from '@/server/contractor/rams-service';

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

  const { decision, generalNotes, sectionComments } = body;
  if (!decision) {
    return NextResponse.json({ error: 'Decision is required' }, { status: 400 });
  }

  const result = await reviewRamsByEntirefm(
    id,
    {
      decision,
      generalNotes,
      sectionComments,
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Review failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { draftServiceReportNarrative } from '@/server/contractor/digital-forms-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { notes } = body;
  if (!notes) {
    return NextResponse.json({ error: 'Raw notes are required' }, { status: 400 });
  }

  const narrative = draftServiceReportNarrative(notes);
  return NextResponse.json({ success: true, narrative });
}

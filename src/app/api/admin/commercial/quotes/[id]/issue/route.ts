import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { issueQuoteToClient } from '@/server/commercial';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await issueQuoteToClient(id, session);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to issue quote' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Quote issued to client' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

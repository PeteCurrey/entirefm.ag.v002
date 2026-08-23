import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { createQuoteRevision } from '@/server/commercial';

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
    const body = await request.json();
    const { changeReason } = body;
    if (!changeReason) {
      return NextResponse.json({ error: 'changeReason is required' }, { status: 400 });
    }

    const { revisedQuote, error } = await createQuoteRevision(id, changeReason, session);
    if (error || !revisedQuote) {
      return NextResponse.json({ error: error || 'Failed to create revision' }, { status: 400 });
    }

    return NextResponse.json({ revisedQuote, message: 'New quote version created' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

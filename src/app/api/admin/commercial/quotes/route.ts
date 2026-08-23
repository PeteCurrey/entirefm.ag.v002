import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listQuotes, createQuoteDraftFromFieldScope } from '@/server/commercial';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  const quotes = await listQuotes(status);
  return NextResponse.json({ data: quotes });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fieldScopeId } = body;
    if (!fieldScopeId) {
      return NextResponse.json({ error: 'fieldScopeId is required' }, { status: 400 });
    }

    const { quote, exceptions, error } = await createQuoteDraftFromFieldScope(fieldScopeId, session);
    if (error || !quote) {
      return NextResponse.json({ error: error || 'Failed to create quote draft' }, { status: 400 });
    }

    return NextResponse.json({ quote, exceptions }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listQuotes, createQuoteDirect, createQuoteDraftFromFieldScope } from '@/server/commercial';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const clientAccountId = searchParams.get('clientAccountId') || undefined;
  const siteId = searchParams.get('siteId') || undefined;

  const quotes = await listQuotes({ status, clientAccountId, siteId });
  return NextResponse.json({ success: true, data: quotes });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. AI Field Scope creation flow
    if (body.fieldScopeId) {
      const { quote, exceptions, error } = await createQuoteDraftFromFieldScope(body.fieldScopeId, session);
      if (error || !quote) {
        return NextResponse.json({ error: error || 'Failed to create quote draft' }, { status: 400 });
      }
      return NextResponse.json({ success: true, quote, exceptions }, { status: 201 });
    }

    // 2. Direct manual quote creation flow
    const { client_account_id, site_id, contract_id, title, description, lines } = body;

    if (!title) {
      return NextResponse.json({ error: 'Quote title is required' }, { status: 400 });
    }

    const quoteLines = Array.isArray(lines) && lines.length > 0
      ? lines
      : [
          {
            line_type: 'LABOUR',
            description: title || 'Standard Service Delivery',
            quantity: 1,
            unit_cost_gbp: Number(body.estimated_cost_gbp) || 120.0,
            markup_pct: 25.0,
            unit_price_gbp: Number(body.estimated_sell_gbp) || 150.0,
          },
        ];

    const { quote, error } = await createQuoteDirect({
      client_account_id,
      site_id,
      contract_id,
      title,
      description: description || title,
      lines: quoteLines,
      source_type: 'MANUAL',
      session,
    });

    if (error || !quote) {
      return NextResponse.json({ error: error || 'Failed to create quote' }, { status: 400 });
    }

    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

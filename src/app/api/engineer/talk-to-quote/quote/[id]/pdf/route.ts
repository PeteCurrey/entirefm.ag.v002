/**
 * TALK TO QUOTE — BRANDED PDF REPORT GENERATION ENDPOINT
 * ======================================================
 * Returns high-fidelity HTML / printable PDF document for commercial quotation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { buildQuoteHtml } from '@/server/field-intelligence/pdf';
import { QuoteLine } from '@/server/commercial';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data: quotes, error: qErr } = await dbQuery<any[]>(
      `quotes?id=eq.${encodeURIComponent(id)}&select=*,site:sites(id,name,address_line1,city,postcode),client:organisations!client_account_id(id,name),work_order:work_orders(id,work_order_number,asset:assets(id,name,asset_reference))&limit=1`
    );

    if (qErr || !quotes || quotes.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const quote = quotes[0];

    const { data: lines } = await dbQuery<QuoteLine[]>(
      `quote_lines?quote_id=eq.${encodeURIComponent(id)}&order=created_at.asc&select=*`
    );

    const assetRef = quote.work_order?.asset?.asset_reference || quote.site?.name ? 'Site Asset' : '';
    const assetName = quote.work_order?.asset?.name || '';

    const html = buildQuoteHtml({
      quote: {
        ...quote,
        lines: lines || [],
      },
      clientName: quote.client?.name || 'EntireCAFM Client',
      siteName: quote.site?.name || 'Commercial Site',
      siteAddress: quote.site?.address_line1 ? `${quote.site.address_line1}, ${quote.site.city || ''} ${quote.site.postcode || ''}`.trim() : undefined,
      assetReference: assetRef,
      assetName: assetName,
      engineerName: session.name,
    });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

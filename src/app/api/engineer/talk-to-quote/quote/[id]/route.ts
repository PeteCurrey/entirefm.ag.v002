/**
 * TALK TO QUOTE — QUOTE DETAIL & REVISION ENDPOINT
 * ================================================
 * GET: Retrieves quote details, lines, and linked asset/site context.
 * PATCH: Applies engineer adjustments/overrides and creates immutable version trail.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { roundMoney, applyTax, Quote, QuoteLine } from '@/server/commercial';

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
      `quotes?id=eq.${encodeURIComponent(id)}&select=*,site:sites(id,name,address_line1,city,postcode),client:organisations!client_account_id(id,name)&limit=1`
    );

    if (qErr || !quotes || quotes.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const quote = quotes[0];

    // Fetch lines
    const { data: lines } = await dbQuery<QuoteLine[]>(
      `quote_lines?quote_id=eq.${encodeURIComponent(id)}&order=created_at.asc&select=*`
    );

    // Fetch exceptions
    const { data: exceptions } = await dbQuery<any[]>(
      `commercial_exceptions?object_id=eq.${encodeURIComponent(id)}&select=*`
    );

    return NextResponse.json({
      success: true,
      quote: {
        ...quote,
        lines: lines || [],
        exceptions: exceptions || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await params;

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { lines, changeReason = 'Engineer manual adjustment' } = body;

  try {
    const { data: quotes } = await dbQuery<Quote[]>(`quotes?id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    const currentQuote = quotes[0];

    // Recalculate totals if lines updated
    if (lines && Array.isArray(lines)) {
      // 1. Delete old lines
      await dbQuery(`quote_lines?quote_id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      // 2. Insert new lines
      for (const l of lines) {
        await dbQuery('quote_lines', {
          method: 'POST',
          body: {
            id: crypto.randomUUID(),
            quote_id: id,
            line_type: l.line_type,
            description: l.description,
            quantity: l.quantity,
            unit_cost_gbp: l.unit_cost_gbp,
            unit_price_gbp: l.unit_price_gbp,
            tax_rate_percent: l.tax_rate_percent || 20.0,
            total_gbp: l.total_gbp,
            total_cost_gbp: l.total_cost_gbp,
            is_missing_rate: l.is_missing_rate || false,
            pricing_notes: l.pricing_notes,
          },
        });
      }

      const subtotal = roundMoney(lines.reduce((sum: number, l: any) => sum + (Number(l.total_gbp) || 0), 0));
      const { taxGbp, grossGbp } = applyTax(subtotal, 20.0);
      const totalCost = roundMoney(lines.reduce((sum: number, l: any) => sum + (Number(l.total_cost_gbp) || 0), 0));
      const marginGbp = roundMoney(subtotal - totalCost);
      const marginPct = subtotal > 0 ? roundMoney((marginGbp / subtotal) * 100) : 0;
      const nextVersion = (currentQuote.version || 1) + 1;

      // Update quote header
      await dbQuery(`quotes?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: {
          version: nextVersion,
          subtotal_gbp: subtotal,
          tax_amount_gbp: taxGbp,
          total_amount_gbp: grossGbp,
          expected_cost_gbp: totalCost,
          expected_margin_gbp: marginGbp,
          expected_margin_pct: marginPct,
          updated_at: new Date().toISOString(),
        },
      });

      // Snapshot version
      await dbQuery('quote_versions', {
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          quote_id: id,
          version: nextVersion,
          snapshot_json: { ...currentQuote, lines, version: nextVersion, subtotal_gbp: subtotal, total_amount_gbp: grossGbp },
          change_reason: changeReason,
          created_by_person_id: session.personId,
        },
      });

      await recordAuditEvent({
        event_type: 'QUOTE_REVISED',
        object_type: 'quotes',
        object_id: id,
        actor_id: session.personId,
        after_state: { version: nextVersion, subtotal, gross: grossGbp, changeReason },
      });

      return NextResponse.json({
        success: true,
        version: nextVersion,
        subtotal,
        taxAmount: taxGbp,
        totalGross: grossGbp,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * TALK TO QUOTE — QUOTE DRAFT CREATION ENDPOINT
 * =============================================
 * Converts verified Field Intelligence result / session into a real EntireCAFM
 * Quote record with line items, versions, and audit trails.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import {
  generateQuoteNumber,
  roundMoney,
  applyTax,
  Quote,
  QuoteLine,
} from '@/server/commercial';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sessionId, fieldScope, overrides = {} } = body;

  try {
    // 1. If sessionId provided, fetch session data
    let sessionData: any = null;
    if (sessionId) {
      const { data } = await dbQuery<any[]>(
        `talk_to_quote_sessions?id=eq.${encodeURIComponent(sessionId)}&limit=1`
      );
      if (data && data.length > 0) sessionData = data[0];
    }

    const extraction = sessionData?.ai_extraction_json || fieldScope?.understanding || {};
    const enrichment = sessionData?.ai_enrichment_json || fieldScope || {};

    const clientAccountId = extraction.clientAccountId || session.orgId;
    const siteId = extraction.siteId || sessionData?.site_id || null;
    const assetId = extraction.assetId || sessionData?.asset_id || null;
    const workOrderId = sessionData?.work_order_id || null;

    // 2. Build lines from enrichment + overrides
    const lines: QuoteLine[] = [];
    const quoteId = crypto.randomUUID();
    const quoteNumber = generateQuoteNumber();

    // Labour line
    const labourEst = enrichment.labour || {};
    const hours = Number(overrides.labourHours ?? labourEst.estimatedHours ?? 2.5);
    const engineersCount = Number(overrides.engineersCount ?? labourEst.engineersCount ?? 1);
    const hourlyRate = Number(labourEst.hourlyRateGbp || 65.0);
    const labourTotal = roundMoney(hours * hourlyRate * engineersCount + (labourEst.calloutRateGbp || 0));

    lines.push({
      line_type: 'LABOUR',
      description: `Labour: ${engineersCount} ${labourEst.trade || 'Maintenance'} Engineer(s) (${hours}h) — ${extraction.faultDescription || 'Remedial works'}`,
      quantity: hours * engineersCount,
      unit_cost_gbp: roundMoney(hourlyRate * 0.65),
      unit_price_gbp: hourlyRate,
      tax_rate_percent: 20.0,
      total_gbp: labourTotal,
      total_cost_gbp: roundMoney(hourlyRate * 0.65 * hours * engineersCount),
      pricing_notes: labourEst.basis || 'Standard trade rate card',
    });

    // Material lines
    const parts = enrichment.parts || [];
    for (const p of parts) {
      if (overrides.excludedPartIds && overrides.excludedPartIds.includes(p.id)) continue;
      const qty = Number(p.quantity) || 1;
      const unitSell = Number(p.unitSellGbp || p.unitPriceGbp || 0);
      const unitCost = Number(p.unitCostGbp || 0);
      const lineTotal = roundMoney(unitSell * qty);

      lines.push({
        line_type: 'MATERIALS',
        description: `Material: ${p.description}`,
        quantity: qty,
        unit_cost_gbp: unitCost,
        unit_price_gbp: unitSell,
        tax_rate_percent: 20.0,
        total_gbp: lineTotal,
        total_cost_gbp: roundMoney(unitCost * qty),
        is_missing_rate: !p.isFromCatalogue && unitSell === 0,
        is_stale_price: !!p.stalePriceWarning,
        pricing_notes: p.isFromCatalogue ? 'Supplier price catalogue verified' : 'Requires supplier RFQ confirmation',
      });
    }

    // Additional cost lines
    const addCosts = enrichment.additionalCosts || [];
    for (const c of addCosts) {
      if (c.status === 'INCLUDED' && c.totalGbp === 0) continue;
      if (overrides.excludedCostIds && overrides.excludedCostIds.includes(c.id)) continue;
      lines.push({
        line_type: 'PLANT',
        description: `${c.category}: ${c.description}`,
        quantity: c.quantity || 1,
        unit_cost_gbp: roundMoney(c.unitPriceGbp * 0.5),
        unit_price_gbp: c.unitPriceGbp,
        tax_rate_percent: 20.0,
        total_gbp: c.totalGbp,
        total_cost_gbp: roundMoney(c.unitPriceGbp * 0.5 * (c.quantity || 1)),
        pricing_notes: c.justification,
      });
    }

    // 3. Totals
    const subtotal = roundMoney(lines.reduce((sum, l) => sum + l.total_gbp, 0));
    const { taxGbp, grossGbp } = applyTax(subtotal, 20.0);
    const totalCost = roundMoney(lines.reduce((sum, l) => sum + (l.total_cost_gbp || 0), 0));
    const marginGbp = roundMoney(subtotal - totalCost);
    const marginPct = subtotal > 0 ? roundMoney((marginGbp / subtotal) * 100) : 0;

    const hasMissingPrice = lines.some((l) => l.is_missing_rate);

    const quoteRecord: Partial<Quote> = {
      id: quoteId,
      quote_number: quoteNumber,
      version: 1,
      work_order_id: workOrderId,
      client_account_id: clientAccountId,
      site_id: siteId,
      status: 'DRAFT',
      internal_status: hasMissingPrice ? 'DRAFT' : 'INTERNAL_REVIEW',
      scope_description: extraction.faultDescription
        ? `Remedial works for ${extraction.assetName || 'Equipment'}: ${extraction.faultDescription}`
        : 'Remedial works captured via Talk-to-Quote',
      subtotal_gbp: subtotal,
      tax_amount_gbp: taxGbp,
      total_amount_gbp: grossGbp,
      expected_cost_gbp: totalCost,
      expected_margin_gbp: marginGbp,
      expected_margin_pct: marginPct,
      validity_days: 30,
      client_po_required: subtotal > 500,
    };

    // 4. Save Quote
    await dbQuery('quotes', {
      method: 'POST',
      body: quoteRecord,
    });

    // Save lines
    for (const l of lines) {
      await dbQuery('quote_lines', {
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          quote_id: quoteId,
          line_type: l.line_type,
          description: l.description,
          quantity: l.quantity,
          unit_cost_gbp: l.unit_cost_gbp,
          unit_price_gbp: l.unit_price_gbp,
          tax_rate_percent: l.tax_rate_percent,
          total_gbp: l.total_gbp,
          total_cost_gbp: l.total_cost_gbp,
          is_missing_rate: l.is_missing_rate || false,
          is_stale_price: l.is_stale_price || false,
          pricing_notes: l.pricing_notes,
        },
      });
    }

    // Save initial version
    await dbQuery('quote_versions', {
      method: 'POST',
      body: {
        id: crypto.randomUUID(),
        quote_id: quoteId,
        version: 1,
        snapshot_json: { ...quoteRecord, lines },
        change_reason: 'Generated directly by Field Engineer via Talk-to-Quote Voice Intelligence',
        created_by_person_id: session.personId,
      },
    });

    // Link back to session
    if (sessionId) {
      await dbQuery(`talk_to_quote_sessions?id=eq.${encodeURIComponent(sessionId)}`, {
        method: 'PATCH',
        body: {
          quote_id: quoteId,
          status: 'QUOTE_CREATED',
          updated_at: new Date().toISOString(),
        },
      });
    }

    // Audit log
    await recordAuditEvent({
      event_type: 'TALK_TO_QUOTE_CREATED',
      object_type: 'quotes',
      object_id: quoteId,
      actor_id: session.personId,
      after_state: { quoteNumber, subtotal, totalGross: grossGbp, sessionId },
    });

    return NextResponse.json({
      success: true,
      quoteId,
      quoteNumber,
      subtotal,
      taxAmount: taxGbp,
      totalGross: grossGbp,
      status: quoteRecord.internal_status,
      hasMissingPrice,
    });
  } catch (err: any) {
    console.error('[QUOTE_CREATION_EXCEPTION]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create quote record' },
      { status: 500 }
    );
  }
}

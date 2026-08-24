/**
 * GET /api/admin/finance/metrics
 * Canonical financial metrics endpoint (Phase 0H-R)
 *
 * Query params:
 *   metric        — specific MetricId (optional; returns all if omitted)
 *   client_org_id — filter by client organisation
 *   contract_id   — filter by contract
 *   property_id   — filter by property
 *   from          — ISO date string (start)
 *   to            — ISO date string (end)
 *   explain       — if 'true', include metric definitions in response
 */

import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getAllMetrics,
  getMetric,
  getAgeingMetric,
  listMetricDefinitions,
  type MetricId,
  type MetricFilterContext,
} from '@/server/finance/metrics';

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (
      !session.permissions.includes('finance:read') &&
      !session.permissions.includes('finance:view') &&
      !session.permissions.includes('finance:reporting')
    ) {
      return NextResponse.json({ error: 'Forbidden: finance:read required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const metricId = searchParams.get('metric') as MetricId | null;
    const explain = searchParams.get('explain') === 'true';

    const ctx: MetricFilterContext = {
      client_org_id: searchParams.get('client_org_id') ?? undefined,
      contract_id: searchParams.get('contract_id') ?? undefined,
      property_id: searchParams.get('property_id') ?? undefined,
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
    };

    if (metricId) {
      // Single metric
      if (metricId === 'ACCOUNTS_RECEIVABLE' || metricId === 'SUPPLIER_PAYABLES') {
        const result = await getAgeingMetric(metricId, ctx);
        return NextResponse.json({
          metric: result,
          ...(explain ? { definition: listMetricDefinitions().find(d => d.id === metricId) } : {}),
        });
      }
      const result = await getMetric(metricId, ctx);
      return NextResponse.json({
        metric: result,
        ...(explain ? { definition: listMetricDefinitions().find(d => d.id === metricId) } : {}),
      });
    }

    // All GBP metrics + both ageing metrics
    const [allGbp, ar, sp] = await Promise.all([
      getAllMetrics(ctx),
      getAgeingMetric('ACCOUNTS_RECEIVABLE', ctx),
      getAgeingMetric('SUPPLIER_PAYABLES', ctx),
    ]);

    return NextResponse.json({
      metrics: allGbp,
      ageing: { ACCOUNTS_RECEIVABLE: ar, SUPPLIER_PAYABLES: sp },
      computed_at: new Date().toISOString(),
      filter_context: ctx,
      ...(explain ? { definitions: listMetricDefinitions() } : {}),
    });
  } catch (err: any) {
    console.error('[finance/metrics] GET error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

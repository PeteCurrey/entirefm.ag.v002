import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listTolerancePolicies } from '@/server/finance';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const policies = await listTolerancePolicies();
  return NextResponse.json(policies);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:admin'))
    return NextResponse.json({ error: 'Forbidden — finance:admin required' }, { status: 403 });

  const body = await req.json();
  const { data } = await dbQuery<any[]>('finance_tolerance_policies', {
    method: 'POST',
    body: {
      policy_name: body.policyName,
      is_default: body.isDefault || false,
      client_account_id: body.clientAccountId,
      supplier_org_id: body.supplierOrgId,
      contract_id: body.contractId,
      tolerance_absolute_gbp: body.toleranceAbsoluteGbp,
      tolerance_pct: body.tolerancePct,
      auto_accept_below_absolute: body.autoAcceptBelowAbsolute !== false,
      require_review_above_pct: body.requireReviewAbovePct !== false,
      exception_above_pct: body.exceptionAbovePct || 5.00,
      tax_rounding_tolerance_gbp: body.taxRoundingToleranceGbp || 0.02,
      created_by_id: session.personId,
    },
    headers: { Prefer: 'return=representation' },
  });
  return NextResponse.json(data?.[0] || {}, { status: 201 });
}

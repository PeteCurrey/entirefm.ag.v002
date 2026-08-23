import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { calculateCommercialWip } from '@/server/commercial';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Aggregate WIP metrics across active work orders
  const { data: wos } = await dbQuery<any[]>('work_orders?select=*');
  const { data: commitments } = await dbQuery<any[]>('cost_commitments?select=*');
  const { data: quotes } = await dbQuery<any[]>('quotes?status=eq.APPROVED&select=*');

  const approvedRevenue = (quotes || []).reduce((sum, q) => sum + (Number(q.subtotal_gbp) || 0), 0);
  const committedCost = (commitments || []).reduce((sum, c) => sum + (Number(c.committed_amount_gbp) || 0), 0);
  const actualCost = (commitments || []).reduce((sum, c) => sum + (Number(c.actual_invoiced_gbp) || 0), 0);

  const summary = calculateCommercialWip({
    approvedRevenue,
    committedCost,
    actualCost,
    hasClientPo: true,
  });

  return NextResponse.json({
    summary,
    workOrdersCount: wos?.length || 0,
    commitmentsCount: commitments?.length || 0,
  });
}

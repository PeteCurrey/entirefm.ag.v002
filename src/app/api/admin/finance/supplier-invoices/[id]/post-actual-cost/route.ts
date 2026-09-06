import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { postActualCost } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:approve') && !hasPermission(session, 'finance:write')) {
    return NextResponse.json({ error: 'Forbidden — finance:approve or finance:write permission required' }, { status: 403 });
  }

  try {
    const result = await postActualCost(id, session);
    return NextResponse.json({
      ok: true,
      invoiceId: id,
      workOrdersUpdated: result.workOrdersUpdated,
      commitmentsConsumed: result.commitmentsConsumed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to post actual cost' }, { status: 400 });
  }
}

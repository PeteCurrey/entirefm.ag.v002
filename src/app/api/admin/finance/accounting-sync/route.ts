import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { syncToAccounting, getAccountingAdapter } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adapter = getAccountingAdapter();
  return NextResponse.json({
    provider: adapter.provider,
    isConfigured: adapter.isConfigured,
    status: adapter.isConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
  });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.entityType || !body.entityId)
    return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 });

  const result = await syncToAccounting({
    entityType: body.entityType,
    entityId: body.entityId,
  }, session);

  return NextResponse.json(result);
}

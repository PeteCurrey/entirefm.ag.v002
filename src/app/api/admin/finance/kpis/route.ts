import { NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { getFinanceKPISummary } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const kpis = await getFinanceKPISummary();
  return NextResponse.json(kpis);
}

import { NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession, hasPermission } from '@/server/identity';
import { evaluateEnterpriseSignals } from '@/server/ceo-command';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { requireAdminSession(session); } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
  if (!hasPermission(session, 'enterprise_intelligence:view' as any)) {
    return NextResponse.json({ error: 'enterprise_intelligence:view permission required' }, { status: 403 });
  }
  const signals = await evaluateEnterpriseSignals();
  return NextResponse.json({ success: true, signals });
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { getComplianceKPIs } from '@/server/compliance';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    requireAdminSession(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('siteId') || undefined;
  const clientId = searchParams.get('clientId') || undefined;

  const kpis = await getComplianceKPIs(siteId, clientId, session);
  return NextResponse.json({ success: true, kpis });
}

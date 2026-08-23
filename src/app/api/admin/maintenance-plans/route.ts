import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listMaintenancePlans, createMaintenancePlan } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const plans = await listMaintenancePlans({
    clientAccountId: searchParams.get('clientAccountId') || undefined,
    siteId: searchParams.get('siteId') || undefined,
    status: searchParams.get('status') || undefined,
  });
  return NextResponse.json({ plans });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.clientAccountId || !body.name || !body.effectiveFrom) {
    return NextResponse.json({ error: 'clientAccountId, name, effectiveFrom required' }, { status: 400 });
  }
  const result = await createMaintenancePlan(body, session);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ id: result.id, planNumber: result.planNumber });
}

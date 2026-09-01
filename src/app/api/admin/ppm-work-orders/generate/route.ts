import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { generatePPMWorkOrders } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { /* leadDays optional */ }
  const result = await generatePPMWorkOrders(body.leadDays ?? 30, { id: session.personId, type: 'HUMAN' });
  return NextResponse.json({ generated: result.generated, skipped: result.skipped, errors: result.errors });
}

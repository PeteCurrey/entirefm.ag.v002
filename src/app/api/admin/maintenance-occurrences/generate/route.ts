import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { generateOccurrences } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.planId) return NextResponse.json({ error: 'planId required' }, { status: 400 });
  const result = await generateOccurrences(body.planId, body.horizonMonths ?? 12, session);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ created: result.created, skipped: result.skipped });
}

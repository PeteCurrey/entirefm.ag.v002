import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { approvePlan } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { id } = await params;
  let body: any = {};
  try { body = await request.json(); } catch { /* notes optional */ }
  const result = await approvePlan(id, body.notes || '', session);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: result.success });
}

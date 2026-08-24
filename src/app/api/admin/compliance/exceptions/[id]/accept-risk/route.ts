import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { acceptRisk } from '@/server/compliance';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    requireAdminSession(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const res = await acceptRisk(id, body.reason || 'Authorised risk acceptance', session);

  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 403 });
  }

  return NextResponse.json(res);
}

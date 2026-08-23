import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { issueClientInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:billing'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await issueClientInvoice(id, session);
  return NextResponse.json({ ok: true, invoiceId: id });
}

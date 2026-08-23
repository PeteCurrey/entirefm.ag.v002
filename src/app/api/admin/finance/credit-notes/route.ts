import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listCreditNotes, createCreditNote } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const notes = await listCreditNotes({
    type: (searchParams.get('type') as 'SUPPLIER' | 'CLIENT') || undefined,
    status: searchParams.get('status') || undefined,
  });
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:admin'))
    return NextResponse.json({ error: 'Forbidden — finance:admin required' }, { status: 403 });

  const body = await req.json();
  if (!body.type || !body.reason || !body.lines || !Array.isArray(body.lines))
    return NextResponse.json({ error: 'type, reason, and lines are required' }, { status: 400 });

  const creditNoteId = await createCreditNote({
    type: body.type,
    supplierInvoiceId: body.supplierInvoiceId,
    supplierOrgId: body.supplierOrgId,
    clientInvoiceId: body.clientInvoiceId,
    clientAccountId: body.clientAccountId,
    reason: body.reason,
    lines: body.lines,
  }, session);

  return NextResponse.json({ creditNoteId }, { status: 201 });
}

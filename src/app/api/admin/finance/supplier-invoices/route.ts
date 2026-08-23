import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { listSupplierInvoices, ingestSupplierInvoice } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const processingStatus = searchParams.get('processingStatus') || undefined;
  const matchStatus = searchParams.get('matchStatus') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const invoices = await listSupplierInvoices({ processingStatus, matchStatus, limit, offset });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:write'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const result = await ingestSupplierInvoice({
    supplierOrgId: body.supplierOrgId,
    documentPath: body.documentPath,
    documentChecksum: body.documentChecksum,
    documentMimeType: body.documentMimeType,
    documentSizeBytes: body.documentSizeBytes,
    ingestChannel: body.ingestChannel || 'MANUAL_UPLOAD',
    mailboxIntakeId: body.mailboxIntakeId,
  }, session);

  return NextResponse.json(result, { status: 201 });
}

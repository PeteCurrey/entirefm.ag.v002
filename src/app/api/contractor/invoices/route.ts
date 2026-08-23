/**
 * CONTRACTOR PORTAL — SUPPLIER INVOICE SUBMISSION
 * Contractors may submit invoices against their authorised POs.
 * They may NOT see: client prices, EntireFM margin, other suppliers' data.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { ingestSupplierInvoice, detectDuplicateInvoice } from '@/server/finance';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'supply_chain:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Contractors see only their own submitted invoices
  const { data } = await dbQuery<any[]>(
    `supplier_invoices?supplier_org_id=eq.${encodeURIComponent(session.orgId)}&select=id,invoice_ref,issue_date,due_date,total_amount_gbp,processing_status,match_status,payment_status,created_at&order=created_at.desc&limit=50`
  );
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'supply_chain:read'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.purchaseOrderId)
    return NextResponse.json({ error: 'purchaseOrderId is required' }, { status: 400 });

  // Verify PO belongs to this contractor
  const { data: pos } = await dbQuery<any[]>(
    `purchase_orders?id=eq.${encodeURIComponent(body.purchaseOrderId)}&provider_org_id=eq.${encodeURIComponent(session.orgId)}&select=id,amount_net_gbp,status`
  );
  if (!pos || pos.length === 0)
    return NextResponse.json({ error: 'Purchase Order not found or not authorised' }, { status: 404 });

  const po = pos[0];

  // Warn if invoice total exceeds remaining PO value (still allow submission)
  let warnings: string[] = [];
  if (body.totalAmountGbp && po.amount_net_gbp) {
    if (parseFloat(body.totalAmountGbp) > parseFloat(po.amount_net_gbp)) {
      warnings.push(`Invoice total £${body.totalAmountGbp} exceeds remaining PO value £${po.amount_net_gbp}. This will be flagged for review.`);
    }
  }

  // Duplicate check before ingesting
  const dupCheck = await detectDuplicateInvoice({
    supplierOrgId: session.orgId,
    invoiceRef: body.invoiceRef || 'UNKNOWN',
    issueDate: body.issueDate || new Date().toISOString().slice(0, 10),
    totalGbp: parseFloat(body.totalAmountGbp || '0'),
    fileChecksum: body.fileChecksum,
  });

  if (dupCheck.isDuplicate) {
    return NextResponse.json({
      error: 'POSSIBLE_DUPLICATE',
      message: `A possible duplicate invoice has been detected (basis: ${dupCheck.basis}). Please review before resubmitting.`,
      matchedInvoiceId: dupCheck.matchedInvoiceId,
      warnings,
    }, { status: 409 });
  }

  const result = await ingestSupplierInvoice({
    supplierOrgId: session.orgId,
    documentPath: body.documentPath,
    documentChecksum: body.fileChecksum,
    documentMimeType: body.documentMimeType,
    documentSizeBytes: body.documentSizeBytes,
    ingestChannel: 'CONTRACTOR_PORTAL',
  }, session);

  return NextResponse.json({ ...result, warnings }, { status: 201 });
}

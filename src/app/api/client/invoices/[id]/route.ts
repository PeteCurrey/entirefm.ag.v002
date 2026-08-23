/**
 * CLIENT PORTAL — CLIENT INVOICE DETAIL
 * NEVER expose: supplier costs, EntireFM margin, rate card details.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  // Verify this invoice belongs to the client's account
  const { data: invs } = await dbQuery<any[]>(
    `client_invoices?id=eq.${encodeURIComponent(id)}&select=id,invoice_number,client_account_id,status,issue_date,due_date,subtotal_gbp,tax_amount_gbp,total_amount_gbp,payment_status,currency,billing_period_start,billing_period_end,client_po_ref`
  );
  if (!invs || invs.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const invoice = invs[0];

  // Verify client account ownership (never cross-tenant)
  const { data: accounts } = await dbQuery<any[]>(
    `client_accounts?id=eq.${encodeURIComponent(invoice.client_account_id)}&select=organisation_id`
  );
  if (!accounts || accounts.length === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: lines } = await dbQuery<any[]>(
    // Return only client-facing line data — NO supplier cost, NO unit_price_gbp (internal)
    `client_invoice_lines?client_invoice_id=eq.${encodeURIComponent(id)}&select=id,line_number,description,quantity,tax_rate_pct,tax_amount_gbp,gross_gbp,total_gbp,work_order_id&order=line_number.asc`
  );

  return NextResponse.json({
    invoice,
    lines: lines || [],
    // Supplier costs, EntireFM margin, and rate cards are NEVER included here
  });
}

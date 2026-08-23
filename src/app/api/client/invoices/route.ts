/**
 * CLIENT PORTAL — CLIENT INVOICES
 * Clients see their own invoices only.
 * NEVER expose: supplier invoices, supplier costs, EntireFM margin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  // Resolve client account
  const { data: memberships } = await dbQuery<any[]>(
    `memberships?person_id=eq.${encodeURIComponent(session.personId)}&select=organisation_id`
  );
  const clientOrgId = memberships?.[0]?.organisation_id || session.orgId;

  const { data: accounts } = await dbQuery<any[]>(
    `client_accounts?organisation_id=eq.${encodeURIComponent(clientOrgId)}&select=id`
  );
  const accountIds = (accounts || []).map((a: any) => a.id);
  if (accountIds.length === 0) return NextResponse.json([]);

  // Return client invoices with NO supplier cost or margin data
  const { data } = await dbQuery<any[]>(
    `client_invoices?client_account_id=in.(${accountIds.join(',')})&select=id,invoice_number,status,issue_date,due_date,subtotal_gbp,tax_amount_gbp,total_amount_gbp,payment_status,currency,billing_period_start,billing_period_end&order=created_at.desc&limit=100`
  );
  return NextResponse.json(data || []);
}

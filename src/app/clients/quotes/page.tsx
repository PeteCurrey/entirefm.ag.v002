/**
 * CLIENT QUOTES & APPROVALS PAGE — /clients/quotes (Phase 0M Addendum)
 * ====================================================================
 * Displays quotations requiring approval, rate reviews, and scopes.
 * STRICTLY TENANT-SCOPED: Only displays quotations belonging to the client's account.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import ClientQuotesClient from './ClientQuotesClient';

export const metadata: Metadata = {
  title: 'Quotes & Approvals | Client Portal — EntireFM',
  description: 'Review and approve quotations and extra works scopes.',
};

export const dynamic = 'force-dynamic';

export default async function ClientQuotesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/clients/quotes');

  // Resolve client accounts for the authenticated organisation
  let clientAccountIds: string[] = [];
  if (session.orgId) {
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(session.orgId)}&select=id`
    );
    clientAccountIds = (clientAccounts || []).map((ca) => ca.id);
  }

  // If user is CLIENT and has no linked client account, return empty list
  if (session.orgType === 'CLIENT' && clientAccountIds.length === 0) {
    return <ClientQuotesClient initialQuotes={[]} clientName={session.orgName} />;
  }

  let query =
    'quotes?select=id,quote_number,title,total_price_gbp,total_sell_gbp,total_amount_gbp,status,created_at&order=created_at.desc&limit=50';
  if (session.orgType === 'CLIENT') {
    query += `&client_account_id=in.(${clientAccountIds.join(',')})`;
  }

  const { data: quotes } = await dbQuery<any[]>(query);

  const initialQuotes = (quotes || []).map((q: any) => ({
    id: q.id,
    quote_number: q.quote_number,
    title: q.title,
    total_price_gbp: Number(q.total_sell_gbp || q.total_price_gbp || q.total_amount_gbp || 0),
    status: q.status,
    created_at: q.created_at,
  }));

  return (
    <ClientQuotesClient
      initialQuotes={initialQuotes}
      clientName={session.orgName}
    />
  );
}

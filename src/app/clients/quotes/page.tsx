/**
 * CLIENT QUOTES & APPROVALS PAGE — /clients/quotes (Phase 0M Addendum)
 * ====================================================================
 * Displays quotations requiring approval, rate reviews, and scopes.
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

  const { data: quotes } = await dbQuery<any[]>(
    `quotes?select=id,quote_number,title,total_price_gbp,status,created_at&order=created_at.desc&limit=50`
  );

  const initialQuotes = (quotes || []).map((q: any) => ({
    id: q.id,
    quote_number: q.quote_number,
    title: q.title,
    total_price_gbp: Number(q.total_price_gbp || 0),
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

import React from 'react';
import { listQuotes } from '@/server/commercial';
import { listClientAccounts, listSites } from '@/server/estate';
import { QuotesPageClient } from './QuotesPageClient';

export const dynamic = 'force-dynamic';

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [quotes, clientAccounts, sites] = await Promise.all([
    listQuotes(status),
    listClientAccounts(),
    listSites(),
  ]);

  return (
    <QuotesPageClient
      initialQuotes={quotes}
      clientAccounts={clientAccounts}
      sites={sites}
      currentStatus={status}
    />
  );
}

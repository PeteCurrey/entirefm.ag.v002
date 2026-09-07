/**
 * Client Invoices Workspace — Phase 0H
 * Preparation, issuance, payment tracking, and defensible evidence packs.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listClientInvoices } from '@/server/finance';
import { listClientAccounts } from '@/server/estate';
import { ClientInvoicesPageClient } from './ClientInvoicesPageClient';

export const dynamic = 'force-dynamic';

export default async function ClientInvoicesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:billing')) redirect('/admin');

  const [invoices, clientAccounts] = await Promise.all([
    listClientInvoices({ limit: 100 }).catch(() => []),
    listClientAccounts().catch(() => []),
  ]);

  return (
    <ClientInvoicesPageClient
      initialInvoices={invoices}
      clientAccounts={clientAccounts}
    />
  );
}

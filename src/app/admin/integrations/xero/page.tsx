/**
 * EntireCAFM — Xero Accounting Integration Management Page
 * Production-ready OAuth 2.0 connection, status monitoring, and sync orchestrator.
 */

import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getActiveConnection } from '@/lib/integrations/xero';
import { dbQuery } from '@/server/db/client';
import { XeroAdminClient } from './XeroAdminClient';

export const dynamic = 'force-dynamic';

export default async function XeroIntegrationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'accounting:sync') && !hasPermission(session, 'finance:admin')) {
    redirect('/admin');
  }

  const resolvedParams = await searchParams;
  const bannerStatus = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined;
  const bannerError = typeof resolvedParams.error === 'string' ? resolvedParams.error : undefined;
  const bannerTenant = typeof resolvedParams.tenant === 'string' ? resolvedParams.tenant : undefined;

  // Load active connection
  const connection = await getActiveConnection().catch(() => null);

  // Load sync metrics and logs
  const [
    { data: syncedInvoices },
    { data: pendingInvoices },
    { data: failedInvoices },
    { data: syncedContacts },
    { data: recentLogs },
  ] = await Promise.all([
    dbQuery<any[]>(`client_invoices?xero_invoice_id=not.is.null&select=id`),
    dbQuery<any[]>(
      `client_invoices?status=eq.ISSUED&accounting_sync_status=in.(NOT_SYNCED,UPDATE_PENDING)&select=id`
    ),
    dbQuery<any[]>(`client_invoices?accounting_sync_status=eq.SYNC_FAILED&select=id`),
    dbQuery<any[]>(`client_accounts?xero_contact_id=not.is.null&select=id`),
    dbQuery<any[]>(
      `accounting_sync_logs?provider=eq.XERO&order=created_at.desc&limit=10&select=*`
    ),
  ]);

  const initialData = {
    connected: connection !== null && connection.status === 'CONNECTED',
    status: connection?.status || 'DISCONNECTED',
    connection: connection
      ? {
          id: connection.id,
          tenantId: connection.xero_tenant_id,
          tenantName: connection.xero_tenant_name,
          tenantType: 'ORGANISATION',
          connectedAt: connection.created_at,
          lastSyncedAt: connection.last_successful_sync_at,
          scopes: connection.scopes_granted,
          isExpired: new Date(connection.expires_at).getTime() <= Date.now(),
        }
      : null,
    stats: {
      syncedInvoicesCount: syncedInvoices?.length || 0,
      pendingInvoicesCount: pendingInvoices?.length || 0,
      failedInvoicesCount: failedInvoices?.length || 0,
      syncedContactsCount: syncedContacts?.length || 0,
    },
    recentLogs: recentLogs || [],
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Integrations"
        title="Xero Accounting Integration"
        description="Production OAuth 2.0 connector, contact mapping, ACCREC invoice synchronisation, and payment reconciliation."
      />

      <XeroAdminClient
        initialData={initialData}
        bannerStatus={bannerStatus}
        bannerError={bannerError}
        bannerTenant={bannerTenant}
      />
    </div>
  );
}

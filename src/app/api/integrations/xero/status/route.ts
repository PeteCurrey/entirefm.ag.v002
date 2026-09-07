/**
 * GET /api/integrations/xero/status
 * Returns current Xero integration status, active tenant details, and live sync statistics.
 * Never exposes raw credentials, tokens, or encryption keys.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { getActiveConnection } from '@/lib/integrations/xero';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (
    !hasPermission(session, 'accounting:sync') &&
    !hasPermission(session, 'finance:admin') &&
    !hasPermission(session, 'finance:billing')
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const connection = await getActiveConnection();

    // Fetch stats from DB
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

    const stats = {
      syncedInvoicesCount: syncedInvoices?.length || 0,
      pendingInvoicesCount: pendingInvoices?.length || 0,
      failedInvoicesCount: failedInvoices?.length || 0,
      syncedContactsCount: syncedContacts?.length || 0,
    };

    if (!connection) {
      return NextResponse.json({
        connected: false,
        status: 'DISCONNECTED',
        connection: null,
        stats,
        recentLogs: recentLogs || [],
      });
    }

    const isExpired = new Date(connection.expires_at).getTime() <= Date.now();

    return NextResponse.json({
      connected: connection.status === 'CONNECTED',
      status: connection.status,
      connection: {
        id: connection.id,
        tenantId: connection.xero_tenant_id,
        tenantName: connection.xero_tenant_name,
        tenantType: 'ORGANISATION',
        connectedAt: connection.created_at,
        lastSyncedAt: connection.last_successful_sync_at,
        scopes: connection.scopes_granted,
        isExpired,
      },
      stats,
      recentLogs: recentLogs || [],
    });
  } catch (err: any) {
    console.error('[XERO_STATUS_ERROR]', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to retrieve Xero status' },
      { status: 500 }
    );
  }
}

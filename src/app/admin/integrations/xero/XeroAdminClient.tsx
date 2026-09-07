'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowRight,
  Clock,
  Radio,
  FileText,
  Users,
  CreditCard,
  Unlink,
} from 'lucide-react';

interface XeroAdminClientProps {
  initialData: {
    connected: boolean;
    status: string;
    connection: {
      id: string;
      tenantId: string;
      tenantName: string;
      tenantType: string;
      connectedAt: string;
      lastSyncedAt?: string;
      scopes: string[];
      isExpired: boolean;
    } | null;
    stats: {
      syncedInvoicesCount: number;
      pendingInvoicesCount: number;
      failedInvoicesCount: number;
      syncedContactsCount: number;
    };
    recentLogs: any[];
  };
  bannerStatus?: string;
  bannerError?: string;
  bannerTenant?: string;
}

export function XeroAdminClient({
  initialData,
  bannerStatus,
  bannerError,
  bannerTenant,
}: XeroAdminClientProps) {
  const [data, setData] = useState(initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const isConnected = data.connected && !!data.connection;

  async function handleRefreshStatus() {
    try {
      const res = await fetch('/api/integrations/xero/status', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to refresh Xero status', err);
    }
  }

  async function handleTriggerSync() {
    setIsSyncing(true);
    setSyncFeedback({ type: 'info', message: 'Triggering full Xero synchronisation...' });

    try {
      const res = await fetch('/api/integrations/xero/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSyncFeedback({
          type: 'success',
          message: `Sync completed successfully! Processed ${result.invoicesProcessed} invoices (${result.invoicesSynced} synced), reconciled ${result.paymentsReconciled} payments (${result.paymentsUpdated} updated).`,
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: `Sync finished with issues: ${result.error || (result.errors && result.errors[0]) || 'Partial sync failures recorded.'}`,
        });
      }

      await handleRefreshStatus();
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err?.message || 'Network error executing synchronisation.',
      });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Are you sure you want to disconnect Xero? EntireCAFM will no longer synchronize invoices or reconcile payments until reconnected.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const res = await fetch('/api/integrations/xero/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin user disconnected via settings portal' }),
      });

      if (res.ok) {
        await handleRefreshStatus();
        setSyncFeedback({
          type: 'info',
          message: 'Xero integration has been disconnected.',
        });
      } else {
        const json = await res.json();
        alert(`Failed to disconnect: ${json.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Network error during disconnect: ${err?.message}`);
    } finally {
      setIsDisconnecting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* FEEDBACK BANNERS */}
      {bannerStatus === 'connected' && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/40 text-emerald-300 text-xs font-normal">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <div className="font-medium text-white">Xero Authorisation Successful</div>
            <div>
              Connected to organisation: <span className="text-white font-medium">{bannerTenant || 'Xero Organisation'}</span>. Tokens securely encrypted and stored.
            </div>
          </div>
        </div>
      )}

      {bannerError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-800/40 bg-red-950/40 text-red-300 text-xs font-normal">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div>
            <div className="font-medium text-white">Xero Connection Error</div>
            <div>{bannerError}</div>
          </div>
        </div>
      )}

      {syncFeedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-xs font-normal ${
            syncFeedback.type === 'success'
              ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
              : syncFeedback.type === 'error'
              ? 'border-red-800/40 bg-red-950/40 text-red-300'
              : 'border-brand-edge-dark bg-brand-carbon/60 text-brand-mist'
          }`}
        >
          <div className="flex items-center gap-3">
            {syncFeedback.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            {syncFeedback.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-400" />}
            {syncFeedback.type === 'info' && <RefreshCw className="h-5 w-5 animate-spin text-brand-electric" />}
            <div>{syncFeedback.message}</div>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-xs text-brand-mist/60 hover:text-white ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* CONNECTION STATUS HERO CARD */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-void rounded-xl border border-brand-edge-dark">
              <Building2 className="h-7 w-7 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-light text-white">Xero Accounting Integration</h2>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-normal border ${
                    isConnected
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <p className="text-xs text-brand-mist/60 font-normal mt-1">
                Official OAuth 2.0 synchronisation for Contacts, Issued Invoices, and Payment Reconciliation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshStatus}
              title="Refresh connection status"
              className="p-2 rounded-lg border border-brand-edge-dark bg-brand-void text-brand-mist hover:text-white hover:border-brand-mist/30 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {isConnected ? (
              <>
                <button
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-electric text-black text-xs font-medium hover:bg-white transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 text-xs hover:bg-red-950/50 transition disabled:opacity-50"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </>
            ) : (
              <a
                href="/api/integrations/xero/connect"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-medium hover:bg-sky-400 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Connect to Xero
              </a>
            )}
          </div>
        </div>

        {/* TENANT & CONNECTION DETAILS */}
        {isConnected && data.connection && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-brand-void/60 border border-brand-edge-dark/60 text-xs">
            <div>
              <div className="text-brand-mist/60 text-[11px]">Connected Organisation</div>
              <div className="text-white font-medium mt-0.5">{data.connection.tenantName}</div>
            </div>
            <div>
              <div className="text-brand-mist/60 text-[11px]">Xero Tenant ID</div>
              <div className="text-brand-mist/80 font-mono text-[11px] mt-0.5">
                {data.connection.tenantId.slice(0, 14)}...
              </div>
            </div>
            <div>
              <div className="text-brand-mist/60 text-[11px]">Connected At</div>
              <div className="text-brand-mist/90 mt-0.5">
                {new Date(data.connection.connectedAt).toLocaleDateString('en-GB')}
              </div>
            </div>
            <div>
              <div className="text-brand-mist/60 text-[11px]">Token Lifecycle</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-300 text-[11px]">Auto-refresh active</span>
              </div>
            </div>
          </div>
        )}

        {/* PERMISSIONS & SCOPES */}
        {isConnected && data.connection && (
          <div className="border-t border-brand-edge-dark/60 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-brand-mist/70">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Granted Scopes:</span>
              <div className="flex flex-wrap gap-1.5">
                {data.connection.scopes.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-brand-void text-brand-mist/80 font-mono text-[10px] border border-brand-edge-dark"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SYNCHRONISATION METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-brand-mist/60 text-xs">
            <span>Synced Invoices</span>
            <FileText className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-light text-white">{data.stats.syncedInvoicesCount}</div>
          <div className="text-[11px] text-brand-mist/60">Fully matched in Xero ledger</div>
        </div>

        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-brand-mist/60 text-xs">
            <span>Pending Sync</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-light text-white">{data.stats.pendingInvoicesCount}</div>
          <div className="text-[11px] text-brand-mist/60">Issued, awaiting batch push</div>
        </div>

        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-brand-mist/60 text-xs">
            <span>Sync Errors</span>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-light text-white">{data.stats.failedInvoicesCount}</div>
          <div className="text-[11px] text-brand-mist/60">Require retry or attention</div>
        </div>

        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-brand-mist/60 text-xs">
            <span>Synced Contacts</span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-light text-white">{data.stats.syncedContactsCount}</div>
          <div className="text-[11px] text-brand-mist/60">Mapped client accounts</div>
        </div>
      </div>

      {/* WEBHOOK READINESS & ARCHITECTURE (PHASE 1) */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-light text-white">Webhook Ingestion Architecture</h3>
              <p className="text-xs text-brand-mist/60 font-normal mt-0.5">
                Phase 1 Webhook Readiness: Endpoint reserved and HMAC-SHA256 signature verification enabled
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-normal border bg-brand-void text-brand-mist/70 border-brand-edge-dark">
            ENDPOINT READY
          </span>
        </div>

        <div className="p-4 rounded-lg bg-brand-void/50 border border-brand-edge-dark/60 text-xs space-y-2 text-brand-mist/80">
          <div className="flex items-center gap-2">
            <span className="text-brand-mist/60">Reserved Webhook URL:</span>
            <code className="px-2 py-0.5 rounded bg-brand-void font-mono text-[11px] text-white border border-brand-edge-dark">
              https://www.entirefm.com/api/integrations/xero/webhooks
            </code>
          </div>
          <p className="text-[11.5px] leading-relaxed text-brand-mist/70">
            Phase 1 provides complete on-demand and batch synchronisation without requiring active webhooks.
            When you register the webhook URL and generate a Webhook Key in the Xero Developer Portal, EntireCAFM
            will immediately begin processing real-time events for automated payment reconciliation and contact updates.
          </p>
        </div>
      </div>

      {/* RECENT SYNC LOGS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-normal uppercase tracking-wider text-white">
            Recent Accounting Sync Logs ({data.recentLogs.length})
          </h3>
          <span className="text-[11px] text-brand-mist/50">Stored in accounting_sync_logs</span>
        </div>

        {data.recentLogs.length === 0 ? (
          <div className="p-6 bg-brand-carbon/30 border border-brand-edge-dark rounded-xl text-xs font-normal text-brand-mist/60 text-center">
            No Xero synchronisation logs recorded yet. Initiate a sync above or issue a client invoice.
          </div>
        ) : (
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-normal text-brand-mist">
              <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
                <tr>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">Direction</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">External ID</th>
                  <th className="p-3.5">Idempotency Key</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {data.recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-brand-edge-dark/20">
                    <td className="p-3.5 font-light text-white">
                      {log.entity_type} <span className="text-brand-mist/50 text-[11px]">({log.entity_id?.slice(0, 8)})</span>
                    </td>
                    <td className="p-3.5 text-brand-mist/70">{log.direction}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] border ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                            : log.status === 'FAILED'
                            ? 'bg-red-950/60 text-red-300 border-red-800/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-brand-mist/80">
                      {log.external_id ? `${log.external_id.slice(0, 12)}...` : '—'}
                    </td>
                    <td className="p-3.5 font-mono text-[10.5px] text-zinc-500 truncate max-w-[200px]">
                      {log.idempotency_key}
                    </td>
                    <td className="p-3.5 text-brand-mist/60 text-[11px]">
                      {new Date(log.created_at).toLocaleString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Accounting Integration & Sync Status — Phase 0H
 * Honest reporting of external accounting connector status.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getAccountingAdapter, listAccountingSyncFailures } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import Link from 'next/link';
import { Building2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountingSyncPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:admin')) redirect('/admin');

  const adapter = getAccountingAdapter();
  const failures = await listAccountingSyncFailures().catch(() => []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Finance"
        title="Accounting Integration & Sync Status"
        description="External accounting connector management, sync logs, and idempotent failure retries."
      />

      {/* CONNECTOR STATUS CARD */}
      <div className="bg-brand-carbon border border-brand-edge-dark p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-brand-electric" />
            <div>
              <h2 className="text-base font-light text-white font-mono">
                {adapter.provider}
              </h2>
              <p className="text-xs text-brand-mist/60 font-mono">
                Statutory Accounting Integration Provider
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded text-xs font-mono border ${adapter.isConfigured ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>
            {adapter.isConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}
          </span>
        </div>

        <div className="text-xs font-mono text-brand-mist/70 border-t border-brand-edge-dark/60 pt-4 space-y-2">
          <p>
            EntireFM is the authoritative source for operational work, commercial provenance, supplier commitments, and billing readiness.
            The external accounting platform remains authoritative for general ledger, balance sheet, and statutory accounts.
          </p>
          {!adapter.isConfigured && (
            <p className="text-amber-400/90 pt-1">
              Note: To activate live syncing, configure <code className="bg-brand-void px-1.5 py-0.5 rounded text-white">ACCOUNTING_PROVIDER</code> and API credentials in the server environment.
            </p>
          )}
        </div>
      </div>

      {/* FAILURES */}
      <div className="space-y-3">
        <h3 className="text-xs font-normal uppercase tracking-wider text-white font-mono">
          Recent Sync Failures ({failures.length})
        </h3>
        {failures.length === 0 ? (
          <div className="p-4 bg-brand-carbon/30 border border-brand-edge-dark rounded-xl text-xs font-mono text-brand-mist/60">
            No active accounting sync failures.
          </div>
        ) : (
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono text-brand-mist">
              <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
                <tr>
                  <th className="p-3.5">Entity Type</th>
                  <th className="p-3.5">Entity ID</th>
                  <th className="p-3.5">Idempotency Key</th>
                  <th className="p-3.5">Error</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {failures.map((f: any) => (
                  <tr key={f.id} className="hover:bg-brand-edge-dark/20">
                    <td className="p-3.5 font-light text-white">{f.entity_type}</td>
                    <td className="p-3.5">{f.entity_id?.slice(0, 8)}</td>
                    <td className="p-3.5 text-zinc-500 font-mono text-[11px]">{f.idempotency_key}</td>
                    <td className="p-3.5 text-red-300">{f.error_message || 'Unknown error'}</td>
                    <td className="p-3.5">{new Date(f.created_at).toLocaleString('en-GB')}</td>
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

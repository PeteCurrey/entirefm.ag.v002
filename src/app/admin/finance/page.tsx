/**
 * Finance Command Centre — Phase 0H
 * Real KPI data only. No fake financial dials.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getFinanceKPISummary, getAccountingAdapter, detectBillingLeakage } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import Link from 'next/link';
import {
  Receipt, FileText, AlertTriangle, Clock,
  CheckCircle, XCircle, TrendingDown, Building2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_COLOUR: Record<string, string> = {
  LIVE:           'bg-emerald-900/40 text-emerald-300 border-emerald-800/40',
  TEST_ADAPTER:   'bg-amber-900/40 text-amber-300 border-amber-800/40',
  NOT_CONFIGURED: 'bg-zinc-900/40 text-zinc-400 border-zinc-800/40',
  ERROR:          'bg-red-900/40 text-red-300 border-red-800/40',
};

function KpiCard({ label, value, sub, href, urgent }: {
  label: string; value: string | number; sub?: string;
  href?: string; urgent?: boolean;
}) {
  const cls = `flex flex-col gap-1 rounded-lg border p-5 transition-colors ${
    urgent && Number(value) > 0
      ? 'border-red-800/60 bg-red-900/10 hover:bg-red-900/20'
      : 'border-brand-edge-dark bg-brand-carbon/40 hover:bg-brand-edge-dark/30'
  }`;
  const inner = (
    <div className={cls}>
      <p className="text-[11.5px] uppercase tracking-widest text-brand-mist/50 font-mono">{label}</p>
      <p className={`text-2xl font-extralight font-mono ${urgent && Number(value) > 0 ? 'text-red-300' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-brand-mist/40 font-mono">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function FinanceCommandCentrePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:read')) redirect('/admin');

  const [kpis, leakage, adapter] = await Promise.all([
    getFinanceKPISummary().catch(() => null),
    detectBillingLeakage().catch(() => []),
    Promise.resolve(getAccountingAdapter()),
  ]);

  const leakageCount = leakage.length;
  const leakageOld = leakage.filter(l => l.ageingDays > 30).length;

  const adapterStatus = !adapter.isConfigured
    ? adapter.provider === 'NOT_CONFIGURED' ? 'NOT_CONFIGURED' : 'ERROR'
    : adapter.provider === 'TEST_ADAPTER' ? 'TEST_ADAPTER' : 'LIVE';

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Finance"
        title="Finance Command Centre"
        description="Supplier invoices · Client billing · Accounting integration · WIP reconciliation"
      />

      {/* CRITICAL ALERTS */}
      {((kpis?.bankDetailAlerts ?? 0) > 0 || (kpis?.duplicateFlags ?? 0) > 0) && (
        <div className="space-y-2">
          {(kpis?.bankDetailAlerts ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-red-800/60 bg-red-900/10 p-4">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-normal text-red-300">
                  {kpis!.bankDetailAlerts} Bank Detail Change Alert{kpis!.bankDetailAlerts > 1 ? 's' : ''} — Unreviewed
                </p>
                <p className="text-[11.5px] text-brand-mist/60 mt-0.5">
                  Invoice(s) contain bank details that differ from approved supplier records.
                  Supplier master data has NOT been changed. Manual verification required.
                </p>
                <Link href="/admin/finance/exceptions" className="text-red-400 text-xs underline mt-1 block">
                  Review Now →
                </Link>
              </div>
            </div>
          )}
          {(kpis?.duplicateFlags ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-800/50 bg-amber-900/10 p-4">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-300">
                {kpis!.duplicateFlags} possible duplicate invoice{kpis!.duplicateFlags > 1 ? 's' : ''} detected.{' '}
                <Link href="/admin/finance/exceptions" className="underline">Review →</Link>
              </p>
            </div>
          )}
        </div>
      )}

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Supplier Invoices Awaiting Review"
          value={kpis?.supplierInvoicesAwaitingReview ?? '—'}
          href="/admin/finance/supplier-invoices"
          urgent
        />
        <KpiCard
          label="Supplier Value Awaiting Approval"
          value={kpis ? `£${kpis.supplierValueAwaitingApproval.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '—'}
          href="/admin/finance/supplier-invoices"
        />
        <KpiCard
          label="Billing Ready"
          value={kpis?.billingReadyCount ?? '—'}
          href="/admin/finance/billing-ready"
        />
        <KpiCard
          label="Unbilled Completed Work"
          value={leakageCount}
          sub={leakageOld > 0 ? `${leakageOld} over 30 days` : undefined}
          href="/admin/finance/billing-ready"
          urgent
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Finance Exceptions"
          value={kpis?.financeExceptionCount ?? '—'}
          href="/admin/finance/exceptions"
          urgent
        />
        <KpiCard
          label="Accounting Sync Failures"
          value={kpis?.accountingSyncFailures ?? '—'}
          href="/admin/finance/accounting"
          urgent
        />
        <KpiCard
          label="Client Invoices Outstanding"
          value={kpis?.clientInvoicesOutstanding ?? '—'}
          href="/admin/finance/client-invoices"
        />
        <KpiCard
          label="Client Outstanding Value"
          value={kpis ? `£${kpis.clientOutstandingValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : '—'}
          href="/admin/finance/client-invoices"
        />
      </div>

      {/* NAVIGATION GRID */}
      <div>
        <p className="text-[11.5px] uppercase tracking-widest text-brand-mist/40 font-mono mb-3">Finance Workspaces</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { href: '/admin/finance/supplier-invoices', icon: Receipt, label: 'Supplier Invoices', desc: 'Receive · Extract · Match · Approve' },
            { href: '/admin/finance/billing-ready', icon: Clock, label: 'Billing Ready', desc: 'Completed work eligible for billing' },
            { href: '/admin/finance/client-invoices', icon: FileText, label: 'Client Invoices', desc: 'Prepare · Issue · Evidence · Payment' },
            { href: '/admin/finance/credit-notes', icon: TrendingDown, label: 'Credit Notes', desc: 'Supplier & client credit notes' },
            { href: '/admin/finance/exceptions', icon: AlertTriangle, label: 'Finance Exceptions', desc: 'Anomalies · Alerts · Disputes' },
            { href: '/admin/finance/accounting', icon: Building2, label: 'Accounting Sync', desc: 'Integration status & sync failures' },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 hover:bg-brand-edge-dark/30 transition-colors"
            >
              <Icon className="h-4 w-4 text-brand-electric mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-normal text-white">{label}</p>
                <p className="text-[11.5px] text-brand-mist/50 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ACCOUNTING STATUS */}
      <div className="rounded-lg border border-brand-edge-dark/60 bg-brand-void/30 p-4 flex items-center justify-between">
        <div>
          <p className="text-[11.5px] uppercase tracking-widest text-brand-mist/40 font-mono">Accounting Integration</p>
          <p className="text-sm text-white mt-0.5">{adapter.provider === 'NOT_CONFIGURED' ? 'No accounting system configured' : adapter.provider}</p>
        </div>
        <span className={`rounded px-2.5 py-1 font-mono text-[10.5px] border ${STATUS_COLOUR[adapterStatus]}`}>
          {adapterStatus.replace('_', ' ')}
        </span>
      </div>

      <p className="text-[11px] text-brand-mist/30 font-mono">
        Finance Command Centre — Phase 0H. All financial values sourced from operational records.
        AI assists extraction and anomaly detection only. No autonomous payment execution.
      </p>
    </div>
  );
}

/**
 * Supplier Invoices Review Desk — Phase 0H
 * Information-dense, financially precise.
 * Status tabs, line variance flags, bank alert warnings, match indicators.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listSupplierInvoices } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import Link from 'next/link';
import EmptyState from '@/components/admin/EmptyState';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const MATCH_STATUS_COLOURS: Record<string, string> = {
  EXACT_MATCH: 'bg-emerald-900/40 text-emerald-300 border-emerald-800/40',
  MATCH_WITHIN_TOLERANCE: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/30',
  MATCHED: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/30',
  PARTIAL_MATCH: 'bg-blue-900/40 text-blue-300 border-blue-800/40',
  OVER_PO: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
  UNDER_PO: 'bg-blue-900/30 text-blue-300 border-blue-800/30',
  RATE_VARIANCE: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
  QUANTITY_VARIANCE: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
  TAX_VARIANCE: 'bg-amber-900/30 text-amber-400 border-amber-800/30',
  NO_PO: 'bg-purple-900/40 text-purple-300 border-purple-800/40',
  WRONG_SUPPLIER: 'bg-red-900/40 text-red-300 border-red-800/40',
  DUPLICATE: 'bg-red-900/40 text-red-300 border-red-800/40',
  REVIEW_REQUIRED: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
  UNMATCHED: 'bg-zinc-900/40 text-zinc-400 border-zinc-800/40',
};

const PROCESSING_STATUS_BADGE: Record<string, string> = {
  RECEIVED: 'bg-zinc-800 text-zinc-300',
  EXTRACTING: 'bg-blue-900/50 text-blue-300',
  VALIDATING: 'bg-purple-900/50 text-purple-300',
  MATCHING: 'bg-indigo-900/50 text-indigo-300',
  REVIEW_REQUIRED: 'bg-amber-900/60 text-amber-200 border border-amber-700/50',
  APPROVED: 'bg-emerald-900/50 text-emerald-300',
  POSTED: 'bg-teal-900/50 text-teal-300',
  EXPORTED: 'bg-cyan-900/50 text-cyan-300',
  DISPUTED: 'bg-red-900/60 text-red-200 border border-red-700/50',
  DUPLICATE: 'bg-red-900/60 text-red-200',
  REJECTED: 'bg-zinc-900 text-zinc-500',
};

export default async function SupplierInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; match?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:read')) redirect('/admin');

  const { status, match } = await searchParams;
  const invoices = await listSupplierInvoices({
    processingStatus: status,
    matchStatus: match,
    limit: 100,
  }).catch(() => []);

  const totalValue = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount_gbp) || 0), 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Finance"
        title="Supplier Invoices Review Desk"
        description="Inbound contractor invoices, AI extraction confidence, line-level matching, and variance controls."
      />

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-edge-dark pb-3 text-xs font-normal">
        {[
          { label: 'ALL', href: '/admin/finance/supplier-invoices' },
          { label: 'REVIEW REQUIRED', href: '/admin/finance/supplier-invoices?status=REVIEW_REQUIRED' },
          { label: 'MATCHING', href: '/admin/finance/supplier-invoices?status=MATCHING' },
          { label: 'APPROVED', href: '/admin/finance/supplier-invoices?status=APPROVED' },
          { label: 'POSTED', href: '/admin/finance/supplier-invoices?status=POSTED' },
          { label: 'DISPUTED', href: '/admin/finance/supplier-invoices?status=DISPUTED' },
          { label: 'DUPLICATES', href: '/admin/finance/supplier-invoices?status=DUPLICATE' },
        ].map(tab => (
          <Link
            key={tab.label}
            href={tab.href}
            className="rounded px-3 py-1.5 bg-brand-carbon/60 hover:bg-brand-edge-dark text-brand-mist hover:text-white border border-brand-edge-dark/60 transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* SUMMARY STRIP */}
      <div className="flex items-center justify-between text-xs font-normal text-brand-mist/60 bg-brand-void/40 p-3 rounded-lg border border-brand-edge-dark/50">
        <div>Showing <span className="text-white font-light">{invoices.length}</span> invoices</div>
        <div>Total Value: <span className="text-brand-electric font-light">£{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title="No Supplier Invoices Found"
          description="Invoices ingested via manual upload, finance mailbox, or contractor portal will appear here."
          icon="Receipt"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-normal text-brand-mist">
            <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
              <tr>
                <th className="p-3.5">Invoice Ref</th>
                <th className="p-3.5">Supplier</th>
                <th className="p-3.5">PO / WO Link</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Total (£)</th>
                <th className="p-3.5">Match Status</th>
                <th className="p-3.5">Processing</th>
                <th className="p-3.5">Alerts</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                  <td className="p-3.5 font-light text-white">
                    <Link href={`/admin/finance/supplier-invoices/${inv.id}`} className="hover:text-brand-electric underline underline-offset-2">
                      {inv.invoice_ref}
                    </Link>
                  </td>
                  <td className="p-3.5 text-white/90">
                    {inv.supplier_org_id ? inv.supplier_org_id.slice(0, 8) : 'Unknown'}
                  </td>
                  <td className="p-3.5 text-brand-mist/70">
                    {inv.matched_po_id || inv.purchase_order_id ? (
                      <span className="text-white">PO: {(inv.matched_po_id || inv.purchase_order_id)?.slice(0, 8)}</span>
                    ) : inv.work_order_id ? (
                      <span>WO: {inv.work_order_id.slice(0, 8)}</span>
                    ) : (
                      <span className="text-zinc-500">None</span>
                    )}
                  </td>
                  <td className="p-3.5">{inv.issue_date || '—'}</td>
                  <td className="p-3.5 font-light text-brand-electric">
                    £{(Number(inv.total_amount_gbp) || 0).toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${MATCH_STATUS_COLOURS[inv.match_status] || 'bg-zinc-800 text-zinc-400'}`}>
                      {inv.match_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${PROCESSING_STATUS_BADGE[inv.processing_status] || 'bg-zinc-800 text-zinc-400'}`}>
                      {inv.processing_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {inv.bank_details_change_alert && (
                      <span className="inline-flex items-center gap-1 text-red-400 font-light bg-red-950/60 px-2 py-0.5 rounded border border-red-800 text-[10px]">
                        <ShieldAlert className="h-3 w-3" /> BANK ALERT
                      </span>
                    )}
                    {inv.duplicate_of_invoice_id && (
                      <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 text-[10px]">
                        <AlertTriangle className="h-3 w-3" /> DUP
                      </span>
                    )}
                    {!inv.bank_details_change_alert && !inv.duplicate_of_invoice_id && (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/admin/finance/supplier-invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-brand-electric hover:text-white transition-colors"
                    >
                      Review <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Client Invoice Detail & Accounting Reconciliation Desk
 * Authoritative operational details, line item breakdown, and direct Xero synchronization.
 */

import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Receipt,
  CreditCard,
  FileText,
} from 'lucide-react';
import { ClientInvoiceXeroSyncAction } from './ClientInvoiceXeroSyncAction';

export const dynamic = 'force-dynamic';

const INVOICE_STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  ISSUED: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
  PAID: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
  OVERDUE: 'bg-red-950/60 text-red-300 border-red-800/40',
  CANCELLED: 'bg-zinc-900 text-zinc-500 border-zinc-800',
};

const XERO_SYNC_BADGE: Record<string, string> = {
  SYNCED: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
  SYNCING: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
  SYNC_FAILED: 'bg-red-950/60 text-red-300 border-red-800/40',
  UPDATE_PENDING: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
  NOT_SYNCED: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  NOT_CONFIGURED: 'bg-zinc-900 text-zinc-500 border-zinc-800',
};

export default async function ClientInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:billing')) redirect('/admin');

  const { id } = await params;

  const [invRes, linesRes, auditRes] = await Promise.all([
    dbQuery<any[]>(`client_invoices?id=eq.${encodeURIComponent(id)}&select=*`),
    dbQuery<any[]>(
      `client_invoice_lines?client_invoice_id=eq.${encodeURIComponent(id)}&select=*&order=line_number.asc`
    ),
    dbQuery<any[]>(
      `audit_events?object_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=25`
    ),
  ]);

  if (!invRes.data || invRes.data.length === 0) {
    redirect('/admin/finance/client-invoices');
  }

  const invoice = invRes.data[0];
  const lines = linesRes.data || [];
  const audits = auditRes.data || [];

  // Fetch client account info if available
  let clientAccount: any = null;
  if (invoice.client_account_id) {
    const { data: clients } = await dbQuery<any[]>(
      `client_accounts?id=eq.${encodeURIComponent(invoice.client_account_id)}&select=*&limit=1`
    );
    if (clients && clients.length > 0) {
      clientAccount = clients[0];
    }
  }

  const isIssued = invoice.status === 'ISSUED' || invoice.status === 'PAID';
  const syncStatus = invoice.accounting_sync_status || 'NOT_SYNCED';

  return (
    <div className="space-y-6">
      {/* NAVIGATION */}
      <div className="flex items-center justify-between text-xs font-normal text-brand-mist/60">
        <Link
          href="/admin/finance/client-invoices"
          className="hover:text-white flex items-center gap-1 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Client Invoices
        </Link>
        <Link
          href="/admin/integrations/xero"
          className="hover:text-white flex items-center gap-1 text-brand-electric transition"
        >
          Manage Xero Integration <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* HEADER WITH TOTALS */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-edge-dark pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-white tracking-tight">
              {invoice.invoice_number}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-normal border ${
                INVOICE_STATUS_BADGE[invoice.status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {invoice.status}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-normal border ${
                XERO_SYNC_BADGE[syncStatus] || 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              XERO: {syncStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs font-normal text-brand-mist/70 mt-1.5 flex items-center gap-2">
            <span>Issue Date: <strong className="text-white font-medium">{invoice.issue_date || '—'}</strong></span>
            <span>·</span>
            <span>Due Date: <strong className="text-white font-medium">{invoice.due_date || '—'}</strong></span>
            <span>·</span>
            <span>Payment: <strong className="text-brand-electric font-medium">{invoice.payment_status?.replace(/_/g, ' ') || 'NOT DUE'}</strong></span>
          </p>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="flex items-center gap-6 bg-brand-carbon/60 border border-brand-edge-dark p-4 rounded-xl font-normal text-right">
          <div>
            <div className="text-[10.5px] uppercase text-brand-mist/60">Net Subtotal</div>
            <div className="text-sm font-normal text-white">
              £{(Number(invoice.subtotal_gbp) || 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase text-brand-mist/60">VAT</div>
            <div className="text-sm font-normal text-white">
              £{(Number(invoice.tax_amount_gbp) || 0).toFixed(2)}
            </div>
          </div>
          <div className="border-l border-brand-edge-dark pl-6">
            <div className="text-[10.5px] uppercase text-brand-mist/60">Total Gross</div>
            <div className="text-xl font-light text-brand-electric">
              £{(Number(invoice.total_amount_gbp) || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: INVOICE LINES & AUDIT HISTORY (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* LINE ITEMS TABLE */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
            <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-wider text-white font-medium">
                Line Items ({lines.length})
              </h2>
              <span className="text-[11px] text-brand-mist/50">Exclusive of VAT</span>
            </div>

            {lines.length === 0 ? (
              <div className="p-6 text-center text-xs text-brand-mist/60">
                No line items attached to this invoice.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-normal text-brand-mist">
                <thead className="bg-brand-void uppercase text-[10px] text-brand-mist/70 border-b border-brand-edge-dark">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Unit Net (£)</th>
                    <th className="p-3 text-right">VAT</th>
                    <th className="p-3 text-right">Total Net (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/60">
                  {lines.map((l: any, idx: number) => {
                    const qty = Number(l.quantity) || 1;
                    const unit = Number(l.unit_price_gbp) || 0;
                    const lineTotal = Number(l.total_amount_gbp) || qty * unit;
                    return (
                      <tr key={l.id || idx} className="hover:bg-brand-edge-dark/20">
                        <td className="p-3 text-brand-mist/60">{l.line_number || idx + 1}</td>
                        <td className="p-3 text-white font-light">{l.description || 'Service Line'}</td>
                        <td className="p-3 text-right">{qty}</td>
                        <td className="p-3 text-right">£{unit.toFixed(2)}</td>
                        <td className="p-3 text-right text-brand-mist/70">
                          {Number(l.tax_rate_pct) || 20}%
                        </td>
                        <td className="p-3 text-right font-light text-white">
                          £{lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* AUDIT LOGS */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-wider text-white font-medium">
              Invoice Audit Lineage & Accounting Log
            </h2>

            {audits.length === 0 ? (
              <div className="text-xs text-brand-mist/50">No audit events recorded.</div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
                {audits.map((a: any) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-lg bg-brand-void/50 border border-brand-edge-dark/50 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-light text-white flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-edge-dark font-mono">
                          {a.event_type}
                        </span>
                        <span className="text-brand-mist/60 text-[11px]">
                          by {a.actor_type}
                        </span>
                      </div>
                      {a.after_state?.xero_invoice_number && (
                        <div className="text-[11px] text-emerald-300/80 mt-1">
                          Xero Reference: {a.after_state.xero_invoice_number}
                        </div>
                      )}
                      {a.after_state?.error && (
                        <div className="text-[11px] text-red-300/90 mt-1">
                          Error: {a.after_state.error}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-brand-mist/40 shrink-0">
                      {new Date(a.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: XERO ACCOUNTING CARD & CLIENT INFO (1 COL) */}
        <div className="space-y-6">
          {/* XERO SYNCHRONISATION CARD */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="h-5 w-5 text-sky-400" />
              <h2 className="text-sm font-light">Xero Accounting Status</h2>
            </div>

            <div className="p-3.5 rounded-lg bg-brand-void border border-brand-edge-dark text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-brand-mist/60">Sync Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10.5px] border ${
                    XERO_SYNC_BADGE[syncStatus] || 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {syncStatus}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-mist/60">Xero Invoice Ref</span>
                <span className="font-mono text-white text-[11px]">
                  {invoice.xero_invoice_number || invoice.accounting_external_id || '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-mist/60">Xero ID</span>
                <span className="font-mono text-brand-mist/80 text-[10.5px] truncate max-w-[140px]">
                  {invoice.xero_invoice_id || '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-mist/60">Last Synced</span>
                <span className="text-brand-mist/80 text-[11px]">
                  {invoice.xero_synced_at
                    ? new Date(invoice.xero_synced_at).toLocaleString('en-GB')
                    : 'Never'}
                </span>
              </div>
            </div>

            {invoice.accounting_sync_error && (
              <div className="p-3 rounded-lg border border-red-800/40 bg-red-950/30 text-red-300 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-red-200 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Sync Error Details
                </div>
                <div className="text-[11px] leading-relaxed text-red-300/90">
                  {invoice.accounting_sync_error}
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-2 border-t border-brand-edge-dark/60">
              <ClientInvoiceXeroSyncAction
                invoiceId={invoice.id}
                isIssued={isIssued}
                currentSyncStatus={syncStatus}
                xeroInvoiceId={invoice.xero_invoice_id}
              />
            </div>
          </div>

          {/* CLIENT ACCOUNT CARD */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-wider text-white font-medium">
              Client Account Details
            </h2>

            {clientAccount ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-brand-mist/60">Company / Account</span>
                  <span className="text-white font-medium">{clientAccount.account_name || clientAccount.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-mist/60">Account Number</span>
                  <span className="font-mono text-brand-mist/80">{clientAccount.account_number || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-mist/60">Xero Contact ID</span>
                  <span className="font-mono text-brand-mist/80 text-[10.5px] truncate max-w-[140px]">
                    {clientAccount.xero_contact_id || 'Not Mapped'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-mist/60">Contact Synced</span>
                  <span className="text-brand-mist/80 text-[11px]">
                    {clientAccount.xero_synced_at
                      ? new Date(clientAccount.xero_synced_at).toLocaleDateString('en-GB')
                      : 'Never'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-brand-mist/50">
                Client Account ID: {invoice.client_account_id || 'None'}
              </div>
            )}
          </div>

          {/* EVIDENCE PACK DOWNLOAD */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-wider text-white font-medium">
              Defensible Evidence Pack
            </h2>
            <p className="text-xs text-brand-mist/60">
              Audit-ready proof of delivery, work orders, engineer logs, and sign-offs for this invoice.
            </p>
            <a
              href={`/api/admin/finance/client-invoices/${invoice.id}/evidence-pack`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-void border border-brand-edge-dark text-brand-electric text-xs hover:text-white transition"
            >
              <FileText className="h-3.5 w-3.5" />
              Download Evidence Pack (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

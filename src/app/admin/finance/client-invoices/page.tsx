/**
 * Client Invoices Workspace — Phase 0H
 * Preparation, issuance, payment tracking, and defensible evidence packs.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listClientInvoices } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/admin/EmptyState';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const INVOICE_STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300',
  ISSUED: 'bg-blue-950/60 text-blue-300 border border-blue-800/40',
  PAID: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40',
  OVERDUE: 'bg-red-950/60 text-red-300 border border-red-800/40',
  CANCELLED: 'bg-zinc-900 text-zinc-500',
};

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  NOT_DUE: 'text-brand-mist/60',
  DUE: 'text-amber-400 font-light',
  OVERDUE: 'text-red-400 font-light',
  PART_PAID: 'text-blue-400 font-light',
  PAID: 'text-emerald-400 font-light',
};

export default async function ClientInvoicesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:billing')) redirect('/admin');

  const invoices = await listClientInvoices({ limit: 100 }).catch(() => []);
  const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount_gbp) || 0), 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Finance"
        title="Client Invoices"
        description="Authoritative client invoices, billing periods, payment status from accounting, and evidence packs."
      />

      {/* SUMMARY */}
      <div className="flex items-center justify-between text-xs font-mono text-brand-mist/60 bg-brand-void/40 p-3.5 rounded-lg border border-brand-edge-dark/50">
        <div>Total Issued Invoices: <span className="text-white font-light">{invoices.length}</span></div>
        <div>Total Invoiced: <span className="text-brand-electric font-light">£{totalBilled.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title="No Client Invoices Found"
          description="Prepare client invoices by batching items from the Billing Readiness queue."
          icon="FileText"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-mono text-brand-mist">
            <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
              <tr>
                <th className="p-3.5">Invoice Number</th>
                <th className="p-3.5">Client Account</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Net (£)</th>
                <th className="p-3.5">VAT (£)</th>
                <th className="p-3.5">Total Gross (£)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                  <td className="p-3.5 font-light text-white">
                    {inv.invoice_number}
                  </td>
                  <td className="p-3.5 text-white/80">{inv.client_account_id ? inv.client_account_id.slice(0, 8) : '—'}</td>
                  <td className="p-3.5">{inv.issue_date || '—'}</td>
                  <td className="p-3.5">{inv.due_date || '—'}</td>
                  <td className="p-3.5 font-light text-white">£{(Number(inv.subtotal_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 text-brand-mist/70">£{(Number(inv.tax_amount_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 font-light text-brand-electric">£{(Number(inv.total_amount_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${INVOICE_STATUS_BADGE[inv.status] || 'bg-zinc-800 text-zinc-400'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className={`p-3.5 text-[11px] ${PAYMENT_STATUS_BADGE[inv.payment_status] || 'text-brand-mist'}`}>
                    {inv.payment_status?.replace(/_/g, ' ') || 'NOT DUE'}
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href={`/api/admin/finance/client-invoices/${inv.id}/evidence-pack`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-electric hover:text-white underline underline-offset-2"
                    >
                      Pack
                    </a>
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

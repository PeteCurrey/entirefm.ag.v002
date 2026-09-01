/**
 * Billing Readiness Queue — Phase 0H
 * Operational & commercial staging for billable items.
 * Explicit blocker reasons (missing PO, missing evidence, unapproved quotes).
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listBillingReadyQueue, detectBillingLeakage } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/admin/EmptyState';
import Link from 'next/link';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BillingReadyPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:billing')) redirect('/admin');

  const [queue, leakage] = await Promise.all([
    listBillingReadyQueue().catch(() => []),
    detectBillingLeakage().catch(() => []),
  ]);

  const totalBillable = queue.reduce((sum, item) => sum + (Number(item.billable_gross_gbp || item.gross_revenue_gbp) || 0), 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Finance"
        title="Billing Readiness Queue"
        description="Completed Work Orders staged for client invoicing. Clear blocker visibility."
      />

      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-carbon border border-brand-edge-dark p-4 rounded-xl font-normal">
          <div className="text-[11px] uppercase text-brand-mist/60">Ready to Invoice</div>
          <div className="text-2xl font-extralight text-emerald-400 mt-1">{queue.length} items</div>
          <div className="text-xs text-brand-mist/70 mt-0.5">£{totalBillable.toFixed(2)} total value</div>
        </div>
        <div className="bg-brand-carbon border border-brand-edge-dark p-4 rounded-xl font-normal">
          <div className="text-[11px] uppercase text-brand-mist/60">Unbilled Completed Work</div>
          <div className="text-2xl font-extralight text-amber-400 mt-1">{leakage.length} jobs</div>
          <div className="text-xs text-brand-mist/70 mt-0.5">Requires billing item creation</div>
        </div>
        <div className="bg-brand-carbon border border-brand-edge-dark p-4 rounded-xl font-normal">
          <div className="text-[11px] uppercase text-brand-mist/60">Aged Unbilled (&gt;30d)</div>
          <div className="text-2xl font-extralight text-red-400 mt-1">
            {leakage.filter(l => l.ageingDays > 30).length} jobs
          </div>
          <div className="text-xs text-brand-mist/70 mt-0.5">High margin leakage risk</div>
        </div>
      </div>

      {queue.length === 0 ? (
        <EmptyState
          title="No Items in Billing Ready Queue"
          description="Completed Work Orders that satisfy billing eligibility requirements will appear here for invoice grouping."
          icon="Clock"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-normal text-brand-mist">
            <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
              <tr>
                <th className="p-3.5">Work Order</th>
                <th className="p-3.5">Client Account</th>
                <th className="p-3.5">Billing Model</th>
                <th className="p-3.5">Net (£)</th>
                <th className="p-3.5">VAT (£)</th>
                <th className="p-3.5">Gross (£)</th>
                <th className="p-3.5">Client PO</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {queue.map(item => (
                <tr key={item.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                  <td className="p-3.5 font-light text-white">
                    <Link href={`/admin/operations/work-orders/${item.work_order_id}`} className="hover:text-brand-electric underline underline-offset-2">
                      {item.work_order_id ? item.work_order_id.slice(0, 8) : '—'}
                    </Link>
                  </td>
                  <td className="p-3.5 text-white/80">{item.client_account_id ? item.client_account_id.slice(0, 8) : '—'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-edge-dark text-white">
                      {item.billing_model || item.revenue_basis}
                    </span>
                  </td>
                  <td className="p-3.5 text-white font-light">£{(Number(item.billable_net_gbp || item.net_revenue_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 text-brand-mist/80">£{(Number(item.billable_tax_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 font-light text-brand-electric">£{(Number(item.billable_gross_gbp || item.gross_revenue_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 text-white">{item.client_po_ref || <span className="text-zinc-500">Not Required</span>}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      {item.status}
                    </span>
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

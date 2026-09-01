/**
 * Finance Exceptions & Anomalies Desk — Phase 0H
 * Bank alert warnings, duplicate flags, rate mismatches, unbilled work.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/admin/EmptyState';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinanceExceptionsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:read')) redirect('/admin');

  const [bankAlerts, duplicates, disputed] = await Promise.all([
    dbQuery<any[]>(`supplier_invoices?bank_details_change_alert=eq.true&select=*&order=created_at.desc`),
    dbQuery<any[]>(`supplier_invoices?processing_status=eq.DUPLICATE&select=*&order=created_at.desc`),
    dbQuery<any[]>(`supplier_invoices?processing_status=eq.DISPUTED&select=*&order=created_at.desc`),
  ]);

  const bankList = bankAlerts.data || [];
  const dupList = duplicates.data || [];
  const dispList = disputed.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Finance"
        title="Finance Exceptions & Anomalies Desk"
        description="Bank account change alerts, duplicate detection flags, and disputed invoices."
      />

      {/* SECTION 1: BANK ALERTS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <h2 className="text-sm font-normal uppercase tracking-wider text-white">
            Bank Detail Change Alerts ({bankList.length})
          </h2>
        </div>
        {bankList.length === 0 ? (
          <div className="p-4 bg-brand-carbon/30 border border-brand-edge-dark rounded-xl text-xs font-normal text-brand-mist/60">
            No active bank detail change alerts.
          </div>
        ) : (
          <div className="bg-brand-carbon border border-red-900/40 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-normal text-brand-mist">
              <thead className="bg-red-950/40 uppercase text-[10.5px] font-normal text-red-300 border-b border-red-900/40">
                <tr>
                  <th className="p-3.5">Invoice Ref</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Total (£)</th>
                  <th className="p-3.5">Alert Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {bankList.map(inv => (
                  <tr key={inv.id} className="hover:bg-red-950/20">
                    <td className="p-3.5 font-light text-white">{inv.invoice_ref}</td>
                    <td className="p-3.5">{inv.supplier_org_id?.slice(0, 8)}</td>
                    <td className="p-3.5 text-white font-light">£{(Number(inv.total_amount_gbp) || 0).toFixed(2)}</td>
                    <td className="p-3.5 text-red-300">Bank details differ from master records</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800">
                        {inv.bank_alert_reviewed_at ? 'REVIEWED' : 'UNREVIEWED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link href={`/admin/finance/supplier-invoices/${inv.id}`} className="text-red-400 hover:text-white underline">
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: DUPLICATES */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-normal uppercase tracking-wider text-white">
            Possible Duplicate Invoices ({dupList.length})
          </h2>
        </div>
        {dupList.length === 0 ? (
          <div className="p-4 bg-brand-carbon/30 border border-brand-edge-dark rounded-xl text-xs font-normal text-brand-mist/60">
            No duplicate invoices detected.
          </div>
        ) : (
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-normal text-brand-mist">
              <thead className="bg-brand-void uppercase text-[10.5px] font-normal text-brand-mist/70 border-b border-brand-edge-dark">
                <tr>
                  <th className="p-3.5">Invoice Ref</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Total (£)</th>
                  <th className="p-3.5">Matched Existing Invoice</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {dupList.map(inv => (
                  <tr key={inv.id} className="hover:bg-brand-edge-dark/20">
                    <td className="p-3.5 font-light text-white">{inv.invoice_ref}</td>
                    <td className="p-3.5">{inv.supplier_org_id?.slice(0, 8)}</td>
                    <td className="p-3.5 font-light text-white">£{(Number(inv.total_amount_gbp) || 0).toFixed(2)}</td>
                    <td className="p-3.5 text-amber-400 font-light">{inv.duplicate_of_invoice_id?.slice(0, 8)}</td>
                    <td className="p-3.5 text-right">
                      <Link href={`/admin/finance/supplier-invoices/${inv.id}`} className="text-brand-electric hover:text-white underline">
                        Review →
                      </Link>
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

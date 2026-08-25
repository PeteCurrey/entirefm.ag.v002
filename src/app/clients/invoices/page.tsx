import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientInvoicesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: invoices } = await dbQuery<any[]>(
    `client_invoices?select=id,invoice_number,total_gbp,subtotal_gbp,tax_amount_gbp,status,payment_status,due_date,created_at&order=created_at.desc&limit=50`
  );

  const list = invoices || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Billing & Invoices</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Client invoices, payment schedules, and statement history for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Invoice Number</th>
              <th className="px-6 py-3">Net Subtotal</th>
              <th className="px-6 py-3">Gross Total (incl. VAT)</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  No client invoices found.
                </td>
              </tr>
            ) : (
              list.map((inv) => (
                <tr key={inv.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-brand-electric-bright">{inv.invoice_number}</td>
                  <td className="px-6 py-3.5 font-mono">£{Number(inv.subtotal_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3.5 font-mono font-normal text-white">£{Number(inv.total_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3.5 font-mono text-[12px]">{inv.due_date || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] border ${
                      inv.payment_status === 'PAID'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}>
                      {inv.payment_status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

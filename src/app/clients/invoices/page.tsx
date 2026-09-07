import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientInvoicesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  // Resolve client accounts for the authenticated client organisation
  let clientAccountIds: string[] = [];
  if (session.orgId) {
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(session.orgId)}&select=id`
    );
    clientAccountIds = (clientAccounts || []).map((ca) => ca.id);
  }

  let list: any[] = [];
  if (session.orgType !== 'CLIENT' || clientAccountIds.length > 0) {
    let query =
      'client_invoices?select=id,invoice_number,total_amount_gbp,total_gbp,subtotal_gbp,tax_amount_gbp,status,payment_status,due_date,created_at&order=created_at.desc&limit=50';
    if (session.orgType === 'CLIENT') {
      query += `&client_account_id=in.(${clientAccountIds.join(',')})`;
    }
    const { data: invoices } = await dbQuery<any[]>(query);
    list = invoices || [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-[#111111] tracking-tight">Billing & Invoices</h1>
        <p className="mt-1 text-[13px] text-[#6D6D68]">
          Client invoices, payment schedules, and statement history for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[#6D6D68] font-medium text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Invoice Number</th>
              <th className="px-6 py-3">Net Subtotal</th>
              <th className="px-6 py-3">Gross Total (incl. VAT)</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E5] text-[#111111]">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#9A9A95]">
                  No client invoices found.
                </td>
              </tr>
            ) : (
              list.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3.5 font-normal text-brand-electric-bright">{inv.invoice_number}</td>
                  <td className="px-6 py-3.5 font-normal">
                    £{Number(inv.subtotal_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3.5 font-normal text-white">
                    £{Number(inv.total_amount_gbp || inv.total_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3.5 font-normal text-[12px]">{inv.due_date || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`rounded px-2 py-0.5 font-normal text-[10px] border ${
                        inv.payment_status === 'PAID'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      }`}
                    >
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

import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import { FileText, Receipt, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientHomePage() {
  const session = await getCurrentSession();

  // Load client invoices if available
  const { data: memberships } = await dbQuery<any[]>(
    session ? `memberships?person_id=eq.${encodeURIComponent(session.personId)}&select=organisation_id` : ''
  );
  const clientOrgId = memberships?.[0]?.organisation_id || session?.orgId;

  const { data: accounts } = await dbQuery<any[]>(
    clientOrgId ? `client_accounts?organisation_id=eq.${encodeURIComponent(clientOrgId)}&select=id` : ''
  );
  const accountIds = (accounts || []).map((a: any) => a.id);

  let invoices: any[] = [];
  if (accountIds.length > 0) {
    const { data } = await dbQuery<any[]>(
      `client_invoices?client_account_id=in.(${accountIds.join(',')})&select=id,invoice_number,status,issue_date,due_date,total_amount_gbp,payment_status&order=created_at.desc&limit=10`
    );
    invoices = data || [];
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-brand-edge bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-brand-graphite">
          Client Portal — My Estate & Invoices
        </h1>
        <p className="mt-1 text-[13px] text-brand-silver font-mono">
          Account: <strong className="text-brand-graphite">{session?.orgName}</strong>
        </p>

        {/* INVOICES SECTION */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-graphite font-mono flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-electric" /> Authorised Invoices
            </h2>
            <span className="text-xs font-mono text-brand-silver">
              Showing {invoices.length} invoices
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="p-6 bg-brand-surface rounded-xl border border-brand-edge text-center text-xs font-mono text-brand-silver">
              No issued invoices currently outstanding for this client account.
            </div>
          ) : (
            <div className="border border-brand-edge rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs font-mono text-brand-graphite">
                <thead className="bg-brand-surface uppercase text-[10.5px] font-semibold text-brand-silver border-b border-brand-edge">
                  <tr>
                    <th className="p-3">Invoice Number</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Total (£)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3 text-right">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-brand-surface/60 transition-colors">
                      <td className="p-3 font-bold text-brand-graphite">{inv.invoice_number}</td>
                      <td className="p-3 text-brand-silver">{inv.issue_date}</td>
                      <td className="p-3 text-brand-silver">{inv.due_date}</td>
                      <td className="p-3 font-bold text-brand-electric">£{(Number(inv.total_amount_gbp) || 0).toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-brand-surface border border-brand-edge font-bold">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-brand-silver">
                        {inv.payment_status?.replace(/_/g, ' ') || 'NOT DUE'}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-brand-electric font-semibold">Defensible Evidence Included</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

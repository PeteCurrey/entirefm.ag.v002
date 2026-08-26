import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import { CreditCard, Download, CheckCircle2, Receipt, AlertCircle } from 'lucide-react';
import { getSupplierOnboardingDraft } from '@/server/suppliers/store';
import { getSupplierOrganisationById } from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Invoices & Commercial Billing | EntireFM Supplier Portal',
  description: 'View commercial invoices, download VAT receipts, and manage payment instructions.',
};

export default async function SupplierPortalBillingPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const draft = orgId ? await getSupplierOnboardingDraft(orgId) : null;

  // Build real invoice items from draft / assurance payments
  const invoices: any[] = [];
  if (draft?.assurance_payment?.status === 'PAID') {
    invoices.push({
      number: draft.assurance_payment.invoice_number || `INV-${draft.application_reference || 'ASSUR'}`,
      description: 'Initial Supplier Assurance Review (Technical Due Diligence & Vetting)',
      issued: draft.assurance_payment.paid_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      totalGbp: draft.assurance_payment.total_gbp || 420,
      status: 'PAID',
      receiptUrl: '#',
    });
  }

  const financeContactName = session?.name || 'Primary Administrator';
  const financeContactEmail = session?.email || '—';

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          COMMERCIAL FINANCE &amp; LEDGER
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Invoices &amp; Commercial Billing
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Access point-in-time VAT invoices, receipts, and payment instructions for your EntireFM supplier account.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">OUTSTANDING BALANCE</span>
          <div className="text-2xl font-mono font-bold text-emerald-600">£0.00</div>
          <span className="text-[10.5px] text-slate-500 font-mono">Account up to date</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">ASSURANCE PAYMENT</span>
          <div className="text-xl font-mono font-bold text-slate-900">
            {draft?.assurance_payment?.status === 'PAID' ? 'Settled' : 'Pending Review'}
          </div>
          <span className="text-[10.5px] text-slate-500 font-mono">
            {draft?.assurance_payment?.status === 'PAID' ? '£350.00 + VAT Paid' : 'Due prior to technical review'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">ACCOUNT CONTACT</span>
          <div className="text-xs font-bold text-slate-900 truncate font-sans">{financeContactName}</div>
          <span className="text-[10.5px] text-slate-500 font-mono truncate">{financeContactEmail}</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Commercial Partner Invoices
          </h3>
          <span className="text-xs font-mono text-slate-500">{invoices.length} Total Record(s)</span>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="bg-slate-900 text-white font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Issued</th>
                  <th className="p-3">Total (inc. VAT)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.number} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{inv.number}</td>
                    <td className="p-3 font-sans text-slate-700">{inv.description}</td>
                    <td className="p-3 text-slate-500">{inv.issued}</td>
                    <td className="p-3 font-bold text-slate-900">£{inv.totalGbp.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-brand-pink font-bold hover:underline flex items-center gap-1 ml-auto text-[11px]">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Receipt className="h-8 w-8 text-slate-300 mx-auto" />
            <p>No commercial invoices or receipts issued yet.</p>
            <p className="text-[11px] text-slate-400">VAT receipts for assurance review payments and partner subscriptions will be listed here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}

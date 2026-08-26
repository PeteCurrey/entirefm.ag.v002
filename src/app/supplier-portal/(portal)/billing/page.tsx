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
      dueDate: draft.assurance_payment.paid_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      paymentTerms: 'Due Immediately',
      paymentMethod: 'Card (Stripe)',
      netGbp: 350,
      vatGbp: 70,
      totalGbp: draft.assurance_payment.total_gbp || 420,
      status: 'PAID',
      receiptUrl: '#',
    });
  } else if (
    draft?.assurance_payment?.status === 'AWAITING_PAYMENT' &&
    draft?.assurance_payment?.payment_method === 'INVOICE'
  ) {
    const issuedDate = new Date().toISOString().slice(0, 10);
    invoices.push({
      number: draft.assurance_payment.invoice_number || `INV-ASSUR-${draft.application_reference || 'PEND'}`,
      description: 'Initial Supplier Assurance Review (Technical Due Diligence & Vetting)',
      issued: issuedDate,
      dueDate: issuedDate, // Due immediately — same date as issue
      paymentTerms: 'Due Immediately',
      paymentMethod: 'BACS',
      netGbp: 350,
      vatGbp: 70,
      totalGbp: 420,
      status: 'AWAITING_PAYMENT',
      receiptUrl: null,
    });
  }

  const outstandingGbp = invoices
    .filter((i) => i.status === 'AWAITING_PAYMENT')
    .reduce((sum, i) => sum + (i.totalGbp || 0), 0);

  const financeContactName = session?.name || 'Primary Administrator';
  const financeContactEmail = session?.email || '—';

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          COMMERCIAL FINANCE &amp; LEDGER
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Invoices &amp; Commercial Billing
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Access point-in-time VAT invoices, receipts, and payment instructions for your EntireFM supplier account.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`border p-5 rounded-sm shadow-sm space-y-1 ${outstandingGbp > 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">OUTSTANDING BALANCE</span>
          <div className={`text-2xl font-medium ${outstandingGbp > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
            £{outstandingGbp.toFixed(2)}
          </div>
          <span className="text-[10.5px] text-slate-500 font-light">
            {outstandingGbp > 0 ? 'Payment due immediately — see invoice below' : 'Account up to date'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">ASSURANCE PAYMENT</span>
          <div className="text-xl font-light text-slate-900">
            {draft?.assurance_payment?.status === 'PAID'
              ? 'Settled'
              : draft?.assurance_payment?.status === 'AWAITING_PAYMENT'
              ? 'Awaiting Payment'
              : 'Not Yet Initiated'}
          </div>
          <span className="text-[10.5px] text-slate-500 font-light">
            {draft?.assurance_payment?.status === 'PAID'
              ? '£350.00 + VAT — Paid'
              : draft?.assurance_payment?.status === 'AWAITING_PAYMENT'
              ? '£350.00 + VAT — Due Immediately'
              : 'Required before technical review'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">ACCOUNT CONTACT</span>
          <div className="text-xs font-bold text-slate-900 truncate font-sans">{financeContactName}</div>
          <span className="text-[10.5px] text-slate-500 font-light truncate">{financeContactEmail}</span>
        </div>
      </div>

      {/* BACS payment instructions panel — only shows for unpaid BACS invoices */}
      {invoices.some((i) => i.status === 'AWAITING_PAYMENT' && i.paymentMethod === 'BACS') && (
        <div className="bg-amber-50 border border-amber-300 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Payment Required — Application Pending</span>
          </div>
          <p className="text-[11.5px] text-amber-900 leading-relaxed">
            Your VAT invoice has been issued. Please pay by BACS immediately using your invoice reference as the payment reference. Bank details are shown on the invoice.{' '}
            <strong>Your application will be formally submitted for EntireFM assurance review once payment has been received and confirmed.</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="block font-bold text-amber-900">Payment Terms</span>
              <span className="text-amber-800">Due Immediately</span>
            </div>
            <div>
              <span className="block font-bold text-amber-900">Payment Method</span>
              <span className="text-amber-800">BACS Bank Transfer</span>
            </div>
            <div>
              <span className="block font-bold text-amber-900">Amount Due</span>
              <span className="text-amber-800">£420.00 inc. VAT</span>
            </div>
            <div>
              <span className="block font-bold text-amber-900">Application Status</span>
              <span className="text-amber-800">Awaiting Payment</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 border border-amber-400 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition-colors">
            <Download className="h-3.5 w-3.5" /> Download VAT Invoice (PDF)
          </button>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Commercial Partner Invoices
          </h3>
          <span className="text-xs font-light text-slate-500">{invoices.length} Total Record(s)</span>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-light">
              <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Issued</th>
                  <th className="p-3">Terms</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Total (inc. VAT)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.number} className={`hover:bg-slate-50/50 ${inv.status === 'AWAITING_PAYMENT' ? 'bg-amber-50/40' : ''}`}>
                    <td className="p-3 font-bold text-slate-900">{inv.number}</td>
                    <td className="p-3 font-sans text-slate-700">{inv.description}</td>
                    <td className="p-3 text-slate-500">{inv.issued}</td>
                    <td className="p-3 text-slate-600 font-sans">{inv.paymentTerms || 'Due Immediately'}</td>
                    <td className="p-3 text-slate-600 font-sans">{inv.paymentMethod || '—'}</td>
                    <td className="p-3 font-bold text-slate-900">£{inv.totalGbp.toFixed(2)}</td>
                    <td className="p-3">
                      {inv.status === 'PAID' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10.5px] px-2 py-0.5 rounded font-bold">PAID</span>
                      ) : inv.status === 'AWAITING_PAYMENT' ? (
                        <span className="bg-amber-100 text-amber-800 text-[10.5px] px-2 py-0.5 rounded font-bold">AWAITING PAYMENT</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10.5px] px-2 py-0.5 rounded font-bold">{inv.status}</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {inv.receiptUrl ? (
                        <button className="text-brand-pink font-bold hover:underline flex items-center gap-1 ml-auto text-[11px]">
                          <Download className="h-3.5 w-3.5" /> Receipt
                        </button>
                      ) : inv.status === 'AWAITING_PAYMENT' ? (
                        <button className="text-amber-700 font-bold hover:underline flex items-center gap-1 ml-auto text-[11px]">
                          <Download className="h-3.5 w-3.5" /> Invoice
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
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


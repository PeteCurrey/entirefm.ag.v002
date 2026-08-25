import React from 'react';
import { listPartnerInvoices } from '@/server/partner-network/store';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';
import { CreditCard, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PartnerInvoicesPage() {
  const invoices = await listPartnerInvoices();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            RECEIVABLES &amp; BILLING
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier &amp; Partner Invoices
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Manage membership fees, assurance reviews, event tickets, and sponsorship billings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CsvExportButton
            data={invoices.map((i) => ({
              invoice_number: i.invoice_number,
              supplier: i.supplier_name,
              issue_date: i.issue_date,
              due_date: i.due_date,
              status: i.status,
              subtotal: i.subtotal_gbp,
              vat: i.vat_total_gbp,
              total: i.total_gbp,
              paid: i.amount_paid_gbp,
              outstanding: i.amount_outstanding_gbp,
            }))}
            filename="entirefm-partner-invoices.csv"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10.5px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Supplier / Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Net</th>
                <th className="py-3 px-4 text-right">VAT</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs font-light font-sans">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-light text-slate-900">{inv.invoice_number}</td>
                    <td className="py-3 px-4 font-sans text-slate-800">{inv.supplier_name}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.issue_date.split('T')[0]}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.due_date.split('T')[0]}</td>
                    <td className="py-3 px-4 text-right">£{inv.subtotal_gbp.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">£{inv.vat_total_gbp.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-light text-slate-900">£{inv.total_gbp.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-light text-rose-600">£{inv.amount_outstanding_gbp.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-light ${
                        inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CreditCard, Download, CheckCircle2, Clock } from 'lucide-react';

export default function SupplierPortalBillingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // BILLING &amp; INVOICE LEDGER
              </span>
              <h1 className="text-2xl font-extralight text-slate-900 mt-1">
                Invoices &amp; Commercial Billing
              </h1>
            </div>

            <Link href="/supplier-portal/membership" className="text-xs font-mono text-brand-pink font-light underline">
              &larr; Return to Membership Profile
            </Link>
          </div>

          {/* Billing Profile & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">CURRENT BALANCE</span>
              <div className="text-2xl font-mono font-light text-emerald-600">£0.00</div>
              <span className="text-[10.5px] text-slate-500 font-mono">Account fully settled</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PAYMENT TERMS</span>
              <div className="text-xl font-mono font-light text-slate-900">30 Days</div>
              <span className="text-[10.5px] text-slate-500 font-mono">Standard Corporate Terms</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">BILLING CONTACT</span>
              <div className="text-sm font-normal text-slate-900 truncate">Finance Department</div>
              <span className="text-[10.5px] text-slate-500 font-mono truncate">accounts@supplier.co.uk</span>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                Issued Partner Invoices
              </h3>
              <span className="text-xs font-mono text-slate-500">1 Total Invoices</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-light text-slate-900">EFM-PN-2026-0001</td>
                    <td className="py-3 px-3 font-sans text-slate-700">Verified Network Membership (2026/27)</td>
                    <td className="py-3 px-3 text-slate-600">2026-01-01</td>
                    <td className="py-3 px-3 text-right font-light text-slate-900">£594.00</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded font-light bg-emerald-100 text-emerald-800">
                        PAID
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 text-[11px]">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

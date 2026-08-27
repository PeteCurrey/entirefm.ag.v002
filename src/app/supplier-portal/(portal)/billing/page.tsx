import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import { Receipt, FileText, Building2, CheckCircle2 } from 'lucide-react';
import { getSupplierOrganisationById } from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Commercial Remittances & Statements | EntireFM Supplier Portal',
  description: 'View work order payment remittances, contractor statements, and tax documentation.',
};

export default async function SupplierPortalBillingPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;

  const remittances: any[] = [];

  const financeContactName = session?.name || 'Primary Administrator';
  const financeContactEmail = session?.email || '—';

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          COMMERCIAL FINANCE &amp; LEDGER
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Remittances &amp; Statements
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Track work order remittances, contractor payment statements, and tax documentation for your EntireFM supplier account.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">REMITTANCE LEDGER</span>
          <div className="text-2xl font-medium text-emerald-600">
            Up to Date
          </div>
          <span className="text-[10.5px] text-slate-500 font-light">
            Direct BACS remittances on agreed terms
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">SETTLEMENT METHOD</span>
          <div className="text-xl font-light text-slate-900">
            BACS Electronic
          </div>
          <span className="text-[10.5px] text-slate-500 font-light">
            Verified Contractor Bank Account
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">ACCOUNT CONTACT</span>
          <div className="text-xs font-bold text-slate-900 truncate font-sans">{financeContactName}</div>
          <span className="text-[10.5px] text-slate-500 font-light truncate">{financeContactEmail}</span>
        </div>
      </div>

      {/* Remittances & Statements Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Work Order Remittance Statements
          </h3>
          <span className="text-xs font-light text-slate-500">{remittances.length} Total Record(s)</span>
        </div>

        {remittances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-light">
              <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Statement #</th>
                  <th className="p-3">Work Order</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total (inc. VAT)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {remittances.map((rem, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{rem.number}</td>
                    <td className="p-3 font-sans text-slate-700">{rem.workOrderRef}</td>
                    <td className="p-3 text-slate-500">{rem.date}</td>
                    <td className="p-3 font-bold text-slate-900">£{rem.totalGbp.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10.5px] px-2 py-0.5 rounded font-bold">SETTLED</span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-brand-pink font-bold hover:underline ml-auto text-[11px]">
                        Download Statement
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
            <p className="font-medium text-slate-700">No operational remittances generated yet.</p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Work order payment remittances and contractor statements will be listed here automatically once operational jobs are completed and authorized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import { listSupplierScorecards } from '@/server/suppliers/performance-store';
import { CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CommercialAccuracyPage() {
  const scorecards = await listSupplierScorecards();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          FINANCIAL ACCURACY
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Commercial Performance &amp; Invoice Matching
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Tracking first-time automated 3-way invoice matching against authorized purchase orders.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-mono text-xs">
          {scorecards.map((s) => (
            <div key={s.supplier_id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 font-sans">{s.supplier_name}</div>
                <span className="text-slate-500">Invoices Processed: {s.invoice_accuracy_rate.sample_size}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm block">{s.invoice_accuracy_rate.value}%</span>
                <span className="text-[10px] text-emerald-700 font-sans">First-Time Match</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

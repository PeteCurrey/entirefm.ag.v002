import React from 'react';
import { listAwardDecisions } from '@/server/allocation/allocation-store';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function AwardDecisionsPage() {
  const awards = await listAwardDecisions();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            HUMAN-IN-THE-LOOP AUTHORISATION
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Award Decisions &amp; Override Audit Ledger
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Authorised procurement awards with pre-dispatch compliance revalidation snapshots and override rationales.
          </p>
        </div>

        <CsvExportButton
          data={awards.map((a) => ({
            id: a.id,
            supplier: a.selected_supplier_name,
            reason: a.award_reason,
            basis: a.commercial_basis,
            awarded_by: a.awarded_by,
            awarded_at: a.awarded_at,
          }))}
          filename="entirefm-award-decisions.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-mono text-xs">
          {awards.map((a) => (
            <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans text-sm">{a.selected_supplier_name}</span>
                  <span className="text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> REVALIDATED PRE-DISPATCH
                  </span>
                </div>
                <p className="text-slate-600 font-sans">Award Reason: {a.award_reason.replace(/_/g, ' ')}</p>
                <span className="text-slate-400 text-[10.5px]">
                  Awarded By: {a.awarded_by} &middot; Timestamp: {a.awarded_at.substring(0, 16).replace('T', ' ')} &middot; Basis: {a.commercial_basis}
                </span>
              </div>

              <span className="text-slate-900 font-bold bg-slate-100 px-2.5 py-1 rounded text-xs self-start sm:self-auto">
                NTE: £{a.not_to_exceed_gbp || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

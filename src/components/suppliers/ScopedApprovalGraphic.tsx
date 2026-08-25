import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function ScopedApprovalGraphic() {
  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
      <div className="space-y-1 pb-4 border-b border-slate-200">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
          ASSURANCE CREDIBILITY
        </span>
        <h3 className="text-xl font-bold text-slate-900">
          Approval is Specific, Not Blanket.
        </h3>
        <p className="text-xs text-slate-600 font-light">
          EntireFM approves suppliers for defined service disciplines and verified geographic operating regions. Approval in one discipline does not grant unverified authority in another.
        </p>
      </div>

      {/* Scoped Grid Example */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans">HVAC &amp; Chillers</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-emerald-800 text-[11px] font-bold block">APPROVED</span>
          <p className="text-slate-500 text-[10.5px] font-sans">F-Gas, REFCOM &amp; RAMS verified.</p>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans">Manchester &amp; Leeds</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-emerald-800 text-[11px] font-bold block">AUTHORISED REGION</span>
          <p className="text-slate-500 text-[10.5px] font-sans">Verified engineer density.</p>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans">Gas Heating</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-amber-800 text-[11px] font-bold block">NOT APPROVED</span>
          <p className="text-slate-500 text-[10.5px] font-sans">Gas Safe schedule pending.</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans">London &amp; SE</span>
            <XCircle className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-slate-500 text-[11px] font-bold block">OUTSIDE SCOPE</span>
          <p className="text-slate-500 text-[10.5px] font-sans">No local coverage declared.</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ExecutiveSummaryProps {
  title?: string;
  badge?: string;
  takeaways: string[];
  statutoryReference?: string;
  operationalOutcome?: string;
}

export function ExecutiveSummary({
  title = 'Executive Summary & Core Takeaways',
  badge = 'Technical Digest',
  takeaways = [],
  statutoryReference,
  operationalOutcome,
}: ExecutiveSummaryProps) {
  return (
    <div className="my-10 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-l-4 border-l-pink-500 border-y border-r border-slate-800 rounded-r-xl shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-pink-400" />
          <h3 className="text-lg font-light text-white tracking-tight">{title}</h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700">
          {badge}
        </span>
      </div>

      <div className="space-y-3">
        {takeaways.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {(statutoryReference || operationalOutcome) && (
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {statutoryReference && (
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">
                Statutory / Standards Baseline
              </span>
              <span className="text-slate-300 font-light">{statutoryReference}</span>
            </div>
          )}
          {operationalOutcome && (
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">
                Target Operational Outcome
              </span>
              <span className="text-pink-400 font-light">{operationalOutcome}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

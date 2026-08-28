'use client';

import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  title?: string;
  badge?: string;
  takeaways: string[];
  statutoryReference?: string;
  operationalOutcome?: string;
}

export function ExecutiveSummary({
  title = 'Executive Summary & Strategic Takeaways',
  badge = 'Technical Digest',
  takeaways = [],
  statutoryReference,
  operationalOutcome,
}: ExecutiveSummaryProps) {
  return (
    <div className="my-10 p-8 sm:p-10 bg-brand-carbon/60 border-l-4 border-l-brand-pink border-y border-r border-brand-edge-dark rounded-r-sm text-white font-sans space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-brand-pink" />
          <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">{title}</h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30 font-medium">
          {badge}
        </span>
      </div>

      <div className="space-y-3.5">
        {takeaways.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {(statutoryReference || operationalOutcome) && (
        <div className="pt-6 border-t border-brand-edge-dark grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {statutoryReference && (
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
                Statutory &amp; Standards Baseline
              </span>
              <span className="text-slate-200 font-light">{statutoryReference}</span>
            </div>
          )}
          {operationalOutcome && (
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
                Target Operational Outcome
              </span>
              <span className="text-brand-pink font-light">{operationalOutcome}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

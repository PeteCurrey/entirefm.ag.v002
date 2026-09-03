import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

export interface ContractorQuickAnswerProps {
  question: string;
  summary: string;
  keyPoints?: string[];
  readTime?: string;
}

export function ContractorQuickAnswer({
  question,
  summary,
  keyPoints = [],
  readTime = '4 min read',
}: ContractorQuickAnswerProps) {
  return (
    <div className="bg-[#FAF9FB] border-l-4 border-l-[#EA580C] border-y border-r border-slate-200 p-6 sm:p-8 rounded-r-sm shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#EA580C] uppercase tracking-wider">
          <Zap className="w-4 h-4 text-[#EA580C]" />
          <span>Quick Summary // {readTime}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">UK Compliance Standard</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          {question}
        </h3>
        <p className="text-sm sm:text-[15px] font-light text-slate-700 leading-relaxed">
          {summary}
        </p>
      </div>

      {keyPoints.length > 0 && (
        <div className="pt-2 space-y-2">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
            Essential Takeaways:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-light">
            {keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

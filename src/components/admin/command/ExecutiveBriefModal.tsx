'use client';
import React, { useState } from 'react';
import type { ExecutiveBrief } from '@/server/ceo-command/executive-brief';
import { StatusDot } from '@/components/admin/DataTable';
import { X, Sparkles } from 'lucide-react';

interface Props {
  brief: ExecutiveBrief | null;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export function ExecutiveBriefModal({ brief, onGenerate, isGenerating, canGenerate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => { if (canGenerate) { setOpen(true); onGenerate(); } }}
        disabled={!canGenerate || isGenerating}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] text-[#111111] hover:bg-[#FAFAF8] text-[12px] font-normal transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#EA580C]" />
        <span>{isGenerating ? 'Generating…' : 'Executive Brief'}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] max-w-3xl w-full p-6 space-y-6 shadow-xl my-auto">
            <div className="flex items-start justify-between border-b border-[#E8E8E5] pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider mb-0.5">
                  EXECUTIVE BRIEFING · DETERMINISTIC AUDIT
                </div>
                <h2 className="text-xl font-extralight text-[#111111]">EntireFM Estate — Current Operational State</h2>
                {brief && (
                  <div className="text-[11.5px] text-[#6D6D68] mt-0.5 font-mono">
                    Generated: {new Date(brief.generated_at).toLocaleString('en-GB', { timeZone: 'Europe/London' })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {brief && (
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#E8E8E5] bg-[#FAFAF8] text-[#111111]">
                    {brief.overall_status}
                  </span>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-[4px] p-1 text-[#9A9A95] hover:text-[#111111] hover:bg-[#FAFAF8] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isGenerating && (
              <div className="py-12 text-center text-[#6D6D68] font-mono text-[12px] animate-pulse">
                Synthesising deterministic executive metrics across 408 estate data streams…
              </div>
            )}

            {!isGenerating && brief && (
              <div className="space-y-5 text-[13px] text-[#111111]">
                {brief.headline && (
                  <div className="p-4 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] leading-relaxed">
                    {brief.headline}
                  </div>
                )}

                {brief.sections && brief.sections.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-[#6D6D68] uppercase tracking-wider">Domain Observations</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {brief.sections.map((section, i) => (
                        <div key={i} className="p-3.5 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[12.5px] text-[#111111]">{section.title}</span>
                            <span className="font-mono text-[9.5px] uppercase tracking-wider px-1.5 py-0.2 rounded border border-[#E8E8E5] bg-[#FAFAF8] text-[#6D6D68]">
                              {section.status}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#6D6D68] leading-relaxed">{section.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10.5px] font-mono text-[#9A9A95] border-t border-[#E8E8E5] pt-3 flex items-center justify-between">
                  <span>{brief.signal_count} signal{brief.signal_count === 1 ? '' : 's'} detected · {brief.critical_signal_count} critical</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-[4px] bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#E8E8E5] text-[11px] text-[#111111] font-normal transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


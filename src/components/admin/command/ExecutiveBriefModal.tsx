'use client';
import React, { useState } from 'react';
import type { ExecutiveBrief } from '@/server/ceo-command/executive-brief';

interface Props {
  brief: ExecutiveBrief | null;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

const STATUS_STYLE: Record<string, string> = {
  GREEN: 'text-emerald-400',
  AMBER: 'text-amber-400',
  RED: 'text-rose-400',
  NO_DATA: 'text-brand-mist/40',
};

const DATA_STATUS_STYLE: Record<string, string> = {
  LIVE: 'text-emerald-400',
  ZERO: 'text-brand-mist/40',
  NO_DATA: 'text-brand-mist/30',
  NOT_CONFIGURED: 'text-sky-400/60',
};

export function ExecutiveBriefModal({ brief, onGenerate, isGenerating, canGenerate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => { if (canGenerate) { setOpen(true); onGenerate(); } }}
        disabled={!canGenerate || isGenerating}
        className="inline-flex items-center gap-2 px-4 py-2 rounded border border-brand-orange/30 text-brand-orange text-[12px] font-mono hover:bg-brand-orange/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {isGenerating ? 'Generating…' : 'Executive Brief'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-[#0E0E0E] border border-brand-edge-dark rounded-xl max-w-3xl w-full p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[9px] font-mono text-brand-mist/30 uppercase tracking-widest mb-1">Executive Brief</div>
                <h2 className="text-lg font-light text-white">EntireFM — Current State</h2>
                {brief && (
                  <div className="text-[11px] text-brand-mist/40 mt-0.5">
                    Generated: {new Date(brief.generated_at).toLocaleString('en-GB', { timeZone: 'Europe/London' })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {brief && (
                  <div className={`text-sm font-mono font-semibold ${STATUS_STYLE[brief.overall_status] || ''}`}>
                    {brief.overall_status}
                  </div>
                )}
                <button onClick={() => setOpen(false)} className="text-brand-mist/40 hover:text-white text-xl leading-none">×</button>
              </div>
            </div>

            {isGenerating && !brief && (
              <div className="text-center py-8 text-brand-mist/40 font-mono text-sm">Generating executive brief…</div>
            )}

            {brief && (
              <div className="space-y-4">
                {brief.sections.map((section, i) => (
                  <div key={i} className="rounded border border-brand-edge-dark/40 bg-brand-void/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[12.5px] font-semibold text-white">{section.title}</div>
                      <div className={`text-[9px] font-mono ${DATA_STATUS_STYLE[section.status] || 'text-brand-mist/40'}`}>
                        {section.status}
                      </div>
                    </div>
                    <p className="text-[12px] text-brand-mist/70 mb-3">{section.summary}</p>
                    {section.items.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex justify-between text-[11px]">
                            <span className="text-brand-mist/50">{item.label}</span>
                            <span className={`font-mono ${DATA_STATUS_STYLE[item.status || 'LIVE'] || 'text-white'}`}>
                              {typeof item.value === 'number' ? item.value.toLocaleString('en-GB') : item.value}
                              {item.unit && <span className="text-brand-mist/30 ml-1">{item.unit}</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="text-[10px] font-mono text-brand-mist/25 border-t border-brand-edge-dark/20 pt-3">
                  {brief.signal_count} signal{brief.signal_count === 1 ? '' : 's'} detected · {brief.critical_signal_count} critical
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

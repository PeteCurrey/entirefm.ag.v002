import React from 'react';
import { CAPABILITY_DISCIPLINES } from '@/components/suppliers/CapabilityLandscape';

export const dynamic = 'force-dynamic';

export default function CapabilitiesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          CANONICAL TAXONOMY
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Capability Taxonomy
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          The 8 structured capability disciplines and associated trade benchmarks governing supplier qualification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAPABILITY_DISCIPLINES.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">{d.eyebrow}</span>
              <h3 className="text-lg font-bold text-slate-900">{d.title}</h3>
              <p className="text-xs text-slate-600 mt-1 font-light">{d.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">GOVERNING TRADES</span>
              <div className="flex flex-wrap gap-1.5">
                {d.trades.map((t, idx) => (
                  <span key={idx} className="text-[10.5px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

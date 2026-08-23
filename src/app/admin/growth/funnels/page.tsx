import { Metadata } from 'next';
import Link from 'next/link';
import { getStandardFunnels } from '@/server/growth/store';
import { Layers, ArrowDown, Target } from 'lucide-react';

export const metadata: Metadata = { title: 'Conversion Funnels & Drop-Off | EntireFM Admin' };

export default async function FunnelsPage() {
  const funnels = await getStandardFunnels();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            STEP-BY-STEP CONVERSION &amp; DROP-OFF ANALYSIS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Commercial Conversion Funnels</h1>
          <p className="text-sm text-zinc-400">
            Audit where prospects drop off between search entrance, tool interactions, and form completion.
          </p>
        </div>
        <Link
          href="/admin/growth"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Growth Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {funnels.map((funnel) => (
          <div key={funnel.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{funnel.name}</h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {funnel.overallConversionRatePct}% Overall
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{funnel.description}</p>
            </div>

            <div className="space-y-3">
              {funnel.stages.map((stage, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">
                      {stage.stageNumber}. {stage.name}
                    </span>
                    <span className="font-mono text-pink-400 font-bold">{stage.visitors} users</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-pink-600 h-full rounded-full transition-all"
                      style={{ width: `${(stage.visitors / funnel.stages[0].visitors) * 100}%` }}
                    />
                  </div>
                  {idx < funnel.stages.length - 1 && (
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono py-0.5">
                      <span>↓ {stage.conversionRatePct}% pass-through</span>
                      <span className="text-red-400/80">{stage.dropOffCount} dropped</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

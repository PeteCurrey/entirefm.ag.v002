import { Metadata } from 'next';
import Link from 'next/link';
import { getCommercialRecommendations } from '@/server/growth/store';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

export const metadata: Metadata = { title: 'Commercial Insights & Actions | EntireFM Admin' };

export default async function CommercialInsightsPage() {
  const recommendations = await getCommercialRecommendations();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-pink-400 font-light">
            EVIDENCE-BASED OBSERVATIONS &amp; RECOMMENDATIONS
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Commercial Insights &amp; Recommendations</h1>
          <p className="text-sm text-zinc-400">
            Actionable optimization recommendations generated strictly from underlying conversion and search performance.
          </p>
        </div>
        <Link
          href="/admin/growth"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Growth Overview
        </Link>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-800/40 font-light">
                  {rec.type}
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-light">
                  {rec.priority}
                </span>
              </div>
              <span className="text-xs font-normal text-zinc-500">{rec.pagePath}</span>
            </div>

            <h3 className="text-base font-light text-white">{rec.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-zinc-500 font-medium text-[10px] uppercase block">Observed Pattern</span>
                <p className="text-zinc-300 leading-relaxed">{rec.observation}</p>
              </div>
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-pink-400 font-medium text-[10px] uppercase block">Recommended Action</span>
                <p className="text-zinc-200 leading-relaxed font-normal">{rec.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

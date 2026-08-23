import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Competitor Topic Gaps | EntireFM Admin' };

export default function ContentGapsPage() {
  const gaps = intelligenceStore.competitorGaps;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Competitor &amp; Industry Topic Gaps</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Tracking public FM competitor footprints for genuine topic opportunities (No rewriting / zero copycatting)
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Overview
        </Link>
      </div>

      <div className="space-y-4">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{gap.topic}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">
                    Competitors Covering: <strong className="text-zinc-300">{gap.competitorsCovering.join(', ')}</strong>
                  </span>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500">
                    EntireFM Coverage: <strong className="text-blue-400">{gap.entireFmCoverage}</strong>
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-900/40 text-blue-300">
                {gap.priority}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/40">
              <div>
                <span className="text-zinc-500 block mb-0.5">Search Relevance:</span>
                <span className="text-zinc-300">{gap.searchRelevance}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-0.5">Commercial Impact:</span>
                <span className="text-zinc-300">{gap.commercialRelevance}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
              <span className="text-zinc-400">Action: {gap.recommendedAction}</span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg">
                Create Editorial Opportunity →
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

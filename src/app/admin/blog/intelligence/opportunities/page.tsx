import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Query & Content Opportunities | EntireFM Admin' };

export default function OpportunitiesPage() {
  const opportunities = intelligenceStore.opportunities;

  const decisionBadge = (d: string) => {
    if (d.startsWith('UPDATE') || d.startsWith('EXPAND')) return 'bg-blue-900/40 text-blue-300';
    if (d.startsWith('CREATE')) return 'bg-purple-900/40 text-purple-300';
    if (d.startsWith('IMPROVE')) return 'bg-emerald-900/40 text-emerald-300';
    return 'bg-zinc-800 text-zinc-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Search-Query Opportunity Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real search demand mapped against existing EntireFM page authority (Existing URL First policy)
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
        {opportunities.map((opp) => (
          <div key={opp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-normal text-white">&ldquo;{opp.query}&rdquo;</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-normal${decisionBadge(opp.decision)}`}>
                    {opp.decision}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-normal bg-red-900/40 text-red-300">
                    {opp.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                  <span>Origin: <strong className="text-zinc-400">{opp.originSource}</strong></span>
                  {opp.targetPagePath && (
                    <>
                      <span>·</span>
                      <span>Target: <code className="text-blue-400">{opp.targetPagePath}</code></span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex gap-2">
                <button className="text-xs bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 px-3 py-1.5 rounded-lg">
                  Accept Decision
                </button>
                <button className="text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 px-3 py-1.5 rounded-lg">
                  Dismiss
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
              💡 {opp.recommendedAction}
            </p>

            {opp.suggestedTitle && (
              <div className="text-xs text-zinc-400">
                <span className="text-zinc-500">Suggested Title Update:</span> {opp.suggestedTitle}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Topic Cluster Performance | EntireFM Admin' };

export default function TopicClustersPage() {
  const clusters = intelligenceStore.clusters;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Topic Cluster Architecture</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Evaluating performance and topical authority across all 11 core FM domains
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((c) => (
          <div key={c.cluster} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{c.name}</h3>
                <span className="text-xs text-zinc-500 font-mono">{c.cluster}</span>
              </div>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">
                {c.totalPages} URLs
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 bg-zinc-800/40 p-2.5 rounded-lg">
                <span>Top Pillar Page:</span>
                <code className="text-blue-400">{c.topPage}</code>
              </div>
              <div className="flex justify-between text-zinc-400 bg-zinc-800/40 p-2.5 rounded-lg">
                <span>Weakest Node:</span>
                <code className="text-yellow-400">{c.weakestPage}</code>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>{c.newOpportunitiesCount} open topic opportunities</span>
              <span className="text-emerald-400 font-medium">Trend: {c.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

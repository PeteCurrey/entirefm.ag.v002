import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Content Freshness Radar | EntireFM Admin' };

export default function FreshnessPage() {
  const items = intelligenceStore.getFreshnessOverview();

  const statusBadge = (s: string) => {
    if (s === 'CURRENT' || s === 'EVERGREEN') return 'bg-emerald-900/40 text-emerald-300';
    if (s === 'REVIEW_SOON') return 'bg-yellow-900/40 text-yellow-300';
    if (s === 'UPDATE_REQUIRED' || s === 'STALE') return 'bg-red-900/40 text-red-300';
    return 'bg-zinc-800 text-zinc-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Content Freshness &amp; Lifecycle Radar</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Tracking regulatory shifts, publication age, and stale technical references across the estate
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Overview
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Page Title / URL</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Status</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Last Updated</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Freshness Signals</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <div className="text-white font-normal">{item.title}</div>
                  <code className="text-xs text-zinc-500">{item.pagePath}</code>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-normal${statusBadge(item.freshnessStatus)}`}>
                    {item.freshnessStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{item.lastUpdated}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {item.signals.join(', ')}
                </td>
                <td className="px-4 py-3 text-xs text-blue-400">
                  {item.suggestedAction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

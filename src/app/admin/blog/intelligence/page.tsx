import { Metadata } from 'next';
import Link from 'next/link';
import { getGscStatus, getGa4Status, intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Content Intelligence & SEO Feedback | EntireFM Admin' };

export default function ContentIntelligenceDashboard() {
  const gsc = getGscStatus();
  const ga4 = getGa4Status();
  const briefing = intelligenceStore.getWeeklyBriefing();
  const opportunities = intelligenceStore.opportunities;
  const gaps = intelligenceStore.competitorGaps;
  const clusters = intelligenceStore.clusters;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Content Intelligence &amp; Growth Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real performance measurement, search intent opportunities, and continuous feedback loop
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/intelligence/weekly"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-normal transition-colors"
          >
            Weekly Briefing →
          </Link>
        </div>
      </div>

      {/* Integration Connections Panel (NO MOCK DATA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Search Console Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <h2 className="text-sm font-normal text-white">Google Search Console</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                gsc.status === 'CONNECTED'
                  ? 'bg-emerald-900/40 text-emerald-300'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {gsc.status === 'CONNECTED' ? 'CONNECTED' : 'NOT CONNECTED'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">{gsc.message}</p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between">
            <span>Property: {gsc.property}</span>
            <span>Auth: Environment Keys</span>
          </div>
        </div>

        {/* Google Analytics 4 Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h2 className="text-sm font-normal text-white">Google Analytics 4</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                ga4.status === 'CONNECTED'
                  ? 'bg-emerald-900/40 text-emerald-300'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {ga4.status === 'CONNECTED' ? 'CONNECTED' : 'NOT CONNECTED'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">{ga4.message}</p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between">
            <span>Property ID: {ga4.propertyId || 'None'}</span>
            <span>Commercial Events: Configured</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Sub-Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Search Opportunities', href: '/admin/blog/intelligence/opportunities', icon: '🎯' },
          { label: 'Content Decay', href: '/admin/blog/intelligence/decay', icon: '📉' },
          { label: 'Cannibalisation', href: '/admin/blog/intelligence/cannibalisation', icon: '⚔️' },
          { label: 'Topic Clusters', href: '/admin/blog/intelligence/clusters', icon: '📁' },
          { label: 'Content Gaps', href: '/admin/blog/intelligence/content-gaps', icon: '💡' },
          { label: 'Freshness Radar', href: '/admin/blog/intelligence/freshness', icon: '🕒' },
        ].map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors"
          >
            <span className="text-xl">{m.icon}</span>
            <span className="text-xs text-zinc-300 font-normal">{m.label}</span>
          </Link>
        ))}
      </div>

      {/* Top Search & Intent Opportunities */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">
            Active Query &amp; Content Opportunities ({opportunities.length})
          </h2>
          <Link
            href="/admin/blog/intelligence/opportunities"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-zinc-800/50 border border-zinc-700/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-normal text-white">{opp.query}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono">
                    {opp.decision}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/40 text-red-300 font-mono">
                    {opp.priority}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{opp.recommendedAction}</p>
                {opp.targetPagePath && (
                  <div className="text-[11px] text-zinc-500">
                    Existing Target: <code className="text-zinc-300">{opp.targetPagePath}</code>
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href="/admin/blog/ai-queue"
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-normal"
                >
                  Send to Editorial Queue →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Clusters Performance Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">
            Topic Cluster Architecture &amp; Coverage
          </h2>
          <Link
            href="/admin/blog/intelligence/clusters"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Detailed cluster view →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div key={c.cluster} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-normal text-white">{c.name}</h3>
                <span className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                  {c.totalPages} URLs
                </span>
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-700/50">
                <span>Pillar: <code className="text-blue-400">{c.topPage}</code></span>
                <span className="text-emerald-400">{c.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

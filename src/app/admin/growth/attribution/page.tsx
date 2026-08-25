import { Metadata } from 'next';
import Link from 'next/link';
import { listExtendedLeads } from '@/server/growth/store';
import { Layers, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

export const metadata: Metadata = { title: 'Attribution Models | EntireFM Admin' };

export default async function AttributionModelsPage() {
  const { leads } = await listExtendedLeads({ limit: 200, excludeSpam: true });

  const firstTouchMap: Record<string, number> = {};
  const lastTouchMap: Record<string, number> = {};
  const assistedMap: Record<string, number> = {};

  for (const l of leads) {
    const ft = l.first_touch_url || l.landing_page || 'Direct';
    const lt = l.conversion_page || l.last_touch_url || 'Direct';
    firstTouchMap[ft] = (firstTouchMap[ft] || 0) + 1;
    lastTouchMap[lt] = (lastTouchMap[lt] || 0) + 1;

    for (const a of l.assisted_pages || []) {
      assistedMap[a] = (assistedMap[a] || 0) + 1;
    }
  }

  const topFirst = Object.entries(firstTouchMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topLast = Object.entries(lastTouchMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topAssisted = Object.entries(assistedMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-light">
            MULTI-TOUCH ATTRIBUTION · NO SINGLE-TOUCH BIAS
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Multi-Touch Attribution Intelligence</h1>
          <p className="text-sm text-zinc-400">
            Compare First Touch (Acquisition), Last Touch (Conversion), and Assisted Content paths.
          </p>
        </div>
        <Link
          href="/admin/growth"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Growth Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model 1: First Touch */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-normal text-pink-400 uppercase tracking-wider">
              1. First Touch (Acquisition)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Initial landing pages that brought prospects into the EntireFM ecosystem.
            </p>
          </div>

          {topFirst.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">No data yet.</div>
          ) : (
            <div className="space-y-2">
              {topFirst.map(([path, count]) => (
                <div key={path} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs flex justify-between">
                  <span className="font-mono text-zinc-300 truncate max-w-[200px]">{path}</span>
                  <span className="font-light text-pink-400 font-mono">{count} leads</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model 2: Assisted Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-normal text-purple-400 uppercase tracking-wider">
              2. Assisted Content (Influence)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Articles, guides, and tools engaged prior to final submission.
            </p>
          </div>

          {topAssisted.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">No assisted touchpoints recorded yet.</div>
          ) : (
            <div className="space-y-2">
              {topAssisted.map(([path, count]) => (
                <div key={path} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs flex justify-between">
                  <span className="font-mono text-zinc-300 truncate max-w-[200px]">{path}</span>
                  <span className="font-light text-purple-400 font-mono">{count} assists</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model 3: Last Touch */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-normal text-blue-400 uppercase tracking-wider">
              3. Last Touch (Conversion)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              The page where the prospect finalized and submitted the enquiry.
            </p>
          </div>

          {topLast.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">No data yet.</div>
          ) : (
            <div className="space-y-2">
              {topLast.map(([path, count]) => (
                <div key={path} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs flex justify-between">
                  <span className="font-mono text-zinc-300 truncate max-w-[200px]">{path}</span>
                  <span className="font-light text-blue-400 font-mono">{count} converts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

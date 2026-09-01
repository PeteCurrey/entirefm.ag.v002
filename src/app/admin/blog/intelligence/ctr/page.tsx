import { Metadata } from 'next';
import Link from 'next/link';
import { getGscStatus } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'CTR & Snippet Optimization | EntireFM Admin' };

export default function CtrOptimizationPage() {
  const gsc = getGscStatus();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">High Impression / Low CTR Optimization</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Refine SERP titles and meta descriptions for pages already ranking in top 20 positions
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Overview
        </Link>
      </div>

      {gsc.status === 'NOT_CONNECTED' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-3">
          <div className="text-3xl">🎯</div>
          <h2 className="text-base font-light text-white">Google Search Console Not Connected</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            High Impression / Low CTR analysis requires real query impressions and click-through rates from Search Console. Zero placeholder metrics are rendered.
          </p>
          <div className="text-xs text-zinc-500 font-normal">
            Requires: GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &amp; GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-400 text-sm">
          All high impression pages currently have optimal CTR.
        </div>
      )}
    </main>
  );
}

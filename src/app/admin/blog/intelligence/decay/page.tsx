import { Metadata } from 'next';
import Link from 'next/link';
import { getGscStatus } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Content Decay Monitor | EntireFM Admin' };

export default function ContentDecayPage() {
  const gsc = getGscStatus();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Decay Detection</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Automatic tracking for articles or compliance pages losing search visibility over time
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
          <div className="text-3xl">📉</div>
          <h2 className="text-base font-semibold text-white">Google Search Console Not Connected</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Content decay detection relies on real period-over-period click and impression drops from Google Search Console. Zero mock data is generated.
          </p>
          <div className="text-xs text-zinc-500 font-mono">
            Requires: GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &amp; GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-400 text-sm">
          No content decay detected across the estate.
        </div>
      )}
    </main>
  );
}

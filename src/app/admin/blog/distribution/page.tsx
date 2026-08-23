import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Content Distribution | EntireFM Admin' };

export default function ContentDistributionPage() {
  const publishedPosts = Array.from(memoryStore.posts.values()).filter(p => p.status === 'PUBLISHED');

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Post-Publication Distribution Control</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Managed syndication, LinkedIn drafts, newsletter queue, and homepage featured placements
          </p>
        </div>
        <Link
          href="/admin/blog"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Blog Dashboard
        </Link>
      </div>

      {/* Distribution Channels Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">RSS &amp; XML Feeds</h3>
            <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded font-mono">ACTIVE</span>
          </div>
          <p className="text-xs text-zinc-400">Live feeds serving at /rss.xml and /feed.xml</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">LinkedIn Syndication</h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">DRAFTS ONLY</span>
          </div>
          <p className="text-xs text-zinc-400">Editorial drafts generated for human review; no auto-posting.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">Newsletter Queue</h3>
            <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded font-mono">INTEGRATED</span>
          </div>
          <p className="text-xs text-zinc-400">Select published articles for periodic trade digest.</p>
        </div>
      </div>

      {/* Published Articles Available for Distribution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          Published Articles ({publishedPosts.length})
        </h2>

        <div className="divide-y divide-zinc-800">
          {publishedPosts.map((post) => (
            <div key={post.id} className="py-4 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-white">{post.title}</h4>
                <div className="text-xs text-zinc-500 mt-1">/post/{post.slug}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg">
                  Copy LinkedIn Draft
                </button>
                <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg">
                  Add to Newsletter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Internal Link Opportunities | EntireFM Admin' };

export default function InternalLinksOpportunityPage() {
  const links = intelligenceStore.getInternalLinkOpportunities();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Internal Link Opportunity Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Contextual link recommendations strengthening topic clusters and commercial bridges without spam
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
        {links.map((link, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>Source: <code className="text-white">{link.sourcePage}</code></span>
                  <span>→</span>
                  <span>Target: <code className="text-blue-400">{link.targetPage}</code></span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Anchor: <strong className="text-white">&ldquo;{link.suggestedAnchor}&rdquo;</strong>
                </div>
              </div>
              <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg">
                Insert Link →
              </button>
            </div>

            <p className="text-xs text-zinc-300 italic bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/40">
              &ldquo;{link.contextSnippet}&rdquo;
            </p>

            <div className="text-[11px] text-zinc-500">
              Reason: {link.relevanceReason}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

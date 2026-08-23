'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/content/blog/posts';
import {
  Share2,
  Copy,
  CheckCircle2,
  Mail,
  Radio,
  Globe,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function ContentDistributionPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [linkedinDraft, setLinkedinDraft] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleGenerateLinkedIn = async (post: any) => {
    setSelectedPost(post);
    setGenerating(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/admin/blog/social-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          category: post.category,
          dek: post.dek,
          sections: post.sections,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setLinkedinDraft(data.draft.postCopy);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyDraft = () => {
    if (!linkedinDraft) return;
    navigator.clipboard.writeText(linkedinDraft);
    setCopiedId('modal-draft');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            POST-PUBLICATION SYNDICATION
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Multi-Channel Distribution</h1>
          <p className="text-sm text-zinc-400">
            Generate B2B LinkedIn posts, feed the weekly FM Briefing newsletter, and syndicate via live RSS.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-semibold px-3 py-2 rounded-lg"
          >
            The FM Briefing
          </Link>
          <Link
            href="/admin/blog"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Blog Dashboard
          </Link>
        </div>
      </div>

      {/* Distribution Channels Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-emerald-400" /> RSS / XML
            </h3>
            <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded font-mono">
              LIVE (200)
            </span>
          </div>
          <p className="text-xs text-zinc-400">Syndicating all 2026 published articles to /rss.xml and /feed.xml.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-blue-400" /> LinkedIn
            </h3>
            <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded font-mono">
              DRAFTS READY
            </span>
          </div>
          <p className="text-xs text-zinc-400">Generates technical, B2B engineering angles for editorial review.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-pink-400" /> The FM Briefing
            </h3>
            <span className="text-[10px] bg-pink-900/40 text-pink-300 px-2 py-0.5 rounded font-mono">
              INTEGRATED
            </span>
          </div>
          <p className="text-xs text-zinc-400">Weekly automated compilation of high-impact articles &amp; tools.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-purple-400" /> Web Feeds
            </h3>
            <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded font-mono">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400">Contextual featured cards in Blog and Resource hubs.</p>
        </div>
      </div>

      {/* Published Articles Distribution Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Published Articles Available for Distribution ({BLOG_POSTS.length})
          </h3>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Article Title &amp; Path</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Published Date</th>
              <th className="py-3 px-4 text-right">Syndication Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {BLOG_POSTS.map((post) => (
              <tr key={post.slug} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-sm">{post.title}</div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{post.path}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {post.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-zinc-400 font-mono">{post.published}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleGenerateLinkedIn(post)}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-blue-300 px-3 py-1.5 rounded font-semibold border border-zinc-700 flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3 w-3" /> LinkedIn Draft
                    </button>
                    <Link
                      href={`/admin/newsletter/new?source=${encodeURIComponent(post.path)}`}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-pink-300 px-3 py-1.5 rounded font-semibold border border-zinc-700 flex items-center gap-1.5"
                    >
                      <Mail className="h-3 w-3" /> Add to Newsletter
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LinkedIn Draft Modal / Drawer */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Generated LinkedIn Post</h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Substantive B2B post structured with key engineering considerations and direct UTM-tagged link.
            </p>

            {generating ? (
              <div className="p-8 text-center text-zinc-500 text-xs">Generating LinkedIn copy...</div>
            ) : (
              <textarea
                rows={12}
                value={linkedinDraft}
                onChange={(e) => setLinkedinDraft(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-200 font-sans leading-relaxed focus:border-blue-500 focus:outline-none"
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">
                {copiedId === 'modal-draft' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Copied to clipboard
                  </span>
                ) : (
                  'Ready to paste into LinkedIn Campaign Manager or Company Page'
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyDraft}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Post Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

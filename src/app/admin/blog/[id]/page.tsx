'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const routeParams = useParams();
  const postId = routeParams?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/admin/blog/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setPost(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`/api/admin/blog/posts/${postId}/revisions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRevisions(data);
      })
      .catch(() => {});
  }, [postId]);

  const handleSave = async (targetStatus?: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          ...(targetStatus ? { status: targetStatus } : {}),
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setPost(data);
        // Refresh revisions
        fetch(`/api/admin/blog/posts/${postId}/revisions`)
          .then((r) => r.json())
          .then((revs) => Array.isArray(revs) && setRevisions(revs));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-400 text-sm">Loading post details...</div>;
  }

  if (!post) {
    return (
      <div className="p-8 space-y-3">
        <h2 className="text-lg font-light text-white">Post Not Found</h2>
        <Link href="/admin/blog/posts" className="text-xs text-blue-400">
          ← Back to All Posts
        </Link>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-light text-white">Edit Post</h1>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
              {post.status}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">/post/{post.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/posts" className="text-xs text-zinc-400 hover:text-white px-3 py-2">
            ← All Posts
          </Link>
          <a
            href={`/post/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg font-normal"
          >
            Preview Live ↗
          </a>
          <Link
            href={`/admin/blog/distribution`}
            className="text-xs bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border border-pink-800/60 px-3 py-2 rounded-lg font-normal"
          >
            Distribute ↗
          </Link>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {post.status !== 'PUBLISHED' && (
            <button
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Publish Post
            </button>
          )}
        </div>
      </div>

      {/* 70/30 Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Article Title (H1)
              </label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Summary / Excerpt
              </label>
              <textarea
                rows={2}
                value={post.excerpt || ''}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Article Content (Markdown)
              </label>
              <textarea
                rows={18}
                value={post.content || ''}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Revision History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
              Revision History ({revisions.length})
            </h3>
            <div className="divide-y divide-zinc-800">
              {revisions.length === 0 && (
                <p className="text-xs text-zinc-500 py-3">No revisions recorded yet.</p>
              )}
              {revisions.map((rev) => (
                <div key={rev.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-normal">Rev #{rev.revisionNumber}</span>
                    <span className="text-zinc-500 ml-2">· {rev.changeSummary}</span>
                  </div>
                  <span className="text-zinc-600">
                    {new Date(rev.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* SEO Performance Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
                SEO & SERP Preview
              </h3>
              <span className="text-xs font-normal text-blue-400">Score: {post.seoScore || 0}/100</span>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Primary Keyword</label>
              <input
                type="text"
                value={post.primaryKeyword || ''}
                onChange={(e) => setPost({ ...post, primaryKeyword: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">SEO Title</label>
              <input
                type="text"
                value={post.seoTitle || ''}
                onChange={(e) => setPost({ ...post, seoTitle: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={post.metaDescription || ''}
                onChange={(e) => setPost({ ...post, metaDescription: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Live SERP Snippet Preview */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-1">
              <div className="text-[11px] text-zinc-400">
                https://www.entirefm.com › post › {post.slug}
              </div>
              <div className="text-xs font-normal text-blue-400 truncate">
                {post.seoTitle || post.title}
              </div>
              <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {post.metaDescription || post.excerpt}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
              Featured Image
            </h3>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Image Path</label>
              <input
                type="text"
                value={post.featuredImage || ''}
                onChange={(e) => setPost({ ...post, featuredImage: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Alt Text</label>
              <input
                type="text"
                value={post.featuredImageAlt || ''}
                onChange={(e) => setPost({ ...post, featuredImageAlt: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

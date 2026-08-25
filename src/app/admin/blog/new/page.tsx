'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/images/editorial/entirefm-switchroom-survey-2000w.webp');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60));
    }
  };

  const handleSave = async (targetStatus: string = status) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          primaryKeyword,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt,
          featuredImage,
          featuredImageAlt,
          status: targetStatus,
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/admin/blog/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-light text-white">Create New Post</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Authoritative facilities management insights & trade guidance</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/posts" className="text-xs text-zinc-400 hover:text-white px-3 py-2">
            Cancel
          </Link>
          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving || !title}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('PUBLISHED')}
            disabled={saving || !title}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Publish Now
          </button>
        </div>
      </div>

      {/* 70/30 Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Article Title (H1)
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Commercial Heat Pump Retrofits: Acoustic Attenuation and Rooftop Structural Loadings"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
                <span className="text-zinc-500 text-xs mr-1">/post/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent text-white w-full focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Summary / Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Executive briefing paragraph for SERPs and topic summaries..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-400 uppercase tracking-wider mb-1.5">
                Article Content (Markdown)
              </label>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste high-standard FM article copy here..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white font-mono placeholder-zinc-500 text-xs leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar — Controls & SEO (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* SEO Metadata Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">SEO & SERP Preview</h3>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Primary Keyword</label>
              <input
                type="text"
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                placeholder="e.g. commercial heat pump retrofit"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">SEO Title ({seoTitle.length}/60)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title ? `${title.slice(0, 50)} | EntireFM` : 'Title | EntireFM'}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Meta Description ({metaDescription.length}/155)</label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Compelling SERP description..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-1">
              <div className="text-[11px] text-zinc-400">https://www.entirefm.com › post › {slug || 'article-slug'}</div>
              <div className="text-xs font-normal text-blue-400 truncate">{seoTitle || title || 'Article Title Preview'}</div>
              <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || 'Search snippet description preview...'}
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">Featured Image</h3>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Image URL</label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Descriptive explanation of the image..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

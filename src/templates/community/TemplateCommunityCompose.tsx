'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  Lock,
  ArrowLeft,
  Send,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export function TemplateCommunityCompose() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('general-fm');
  const [tagsInput, setTagsInput] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/community/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    try {
      const res = await fetch('/api/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          categorySlug,
          tags,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/lobby/community/discussion/${data.discussion.slug}`);
      } else if (res.status === 401) {
        window.location.href = '/sign-in?redirect=/lobby/community/new';
      } else {
        setError(data.error || 'Failed to publish discussion.');
      }
    } catch (err) {
      console.error('Error submitting discussion:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 w-full">
        <Link
          href="/lobby/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-silver hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Community
        </Link>

        <div className="bg-brand-graphite/25 border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
              The Lobby Community
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Start a Technical Discussion
            </h1>
            <p className="text-xs sm:text-sm text-brand-silver mt-1.5">
              Ask verified facilities management peers for practical experience, technical guidance, or compliance insights.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Discussion Title / Technical Question <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How much asset data do you insist on before mobilisation sign-off?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3.5 bg-brand-void border border-white/10 rounded-lg text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
              />
              <p className="text-[11px] text-brand-silver mt-1.5">
                Be specific. Mention the plant type, statutory code, or commercial context where relevant.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-semibold mb-2">
                FM Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full p-3.5 bg-brand-void border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-electric"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Topic Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. HVAC, AHU, SFG20, Mobilisation"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full p-3.5 bg-brand-void border border-white/10 rounded-lg text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white font-semibold">
                  Discussion Context & Details <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-brand-silver">Markdown formatting supported</span>
              </div>

              {/* Good question helper card */}
              <div className="mb-3 p-3.5 rounded-lg bg-white/5 border border-white/5 text-xs text-brand-silver space-y-1">
                <p className="font-medium text-brand-mist flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-electric" />
                  A high-value question usually includes:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-brand-silver">
                  <li>What you are trying to achieve or troubleshoot</li>
                  <li>Relevant estate, system, or contractual context</li>
                  <li>What technical options you have already evaluated</li>
                </ul>
              </div>

              <textarea
                required
                rows={8}
                placeholder="Describe the operational challenge, statutory considerations, or technical measurements..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-4 bg-brand-void border border-white/10 rounded-lg text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Confidentiality notice */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Confidentiality reminder:</strong> Keep client, site, and commercial partner names strictly confidential. Do not upload sensitive security blueprints or unredacted contract values.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Link
                href="/lobby/community"
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-brand-silver hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || !title || !body}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold bg-brand-electric text-white hover:bg-brand-electric/90 disabled:opacity-50 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Publishing...' : 'Publish to Community'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

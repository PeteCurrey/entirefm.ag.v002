'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  CheckCircle2,
  Share2,
  Flag,
  ArrowLeft,
  Quote,
  Star,
  Send,
  ShieldCheck,
  Wrench,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function TemplateCommunityDiscussion({ slug }: { slug: string }) {
  const [discussion, setDiscussion] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: string; id: string } | null>(null);
  const [reportReason, setReportReason] = useState('spam_promotion');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [quoteSnippet, setQuoteSnippet] = useState<{ author: string; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [discRes, repRes] = await Promise.all([
          fetch(`/api/community/discussions/${slug}`),
          fetch(`/api/community/discussions/${slug}/replies`),
        ]);
        const discData = await discRes.json();
        const repData = await repRes.json();
        setDiscussion(discData.discussion || null);
        setReplies(repData.replies || []);
      } catch (err) {
        console.error('Error fetching discussion:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  async function handleHelpful(replyId: string) {
    try {
      const res = await fetch(`/api/community/replies/${replyId}/helpful`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setReplies((prev) =>
          prev.map((r) => (r.id === replyId ? { ...r, helpfulCount: data.newCount } : r))
        );
      } else if (res.status === 401) {
        window.location.href = `/sign-in?redirect=/lobby/community/discussion/${slug}`;
      }
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  }

  async function handleAcceptAnswer(replyId: string) {
    if (!discussion) return;
    try {
      const res = await fetch(`/api/community/replies/${replyId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discussionId: discussion.id }),
      });
      if (res.ok) {
        setDiscussion((prev: any) => ({ ...prev, solved: true, acceptedReplyId: replyId }));
        setReplies((prev) =>
          prev.map((r) => ({ ...r, isAcceptedAnswer: r.id === replyId }))
        );
      }
    } catch (err) {
      console.error('Error accepting answer:', err);
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !discussion) return;
    setSubmittingReply(true);

    try {
      const payload: any = { body: replyText };
      if (quoteSnippet) {
        payload.replyToMemberName = quoteSnippet.author;
      }

      const res = await fetch(`/api/community/discussions/${slug}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setReplies((prev) => [...prev, data.reply]);
        setReplyText('');
        setQuoteSnippet(null);
      } else if (res.status === 401) {
        window.location.href = `/sign-in?redirect=/lobby/community/discussion/${slug}`;
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  }

  async function handleSendReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportTarget) return;

    try {
      const res = await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedContentType: reportTarget.type,
          reportedContentId: reportTarget.id,
          reason: reportReason,
          reporterNotes: reportNotes,
        }),
      });

      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSuccess(false);
          setReportTarget(null);
          setReportNotes('');
        }, 1500);
      }
    } catch (err) {
      console.error('Error sending report:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center py-20 text-sm text-brand-silver">
          Loading discussion thread...
        </div>
        <Footer />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-white">Discussion not found</h1>
          <Link href="/lobby/community" className="mt-4 inline-block text-xs font-semibold text-brand-electric">
            ← Return to Community Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const acceptedReply = replies.find((r) => r.isAcceptedAnswer);

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Discussion Header */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs mb-3">
              <Link
                href="/lobby/community"
                className="text-brand-silver hover:text-white transition-colors"
              >
                Community
              </Link>
              <span className="text-white/20">/</span>
              <Link
                href={`/lobby/community/${discussion.categorySlug}`}
                className="font-semibold text-brand-electric hover:underline"
              >
                {discussion.categoryName}
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 max-w-4xl">
                <div className="flex items-center gap-2">
                  {discussion.solved && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Solved Discussion
                    </span>
                  )}
                  <span className="text-xs text-brand-silver">
                    Opened {new Date(discussion.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  {discussion.title}
                </h1>

                {/* Author Metadata Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-brand-electric/20 border border-brand-electric/40 flex items-center justify-center text-sm font-bold text-brand-electric">
                    {discussion.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{discussion.authorName}</span>
                      {discussion.authorBadge && (
                        <span className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] text-brand-mist border border-white/10">
                          {discussion.authorBadge}
                        </span>
                      )}
                    </div>
                    {discussion.authorHeadline && (
                      <p className="text-xs text-brand-silver">{discussion.authorHeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Discussion URL copied to clipboard');
                  }}
                  className="px-3 py-2 rounded-lg bg-brand-graphite/40 text-xs text-brand-silver hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    setReportTarget({ type: 'discussion', id: discussion.id });
                    setReportModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-brand-graphite/40 text-xs text-brand-silver hover:text-rose-400 border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Discussion Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Original Post + Replies */}
            <div className="lg:col-span-8 space-y-8">
              {/* Original Post Card */}
              <div className="bg-brand-graphite/20 border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="prose prose-invert max-w-none text-brand-mist text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {discussion.body}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                  {discussion.tags?.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-brand-mist">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accepted Answer Highlight Box (if solved) */}
              {acceptedReply && (
                <div className="bg-emerald-950/20 border-2 border-emerald-500/40 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Community Accepted Answer
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {acceptedReply.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">{acceptedReply.authorName}</span>
                      {acceptedReply.authorHeadline && (
                        <p className="text-xs text-brand-silver">{acceptedReply.authorHeadline}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-brand-mist leading-relaxed whitespace-pre-line">
                    {acceptedReply.body}
                  </p>

                  <div className="text-xs text-brand-silver pt-2 border-t border-white/5 flex items-center justify-between">
                    <span>★ Marked as helpful by {acceptedReply.helpfulCount} practitioners</span>
                    <span className="text-[11px] text-emerald-400/80">Verified practitioner solution</span>
                  </div>
                </div>
              )}

              {/* Replies Stream */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-electric" />
                    Practitioner Responses ({replies.length})
                  </h2>
                </div>

                {replies.length === 0 ? (
                  <div className="bg-brand-graphite/10 border border-white/5 rounded-xl p-8 text-center text-sm text-brand-silver">
                    No replies yet. Be the first to share your engineering experience.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`bg-brand-graphite/20 border rounded-xl p-6 space-y-4 transition-all ${
                          reply.isAcceptedAnswer
                            ? 'border-emerald-500/40 bg-emerald-950/10'
                            : 'border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-electric/20 text-brand-electric flex items-center justify-center text-xs font-bold">
                              {reply.authorName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">{reply.authorName}</span>
                                {reply.isEntireFMOfficial && (
                                  <span className="px-1.5 py-0.2 rounded bg-brand-electric/20 text-brand-electric text-[10px] font-bold border border-brand-electric/40">
                                    EntireFM Official
                                  </span>
                                )}
                              </div>
                              {reply.authorHeadline && (
                                <p className="text-xs text-brand-silver">{reply.authorHeadline}</p>
                              )}
                            </div>
                          </div>

                          <span className="text-xs text-brand-silver">
                            {new Date(reply.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>

                        {reply.replyToMemberName && (
                          <div className="px-3 py-1.5 rounded bg-white/5 border-l-2 border-brand-electric text-xs text-brand-silver">
                            Replying to {reply.replyToMemberName}
                          </div>
                        )}

                        <div className="text-sm text-brand-mist leading-relaxed whitespace-pre-line">
                          {reply.body}
                        </div>

                        {/* Reply Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleHelpful(reply.id)}
                              className="px-3 py-1.5 rounded-lg bg-brand-graphite/40 hover:bg-brand-graphite text-brand-mist hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-400" />
                              Helpful ({reply.helpfulCount})
                            </button>

                            <button
                              onClick={() => {
                                setQuoteSnippet({ author: reply.authorName, text: reply.body.slice(0, 100) });
                                document.getElementById('reply-composer')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-brand-graphite/40 hover:bg-brand-graphite text-brand-silver hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                            >
                              <Quote className="w-3.5 h-3.5" />
                              Quote
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {!discussion.solved && (
                              <button
                                onClick={() => handleAcceptAnswer(reply.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-medium transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Accept as Answer
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setReportTarget({ type: 'reply', id: reply.id });
                                setReportModalOpen(true);
                              }}
                              className="text-brand-silver hover:text-rose-400 transition-colors p-1"
                              title="Report response"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Composer */}
              <div id="reply-composer" className="bg-brand-graphite/25 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-brand-electric" />
                  Your Practitioner Contribution
                </h3>

                {quoteSnippet && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-brand-electric/30 text-xs text-brand-silver">
                    <span>
                      Quoting <strong className="text-white">{quoteSnippet.author}</strong>: "{quoteSnippet.text}..."
                    </span>
                    <button
                      onClick={() => setQuoteSnippet(null)}
                      className="text-brand-silver hover:text-white font-bold ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <textarea
                    rows={4}
                    placeholder="Share your practical technical perspective or site experience..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 bg-brand-graphite/50 border border-white/10 rounded-lg text-sm text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric transition-colors"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-silver">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-brand-silver" />
                      Keep client and site-specific commercial identities confidential.
                    </span>

                    <button
                      type="submit"
                      disabled={submittingReply || !replyText.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-brand-electric text-white hover:bg-brand-electric/90 disabled:opacity-50 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submittingReply ? 'Posting...' : 'Post Response'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Knowledge Graph Sidebar ("Put This into Practice") */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Put This into Practice Box */}
              <div className="bg-brand-graphite/25 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-electric">
                  <Wrench className="w-4 h-4" />
                  Put This Into Practice
                </div>
                <h4 className="text-sm font-semibold text-white">Related EntireFM Tools & Checklists</h4>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Apply statutory engineering standards directly to your commercial portfolio:
                </p>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/tools/asset-register-builder"
                    className="group block p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                  >
                    <span className="font-semibold text-white group-hover:text-brand-electric flex items-center justify-between">
                      Asset Register Builder
                      <ArrowRight className="w-3 h-3 text-brand-silver group-hover:text-brand-electric" />
                    </span>
                    <p className="text-brand-silver mt-1">Generate an SFG20-aligned statutory asset schedule with full nameplate capture.</p>
                  </Link>

                  <Link
                    href="/resources/commercial-fm-statutory-compliance-matrix"
                    className="group block p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                  >
                    <span className="font-semibold text-white group-hover:text-brand-electric flex items-center justify-between">
                      Statutory Compliance Matrix
                      <ArrowRight className="w-3 h-3 text-brand-silver group-hover:text-brand-electric" />
                    </span>
                    <p className="text-brand-silver mt-1">Master checklist of all 42 UK statutory building maintenance obligations.</p>
                  </Link>
                </div>
              </div>

              {/* Continue the Conversation: Live Room */}
              <div className="bg-gradient-to-br from-brand-electric/10 via-brand-graphite/30 to-brand-void border border-brand-electric/20 rounded-xl p-5">
                <div className="flex items-center gap-2 text-brand-electric text-xs font-bold uppercase tracking-wider mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Continue The Conversation
                </div>
                <h4 className="text-sm font-semibold text-white">Live Realtime Room</h4>
                <p className="text-xs text-brand-silver mt-1.5 leading-relaxed">
                  Join practitioners discussing this topic live in the {discussion.categoryName} Room.
                </p>
                <Link
                  href="/lobby/rooms"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-electric hover:underline"
                >
                  Enter Live Room →
                </Link>
              </div>

              {/* Legal / UGC Notice */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-brand-silver leading-relaxed">
                <p className="font-semibold text-brand-mist mb-1">Community Knowledge Architecture</p>
                Valuable practitioner solutions may be nominated for editorial review into an official EntireFM Guide or Engineer’s Note.
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Accessible Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-graphite border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-400" />
              Report Contribution to Moderators
            </h3>

            {reportSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                ✓ Report submitted. Our moderation desk will review this case.
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-brand-silver mb-1.5 font-medium">Reason for reporting</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-brand-void border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="spam_promotion">Spam or commercial promotion</option>
                    <option value="confidential_info">Personal / site confidential information</option>
                    <option value="unsafe_misleading">Unsafe or dangerous technical advice</option>
                    <option value="harassment_abuse">Harassment or abusive conduct</option>
                    <option value="other">Other policy concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-silver mb-1.5 font-medium">Additional details (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide context for the moderation team..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="w-full p-2.5 bg-brand-void border border-white/10 rounded-lg text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-brand-silver hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

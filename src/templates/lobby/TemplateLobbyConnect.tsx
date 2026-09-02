'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Radio,
  Sparkles,
  HelpCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  PlusCircle,
  Lock,
  Layers,
  AlertTriangle,
  FileText,
  Flame,
  Wrench,
  Droplets,
  Cpu,
  Truck,
  Leaf,
  GraduationCap,
  HardHat,
  Scale,
  Send,
  Building2,
  ThumbsUp,
  BarChart3,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { COMMUNITY_CATEGORIES } from '@/server/community/category-store';

interface DiscussionItem {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorBadge?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  replyCount: number;
  helpfulCount: number;
  solved: boolean;
  acceptedReplyId?: string;
  createdAt: string;
  lastActivityAt: string;
}

interface RoomItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  topic: string;
  activePresenceCount: number;
  totalMessagesCount: number;
  status: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  context: string;
  totalVotes: number;
  options: PollOption[];
  editorialAnalysis?: string;
}

export function TemplateLobbyConnect() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [activePoll, setActivePoll] = useState<PollData | null>(null);
  const [pollSelectedOption, setPollSelectedOption] = useState<string | null>(null);
  const [pollVoted, setPollVoted] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);

  // Ask The Community Quick Intake Form State
  const [askCategory, setAskCategory] = useState('general-fm');
  const [askQuestion, setAskQuestion] = useState('');
  const [askContext, setAskContext] = useState('');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [isSubmittingAsk, setIsSubmittingAsk] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const discRes = await fetch('/api/community/discussions?limit=15');
        if (discRes.ok) {
          const data = await discRes.json();
          setDiscussions(data.discussions || []);
        }

        const roomsRes = await fetch('/api/lobby/rooms');
        if (roomsRes.ok) {
          const data = await roomsRes.json();
          setRooms(data.rooms || []);
        }

        const pollRes = await fetch('/api/community/polls');
        if (pollRes.ok) {
          const data = await pollRes.json();
          setActivePoll(data.activePoll || null);
          setPollVoted(Boolean(data.userVoted));
        }
      } catch (err) {
        console.error('Failed to load community initial data:', err);
      } finally {
        setLoadingDiscussions(false);
      }
    }

    loadInitialData();
  }, []);

  const filteredDiscussions = discussions.filter((disc) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'solved'
        ? disc.solved
        : activeCategory === 'unanswered'
        ? disc.replyCount === 0
        : disc.categorySlug === activeCategory;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disc.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disc.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  async function handleVotePoll() {
    if (!pollSelectedOption || !activePoll || votingLoading) return;
    setVotingLoading(true);

    try {
      const res = await fetch(`/api/community/polls/${activePoll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: pollSelectedOption }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivePoll(data.poll);
        setPollVoted(true);
      } else if (res.status === 401) {
        window.location.href = '/sign-in?redirect=/lobby/connect';
      }
    } catch (err) {
      console.error('Error recording vote:', err);
    } finally {
      setVotingLoading(false);
    }
  }

  async function handleQuickAskSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!askQuestion.trim() || askQuestion.length < 10) {
      setAskError('Please provide a substantive question (at least 10 characters).');
      return;
    }
    setAskError(null);
    setIsSubmittingAsk(true);

    try {
      const res = await fetch('/api/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: askQuestion.trim(),
          body: askContext.trim() || askQuestion.trim(),
          categorySlug: askCategory,
          tags: ['practitioner-inquiry'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAskSubmitted(true);
        if (data.discussion?.slug) {
          window.location.href = `/lobby/community/discussion/${data.discussion.slug}`;
        }
      } else if (res.status === 401) {
        window.location.href = '/sign-in?redirect=/lobby/connect#ask-community';
      } else {
        const data = await res.json();
        setAskError(data.error || 'Failed to submit question. Please try again.');
      }
    } catch (err) {
      setAskError('A network error occurred. Please try again.');
    } finally {
      setIsSubmittingAsk(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="connect" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-16">
        
        {/* ── 02. BREADCRUMBS & HERO SECTION ──────────────────────────── */}
        <section className="space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">CONNECT</span>
          </nav>

          <div className="relative overflow-hidden bg-neutral-950 text-white rounded-[4px] p-8 sm:p-12 lg:p-16 shadow-xl border border-neutral-800">
            <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity pointer-events-none">
              <Image
                src="/images/editorial/entirefm-sheffield-rooftop-survey-1920w.webp"
                alt="UK facilities management professionals round-table"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold font-mono">
                  THE LOBBY · CONNECT
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight text-white">
                  The professional common room for FM.
                </h1>
                <p className="text-base sm:text-lg font-light text-neutral-300 leading-relaxed max-w-2xl">
                  Practical questions. Experienced practitioners. Better answers. A signal-rich environment for UK facilities managers, building engineers, and estates directors.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#ask-community"
                  className="px-6 py-3 bg-brand-electric hover:bg-blue-600 text-white text-xs font-medium uppercase tracking-wider rounded-[4px] transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask the Community</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#active-discussions"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-light uppercase tracking-wider rounded-[4px] backdrop-blur-xs transition-colors border border-white/20 inline-flex items-center gap-2"
                >
                  <span>Explore Discussions</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03. COMMUNITY PRINCIPLES TRUST STATEMENT ─────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-electric" />
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Community Principles &amp; Standards
              </span>
            </div>
            <Link
              href="/legal/community-guidelines"
              className="text-xs text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
            >
              <span>Read Full Community Guidelines</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">01 · PRACTICAL</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Real operational dilemmas and plant challenges, never generic motivational posting.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">02 · PROFESSIONAL</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Respectful, technical, and constructive debate focused on solutions.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">03 · RELEVANT</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Strictly dedicated to FM, commercial property, statutory compliance, and engineering.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">04 · EVIDENCE-LED</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Cite primary legislation, British Standards (BS/EN), SFG20, and technical guidance.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">05 · NO SALES NOISE</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Zero unsolicited commercial self-promotion or cold-outreach vendor pitches.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-900 block font-mono text-[11px]">06 · NO POSTURING</span>
              <p className="text-neutral-600 font-light leading-relaxed">
                Value lies in verifiable answers, not follower counts, likes, or vanity metrics.
              </p>
            </div>
          </div>
        </section>

        {/* ── 04. ASK THE COMMUNITY (CENTRAL INTERACTION) ──────────────── */}
        <section
          id="ask-community"
          className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                  CENTRAL INTERACTION
                </span>
                <span className="text-xs text-neutral-400 font-light">· Moderated Peer Exchange</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                What are you dealing with?
              </h2>
            </div>
            <Link
              href="/lobby/community/new"
              className="text-xs text-neutral-600 hover:text-neutral-900 font-light inline-flex items-center gap-1 self-start sm:self-end"
            >
              <span>Open full composer with tags</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form onSubmit={handleQuickAskSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 space-y-1.5">
                <label htmlFor="ask-category" className="block text-xs font-medium text-neutral-700">
                  Select Discipline Category
                </label>
                <select
                  id="ask-category"
                  value={askCategory}
                  onChange={(e) => setAskCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-[4px] px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-brand-electric"
                >
                  {COMMUNITY_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="ask-question" className="block text-xs font-medium text-neutral-700">
                  Your Specific Technical or Operational Question
                </label>
                <input
                  id="ask-question"
                  type="text"
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  placeholder="e.g. Has anyone successfully mobilised a multi-site hard FM contract with missing O&M data?"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-[4px] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ask-context" className="block text-xs font-medium text-neutral-700">
                Context, Estate Details &amp; Constraints (Optional)
              </label>
              <textarea
                id="ask-context"
                rows={3}
                value={askContext}
                onChange={(e) => setAskContext(e.target.value)}
                placeholder="Detail the estate type, asset background, or specific statutory guidance in question without disclosing sensitive client names."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-[4px] p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
              />
            </div>

            {/* Contextual Confidentiality & Safety Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-[4px] p-3 flex items-start gap-2.5 text-amber-900">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-medium text-amber-950 block">Confidentiality Guard:</strong>
                  Please do not include client names, tenant identities, security codes, alarm configurations, or sensitive commercial contract figures.
                </div>
              </div>

              <div className="bg-neutral-100 border border-neutral-200 rounded-[4px] p-3 flex items-start gap-2.5 text-neutral-700">
                <AlertTriangle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-medium text-neutral-900 block">Emergency Notice:</strong>
                  The Lobby is not an emergency response service. If facing immediate structural, electrical, or life-safety danger, escalate via statutory emergency procedures.
                </div>
              </div>
            </div>

            {askError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-[4px]">
                {askError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-neutral-500 font-light">
                Questions are verified and visible to practitioners across the UK FM community.
              </span>
              <button
                type="submit"
                disabled={isSubmittingAsk}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-brand-electric" />
                <span>{isSubmittingAsk ? 'Submitting...' : 'Post to Community'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* ── 05. FM PULSE (EMPIRICAL INDUSTRY OPINION) ────────────────── */}
        {activePoll && (
          <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-electric bg-brand-electric/10 px-2.5 py-0.5 rounded-[2px] font-mono">
                  FM PULSE · INDUSTRY SENTIMENT
                </span>
                <span className="text-xs text-neutral-400 font-light">
                  · {activePoll.totalVotes} Verified Responses
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight leading-snug">
                {activePoll.question}
              </h2>

              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                {activePoll.context}
              </p>

              {activePoll.editorialAnalysis && pollVoted && (
                <div className="bg-neutral-50 border-l-2 border-brand-electric p-3.5 text-xs text-neutral-700 font-light rounded-[2px]">
                  <strong className="text-neutral-900 font-medium block mb-1">EntireFM Synthesis:</strong>
                  {activePoll.editorialAnalysis}
                </div>
              )}
            </div>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded-[4px] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200">
                <span className="font-mono text-neutral-500 uppercase text-[10px]">
                  {pollVoted ? 'Verified Results Distribution' : 'Cast Your Anonymous Vote'}
                </span>
                <Link href="/lobby/pulse" className="text-brand-electric hover:underline text-[11px]">
                  Archive &rarr;
                </Link>
              </div>

              <div className="space-y-2.5">
                {activePoll.options.map((option) => {
                  const percentage =
                    activePoll.totalVotes > 0
                      ? Math.round((option.votes / activePoll.totalVotes) * 100)
                      : 0;

                  return (
                    <div key={option.id} className="space-y-1">
                      {pollVoted ? (
                        <div>
                          <div className="flex justify-between text-xs text-neutral-800 font-light mb-1">
                            <span>{option.text}</span>
                            <span className="font-mono font-medium">{percentage}% ({option.votes})</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-neutral-900 transition-all duration-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <label
                          className={`flex items-center justify-between p-3 rounded-[4px] border text-xs cursor-pointer transition-colors ${
                            pollSelectedOption === option.id
                              ? 'border-brand-electric bg-blue-50/50 text-neutral-900 font-medium'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <span>{option.text}</span>
                          <input
                            type="radio"
                            name="poll-choice"
                            value={option.id}
                            checked={pollSelectedOption === option.id}
                            onChange={() => setPollSelectedOption(option.id)}
                            className="text-brand-electric focus:ring-0"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              {!pollVoted && (
                <button
                  type="button"
                  onClick={handleVotePoll}
                  disabled={!pollSelectedOption || votingLoading}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors disabled:opacity-50"
                >
                  {votingLoading ? 'Submitting...' : 'Record Practitioner Vote'}
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── 06. ACTIVE DISCUSSIONS & PRACTITIONER CONSENSUS ─────────── */}
        <section id="active-discussions" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/90 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block font-mono">
                PRACTITIONER ROUNDTABLES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Active Discussions &amp; Technical Consensus
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or tags..."
                  className="w-full bg-white border border-neutral-200 rounded-[4px] pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
                />
              </div>
              <Link
                href="/lobby/community/new"
                className="px-3.5 py-1.5 bg-brand-electric hover:bg-blue-600 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Discussion</span>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { id: 'all', label: 'All Discussions' },
              { id: 'solved', label: '✓ Solved / Consensus' },
              { id: 'unanswered', label: 'Needs Answers' },
              { id: 'fire-building-safety', label: 'Building Safety & BSA' },
              { id: 'engineering-me', label: 'Engineering & M&E' },
              { id: 'compliance-health-safety', label: 'Compliance & H&S' },
              { id: 'mobilisation', label: 'Mobilisation & Transition' },
              { id: 'procurement-contracts', label: 'Procurement' },
              { id: 'cafm-data-technology', label: 'CAFM & Tech' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveCategory(pill.id)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-light whitespace-nowrap transition-colors border ${
                  activeCategory === pill.id
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Discussion List */}
          {loadingDiscussions ? (
            <div className="p-12 text-center text-xs text-neutral-400 font-light bg-white border border-neutral-200 rounded-[4px]">
              Loading active practitioner discussions...
            </div>
          ) : filteredDiscussions.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500 font-light bg-white border border-neutral-200 rounded-[4px] space-y-2">
              <p>No discussions found matching this filter criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="text-brand-electric hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiscussions.map((disc) => (
                <article
                  key={disc.id}
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-7 shadow-2xs space-y-3.5 transition-colors group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-[10px] font-mono uppercase text-neutral-700">
                        {disc.categoryName}
                      </span>
                      {disc.solved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PRACTITIONER CONSENSUS</span>
                        </span>
                      )}
                      <span className="text-neutral-400 font-light">
                        Started by {disc.authorName} {disc.authorHeadline && `· ${disc.authorHeadline}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-neutral-500 text-xs">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-neutral-400" />
                        {disc.replyCount} {disc.replyCount === 1 ? 'Reply' : 'Replies'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                    <Link href={`/lobby/community/discussion/${disc.slug}`}>{disc.title}</Link>
                  </h3>

                  <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                    {disc.body}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-light text-neutral-500 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      {disc.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-neutral-50 px-2 py-0.5 rounded-[2px] text-neutral-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/lobby/community/discussion/${disc.slug}`}
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-medium text-xs"
                    >
                      <span>Read discussion &amp; contribute</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 07. LIVE TECHNICAL ROOMS & ASK THE RESEARCH DESK ────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Live Realtime Rooms */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Live Realtime Desks</span>
              </div>
              <h3 className="text-xl font-light text-neutral-900 leading-snug">
                Technical Roundtables &amp; Plant Rooms
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                Connect directly with on-shift FM managers and building engineers in active rooms dedicated to Building Safety, Hard FM, and M&amp;E diagnostics.
              </p>

              {rooms.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                    Active Rooms Now Open
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {rooms.slice(0, 3).map((r) => (
                      <Link
                        key={r.id}
                        href={`/lobby/rooms/${r.slug}`}
                        className="p-2.5 rounded-[4px] bg-neutral-50 border border-neutral-200 hover:border-neutral-300 flex items-center justify-between text-xs group"
                      >
                        <span className="font-light text-neutral-800 group-hover:text-brand-electric">
                          {r.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {r.totalMessagesCount} messages
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/lobby/rooms"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
              >
                <span>View All Realtime Rooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Grounded Research Desk */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-brand-electric font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authoritative Technical Research</span>
              </div>
              <h3 className="text-xl font-light text-neutral-900 leading-snug">
                Ask The Lobby Research Desk
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                Interrogate primary UK statutes, British Standards (BS/EN), and case law. Our research desk returns cited, defensible technical positions for your estate dilemmas.
              </p>

              <div className="pt-2 bg-neutral-50 p-3.5 rounded-[4px] border border-neutral-200 text-xs text-neutral-700 font-light space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                  Recent Cited Inquiries
                </span>
                <p className="italic">
                  &ldquo;What is the legal boundary between landlord and tenant on emergency lighting discharge testing under BS 5266-1?&rdquo;
                </p>
                <div className="text-[10px] text-brand-electric font-mono">
                  → Sourced to RRFSO 2005 &amp; BS 5266-1 Cl. 12.4
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/lobby/ask"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
              >
                <span>Submit Query to Research Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </section>

        {/* ── 08. CROSS-LOBBY KNOWLEDGE GRAPH BRIDGE ──────────────────── */}
        <section className="pt-8 border-t border-neutral-200/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium font-mono">
              The Lobby Ecosystem
            </div>
            <span className="text-xs text-neutral-400 font-light">
              Connected UK Facilities Management Graph
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link
              href="/lobby/know"
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-neutral-400 text-[10px] font-mono block">01 · INTELLIGENCE</span>
              <span className="text-neutral-900 font-medium block">KNOW &rarr;</span>
              <span className="text-[11px] text-neutral-500 font-light block">Regulatory updates &amp; tenders</span>
            </Link>

            <Link
              href="/lobby/check"
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-neutral-400 text-[10px] font-mono block">02 · COMPLIANCE</span>
              <span className="text-neutral-900 font-medium block">CHECK &rarr;</span>
              <span className="text-[11px] text-neutral-500 font-light block">Statutory obligations &amp; duty-holders</span>
            </Link>

            <Link
              href="/lobby/do"
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-neutral-400 text-[10px] font-mono block">03 · TOOLBOX</span>
              <span className="text-neutral-900 font-medium block">DO &rarr;</span>
              <span className="text-[11px] text-neutral-500 font-light block">PPM schedules &amp; tender briefers</span>
            </Link>

            <Link
              href="/lobby/find"
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-neutral-400 text-[10px] font-mono block">04 · CAREERS</span>
              <span className="text-neutral-900 font-medium block">FIND &rarr;</span>
              <span className="text-[11px] text-neutral-500 font-light block">Jobs, roles &amp; salary benchmarks</span>
            </Link>

            <Link
              href="/lobby/learn"
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors col-span-2 sm:col-span-1 space-y-1"
            >
              <span className="text-neutral-400 text-[10px] font-mono block">05 · DEVELOPMENT</span>
              <span className="text-neutral-900 font-medium block">LEARN &rarr;</span>
              <span className="text-[11px] text-neutral-500 font-light block">Playbooks, guides &amp; scenarios</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

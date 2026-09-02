'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Bookmark,
  MessageSquare,
  Radio,
  Bell,
  Settings,
  User,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { MemberAvatar } from '@/components/member/MemberAvatar';

export function TemplateMyLobby() {
  const [profile, setProfile] = useState<any>(null);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [myDiscussions, setMyDiscussions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'discussions' | 'messages'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, notifRes, discRes] = await Promise.all([
          fetch('/api/member/me'),
          fetch('/api/member/notifications'),
          fetch('/api/community/discussions'),
        ]);

        if (meRes.status === 401) {
          window.location.href = '/sign-in?redirect=/lobby/me';
          return;
        }

        const meData = await meRes.json();
        const notifData = await notifRes.json();
        const discData = await discRes.json();

        setProfile(meData.member);
        setNotifications(notifData.notifications || []);

        const mine = (discData.discussions || []).filter(
          (d: any) => d.authorMemberId === meData.member?.id
        );
        setMyDiscussions(mine);
      } catch (err) {
        console.error('Error loading My Lobby data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center py-32 text-xs font-light text-neutral-500 uppercase tracking-widest">
          Loading personal member workspace…
        </div>
        <Footer />
      </div>
    );
  }

  const memberName =
    profile?.displayName ||
    profile?.display_name ||
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
    profile?.email ||
    'Member';

  const memberFirstName = profile?.first_name || memberName.split(' ')[0] || 'Member';
  const memberRole = profile?.headline || profile?.jobTitle || 'Commercial Facilities & Property Leader';
  const reputationScore = profile?.reputation_score || 150;
  const joinYear = new Date(profile?.joined_at || Date.now()).getFullYear();
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const savedCount = profile?.saved_content_ids?.length || 0;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-20 w-full space-y-10">
        
        {/* ── 01. BREADCRUMB & EYEBROW ─────────────────────────────────── */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-5 bg-brand-electric" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-medium">
              The Lobby / Member Workspace
            </span>
          </div>
          <p className="text-xs font-light text-neutral-500">
            Personalised briefing stream, saved research library, and professional network.
          </p>
        </div>

        {/* ── 02. EXECUTIVE IDENTITY STRIP (LIGHT CORPORATE CANVAS) ─────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start sm:items-center gap-5 sm:gap-6">
            <div className="shrink-0 relative">
              <MemberAvatar
                name={memberName}
                avatarUrl={profile?.avatarUrl || profile?.avatar_url}
                size="xl"
                theme="light"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight leading-tight">
                  Good morning, {memberFirstName}
                </h1>
                <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 border border-neutral-200 text-[10px] font-medium uppercase tracking-wider text-neutral-700">
                  {profile?.tier || 'Corporate Member'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                {memberRole}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs font-light text-neutral-500">
                <span className="inline-flex items-center gap-1.5 text-neutral-700 font-normal">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{reputationScore} Reputation Score</span>
                </span>
                <span className="text-neutral-300">·</span>
                <span>Verified Practitioner</span>
                <span className="text-neutral-300">·</span>
                <span>Member since {joinYear}</span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            <Link
              href="/lobby/notifications"
              className="px-4 py-2.5 rounded-[4px] bg-white hover:bg-neutral-50 text-xs font-light text-neutral-800 border border-neutral-200 transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-neutral-500" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-brand-electric text-white text-[10px] font-medium">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/lobby/me/cpd"
              className="px-4 py-2.5 rounded-[4px] bg-white hover:bg-neutral-50 text-xs font-light text-neutral-800 border border-neutral-200 transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>CPD Record</span>
            </Link>

            <Link
              href="/member/settings"
              className="px-4 py-2.5 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-xs font-light text-white transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-300" />
              <span>Settings</span>
            </Link>
          </div>
        </section>

        {/* ── 03. RESTRAINED HORIZONTAL NAVIGATION ──────────────────────── */}
        <nav aria-label="Workspace Sections" className="border-b border-neutral-200/90 flex items-center gap-6 sm:gap-8 overflow-x-auto text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3.5 whitespace-nowrap transition-colors relative font-normal ${
              activeTab === 'overview'
                ? 'text-neutral-900 font-medium border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800 font-light'
            }`}
          >
            Overview &amp; Return Habit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-3.5 whitespace-nowrap transition-colors relative font-normal ${
              activeTab === 'saved'
                ? 'text-neutral-900 font-medium border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800 font-light'
            }`}
          >
            Saved Intelligence {savedCount > 0 ? `(${savedCount})` : ''}
          </button>

          <Link
            href="/lobby/me/research"
            className="pb-3.5 whitespace-nowrap text-neutral-500 hover:text-neutral-900 font-light transition-colors inline-flex items-center gap-1.5"
          >
            <span>Research Library</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab('discussions')}
            className={`pb-3.5 whitespace-nowrap transition-colors relative font-normal ${
              activeTab === 'discussions'
                ? 'text-neutral-900 font-medium border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800 font-light'
            }`}
          >
            My Discussions ({myDiscussions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`pb-3.5 whitespace-nowrap transition-colors relative font-normal ${
              activeTab === 'messages'
                ? 'text-neutral-900 font-medium border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800 font-light'
            }`}
          >
            Direct Messages
          </button>
        </nav>

        {/* ── 04. TAB CONTENT PANELS ───────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            
            {/* ── SECTION A: NEW SINCE YOUR LAST VISIT (EDITORIAL BRIEFING) ─ */}
            <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-2xs space-y-6">
              <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                    Executive Briefing
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                    New Since Your Last Visit
                  </h2>
                </div>
                <span className="text-xs font-light text-neutral-500">
                  Verified statutory &amp; community developments
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-neutral-200/90 pt-2">
                
                {/* Column 1: Statutory Updates */}
                <div className="space-y-3 md:pr-6">
                  <div className="space-y-1">
                    <span className="text-3xl sm:text-4xl font-extralight text-neutral-900 block tracking-tight">
                      02
                    </span>
                    <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-500 block">
                      Statutory Updates
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-700 leading-relaxed">
                    Mandatory digital occurrence reporting BSA Part 4 duty-holder briefing published.
                  </p>
                  <Link
                    href="/lobby/compliance"
                    className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>View Compliance Watch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Column 2: Peer Discussions */}
                <div className="space-y-3 md:px-6">
                  <div className="space-y-1">
                    <span className="text-3xl sm:text-4xl font-extralight text-neutral-900 block tracking-tight">
                      03
                    </span>
                    <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-500 block">
                      Peer Discussions
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-700 leading-relaxed">
                    New engineering observations in Commercial Plantroom Mobilisation &amp; Chillers.
                  </p>
                  <Link
                    href="/lobby/community"
                    className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Open Community Roundtable</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Column 3: Weekly Challenge */}
                <div className="space-y-3 md:pl-6">
                  <div className="space-y-1">
                    <span className="text-3xl sm:text-4xl font-extralight text-neutral-900 block tracking-tight">
                      01
                    </span>
                    <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-500 block">
                      Weekly Challenge
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-700 leading-relaxed">
                    Week 35 Saturated Insulation Water Ingress scenario open for technical review.
                  </p>
                  <Link
                    href="/lobby#lobby-question"
                    className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Answer Question (+50 pts)</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </section>

            {/* ── SECTION B: WORKSPACE DESTINATIONS (4 EDITORIAL MODULES) ─ */}
            <section className="space-y-6">
              <div className="border-b border-neutral-200/90 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                    Workspace Navigation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                    Professional Intelligence Destinations
                  </h2>
                </div>
                <span className="text-xs font-light text-neutral-500 hidden sm:inline">
                  Direct desks &amp; real-time channels
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Destination 1: Live Rooms */}
                <Link
                  href="/lobby/rooms"
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-8 shadow-2xs transition-colors group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 block">
                      Real-Time Collaboration
                    </span>
                    <h3 className="text-lg sm:text-xl font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      Live Engineering Rooms
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                      Join active technical audio &amp; text desks with on-shift FM directors, estates teams, and specialist building services engineers.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-900 group-hover:text-brand-electric">
                    <span>Enter Live Rooms</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Destination 2: Direct Messages */}
                <Link
                  href="/lobby/messages"
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-8 shadow-2xs transition-colors group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 block">
                      Professional Communications
                    </span>
                    <h3 className="text-lg sm:text-xl font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      Direct Messages &amp; Inquiries
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                      Confidential 1:1 professional communication channel with verified UK commercial property peers and EntireFM consultants.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-900 group-hover:text-brand-electric">
                    <span>Open Messages Inbox</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Destination 3: Compliance Watch */}
                <Link
                  href="/lobby/compliance"
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-8 shadow-2xs transition-colors group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 block">
                      Statutory Oversight
                    </span>
                    <h3 className="text-lg sm:text-xl font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      Compliance &amp; Duty Tracker
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                      Track mandatory Building Safety Act milestones, ACOP L8 Legionella cycles, and statutory maintenance deadlines across the estate.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-900 group-hover:text-brand-electric">
                    <span>Review Compliance Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Destination 4: Benchmarking & The Wire */}
                <Link
                  href="/lobby/benchmarking"
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-8 shadow-2xs transition-colors group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 block">
                      Market Intelligence
                    </span>
                    <h3 className="text-lg sm:text-xl font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      The Wire &amp; UK FM Benchmarks
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                      Access empirical operational cost benchmarks, public sector contract award records, and first-party industry intelligence.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-900 group-hover:text-brand-electric">
                    <span>Explore Market Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

              </div>
            </section>

            {/* ── SECTION C: START A CONVERSATION (CORPORATE CONSULTANCY CTA) */}
            <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 lg:p-14 shadow-2xs space-y-6">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-px w-5 bg-brand-electric" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                    EntireFM Advisory &amp; Operations
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 tracking-tight leading-snug">
                  Tell us what the estate is, and we will tell you what it needs.
                </h2>

                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-2xl">
                  From statutory compliance gap audits and 52-week PPM mobilisation to multi-site total facilities management, EntireFM delivers grounded, accountable engineering operations across commercial portfolios.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact?subject=Estate%20Proposal%20Request"
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Request an estate proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/lobby/ask"
                  className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-light border border-neutral-300 rounded-[4px] transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-electric" />
                  <span>Ask The Lobby Research Desk</span>
                </Link>
              </div>
            </section>

          </div>
        )}

        {/* ── SAVED INTELLIGENCE TAB ───────────────────────────────────── */}
        {activeTab === 'saved' && (
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 mx-auto flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-neutral-600" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-light text-neutral-900">
                Your Saved Intelligence Library
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                Articles, regulatory briefs, tools, and technical discussions you bookmark will be archived here for persistent access.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/lobby"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light tracking-wide rounded-[4px] transition-colors"
              >
                Browse Today&apos;s Briefings &rarr;
              </Link>
              <Link
                href="/lobby/today"
                className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-light border border-neutral-200 rounded-[4px] transition-colors"
              >
                What Changed Today &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* ── MY DISCUSSIONS TAB ───────────────────────────────────────── */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {myDiscussions.length === 0 ? (
              <div className="bg-white border border-neutral-200/90 rounded-[4px] p-10 text-center space-y-3 shadow-2xs">
                <MessageSquare className="w-8 h-8 mx-auto text-neutral-400" />
                <h3 className="text-base font-light text-neutral-900">No active discussions started</h3>
                <p className="text-xs font-light text-neutral-500 max-w-md mx-auto">
                  Engage with fellow facilities leaders and building services engineers on real operational questions.
                </p>
                <div className="pt-2">
                  <Link
                    href="/lobby/community/new"
                    className="px-5 py-2.5 bg-brand-electric hover:bg-blue-600 text-white text-xs font-light rounded-[4px] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Start a Technical Discussion</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200/90 rounded-[4px] divide-y divide-neutral-100 shadow-2xs">
                {myDiscussions.map((d) => (
                  <div key={d.id} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Link
                        href={`/lobby/community/discussion/${d.slug}`}
                        className="text-base font-light text-neutral-900 hover:text-brand-electric transition-colors block"
                      >
                        {d.title}
                      </Link>
                      <p className="text-xs font-light text-neutral-500">
                        {d.replyCount || 0} replies · {d.helpfulCount || 0} helpful votes
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {d.solved && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium uppercase">
                          Solved
                        </span>
                      )}
                      <Link
                        href={`/lobby/community/discussion/${d.slug}`}
                        className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
                      >
                        <span>View thread</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DIRECT MESSAGES TAB ──────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-8 sm:p-10 shadow-2xs space-y-4 text-center max-w-xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 mx-auto flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-neutral-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-light text-neutral-900">
                Direct Professional Messages
              </h3>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                Communicate directly with verified FM practitioners, engineers, and EntireFM account advisors in our secure messaging inbox.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/lobby/messages"
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Open Messages Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

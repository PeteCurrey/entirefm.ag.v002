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
} from 'lucide-react';
import { MemberAvatar } from '@/components/member/MemberAvatar';

export function TemplateMyLobby() {
  const [profile, setProfile] = useState<any>(null);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [myDiscussions, setMyDiscussions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'discussions' | 'messages' | 'notifications'>('overview');
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
      <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center py-20 text-sm text-brand-silver">
          Loading your personal Lobby workspace...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 w-full">
        {/* Workspace Banner */}
        <section className="bg-brand-graphite/25 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MemberAvatar
              name={profile?.displayName || profile?.display_name || 'Member'}
              avatarUrl={profile?.avatarUrl || profile?.avatar_url}
              size="xl"
              theme="dark"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Good morning, {profile?.first_name || 'Member'}</h1>
                {profile?.badges?.[0] && (
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-mist border border-white/10">
                    {profile.badges[0]}
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-silver mt-0.5">{profile?.headline || 'Facilities Management Practitioner'}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-brand-silver">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  {profile?.reputation_score || 0} Reputation Points
                </span>
                <span>•</span>
                <span>Member since {new Date(profile?.joined_at || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/lobby/notifications"
              className="px-4 py-2.5 rounded-xl bg-brand-graphite/60 hover:bg-brand-graphite text-xs font-semibold text-white border border-white/10 flex items-center gap-2 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-brand-electric" />
              Notifications
            </Link>
            <Link
              href="/member/settings"
              className="px-4 py-2.5 rounded-xl bg-brand-graphite/60 hover:bg-brand-graphite text-xs font-semibold text-white border border-white/10 flex items-center gap-2 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-brand-silver" />
              Settings
            </Link>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Return Habit' },
            { id: 'saved', label: `Saved Articles (${profile?.saved_content_ids?.length || 0})` },
            { id: 'research', label: 'Research Library', href: '/lobby/me/research' },
            { id: 'discussions', label: `My Discussions (${myDiscussions.length})` },
            { id: 'messages', label: 'Direct Messages' },
          ].map((t) => (
            t.href ? (
              <Link
                key={t.id}
                href={t.href}
                className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors text-brand-electric hover:text-white hover:bg-brand-electric/20 border border-brand-electric/30 flex items-center gap-1.5"
              >
                <span>{t.label}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-brand-electric text-white shadow-md'
                    : 'text-brand-silver hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            )
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* New Since Last Visit Module */}
            <div className="bg-gradient-to-br from-brand-electric/15 via-brand-graphite/30 to-brand-void border border-brand-electric/30 rounded-2xl p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
                New Since Your Last Visit
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-lg font-bold text-white">2 Updates</span>
                  <p className="text-xs text-brand-silver">Mandatory occurrence reporting BSA Part 4 briefing live.</p>
                  <Link href="/lobby/compliance" className="text-[11px] text-brand-electric hover:underline block pt-1">
                    View Compliance Watch →
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-lg font-bold text-white">3 Discussions</span>
                  <p className="text-xs text-brand-silver">New technical responses in Mobilisation & HVAC.</p>
                  <Link href="/lobby/community" className="text-[11px] text-brand-electric hover:underline block pt-1">
                    Open Community →
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-lg font-bold text-white">Week 35 Challenge</span>
                  <p className="text-xs text-brand-silver">Saturated Insulation Water Leak question now open.</p>
                  <Link href="/lobby#lobby-question" className="text-[11px] text-brand-electric hover:underline block pt-1">
                    Answer Question (+50 pts) →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/lobby/rooms"
                className="p-6 rounded-2xl bg-brand-graphite/20 border border-white/5 hover:border-brand-electric/40 transition-all space-y-2 group"
              >
                <Radio className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white group-hover:text-brand-electric transition-colors">
                  Live Rooms
                </h3>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Join realtime topic conversations with engineers and FM leaders on shift.
                </p>
              </Link>

              <Link
                href="/lobby/messages"
                className="p-6 rounded-2xl bg-brand-graphite/20 border border-white/5 hover:border-brand-electric/40 transition-all space-y-2 group"
              >
                <MessageSquare className="w-5 h-5 text-brand-electric" />
                <h3 className="text-base font-bold text-white group-hover:text-brand-electric transition-colors">
                  Direct Messages
                </h3>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Confidential 1:1 professional communication with verified peers.
                </p>
              </Link>

              <Link
                href="/lobby/compliance"
                className="p-6 rounded-2xl bg-brand-graphite/20 border border-white/5 hover:border-brand-electric/40 transition-all space-y-2 group"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white group-hover:text-brand-electric transition-colors">
                  Compliance Watch
                </h3>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Statutory deadlines, BSR updates, and risk mitigation workflows.
                </p>
              </Link>

              <Link
                href="/lobby/pulse"
                className="p-6 rounded-2xl bg-brand-graphite/20 border border-white/5 hover:border-brand-electric/40 transition-all space-y-2 group"
              >
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white group-hover:text-brand-electric transition-colors">
                  The Pulse & Data
                </h3>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Empirical benchmarks and first-party research from UK estates teams.
                </p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="bg-brand-graphite/20 border border-white/5 rounded-2xl p-8 text-center text-sm text-brand-silver">
            <Bookmark className="w-8 h-8 mx-auto text-brand-electric mb-2" />
            <h3 className="text-base font-bold text-white">Your Saved Intelligence Library</h3>
            <p className="text-xs text-brand-silver mt-1 max-w-md mx-auto">
              Articles, compliance briefs, tools, and discussions you bookmark will appear here for instant reference.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/lobby" className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold">
                Explore The Lobby
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {myDiscussions.length === 0 ? (
              <div className="bg-brand-graphite/20 border border-white/5 rounded-2xl p-8 text-center text-xs text-brand-silver">
                You have not started any community discussions yet.
              </div>
            ) : (
              myDiscussions.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-brand-graphite/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <Link href={`/lobby/community/discussion/${d.slug}`} className="text-sm font-bold text-white hover:text-brand-electric">
                      {d.title}
                    </Link>
                    <p className="text-[11px] text-brand-silver mt-0.5">{d.replyCount} replies • {d.helpfulCount} helpful</p>
                  </div>
                  {d.solved && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      Solved
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="p-8 text-center text-xs text-brand-silver bg-brand-graphite/20 border border-white/5 rounded-2xl space-y-3">
            <p>Access your full messaging inbox:</p>
            <Link href="/lobby/messages" className="inline-block px-5 py-2.5 rounded-lg bg-brand-electric text-white font-semibold">
              Open Messages Inbox →
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

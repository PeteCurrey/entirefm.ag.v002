'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MemberAvatar } from '@/components/member/MemberAvatar';
import {
  ArrowLeft,
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface MemberData {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string | null;
  headline?: string;
  company?: string;
  jobTitle?: string;
  emailPreferences: {
    marketingEmails: boolean;
    weeklyDigest: boolean;
    complianceAlerts: boolean;
    eventInvitations: boolean;
    productUpdates: boolean;
  };
  notificationPreferences: {
    newReplies: boolean;
    mentions: boolean;
    followedTopics: boolean;
  };
  profileVisibility: 'public' | 'members_only' | 'members-only' | 'private';
}

const EMAIL_PREFS: Array<{
  key: keyof MemberData['emailPreferences'];
  label: string;
  desc: string;
}> = [
  {
    key: 'weeklyDigest',
    label: 'Weekly FM Briefing digest',
    desc: 'A curated summary of the week’s top FM intelligence, statutory changes and tender highlights.',
  },
  {
    key: 'complianceAlerts',
    label: 'Compliance update alerts',
    desc: 'Regulatory amendments, statutory deadlines and Building Safety Act enforcement notices.',
  },
  {
    key: 'eventInvitations',
    label: 'Event invitations',
    desc: 'Invitations to private Lobby roundtables, technical webinars and industry forums.',
  },
  {
    key: 'productUpdates',
    label: 'Lobby & platform updates',
    desc: 'New intelligence tools, analytical features and capability improvements to The Lobby.',
  },
  {
    key: 'marketingEmails',
    label: 'EntireFM commercial communications',
    desc: 'Commercial service capabilities, technical case studies and operational announcements.',
  },
];

const NOTIFICATION_PREFS: Array<{
  key: keyof MemberData['notificationPreferences'];
  label: string;
  desc: string;
}> = [
  {
    key: 'newReplies',
    label: 'Replies to my contributions',
    desc: 'Receive alerts when another verified practitioner responds to your discussion threads or answers.',
  },
  {
    key: 'mentions',
    label: 'Direct mentions',
    desc: 'Receive alerts when another member references your handle in a technical inquiry.',
  },
  {
    key: 'followedTopics',
    label: 'Followed topic updates',
    desc: 'Receive alerts when new intelligence or compliance guidance is published in your subscribed disciplines.',
  },
];

const VISIBILITY_OPTIONS = [
  {
    value: 'public' as const,
    label: 'Public',
    desc: 'Your profile, headline and technical contributions are visible to all industry visitors.',
  },
  {
    value: 'members_only' as const,
    label: 'Members only',
    desc: 'Your profile is visible exclusively to signed-in, verified Lobby Members.',
  },
  {
    value: 'private' as const,
    label: 'Private',
    desc: 'Your profile is hidden from member directories and unauthenticated browsing.',
  },
];

const NAV_SECTIONS = [
  { id: 'communications', label: 'Communications' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'visibility', label: 'Profile Visibility' },
  { id: 'privacy', label: 'Privacy & Governance' },
];

export function TemplateMemberSettings() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('communications');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => {
        if (res.status === 401) {
          setAuthError(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data?.member) {
          const m = data.member;
          setMember({
            ...m,
            emailPreferences: {
              weeklyDigest: true,
              complianceAlerts: true,
              eventInvitations: true,
              productUpdates: true,
              marketingEmails: false,
              ...(m.emailPreferences || {}),
            },
            notificationPreferences: {
              newReplies: true,
              mentions: true,
              followedTopics: true,
              ...(m.notificationPreferences || {}),
            },
            profileVisibility:
              m.profileVisibility === 'members-only'
                ? 'members_only'
                : m.profileVisibility || 'public',
          });
        } else {
          setAuthError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setAuthError(true);
        setLoading(false);
      });
  }, []);

  // Scroll spy for sidebar active state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function triggerSaveFeedback() {
    setSaveSuccess(true);
    setSaveError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveSuccess(false);
    }, 3200);
  }

  function toggleEmailPref(key: keyof MemberData['emailPreferences']) {
    if (!member) return;
    const updated = {
      ...member,
      emailPreferences: {
        ...member.emailPreferences,
        [key]: !member.emailPreferences[key],
      },
    };
    setMember(updated);
    setSaveSuccess(false);
  }

  function toggleNotificationPref(key: keyof MemberData['notificationPreferences']) {
    if (!member) return;
    const updated = {
      ...member,
      notificationPreferences: {
        ...member.notificationPreferences,
        [key]: !member.notificationPreferences[key],
      },
    };
    setMember(updated);
    setSaveSuccess(false);
  }

  function handleVisibilityChange(value: 'public' | 'members_only' | 'private') {
    if (!member) return;
    setMember({ ...member, profileVisibility: value });
    setSaveSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/member/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailPreferences: member.emailPreferences,
          notificationPreferences: member.notificationPreferences,
          profileVisibility: member.profileVisibility,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "We couldn't save that preference. Please try again.");
        setIsSaving(false);
        return;
      }

      if (data.member) {
        setMember((prev) =>
          prev
            ? {
                ...prev,
                emailPreferences: data.member.emailPreferences || prev.emailPreferences,
                notificationPreferences:
                  data.member.notificationPreferences || prev.notificationPreferences,
                profileVisibility: data.member.profileVisibility || prev.profileVisibility,
              }
            : null
        );
      }
      triggerSaveFeedback();
    } catch {
      setSaveError("We couldn't save that preference. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Loading Skeleton ──
  if (loading) {
    return (
      <div className="on-dark min-h-screen flex flex-col bg-brand-void text-white font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-brand-electric" />
            <span className="text-xs font-mono text-brand-mist/50 tracking-wider uppercase">
              Loading Member Settings…
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Unauthenticated State ──
  if (authError || !member) {
    return (
      <div className="on-dark min-h-screen flex flex-col bg-brand-void text-white font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center py-28 sm:py-36 px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-carbon border border-brand-edge-dark text-brand-electric">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-light text-white tracking-tight">
                Sign in to manage settings
              </h1>
              <p className="text-sm font-light text-brand-mist/70 leading-relaxed">
                An active EntireFM Lobby Membership is required to configure communication and
                visibility preferences.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/sign-in" className="btn-primary justify-center">
                Sign In <ArrowRight className="btn-arrow h-4 w-4 ml-1" />
              </Link>
              <Link href="/join" className="btn-ghost-light justify-center">
                Become a Member
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const memberName =
    member.displayName ||
    `${member.firstName || ''} ${member.lastName || ''}`.trim() ||
    member.email;
  const memberSubtitle = member.headline || member.jobTitle || 'Lobby Member';

  return (
    <div className="on-dark min-h-screen flex flex-col bg-brand-void text-white font-sans selection:bg-brand-electric/30 selection:text-white">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1140px] mx-auto w-full">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              href="/member/profile"
              className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-brand-mist/60 hover:text-white transition-colors uppercase group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Return to Profile</span>
            </Link>
          </div>

          {/* Page Masthead */}
          <div className="border-b border-brand-edge-dark pb-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric-bright block mb-1">
                  Member Preferences
                </span>
                <h1 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                  Account Settings
                </h1>
                <p className="text-sm sm:text-base font-light text-brand-mist/70 mt-1.5 max-w-2xl">
                  Manage your Lobby communications, platform notifications and profile visibility.
                </p>
              </div>

              {/* Context Action Button */}
              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href="/member/profile"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-mist/70 hover:text-brand-electric-bright transition-colors"
                >
                  <span>Edit profile details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Subtle Identity Strip */}
            <div className="mt-6 pt-5 border-t border-brand-edge-dark/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <MemberAvatar
                  name={memberName}
                  avatarUrl={member.avatarUrl}
                  size={42}
                  border={true}
                  theme="dark"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{memberName}</span>
                    {member.username && (
                      <span className="text-xs font-mono text-brand-mist/50 truncate hidden sm:inline">
                        @{member.username}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-mist/60 truncate">
                    {memberSubtitle}
                    {member.company ? ` • ${member.company}` : ''}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Member</span>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-14 items-start">
            {/* Left Sidebar Navigation (Desktop) */}
            <aside className="sticky top-28 space-y-8 hidden lg:block">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-brand-mist/40 uppercase block mb-3 pl-3.5">
                  Navigation
                </span>
                <nav className="space-y-1">
                  {NAV_SECTIONS.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(section.id);
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            setActiveSection(section.id);
                          }
                        }}
                        className={`block text-xs py-2 pl-3.5 border-l-2 transition-all ${
                          isActive
                            ? 'border-brand-electric text-white font-medium bg-brand-carbon/30'
                            : 'border-transparent text-brand-mist/60 hover:text-white hover:border-brand-edge-dark'
                        }`}
                      >
                        {section.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Account Governance Card */}
              <div className="p-4 rounded border border-brand-edge-dark bg-brand-carbon/40 space-y-2.5 text-[11px] font-mono text-brand-mist/60">
                <div className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-electric" />
                  <span className="font-sans font-medium text-xs">Security &amp; Data</span>
                </div>
                <p className="font-sans leading-relaxed text-brand-mist/50">
                  Preferences are stored in accordance with UK GDPR and EntireFM Data Governance
                  specifications.
                </p>
                <div className="pt-2 border-t border-brand-edge-dark/60">
                  <span className="text-[10px] block text-brand-mist/40">Primary Email</span>
                  <span className="text-white truncate block">{member.email}</span>
                </div>
              </div>
            </aside>

            {/* Right Settings Content */}
            <form onSubmit={handleSave} className="space-y-12">
              {/* Section 1: Communications */}
              <section id="communications" className="scroll-mt-28 space-y-5">
                <div className="border-b border-brand-edge-dark pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright block mb-1">
                    Section 01
                  </span>
                  <h2 className="text-xl font-light text-white tracking-tight">
                    Email Communications
                  </h2>
                  <p className="text-xs text-brand-mist/70 mt-0.5">
                    Control which EntireFM intelligence briefings, statutory compliance alerts and
                    industry notices you receive.
                  </p>
                </div>

                <div className="divide-y divide-brand-edge-dark/60 border-y border-brand-edge-dark/60">
                  {EMAIL_PREFS.map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="min-w-0 pr-4">
                        <label
                          htmlFor={`email-${key}`}
                          className="block text-sm font-medium text-white cursor-pointer select-none"
                        >
                          {label}
                        </label>
                        <p className="text-xs text-brand-mist/70 mt-1 leading-relaxed">{desc}</p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <CustomToggle
                          id={`email-${key}`}
                          checked={member.emailPreferences[key]}
                          onChange={() => toggleEmailPref(key)}
                          label={label}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Notifications */}
              <section id="notifications" className="scroll-mt-28 space-y-5">
                <div className="border-b border-brand-edge-dark pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright block mb-1">
                    Section 02
                  </span>
                  <h2 className="text-xl font-light text-white tracking-tight">
                    On-site &amp; Activity Notifications
                  </h2>
                  <p className="text-xs text-brand-mist/70 mt-0.5">
                    Manage alerts for community discussions, direct practitioner inquiries and topic
                    subscriptions.
                  </p>
                </div>

                <div className="divide-y divide-brand-edge-dark/60 border-y border-brand-edge-dark/60">
                  {NOTIFICATION_PREFS.map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="min-w-0 pr-4">
                        <label
                          htmlFor={`notif-${key}`}
                          className="block text-sm font-medium text-white cursor-pointer select-none"
                        >
                          {label}
                        </label>
                        <p className="text-xs text-brand-mist/70 mt-1 leading-relaxed">{desc}</p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <CustomToggle
                          id={`notif-${key}`}
                          checked={member.notificationPreferences[key]}
                          onChange={() => toggleNotificationPref(key)}
                          label={label}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Profile Visibility */}
              <section id="visibility" className="scroll-mt-28 space-y-5">
                <div className="border-b border-brand-edge-dark pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright block mb-1">
                    Section 03
                  </span>
                  <h2 className="text-xl font-light text-white tracking-tight">
                    Profile Visibility
                  </h2>
                  <p className="text-xs text-brand-mist/70 mt-0.5">
                    Choose how your Member profile and technical contributions appear across The
                    Lobby.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {VISIBILITY_OPTIONS.map(({ value, label, desc }) => {
                    const isSelected =
                      member.profileVisibility === value ||
                      (value === 'members_only' && member.profileVisibility === 'members-only');

                    return (
                      <label
                        key={value}
                        htmlFor={`vis-${value}`}
                        className={`flex items-start sm:items-center gap-3.5 p-4 rounded border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'border-brand-electric/70 bg-brand-electric/[0.06]'
                            : 'border-brand-edge-dark/80 bg-brand-carbon/30 hover:border-brand-edge-dark hover:bg-brand-carbon/50'
                        }`}
                      >
                        <div className="pt-0.5 sm:pt-0 shrink-0">
                          <input
                            id={`vis-${value}`}
                            type="radio"
                            name="profileVisibility"
                            value={value}
                            checked={isSelected}
                            onChange={() => handleVisibilityChange(value)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-brand-electric bg-brand-electric'
                                : 'border-white/30 bg-transparent'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{label}</span>
                            {isSelected && (
                              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric-bright">
                                Active Selection
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-brand-mist/70 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Section 4: Privacy & Governance */}
              <section id="privacy" className="scroll-mt-28 space-y-4">
                <div className="border-b border-brand-edge-dark pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright block mb-1">
                    Section 04
                  </span>
                  <h2 className="text-xl font-light text-white tracking-tight">
                    Privacy &amp; Governance
                  </h2>
                  <p className="text-xs text-brand-mist/70 mt-0.5">
                    Statutory terms governing your EntireFM Lobby Membership and data rights.
                  </p>
                </div>

                <div className="p-5 rounded border border-brand-edge-dark bg-brand-carbon/30 space-y-3.5 text-xs text-brand-mist/70 leading-relaxed font-light">
                  <p>
                    Your Lobby Member account is governed by our{' '}
                    <Link
                      href="/legal/privacy"
                      className="text-white hover:text-brand-electric-bright underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                    >
                      Privacy Notice <ExternalLink className="h-3 w-3 inline" />
                    </Link>
                    ,{' '}
                    <Link
                      href="/legal/community-guidelines"
                      className="text-white hover:text-brand-electric-bright underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                    >
                      Community Guidelines <ExternalLink className="h-3 w-3 inline" />
                    </Link>
                    , and{' '}
                    <Link
                      href="/legal/acceptable-use"
                      className="text-white hover:text-brand-electric-bright underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                    >
                      Acceptable Use Policy <ExternalLink className="h-3 w-3 inline" />
                    </Link>
                    .
                  </p>

                  <div className="pt-3 border-t border-brand-edge-dark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-brand-mist/50">
                    <span>
                      To request account deletion or submit a Subject Access Request (SAR), contact:{' '}
                      <a
                        href="mailto:privacy@entirefm.com"
                        className="text-brand-mist/80 hover:text-white transition-colors"
                      >
                        privacy@entirefm.com
                      </a>
                    </span>
                    <span className="font-mono text-[10px]">EntireFM Ltd &bull; UK DPA 2018</span>
                  </div>
                </div>
              </section>

              {/* Bottom Sticky/Inline Action Bar */}
              <div className="pt-6 border-t border-brand-edge-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary justify-center min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving preferences…' : 'Save preferences'}
                  </button>

                  <Link
                    href="/member/profile"
                    className="btn-secondary justify-center text-xs py-2 px-4"
                  >
                    Cancel
                  </Link>
                </div>

                {/* Feedback notifications */}
                <div className="flex items-center">
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded animate-in fade-in duration-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Preferences saved successfully</span>
                    </div>
                  )}

                  {saveError && (
                    <div className="flex items-center gap-2 text-xs font-mono text-rose-300 bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded animate-in fade-in duration-200">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{saveError}</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Clean, restrained EntireFM Toggle Switch
 * Width: 40px, Height: 22px
 */
function CustomToggle({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  label: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-offset-2 focus-visible:ring-offset-brand-void ${
        checked
          ? 'bg-brand-electric border-brand-electric'
          : 'bg-brand-carbon border-brand-edge-dark hover:border-brand-edge-dark/90'
      }`}
    >
      <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
      <span
        className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition-transform duration-150 ease-out mt-[2px] ml-[2px] ${
          checked ? 'translate-x-[18px]' : 'translate-x-0 bg-white/70'
        }`}
      />
    </button>
  );
}

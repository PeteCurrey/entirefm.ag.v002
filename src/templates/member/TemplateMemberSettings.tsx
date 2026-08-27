'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Settings, Bell, Shield, Eye, CheckCircle2, AlertCircle,
  ArrowLeft, ArrowRight, User,
} from 'lucide-react';

interface MemberData {
  id: string;
  email: string;
  firstName: string;
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
  profileVisibility: 'public' | 'members-only' | 'private';
}

type ToggleKey = 
  | keyof MemberData['emailPreferences']
  | keyof MemberData['notificationPreferences'];

const EMAIL_PREFS: Array<{ key: keyof MemberData['emailPreferences']; label: string; desc: string }> = [
  { key: 'weeklyDigest', label: 'Weekly FM Briefing digest', desc: 'A curated summary of the week\'s top FM intelligence.' },
  { key: 'complianceAlerts', label: 'Compliance update alerts', desc: 'Regulatory changes, statutory deadlines and enforcement notices.' },
  { key: 'eventInvitations', label: 'Event invitations', desc: 'Lobby events, webinars and industry forums.' },
  { key: 'productUpdates', label: 'Lobby & platform updates', desc: 'New features, tools and major improvements to The Lobby.' },
  { key: 'marketingEmails', label: 'EntireFM commercial communications', desc: 'Service offers, case studies and commercial proposals from EntireFM.' },
];

const NOTIFICATION_PREFS: Array<{ key: keyof MemberData['notificationPreferences']; label: string; desc: string }> = [
  { key: 'newReplies', label: 'Replies to my posts', desc: 'Notified when someone replies to your community contributions.' },
  { key: 'mentions', label: 'Mentions', desc: 'Notified when another member mentions you.' },
  { key: 'followedTopics', label: 'Followed topic updates', desc: 'New articles in topics you follow.' },
];

export function TemplateMemberSettings() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => {
        if (res.status === 401) { setAuthError(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setMember(data.member);
        setLoading(false);
      })
      .catch(() => { setAuthError(true); setLoading(false); });
  }, []);

  function toggleEmailPref(key: keyof MemberData['emailPreferences']) {
    if (!member) return;
    setMember({ ...member, emailPreferences: { ...member.emailPreferences, [key]: !member.emailPreferences[key] } });
  }

  function toggleNotificationPref(key: keyof MemberData['notificationPreferences']) {
    if (!member) return;
    setMember({ ...member, notificationPreferences: { ...member.notificationPreferences, [key]: !member.notificationPreferences[key] } });
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
      if (!res.ok) { setSaveError(data.error || 'Failed to save preferences.'); setIsSaving(false); return; }
      setMember(data.member);
      setSaveSuccess(true);
    } catch {
      setSaveError('An unexpected error occurred.');
    }
    setIsSaving(false);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="on-dark min-h-screen flex flex-col bg-brand-void">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-electric" />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Unauthenticated ──
  if (authError || !member) {
    return (
      <div className="on-dark min-h-screen flex flex-col bg-brand-void">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-electric/10 border border-brand-electric/20">
              <User className="h-6 w-6 text-brand-electric" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sign in to manage settings</h1>
              <p className="mt-2 text-sm text-brand-mist/60">You need a Lobby Member account to access this page.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-in" className="btn-primary justify-center">
                Sign In <ArrowRight className="btn-arrow h-4 w-4" />
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

  function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric ${
          checked ? 'bg-brand-electric' : 'bg-white/15'
        }`}
      >
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    );
  }

  return (
    <div className="on-dark min-h-screen flex flex-col bg-brand-void">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Page header */}
          <div className="flex items-center gap-4">
            <Link href="/member/profile" className="inline-flex items-center gap-1.5 text-sm text-brand-mist/50 hover:text-brand-mist/80 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Profile
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-electric" />
              <h1 className="text-xl font-bold text-white">Account Settings</h1>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Email preferences */}
            <section className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <Bell className="h-4 w-4 text-brand-electric" />
                <h2 className="text-base font-semibold text-white">Email Communications</h2>
              </div>
              <div className="space-y-5">
                {EMAIL_PREFS.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <label htmlFor={`email-${key}`} className="block text-sm font-medium text-white cursor-pointer">{label}</label>
                      <p className="text-xs text-brand-mist/50 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      id={`email-${key}`}
                      checked={member.emailPreferences[key]}
                      onChange={() => toggleEmailPref(key)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Notification preferences */}
            <section className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <Bell className="h-4 w-4 text-brand-electric" />
                <h2 className="text-base font-semibold text-white">On-site Notifications</h2>
              </div>
              <div className="space-y-5">
                {NOTIFICATION_PREFS.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <label htmlFor={`notif-${key}`} className="block text-sm font-medium text-white cursor-pointer">{label}</label>
                      <p className="text-xs text-brand-mist/50 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      id={`notif-${key}`}
                      checked={member.notificationPreferences[key]}
                      onChange={() => toggleNotificationPref(key)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Profile visibility */}
            <section className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <Eye className="h-4 w-4 text-brand-electric" />
                <h2 className="text-base font-semibold text-white">Profile Visibility</h2>
              </div>
              <div className="space-y-3">
                {([
                  { value: 'public', label: 'Public', desc: 'Your name and bio are visible to all visitors.' },
                  { value: 'members-only', label: 'Members only', desc: 'Your profile is visible to signed-in Lobby Members.' },
                  { value: 'private', label: 'Private', desc: 'Your profile is not visible to other members or visitors.' },
                ] as const).map(({ value, label, desc }) => (
                  <label
                    key={value}
                    htmlFor={`vis-${value}`}
                    className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      member.profileVisibility === value
                        ? 'border-brand-electric/40 bg-brand-electric/5'
                        : 'border-brand-edge-dark hover:border-brand-edge-dark/80'
                    }`}
                  >
                    <input
                      id={`vis-${value}`}
                      type="radio"
                      name="profileVisibility"
                      value={value}
                      checked={member.profileVisibility === value}
                      onChange={() => setMember({ ...member, profileVisibility: value })}
                      className="h-4 w-4 accent-brand-electric"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-brand-mist/50">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Consent & legal references */}
            <section className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <Shield className="h-4 w-4 text-brand-electric" />
                <h2 className="text-base font-semibold text-white">Privacy &amp; Legal</h2>
              </div>
              <div className="space-y-2 text-sm text-brand-mist/60">
                <p>
                  Your Lobby Member account is governed by our{' '}
                  <Link href="/legal/privacy" className="text-brand-electric hover:text-brand-electric-bright transition-colors">Privacy Notice</Link>,{' '}
                  <Link href="/legal/community-guidelines" className="text-brand-electric hover:text-brand-electric-bright transition-colors">Community Guidelines</Link>, and{' '}
                  <Link href="/legal/acceptable-use" className="text-brand-electric hover:text-brand-electric-bright transition-colors">Acceptable Use Policy</Link>.
                </p>
                <p className="text-xs text-brand-mist/40">
                  To request deletion of your account or exercise your data rights, email{' '}
                  <a href="mailto:privacy@entirefm.com" className="text-brand-mist/60 hover:text-brand-mist transition-colors">
                    privacy@entirefm.com
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Save */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving…' : 'Save preferences'}
              </button>

              {saveSuccess && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </span>
              )}

              {saveError && (
                <span className="flex items-center gap-1.5 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {saveError}
                </span>
              )}
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

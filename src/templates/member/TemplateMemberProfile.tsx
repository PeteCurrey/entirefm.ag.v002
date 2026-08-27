'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  User, Settings, LogOut, Pencil, CheckCircle2,
  AlertCircle, BookOpen, Star, ArrowRight,
} from 'lucide-react';

interface MemberData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  avatarUrl?: string;
  memberSince: string;
}

export function TemplateMemberProfile() {
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === '1';

  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', company: '', jobTitle: '', bio: '' });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => {
        if (res.status === 401) { setAuthError(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setMember(data.member);
          setEditData({
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            company: data.member.company || '',
            jobTitle: data.member.jobTitle || '',
            bio: data.member.bio || '',
          });
        }
        setLoading(false);
      })
      .catch(() => { setAuthError(true); setLoading(false); });
  }, []);

  async function handleSignOut() {
    await fetch('/api/member/signout', { method: 'POST' });
    window.location.href = '/lobby';
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/member/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error || 'Failed to save changes.'); setIsSaving(false); return; }
      setMember(data.member);
      setSaveSuccess(true);
      setEditing(false);
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
              <h1 className="text-xl font-bold text-white">Sign in to view your profile</h1>
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

  const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();

  return (
    <div className="on-dark min-h-screen flex flex-col bg-brand-void">
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Welcome banner */}
          {isWelcome && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Welcome to The Lobby, {member.firstName}!</p>
                <p className="mt-1 text-sm text-emerald-300/70">
                  Your Lobby Member account is now active. Explore intelligence, compliance updates and FM briefings below.
                </p>
              </div>
            </div>
          )}

          {/* Profile card */}
          <div className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-electric/20 border border-brand-electric/30 text-lg font-bold text-white">
                  {initials}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{member.firstName} {member.lastName}</h1>
                  {member.jobTitle && <p className="text-sm text-brand-mist/60">{member.jobTitle}</p>}
                  {member.company && <p className="text-xs text-brand-mist/40">{member.company}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditing(true); setSaveSuccess(false); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2 text-xs font-medium text-brand-mist/70 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
                <Link
                  href="/member/settings"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2 text-xs font-medium text-brand-mist/70 hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2 text-xs font-medium text-brand-mist/50 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-brand-edge-dark pt-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-brand-mist/40">Email</dt>
                <dd className="mt-1 text-brand-mist/80 truncate">{member.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-mist/40">Username</dt>
                <dd className="mt-1 text-brand-mist/80">@{member.username}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-mist/40">Member since</dt>
                <dd className="mt-1 text-brand-mist/80">
                  {new Date(member.memberSince).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </dd>
              </div>
            </dl>

            {member.bio && (
              <p className="mt-4 text-sm text-brand-mist/60 leading-relaxed border-t border-brand-edge-dark pt-4">
                {member.bio}
              </p>
            )}

            {saveSuccess && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully.
              </div>
            )}
          </div>

          {/* Edit form */}
          {editing && (
            <div className="rounded-2xl border border-brand-electric/30 bg-brand-electric/5 p-6 sm:p-8">
              <h2 className="text-base font-semibold text-white mb-5">Edit Profile</h2>
              <form onSubmit={handleSave} noValidate className="space-y-4">
                {saveError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm text-red-300">{saveError}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
                    { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
                  ].map(({ name, label, autoComplete }) => (
                    <div key={name}>
                      <label htmlFor={`edit-${name}`} className="block text-xs font-medium text-brand-mist/70 mb-1">
                        {label}
                      </label>
                      <input
                        id={`edit-${name}`}
                        name={name}
                        type="text"
                        autoComplete={autoComplete}
                        value={editData[name as keyof typeof editData]}
                        onChange={(e) => setEditData((p) => ({ ...p, [name]: e.target.value }))}
                        className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                      />
                    </div>
                  ))}
                </div>
                {[
                  { name: 'company', label: 'Company / Organisation', autoComplete: 'organization' },
                  { name: 'jobTitle', label: 'Job title', autoComplete: 'organization-title' },
                ].map(({ name, label, autoComplete }) => (
                  <div key={name}>
                    <label htmlFor={`edit-${name}`} className="block text-xs font-medium text-brand-mist/70 mb-1">
                      {label}
                    </label>
                    <input
                      id={`edit-${name}`}
                      name={name}
                      type="text"
                      autoComplete={autoComplete}
                      value={editData[name as keyof typeof editData]}
                      onChange={(e) => setEditData((p) => ({ ...p, [name]: e.target.value }))}
                      className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="edit-bio" className="block text-xs font-medium text-brand-mist/70 mb-1">
                    Short bio <span className="text-brand-mist/40">(optional)</span>
                  </label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    rows={3}
                    value={editData.bio}
                    onChange={(e) => setEditData((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric resize-none"
                    placeholder="A brief introduction visible on your public Lobby profile"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={isSaving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-ghost-light">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/lobby', icon: BookOpen, label: 'Browse The Lobby', desc: 'FM intelligence and briefings' },
              { href: '/member/settings', icon: Settings, label: 'Account Settings', desc: 'Preferences, notifications and privacy' },
              { href: '/lobby/archive', icon: Star, label: 'Lobby Archive', desc: 'Browse all published articles' },
              { href: '/join', icon: User, label: 'Invite a colleague', desc: 'Share The Lobby with your team' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-xl border border-brand-edge-dark bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-brand-electric/30 transition-all"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-electric/10 border border-brand-electric/20 group-hover:bg-brand-electric/20 transition-colors">
                  <Icon className="h-4 w-4 text-brand-electric" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-brand-mist/50">{desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-brand-mist/30 group-hover:text-brand-electric transition-colors" />
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

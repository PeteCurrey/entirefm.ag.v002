'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';

function PreferencesContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [compliance, setCompliance] = useState(false);
  const [contracts, setContracts] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'unsubscribed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('saving');
    setErrorMessage('');

    const selected: string[] = [];
    if (daily) selected.push('DAILY_LOBBY');
    if (weekly) selected.push('WEEKLY_BRIEFING');
    if (compliance) selected.push('COMPLIANCE_ALERTS');
    if (contracts) selected.push('CONTRACTS_OPPORTUNITIES');

    try {
      const res = await fetch('/api/lobby/daily/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferences: selected,
          unsubscribeToken: token || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Failed to update preferences.');
        return;
      }

      setStatus(selected.length === 0 ? 'unsubscribed' : 'saved');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error occurred.');
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!email && !token) return;
    setStatus('saving');

    try {
      const res = await fetch('/api/lobby/daily/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Failed to unsubscribe.');
        return;
      }

      setDaily(false);
      setWeekly(false);
      setCompliance(false);
      setContracts(false);
      setStatus('unsubscribed');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error occurred.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#111622] border border-white/15 rounded-sm p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-1.5 text-xs font-normal text-white/50 hover:text-[#00E599] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to The Lobby</span>
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-[#00E599] font-semibold block">
          ENTIREFM AUDIENCE PREFERENCE CENTRE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
          Subscription Preferences
        </h1>
        <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
          Manage your email intelligence dispatches from EntireFM. Choose which publications you receive or unsubscribe anytime.
        </p>
      </div>

      {status === 'saved' && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-sm p-4 flex items-center gap-3 text-emerald-300 text-xs font-normal">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your preferences have been saved successfully.</span>
        </div>
      )}

      {status === 'unsubscribed' && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-sm p-4 flex items-center gap-3 text-amber-300 text-xs font-normal">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>You have been unsubscribed from all EntireFM publications.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-sm p-4 flex items-center gap-3 text-rose-300 text-xs font-normal">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-normal uppercase text-white/70 tracking-wider block">
            Work Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.co.uk"
            className="w-full bg-white/5 border border-white/20 focus:border-[#00E599] text-white px-4 py-2.5 text-xs rounded-sm focus:outline-none"
          />
        </div>

        {/* Checkbox Options */}
        <div className="space-y-4 pt-2">
          <label className="text-xs font-normal uppercase text-white/70 tracking-wider block">
            Select Publications
          </label>

          {/* Option 1: The Lobby Daily */}
          <label className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-white/25 transition-colors">
            <input
              type="checkbox"
              checked={daily}
              onChange={(e) => setDaily(e.target.checked)}
              className="mt-1 accent-[#00E599] w-4 h-4 rounded"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-white block">The Lobby Daily</span>
              <span className="text-xs text-white/60 font-light block leading-relaxed">
                Concise executive briefing delivered each weekday morning at 06:45. What changed, why it matters, and what to do next.
              </span>
            </div>
          </label>

          {/* Option 2: Weekly Briefing */}
          <label className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-white/25 transition-colors">
            <input
              type="checkbox"
              checked={weekly}
              onChange={(e) => setWeekly(e.target.checked)}
              className="mt-1 accent-[#00E599] w-4 h-4 rounded"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-white block">Weekly Intelligence Briefing</span>
              <span className="text-xs text-white/60 font-light block leading-relaxed">
                Tuesday morning deep-dive on statutory maintenance, M&amp;E asset strategies, and technical whitepapers.
              </span>
            </div>
          </label>

          {/* Option 3: Compliance Alerts */}
          <label className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-white/25 transition-colors">
            <input
              type="checkbox"
              checked={compliance}
              onChange={(e) => setCompliance(e.target.checked)}
              className="mt-1 accent-[#00E599] w-4 h-4 rounded"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-white block">Compliance &amp; Statutory Alerts</span>
              <span className="text-xs text-white/60 font-light block leading-relaxed">
                High-impact notices from GOV.UK, HSE, and the Building Safety Regulator affecting duty holders.
              </span>
            </div>
          </label>

          {/* Option 4: Contracts & Opportunities */}
          <label className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-white/25 transition-colors">
            <input
              type="checkbox"
              checked={contracts}
              onChange={(e) => setContracts(e.target.checked)}
              className="mt-1 accent-[#00E599] w-4 h-4 rounded"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-white block">Contracts &amp; Commercial Opportunities</span>
              <span className="text-xs text-white/60 font-light block leading-relaxed">
                Public procurement award intelligence, major FM tender notices, and framework awards.
              </span>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#00E599] hover:bg-[#00c784] text-[#0A0D14] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving...' : 'Save Preferences'}
          </button>

          <button
            type="button"
            onClick={handleUnsubscribeAll}
            className="text-xs text-white/40 hover:text-white/80 underline font-normal transition-colors"
          >
            Unsubscribe from all EntireFM emails
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LobbyPreferencesPage() {
  return (
    <main className="min-h-screen bg-[#0A0D14] text-white pt-24 pb-20 px-4 sm:px-6">
      <Suspense fallback={<div className="text-center text-white/50 text-xs">Loading preferences...</div>}>
        <PreferencesContent />
      </Suspense>
    </main>
  );
}

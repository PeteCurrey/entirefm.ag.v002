'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ShieldCheck, MessageSquare, Wrench, Clock } from 'lucide-react';

export function LobbyNewsletter() {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'BOTH'>('BOTH');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    const preferences: string[] = [];
    if (frequency === 'DAILY' || frequency === 'BOTH') preferences.push('DAILY_LOBBY');
    if (frequency === 'WEEKLY' || frequency === 'BOTH') preferences.push('WEEKLY_BRIEFING');

    try {
      const res = await fetch('/api/lobby/daily/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferences,
          signupPage: '/lobby',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to subscribe.');
        return;
      }

      setSubscribed(true);
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A0D14] text-white py-20 sm:py-28">
      {/* Background Architectural Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/editorial/entirefm-headquarters-exterior-1200w.webp"
          alt="EntireFM Headquarters exterior"
          fill
          className="object-cover opacity-20 brightness-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/90 to-[#0A0D14]/85" />
      </div>

      <div className="relative z-10 container-wide max-w-5xl mx-auto space-y-16">
        
        {/* Main Membership Proposition */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-brand-electric" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-electric font-semibold">
              MEMBERSHIP &amp; COMMUNITY
            </span>
            <span className="h-px w-6 bg-brand-electric" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-tight">
            A place for the people running Britain’s buildings.
          </h2>

          <p className="text-base sm:text-lg font-light text-white/75 leading-relaxed">
            The Lobby is the professional conversation and intelligence layer for the UK facilities management industry. Free for verified practitioners.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="px-8 py-3.5 rounded-sm bg-white text-neutral-900 font-semibold text-xs uppercase tracking-wider hover:bg-brand-electric hover:text-white transition-all inline-flex items-center gap-2"
            >
              <span>Join The Lobby</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sign-in"
              className="px-6 py-3.5 rounded-sm text-white/70 hover:text-white text-xs font-mono tracking-wider uppercase border border-white/15 transition-all"
            >
              Member Sign In
            </Link>
          </div>
        </div>

        {/* 3 Core Member Pillars */}
        <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-white/10 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-electric">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider text-white">Verified Peer Network</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
              Connect with fellow estates directors, hard FM leads, and compliance practitioners without sales noise.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-electric">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider text-white">Live Rooms &amp; Roundtable</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
              Realtime technical discussions on Golden Thread compliance, mobilisation standards, and plant diagnostics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-electric">
              <Wrench className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider text-white">Ask EntireFM &amp; Tools</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
              Direct technical queries answered by senior building services engineers, plus full access to operational matrices.
            </p>
          </div>
        </div>

        {/* The Lobby Daily & Weekly Signup */}
        <div className="pt-10 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
          <div className="text-left space-y-1.5 max-w-md">
            <div className="flex items-center gap-2 text-[#00E599] text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>THE LOBBY DAILY · 06:45 DISPATCH</span>
            </div>
            <p className="text-base font-medium text-white">
              Start your working day informed. Receive The Lobby Daily each weekday morning.
            </p>
            <p className="text-xs text-white/50 font-light leading-relaxed">
              What changed. Why it matters. What to do next. Distinct from sales enquiries.
            </p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="w-full lg:w-auto space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email address..."
                  required
                  className="px-4 py-2.5 text-xs rounded-sm border border-white/20 focus:border-[#00E599] bg-white/5 text-white placeholder:text-white/40 w-full sm:w-64 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-sm bg-[#00E599] hover:bg-[#00c784] text-[#0A0D14] text-xs font-semibold uppercase tracking-wider transition-all shrink-0 disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Get Briefing'}
                </button>
              </div>

              {/* Frequency Selector */}
              <div className="flex items-center gap-4 text-[11px] font-mono text-white/60">
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === 'DAILY'}
                    onChange={() => setFrequency('DAILY')}
                    className="accent-[#00E599]"
                  />
                  <span>Daily Morning</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === 'WEEKLY'}
                    onChange={() => setFrequency('WEEKLY')}
                    className="accent-[#00E599]"
                  />
                  <span>Weekly (Tue)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === 'BOTH'}
                    onChange={() => setFrequency('BOTH')}
                    className="accent-[#00E599]"
                  />
                  <span>Both</span>
                </label>
              </div>

              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
            </form>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-sm text-emerald-400 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-semibold block text-white">Subscription Confirmed</span>
                <span className="text-white/70">You will receive The Lobby Daily executive intelligence briefing.</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

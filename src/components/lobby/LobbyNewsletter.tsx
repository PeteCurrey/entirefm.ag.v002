'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ShieldCheck, MessageSquare, Wrench } from 'lucide-react';

export function LobbyNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
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

        {/* Quiet Tuesday Dispatch Newsletter Signup */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-left space-y-1">
            <p className="text-sm font-medium text-white">Prefer weekly email updates only?</p>
            <p className="text-xs text-white/50 font-light">Receive the Tuesday morning FM intelligence dispatch directly to your inbox.</p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email address..."
                required
                className="px-4 py-2.5 text-xs rounded-sm border border-white/20 focus:border-brand-electric bg-white/5 text-white placeholder:text-white/40 w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-sm bg-white/15 text-white text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmed for the Tuesday Dispatch.</span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

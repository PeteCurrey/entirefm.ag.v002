'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export function LobbyNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="relative overflow-hidden bg-black text-white py-20 sm:py-28">
      {/* Background Architectural Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/editorial/entirefm-headquarters-exterior-1200w.webp"
          alt="EntireFM Headquarters exterior"
          fill
          className="object-cover opacity-25 brightness-75 filter grayscale"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-6 bg-brand-electric" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric">
            JOIN THE LOBBY · THE TUESDAY DISPATCH
          </span>
          <span className="h-px w-6 bg-brand-electric" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-tight">
          A place for the people running Britain’s buildings.
        </h2>

        <p className="text-sm sm:text-base font-light text-white/70 max-w-2xl mx-auto leading-relaxed">
          Every Tuesday morning: statutory compliance shifts, engineering notes, diagnostic teardowns, and verified FM tools delivered without vendor noise.
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter work email address..."
              required
              className="flex-1 px-4 py-3.5 text-xs sm:text-sm rounded-sm border border-white/20 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-sm bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-brand-electric hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span>Receive Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-sm bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>You are confirmed for the Tuesday FM Intelligence Dispatch.</span>
          </div>
        )}

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-white/40">
          <span>WEEKLY EDITORIAL</span>
          <span>·</span>
          <span>ZERO SPAM</span>
          <span>·</span>
          <Link href="/join" className="text-brand-electric hover:underline font-semibold">
            Become a Verified Member &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

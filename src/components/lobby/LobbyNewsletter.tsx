'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight, Bookmark } from 'lucide-react';

export function LobbyNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="border-t border-brand-edge bg-brand-surface py-16 sm:py-20">
      <div className="container-custom">
        <div className="border border-brand-edge bg-white rounded-sm p-8 sm:p-12 shadow-card text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-brand-electric" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-electric">
              The Tuesday Dispatch · The FM Briefing
            </span>
            <span className="h-px w-6 bg-brand-electric" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extralight text-brand-graphite leading-tight tracking-tight">
            Never miss what changes in UK Facilities Management.
          </h3>

          <p className="text-sm font-light text-brand-slate max-w-xl mx-auto leading-relaxed">
            Every Tuesday morning: the week’s critical compliance shifts, engineering notes, and newly released tools delivered directly to your inbox. No sales fluff.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email address..."
                required
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
              />
              <button
                type="submit"
                className="btn-primary text-xs sm:text-sm py-3 px-6 shrink-0 justify-center"
              >
                <span>Receive Briefing</span>
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-center gap-2 animate-rise">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you. You are on the Tuesday FM Briefing dispatch list.</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[11px] font-light text-brand-silver">
            <span>Free weekly publication</span>
            <span>·</span>
            <span>Zero vendor spam</span>
            <span>·</span>
            <Link href="/fm-briefing/unsubscribe" className="hover:underline">
              Manage preferences
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-unsubscribe if token is provided in URL (RFC 8058 One-Click)
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('/api/lobby/daily/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => {
          if (res.ok) setUnsubscribed(true);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/lobby/daily/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      if (res.ok) {
        setUnsubscribed(true);
      }
    } catch {
      // safe ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#111622] border border-white/15 rounded-sm p-6 sm:p-8 space-y-6 text-center">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#00E599] font-semibold block">
          THE LOBBY BY ENTIREFM
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight">
          One-Click Unsubscribe
        </h1>
      </div>

      {unsubscribed ? (
        <div className="space-y-4 pt-2">
          <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-white/80 leading-relaxed font-light">
            You have been successfully removed from The Lobby Daily and associated intelligence emails.
          </p>
          <p className="text-xs text-white/50">
            Your suppression record is active. You will not receive further scheduled dispatches.
          </p>
          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs font-normal">
            <Link href="/lobby" className="text-[#00E599] hover:underline">
              Return to The Lobby
            </Link>
            <Link href="/lobby/preferences" className="text-white/60 hover:underline">
              Manage Preferences
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <p className="text-xs text-white/70 font-light leading-relaxed">
            Confirm your email address below to immediately unsubscribe from The Lobby Daily.
          </p>

          <div>
            <label className="text-[11px] font-normal uppercase text-white/60 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.co.uk"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00E599] text-white px-3.5 py-2 text-xs rounded-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Unsubscribe'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LobbyUnsubscribePage() {
  return (
    <main className="min-h-screen bg-[#0A0D14] text-white pt-28 pb-20 px-4">
      <Suspense fallback={<div className="text-center text-white/50 text-xs">Loading...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </main>
  );
}

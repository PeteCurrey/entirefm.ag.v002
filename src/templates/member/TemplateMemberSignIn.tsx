'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LogIn, AlertCircle, ArrowRight, Lock } from 'lucide-react';

// ─── Inner form (uses useSearchParams — must be inside Suspense) ──────────────

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/member/profile';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === '1') setRegistered(true);
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/member/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign in failed. Please check your email and password.');
        setIsSubmitting(false);
        return;
      }

      router.push(redirectTo);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {registered && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm text-emerald-300">
          Your account has been created. Sign in to access The Lobby.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/40 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-mist/80 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-brand-mist/80">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-brand-electric hover:text-brand-electric-bright transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
          placeholder="Your password"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !formData.email || !formData.password}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in&hellip;
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign in to The Lobby
            <ArrowRight className="btn-arrow h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-brand-mist/50">
        Don&apos;t have an account?{' '}
        <Link href="/join" className="text-brand-electric hover:text-brand-electric-bright transition-colors font-medium">
          Become a Member
        </Link>
      </p>
    </form>
  );
}

// ─── Main template ─────────────────────────────────────────────────────────────

export function TemplateMemberSignIn() {
  return (
    <div className="on-dark min-h-screen flex flex-col bg-brand-void">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-electric/10 border border-brand-electric/20 mb-4">
              <Lock className="h-5 w-5 text-brand-electric" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Sign in to The Lobby
            </h1>
            <p className="mt-2 text-sm text-brand-mist/60">
              Your FM intelligence briefing room
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-white/5" />}>
              <SignInForm />
            </Suspense>
          </div>

          {/* Divider note */}
          <p className="mt-6 text-center text-xs text-brand-mist/30 leading-relaxed">
            This is your Lobby Member account. CAFM platform users access the{' '}
            <Link href="/login" className="text-brand-mist/50 hover:text-brand-mist transition-colors">
              CAFM portal here
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

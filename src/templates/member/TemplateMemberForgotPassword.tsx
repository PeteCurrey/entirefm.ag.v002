'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function TemplateMemberForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // Always show success regardless of whether email exists (privacy-preserving)
    try {
      await fetch('/api/member/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Intentionally swallow — we show success regardless
    }

    setSubmitted(true);
    setIsSubmitting(false);
  }

  return (
    <div className="on-dark min-h-screen flex flex-col bg-brand-void">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-electric/10 border border-brand-electric/20 mb-4">
              <Mail className="h-5 w-5 text-brand-electric" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-brand-mist/60">
              Enter your Lobby Member email and we&apos;ll send reset instructions.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-brand-edge-dark bg-white/[0.03] p-6 sm:p-8">

            {submitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Check your inbox</h2>
                  <p className="mt-2 text-sm text-brand-mist/60 leading-relaxed">
                    If an account exists for{' '}
                    <span className="text-brand-mist/80 font-medium">{email}</span>,
                    you will receive a password reset link within a few minutes.
                  </p>
                  <p className="mt-3 text-xs text-brand-mist/40">
                    Check your spam folder if you don&apos;t see it.
                    The link will expire in 30&nbsp;minutes.
                  </p>
                </div>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm text-brand-electric hover:text-brand-electric-bright transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-brand-edge-dark bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending&hellip;
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1 text-sm text-brand-mist/50 hover:text-brand-mist/80 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to sign in
                  </Link>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

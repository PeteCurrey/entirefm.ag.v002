'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

export function TemplateMemberForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/member/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Always show success regardless to prevent email enumeration attacks
      setSubmitted(true);
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      activeRoute="forgot-password"
      imageSrc="/images/editorial/entirefm-distribution-board-testing-1200w.webp"
      imageAlt="Commercial electrical distribution board diagnostic testing"
      badgeText="THE LOBBY · ACCOUNT RECOVERY"
      headline="Secure password recovery for registered Lobby Members."
      subheadline="All password recovery tokens are cryptographically signed with short expiration windows for maximum security."
    >
      <div className="space-y-6 sm:space-y-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-5 bg-brand-electric" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light">
              Security &amp; Credentials
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
            Reset your password
          </h1>
          <p className="text-sm font-light text-neutral-600 leading-relaxed">
            Enter the email address associated with your Lobby Member account and we will send you secure reset instructions.
          </p>
        </div>

        {/* ── Error Banner ────────────────────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-[6px] border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-light">{error}</span>
          </div>
        )}

        {/* ── Form or Success State ───────────────────────────────────── */}
        {submitted ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-[8px] border border-neutral-200/90 bg-white shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-light text-neutral-900">
                  Check your inbox
                </h3>
                <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                  If an active account exists for{' '}
                  <span className="font-normal text-xs text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-[4px]">
                    {email}
                  </span>
                  , you will receive password reset instructions within a few moments.
                </p>
              </div>

              <p className="text-[11px] font-extralight text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                For security reasons, recovery links expire after 30 minutes. Please check your junk or quarantine folders if the email does not arrive promptly.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="text-xs font-light text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
              >
                Registered Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.co.uk"
                className="w-full px-4 py-3 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-[#0B1220] hover:bg-[#1E293B] text-white py-3.5 px-6 rounded-[6px] text-sm font-light tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending recovery email&hellip;</span>
                  </>
                ) : (
                  <>
                    <span>Send recovery instructions</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        {!submitted && (
          <div className="pt-4 border-t border-neutral-200/80 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  );
}

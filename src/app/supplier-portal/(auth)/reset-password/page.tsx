'use client';

/**
 * /supplier-portal/reset-password
 * =================================
 * Password reset UI for Supplier accounts.
 *
 * Arrival paths:
 * A) From /auth/confirm?type=recovery (PKCE flow — recommended):
 *    - /auth/confirm verifies the token_hash server-side, gets a Supabase session,
 *      and stores the access_token in an encrypted HTTP-only cookie (efm_recovery).
 *    - On mount, this page calls GET /api/supplier/auth/reset-password/session to
 *      retrieve and immediately consume that cookie.
 *
 * B) Legacy hash-based recovery (Supabase implicit flow, if configured):
 *    - access_token arrives in window.location.hash (#access_token=...&type=recovery).
 *    - Extracted client-side as a fallback if no session cookie is present.
 *
 * States:
 * - loading: Fetching recovery token from session endpoint.
 * - ready: Token obtained — show password form.
 * - expired: Token missing, expired, or already used — show clear error with retry link.
 * - success: Password updated — show confirmation and link to sign in.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

type PageState = 'loading' | 'ready' | 'expired' | 'success';

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Token Acquisition on Mount ───────────────────────────────────────────────
  useEffect(() => {
    async function acquireToken() {
      // 1. Preferred: read from one-time HTTP-only recovery session cookie via API
      try {
        const res = await fetch('/api/supplier/auth/reset-password/session', {
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          if (json.valid && json.accessToken) {
            setToken(json.accessToken);
            setPageState('ready');
            return;
          }
          // Cookie present but expired/invalid — explicit expired state
          if (!json.valid && (json.reason === 'expired' || json.reason === 'invalid')) {
            setPageState('expired');
            return;
          }
        }
        // 401 / not_found → fall through to hash extraction
      } catch {
        // Network failure or session endpoint unavailable → fall through
      }

      // 2. Fallback: extract from URL hash (Supabase implicit flow / direct link)
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const hashToken = params.get('access_token');
        const hashType = params.get('type');
        if (hashToken && hashType === 'recovery') {
          setToken(hashToken);
          // Clean hash from URL without reload
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          setPageState('ready');
          return;
        }

        // Also check query params
        const searchParams = new URLSearchParams(window.location.search);
        const queryToken = searchParams.get('token') || searchParams.get('access_token');
        if (queryToken) {
          setToken(queryToken);
          setPageState('ready');
          return;
        }
      }

      // 3. No token found by any method — show expired state
      setPageState('expired');
    }

    acquireToken();
  }, []);

  // ── Password Strength ─────────────────────────────────────────────────────────
  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'][strength];

  // ── Form Submission ────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 10) { setError('Password must be at least 10 characters.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter.'); return; }
    if (!/\d/.test(password)) { setError('Password must contain at least one number.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/supplier/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, password, confirmPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.error || 'Password update failed. Please try again.');
        return;
      }

      setPageState('success');
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Shared Layout Wrapper ─────────────────────────────────────────────────────
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white selection:bg-brand-pink selection:text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[17px] font-light tracking-tight text-white">
              Entire<span className="font-light text-brand-pink">FM</span>
            </span>
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2 py-0.5 font-light text-[10.5px] uppercase tracking-wider text-slate-400">
              Supplier Portal
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Unified Operations Platform · Secure Supplier Access
      </footer>
    </div>
  );

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <Shell>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-brand-pink" />
          <p className="text-[13px] text-slate-400">Verifying your recovery link…</p>
        </div>
      </Shell>
    );
  }

  // ── Expired / Invalid State ───────────────────────────────────────────────────
  if (pageState === 'expired') {
    return (
      <Shell>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <h1 className="text-xl font-extralight tracking-tight text-white">Recovery Link Expired</h1>
          </div>
          <p className="text-[13px] leading-relaxed text-slate-400">
            This password reset link has already been used, has expired (links are valid for 5 minutes), or is no longer valid.
          </p>
          <p className="text-[13px] leading-relaxed text-slate-400">
            Please request a new password reset link from the sign-in page.
          </p>
          <Link
            href="/supplier-portal/forgot-password"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90"
          >
            <RotateCcw className="h-4 w-4" />
            Request a New Reset Link
          </Link>
          <div className="text-center">
            <Link href="/supplier-portal/sign-in" className="text-[11.5px] text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Success State ─────────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <Shell>
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h1 className="text-2xl font-extralight tracking-tight text-white">Password Updated</h1>
            <p className="text-[13px] leading-relaxed text-slate-400 max-w-xs">
              Your new password has been saved. You can now sign in to the EntireFM Supplier Portal.
            </p>
          </div>
          <Link
            href="/supplier-portal/sign-in"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90"
          >
            Sign In to Supplier Portal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Ready State — Password Form ───────────────────────────────────────────────
  return (
    <Shell>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-emerald-400">
            <Lock className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-wider font-light">Recovery Active</span>
          </div>
          <h1 className="text-2xl font-extralight tracking-tight text-white">Set New Password</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            Choose a strong password for your EntireFM supplier account.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Minimum 10 characters"
                className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength ? strengthColor : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Strength: <span className="text-white">{strengthLabel}</span>
                </p>
              </div>
            )}
            <ul className="mt-2 space-y-0.5 text-[11px] text-slate-500">
              <li className={password.length >= 10 ? 'text-emerald-400' : ''}>At least 10 characters</li>
              <li className={/[A-Z]/.test(password) ? 'text-emerald-400' : ''}>One uppercase letter</li>
              <li className={/\d/.test(password) ? 'text-emerald-400' : ''}>One number</li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Re-enter your new password"
                className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1.5 text-[11px] text-rose-400">Passwords do not match.</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Passwords match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || strength < 2}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Updating Password…
              </>
            ) : (
              <>Update Password <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/supplier-portal/sign-in" className="text-[11.5px] text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </Shell>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Extract access_token from Supabase recovery redirect hash or query parameter
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setToken(accessToken);
        return;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const queryToken = searchParams.get('token') || searchParams.get('access_token');
      if (queryToken) {
        setToken(queryToken);
      }
    }
  }, []);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/supplier/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Password reset failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[17px] font-light tracking-tight text-white">
              Entire<span className="font-light text-brand-pink">FM</span>
            </span>
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Supplier Portal
            </span>
          </Link>
          <Link
            href="/supplier-portal/sign-in"
            className="text-[12px] font-normal text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
            {success ? (
              <div className="text-center space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-light text-white">Password Updated</h1>
                  <p className="mt-2 text-[13px] text-slate-400">
                    Your supplier account password has been updated. You can now sign in.
                  </p>
                </div>
                <Link
                  href="/supplier-portal/sign-in"
                  className="inline-flex w-full items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-[13.5px] font-medium text-white hover:bg-brand-pink/90 transition-colors"
                >
                  Sign In <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 mb-4">
                    <Lock className="h-3.5 w-3.5 text-brand-pink" />
                    Supabase Security Recovery
                  </div>
                  <h1 className="text-2xl font-light tracking-tight text-white">
                    Set a new password
                  </h1>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    Enter your new secure password below to regain access to your supplier account.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 10 chars, uppercase & number"
                        className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-slate-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmitting ? 'Updating Password…' : 'Set New Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Secure Supabase Authentication
      </footer>
    </div>
  );
}

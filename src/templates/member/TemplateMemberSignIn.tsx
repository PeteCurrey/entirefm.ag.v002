'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, Lock } from 'lucide-react';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/member/profile';

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams?.get('registered') === '1') setRegistered(true);
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        // If the account exists but has pending verification, route smoothly to /verify-email
        if (data.pendingVerification && data.email) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}&raw=${encodeURIComponent(formData.email)}`);
          return;
        }

        setError(data.error || 'Incorrect email address or password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      router.push(data.redirectUrl || redirectTo);
    } catch {
      setError('A network error occurred. Please verify your connection and try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Heading Hierarchy ────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-5 bg-brand-electric" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light">
            Lobby Access Desk
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="text-sm font-light text-neutral-600 leading-relaxed">
          Sign in to access your grounded FM research library, live statutory briefings, and community desks.
        </p>
      </div>

      {/* ── Status Notifications ──────────────────────────────────────── */}
      {registered && (
        <div className="p-4 rounded-[6px] border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Your Member account has been activated. Sign in below to enter The Lobby.</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 rounded-[6px] border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-light">{error}</span>
        </div>
      )}

      {/* ── Authentication Form ───────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
          >
            Work Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.co.uk"
            className="w-full px-4 py-3 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-light text-brand-electric hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 pr-11 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-neutral-600 select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded-[4px] border-neutral-300 text-brand-electric focus:ring-brand-electric cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !formData.email || !formData.password}
            className="w-full bg-[#0B1220] hover:bg-[#1E293B] text-white py-3.5 px-6 rounded-[6px] text-sm font-light tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying credentials&hellip;</span>
              </>
            ) : (
              <>
                <span>Sign in to The Lobby</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Footer Navigation & Cross-Portal Reference ───────────────── */}
      <div className="pt-6 border-t border-neutral-200/80 space-y-4 text-center">
        <p className="text-xs font-light text-neutral-600">
          Not yet registered with The Lobby?{' '}
          <Link
            href="/join"
            className="text-brand-electric font-normal hover:underline ml-1"
          >
            Become a Member &rarr;
          </Link>
        </p>

        <p className="text-[11px] font-extralight text-neutral-500 leading-relaxed max-w-sm mx-auto">
          Holding an operational Client, Engineer, or Contractor account? EntireFM uses a unified identity model—sign in with your existing work credentials.
        </p>
      </div>
    </div>
  );
}

export function TemplateMemberSignIn() {
  return (
    <AuthSplitLayout
      activeRoute="sign-in"
      imageSrc="/images/editorial/entirefm-rooftop-plant-night-1200w.webp"
      imageAlt="Commercial rooftop plant room and skyline at dusk"
      badgeText="THE LOBBY · MEMBER ENTRANCE"
      headline="A professional intelligence network for the people running Britain's buildings."
      subheadline="Stay ahead of statutory compliance, research with citations, and connect with commercial facilities leaders."
    >
      <Suspense fallback={<div className="h-80 bg-neutral-200/40 animate-pulse rounded-[8px]" />}>
        <SignInForm />
      </Suspense>
    </AuthSplitLayout>
  );
}

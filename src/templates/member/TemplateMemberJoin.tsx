'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';

export function TemplateMemberJoin() {
  const router = useRouter();
  const formMountTime = useRef<number>(Date.now());

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    jobTitle: '',
    termsAccepted: false,
    privacyAcknowledged: false,
    marketingConsent: true,
  });

  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    formMountTime.current = Date.now();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.termsAccepted) {
      setError('Please accept the Website Terms of Use to join The Lobby.');
      return;
    }

    if (!formData.privacyAcknowledged) {
      setError('Please acknowledge the Privacy Notice to continue.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          company: formData.company,
          job_title: formData.jobTitle,
          terms_accepted: formData.termsAccepted,
          privacy_acknowledged: formData.privacyAcknowledged,
          marketing_consent: formData.marketingConsent,
          turnstile_token: turnstileToken,
          [HONEYPOT_FIELD_NAME]: honeypot,
          fill_duration_ms: Math.max(0, Date.now() - formMountTime.current),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create Member account.');
      }

      router.push(data.redirectUrl || `/verify-email?email=${encodeURIComponent(data.email || formData.email)}&raw=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      activeRoute="join"
      imageSrc="/images/editorial/entirefm-manchester-castlefield-night-1280w.webp"
      imageAlt="Modern commercial architectural estate at night"
      badgeText="THE LOBBY · PROFESSIONAL REGISTRATION"
      headline="Join Britain's commercial facilities management intelligence network."
      subheadline="Create your free Member account to access grounded engineering research, statutory compliance watches, and peer discussions."
    >
      <div className="space-y-6 sm:space-y-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-5 bg-brand-electric" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light">
              Free Professional Membership
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
            Become a Member
          </h1>
          <p className="text-sm font-light text-neutral-600 leading-relaxed">
            Register your professional profile to save research briefs, access technical indexes, and join industry discussions.
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

        {/* ── Registration Form ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Email field */}
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
              className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
            />
          </div>

          {/* Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="company"
                className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
              >
                Organisation / Estate
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. British Land, NHS Trust"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="jobTitle"
                className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
              >
                Role / Title
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                autoComplete="organization-title"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Estates Director, M&E Lead"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-light text-neutral-700 uppercase tracking-wider"
            >
              Choose Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 pr-11 rounded-[6px] border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-light focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors shadow-2xs"
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
            <p className="text-[11px] font-extralight text-neutral-500">
              Must be at least 8 characters. Stored with cryptographic hash protection.
            </p>
          </div>

          {/* Policy Consents */}
          <div className="space-y-3 pt-2 border-t border-neutral-200/80">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-light text-neutral-600 select-none">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded-[4px] border-neutral-300 text-brand-electric focus:ring-brand-electric cursor-pointer shrink-0"
              />
              <span>
                I agree to the{' '}
                <Link href="/legal/terms-of-use" target="_blank" className="text-brand-electric underline">
                  Terms of Use
                </Link>{' '}
                and Community Guidelines.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-light text-neutral-600 select-none">
              <input
                type="checkbox"
                name="privacyAcknowledged"
                checked={formData.privacyAcknowledged}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded-[4px] border-neutral-300 text-brand-electric focus:ring-brand-electric cursor-pointer shrink-0"
              />
              <span>
                I acknowledge the{' '}
                <Link href="/legal/privacy" target="_blank" className="text-brand-electric underline">
                  Privacy Notice
                </Link>{' '}
                governing the processing of Member data.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-light text-neutral-600 select-none">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded-[4px] border-neutral-300 text-brand-electric focus:ring-brand-electric cursor-pointer shrink-0"
              />
              <span>Receive the Tuesday FM Intelligence Briefing and critical statutory alerts.</span>
            </label>
          </div>

          {/* Honeypot field (hidden from genuine users and screen readers) */}
          <div
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <label htmlFor="website_url">Website URL (leave blank)</label>
            <input
              id="website_url"
              name={HONEYPOT_FIELD_NAME}
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Cloudflare Turnstile Anti-Bot Challenge */}
          <div className="pt-1">
            <TurnstileWidget
              onVerify={(token) => {
                setTurnstileToken(token);
                setError(null);
              }}
              onExpire={() => setTurnstileToken('')}
              onError={() => setError('Anti-bot challenge could not be loaded. Please refresh the page.')}
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.password}
              className="w-full bg-[#0B1220] hover:bg-[#1E293B] text-white py-3.5 px-6 rounded-[6px] text-sm font-light tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating your Member profile&hellip;</span>
                </>
              ) : (
                <>
                  <span>Join The Lobby</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-neutral-200/80 text-center space-y-2">
          <p className="text-xs font-light text-neutral-600">
            Already registered?{' '}
            <Link href="/sign-in" className="text-brand-electric font-normal hover:underline ml-1">
              Sign in to The Lobby &rarr;
            </Link>
          </p>
          <p className="text-[11px] font-extralight text-neutral-500 max-w-sm mx-auto">
            EntireFM operates a single-identity model. If you hold an operational Client, Engineer, or Contractor account, you do not need a second account.
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Lock, AlertCircle } from 'lucide-react';

export function TemplateMemberJoin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    jobTitle: '',
    termsAccepted: false,
    privacyAcknowledged: false,
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.termsAccepted) {
      setError('You must agree to the Website Terms of Use to join.');
      return;
    }

    if (!formData.privacyAcknowledged) {
      setError('You must acknowledge the Privacy Notice to continue.');
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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create Member account.');
      }

      router.push(data.redirectUrl || '/member/profile?welcome=1');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-graphite">
      <Header solid={true} />

      <main id="main" className="flex-1 min-h-[calc(100vh-80px)] flex items-center py-12 sm:py-16 lg:py-24 bg-[#FAF9F7]">
        <div className="container-wide w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-center">
            {/* Left Column: Value Proposition */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-electric">
                  The Lobby · Member Access
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extralight text-brand-graphite leading-tight tracking-tight">
                Join the UK Facilities Management Intelligence Community.
              </h1>

              <p className="text-sm sm:text-base font-light text-brand-slate leading-relaxed text-pretty">
                Create your free Member profile to access exclusive engineering diagnostics, participate in peer Q&amp;A, bookmark critical compliance updates, and receive the Tuesday FM Briefing.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/10 text-brand-electric text-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-light text-brand-slate">
                    <strong className="font-normal text-brand-graphite">Real-time Compliance Watch:</strong> Statutory translations and duty-holder alerts.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/10 text-brand-electric text-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-light text-brand-slate">
                    <strong className="font-normal text-brand-graphite">Engineer’s Notebook:</strong> Mechanical &amp; electrical plant diagnostics directly from live UK sites.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/10 text-brand-electric text-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-light text-brand-slate">
                    <strong className="font-normal text-brand-graphite">Verified FM Toolkits:</strong> Downloadable spreadsheets, matrices, and specification builders.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-edge text-xs font-light text-brand-silver">
                Already have a Lobby Member account?{' '}
                <Link href="/sign-in" className="text-brand-electric font-normal hover:underline">
                  Sign in here →
                </Link>
              </div>
            </div>

            {/* Right Column: Registration Card */}
            <div className="border border-brand-edge bg-white rounded-sm p-6 sm:p-10 shadow-card">
              <div className="border-b border-brand-edge pb-4 mb-6">
                <h2 className="text-xl font-light text-brand-graphite">Create your Member profile</h2>
                <p className="text-xs font-light text-brand-silver mt-1">
                  Takes less than 60 seconds. No credit card required.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-rise">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-graphite mb-1">
                      First name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Pete"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-graphite mb-1">
                      Last name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Currey"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-graphite mb-1">
                    Work email address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.co.uk"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-graphite mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-graphite mb-1">
                      Company / Estate <span className="text-brand-silver font-light">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. British Land"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-graphite mb-1">
                      Job title <span className="text-brand-silver font-light">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Facilities Manager"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge focus:border-brand-electric focus:ring-1 focus:ring-brand-electric bg-white text-brand-graphite placeholder:text-brand-silver/60"
                    />
                  </div>
                </div>

                {/* Consent & Agreements */}
                <div className="space-y-3 pt-3 border-t border-brand-edge text-xs font-light text-brand-slate">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="rounded-sm border-brand-edge text-brand-electric focus:ring-brand-electric mt-0.5"
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/legal/terms-of-use" target="_blank" className="text-brand-electric hover:underline">
                        Website Terms of Use (v2026.1)
                      </Link>{' '}
                      and{' '}
                      <Link href="/legal/community-guidelines" target="_blank" className="text-brand-electric hover:underline">
                        Community Guidelines
                      </Link>
                      . <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacyAcknowledged}
                      onChange={(e) => setFormData({ ...formData, privacyAcknowledged: e.target.checked })}
                      className="rounded-sm border-brand-edge text-brand-electric focus:ring-brand-electric mt-0.5"
                    />
                    <span>
                      I acknowledge the{' '}
                      <Link href="/legal/privacy" target="_blank" className="text-brand-electric hover:underline">
                        Privacy Notice (v2026.1)
                      </Link>{' '}
                      and understand how my data is processed. <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                      className="rounded-sm border-brand-edge text-brand-electric focus:ring-brand-electric mt-0.5"
                    />
                    <span className="text-brand-silver">
                      Optional: Keep me updated on technical CPD webinars, events, and industry benchmark reports. (You can withdraw consent anytime in settings).
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center text-xs sm:text-sm py-3"
                  >
                    <span>{loading ? 'Creating Member Profile...' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4 btn-arrow" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

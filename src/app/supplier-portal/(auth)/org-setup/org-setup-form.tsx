'use client';

import React, { useState } from 'react';
import { Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrgSetupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    legalName: '',
    tradingName: '',
    companyNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsDuplicate(false);

    if (!form.legalName.trim()) {
      setError('Legal company name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/supplier/org/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legalName: form.legalName.trim(),
          tradingName: form.tradingName.trim() || undefined,
          companyNumber: form.companyNumber.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Direct navigation ensures fresh cookie transmission and full server component render
        window.location.href = '/supplier-portal/onboarding';
        return;
      }

      if (data.duplicate) {
        setIsDuplicate(true);
        setError(data.error || 'This organisation may already have an EntireFM supplier account.');
      } else {
        setError(data.error || 'Organisation setup failed. Please try again.');
      }
      setIsSubmitting(false);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[520px]">
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 mb-4">
            <Building2 className="h-3.5 w-3.5 text-brand-pink" />
            Company Setup
          </div>
          <h1 className="text-2xl font-extralight tracking-tight text-white">
            Tell us about your company
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            We&apos;ll use this to set up your supplier organisation. You can add full detail during the application.
          </p>
        </div>

        {/* Error / Duplicate Banner */}
        {error && (
          <div className={`mb-6 rounded border p-4 text-[12.5px] space-y-2 ${
            isDuplicate
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {isDuplicate && (
              <div className="pl-6">
                <a
                  href="mailto:supplier-support@entirefm.com"
                  className="text-amber-400 font-medium hover:underline"
                >
                  Contact Supplier Support →
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Legal Company Name */}
          <div>
            <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
              Legal Company Name *
            </label>
            <input
              type="text"
              required
              value={form.legalName}
              onChange={(e) => setForm({ ...form, legalName: e.target.value })}
              placeholder="As registered at Companies House"
              className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>

          {/* Trading Name */}
          <div>
            <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
              Trading Name{' '}
              <span className="text-slate-600 normal-case font-normal">(if different from legal name)</span>
            </label>
            <input
              type="text"
              value={form.tradingName}
              onChange={(e) => setForm({ ...form, tradingName: e.target.value })}
              placeholder="Optional"
              className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>

          {/* Companies House Number */}
          <div>
            <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
              Companies House Number{' '}
              <span className="text-slate-600 normal-case font-normal">(optional at this stage)</span>
            </label>
            <input
              type="text"
              value={form.companyNumber}
              onChange={(e) => setForm({ ...form, companyNumber: e.target.value })}
              placeholder="e.g. 12345678"
              className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Used for duplicate organisation check. Full detail is captured in Stage 1 of the application.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-brand-pink py-3 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Setting up…' : (
              <>Continue to Supplier Application <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-[11.5px] text-slate-500 font-light">
        Your organisation data is private and scoped to your account only
      </p>
    </div>
  );
}

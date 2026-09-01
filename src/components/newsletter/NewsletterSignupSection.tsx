'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface NewsletterFormProps {
  signupPage?: string;
  className?: string;
  sourceContext?: string;
}

export function NewsletterSignupSection({
  signupPage = '/fm-briefing',
  className = '',
  sourceContext,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          company,
          role,
          signupPage,
          utmSource: sourceContext || 'website_section',
          utmMedium: 'organic',
          utmCampaign: 'the_fm_briefing_signup',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Subscription failed. Please try again.');
        return;
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <section className={`bg-brand-carbon border-y border-brand-edge-dark py-14 text-white ${className}`}>
      <div className="container-custom max-w-4xl">
        <div className="bg-brand-graphite border border-brand-edge-dark rounded-sm p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-widest text-pink-400 font-light">
              THE FM BRIEFING · RECURRING PUBLICATION
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-extralight text-white leading-tight">
                Facilities-management intelligence without the noise.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-mist/80 leading-relaxed">
                A concise weekly editorial briefing on maintenance, statutory compliance, engineering, and building technology. No marketing fluff or promotional spam.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-brand-mist/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                  Weekly cadence
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                  Statutory &amp; engineering focus
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                  One-click unsubscribe
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              {status === 'success' ? (
                <div className="p-6 rounded bg-brand-void border border-pink-500/40 text-center">
                  <CheckCircle2 className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="text-base font-light text-white">You're Subscribed</h4>
                  <p className="text-xs text-brand-mist/70 mt-1">
                    Thank you. You will receive the next edition of The FM Briefing in your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Work email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-void border border-brand-edge-dark rounded px-3.5 py-2.5 text-sm text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="First name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-red-400">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-normal text-xs py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      'Subscribing...'
                    ) : (
                      <>
                        Get The FM Briefing <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-brand-mist/50 text-center">
                    No spam. Distinct from sales enquiries. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterInlineCard({
  title = 'Read EntireFM without checking EntireFM',
  subtitle = 'A concise weekly briefing covering the facilities management developments worth knowing about.',
  signupPage = '/fm-briefing',
}: {
  title?: string;
  subtitle?: string;
  signupPage?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          signupPage,
          utmSource: 'inline_card',
          utmMedium: 'organic',
          utmCampaign: 'fm_briefing_inline',
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-6 my-8 text-white">
      <span className="text-[10px] uppercase tracking-widest text-pink-400 font-light block mb-1">
        THE FM BRIEFING
      </span>
      <h3 className="text-lg font-light text-white">{title}</h3>
      <p className="text-xs text-brand-mist/75 mt-1 mb-4">{subtitle}</p>

      {status === 'success' ? (
        <div className="text-xs text-pink-400 font-light flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" /> Thank you for subscribing.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Work email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-pink-500 hover:bg-pink-600 text-white font-normal text-xs py-2 px-4 rounded transition-colors whitespace-nowrap"
          >
            Get the Briefing
          </button>
        </form>
      )}
    </div>
  );
}

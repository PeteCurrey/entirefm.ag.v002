'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Clock,
  Wrench,
} from 'lucide-react';
import type { TemplateProps } from '../types';

export function TemplateFmBriefing({ route, content }: TemplateProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'The FM Briefing', url: '/fm-briefing' },
  ];

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
          signupPage: '/fm-briefing',
          utmSource: 'fm_briefing_page',
          utmMedium: 'organic',
          utmCampaign: 'fm_briefing_landing',
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

  const pillars = [
    {
      num: '01',
      title: 'The Week That Matters',
      desc: 'Critical FM industry developments, statutory regulatory deadlines, and building safety rulings distilled from over 40 trade sources into essential bullet briefings.',
    },
    {
      num: '02',
      title: 'Engineering & Compliance Deep-Dive',
      desc: 'Tested engineering insight on SFG20 planned maintenance, EICR fixed wire testing, ACOP L8 water hygiene, and Fire Safety Order responsible person duties.',
    },
    {
      num: '03',
      title: 'Operational Technology & AI Reality',
      desc: 'Objective analysis of AI, CAFM software, predictive IoT sensors, and smart buildings—grounded in real UK commercial property operations.',
    },
    {
      num: '04',
      title: 'Practical Tools & Templates',
      desc: 'Direct access to free EntireFM asset registers, PPM schedule builders, tender specifications, and statutory inspection calendars.',
    },
  ];

  return (
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-hero-headquarters-2560w.webp"
              alt="The FM Briefing — Business Intelligence Publication"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.12]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Editorial Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="mb-2">
                  <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
                </div>

                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                    Weekly Intelligence Publication
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                  The FM Briefing.
                </h1>

                <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
                  A concise, practitioner-written weekly editorial digest covering commercial building maintenance, statutory compliance, engineering standards, and estate intelligence.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                    Every Tuesday Morning
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                    Zero Vendor Fluff
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                    One-Click Unsubscribe
                  </span>
                </div>
              </div>

              {/* Right Signup Box */}
              <div className="lg:col-span-5">
                <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 sm:p-10 shadow-elevated">
                  {status === 'success' ? (
                    <div className="text-center py-8 space-y-4">
                      <CheckCircle2 className="h-12 w-12 text-brand-pink mx-auto" />
                      <h3 className="text-2xl font-light text-white">Subscription Confirmed</h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        Thank you. The upcoming Tuesday edition of The FM Briefing will be delivered directly to your inbox.
                      </p>
                      <div className="pt-4">
                        <Link
                          href="/blog"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-brand-pink hover:text-white transition-colors"
                        >
                          <span>Explore Latest Published Articles</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-light text-white tracking-tight">Subscribe to the Briefing</h3>
                        <p className="text-xs text-slate-400 font-light">
                          Free weekly editorial publication. Unsubscribe at any time.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-xs uppercase tracking-wider font-medium text-slate-300">
                            Work Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@company.co.uk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-brand-edge-dark rounded-sm px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[11px] uppercase tracking-wider font-medium text-slate-400">
                              First Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sarah"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full bg-black/40 border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] uppercase tracking-wider font-medium text-slate-400">
                              Company
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. British Land"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              className="w-full bg-black/40 border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none"
                            />
                          </div>
                        </div>

                        {status === 'error' && (
                          <p className="text-xs text-rose-400 font-light">{errorMessage}</p>
                        )}

                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white text-xs uppercase tracking-widest font-medium py-3.5 px-6 rounded-sm transition-all hover:scale-[1.02] shadow-elevated flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {status === 'loading' ? (
                            'Confirming...'
                          ) : (
                            <>
                              <span>Get The FM Briefing</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>

                        <p className="text-[11px] text-slate-500 text-center leading-normal font-light">
                          Strict privacy. We never share subscriber records.
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. EDITORIAL PILLARS (VALUE PROPOSITION)                                  */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Editorial Structure
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                What You Receive in Every Issue
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
                The FM Briefing is engineered for estate directors, facilities managers, property operations heads, and building engineers who require actionable insight without marketing noise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((p, idx) => (
                <div key={idx} className="p-8 sm:p-10 rounded-sm border border-slate-200 bg-slate-50 space-y-4 shadow-sm">
                  <span className="text-2xl font-extralight text-brand-pink block">{p.num}</span>
                  <h3 className="text-2xl font-light text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SAMPLE BRIEFING PREVIEW                                                */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom max-w-4xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  Editorial Layout Preview
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                The 5-Minute Tuesday Reading Flow
              </h2>
              <p className="text-sm text-slate-300 font-light">
                Each weekly edition follows a disciplined, scannable format designed for high-velocity reading.
              </p>
            </div>

            <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 sm:p-12 shadow-elevated space-y-8">
              
              <div className="border-b border-brand-edge-dark pb-6 space-y-2">
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                  1. THIS WEEK IN FM · REGULATORY &amp; MARKET ROUNDUP
                </span>
                <h4 className="text-lg font-light text-white">Statutory deadlines, HSE directives, and commercial benchmarks</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Concise summaries of active policy updates from the Building Safety Regulator, CIBSE Technical Directives, and BESA wage agreements.
                </p>
              </div>

              <div className="border-b border-brand-edge-dark pb-6 space-y-2">
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                  2. ENGINEERING DEEP DIVE · ASSET DISCIPLINE
                </span>
                <h4 className="text-lg font-light text-white">Featured plant condition or maintenance methodology</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  In-depth breakdown of HVAC lifecycle management, vibration anomaly thresholds, or commercial fixed wire testing (EICR) scope boundaries.
                </p>
              </div>

              <div className="border-b border-brand-edge-dark pb-6 space-y-2">
                <span className="text-xs uppercase tracking-widest text-blue-400 font-medium block">
                  3. OPERATIONAL TOOL OF THE WEEK
                </span>
                <h4 className="text-lg font-light text-white">Interactive calculator, asset matrix, or tender template</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Direct access to interactive schedule builders, CSV asset registers, and statutory compliance calendars.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium block">
                  4. THE STRATEGIC TAKEAWAY
                </span>
                <h4 className="text-lg font-light text-white">Practical observation for property directors &amp; managing agents</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  A high-impact operational perspective on contract risk, SLA structure, or vendor accountability across UK commercial portfolios.
                </p>
              </div>

            </div>
          </div>
        </section>

        <ProposalSection
          headline="Looking for Professional Facilities Management for Your Estate?"
          subheadline="EntireFM delivers proactive planned maintenance, building engineering, and compliance management across the UK."
        />
      </main>

      <Footer />
    </div>
  );
}

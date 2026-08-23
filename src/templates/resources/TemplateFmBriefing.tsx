'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Clock,
  Building2,
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
      icon: Clock,
      title: 'The Week That Matters',
      desc: 'Important FM industry developments and regulatory updates distilled without having to monitor 40 different trade sources.',
    },
    {
      icon: Wrench,
      title: 'Practical Maintenance & Compliance',
      desc: 'Tested engineering insight on SFG20 planned maintenance, EICR fixed wire testing, ACOP L8 water hygiene, and fire safety duties.',
    },
    {
      icon: Zap,
      title: 'Technology Without the Hype',
      desc: 'Objective analysis of AI, CAFM systems, predictive IoT sensors, and smart buildings—grounded in real UK commercial property operations.',
    },
    {
      icon: BookOpen,
      title: 'Useful Tools & Templates',
      desc: 'Direct access to free EntireFM asset registers, PPM schedule builders, tender specifications, and statutory inspection calendars.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        <Breadcrumbs items={breadcrumbs} />

        {/* HERO SECTION */}
        <section className="on-dark relative isolate overflow-hidden bg-brand-graphite pt-20 pb-16 sm:pt-24 sm:pb-24 border-b border-brand-edge-dark">
          <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
          <div className="container-custom relative max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <span className="eyebrow eyebrow-dark">RECURRING FM PUBLICATION</span>
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  THE FM BRIEFING
                </h1>
                <p className="mt-3 text-lg font-medium text-pink-400">
                  Practical intelligence for people responsible for buildings.
                </p>
                <p className="mt-4 text-base text-brand-mist/85 leading-relaxed">
                  A concise weekly editorial publication covering maintenance, statutory compliance, building engineering, AI &amp; technology, and commercial estate operations.
                </p>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-brand-mist/70 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-pink-400" />
                    Weekly Tuesday cadence
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-pink-400" />
                    No marketing fluff
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-pink-400" />
                    One-click unsubscribe
                  </span>
                </div>
              </div>

              {/* SIGNUP BOX */}
              <div className="lg:col-span-5">
                <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-6 sm:p-8 shadow-2xl">
                  {status === 'success' ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-12 w-12 text-pink-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-white">Subscription Confirmed</h3>
                      <p className="text-sm text-brand-mist/80 mt-2 leading-relaxed">
                        Thank you for subscribing. You will receive the upcoming edition of The FM Briefing in your inbox.
                      </p>
                      <Link
                        href="/blog"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300"
                      >
                        Read latest published insights &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Get the Briefing</h3>
                      <p className="text-xs text-brand-mist/70 mb-5">
                        Free weekly delivery. Marketing subscription is distinct from operational enquiries.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-brand-mist/80 mb-1">
                            Work Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@company.co.uk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-brand-void border border-brand-edge-dark rounded px-3.5 py-2.5 text-sm text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-brand-mist/80 mb-1">
                            First Name <span className="text-brand-mist/50">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sarah"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-brand-mist/80 mb-1">
                              Company <span className="text-brand-mist/50">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Acme Real Estate"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              className="w-full bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-brand-mist/80 mb-1">
                              Role <span className="text-brand-mist/50">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Facilities Manager"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              className="w-full bg-brand-void border border-brand-edge-dark rounded px-3 py-2 text-xs text-white placeholder:text-brand-mist/40 focus:border-pink-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {status === 'error' && (
                          <p className="text-xs text-red-400 mt-2">{errorMessage}</p>
                        )}

                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {status === 'loading' ? (
                            'Subscribing...'
                          ) : (
                            <>
                              Get The FM Briefing <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <p className="text-[10px] text-brand-mist/50 text-center mt-2 leading-normal">
                          We respect your inbox. No spam. One-click unsubscribe link in every issue.
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION PILLARS */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-5xl">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">EDITORIAL VALUE</span>
              <h2 className="text-display-sm text-brand-graphite mt-2">
                What you receive in every issue
              </h2>
              <p className="text-sm text-brand-slate mt-2 leading-relaxed">
                The FM Briefing is engineered for estate directors, facilities managers, property operations heads, and building engineers who need actionable signal, not vendor noise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-6 rounded border border-brand-edge bg-brand-foam/30 flex gap-4 items-start">
                    <div className="p-2.5 rounded bg-brand-carbon text-pink-400 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-brand-graphite">{p.title}</h3>
                      <p className="text-xs text-brand-slate mt-1.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SAMPLE BRIEFING PREVIEW */}
        <section className="py-16 bg-brand-foam border-t border-brand-edge">
          <div className="container-custom max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="eyebrow">EDITORIAL SAMPLE</span>
              <h2 className="text-display-sm text-brand-graphite mt-2">
                The Briefing Structure
              </h2>
              <p className="text-xs text-brand-slate mt-1">
                Each weekly edition follows a structured, easy-to-scan 5-minute reading format.
              </p>
            </div>

            <div className="bg-white border border-brand-edge rounded p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-brand-edge pb-4">
                <span className="text-[10px] uppercase font-bold text-pink-500 font-mono">1. THIS WEEK IN FM</span>
                <h4 className="text-sm font-bold text-brand-graphite mt-1">Key regulatory dates &amp; market changes</h4>
                <p className="text-xs text-brand-slate mt-1">Concise summary of statutory updates from HSE, CIBSE, and BESA.</p>
              </div>

              <div className="border-b border-brand-edge pb-4">
                <span className="text-[10px] uppercase font-bold text-pink-500 font-mono">2. TECHNICAL DEEP DIVE</span>
                <h4 className="text-sm font-bold text-brand-graphite mt-1">Featured engineering or PPM analysis</h4>
                <p className="text-xs text-brand-slate mt-1">In-depth breakdown of asset lifecycle, predictive monitoring, or EICR compliance.</p>
              </div>

              <div className="border-b border-brand-edge pb-4">
                <span className="text-[10px] uppercase font-bold text-blue-500 font-mono">3. PRACTICAL FM TOOL</span>
                <h4 className="text-sm font-bold text-brand-graphite mt-1">Rotating calculator, matrix, or checklist</h4>
                <p className="text-xs text-brand-slate mt-1">Direct link to interactive schedule builders and downloadable document templates.</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-500 font-mono">4. ONE THING TO THINK ABOUT</span>
                <h4 className="text-sm font-bold text-brand-graphite mt-1">Short editorial takeaway for estate teams</h4>
                <p className="text-xs text-brand-slate mt-1">A provocative, practical observation on commercial FM contracts and risk management.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

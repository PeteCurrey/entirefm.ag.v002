'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { TrustBar } from '@/components/trust/TrustBar';

export function TemplateRealTimeOperations() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Real-Time Operations', url: '/client-portal/real-time-operations' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      <Header />

      <main id="main" className="flex-grow pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Header */}
          <section className="mb-16 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-50 border border-blue-200 text-xs font-light text-blue-800">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              REAL-TIME OPERATIONS // LIVE DISPATCH &amp; SLA CONTROL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              Know what is happening{' '}
              <span className="block font-light text-slate-700 mt-1">
                before the monthly report arrives.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              EntireCAFM provides continuous operational visibility: tracking reactive work orders from triage to field completion, monitoring SLA burn rates, and logging engineer presence across every facility.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/contact-us?subject=Real-Time%20Operations%20Demo"
                className="btn-primary"
              >
                Book Operations Walkthrough <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-portal"
                className="btn-ghost-dark"
              >
                &larr; Back to Portal Overview
              </Link>
            </div>
          </section>

          <TrustBar />

          {/* Primary Operations Visual */}
          <section className="my-16">
            <ProductFrame
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM Real-Time Operations Control Center"
              caption="Live Operations Stream: Today's Operations Timeline, Action Required Queue, and Estate Pulse Telemetry."
              badge="LIVE FIELD DISPATCH"
              badgeType="live"
              aspectRatio="16/10"
            />
          </section>

          {/* Operational Workflow Lifecycle */}
          <section className="my-20 bg-[#FAF9FB] border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow eyebrow-light">CONTINUOUS FIELD DISPATCH</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                How Live Work Orders Flow Through EntireCAFM
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light mt-2 leading-relaxed">
                Every ticket moves through five audited operational states with time-stamped evidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              {[
                { step: '01', title: 'Defect Logging', desc: 'Direct client portal submission or automated IoT sensor trigger. Instant ticket number and severity classification.' },
                { step: '02', title: 'Helpdesk Triage', desc: '24/7 technical desk evaluates safety hazard, verifies access permits, and dispatches closest qualified engineer.' },
                { step: '03', title: 'GPS Check-In', desc: 'Attending technician checks in on site via mobile, confirms dynamic RAMS, and commences diagnostics.' },
                { step: '04', title: 'Digital Proof', desc: 'Before/after photos, calibrated instrument readings, and tenant sign-off recorded on site.' },
                { step: '05', title: 'Milestone Closure', desc: 'Closed work order deposited into the asset history ledger with automated invoice matching.' },
              ].map((st) => (
                <div key={st.step} className="p-5 bg-white border border-slate-200 rounded-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extralight text-brand-pink block mb-1">STAGE {st.step}</span>
                    <h4 className="text-sm font-normal text-slate-900">{st.title}</h4>
                    <p className="text-xs text-slate-600 font-light leading-relaxed mt-1">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Direct Enquiry Proposal Form */}
          <ProposalSection
            defaultService="Real-Time Operations Demonstration"
            headline="Experience Real-Time Field Dispatch"
            subheadline="See how EntireCAFM transforms work order triage, SLA governance, and engineer attendance tracking across your commercial estate."
          />

          {/* Newsletter Section */}
          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

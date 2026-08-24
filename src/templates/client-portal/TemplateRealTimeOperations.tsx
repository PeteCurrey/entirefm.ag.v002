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

export function TemplateRealTimeOperations() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
    { name: 'Real-Time Operations', url: '/client-portal/real-time-operations' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#101010] antialiased selection:bg-[#EA580C] selection:text-white">
      <Header solid />

      <main className="pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Header */}
          <section className="mb-14 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#2563EB]">
                <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
                REAL-TIME OPERATIONS
              </span>
              <span className="font-mono text-[11.5px] text-[#686866]">
                Live Dispatch &amp; SLA Control
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#101010] leading-[1.15]">
              Know what is happening{' '}
              <span className="font-semibold block mt-1">
                before the monthly report arrives.
              </span>
            </h1>

            <p className="text-[16px] text-[#4B5563] mt-5 leading-relaxed">
              EntireCAFM provides continuous operational visibility: tracking reactive work orders from triage to field completion, monitoring SLA burn rates, and logging engineer presence across every facility.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <Link
                href="/contact-us?subject=Real-Time%20Operations%20Demo"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-6 py-3 text-[13.5px] font-semibold text-white shadow hover:bg-[#D44708] transition-all"
              >
                Book Operations Walkthrough
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client-portal"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#E4E4E1] bg-white px-5 py-3 text-[13.5px] font-medium text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                ← Back to Portal Overview
              </Link>
            </div>
          </section>

          {/* Primary Operations Visual */}
          <section className="mb-16">
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
          <section className="mb-20">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
                THE DISPATCH CYCLE
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                How operational data moves through EntireCAFM
              </h2>
              <p className="text-[14px] text-[#686866] mt-2 leading-relaxed">
                From initial incident detection to digital proof of completion, every stage is visible to authorised clients in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Issue Detected & Logged',
                  desc: 'Logged by building occupants, helpdesk triage, or automated telemetry threshold trigger.',
                  badge: 'P1 / P2 / P3 Triage',
                },
                {
                  step: '02',
                  title: 'Engineer Dispatched',
                  desc: 'Matched to trade certifications (F-Gas, Gas Safe, NICEIC) and dispatched with estimated ETA.',
                  badge: 'GPS Check-In',
                },
                {
                  step: '03',
                  title: 'SLA Countdown Tracked',
                  desc: 'Resolution window actively monitored with automated alerts prior to any SLA threshold breach.',
                  badge: 'Live SLA Radar',
                },
                {
                  step: '04',
                  title: 'Evidence Captured',
                  desc: 'Time-stamped photos, parts used, and digital sign-off permanently appended to the asset record.',
                  badge: 'Audit Sign-Off',
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-[10px] border border-[#E4E4E1] bg-white p-5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#EA580C] block mb-1">
                      STAGE {s.step}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#101010] mb-2">
                      {s.title}
                    </h3>
                    <p className="text-[12.5px] text-[#4B5563] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F0F0EE] mt-4">
                    <span className="inline-block rounded-[4px] bg-[#F5F5F3] px-2 py-0.5 font-mono text-[10px] text-[#686866]">
                      {s.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Facility Drawer Inspection */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C]">
                    FACILITY TELEMETRY DRAWER
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                    Instant site inspection without losing portfolio context.
                  </h2>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">
                    Clicking any facility in the workspace opens a dedicated slide-over panel displaying active incidents, engineer names, access protocols, and upcoming planned maintenance.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      'Live Engineer Attendance: Track mobile engineers checked into plantrooms with active work permits.',
                      'Target Resolution Windows: Minute-by-minute countdowns on critical reactive tickets.',
                      'Access & Security Protocols: 24/7 keyholder contacts, contractor ID rules, and coordinates.',
                    ].map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[13px] text-[#374151]">
                        <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <ProductFrame
                    src="/images/client-portal/entirecafm-site-drawer.png"
                    alt="EntireCAFM Site Telemetry Drawer"
                    caption="Site Drawer: Victoria House Commercial Complex active telemetry and engineer attendance."
                    badge="SITE TELEMETRY"
                    badgeType="telemetry"
                    aspectRatio="16/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Proposal / Demo CTA */}
          <ProposalSection
            defaultService="Real-Time CAFM Operations"
            headline="Experience Real-Time Facilities Management"
            subheadline="See how EntireCAFM gives your organisation instant operational transparency across every commercial site."
          />

          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

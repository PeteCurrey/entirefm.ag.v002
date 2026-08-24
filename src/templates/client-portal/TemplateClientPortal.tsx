'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Activity,
  Clock,
  Building2,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import { InteractivePortalTour } from '@/components/client-portal/InteractivePortalTour';
import { InformationHierarchySequence } from '@/components/client-portal/InformationHierarchySequence';
import { MonthlyReportComparison } from '@/components/client-portal/MonthlyReportComparison';
import { ClientPersonasTabs } from '@/components/client-portal/ClientPersonasTabs';
import { TenderProcurementChallenge } from '@/components/client-portal/TenderProcurementChallenge';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';

export function TemplateClientPortal() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Portal', url: '/client-portal' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#101010] antialiased selection:bg-[#EA580C] selection:text-white">
      {/* Universal Site Header */}
      <Header solid />

      <main className="pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="max-w-4xl mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#C2410C]">
                  <span className="h-2 w-2 rounded-full bg-[#EA580C] animate-pulse" />
                  ENTIRECAFM CLIENT PORTAL
                </span>
                <span className="font-mono text-[11.5px] text-[#686866]">
                  Live Operating Platform
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#101010] leading-[1.1]">
                See your estate.{' '}
                <span className="font-semibold block mt-1">
                  Not another monthly spreadsheet.
                </span>
              </h1>

              <p className="text-[16px] sm:text-[17px] text-[#4B5563] mt-5 leading-relaxed max-w-3xl">
                EntireCAFM gives authorised clients live operational visibility across sites, assets, work orders, statutory compliance, engineers, planned maintenance, and commercial performance — from a single operating environment.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-3.5 mt-7">
                <Link
                  href="/contact-us?subject=Book%20a%20Live%20Portal%20Demo"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-6 py-3.5 text-[13.5px] font-semibold text-white shadow-lg hover:bg-[#D44708] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Book a Live Portal Demo
                </Link>
                <a
                  href="#interactive-tour"
                  className="inline-flex items-center gap-2 rounded-[8px] border border-[#E4E4E1] bg-white px-5 py-3.5 text-[13.5px] font-medium text-[#101010] hover:bg-[#F5F5F3] transition-colors shadow-sm"
                >
                  Explore EntireCAFM Features
                  <ArrowRight className="h-4 w-4 text-[#9B9B97]" />
                </a>
              </div>

              {/* Supporting Microcopy */}
              <div className="flex items-center gap-6 mt-4 font-mono text-[11.5px] text-[#686866]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                  No slide decks
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                  No fake mockups
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                  Live production platform
                </span>
              </div>
            </div>

            {/* Immediate High-Res Dashboard Screenshot Presentation */}
            <ProductFrame
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM Live Client Operating Platform Dashboard"
              caption="Live Estate Overview: 42 managed UK facilities, 3,846 in-service assets, 96.2% SLA performance, 98.4% statutory compliance, and active Today's Operations timeline."
              badge="LIVE DASHBOARD"
              badgeType="live"
              priority
              aspectRatio="16/10"
            />
          </section>

          {/* ── 2. REAL PROOF METRICS EXCERPTS ────────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-6 shadow-sm">
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#9B9B97] mb-4 text-center">
                LIVE PRODUCTION TELEMETRY SURFACED TO AUTHORISED CLIENTS
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F0F0EE]">
                {[
                  { label: 'SLA Performance', value: '96.2%', sub: 'Target 95.0% · On Track', colour: '#059669' },
                  { label: 'Statutory Compliance', value: '98.4%', sub: 'Zero breaches · Audit ready', colour: '#059669' },
                  { label: 'Active In-Service Assets', value: '3,846', sub: '100% telemetry coverage', colour: '#101010' },
                  { label: 'Open Work Orders', value: '127', sub: 'Active field dispatch', colour: '#2563EB' },
                  { label: 'Committed Works WIP', value: '£185k', sub: 'Commercial control', colour: '#EA580C' },
                  { label: 'Connected Sensor Nodes', value: '48', sub: 'Live IoT telemetry', colour: '#101010' },
                ].map((item, idx) => (
                  <div key={item.label} className={`pt-3 sm:pt-0 ${idx > 0 ? 'sm:pl-4' : ''}`}>
                    <span className="font-mono text-[10px] uppercase text-[#9B9B97] block">
                      {item.label}
                    </span>
                    <span
                      className="text-2xl sm:text-3xl font-semibold block mt-1 tracking-tight"
                      style={{ color: item.colour }}
                    >
                      {item.value}
                    </span>
                    <span className="text-[11px] font-mono text-[#686866] block mt-0.5">
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. MONTHLY REPORT COMPARISON ──────────────────────────── */}
          <section className="mb-20">
            <MonthlyReportComparison />
          </section>

          {/* ── 4. INTERACTIVE PRODUCT TOUR ────────────────────────────── */}
          <section id="interactive-tour" className="mb-20 scroll-mt-24">
            <InteractivePortalTour />
          </section>

          {/* ── 5. INFORMATION HIERARCHY SEQUENCE ─────────────────────── */}
          <section className="mb-20">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
                END-TO-END VISIBILITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                Portfolio → Site → Space → Asset → Action
              </h2>
              <p className="text-[14.5px] text-[#686866] mt-2 leading-relaxed">
                Move effortlessly between high-level executive summaries and the physical plantroom asset without switching systems or losing operational context.
              </p>
            </div>

            <InformationHierarchySequence />
          </section>

          {/* ── 6. SITE 360 PREVIEW SECTION ───────────────────────────── */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#059669]">
                    SITE 360 SPATIAL INTERFACE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                    Your building becomes a live operating environment.
                  </h2>
                  <p className="text-[13.5px] text-[#4B5563] leading-relaxed">
                    Site 360 unifies photographic reality, floor plans/CAD, 3D asset hierarchies, live sensor feeds, and contractor access profiles into an intuitive spatial control canvas.
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      '11 Integrated Building Modules: Spaces, Assets, PPM, Vault, O&M, Ledger, and Audit.',
                      'Physical Asset Overlays: Click plantroom items to review maintenance history and warranties.',
                      'Real-Time Live Sensor Telemetry: Temperature, vibration, power draw, and flow rate feeds.',
                    ].map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[12.5px] text-[#374151]">
                        <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/client-portal/site-360"
                      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#101010] px-4 py-2.5 text-[12.5px] font-medium text-white hover:bg-[#252525] transition-colors"
                    >
                      Explore Site 360 In Detail
                      <ChevronRight className="h-3.5 w-3.5 text-[#EA580C]" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <ProductFrame
                    src="/images/client-portal/entirecafm-site-360-workspace.png"
                    alt="EntireCAFM Site 360 Physical Asset Canvas"
                    caption="Site 360: Victoria House Commercial Complex with live sensor nodes and active P1 critical pump overlay."
                    badge="SITE 360 ACTIVE"
                    badgeType="telemetry"
                    aspectRatio="16/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── 7. SUPPORTING SPECIALIST MODULES ──────────────────────── */}
          <section className="mb-20">
            <div className="max-w-2xl mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
                SPECIALIST CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                Explore the platform by operational domain.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Real-Time Operations */}
              <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#D1D1CD] hover:shadow-md transition-all">
                <div>
                  <div className="h-10 w-10 rounded-[8px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#101010]">
                    Real-Time Operations
                  </h3>
                  <p className="text-[13px] text-[#686866] mt-2 leading-relaxed">
                    Live dispatch feeds, engineer GPS check-ins, reactive triage queues, and automatic SLA risk escalations across every facility.
                  </p>
                </div>
                <div className="pt-6 border-t border-[#F0F0EE] mt-6">
                  <Link
                    href="/client-portal/real-time-operations"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#EA580C] hover:underline"
                  >
                    View Operations Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Compliance & Reporting */}
              <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#D1D1CD] hover:shadow-md transition-all">
                <div>
                  <div className="h-10 w-10 rounded-[8px] bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-4">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#101010]">
                    Compliance &amp; Reporting
                  </h3>
                  <p className="text-[13px] text-[#686866] mt-2 leading-relaxed">
                    SFG20 statutory schedules, digital Compliance Vault, verified gas &amp; electrical certificates, and point-in-time audit readiness.
                  </p>
                </div>
                <div className="pt-6 border-t border-[#F0F0EE] mt-6">
                  <Link
                    href="/client-portal/compliance-reporting"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#EA580C] hover:underline"
                  >
                    View Compliance Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Site 360 Digital Picture */}
              <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#D1D1CD] hover:shadow-md transition-all">
                <div>
                  <div className="h-10 w-10 rounded-[8px] bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mb-4">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#101010]">
                    Site 360 Workspace
                  </h3>
                  <p className="text-[13px] text-[#686866] mt-2 leading-relaxed">
                    Interactive physical building canvas combining high-resolution site photography, CAD drawings, asset trees, and live telemetry nodes.
                  </p>
                </div>
                <div className="pt-6 border-t border-[#F0F0EE] mt-6">
                  <Link
                    href="/client-portal/site-360"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#EA580C] hover:underline"
                  >
                    Explore Site 360 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── 8. CLIENT PERSONAS SECTION ────────────────────────────── */}
          <section className="mb-20">
            <ClientPersonasTabs />
          </section>

          {/* ── 9. TRANSPARENCY & DATA OWNERSHIP ──────────────────────── */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C]">
                    OPEN DATA &amp; TRANSPARENCY
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                    We don&apos;t believe FM data should belong to your FM provider.
                  </h2>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">
                    Our role is to operate and preserve your estate — not obscure it behind vendor lock-in. EntireCAFM is designed to give authorised client teams complete visibility and continuous export access to every asset record, certificate, and commercial transaction.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: 'Zero Data Lock-In', desc: 'Full API & CSV exports of all asset, PPM, and compliance history anytime.' },
                      { title: 'Canonical Proof', desc: 'Time-stamped engineer site photos and digital sign-offs stored immutably.' },
                      { title: 'Transparent Commercials', desc: 'Every invoice backed by digital timesheets and materials verification.' },
                      { title: 'Full Audit Rights', desc: 'Direct regulatory and insurer inspection access to digital vaults.' },
                    ].map((f) => (
                      <div key={f.title} className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-3">
                        <strong className="text-[12.5px] font-semibold text-[#101010] block">
                          {f.title}
                        </strong>
                        <span className="text-[11.5px] text-[#686866] block mt-0.5">
                          {f.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-[12px] border border-[#E4E4E1] bg-[#FBFBFA] p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#101010] text-white flex items-center justify-center shrink-0">
                      <Lock className="h-4 w-4 text-[#EA580C]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#101010]">
                        Enterprise Security &amp; Compliance
                      </h4>
                      <p className="text-[11.5px] text-[#686866]">
                        UK Data Sovereignty &amp; ISO 27001 Aligned Controls
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-[12px] text-[#4B5563]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                      Role-based granular access control (RBAC)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                      Multi-factor authentication (MFA) on all accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                      End-to-end encrypted evidence capture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                      Continuous automated database backups
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── 10. ENTIRE INTELLIGENCE / AI PRINCIPLES ───────────────── */}
          <section className="mb-20">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-3xl mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
                  OPERATIONAL REASONING
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
                  AI should interrogate your FM data — not invent it.
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-2 leading-relaxed">
                  Entire Intelligence serves as an analytical co-pilot operating strictly above verified, canonical FM records. It identifies recurring faults, correlates plant telemetry anomalies, and surfaces capacity gaps without executing autonomous changes without human oversight.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Pattern Anomaly Detection',
                    detail: 'Flags repeated water ingress tickets across adjacent zones and correlates roof gulley maintenance history automatically.',
                  },
                  {
                    title: 'SFG20 Dynamic Leveling',
                    detail: 'Recommends preventative maintenance frequency adjustments based on asset age, duty cycle, and British Standard updates.',
                  },
                  {
                    title: 'Strict Provenance Ledger',
                    detail: 'Every observation is logged to the AI Governance Ledger with direct links to the underlying work orders and sensor logs.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-4">
                    <Sparkles className="h-4 w-4 text-[#EA580C] mb-2" />
                    <h4 className="text-[13px] font-semibold text-[#101010]">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#686866] mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 11. TENDER & PROCUREMENT CHALLENGE ────────────────────── */}
          <section className="mb-20">
            <TenderProcurementChallenge />
          </section>

          {/* ── 12. BOTTOM CONVERSION CTA ─────────────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-8 sm:p-12 text-center shadow-lg">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1 font-mono text-[11px] font-bold text-[#C2410C] mb-3">
                LIVE DEMONSTRATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#101010] tracking-tight">
                Don&apos;t take our word for it. We&apos;ll show you the platform.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#4B5563] mt-3 max-w-2xl mx-auto leading-relaxed">
                If you are reviewing FM providers or preparing an upcoming tender, give us 30 minutes and we will walk you through the actual operating environment behind our service.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link
                  href="/contact-us?subject=Book%20an%20EntireCAFM%20Demonstration"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-7 py-4 text-[14px] font-semibold text-white shadow-xl hover:bg-[#D44708] transition-all"
                >
                  Book an EntireCAFM Demonstration
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/mechanical-electrical"
                  className="inline-flex items-center gap-2 rounded-[8px] border border-[#E4E4E1] bg-white px-6 py-4 text-[14px] font-medium text-[#101010] hover:bg-[#F5F5F3] transition-colors"
                >
                  Explore Hard FM Engineering
                </Link>
              </div>
            </div>
          </section>

          {/* Direct Enquiry Proposal Form */}
          <ProposalSection
            defaultService="Client Portal & CAFM Operations"
            headline="Request an EntireCAFM Platform Demonstration"
            subheadline="Connect with our technical operations team to explore how EntireCAFM transforms visibility across your commercial property portfolio."
          />

          {/* Newsletter Section */}
          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      {/* Universal Site Footer */}
      <Footer />
    </div>
  );
}

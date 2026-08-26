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
  Wrench,
  Scale,
  Eye,
  Server
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientPortalHero } from '@/components/client-portal/ClientPortalHero';
import { OperationalTelemetryStrip } from '@/components/client-portal/OperationalTelemetryStrip';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import { MonthlyReportComparison } from '@/components/client-portal/MonthlyReportComparison';
import { InformationHierarchySequence } from '@/components/client-portal/InformationHierarchySequence';
import { PhysicalToDigitalBridge } from '@/components/client-portal/PhysicalToDigitalBridge';
import { CinematicControlSection } from '@/components/client-portal/CinematicControlSection';
import { InteractivePortalTour } from '@/components/client-portal/InteractivePortalTour';
import { ClientPersonasTabs } from '@/components/client-portal/ClientPersonasTabs';
import { TenderProcurementChallenge } from '@/components/client-portal/TenderProcurementChallenge';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { TrustBar } from '@/components/trust/TrustBar';

export function TemplateClientPortal() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Client Operating Platform', url: '/client-portal' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      {/* Universal Site Header */}
      <Header />

      <main id="main" className="flex-grow">
        {/* ── 1. CINEMATIC FULL-SCREEN HERO (90-100svh) ─────────────── */}
        <ClientPortalHero breadcrumbs={breadcrumbs} />

        <TrustBar />

        {/* ── 2. BLOOMBERG-STYLE LIVE OPERATIONAL TELEMETRY STRIP ─────── */}
        <OperationalTelemetryStrip />

        {/* ── 3. TOP PLATFORM PROOF & EVIDENCE SHOWCASE ───────────────── */}
        <section id="live-operating-picture" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">OPERATIONAL COMMAND</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Your estate. One live operating picture.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                EntireCAFM provides continuous operational visibility across national property portfolios. Authorised clients inspect live asset telemetry, reactive SLA triage queues, engineer attendance, and statutory compliance status in real time.
              </p>
            </div>

            {/* Large Crisp Platform Screenshot Inset */}
            <ProductFrame
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM Live Client Operating Platform Dashboard showing 42 managed facilities, 3846 assets, and real-time SLA metrics"
              caption="Live Estate Overview: 42 managed UK commercial facilities, 3,846 in-service assets, 96.2% SLA performance, 98.4% statutory compliance, and active Today's Operations timeline."
              badge="LIVE DASHBOARD"
              badgeType="live"
              priority
              aspectRatio="16/10"
            />
          </div>
        </section>

        {/* ── 4. THE DIFFERENCE BETWEEN REPORTING AND SEEING ──────────── */}
        <MonthlyReportComparison />

        {/* ── 5. CINEMATIC FM PHOTOGRAPHY MOMENT 1 (CRITICAL PLANT) ─────── */}
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-35">
            <Image
              src="/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp"
              alt="Commercial plantroom heating pumps and distribution infrastructure under EntireFM planned maintenance"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent -z-10" />

          <div className="container-wide">
            <div className="max-w-2xl space-y-6">
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                BUILT FROM THE PLANTROOM UP
              </span>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-white leading-tight">
                &ldquo;EntireCAFM was engineered on the plantroom floor, not in a software startup. Every data point reflects a physical asset, a attending engineer, and a verified statutory standard.&rdquo;
              </blockquote>
              <div className="pt-2 text-xs text-slate-400 font-light border-l border-brand-pink pl-3">
                EntireFM Engineering &bull; 100% British Commercial Infrastructure Delivery
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. THE PHYSICAL HIERARCHY (ESTATE TO ASSET) ─────────────── */}
        <InformationHierarchySequence />

        {/* ── 7. CONNECTING TECHNOLOGY TO REAL PEOPLE ─────────────────── */}
        <PhysicalToDigitalBridge />

        {/* ── 8. CINEMATIC DARK CLIENT CONTROL SECTION ────────────────── */}
        <CinematicControlSection />

        {/* ── 9. INTERACTIVE PRODUCT TOUR ─────────────────────────────── */}
        <InteractivePortalTour />

        {/* ── 10. SITE 360 SPATIAL INTERFACE PREVIEW ──────────────────── */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="eyebrow eyebrow-light">SITE 360 SPATIAL WORKSPACE</span>
                  <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                    Your building becomes a live operating canvas.
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  Site 360 unifies high-resolution spatial photography, CAD floorplans, 3D asset trees, live IoT vibration sensor nodes, and contractor access profiles into an intuitive spatial control environment.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    '11 Integrated Building Modules: Spaces, Assets, PPM, Vault, O&M, Ledger, and Audit.',
                    'Physical Asset Overlays: Click plantroom items to review maintenance history and warranties.',
                    'Real-Time Live Sensor Telemetry: Temperature, vibration, power draw, and flow rate feeds.',
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="/client-portal/site-360"
                    className="btn-primary text-xs py-3 px-6"
                  >
                    Explore Site 360 in Detail <ArrowRight className="h-3.5 w-3.5" />
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

        {/* ── 11. SPECIALIST DOMAIN MODULES ──────────────────────────── */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-light">SPECIALIST CAPABILITIES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Explore the Platform by Operational Domain
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Dedicated operational consoles designed for specific facilities management workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Real-Time Operations */}
              <div className="rounded-sm border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all space-y-6">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <Activity className="h-5 w-5 text-brand-pink" />
                  </div>
                  <h3 className="text-xl font-light text-slate-900">
                    Real-Time Operations
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Live dispatch feeds, engineer GPS check-ins, reactive triage queues, and automatic SLA risk escalations across every facility.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <Link
                    href="/client-portal/real-time-operations"
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-900 hover:text-brand-pink transition-colors"
                  >
                    View Operations Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Compliance & Reporting */}
              <div className="rounded-sm border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all space-y-6">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-light text-slate-900">
                    Compliance &amp; Reporting
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    SFG20 statutory schedules, digital Compliance Vault, verified gas &amp; electrical certificates, and point-in-time audit readiness.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <Link
                    href="/client-portal/compliance-reporting"
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-900 hover:text-brand-pink transition-colors"
                  >
                    View Compliance Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Site 360 Workspace */}
              <div className="rounded-sm border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all space-y-6">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-brand-pink" />
                  </div>
                  <h3 className="text-xl font-light text-slate-900">
                    Site 360 Workspace
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Interactive physical building canvas combining high-resolution site photography, CAD drawings, asset trees, and live telemetry nodes.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <Link
                    href="/client-portal/site-360"
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-900 hover:text-brand-pink transition-colors"
                  >
                    Explore Site 360 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. ROLE-BASED GOVERNANCE (PERSONAS) ────────────────────── */}
        <ClientPersonasTabs />

        {/* ── 13. DATA SOVEREIGNTY & SECURITY ─────────────────────────── */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 sm:p-10 lg:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="eyebrow eyebrow-light">DATA SOVEREIGNTY &amp; TRANSPARENCY</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-slate-900 tracking-tight">
                    We don&apos;t believe FM data should belong to your FM provider.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    Our role is to operate and preserve your estate — not obscure it behind vendor lock-in. EntireCAFM gives authorised client teams complete visibility and continuous export access to every asset record, certificate, and commercial transaction.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: 'Zero Data Lock-In', desc: 'Full API & CSV exports of all asset, PPM, and compliance history anytime.' },
                      { title: 'Canonical Proof', desc: 'Time-stamped engineer site photos and digital sign-offs stored immutably.' },
                      { title: 'Transparent Commercials', desc: 'Every invoice backed by digital timesheets and materials verification.' },
                      { title: 'Full Audit Rights', desc: 'Direct regulatory and insurer inspection access to digital vaults.' },
                    ].map((f) => (
                      <div key={f.title} className="rounded-sm border border-slate-200 bg-white p-3.5 space-y-0.5">
                        <strong className="text-xs font-normal text-slate-900 block">
                          {f.title}
                        </strong>
                        <span className="text-[11.5px] text-slate-500 font-light block leading-snug">
                          {f.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-sm border border-slate-200 bg-white p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-sm bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Lock className="h-5 w-5 text-brand-pink" />
                    </div>
                    <div>
                      <h4 className="text-sm font-normal text-slate-900">
                        Enterprise Security &amp; Compliance
                      </h4>
                      <p className="text-[11.5px] text-slate-500 font-light">
                        UK Data Sovereignty &bull; ISO 27001 Aligned Controls
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 font-light">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Role-based granular access control (RBAC)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Multi-factor authentication (MFA) on all accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      End-to-end encrypted evidence capture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Continuous automated UK cloud database backups
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 14. TENDER & PROCUREMENT CHALLENGE ────────────────────── */}
        <TenderProcurementChallenge />

        {/* ── 15. CINEMATIC CLOSING CONVERSION SECTION ───────────────── */}
        <section className="relative py-28 bg-brand-carbon text-white border-t border-brand-edge-dark overflow-hidden text-center">
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image
              src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
              alt="EntireFM directors conducting commercial roof survey overlooking city skyline"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/80 to-brand-carbon/60 -z-10" />

          <div className="container-custom max-w-4xl space-y-6 relative z-10">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              LIVE PLATFORM DEMONSTRATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              See what your estate looks like when nothing is hidden.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              We can demonstrate EntireCAFM using a representative multi-site commercial estate and show exactly how EntireFM clients manage maintenance, compliance, engineers, assets, and commercial performance.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
                className="btn-primary"
              >
                Book a Live Demonstration <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mechanical-electrical"
                className="btn-ghost-light"
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
      </main>

      {/* Universal Site Footer */}
      <Footer />
    </div>
  );
}

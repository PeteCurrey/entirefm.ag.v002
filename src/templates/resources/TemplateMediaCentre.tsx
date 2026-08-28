import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Newspaper,
  Mail,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateMediaCentreProps {
  route?: RouteRecord;
  content?: ContentRecord;
}

export function TemplateMediaCentre({ route, content }: TemplateMediaCentreProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Media Centre', url: '/resources/media-centre' },
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
              alt="EntireFM Media and Press Centre"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Media &amp; Press Centre
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Press Enquiries &amp; <br />
                <span className="font-light text-hero-pink">
                  Media Resources.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Official corporate facts, approved media contact pathways, brand assets, and practical facilities management commentary for journalists, editors, and industry analysts.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Direct Technical Director Access
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  2-Hour Press Deadline Response SLA
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Verified UK Built Environment Data
                </span>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. MEDIA CONTACT & CORPORATE FACTS                                        */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Direct Press Enquiries */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-brand-pink/10 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-slate-900">Editorial &amp; Press Enquiries</h3>
                    <span className="text-xs text-slate-500 font-light">Mon–Fri: 08:30 – 17:30 GMT</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-light leading-relaxed">
                  For journalist enquiries, interview requests with EntireFM technical leadership, or citations from our research reports:
                </p>
                <div className="p-4 bg-white border border-slate-200 rounded-sm text-sm text-brand-pink font-medium">
                  media@entirefm.com
                </div>
                <div className="text-xs text-slate-500 font-light">
                  Response SLA: Within 2 hours for active deadline requests during UK business hours.
                </div>
              </div>

              {/* Factual Company Overview */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-slate-900">Verified Corporate Overview</h3>
                    <span className="text-xs text-slate-500 font-light">Fact Sheet for Media</span>
                  </div>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-3 divide-y divide-slate-200 font-light">
                  <li className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Operating Entity</span>
                    <strong className="text-slate-900 text-right">EntireFM (trading name of Alkota Group Limited)</strong>
                  </li>
                  <li className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Core Capabilities</span>
                    <span className="text-right text-slate-700">Hard FM, Soft FM, Total FM &amp; M&amp;E Engineering</span>
                  </li>
                  <li className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Geographic Scope</span>
                    <span className="text-slate-900">UK Nationwide (Commercial &amp; Industrial)</span>
                  </li>
                  <li className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Proprietary Tech</span>
                    <span className="text-right text-slate-700">EntireCAFM &amp; Building Performance Telemetry</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. APPROVED LINKABLE RESEARCH & EVERGREEN ASSETS                          */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            <div className="border-b border-white/10 pb-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                  Authoritative Publications
                </span>
                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  Featured Research &amp; Press Citations
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-light">Verified Citation Sources</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/resources/ai-in-facilities-management"
                className="group bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 hover:border-brand-pink transition-all flex flex-col justify-between space-y-6 shadow-elevated"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase px-2.5 py-1 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30 font-medium tracking-wider">
                    Research Pillar
                  </span>
                  <h4 className="text-xl font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                    AI in Facilities Management
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    Objective analysis of practical AI applications vs high-risk unverified automation in commercial building operations.
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-edge-dark text-xs text-brand-pink font-medium flex items-center justify-between">
                  <span>View Resource</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/tools/ppm-schedule-builder"
                className="group bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 hover:border-brand-pink transition-all flex flex-col justify-between space-y-6 shadow-elevated"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase px-2.5 py-1 rounded-sm bg-blue-950/60 text-blue-400 border border-blue-800/40 font-medium tracking-wider">
                    Interactive Tool
                  </span>
                  <h4 className="text-xl font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                    PPM Schedule Builder
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    Free asset-led maintenance planning tool referencing UK statutory testing cycles and SFG20 standards.
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-edge-dark text-xs text-brand-pink font-medium flex items-center justify-between">
                  <span>Launch Tool</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/resources/guides/ppm-guide"
                className="group bg-brand-carbon border border-brand-edge-dark rounded-sm p-8 hover:border-brand-pink transition-all flex flex-col justify-between space-y-6 shadow-elevated"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase px-2.5 py-1 rounded-sm bg-purple-950/60 text-purple-400 border border-purple-800/40 font-medium tracking-wider">
                    Evergreen Guide
                  </span>
                  <h4 className="text-xl font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                    Complete Guide to PPM
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    Authoritative reference guide for commercial planned preventative maintenance strategy and compliance.
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-edge-dark text-xs text-brand-pink font-medium flex items-center justify-between">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSignupSection />
        <ProposalSection />
      </main>

      <Footer />
    </div>
  );
}

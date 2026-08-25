import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Newspaper,
  Mail,
  Phone,
  FileText,
  Download,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
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
  return (
    <div className="bg-[#0B0E14] text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-[#0B0E14] to-[#0B0E14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-light">
              ENTIREFM MEDIA &amp; PRESS CENTRE
            </span>
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-white mt-3 mb-4">
              Press Enquiries &amp; Media Resources
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Official company facts, media contact pathways, approved brand assets, and practical facilities management commentary for journalists, editors, and industry researchers.
            </p>
          </div>
        </div>
      </section>

      {/* Media Contact & Fast Enquiries */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct Press Enquiries */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-light text-white">Editorial &amp; Press Enquiries</h3>
                <span className="text-xs text-zinc-500 font-mono">Mon–Fri: 08:30 – 17:30 GMT</span>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              For journalist enquiries, interview requests with EntireFM technical directors, or data citations from our research reports:
            </p>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-sm text-emerald-400">
              media@entirefm.com
            </div>
            <div className="text-xs text-zinc-500">
              Response SLA: Within 2 hours for active deadline requests during UK business hours.
            </div>
          </div>

          {/* Factual Company Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-light text-white">Verified Company Facts</h3>
                <span className="text-xs text-zinc-500 font-mono">Fact Sheet for Media</span>
              </div>
            </div>
            <ul className="text-xs text-zinc-300 space-y-3 divide-y divide-zinc-800">
              <li className="pt-2 flex justify-between">
                <span className="text-zinc-500 font-mono">Entity</span>
                <strong className="text-white text-right">EntireFM (trading name of Alkota Group Limited)</strong>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-zinc-500 font-mono">Services</span>
                <span className="text-right text-zinc-200">Hard FM, Soft FM, Total FM &amp; M&amp;E</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-zinc-500 font-mono">Coverage</span>
                <span className="text-white">UK Nationwide (Commercial &amp; Industrial)</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-zinc-500 font-mono">Technology</span>
                <span className="text-right text-zinc-200">EntireCAFM &amp; Building Performance Telemetry</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Approved Linkable Research & Evergreen Assets */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-light text-white">Featured Research &amp; Linkable Assets</h3>
            <p className="text-xs text-zinc-400 mt-1">Grounded resources available for press reference and editorial citation.</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Verified Citation Sources</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/resources/ai-in-facilities-management"
            className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-light">
                RESEARCH PILLAR
              </span>
              <h4 className="text-base font-light text-white group-hover:text-emerald-400 transition-colors">
                AI in Facilities Management
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Objective analysis of practical AI applications vs high-risk unverified automation in building operations.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-[11px] font-mono text-emerald-400 font-light flex items-center justify-between">
              <span>View Resource</span>
              <span>&rarr;</span>
            </div>
          </Link>

          <Link
            href="/tools/ppm-schedule-builder"
            className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40 font-light">
                INTERACTIVE TOOL
              </span>
              <h4 className="text-base font-light text-white group-hover:text-emerald-400 transition-colors">
                PPM Schedule Builder
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Free asset-led maintenance planning tool referencing UK statutory testing cycles and SFG20 standards.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-[11px] font-mono text-emerald-400 font-light flex items-center justify-between">
              <span>Launch Tool</span>
              <span>&rarr;</span>
            </div>
          </Link>

          <Link
            href="/resources/guides/ppm-guide"
            className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40 font-light">
                EVERGREEN GUIDE
              </span>
              <h4 className="text-base font-light text-white group-hover:text-emerald-400 transition-colors">
                Complete Guide to PPM
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Authoritative reference guide for commercial planned preventative maintenance strategy and compliance.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-[11px] font-mono text-emerald-400 font-light flex items-center justify-between">
              <span>Read Guide</span>
              <span>&rarr;</span>
            </div>
          </Link>
        </div>
      </section>

      <TrustBar />
      <ProposalSection />
      <NewsletterSignupSection />
      <Footer />
    </div>
  );
}

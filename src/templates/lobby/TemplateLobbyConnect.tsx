'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Radio,
  Sparkles,
  HelpCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Search,
  ExternalLink,
  PlusCircle,
  Lock,
  Layers,
  Award,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

export function TemplateLobbyConnect() {
  const [activeChannel, setActiveChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const channels = [
    { id: 'all', label: 'All Conversations' },
    { id: 'hard-fm', label: 'Hard FM & Plant Engineering' },
    { id: 'compliance', label: 'Building Safety & BSA' },
    { id: 'mobilisation', label: 'Mobilisation & Contracts' },
    { id: 'sustainability', label: 'Decarbonisation & ESG' },
  ];

  const roundtables = [
    {
      id: 'rt-01',
      title: 'How much asset data do you insist on before mobilisation sign-off?',
      channel: 'Mobilisation & Contracts',
      author: 'Estates Director, 400,000 sq ft Commercial Portfolio',
      replies: 18,
      verifiedContributors: 'CIBSE & RICS Members',
      keyTakeaway:
        'Consensus: Do not sign off mobilisation without complete Form 6 EICR schedules and physical verification of all cold-water storage tank capacities.',
      href: '/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
    },
    {
      id: 'rt-02',
      title: 'AHU belts failing early: Alignment, tension, or sheave wear?',
      channel: 'Hard FM & Plant Engineering',
      author: 'Senior Building Services Engineer',
      replies: 24,
      verifiedContributors: 'Senior HVAC Technicians',
      keyTakeaway:
        'Laser alignment revealed 1.8° angular sheave misalignment caused by un-shimmed motor mounts, inducing lateral belt cord fatigue.',
      href: '/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear',
    },
    {
      id: 'rt-03',
      title: 'Mandatory Digital Occurrence Reporting: Duty-Holder Records & CAFM logs',
      channel: 'Building Safety & BSA',
      author: 'Head of Facilities Compliance',
      replies: 31,
      verifiedContributors: 'Accountable Persons (APs)',
      keyTakeaway:
        'Establishing a 48-hour automated escalation trigger within CAFM for any safety-critical fire door or damper failure notification.',
      href: '/lobby/community/discussion/mandatory-digital-occurrence-reporting-duty-holder-records',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="connect" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">CONNECT</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                06 · PEER NETWORK &amp; ROUNDTABLES
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Learn from the Profession.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                Structured, moderated professional interaction for senior FM leaders and engineers. A signal-rich environment focused on practical answers, field forensics, and real operational dilemmas — completely free from social media vanity metrics.
              </p>
            </div>

            {/* Signal-to-Noise Principle Strip */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-neutral-900 font-medium">Zero Vanity Metrics (No Likes, Follows, or Algorithm Feeds)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span>Verified Facilities Directors &amp; M&amp;E Practitioners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Confidential 1:1 Direct Inquiries Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. ASK THE LOBBY RESEARCH DESK (LEAD INTERACTION) ───────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-electric bg-brand-electric/10 px-2.5 py-0.5 rounded-[2px]">
                GROUNDED RESEARCH DESK
              </span>
              <span className="text-xs text-neutral-400 font-light">· Sourced Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight leading-snug">
              Have an Operational or Statutory Dilemma? Ask The Lobby.
            </h2>

            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              Submit your specific estate challenge. EntireFM&apos;s research desk interrogates primary UK legislation, British Standards, and operational field data to produce cited, defensible technical positions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/lobby/ask"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-electric" />
                <span>Query Research Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs text-neutral-500 font-light">
                Average cited report returned in seconds
              </span>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/80 rounded-[4px] p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">
              Recent Practitioner Inquiries
            </span>
            <ul className="space-y-2.5 text-xs text-neutral-700 font-light">
              <li className="flex items-start gap-2">
                <span className="text-brand-electric font-bold">Q:</span>
                <span>Can an incoming facilities provider refuse handover without verified O&amp;M manuals?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-electric font-bold">Q:</span>
                <span>What is the legal boundary between landlord and tenant on emergency lighting discharge tests?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-electric font-bold">Q:</span>
                <span>Are closed-loop chilled water systems subject to statutory ACOP L8 biocide sampling?</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── 04. ROUNDTABLES & TECHNICAL DISCUSSIONS ───────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                PEER DISCUSSIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Practitioner Roundtables &amp; Technical Threads
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/lobby/community/new"
                className="px-4 py-2 bg-brand-electric hover:bg-blue-600 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-1.5 shadow-2xs font-light"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Start a Technical Discussion</span>
              </Link>
              <Link
                href="/lobby/community"
                className="text-xs font-light text-neutral-700 hover:text-neutral-900 hover:underline"
              >
                View All &rarr;
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {roundtables.map((rt) => (
              <article
                key={rt.id}
                className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-7 shadow-2xs space-y-3 transition-colors group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-[10px] font-mono uppercase text-neutral-700">
                      {rt.channel}
                    </span>
                    <span className="text-neutral-400 font-light">Started by {rt.author}</span>
                  </div>
                  <span className="font-mono text-neutral-500 text-xs">
                    {rt.replies} Technical Contributions
                  </span>
                </div>

                <h3 className="text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                  <Link href={rt.href}>{rt.title}</Link>
                </h3>

                <div className="bg-neutral-50 p-3 rounded-[2px] border-l-2 border-emerald-500 text-xs text-neutral-700 font-light">
                  <strong className="text-neutral-900 font-medium">Consensus Finding:</strong> {rt.keyTakeaway}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-light text-neutral-500 border-t border-neutral-100">
                  <span>Verified participants: {rt.verifiedContributors}</span>
                  <Link href={rt.href} className="text-brand-electric hover:underline inline-flex items-center gap-1 font-medium">
                    <span>Participate in roundtable</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 05. REAL-TIME LIVE ENGINEERING ROOMS & MESSAGING ─────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Live Rooms */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Real-Time Voice &amp; Chat Desks</span>
              </div>
              <h3 className="text-xl font-light text-neutral-900 leading-snug">
                Live Engineering Rooms
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                Connect directly with on-shift FM managers, shift engineers, and estates directors tackling live plant failures, chiller trips, or emergency isolations.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/lobby/rooms"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
              >
                <span>Enter Live Engineering Rooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Confidential Direct Messages */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-neutral-500 font-medium">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Confidential 1:1 Communications</span>
              </div>
              <h3 className="text-xl font-light text-neutral-900 leading-snug">
                Direct Inquiries &amp; Member Network
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                Reach out confidentially to verified peers, consultant building surveyors, or EntireFM engineering directors to discuss commercial terms or complex defects.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/lobby/messages"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
              >
                <span>Open Secure Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </section>

        {/* ── 06. CROSS-LINKING NAVIGATION ─────────────────────────────── */}
        <section className="pt-6 border-t border-neutral-200/90">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
            Navigate The Lobby Knowledge Graph
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link href="/lobby/know" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">01 · INTELLIGENCE</span>
              <span className="text-neutral-900 font-medium">KNOW &rarr;</span>
            </Link>
            <Link href="/lobby/check" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">02 · OBLIGATIONS</span>
              <span className="text-neutral-900 font-medium">CHECK &rarr;</span>
            </Link>
            <Link href="/lobby/do" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">03 · TOOLBOX</span>
              <span className="text-neutral-900 font-medium">DO &rarr;</span>
            </Link>
            <Link href="/lobby/find" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">04 · DIRECTORY</span>
              <span className="text-neutral-900 font-medium">FIND &rarr;</span>
            </Link>
            <Link href="/lobby/learn" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors col-span-2 sm:col-span-1">
              <span className="text-neutral-400 text-[10px] block">05 · CPD &amp; BRIEFS</span>
              <span className="text-neutral-900 font-medium">LEARN &rarr;</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

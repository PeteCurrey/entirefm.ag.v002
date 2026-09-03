import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Radio, MessageSquare, ShieldCheck, Search, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbyMasthead } from '@/components/lobby/LobbyMasthead';
import { LeadBriefing } from '@/components/lobby/LeadBriefing';
import { ComplianceWatch } from '@/components/lobby/ComplianceWatch';
import { BriefingStrip } from '@/components/lobby/BriefingStrip';
import { IndustryMoves } from '@/components/lobby/IndustryMoves';
import { EngineersNote } from '@/components/lobby/EngineersNote';
import { UsefulThing } from '@/components/lobby/UsefulThing';
import { FromTheField } from '@/components/lobby/FromTheField';
import { AskEntireFM } from '@/components/lobby/AskEntireFM';
import { OnTheHorizon } from '@/components/lobby/OnTheHorizon';
import { LobbyToolkit } from '@/components/lobby/LobbyToolkit';
import { LobbyQuestion } from '@/components/lobby/LobbyQuestion';
import { LobbyPulse } from '@/components/lobby/LobbyPulse';
import { WorthAttending } from '@/components/lobby/WorthAttending';
import { LobbyNewsletter } from '@/components/lobby/LobbyNewsletter';
import { LobbyCoreDestinations } from '@/components/lobby/LobbyCoreDestinations';
import { getLobbyHomepageData } from '@/lib/lobby/repository';

export async function TemplateLobby() {
  const data = await getLobbyHomepageData();

  const leadBriefingProps = {
    franchise: data.leadStory.franchise === 'week-that-matters' ? 'THE WEEK THAT MATTERS' : 'LEAD BRIEFING',
    title: data.leadStory.title,
    standfirst: data.leadStory.standfirst,
    publishedAt: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(data.leadStory.publishedAt)
    ),
    readingTime: `${data.leadStory.readingTimeMinutes} min intelligence brief`,
    author: {
      name: data.leadStory.author.name,
      role: data.leadStory.author.role,
    },
    keyTakeaways: data.leadStory.weekThatMattersData?.keyPoints || [
      'Digital occurrence reporting requires contemporaneous logging within 48 hours.',
      'Subcontractor competency matrices must link to verified external accreditations.',
      'Golden Thread asset records must be stored in open, machine-readable formats.',
    ],
    fullBriefingUrl: `/lobby/${data.leadStory.slug}`,
    tags: data.leadStory.topics,
    imageUrl: '/images/editorial/building-safety-facade-inspection.jpg',
    imageAlt: 'Building Safety Golden Thread and commercial building envelope compliance inspection',
  };

  const complianceWatchProps = {
    id: data.complianceWatch.id,
    statute: data.complianceWatch.complianceData?.statute || 'Building Safety Act 2022',
    regulationTitle: data.complianceWatch.title,
    urgency: data.complianceWatch.complianceData?.urgency || 'HIGH',
    effectiveDate: data.complianceWatch.complianceData?.effectiveDate || 'Enforced Q4 2026',
    whatChanged: data.complianceWatch.complianceData?.whatChanged || data.complianceWatch.standfirst,
    whoItAffects:
      data.complianceWatch.complianceData?.whoItAffects ||
      'Commercial landlords, estates directors, corporate facilities heads, and responsible persons.',
    whatYouNeedToDo:
      data.complianceWatch.complianceData?.whatYouNeedToDo ||
      'Audit your current CAFM asset change-log and verify contractor accreditations.',
    whenItMatters:
      data.complianceWatch.complianceData?.whenItMatters ||
      'Immediate action required for active PPM cycles and planned Q4 works.',
    governingBody: data.complianceWatch.complianceData?.governingBody || 'Building Safety Regulator (HSE)',
    sourceDocUrl: `/lobby/${data.complianceWatch.slug}`,
    imageUrl: '/images/editorial/commercial-switchgear-compliance.jpg',
    imageAlt: 'Mandatory digital occurrence reporting and electrical switchroom verification',
  };

  const engineersNoteProps = {
    id: data.engineersNote.id,
    title: data.engineersNote.title,
    discipline: data.engineersNote.engineersNoteData?.discipline || 'Mechanical & Climate Engineering',
    subtitle: data.engineersNote.standfirst,
    leadParagraph:
      data.engineersNote.bodyBlocks[0]?.content || data.engineersNote.standfirst,
    technicalObservation:
      data.engineersNote.engineersNoteData?.technicalObservation ||
      'Micro-recirculation of hot discharge air caused premature high-pressure trips.',
    fieldRule:
      data.engineersNote.engineersNoteData?.fieldRule ||
      'RULE OF THUMB: Minimum discharge clearance on upward-blowing condensers is 2.5× fan diameter.',
    author: {
      name: data.engineersNote.author.name,
      title: data.engineersNote.author.role,
      credentials: data.engineersNote.author.credentials || 'CEng MCIBSE, Senior Building Services Engineer',
    },
    diagramNote: data.engineersNote.engineersNoteData?.diagramNote,
    imageUrl: '/images/editorial/rooftop-condenser-plant-deck.jpg',
    imageAlt: 'Commercial rooftop condenser plant deck with acoustic louvres and chillers',
  };

  const usefulThingProps = {
    id: data.usefulThing.id,
    title: data.usefulThing.title,
    category: 'Operational Toolkit',
    format: data.usefulThing.usefulThingData?.assetFormat || 'Spreadsheet (.xlsx)',
    description: data.usefulThing.standfirst,
    whyItMatters:
      data.usefulThing.usefulThingData?.whyItMatters ||
      'Prevents inheriting uncertified compliance gaps or unrecorded plant defects from an outgoing supplier.',
    actionUrl: `/lobby/${data.usefulThing.slug}`,
    actionLabel: 'View & Download Handover Matrix',
    isExistingResource: true,
    imageUrl: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
    imageAlt: 'Commercial estate mobilisation and incoming handover checklist',
  };

  const fromTheFieldProps = {
    id: data.fromTheField.id,
    imageKey: 'hvac-rooftop-condensers',
    imageSrc: '/images/editorial/rooftop-condenser-plant-deck.jpg',
    imageAlt: 'Commercial rooftop HVAC condenser bank inspection and anti-vibration mount defect',
    locationContext:
      data.fromTheField.fromTheFieldData?.locationDescription || '210,000 sq ft Commercial Headquarters, West Midlands',
    environmentType:
      data.fromTheField.fromTheFieldData?.environmentType || 'Rooftop Plant Deck & Chilled Water Infrastructure',
    challengeTitle:
      data.fromTheField.fromTheFieldData?.challengeTitle || 'Can you spot the critical defect in this condenser bank installation?',
    observation:
      data.fromTheField.fromTheFieldData?.observation || data.fromTheField.standfirst,
    lessonLearned:
      data.fromTheField.fromTheFieldData?.problem || 'Anti-vibration spring isolators fully compressed metal-to-metal.',
    remedialAction:
      data.fromTheField.fromTheFieldData?.technicalExplanation || 'Recalculated static deflection and installed tuned pads.',
  };

  const askEntireFMProps = {
    id: data.askEntireFM.id,
    question:
      data.askEntireFM.askEntireFMData?.question ||
      'We are taking over a 140,000 sq ft multi-let office building. What specific compliance documentation must we demand?',
    askerContext: data.askEntireFM.askEntireFMData?.askedBy || 'Head of Property Operations',
    estateProfile: data.askEntireFM.askEntireFMData?.estateProfile || 'Grade-A Multi-Let Commercial Office, London EC2',
    keyAnswerPoints: data.askEntireFM.askEntireFMData?.keyAnswerPoints || [
      'Demand full Form 6 / EICR distribution board schedules and C1/C2 closeout sheets.',
      'Require written ACOP L8 Legionella risk assessment and 24 months continuous logs.',
      'Inspect physical F-Gas logbooks mapped to serial numbers.',
      'Verify 3-hour emergency lighting discharge test certificates.',
    ],
    fullAnswerSummary: data.askEntireFM.askEntireFMData?.fullAnswer || data.askEntireFM.standfirst,
    responder: {
      name: data.askEntireFM.author.name,
      role: data.askEntireFM.author.role,
    },
    imageUrl: '/images/lobby/ask-entirefm-boardroom-advisory.jpg',
    imageAlt: 'EntireFM commercial estates and compliance advisory consultation overlooking city skyline',
  };

  const worthAttendingProps = {
    id: data.worthAttending.id,
    title: data.worthAttending.title,
    organizer: data.worthAttending.worthAttendingData?.organiser || 'UK Facilities & Estates Executive Forum',
    eventType: data.worthAttending.worthAttendingData?.eventType || 'Webinar',
    date: data.worthAttending.worthAttendingData?.eventDate || 'Wednesday, 16 September 2026 · 10:00 - 11:30 BST',
    location: data.worthAttending.worthAttendingData?.location || 'Live Interactive Broadcast (CPD Certified)',
    editorialReason:
      data.worthAttending.worthAttendingData?.whyItMatters ||
      'Essential for estates managers planning the replacement of legacy gas calorifiers with high-temperature commercial heat pumps.',
    registrationUrl: `/lobby/${data.worthAttending.slug}`,
    imageUrl: '/images/editorial/entirefm-manchester-castlefield-night-1280w.webp',
    imageAlt: 'CIBSE Commercial Heat Pump & Decarbonisation Symposium venue',
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist">
      <main id="main" className="relative">
        {/* 01. Hero (Approved Benchmark Hero — Untouched) */}
        <div className="sticky top-0 z-0 h-screen min-h-[640px] lg:min-h-[720px] w-full overflow-hidden">
          <LobbyMasthead />
        </div>

        {/* 02+ Scrolling Editorial Body with Composed Light/Dark Rhythm */}
        <div className="relative z-10 bg-[#FAF9F7] text-neutral-900 shadow-[0_-24px_50px_rgba(0,0,0,0.6)]">
          
          {/* Transition Strip: Editorial Edition Header */}
          <div className="border-b border-neutral-200/80 bg-white py-3.5 px-4 sm:px-8">
            <div className="container-wide flex flex-wrap items-center justify-between gap-4 text-xs font-normal text-neutral-500">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-900 font-medium">EDITION 2026.35</span>
                <span>·</span>
                <span>STATUTORY COMPLIANCE &amp; HARD FM INTELLIGENCE</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-500">
                <Link href="/lobby/ask" className="hover:text-neutral-900 transition-colors flex items-center gap-1 font-semibold text-brand-electric">
                  Ask The Lobby &rarr;
                </Link>
                <span>·</span>
                <Link href="/lobby/today" className="hover:text-neutral-900 transition-colors">
                  What Changed Today
                </Link>
                <span>·</span>
                <Link href="/lobby/opportunities" className="hover:text-neutral-900 transition-colors">
                  Procurement &amp; Awards
                </Link>
              </div>
            </div>
          </div>

          {/* Ask The Lobby Quick Search Bar */}
          <div className="border-b border-neutral-200/80 bg-[#FAF9F7] py-5 px-4 sm:px-8">
            <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-brand-electric font-semibold bg-brand-electric/10 px-2.5 py-1 rounded-sm">
                  ASK THE LOBBY
                </span>
                <span className="text-xs text-neutral-600 font-light hidden sm:inline">
                  Grounded FM research desk: query building safety, statutory compliance, tenders, and standards.
                </span>
              </div>
              <Link
                href="/lobby/ask"
                className="w-full md:w-auto inline-flex items-center justify-between gap-6 bg-white border border-neutral-300 hover:border-neutral-900 px-4 py-2.5 rounded-sm text-xs font-light text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
              >
                <span>Ask a real FM question with sourced citations...</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* 02. The Week That Matters & Compliance Watch (Light Editorial Canvas) */}
          <section id="week-that-matters" className="py-14 sm:py-20 lg:py-24 bg-[#FAF9F7]">
            <div className="container-wide">
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-stretch">
                
                {/* Left Column: Lead Cover Story */}
                <div className="flex flex-col justify-between">
                  <LeadBriefing data={leadBriefingProps} />
                </div>

                {/* Right Column: Compliance Watch (Authoritative Signal) */}
                <div id="compliance-watch" className="flex flex-col scroll-mt-20">
                  <ComplianceWatch data={complianceWatchProps} />
                </div>

              </div>
            </div>
          </section>

          {/* 03. Briefing Wire & Latest News Stream Wire (White Neutral Canvas) */}
          <BriefingStrip items={data.briefingStrip} />

          {/* 03b. The Six Core Lobby Destinations (Know / Check / Do / Find / Learn / Connect) */}
          <LobbyCoreDestinations />

          {/* 04. In The Lobby: Active Discussions & Live Rooms (Soft Light Canvas) */}
          <section id="community-roundtable" className="py-16 sm:py-22 bg-[#F9F8F6] border-b border-neutral-200/80 scroll-mt-20">
            <div className="container-wide">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-electric">
                      COMMUNITY ROUNDTABLE
                    </span>
                    <span className="text-xs text-neutral-400 font-light">· Practitioner peer network</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900">
                    Active Discussions &amp; Live Technical Rooms
                  </h2>
                </div>

                <div className="flex items-center gap-5 text-xs font-semibold">
                  <Link href="/lobby/community" className="text-brand-electric hover:underline">
                    Browse All Discussions &rarr;
                  </Link>
                  <Link href="/lobby/rooms" className="text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Enter Live Rooms
                  </Link>
                </div>
              </div>

              {/* Asymmetric Community Composition: 65% Featured Conversation + 35% Live Room */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-stretch">
                
                {/* 65% FEATURED CONVERSATION WITH REAL MEMBER PRESENCE */}
                <div className="bg-white border border-neutral-200/80 rounded-sm p-7 sm:p-9 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href="/lobby/members"
                        className="flex items-center gap-3 group/author"
                        aria-label="View Peter Currey profile in Lobby Member Directory"
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-medium group-hover/author:bg-brand-electric transition-colors">
                          PC
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 group-hover/author:text-brand-electric transition-colors">Peter Currey</p>
                          <p className="text-[11px] text-neutral-500 font-light">CEO · EntireFM</p>
                        </div>
                      </Link>
                      <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Accepted Solution
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug hover:text-brand-electric transition-colors">
                      <Link href="/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off">
                        How much asset data do you insist on before mobilisation sign-off?
                      </Link>
                    </h3>

                    <p className="text-sm font-light text-neutral-600 leading-relaxed">
                      Managing outgoing contractor handover discrepancies with commercial data grading frameworks. When inheriting an unverified CAFM register, we require a 14-day sample condition audit prior to operational sign-off.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>Mobilisation &amp; Handover · 8 verified replies</span>
                    <Link
                      href="/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off"
                      className="text-brand-electric font-medium hover:underline flex items-center gap-1"
                    >
                      <span>Read Thread &rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* 35% SECONDARY DISCUSSION + LIVE ROOM HIGHLIGHT */}
                <div className="flex flex-col justify-between gap-5">
                  
                  {/* Secondary Discussion Link */}
                  <div className="bg-white border border-neutral-200/80 rounded-sm p-6 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-normal text-neutral-400">
                      <span className="uppercase tracking-wider text-brand-electric">M&amp;E Engineering</span>
                      <span className="text-emerald-600">✓ Solved</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-light text-neutral-900 leading-snug hover:text-brand-electric transition-colors">
                      <Link href="/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear">
                        AHU drive belts failing within 90 days — alignment, tension or sheave wear?
                      </Link>
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      Acoustic frequency tensioning (Hz) vs thumb deflection rule on high-power 75kW fan drives.
                    </p>
                  </div>

                  {/* Live Room Visual Highlight */}
                  <Link
                    href="/lobby/rooms/building-safety"
                    className="relative overflow-hidden rounded-sm p-6 bg-[#080C14] text-white flex flex-col justify-between group min-h-[180px] border border-white/10"
                  >
                    <div className="flex items-center justify-between text-[10px] font-normal z-10">
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        LIVE TECHNICAL ROOM
                      </span>
                      <span className="text-white/60">Open for Members</span>
                    </div>

                    <div className="space-y-1 z-10 my-3">
                      <h4 className="text-base sm:text-lg font-light text-white group-hover:text-rose-300 transition-colors leading-snug">
                        Building Safety &amp; Golden Thread Room
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-1">
                        Active discussion on Accountable Person statutory occurrence logging.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs z-10">
                      <span className="text-white/40 font-normal">Realtime audio &amp; text</span>
                      <span className="text-rose-400 font-semibold group-hover:underline flex items-center gap-1">
                        <span>Join Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>

                </div>

              </div>

            </div>
          </section>

          {/* 05. Industry Moves & Contracts (Refined Market Activity Strip) */}
          <IndustryMoves />

          {/* 06. The Engineer's Note (Deep Cinematic Dark Moment) */}
          <section id="engineers-note" className="py-16 sm:py-24 bg-[#090C12] text-white scroll-mt-20">
            <div className="container-wide">
              <EngineersNote data={engineersNoteProps} />
            </div>
          </section>

          {/* 07. One Useful Thing (Crisp Light Neutral Canvas) */}
          <section id="useful-thing" className="py-16 sm:py-24 bg-[#FAF9F7] text-neutral-900 scroll-mt-20">
            <div className="container-wide">
              <UsefulThing data={usefulThingProps} />
            </div>
          </section>

          {/* 08. From The Field (Deep Dark Photographic Plate) */}
          <section id="from-the-field" className="py-16 sm:py-24 bg-[#080C14] text-white scroll-mt-20 border-y border-white/5">
            <div className="container-wide">
              <FromTheField data={fromTheFieldProps} />
            </div>
          </section>

          {/* 09. Ask EntireFM (Approved Design Benchmark — Clean Light Spread) */}
          <section id="ask-entirefm" className="py-16 sm:py-24 bg-white text-neutral-900 scroll-mt-20 border-b border-neutral-200/80">
            <div className="container-wide">
              <AskEntireFM data={askEntireFMProps} />
            </div>
          </section>

          {/* 10. On The Horizon (Events, Award Deadlines & Compliance Milestones) */}
          <OnTheHorizon />

          {/* 11. FM Toolkit (Light Neutral Architectural Canvas) */}
          <section id="toolkit" className="py-16 sm:py-24 bg-[#F8F8F6] text-neutral-900 scroll-mt-20">
            <div className="container-wide">
              <LobbyToolkit items={data.toolkit} />
            </div>
          </section>

          {/* 12. The Lobby Question & The Pulse (Asymmetric Composition: 40% Scenario Dark / 60% Light Data) */}
          <section className="py-16 sm:py-24 bg-[#F4F4F2] text-neutral-900 border-y border-neutral-200/80">
            <div className="container-wide">
              
              <div className="mb-10 pb-6 border-b border-neutral-300/80 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                    INDUSTRY PARTICIPATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
                    Scenario Challenge &amp; Practitioner Consensus
                  </h2>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-12 items-stretch">
                
                {/* 40% THE LOBBY QUESTION (Dark Scenario Photographic Card) */}
                <div className="flex flex-col shadow-subtle">
                  <LobbyQuestion data={data.lobbyQuestion} />
                </div>

                {/* 60% THE PULSE (High-End Light Data Composition) */}
                <div className="flex flex-col shadow-subtle">
                  <LobbyPulse data={data.lobbyPulse} />
                </div>

              </div>

            </div>
          </section>

          {/* 13. Worth Attending (Light Curated Events Spread) */}
          <section id="worth-attending" className="py-16 sm:py-24 bg-white text-neutral-900 scroll-mt-20 border-b border-neutral-200/80">
            <div className="container-wide">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
                <div>
                  <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                    INDUSTRY CALENDAR · CPD CERTIFIED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
                    Worth Attending
                  </h2>
                </div>
                <Link href="/lobby/events" className="text-xs font-semibold text-brand-electric hover:underline uppercase tracking-wider">
                  Full Event Directory &rarr;
                </Link>
              </div>
              <WorthAttending data={worthAttendingProps} />
            </div>
          </section>

          {/* 14. Archive Gateway Strip */}
          <section className="py-12 bg-[#F6F5F2] border-b border-neutral-200 text-neutral-900">
            <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-neutral-900 text-white text-xs font-normal">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Looking for past briefings, news, or specific regulations?</p>
                  <p className="text-xs text-neutral-500 font-light">Search the complete Lobby editorial archive, news desk, and statutory guides.</p>
                </div>
              </div>

              <Link
                href="/lobby/search"
                className="px-6 py-3 rounded-sm bg-neutral-900 hover:bg-brand-electric text-white text-xs font-normal tracking-wider uppercase transition-colors flex items-center gap-2 shrink-0"
              >
                <span>Search Intelligence Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 15. Join The Lobby (Architectural Membership Presentation) */}
          <LobbyNewsletter />

          {/* 16. Global Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

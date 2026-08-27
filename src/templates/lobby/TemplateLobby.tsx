import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Radio, MessageSquare, ShieldCheck, Search, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbyMasthead } from '@/components/lobby/LobbyMasthead';
import { LeadBriefing } from '@/components/lobby/LeadBriefing';
import { ComplianceWatch } from '@/components/lobby/ComplianceWatch';
import { BriefingStrip } from '@/components/lobby/BriefingStrip';
import { EngineersNote } from '@/components/lobby/EngineersNote';
import { UsefulThing } from '@/components/lobby/UsefulThing';
import { FromTheField } from '@/components/lobby/FromTheField';
import { AskEntireFM } from '@/components/lobby/AskEntireFM';
import { LobbyToolkit } from '@/components/lobby/LobbyToolkit';
import { LobbyQuestion } from '@/components/lobby/LobbyQuestion';
import { LobbyPulse } from '@/components/lobby/LobbyPulse';
import { WorthAttending } from '@/components/lobby/WorthAttending';
import { LobbyNewsletter } from '@/components/lobby/LobbyNewsletter';
import { getLobbyHomepageData } from '@/lib/lobby/repository';

export function TemplateLobby() {
  const data = getLobbyHomepageData();

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
  };

  const fromTheFieldProps = {
    id: data.fromTheField.id,
    imageKey: 'hvac-rooftop-condensers',
    imageSrc: data.fromTheField.heroImage || '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    imageAlt: data.fromTheField.heroImageAlt || 'Commercial rooftop HVAC condenser bank inspection',
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
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist">
      <main id="main" className="relative">
        {/* 01. Hero (Pinned Hero Untouched) */}
        <div className="sticky top-0 z-0 h-screen min-h-[640px] lg:min-h-[720px] w-full overflow-hidden">
          <LobbyMasthead />
        </div>

        {/* 02+ Scrolling Editorial Body (Scrolls over Pinned Hero) */}
        <div className="relative z-10 bg-[#06090e] shadow-[0_-24px_50px_rgba(0,0,0,0.6)]">
          {/* Transition Strip: Dark Hero to Editorial Body */}
          <div className="border-y border-white/10 bg-black/60 backdrop-blur-md py-3 px-4 sm:px-8">
            <div className="container-wide flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-white/60">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium">EDITION 2026.35</span>
                <span>·</span>
                <span>STATUTORY COMPLIANCE &amp; HARD FM INTELLIGENCE</span>
              </div>
              <div className="flex items-center gap-4 text-white/50">
                <Link href="/lobby/search" className="hover:text-white transition-colors flex items-center gap-1">
                  <Search className="w-3 h-3 text-brand-electric" />
                  Search Intelligence
                </Link>
                <span>·</span>
                <Link href="/lobby/compliance" className="hover:text-white transition-colors">
                  Compliance Watch &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* 02. The Week That Matters & Compliance Watch (Asymmetric Editorial Split) */}
          <section id="week-that-matters" className="py-12 sm:py-16 lg:py-20 scroll-mt-20">
            <div className="container-wide">
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-stretch">
                {/* Left Column: Lead Story + Duty-Holder Verification Checkpoints Card Below */}
                <div className="flex flex-col gap-5 justify-between">
                  <LeadBriefing data={leadBriefingProps} />

                  {/* Secondary Card below The Week That Matters */}
                  <div className="rounded-sm bg-white/[0.03] border border-white/10 p-6 sm:p-7 flex flex-col justify-between gap-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-electric animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric font-semibold">
                          STATUTORY VERIFICATION CHECKPOINTS · BSA 2022
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">3 Duty-Holder Actions</span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      {leadBriefingProps.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="space-y-1.5 border-l-2 border-white/10 pl-3">
                          <span className="text-[10px] font-mono text-white/40 block">
                            CHECKPOINT 0{idx + 1}
                          </span>
                          <p className="text-xs sm:text-[13px] font-light text-white/80 leading-relaxed">
                            {takeaway}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] font-mono">
                      <div className="flex flex-wrap gap-2">
                        {leadBriefingProps.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-sm bg-white/5 text-white/60 border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={leadBriefingProps.fullBriefingUrl}
                        className="text-brand-electric hover:text-white transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span>Download Evidence Framework &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column: Compliance Watch */}
                <div id="compliance-watch" className="flex flex-col scroll-mt-20">
                  <ComplianceWatch data={complianceWatchProps} />
                </div>
              </div>
            </div>
          </section>

          {/* 03. Briefing Wire / Editorial News Stream */}
          <BriefingStrip items={data.briefingStrip} />

          {/* 04. In The Lobby: Live Community Roundtable & Active Rooms */}
          <section id="community-roundtable" className="py-16 sm:py-20 bg-[#080c14] border-y border-white/5 scroll-mt-20">
            <div className="container-wide">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest bg-brand-electric/15 text-brand-electric border border-brand-electric/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-electric animate-ping" />
                      LIVE COMMUNITY ROUNDTABLE
                    </span>
                    <span className="text-xs text-white/40 font-light">Where UK practitioners compare notes</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-white">
                    Active Discussions &amp; Live Rooms
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <Link href="/lobby/community" className="text-brand-electric hover:underline">
                    All Discussions (13 Categories) &rarr;
                  </Link>
                  <Link href="/lobby/rooms" className="text-rose-400 hover:underline flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Enter Live Rooms (6 Open)
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off"
                  className="bg-white/[0.02] border border-white/10 hover:border-brand-electric/50 rounded-sm p-6 flex flex-col justify-between space-y-4 transition-all duration-300 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-brand-electric uppercase">Mobilisation</span>
                      <span className="text-emerald-400 font-medium">✓ Solved</span>
                    </div>
                    <h3 className="text-base font-light text-white group-hover:text-brand-electric transition-colors leading-snug">
                      How much asset data do you insist on before mobilisation sign-off?
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      Managing outgoing contractor handover discrepancies with commercial data grading frameworks.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                    <span>3 replies · 8 helpful</span>
                    <span className="text-brand-electric font-medium">Read thread &rarr;</span>
                  </div>
                </Link>

                <Link
                  href="/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear"
                  className="bg-white/[0.02] border border-white/10 hover:border-brand-electric/50 rounded-sm p-6 flex flex-col justify-between space-y-4 transition-all duration-300 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-brand-electric uppercase">Engineering &amp; M&amp;E</span>
                      <span className="text-emerald-400 font-medium">✓ Solved</span>
                    </div>
                    <h3 className="text-base font-light text-white group-hover:text-brand-electric transition-colors leading-snug">
                      AHU drive belts failing within 90 days — alignment, tension or sheave wear?
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      Acoustic frequency tensioning (Hz) vs thumb deflection rule on high-power 75kW fan drives.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                    <span>4 replies · 12 helpful</span>
                    <span className="text-brand-electric font-medium">Read thread &rarr;</span>
                  </div>
                </Link>

                <Link
                  href="/lobby/rooms/building-safety"
                  className="bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 rounded-sm p-6 flex flex-col justify-between space-y-4 transition-all duration-300 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        LIVE ROOM ACTIVE
                      </span>
                      <span className="text-white/40">22 in room</span>
                    </div>
                    <h3 className="text-base font-light text-white group-hover:text-rose-400 transition-colors leading-snug">
                      Building Safety &amp; Golden Thread Room
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      Live discussion on Accountable Person incident logging and 48-hour statutory BSR notifications.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-white/40">88 messages today</span>
                    <span className="text-rose-400 font-bold">Join Live Room &rarr;</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* 05. The Engineer's Note (Cinematic Full-Width Split) */}
          <section id="engineers-note" className="py-16 sm:py-24 scroll-mt-20">
            <div className="container-wide">
              <EngineersNote data={engineersNoteProps} />
            </div>
          </section>

          {/* 06. One Useful Thing (White Editorial Feature) */}
          <section id="useful-thing" className="py-16 sm:py-24 bg-white text-black scroll-mt-20">
            <div className="container-wide">
              <UsefulThing data={usefulThingProps} />
            </div>
          </section>

          {/* 07. From The Field (Edge-to-Edge Photographic Inspection) */}
          <section id="from-the-field" className="py-16 sm:py-24 bg-[#080C14] text-white scroll-mt-20 border-y border-white/5">
            <div className="container-wide">
              <FromTheField data={fromTheFieldProps} />
            </div>
          </section>

          {/* 08. Ask EntireFM (Editorial Typographic Q&A) */}
          <section id="ask-entirefm" className="py-16 sm:py-24 bg-white text-black scroll-mt-20">
            <div className="container-wide">
              <AskEntireFM data={askEntireFMProps} />
            </div>
          </section>

          {/* 09. FM Toolkit (Dark Asymmetric Visual Card Grid) */}
          <section id="toolkit" className="py-16 sm:py-24 bg-black text-white scroll-mt-20 border-t border-white/10">
            <div className="container-wide">
              <LobbyToolkit items={data.toolkit} />
            </div>
          </section>

          {/* 10. The Lobby Question & The Pulse (Side-by-Side Intelligence Grid) */}
          <section className="py-16 sm:py-24 bg-[#080C14] text-white border-y border-white/5">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                <div className="flex flex-col">
                  <LobbyQuestion data={data.lobbyQuestion} />
                </div>
                <div className="flex flex-col">
                  <LobbyPulse data={data.lobbyPulse} />
                </div>
              </div>
            </div>
          </section>

          {/* 11. Worth Attending (Curated Event Calendar) */}
          <section id="worth-attending" className="py-16 sm:py-20 bg-[#06090e] text-white scroll-mt-20">
            <div className="container-wide">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric">
                    INDUSTRY EVENTS · CPD CERTIFIED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-white mt-1">
                    Worth Attending
                  </h2>
                </div>
                <Link href="/lobby/events" className="text-xs font-semibold text-brand-electric hover:underline">
                  Full Event Directory &rarr;
                </Link>
              </div>
              <WorthAttending data={worthAttendingProps} />
            </div>
          </section>

          {/* 12. Archive Gateway Strip */}
          <section className="py-10 bg-black border-y border-white/10 text-white">
            <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white text-xs font-mono">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Looking for past briefings or specific regulations?</p>
                  <p className="text-xs text-white/50">Browse the complete Lobby editorial archive, statutory guides, and tool matrix.</p>
                </div>
              </div>

              <Link href="/lobby/search" className="px-5 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-mono tracking-wider uppercase border border-white/15 transition-all flex items-center gap-2">
                <span>Search Lobby Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 13. Join The Lobby / The Tuesday Dispatch */}
          <LobbyNewsletter />

          {/* 14. Global Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

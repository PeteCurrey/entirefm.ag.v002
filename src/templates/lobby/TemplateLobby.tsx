import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LobbyMasthead } from '@/components/lobby/LobbyMasthead';
import { LobbySectionHeader } from '@/components/lobby/LobbySectionHeader';
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
import { LobbyAcademyTeaser } from '@/components/lobby/LobbyAcademyTeaser';
import { LobbyNewsletter } from '@/components/lobby/LobbyNewsletter';
import { getLobbyHomepageData } from '@/lib/lobby/repository';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export function TemplateLobby() {
  const data = getLobbyHomepageData();

  // Map lead story to LeadBriefing props
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

  // Map compliance watch item props
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

  // Map engineers note props
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

  // Map useful thing props
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

  // Map from the field props
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

  // Map ask EntireFM props
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

  // Map worth attending props
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
    <div className="min-h-screen bg-brand-void text-brand-graphite">
      <Header solid={false} />

      <main id="main" className="relative">
        {/* 01. Editorial Masthead & Date Introduction (Pinned Full-Screen Hero) */}
        <div className="sticky top-0 z-0 h-screen min-h-[640px] lg:min-h-[720px] w-full overflow-hidden">
          <LobbyMasthead />
        </div>

        {/* 02+ Scrolling Editorial Sections (Scrolls over the Pinned Hero) */}
        <div className="relative z-10 bg-white shadow-[0_-24px_50px_rgba(0,0,0,0.35)] border-t border-brand-edge-dark/20">
          {/* 02. Dominant Lead Story + Secondary Compliance Watch */}
          <section id="week-that-matters" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
            <div className="container-wide">
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-stretch">
                {/* Dominant Week That Matters Lead Briefing */}
                <div className="flex flex-col">
                  <LobbySectionHeader
                    number="01"
                    eyebrow="The Week That Matters"
                    title="Priority FM Analysis"
                    subtitle="Critical regulatory, legal, and operational developments prioritized for UK estate leaders."
                  />
                  <div className="flex-1">
                    <LeadBriefing data={leadBriefingProps} />
                  </div>
                </div>

                {/* Secondary Compliance Watch Module */}
                <div id="compliance-watch" className="flex flex-col scroll-mt-20">
                  <LobbySectionHeader
                    number="02"
                    eyebrow="Compliance Watch"
                    title="Regulatory Translation"
                    subtitle="Statutory mandates translated into immediate operational actions."
                  />
                  <div className="flex-1">
                    <ComplianceWatch data={complianceWatchProps} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 03. Briefing Wire / Key Developments Strip */}
          <BriefingStrip items={data.briefingStrip} />

          {/* 04. The Engineer's Note (Technical Diagnostic) */}
          <section id="engineers-note" className="py-16 sm:py-20 lg:py-24 bg-brand-void text-white scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="03"
                eyebrow="The Engineer’s Note"
                title="Field Diagnostics & Plant Intelligence"
                subtitle="Practical, concise engineering observations written by senior building services specialists."
                dark={true}
              />
              <EngineersNote data={engineersNoteProps} />
            </div>
          </section>

          {/* 05. One Useful Thing (Actionable Asset) */}
          <section id="useful-thing" className="py-16 sm:py-20 bg-white border-b border-brand-edge scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="04"
                eyebrow="One Useful Thing"
                title="Practical Estate Asset"
                subtitle="A tested tool, checklist, or template you can use across your buildings today."
              />
              <UsefulThing data={usefulThingProps} />
            </div>
          </section>

          {/* 06. From The Field (Photography-Led Feature) */}
          <section id="from-the-field" className="py-16 sm:py-20 lg:py-24 bg-brand-graphite text-white scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="05"
                eyebrow="From The Field"
                title="Real-World Site Inspections"
                subtitle="Plantroom observations and defect identification from live UK commercial facilities."
                dark={true}
              />
              <FromTheField data={fromTheFieldProps} />
            </div>
          </section>

          {/* 07. Ask EntireFM (Typographic Q&A) */}
          <section id="ask-entirefm" className="py-16 sm:py-20 bg-white border-b border-brand-edge scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="06"
                eyebrow="Ask EntireFM"
                title="Professional Estate Q&A"
                subtitle="Answers to complex operational, mobilization, and compliance questions."
              />
              <AskEntireFM data={askEntireFMProps} />
            </div>
          </section>

          {/* 08. FM Toolkit (Curated Existing Tools Gateway) */}
          <section id="toolkit" className="py-16 sm:py-20 bg-brand-surface border-b border-brand-edge scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="07"
                eyebrow="FM Toolkit"
                title="Calculators, Schedules & Spec Builders"
                subtitle="Curated interactive tools from the EntireFM engineering suite to streamline estate planning."
              />
              <LobbyToolkit items={data.toolkit} />
            </div>
          </section>

          {/* 09 & 10. The Lobby Question & The Pulse (Interactive Grid) */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-brand-edge">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* The Lobby Question */}
                <div className="flex flex-col">
                  <LobbySectionHeader
                    number="08"
                    eyebrow="The Lobby Question"
                    title="Weekly Technical Challenge"
                    subtitle="Test your knowledge of British Standards, ACOP guidance, and statutory testing intervals."
                  />
                  <div className="flex-1">
                    <LobbyQuestion data={data.lobbyQuestion} />
                  </div>
                </div>

                {/* The Pulse */}
                <div className="flex flex-col">
                  <LobbySectionHeader
                    number="09"
                    eyebrow="The Pulse"
                    title="Industry Sentiment Benchmark"
                    subtitle="What UK facilities managers and property directors are prioritising this month."
                  />
                  <div className="flex-1">
                    <LobbyPulse data={data.lobbyPulse} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Worth Attending */}
          <section id="worth-attending" className="py-16 sm:py-20 bg-brand-surface border-b border-brand-edge scroll-mt-20">
            <div className="container-wide">
              <LobbySectionHeader
                number="10"
                eyebrow="Worth Attending"
                title="Curated Professional Events"
                subtitle="Conferences, technical webinars, and CPD opportunities genuinely worth your time."
              />
              <WorthAttending data={worthAttendingProps} />
            </div>
          </section>

          {/* 12. EntireFM Academy Teaser */}
          <section className="py-16 sm:py-20 bg-brand-void text-white">
            <div className="container-wide">
              <LobbySectionHeader
                number="11"
                eyebrow="EntireFM Academy"
                title="Operational Learning & Training"
                subtitle="The upcoming practical training environment for commercial estate teams."
                dark={true}
              />
              <LobbyAcademyTeaser />
            </div>
          </section>

          {/* 13. Lobby Archive Gateway Bar */}
          <section className="py-10 bg-white border-y border-brand-edge">
            <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-electric/10 text-brand-electric text-xs font-mono">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-normal text-brand-graphite">Looking for past briefings or specific topics?</p>
                  <p className="text-xs font-light text-brand-silver">Browse the complete Lobby editorial archive and topic indexes.</p>
                </div>
              </div>

              <Link href="/lobby/archive" className="btn-outline text-xs py-2.5 px-5">
                <span>Open Lobby Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 14. Editorial Newsletter Dispatch */}
          <LobbyNewsletter />

          {/* 15. Global Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

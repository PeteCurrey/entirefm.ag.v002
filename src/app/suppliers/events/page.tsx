import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';

// Hero & Core Positioning
import { EventHero } from '@/components/suppliers/events/EventHero';
import { EventImageGallery } from '@/components/suppliers/events/EventImageGallery';
import { WhyEventsMatter } from '@/components/suppliers/events/WhyEventsMatter';

// Programme Structure
import { EventFormatGrid } from '@/components/suppliers/events/EventFormatGrid';
import { EventExperienceSteps } from '@/components/suppliers/events/EventExperienceSteps';

// Event Programme
import { AnnualProgrammeTimeline } from '@/components/suppliers/events/AnnualProgrammeTimeline';
import { UpcomingEventsCalendar } from '@/components/suppliers/events/UpcomingEventsCalendar';
import { PastEventsArchiveSection } from '@/components/suppliers/events/PastEventsArchiveSection';

// Ecosystem & Network
import { BreakfastToBoardroom } from '@/components/suppliers/events/BreakfastToBoardroom';
import { RegionalProgrammeSection } from '@/components/suppliers/events/RegionalProgrammeSection';
import { SummitPositioningSection } from '@/components/suppliers/events/SummitPositioningSection';
import { EventSponsorshipSection } from '@/components/suppliers/events/EventSponsorshipSection';

// Conversion & Membership
import { EventTestimonialSection } from '@/components/suppliers/events/EventTestimonialSection';
import { EventsMembershipBridge } from '@/components/suppliers/events/EventsMembershipBridge';

// Registration & Links
import { EventInterestForm } from '@/components/suppliers/events/EventInterestForm';
import { SupplierPortalConnectionBanner } from '@/components/suppliers/events/SupplierPortalConnectionBanner';

export const metadata: Metadata = {
  title: 'Events & Industry Forums | EntireFM Partner Network',
  description:
    'EntireFM membership gives contractors access to a professional FM community — technical briefings, manufacturer sessions, supplier breakfasts, regional forums, and executive roundtables. Meet the people shaping modern FM.',
  openGraph: {
    title: 'Events & Industry Forums | EntireFM Partner Network',
    description:
      'Technical briefings, supplier breakfasts, OEM manufacturer days and regional contractor forums across the UK — part of the EntireFM Partner Network membership programme.',
    url: 'https://www.entirefm.com/suppliers/events',
  },
  alternates: {
    canonical: 'https://www.entirefm.com/suppliers/events',
  },
};

export default function SupplierEventsPublicPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        {/* ── 01: HERO ── */}
        <EventHero />

        {/* ── 02: TRUST BAR ── */}
        <TrustBar />

        {/* ── 03: EDITORIAL GALLERY ── */}
        <EventImageGallery />

        {/* ── 04: WHY EVENTS MATTER (dark section) ── */}
        <WhyEventsMatter />

        {/* ── 05: EVENT EXPERIENCE STEPS ── */}
        <EventExperienceSteps />

        {/* ── 06: 8 PROGRAMME FORMATS ── */}
        <EventFormatGrid />

        {/* ── 07: UPCOMING EVENTS CALENDAR ── */}
        <UpcomingEventsCalendar />

        {/* ── 08: ANNUAL INDICATIVE PROGRAMME ── */}
        <AnnualProgrammeTimeline />

        {/* ── 09: HISTORICAL ARCHIVE ── */}
        <PastEventsArchiveSection />

        {/* ── 10: ECOSYSTEM — FROM ENGINEERS TO DECISION-MAKERS (dark) ── */}
        <BreakfastToBoardroom />

        {/* ── 11: REGIONAL PROGRAMME HUBS ── */}
        <RegionalProgrammeSection />

        {/* ── 12: PARTNER NETWORK SUMMIT ── */}
        <SummitPositioningSection />

        {/* ── 13: SPONSORSHIP & OEM PARTNERSHIP ── */}
        <EventSponsorshipSection />

        {/* ── 14: TESTIMONIALS (renders null if no approved quotes) ── */}
        <EventTestimonialSection />

        {/* ── 15: MEMBERSHIP BRIDGE — PILLARS + TIERS + INVITATION CODE ── */}
        <EventsMembershipBridge />

        {/* ── 16: EVENT INTEREST REGISTRATION ── */}
        <EventInterestForm />

        {/* ── 17: SUPPLIER PORTAL CROSS-LINKS ── */}
        <SupplierPortalConnectionBanner />

        {/* ── 18: ACCREDITATION TRUST RAIL ── */}
        <section className="py-12 bg-[#FFFFFF] border-t border-[#E8E8E5]">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

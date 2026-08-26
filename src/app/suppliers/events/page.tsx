import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';

import { EventHero } from '@/components/suppliers/events/EventHero';
import { EventFormatGrid } from '@/components/suppliers/events/EventFormatGrid';
import { AnnualProgrammeTimeline } from '@/components/suppliers/events/AnnualProgrammeTimeline';
import { UpcomingEventsCalendar } from '@/components/suppliers/events/UpcomingEventsCalendar';
import { RegionalProgrammeSection } from '@/components/suppliers/events/RegionalProgrammeSection';
import { SummitPositioningSection } from '@/components/suppliers/events/SummitPositioningSection';
import { PastEventsArchiveSection } from '@/components/suppliers/events/PastEventsArchiveSection';
import { EventSponsorshipSection } from '@/components/suppliers/events/EventSponsorshipSection';
import { EventInterestForm } from '@/components/suppliers/events/EventInterestForm';
import { SupplierPortalConnectionBanner } from '@/components/suppliers/events/SupplierPortalConnectionBanner';

export const metadata: Metadata = {
  title: 'Partner Network Events & Supplier Forums | EntireFM',
  description: 'Connect with facilities managers, engineering specialists, and equipment manufacturers at EntireFM Partner Network events, technical breakfasts, OEM sessions, and supplier forums across the UK.',
  openGraph: {
    title: 'EntireFM Partner Network Events & Forums',
    description: 'A programme bringing together contractors, manufacturers, technical specialists, and facilities professionals around practical property and engineering challenges.',
    url: 'https://www.entirefm.com/suppliers/events',
  },
};

export default function SupplierEventsPublicPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        {/* ── SECTION 01: HERO ── */}
        <EventHero />

        {/* Brand Trust Bar */}
        <TrustBar />

        {/* ── SECTION 02: 8 PROGRAMME FORMATS ── */}
        <EventFormatGrid />

        {/* ── SECTION 03: 4-QUARTER INDICATIVE PROGRAMME ── */}
        <AnnualProgrammeTimeline />

        {/* ── SECTION 04: UPCOMING EVENTS CALENDAR & LIST UX ── */}
        <UpcomingEventsCalendar />

        {/* ── SECTION 05: REGIONAL HUBS DELIVERY ── */}
        <RegionalProgrammeSection />

        {/* ── SECTION 06: SUMMIT FOUNDATION (DARK BREAK) ── */}
        <SummitPositioningSection />

        {/* ── SECTION 07: PAST EVENTS ARCHIVE (TRUTHFUL EMPTY STATE) ── */}
        <PastEventsArchiveSection />

        {/* ── SECTION 08: SPONSORSHIP & OEM PARTNERSHIP ── */}
        <EventSponsorshipSection />

        {/* ── SECTION 09: EVENT INTEREST REGISTRATION FORM ── */}
        <EventInterestForm />

        {/* ── SECTION 10: SUPPLIER PORTAL & ECOSYSTEM CROSS-LINKS ── */}
        <SupplierPortalConnectionBanner />

        {/* Accreditations Trust Rail */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

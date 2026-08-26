import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';

import { EventHero } from '@/components/suppliers/events/EventHero';
import { PastEventsArchiveSection } from '@/components/suppliers/events/PastEventsArchiveSection';
import { EventFormatGrid } from '@/components/suppliers/events/EventFormatGrid';
import { AnnualProgrammeTimeline } from '@/components/suppliers/events/AnnualProgrammeTimeline';
import { UpcomingEventsCalendar } from '@/components/suppliers/events/UpcomingEventsCalendar';
import { RegionalProgrammeSection } from '@/components/suppliers/events/RegionalProgrammeSection';
import { SummitPositioningSection } from '@/components/suppliers/events/SummitPositioningSection';
import { EventSponsorshipSection } from '@/components/suppliers/events/EventSponsorshipSection';
import { EventInterestForm } from '@/components/suppliers/events/EventInterestForm';
import { SupplierPortalConnectionBanner } from '@/components/suppliers/events/SupplierPortalConnectionBanner';

export const metadata: Metadata = {
  title: 'Supplier Events, Training & Industry Engagement | EntireFM Partner Network',
  description: 'EntireFM has always believed that strong supply chains are built through direct relationships, technical understanding and shared knowledge. Explore our historical supplier breakfasts, manufacturer days, technical training and the forward Partner Network programme.',
  openGraph: {
    title: 'Supplier Events, Training & Industry Engagement | EntireFM',
    description: 'Practical supplier breakfasts, manufacturer open days, technical demonstrations and regional forums — now formalised within the structured EntireFM Partner Network.',
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

        {/* ── SECTION 02: HISTORICAL PARTNER ACTIVITY & COLLABORATION ARCHIVE ── */}
        <PastEventsArchiveSection />

        {/* ── SECTION 03: 8 PROGRAMME FORMATS ── */}
        <EventFormatGrid />

        {/* ── SECTION 04: 4-QUARTER INDICATIVE PROGRAMME ── */}
        <AnnualProgrammeTimeline />

        {/* ── SECTION 05: UPCOMING SESSIONS & CALENDAR ── */}
        <UpcomingEventsCalendar />

        {/* ── SECTION 06: REGIONAL HUBS DELIVERY ── */}
        <RegionalProgrammeSection />

        {/* ── SECTION 07: SUMMIT FOUNDATION (DARK BREAK) ── */}
        <SummitPositioningSection />

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

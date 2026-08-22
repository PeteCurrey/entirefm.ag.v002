import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/hero/HomeHero';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { StatBlock, ClientLogoRail } from '@/components/trust/StatBlock';
import { ServiceGrid, SectorGrid, LocationGrid } from '@/components/content/ServiceGrid';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature } from '@/components/content/CaseStudyFeature';
import { FAQAccordion } from '@/components/content/CapabilityList';

export function TemplateHome() {
  const homeFaqs = [
    {
      question: 'What facilities management delivery model does EntireFM operate?',
      answer: 'EntireFM operates a direct engineering self-delivery model supported by our 24/7 central operations desk. Rather than acting as a purely brokered managing agency, our technical engineers, mobile compliance vans, and specialist cleaning operatives deliver services directly on-site.'
    },
    {
      question: 'How do you handle statutory building compliance and SFG20 maintenance?',
      answer: 'We digitize and manage all building assets within our CAFM system, scheduling planned preventative maintenance according to SFG20 and CIBSE industry standards. Clients have real-time access to digital compliance logs, NICEIC electrical certs, Gas Safe records, and TM44 reports.'
    },
    {
      question: 'What emergency response times do you provide across London and regional cities?',
      answer: 'Our dedicated 24/7 helpdesk provides immediate technical triage and dispatches mobile engineering teams for rapid response. Contractual SLAs are tailored based on critical building operations (e.g. 2–4 hour emergency windows for major commercial centres).'
    },
    {
      question: 'Can EntireFM manage multi-site estates across different UK regions?',
      answer: 'Yes. We manage nationwide commercial property portfolios through regional operational hubs in London, Manchester, Birmingham, Sheffield, Leeds, Lincoln, and surrounding commercial corridors.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <TrustBar />
        
        {/* Core Stats Band */}
        <section className="py-12 bg-brand-surface border-b border-brand-border">
          <div className="container-custom">
            <StatBlock />
          </div>
        </section>

        {/* Capabilities / Service Grid */}
        <ServiceGrid />

        {/* Accreditation Proof */}
        <AccreditationRail />

        {/* Sectors Grid */}
        <SectorGrid />

        {/* Operational Case Study */}
        <CaseStudyFeature />

        {/* Estate Experience Proof */}
        <ClientLogoRail />

        {/* Locations Grid */}
        <LocationGrid />

        {/* FAQ Section */}
        <FAQAccordion faqs={homeFaqs} />

        {/* Embedded Commercial Conversion Section */}
        <ProposalSection
          headline="Request a Total Facilities Management Review"
          subheadline="Consult with our engineering directors regarding single-site or portfolio maintenance scopes, compliance audits, or reactive helpdesk support."
        />
      </main>
      <Footer />
    </div>
  );
}

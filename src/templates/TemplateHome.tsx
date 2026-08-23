import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/hero/HomeHero';
import { BrandIntro } from '@/components/brand/BrandIntro';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { StatBlock, ClientLogoRail } from '@/components/trust/StatBlock';
import { ServiceGrid, SectorGrid, LocationGrid } from '@/components/content/ServiceGrid';
import { FullBleedFeature } from '@/components/content/FullBleedFeature';
import { HorizontalRail } from '@/components/content/HorizontalRail';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature } from '@/components/content/CaseStudyFeature';
import { FAQAccordion } from '@/components/content/CapabilityList';

/**
 * HOMEPAGE
 * ========
 * Paced deliberately: a full-viewport opening, then dense capability content,
 * then two full-bleed image bands to break the rhythm, a horizontal rail, and
 * the conversion close.
 *
 * The FAQ answers below were rewritten to remove claims the registry forbids —
 * they previously asserted NICEIC and Gas Safe certification (both TO_VERIFY),
 * a "dedicated 24/7 helpdesk" (TO_VERIFY) and "regional operational hubs" in
 * seven named cities (GEO_REGIONAL_CENTRES, DO_NOT_USE).
 */

const HOME_FAQS = [
  {
    question: 'What facilities management delivery model does EntireFM operate?',
    answer:
      'EntireFM holds the whole scope under one contract, so responsibility for an issue does not move between suppliers while a building sits unusable. The delivery model for each service line — directly employed or through a vetted specialist — is confirmed at proposal stage so it can be verified rather than taken on trust.',
  },
  {
    question: 'How do you handle statutory compliance and SFG20 maintenance?',
    answer:
      'Assets are surveyed and recorded, then planned maintenance is scheduled against SFG20 task definitions and the obligations that actually apply to each asset. Certificates, test results and completion evidence are held in one place and available to the client, so compliance can be demonstrated rather than asserted.',
  },
  {
    question: 'What emergency response times do you provide?',
    answer:
      'Response times are agreed per site during mobilisation, set by priority band and site criticality rather than as a single blanket figure. A safety-critical failure and a non-urgent fabric repair should not carry the same target, and a contract that says they do is not being honest about either.',
  },
  {
    question: 'Can EntireFM manage multi-site estates across different UK regions?',
    answer:
      'Yes. Multi-site estates are the more common case. Coverage is delivered by mobile engineering teams working to each area rather than through a branch network, and response times are set from genuine travel capability — so a site an hour from a city centre is priced and committed to honestly.',
  },
  {
    question: 'What does mobilisation actually involve?',
    answer:
      'It starts with an asset survey rather than a contract start date. Until the assets, their condition and their statutory obligations are known, any maintenance schedule is guesswork. From that survey we build the PPM plan and compliance calendar, then run a defined handover alongside outgoing suppliers so nothing lapses in the gap.',
  },
];

const RAIL_ITEMS = [
  {
    imageKey: 'switchgear-inspection',
    eyebrow: 'Electrical',
    title: 'Fixed wire testing and distribution',
    body: 'Periodic inspection, EICR reporting and remedial works across HV and LV distribution, with the certificate filed against the asset.',
    href: '/mechanical-electrical',
  },
  {
    imageKey: 'rooftop-plant-night',
    eyebrow: 'Plant',
    title: 'Rooftop plant and HVAC',
    body: 'Chillers, air handling units and condensers maintained around occupancy — including the out-of-hours work that keeps a building running.',
    href: '/hvac-contractor',
  },
  {
    imageKey: 'switchroom-survey',
    eyebrow: 'Surveys',
    title: 'Asset survey and condition',
    body: 'The survey that makes a maintenance plan real: what is installed, what condition it is in, and what it is legally obliged to have done to it.',
    href: '/ppm',
  },
  {
    imageKey: 'access-control-install',
    eyebrow: 'Security',
    title: 'Access control and door entry',
    body: 'Installation, maintenance and the fire-interface testing that is missed most often — every locked escape door must release on alarm.',
    href: '/access-control',
  },
  {
    imageKey: 'ev-charging',
    eyebrow: 'Energy',
    title: 'EV charging infrastructure',
    body: 'Commercial charging equipment installed and maintained alongside the distribution capacity it depends on.',
    href: '/mechanical-electrical',
  },
  {
    imageKey: 'client-review',
    eyebrow: 'Reporting',
    title: 'Performance you can check',
    body: 'Job status, PPM completion and spend reported by site, so service charge and budget questions can be answered with evidence.',
    href: '/client-login',
  },
];

export function TemplateHome() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <BrandIntro />
        <HomeHero />
        <TrustBar />

        <section className="section-tight bg-brand-surface">
          <div className="container-custom">
            <StatBlock />
          </div>
        </section>

        <ServiceGrid />

        {/* First full-bleed break — the engineering reality behind the services. */}
        <FullBleedFeature
          imageKey="distribution-board-testing"
          eyebrow="Engineering"
          title="The work behind the contract"
          body="Facilities management is only as good as the engineering underneath it. Ours is delivered by qualified engineers working to defined task specifications, with the evidence recorded against the asset rather than against the invoice."
          points={[
            'Qualified engineers, defined task specifications',
            'Evidence recorded against the asset',
            'Statutory testing on a single calendar',
            'Remedial work under the same contract',
          ]}
          href="/mechanical-electrical"
          cta="Engineering services"
        />

        <AccreditationRail />

        <SectorGrid />

        {/* Horizontal rail — capability detail, scrolled sideways. */}
        <HorizontalRail
          eyebrow="Capability"
          title="What we actually do on site"
          intro="Six of the disciplines that make up a typical contract. Scroll sideways, or use the arrows."
          items={RAIL_ITEMS}
        />

        <CaseStudyFeature />

        <ClientLogoRail />

        <LocationGrid />

        {/* Second full-bleed break — the brand, before the close. */}
        <FullBleedFeature
          imageKey="headquarters-exterior"
          eyebrow="Facilities Management. Evolved."
          title="One estate. One contract. One accountable provider."
          body="Fragmented supply is expensive in ways that never appear on a single invoice: compliance gaps between providers who each assume someone else holds the certificate, reactive costs that rise because nobody owns the recurring fault, and management time spent chasing rather than deciding."
          href="/contact-us"
          cta="Request a proposal"
          align="centre"
        />

        <FAQAccordion faqs={HOME_FAQS} />

        <ProposalSection
          headline="Request a facilities management review"
          subheadline="Speak to our team about single-site or portfolio maintenance scopes, compliance audits, or reactive support."
        />
      </main>
      <Footer />
    </div>
  );
}

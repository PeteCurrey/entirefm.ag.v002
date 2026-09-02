import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/hero/HomeHero';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { StatBlock, ClientLogoRail } from '@/components/trust/StatBlock';
import { ServiceGrid, SectorGrid, LocationGrid } from '@/components/content/ServiceGrid';
import { EstateExperience } from '@/components/content/EstateExperience';
import { FullBleedFeature } from '@/components/content/FullBleedFeature';
import { DiagonalStatement } from '@/components/content/DiagonalStatement';
import { HorizontalRail } from '@/components/content/HorizontalRail';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature } from '@/components/content/CaseStudyFeature';
import { HomeFAQ } from '@/components/content/HomeFAQ';

/**
 * HOMEPAGE
 * ========
 * Paced deliberately: a full-viewport opening, then dense capability content,
 * estate discipline selector, full-bleed image bands, horizontal rail, FAQ, and
 * the conversion close.
 */

const HOME_FAQS = [
  {
    question: 'What does a commercial facilities management contract include?',
    answer:
      'EntireFM holds the entire building services scope under one contract. This typically integrates Hard FM (mechanical and electrical engineering, HVAC, boiler servicing, statutory fixed-wire testing, fire systems), Planned Preventative Maintenance (SFG20-aligned PPM schedules), Soft FM (commercial and industrial cleaning, security, grounds maintenance), and 24/7 reactive emergency fault attendance.',
  },
  {
    question: 'What is the operational difference between Hard FM and Soft FM?',
    answer:
      'Hard FM refers to the physical, technical and safety-critical infrastructure of a building that cannot be removed (HV/LV distribution boards, chillers, air handling units, plumbing, gas, fire alarms, and building fabric). Soft FM encompasses human-centric workplace services (contract office cleaning, specialist decontamination, security guarding, waste management, and grounds care). EntireFM coordinates both so maintenance access and daily operations never conflict.',
  },
  {
    question: 'How does EntireFM formulate a Planned Preventative Maintenance (PPM) programme?',
    answer:
      'Every PPM contract begins with a rigorous on-site asset condition audit. We barcode-tag physical equipment, register make/model/serial numbers into EntireCAFM, and map every maintainable asset against SFG20 task definitions and statutory compliance intervals. This produces a 52-week maintenance calendar guaranteeing full legal compliance without guesswork.',
  },
  {
    question: 'Can EntireFM manage multi-site commercial portfolios across different UK regions?',
    answer:
      'Yes. We support corporate portfolios, logistics hubs, retail chains, and property managing agents across the UK. Service delivery is coordinated centrally through our operations desk with assigned mobile engineering teams deployed regionally, providing single-point accountability and unified monthly CAFM compliance reporting across all sites.',
  },
  {
    question: 'How is statutory maintenance tracked and audited?',
    answer:
      'All statutory maintenance — including periodic fixed-wire inspection (EICR), emergency lighting duration tests, TM44 air conditioning energy inspections, F-Gas leak logs, commercial gas safety, and Legionella water hygiene sampling — is digitally archived in our CAFM system with certificates, job sheets, and photo evidence available for immediate landlord or insurer auditing.',
  },
  {
    question: 'What happens during facilities management contract mobilisation?',
    answer:
      'Mobilisation begins immediately upon appointment with a structured 30-to-90-day transition programme. This includes a comprehensive asset condition survey, health & safety risk assessments, TUPE consultations where relevant, digital CAFM asset onboarding, PPM schedule formulation, and a coordinated handover with outgoing contractors so no compliance certificates lapse in the gap.',
  },
  {
    question: 'How do planned maintenance and 24/7 reactive attendance work together?',
    answer:
      'Effective PPM directly reduces unexpected asset breakdowns by identifying worn components during routine servicing. When urgent plant failures or building fabric emergencies occur, our central operations desk coordinates reactive engineer attendance based on agreed site priority bands and criticality SLAs, with direct access to your site’s CAFM asset history.',
  },
  {
    question: 'How do we transition our estate to EntireFM from an existing provider?',
    answer:
      'Changing FM provider is straightforward with our managed onboarding framework. We review your existing asset registers and compliance certificates, identify any historic compliance gaps or outstanding remedial works, establish clear communication protocols with your facilities team, and take full operational ownership from Day 1.',
  },
];

const RAIL_ITEMS = [
  {
    imageKey: 'distribution-board-testing',
    eyebrow: 'Engineering',
    title: 'Mechanical & Electrical',
    body: 'Planned and reactive engineering for critical building systems, switchgear and plant rooms.',
    href: '/mechanical-electrical',
  },
  {
    imageKey: 'hvac-rooftop-condensers',
    eyebrow: 'Plant & Climate',
    title: 'Commercial HVAC & Air Con',
    body: 'Commercial heating, cooling and ventilation maintained for optimal efficiency and F-Gas compliance.',
    href: '/hvac-contractor',
  },
  {
    imageKey: 'rope-access-bmu',
    eyebrow: 'Specialist Access',
    title: 'Rope Access & BMU Services',
    body: 'IRATA-certified rope access, BMU cradle operations, high-level cleaning and difficult-access engineering.',
    href: '/working-at-height-rope-access-bmu',
  },
  {
    imageKey: 'switchgear-inspection',
    eyebrow: 'Electrical',
    title: 'Fixed Wire Testing & EICR',
    body: 'Periodic statutory inspection, thermal imaging and remedial works across HV and LV distribution boards.',
    href: '/mechanical-electrical',
  },
  {
    imageKey: 'plumbing-booster-set',
    eyebrow: 'Water & Gas',
    title: 'Plumbing & Water Systems',
    body: 'Commercial booster pump sets, calorifiers, pipework repairs and statutory Legionella water hygiene.',
    href: '/plumbing-gas',
  },
  {
    imageKey: 'commercial-cleaning',
    eyebrow: 'Hygiene',
    title: 'Commercial & Office Cleaning',
    body: 'Professional contract cleaning, daytime janitorial support and specialist sanitisation across occupied estates.',
    href: '/cleaning-services',
  },
  {
    imageKey: 'switchroom-survey',
    eyebrow: 'Compliance',
    title: 'Planned Maintenance (PPM)',
    body: 'SFG20-aligned 52-week asset maintenance schedules formulated from physical barcoded asset condition audits.',
    href: '/ppm',
  },
  {
    imageKey: 'access-control-install',
    eyebrow: 'Security',
    title: 'Access Control & CCTV',
    body: 'Commercial door entry, biometric security, CCTV systems and mandatory fire-alarm release interface testing.',
    href: '/access-control',
  },
  {
    imageKey: 'corporate-corridor',
    eyebrow: 'Building Fabric',
    title: 'Fabric & Building Care',
    body: 'Internal and external structural upkeep, joinery, glazing and envelope maintenance preserving asset value.',
    href: '/building-maintenance',
  },
  {
    imageKey: 'client-review',
    eyebrow: 'Technology',
    title: 'EntireCAFM Portal & Helpdesk',
    body: 'Real-time asset tracking, digital compliance certification archives and 24/7 reactive emergency dispatch.',
    href: '/client-portal',
  },
];

export function TemplateHome() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <HomeHero />
        <TrustBar />

        {/*
          The positioning statement, on the diagonal treatment carried over
          from the Wix Studio estate. It sits immediately after the hero for
          the same reason it did there: the hero says what we sell, and this
          says what it is like to buy it. Everything below is detail.
        */}
        <DiagonalStatement
          eyebrow="What we do"
          title="Your space."
          titleAccent="Our expertise."
          body="EntireFM has maintained commercial property since 2009 — offices and multi-let estates, motorway services, distribution and manufacturing, supermarkets and retail. The approach is consistent; the service is not. What separates us is how well we understand each client's operation, which is why the schedule for a distribution centre looks nothing like the schedule for a managing agent's portfolio."
          points={[
            'A named account manager and a defined escalation route',
            'Every maintenance plan built from an asset survey, not a template',
            'Statutory testing, certificates and evidence held in one place',
            'Response times agreed per site by priority band',
          ]}
          leftLabel="The estate you run"
          rightLabel="The engineering behind it"
          leftImageKey="manchester-castlefield-night"
          rightImageKey="rooftop-plant-night"
          href="/services"
          cta="What we do"
        />

        <section className="section-tight bg-brand-surface">
          <div className="container-custom">
            <StatBlock />
          </div>
        </section>

        <ServiceGrid />

        {/* First full-bleed break — the engineering reality behind the services. */}
        <FullBleedFeature
          imageKey="birmingham-work-behind-contract"
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

        {/* 15-Sector Footprint */}
        <SectorGrid />

        {/* Rebuilt Estate Experience (How the Estate Changes the FM Plan) */}
        <EstateExperience />

        {/* Horizontal rail — capability detail, scrolled sideways. */}
        <HorizontalRail
          eyebrow="Capabilities"
          title="What we actually do on site"
          intro="Core engineering, compliance, specialist access, and workplace hygiene disciplines delivered across commercial estates."
          items={RAIL_ITEMS}
        />


        <CaseStudyFeature />

        <ClientLogoRail />

        <LocationGrid />

        {/* Second full-bleed break — the brand, before the close. */}
        <FullBleedFeature
          imageKey="corporate-corridor"
          eyebrow="Facilities Management. Evolved."
          title="One estate. One contract. One accountable provider."
          body="Fragmented supply is expensive in ways that never appear on a single invoice: compliance gaps between providers who each assume someone else holds the certificate, reactive costs that rise because nobody owns the recurring fault, and management time spent chasing rather than deciding."
          href="/contact-us"
          cta="Request a proposal"
          align="centre"
        />

        {/* Rebuilt Editorial Two-Column FAQ Section */}
        <HomeFAQ faqs={HOME_FAQS} />

        <ProposalSection
          headline="Request a facilities management review"
          subheadline="Speak to our team about single-site or portfolio maintenance scopes, compliance audits, or reactive support."
        />
      </main>
      <Footer />
    </div>
  );
}

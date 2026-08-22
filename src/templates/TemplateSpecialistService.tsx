import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceHero } from '@/components/hero/HomeHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Sparkles, Shield, AlertTriangle, CheckCircle2, Factory, Truck } from 'lucide-react';

export function TemplateSpecialistService() {
  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Industrial Cleaning', url: '/industrial-cleaning' },
  ];

  const specialistCapabilities = [
    {
      name: 'High-Level Structural & Truss Cleaning',
      description: 'IPAF-certified high-access cleaning of steel beams, overhead conduit, cable trays, ductwork, and warehouse purlins.',
      tag: 'IPAF / High Access',
    },
    {
      name: 'Factory Shutdown & Production Line Deep Cleans',
      description: 'Scheduled intensive decontamination of manufacturing machinery, conveyor systems, degreasing, and production floor stripping.',
      tag: 'Planned Shutdowns',
    },
    {
      name: 'Confined Space & Silo Decontamination',
      description: 'Certified atmospheric monitoring, safety rescue teams, and deep extraction cleaning inside silos, tanks, and duct systems.',
      tag: 'City & Guilds Confined Space',
    },
    {
      name: 'Heavy Industrial Floor Scrubbing & Re-Sealing',
      description: 'Industrial ride-on sweepers, scrubbing machinery, chemical degreasing, and epoxy floor preparation for logistics facilities.',
      tag: 'Heavy Duty Scrubbing',
    },
    {
      name: 'External Cladding & Pressure Washing',
      description: 'Rotary surface cleaners, hot water pressure washing, and chemical biocidal washes for commercial building facades and yards.',
      tag: 'Hot Water Pressure Wash',
    },
    {
      name: 'Post-Construction & Fit-Out Sparkle Cleans',
      description: 'Builder handover cleans, mastic removal, window detailing, and dust elimination for newly developed commercial and industrial units.',
      tag: 'Handover Sparkle',
    },
  ];

  const cleaningFaqs = [
    {
      question: 'What health and safety documentation do you provide for industrial cleaning projects?',
      answer: 'Before commencing work, EntireFM produces comprehensive site-specific Risk Assessments and Method Statements (RAMS), COSHH data sheets, and operative training logs (IPAF, PASMA, Confined Space).'
    },
    {
      question: 'Can industrial cleaning work be scheduled out-of-hours or during plant shutdowns?',
      answer: 'Yes. The majority of our manufacturing and logistics cleaning operations occur overnight, during weekend plant shutdowns, or scheduled holiday maintenance windows to eliminate production downtime.'
    },
    {
      question: 'What access equipment do your industrial cleaning operatives use?',
      answer: 'Our teams are fully IPAF and PASMA certified to operate boom lifts, scissor lifts, spider access machinery, and specialized long-reach hot water pole systems.'
    },
    {
      question: 'Do you provide nationwide industrial cleaning coverage?',
      answer: 'Yes. We deploy industrial cleaning teams from our regional hubs covering London, Sheffield, Manchester, Birmingham, Leeds, Lincoln, and surrounding manufacturing corridors.'
    },
  ];

  const relatedLinks = [
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London' },
    { path: '/industrial-cleaning-manchester', label: 'Industrial Cleaning Manchester' },
    { path: '/industrial-cleaning-birmingham', label: 'Industrial Cleaning Birmingham' },
    { path: '/industrial-cleaning-sheffield', label: 'Industrial Cleaning Sheffield' },
    { path: '/cleaning-services', label: 'Commercial Contract Cleaning Services' },
    { path: '/industrial-facilities-management', label: 'Industrial Facilities Management Solutions' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        <ServiceHero
          title="Specialist Industrial Cleaning Services"
          subtitle="Heavy-duty factory deep cleans, high-level structural cleaning, plant shutdown hygiene, and industrial floor degreasing across the UK."
          category="Specialist Cleaning Operations"
          bulletPoints={[
            'IPAF & PASMA certified high-access operatives & machinery',
            'Factory shutdown cleans, de-greasing & confined space entry',
            'Full RAMS, COSHH compliance, and out-of-hours deployment',
          ]}
          defaultService="Industrial Cleaning"
        />

        <TrustBar />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">High-Hazard Operations</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Engineered Industrial Cleaning for Demanding Facilities
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Industrial environments accumulate heavy oils, combustible dust, chemical residues, and operational grime that standard commercial cleaning teams cannot safely address. EntireFM provides specialist industrial cleaning utilizing heavy plant machinery, hot water pressure extraction, and rigorous safety protocols.
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    Whether managing an urgent plant audit cleanup or an annual factory shutdown overhaul, our trained crews operate seamlessly within manufacturing plants, warehouses, food processing facilities, and waste management sites.
                  </p>
                </div>

                <CapabilityList
                  title="Specialist Industrial Cleaning Scope"
                  subtitle="Delivered by certified teams utilizing heavy access plant and industrial extraction equipment."
                  items={specialistCapabilities}
                />

                {/* Safety & Compliance Highlight Box */}
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-brand-gold" />
                    Rigorous Industrial Health & Safety Protocols
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All industrial cleaning projects include comprehensive RAMS, COSHH assessments, and task-specific PPE. Our supervisors maintain strict compliance with HSE guidelines, working-at-height regulations, and environmental disposal standards.
                  </p>
                </div>

                <InlineCTA
                  title="Need an industrial cleaning site survey or shutdown quote?"
                  description="We conduct rapid on-site surveys to assess access requirements, chemical specifications, and schedule out-of-hours cleaning shifts."
                  buttonText="Request Industrial Survey"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm space-y-4 shadow-subtle">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Environments Cleaned</span>
                  <h3 className="text-base font-bold text-brand-navy">Industrial Facilities Supported</h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Factory className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Manufacturing & Heavy Engineering Plants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Logistics, Fulfilment & High-Bay Warehouses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Automotive & Aerospace Workshops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Food Processing & Packaging Environments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <FAQAccordion faqs={cleaningFaqs} />
        <RelatedLinks links={relatedLinks} title="Related Industrial Cleaning & Regional Services" />

        <ProposalSection
          defaultService="Industrial Cleaning"
          headline="Request an Industrial Cleaning Quotation"
          subheadline="Provide your facility dimensions, cleaning scope, or shutdown window for an exact technical proposal and site survey."
        />
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceHero } from '@/components/hero/HomeHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature, RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Wrench, ShieldCheck, Zap, Activity, CheckCircle2 } from 'lucide-react';

export function TemplateCoreService() {
  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    { name: 'Mechanical & Electrical', url: '/mechanical-electrical' },
  ];

  const capabilities = [
    {
      name: 'Electrical Distribution & Switchgear Maintenance',
      description: 'Periodic inspection, thermal imaging, load testing, and maintenance of HV/LV switchboards, sub-distribution boards, and busbar systems.',
      tag: 'NICEIC / BS 7671',
    },
    {
      name: 'Emergency Lighting Testing & Compliance',
      description: 'Monthly flick tests, 3-hour annual discharge audits, battery replacements, and certified logbook maintenance to BS 5266 standards.',
      tag: 'BS 5266',
    },
    {
      name: 'Access Control & Security Integration',
      description: 'Installation and servicing of electronic keycards, biometric readers, automated barriers, turnstiles, and intercom systems.',
      tag: 'Access Systems',
    },
    {
      name: 'Commercial Heating, Boilers & Gas Systems',
      description: 'Gas Safe registered servicing of commercial boiler plants, gas safety interlocks, burner overhauls, and pump set maintenance.',
      tag: 'Gas Safe',
    },
    {
      name: 'HVAC & Ventilation Maintenance',
      description: 'AHU filter changes, ductwork inspections, belt and motor replacements, and chiller preventative maintenance.',
      tag: 'CIBSE / F-Gas',
    },
    {
      name: 'PPM Scheduling & Statutory Audits',
      description: 'Complete digital scheduling in accordance with SFG20 engineering guidelines, preventing unexpected breakdown costs.',
      tag: 'SFG20',
    },
  ];

  const meFaqs = [
    {
      question: 'What is included in EntireFM’s Mechanical & Electrical maintenance contract?',
      answer: 'Our M&E contracts cover all primary building plant and distribution infrastructure: electrical distribution, emergency lighting, commercial gas & heating, air conditioning, ventilation, water hygiene, access control, and 24/7 reactive callout support.'
    },
    {
      question: 'How do you ensure our building complies with UK statutory electrical and gas regulations?',
      answer: 'Our qualified engineers perform required periodic inspections (EICR, gas safety certificates, emergency lighting discharge tests) and issue digital compliance certificates logged directly into your CAFM portal.'
    },
    {
      question: 'Do you offer 24/7 emergency response for M&E asset failures?',
      answer: 'Yes. Our central helpdesk operates 24/7/365 with direct dispatch of certified mechanical and electrical engineers across London and all UK operating regions.'
    },
    {
      question: 'Can EntireFM service existing plant equipment or do we need to replace it?',
      answer: 'We conduct full dilapidation surveys and asset condition reports on existing plant rooms. We maintain and extend the lifecycle of legacy equipment wherever economically viable.'
    },
  ];

  const relatedLinks = [
    { path: '/hvac-contractor', label: 'HVAC & Air Conditioning Contractor' },
    { path: '/ppm', label: 'Planned Preventative Maintenance (PPM)' },
    { path: '/hard-services', label: 'Hard Facilities Management Services' },
    { path: '/mechanical-electrical/emergency-light-testing', label: 'Emergency Light Testing Services' },
    { path: '/mechanical-electrical/access-control', label: 'Commercial Access Control Systems' },
    { path: '/plumbing-gas', label: 'Commercial Plumbing & Gas Services' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Core Service Hero */}
        <ServiceHero
          title="Mechanical & Electrical (M&E) Services"
          subtitle="Integrated mechanical engineering, electrical compliance, emergency lighting, and plant maintenance for commercial and industrial estates nationwide."
          category="Hard FM & Engineering Solutions"
          bulletPoints={[
            'Certified NICEIC electrical & Gas Safe mechanical engineers',
            'Full SFG20 scheduled maintenance and statutory compliance audits',
            '24/7 reactive emergency triage and fast engineer dispatch',
          ]}
          defaultService="Mechanical & Electrical (M&E)"
        />

        <TrustBar />

        {/* Detailed Service Content Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content Column */}
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">Engineering Scope</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Comprehensive M&E Delivery for Modern Built Environments
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Commercial facilities rely on uninterrupted power, climate control, and life-safety systems. EntireFM delivers multi-discipline Mechanical & Electrical services through self-delivered engineering teams, ensuring single-point accountability for your entire building services infrastructure.
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    From complex plant room overhauls in Central London to multi-site PPM contracts across regional logistics portfolios, we maintain critical plant efficiency, mitigate business disruption, and enforce total statutory compliance.
                  </p>
                </div>

                {/* Technical Capabilities Matrix */}
                <CapabilityList
                  title="M&E Technical Capabilities & Scope"
                  subtitle="Delivered by certified engineers adhering strictly to British Standards and statutory obligations."
                  items={capabilities}
                />

                {/* Asset Types Supported Box */}
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-gold" />
                    Key Mechanical & Electrical Assets Maintained
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>LV Main Panels & Sub-Distribution Boards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Commercial Boilers, Burners & Gas Trains</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Air Handling Units (AHUs) & Ductwork</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Chillers, VRV/VRF Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Emergency Lighting Central Battery Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Access Control, Intercoms & Turnstiles</span>
                    </div>
                  </div>
                </div>

                <InlineCTA
                  title="Require an M&E asset audit or maintenance proposal?"
                  description="Our senior mechanical & electrical engineering surveyors evaluate site condition, review compliance gaps, and structure optimized PPM contracts."
                  buttonText="Request M&E Survey"
                  buttonLink="#enquiry"
                />
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold block font-semibold">Compliance Accreditations</span>
                  <h3 className="text-base font-bold text-white">Certified M&E Standards</h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">NICEIC Electrical Safety</strong>
                        <span className="text-slate-400">Periodic testing & compliance certification [PENDING VERIF.]</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Gas Safe Register</strong>
                        <span className="text-slate-400">Commercial boiler & heating systems [PENDING VERIF.]</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">SFG20 Maintenance Standards</strong>
                        <span className="text-slate-400">Standardized task scheduling</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm space-y-3">
                  <h4 className="text-sm font-bold text-brand-navy">National Delivery Coverage</h4>
                  <p className="text-xs text-slate-600">
                    Mobile M&E engineering vans operating across London, Manchester, Birmingham, Leeds, Sheffield, Lincoln and nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <CaseStudyFeature />
        <FAQAccordion faqs={meFaqs} />
        <RelatedLinks links={relatedLinks} title="Related Hard FM & Engineering Services" />

        <ProposalSection
          defaultService="Mechanical & Electrical (M&E)"
          headline="Request an M&E Maintenance Proposal"
          subheadline="Discuss your building plant requirements, scheduled servicing frequencies, or compliance audits with our technical engineering team."
        />
      </main>
      <Footer />
    </div>
  );
}

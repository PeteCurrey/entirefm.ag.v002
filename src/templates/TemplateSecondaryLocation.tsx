import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature, RelatedLinks } from '@/components/content/CaseStudyFeature';
import { ShieldCheck, Calendar, Layers, FileText, CheckCircle2, ArrowRight, Building, Wrench, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

export function TemplateSecondaryLocation() {
  const breadcrumbs = [
    { name: 'Locations', url: '/locations' },
    { name: 'London', url: '/fm-london' },
    { name: 'Facilities Management London', url: '/facilities-management-london' },
  ];

  const plannedLondonServices = [
    {
      name: 'SFG20 Planned Preventative Maintenance (PPM)',
      description: 'Systematic maintenance schedules covering all HVAC, mechanical plant, electrical switchgear, and life-safety systems to preserve asset value.',
      tag: 'SFG20 Standards',
    },
    {
      name: 'Statutory Building Compliance Management',
      description: 'Rigorous management of all mandatory London property certifications: EICR, Gas Safety, TM44 Air Conditioning, L8 Legionella, and Fire Alarms.',
      tag: 'Statutory Compliance',
    },
    {
      name: 'Integrated Hard & Soft FM Bundling',
      description: 'Single-source contract consolidation combining mechanical engineering, daily office cleaning, security guarding, and washroom replenishment.',
      tag: 'Total FM Contract',
    },
    {
      name: 'CAFM Digital Asset Register & Portal',
      description: 'Transparent client dashboard with real-time maintenance logs, asset condition tagging, engineer signoffs, and compliance certificates.',
      tag: 'CAFM Technology',
    },
    {
      name: 'Energy Efficiency & ESG Optimization',
      description: 'HVAC scheduling audits, LED retrofit projects, and BMS optimization to reduce operational carbon footprint in London buildings.',
      tag: 'ESG & Energy',
    },
    {
      name: 'Dedicated London Contract Manager',
      description: 'Single point of contact for executive reporting, monthly KPI reviews, budget tracking, and continuous estate improvement.',
      tag: 'Account Governance',
    },
  ];

  const plannedLondonFaqs = [
    {
      question: 'How does EntireFM structure planned FM contracts for London commercial buildings?',
      answer: 'We begin with an exhaustive site asset verification survey, cataloguing all plant and building infrastructure. We then generate an annual SFG20 PPM schedule and upload all assets to our digital CAFM portal.'
    },
    {
      question: 'Can EntireFM consolidate separate cleaning, security, and M&E contracts into one?',
      answer: 'Yes. Our integrated Total Facilities Management model combines Hard FM engineering and Soft FM services under one contract, reducing administrative overhead and delivering 15–25% cost efficiencies.'
    },
    {
      question: 'How do you ensure audit readiness for building compliance?',
      answer: 'Every statutory inspection is scheduled automatically in our CAFM system. Digital certificates (NICEIC, Gas Safe, Fire Alarm, Legionella water testing) are immediately uploaded to your client portal for instant audit retrieval.'
    },
    {
      question: 'How is this page different from /fm-london and /london-facilities-management?',
      answer: 'This page focuses on long-term planned maintenance contracts, statutory compliance frameworks, and total FM delivery. /fm-london focuses on 24/7 reactive emergency engineering, while /london-facilities-management caters to prime managing agents and corporate real estate portfolios.'
    },
  ];

  const relatedLinks = [
    { path: '/fm-london', label: 'FM London (24/7 Emergency Operations Desk)' },
    { path: '/london-facilities-management', label: 'London Facilities Management (Managing Agent & HQ Focus)' },
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services' },
    { path: '/ppm', label: 'Planned Preventative Maintenance (SFG20)' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London' },
    { path: '/hard-services', label: 'Hard Facilities Management Solutions' },
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

        {/* Total FM Planned Maintenance Hero (Distinct Composition) */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-gold">
                  <Calendar className="w-3.5 h-3.5" />
                  Planned Maintenance & Governance
                </span>
                <span className="badge-dark text-slate-300">
                  London Commercial Estates
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Facilities Management London — Total Estate Maintenance & Compliance
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Structured planned preventative maintenance (PPM), statutory building compliance, and integrated hard & soft FM solutions for commercial property owners and building operators across London.
              </p>

              {/* Service Architecture Comparison Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-mono text-slate-200">
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Hard FM & Engineering</strong>
                  <span>M&E, HVAC, SFG20 compliance</span>
                </div>
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Soft FM & Cleaning</strong>
                  <span>Daily office cleans, hygiene, security</span>
                </div>
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Contract Governance</strong>
                  <span>Dedicated manager & CAFM portal</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold">
                  Request Planned FM Proposal <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/fm-london" className="btn-outline-white py-3 px-5 text-xs font-semibold">
                  View 24/7 Emergency Hub →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* PPM Framework Breakdown */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">Planned Estate Governance</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Proactive Maintenance Frameworks for London Commercial Property
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Reactive repairs in London buildings carry steep emergency premiums and disrupt tenant operations. EntireFM delivers structured planned maintenance contracts designed to eliminate avoidable breakdowns, maintain asset manufacturer warranties, and ensure 100% statutory compliance.
                  </p>
                </div>

                <CapabilityList
                  title="Planned Facilities Management Scope"
                  subtitle="Comprehensive estate management executed to SFG20 and British Standards."
                  items={plannedLondonServices}
                />

                {/* Statutory Compliance Checklist Card */}
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm space-y-4 shadow-subtle">
                  <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-gold" />
                    Statutory Compliance Audits Included in London Contracts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>EICR Electrical Fixed Wire Inspections</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Commercial Gas Safety Certificates</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Emergency Lighting 3-Hour Discharge Audits</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>L8 Legionella Risk Assessment & Flushing</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>TM44 Air Conditioning Efficiency Inspections</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Fire Alarm & Extinguisher Testing</span>
                    </div>
                  </div>
                </div>

                <InlineCTA
                  title="Consolidate your London building maintenance into one contract?"
                  description="We analyze your existing supplier spend, create an optimized PPM schedule, and provide a single accountable point of contact."
                  buttonText="Request Contract Review"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Annual Contract Benefits</span>
                  <h3 className="text-base font-bold text-white">Why Outsource to EntireFM London</h3>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>Fixed predictable annual maintenance budgets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>100% digital CAFM audit compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>Reduced tenant complaints & downtime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>Preferential emergency callout rates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <CaseStudyFeature
          title="London Commercial Office Block Total FM Transition"
          sector="Commercial Real Estate"
          location="City of London (EC2)"
          challenge="Multi-let 8-storey commercial office suffering from neglected HVAC maintenance and fragmented service contractors."
          solution="EntireFM replaced three separate suppliers with a single Total FM contract, upgrading all AHU filters, overhauling switchgear, and introducing daytime janitorial staff."
          results={[
            'Single consolidated invoice reducing property manager admin by 60%',
            'Tenant satisfaction rating improved from 68% to 94%',
            'Passed all statutory building insurance audits with zero advisories',
          ]}
        />
        <FAQAccordion faqs={plannedLondonFaqs} />
        <RelatedLinks links={relatedLinks} title="Explore EntireFM’s Interconnected London Estate" />

        <ProposalSection
          defaultLocation="London"
          defaultService="Total Facilities Management"
          headline="Request a Planned FM Maintenance Proposal"
          subheadline="Let our London contract specialists structure a tailored PPM and statutory compliance contract for your commercial property."
        />
      </main>
      <Footer />
    </div>
  );
}

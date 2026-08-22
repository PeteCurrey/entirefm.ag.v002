import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectorHero } from '@/components/hero/LocationHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { CaseStudyFeature, RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Factory, ShieldCheck, Zap, Wrench, CheckCircle2, Clock } from 'lucide-react';

export function TemplateSector() {
  const breadcrumbs = [
    { name: 'Sectors', url: '/sectors' },
    { name: 'Industrial Facilities Management', url: '/industrial-facilities-management' },
  ];

  const sectorServices = [
    {
      name: 'High-Voltage Switchgear & Power Continuity',
      description: 'Planned servicing of main transformers, switchgear, UPS systems, and standby diesel generators to prevent catastrophic power cuts.',
      tag: 'Critical Power',
    },
    {
      name: 'Compressed Air & Process Mechanical Services',
      description: 'Pipework testing, pneumatic compressor maintenance, water chillers, and hydraulic line inspections.',
      tag: 'Process Mechanical',
    },
    {
      name: 'Plant Room & Heavy Machinery PPM',
      description: 'Structured SFG20 maintenance for boiler plant, heat exchangers, cooling towers, and industrial extraction fans.',
      tag: 'SFG20 Maintenance',
    },
    {
      name: 'Factory Hygiene & Confined Space Cleaning',
      description: 'Specialist degreasing, high-level structural cleaning, silo extraction, and scheduled factory shutdown cleans.',
      tag: 'Specialist Hygiene',
    },
    {
      name: 'Statutory Fire & Life-Safety Compliance',
      description: 'Fire suppression maintenance, aspirating smoke detection, emergency lighting, and ATEX zone compliance audits.',
      tag: 'Life Safety',
    },
    {
      name: 'Industrial Grounds & Secure Perimeter Management',
      description: 'Automated HGV access gates, perimeter fencing, external yard pressure washing, and winter gritting.',
      tag: 'Perimeter & Yard',
    },
  ];

  const sectorFaqs = [
    {
      question: 'How does EntireFM prevent operational downtime in manufacturing facilities?',
      answer: 'We implement predictive and preventative maintenance (PPM) schedules, schedule intrusive maintenance during planned plant downtime or night shifts, and provide 24/7 dedicated engineering emergency callouts.'
    },
    {
      question: 'Are your engineers trained for high-hazard industrial and ATEX environments?',
      answer: 'Yes. Our engineers hold relevant certifications including IOSH/NEBOSH, Confined Space Entry, IPAF, PASMA, NICEIC hazardous areas, and Gas Safe commercial tickets.'
    },
    {
      question: 'Can you provide a single FM contract combining both Hard Engineering and Industrial Cleaning?',
      answer: 'Yes. EntireFM specializes in total facilities management, bundling electrical, mechanical, HVAC, compliance, and industrial deep cleaning under a unified SLA and CAFM dashboard.'
    },
  ];

  const relatedLinks = [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services' },
    { path: '/industrial-cleaning', label: 'Industrial Cleaning & Factory Deep Cleans' },
    { path: '/ppm', label: 'Planned Preventative Maintenance (SFG20)' },
    { path: '/logistics-facilities-management', label: 'Logistics & Warehousing FM' },
    { path: '/commercial-facilities-management', label: 'Commercial Property FM' },
    { path: '/sectors', label: 'All Sector Frameworks Hub' },
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

        <SectorHero
          sectorName="Industrial & Manufacturing"
          title="Industrial Facilities Management Solutions"
          subtitle="Engineering precision, statutory compliance, and plant room maintenance engineered for factories, chemical sites, and manufacturing plants."
          criticalAssets={[
            'High-Voltage Switchboards & UPS',
            'Commercial Boilers & Steam Systems',
            'Chillers & Industrial Extraction',
            'Automated High-Bay Access Gates',
          ]}
        />

        <TrustBar />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">Operational Continuity</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Ensuring 24/7 Operational Uptime in High-Demand Industrial Estates
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Industrial and manufacturing facilities cannot afford equipment failures or compliance bottlenecks. Unplanned plant downtime directly impacts production revenue. EntireFM provides comprehensive facilities management designed specifically around industrial operational workflows.
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    Our self-delivered engineering model combines technical M&E maintenance, statutory audits, emergency callout response, and specialist cleaning into a coordinated estate management framework.
                  </p>
                </div>

                <CapabilityList
                  title="Industrial FM Scope of Delivery"
                  subtitle="Integrated engineering, compliance, and specialist hygiene delivered by certified technical operatives."
                  items={sectorServices}
                />

                <InlineCTA
                  title="Need an industrial facilities management review?"
                  description="Our senior engineering team conducts full estate surveys to identify compliance gaps, optimize asset lifecycles, and streamline maintenance costs."
                  buttonText="Request Industrial Estate Survey"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Industrial SLA Metrics</span>
                  <h3 className="text-base font-bold text-white">Engineered For Heavy Industry</h3>
                  <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Dispatch:</span>
                      <span className="text-brand-gold font-semibold">24/7/365 Helpdesk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safety Standards:</span>
                      <span className="text-white font-semibold">Full RAMS / IOSH Certified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asset Management:</span>
                      <span className="text-white font-semibold">Live Digital CAFM Logs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <CaseStudyFeature
          title="Manufacturing Plant M&E and Shutdown Hygiene Overhaul"
          sector="Industrial Manufacturing"
          location="Midlands Engineering Corridor"
          challenge="Multi-building factory experiencing intermittent power tripping and neglected overhead ductwork hygiene."
          solution="EntireFM deployed certified electrical engineers for thermal imaging and switchgear refurbishment, alongside an out-of-hours high-level industrial cleaning crew."
          results={[
            'Zero unplanned power shutdowns in 12 consecutive months',
            'Full statutory EICR and gas safety compliance certification issued',
            'Combined M&E and cleaning contract saved client 22% against split supplier costs',
          ]}
        />
        <FAQAccordion faqs={sectorFaqs} />
        <RelatedLinks links={relatedLinks} title="Related Industrial Services & Sectors" />

        <ProposalSection
          defaultService="Total Facilities Management"
          headline="Request an Industrial FM Contract Proposal"
          subheadline="Consult with our industrial engineering team to structure a customized maintenance scope for your manufacturing facility or distribution hub."
        />
      </main>
      <Footer />
    </div>
  );
}

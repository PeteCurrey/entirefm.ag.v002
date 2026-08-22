import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceHero } from '@/components/hero/HomeHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Sparkles, MapPin, Truck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function TemplateLocalService() {
  const breadcrumbs = [
    { name: 'Locations', url: '/locations' },
    { name: 'London', url: '/fm-london' },
    { name: 'Industrial Cleaning London', url: '/industrial-cleaning-london' },
  ];

  const londonCleaningCapabilities = [
    {
      name: 'London High-Level Warehouse & Structural Cleans',
      description: 'IPAF-certified high-access cleaning of distribution centres, trusses, purlins, and overhead lighting across Greater London industrial parks.',
      tag: 'IPAF / High Level',
    },
    {
      name: 'Factory Shutdown & Plant Room Degreasing',
      description: 'Out-of-hours intensive deep cleans, mechanical plant room degreasing, and industrial machinery decontamination.',
      tag: 'Plant & Degreasing',
    },
    {
      name: 'Confined Space & Extraction Duct Cleaning',
      description: 'Atmospheric-monitored extraction cleaning for commercial kitchens, food manufacturing, and industrial duct systems.',
      tag: 'Confined Space',
    },
    {
      name: 'Heavy Industrial Floor Scrubbing & Re-Sealing',
      description: 'Industrial ride-on scrubbers and chemical floor preparation across London logistics, fulfilment, and trade counter units.',
      tag: 'Floor Care',
    },
    {
      name: 'External Cladding & Pressure Jetting',
      description: 'Rotary hot-water surface cleaning and biocide washes for commercial building facades, loading bays, and service yards.',
      tag: 'Hot Water Jetting',
    },
    {
      name: 'Post-Construction Builder Handover Cleans',
      description: 'Rapid sparkle cleans, dust extraction, and glass detailing for newly completed commercial developments across London boroughs.',
      tag: 'Builder Sparkle',
    },
  ];

  const localCleaningFaqs = [
    {
      question: 'How do you handle London logistics and access constraints for heavy cleaning equipment?',
      answer: 'Our specialized London industrial cleaning fleet is 100% ULEZ-compliant and equipped for urban navigation. We coordinate local council pavement permits, loading bay access, and execute major works during off-peak and night shifts.'
    },
    {
      question: 'What London industrial districts and trade zones do you cover?',
      answer: 'We provide daily industrial cleaning teams across Park Royal, Enfield, Thames Gateway, Silvertown, Dagenham, Croydon, Heathrow freight corridors, and all Greater London industrial estates.'
    },
    {
      question: 'Do you provide out-of-hours or weekend shutdown cleaning in London?',
      answer: 'Yes. Over 80% of our London industrial and warehouse cleaning operations are conducted overnight or during weekend shutdowns to avoid disrupting daytime logistics and manufacturing.'
    },
  ];

  const relatedLinks = [
    { path: '/industrial-cleaning', label: 'Industrial Cleaning (National Overview)' },
    { path: '/fm-london', label: 'FM London (24/7 Rapid Response Hub)' },
    { path: '/facilities-management-london', label: 'Facilities Management London (Planned Maintenance)' },
    { path: '/commercial-cleaning-london', label: 'Commercial Office Cleaning London' },
    { path: '/logistics-facilities-management', label: 'Logistics & Warehousing FM' },
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
          title="Industrial Cleaning London"
          subtitle="Specialist factory deep cleans, high-level warehouse structural cleaning, plant shutdown hygiene, and industrial floor degreasing across Greater London & M25."
          category="London Specialist Cleaning Operations"
          bulletPoints={[
            '100% ULEZ-compliant mobile cleaning fleet & heavy extraction plant',
            'IPAF-certified high-access teams for warehouses, factories & logistics units',
            'Night shifts, weekend plant shutdowns & out-of-hours scheduling across London',
          ]}
          defaultService="Industrial Cleaning"
        />

        <TrustBar />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">London Industrial Hygiene</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Specialist Industrial Decontamination & Floor Care for London Estates
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Operating logistics hubs, manufacturing workshops, and trade facilities across Greater London requires cleaning contractors who understand heavy environmental contamination and urban site constraints. EntireFM delivers specialist industrial cleaning backed by certified access operators, industrial pressure washing plant, and rigorous RAMS compliance.
                  </p>
                </div>

                <CapabilityList
                  title="London Industrial Cleaning Capabilities"
                  subtitle="Delivered by certified teams utilizing heavy access machinery and industrial extraction equipment."
                  items={londonCleaningCapabilities}
                />

                {/* Key London Industrial Hubs Served */}
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    Key London Industrial Estates & Freight Hubs Covered
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Park Royal Industrial Estate (NW10)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Enfield & Lea Valley Logistics (EN3)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Thames Gateway & Dagenham (RM9)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Heathrow Cargo & Freight (TW6)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Croydon & Beddington Trade Parks (CR0)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Charlton & Greenwich Peninsula (SE7)</div>
                  </div>
                </div>

                <InlineCTA
                  title="Need an on-site London industrial cleaning survey?"
                  description="Our London surveyors conduct site assessments to confirm access equipment requirements, chemical specs, and out-of-hours scheduling."
                  buttonText="Request London Site Survey"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">London Compliance</span>
                  <h3 className="text-base font-bold text-white">Urban Health & Safety Protocols</h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">ULEZ & Congestion Compliant</strong>
                        <span className="text-slate-400">Direct fleet access across all central and outer London zones</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Comprehensive RAMS & COSHH</strong>
                        <span className="text-slate-400">Task-specific risk assessments provided prior to every shift</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <FAQAccordion faqs={localCleaningFaqs} />
        <RelatedLinks links={relatedLinks} title="Related London Facilities Management & Cleaning Pages" />

        <ProposalSection
          defaultLocation="London"
          defaultService="Industrial Cleaning"
          headline="Request an Industrial Cleaning Quotation for London"
          subheadline="Provide your facility location, square footage, and cleaning window for a prompt quotation and survey booking."
        />
      </main>
      <Footer />
    </div>
  );
}

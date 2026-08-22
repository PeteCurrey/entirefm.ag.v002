import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocationHero } from '@/components/hero/LocationHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA, PhoneCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Clock, ShieldAlert, Zap, Wrench, CheckCircle2, Phone, MapPin, Building } from 'lucide-react';

export function TemplatePrimaryLocation() {
  const breadcrumbs = [
    { name: 'Locations', url: '/locations' },
    { name: 'London Hub', url: '/fm-london' },
  ];

  const londonRapidCapabilities = [
    {
      name: '24/7 London Emergency Plant & Engineering Dispatch',
      description: 'Immediate technical helpdesk triage and mobile M&E engineering van dispatch across Zones 1–6 and the M25 corridor.',
      tag: '24/7 Callout',
    },
    {
      name: 'HVAC, Chiller & Boiler Breakdown Response',
      description: 'Rapid on-site troubleshooting and parts replacement for commercial heating, VRV air conditioning, and critical cooling failures.',
      tag: 'Critical Climate',
    },
    {
      name: 'Power Failure & Switchgear Emergency Support',
      description: 'Emergency NICEIC-certified electricians on call for commercial power outages, distribution fault finding, and generator activation.',
      tag: 'Emergency Power',
    },
    {
      name: 'Water Ingress, Pipe Bursts & Drainage Clearance',
      description: 'Rapid commercial plumbing triage, high-pressure water jetting, and emergency valve isolation for London commercial premises.',
      tag: 'Plumbing & Drainage',
    },
    {
      name: 'Access Control & Security Door Failures',
      description: 'Urgent repairs to electronic access gates, mag-locks, automated commercial entrances, and security shutters.',
      tag: 'Site Security',
    },
    {
      name: 'Post-Incident Rapid Cleaning & Decontamination',
      description: 'Emergency extraction, flood response, biohazard sanitisation, and rapid floor restoration for London offices and retail units.',
      tag: 'Rapid Cleaning',
    },
  ];

  const londonFaqs = [
    {
      question: 'What is EntireFM’s emergency callout SLA in Central London?',
      answer: 'Our dedicated London helpdesk operates 24/7/365. Contractual emergency callout windows are established based on site criticality (typically 2 to 4 hours for priority commercial accounts across Zones 1–4).'
    },
    {
      question: 'How do your mobile engineering vans navigate ULEZ and London traffic?',
      answer: 'Our entire London operations fleet is ULEZ-compliant, equipped with live GPS route tracking, and stocked with universal critical replacement components to resolve first-time fixes rapidly.'
    },
    {
      question: 'Do you cover outer London boroughs and the M25 ring?',
      answer: 'Yes. EntireFM deploys mobile engineers across all 32 London boroughs, the City of London, Canary Wharf, and adjacent Home Counties business parks along the M25 corridor.'
    },
    {
      question: 'How does /fm-london differ from your planned FM services in London?',
      answer: 'This page represents our rapid-response operations and emergency helpdesk infrastructure in London. For scheduled preventative maintenance (PPM) and statutory compliance scopes, explore our Facilities Management London hub.'
    },
  ];

  const relatedLinks = [
    { path: '/facilities-management-london', label: 'Facilities Management London (Planned Maintenance Hub)' },
    { path: '/london-facilities-management', label: 'London Facilities Management (Corporate & Managing Agents)' },
    { path: '/london-facilities-management-areas', label: 'London Coverage Areas & Borough Directory' },
    { path: '/commercial-cleaning-london', label: 'Commercial Office Cleaning London' },
    { path: '/industrial-cleaning-london', label: 'Industrial & Specialist Cleaning London' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London Services' },
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

        {/* Rapid-Response / Operations-First Hero */}
        <LocationHero
          city="London"
          title="FM London — 24/7 Facilities Management & Emergency Engineering"
          subtitle="High-availability mobile engineering teams, 24/7 helpdesk dispatch, and emergency plant maintenance across Central London, City, Canary Wharf, and all 32 boroughs."
          badge="24/7 Rapid Response & Operations Hub"
          coverageZones="Zones 1–6, City of London & M25 Corridor"
          responseSLA="Priority Emergency Callout [SLA TO VERIFY]"
          intentVariant="rapid-response"
        />

        <TrustBar />

        {/* Operational Triage Banner */}
        <div className="bg-brand-charcoal text-white py-6 border-b border-brand-border-dark">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Live London Operations Desk</span>
                  <span className="text-sm text-slate-200">Mobile engineering vans on call across Greater London & Home Counties</span>
                </div>
              </div>
              <a href="tel:0800000000" className="btn-phone text-xs py-2 px-4 shrink-0">
                <Phone className="w-3.5 h-3.5" />
                <span>Call London Helpdesk: [PHONE TO VERIFY]</span>
              </a>
            </div>
          </div>
        </div>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">High-Availability Operations</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    London Commercial Property Maintenance & Critical Engineering
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Operating commercial property in London demands immediate responsiveness. A boiler breakdown, cooling outage during peak summer, or electrical fault cannot wait for delayed multi-tier subcontracts. EntireFM delivers direct engineering triage and dedicated van packs to solve building emergencies fast.
                  </p>
                </div>

                <CapabilityList
                  title="London Rapid-Response & Reactive Scope"
                  subtitle="Delivered by mobile certified engineers equipped for fast first-time resolution."
                  items={londonRapidCapabilities}
                />

                {/* London Borough Coverage Grid */}
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    Key London Commercial Districts Covered Daily
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                    <div className="p-2 bg-white border border-brand-border rounded-sm">City of London & EC Postal</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Canary Wharf & Docklands (E14)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">West End & Mayfair (W1)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">South Bank & London Bridge (SE1)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Park Royal & West London (NW10)</div>
                    <div className="p-2 bg-white border border-brand-border rounded-sm">Croydon & South London Hubs</div>
                  </div>
                </div>

                <InlineCTA
                  title="Need an emergency callout or London maintenance contract?"
                  description="Consult directly with our London operations team for urgent site dispatch or structured commercial maintenance SLAs."
                  buttonText="Contact London Team"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">London Operations Factsheet</span>
                  <h3 className="text-base font-bold text-white">Why London Estate Managers Choose EntireFM</h3>
                  <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response SLA:</span>
                      <span className="text-brand-gold font-semibold">[2-4 Hr Central London]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fleet Standard:</span>
                      <span className="text-white font-semibold">100% ULEZ Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Helpdesk:</span>
                      <span className="text-white font-semibold">24/7 In-House Operations</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CAFM Access:</span>
                      <span className="text-white font-semibold">Live Job Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <FAQAccordion faqs={londonFaqs} />
        <RelatedLinks links={relatedLinks} title="Explore EntireFM’s Interconnected London Estate" />

        <ProposalSection
          defaultLocation="London (Zones 1-6)"
          defaultService="Total Facilities Management"
          headline="Request a London Facilities Management Proposal"
          subheadline="Speak with our London operations director regarding your commercial building maintenance, rapid callout contracts, or plant audits."
        />
      </main>
      <Footer />
    </div>
  );
}

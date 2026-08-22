import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Building2, Award, Users, Shield, ArrowRight, CheckCircle2, Briefcase, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export function TemplateThirdLocation() {
  const breadcrumbs = [
    { name: 'Locations', url: '/locations' },
    { name: 'London', url: '/fm-london' },
    { name: 'London Facilities Management', url: '/london-facilities-management' },
  ];

  const corporateLondonServices = [
    {
      name: 'Managing Agent & Commercial Landlord Partnerships',
      description: 'Dedicated estate governance, service charge budget management, transparent auditing, and RICS-aligned compliance reporting for property managers.',
      tag: 'Managing Agents',
    },
    {
      name: 'Corporate Headquarters & Prime Office FM',
      description: 'Discreet, high-standard building engineering, executive meeting room audio-visual support, premium janitorial, and concierge services.',
      tag: 'Corporate HQs',
    },
    {
      name: 'Front-of-House Concierge & Security Services',
      description: 'SIA-licensed corporate receptionists, visitor management protocols, access control administration, and executive security guarding.',
      tag: 'Front of House',
    },
    {
      name: 'Tenant Experience & Helpdesk Integration',
      description: 'White-label tenant portals, rapid ticket resolution workflows, and proactive communication to protect landlord-tenant relationships.',
      tag: 'Tenant Experience',
    },
    {
      name: 'Building Lifecycle & Dilapidations Advisory',
      description: 'Plant room asset condition reports, capital expenditure planning, leasehold handover dilapidations, and tenant fit-out approvals.',
      tag: 'Asset Advisory',
    },
    {
      name: 'ESG, NABERS & Sustainability Tracking',
      description: 'Energy efficiency audits, smart BMS monitoring, recycling management, and sustainable cleaning product deployment.',
      tag: 'ESG & Sustainability',
    },
  ];

  const corporateLondonFaqs = [
    {
      question: 'How does EntireFM support London commercial managing agents and landlords?',
      answer: 'We act as the trusted single-point operational partner for managing agents. We provide transparent service charge cost allocations, real-time CAFM reporting, and ensure all properties under management remain strictly compliant with statutory legislation.'
    },
    {
      question: 'Do you provide white-label tenant communication and helpdesk portals?',
      answer: 'Yes. For managing agents and institutional landlords, our CAFM system and tenant helpdesk can be white-labeled with your property or agency branding, providing seamless tenant reporting.'
    },
    {
      question: 'What types of London commercial properties do you manage?',
      answer: 'We manage multi-let prime office developments in Mayfair and the City, tech and creative campuses in Shoreditch, corporate headquarters in Canary Wharf, and mixed-use commercial developments across Greater London.'
    },
    {
      question: 'How does /london-facilities-management differ from /fm-london and /facilities-management-london?',
      answer: 'This page is dedicated to corporate real estate, commercial managing agents, and institutional landlords seeking portfolio-level governance and premium tenant experiences. /fm-london addresses 24/7 reactive emergency engineering, while /facilities-management-london covers technical SFG20 PPM delivery.'
    },
  ];

  const relatedLinks = [
    { path: '/fm-london', label: 'FM London (24/7 Rapid Emergency Response)' },
    { path: '/facilities-management-london', label: 'Facilities Management London (PPM & Compliance Hub)' },
    { path: '/commercial-facilities-management', label: 'Commercial Property Facilities Management' },
    { path: '/property-manager-fm-services', label: 'Property Manager & Managing Agent Services' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London' },
    { path: '/concierge-services', label: 'Front of House & Concierge Services' },
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

        {/* Corporate Real Estate & Managing Agent Hero */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-gold">
                  <Briefcase className="w-3.5 h-3.5" />
                  Corporate Real Estate & Managing Agents
                </span>
                <span className="badge-dark text-slate-300">
                  Prime London Portfolios
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                London Facilities Management — Strategic Estate Governance & Managing Agent Solutions
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                High-standard facilities management, executive building services, and transparent property compliance engineered for managing agents, corporate headquarters, and institutional landlords across London.
              </p>

              {/* Corporate Key Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-mono text-slate-200">
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Managing Agent Focus</strong>
                  <span>Transparent service charge accounting</span>
                </div>
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Tenant Experience</strong>
                  <span>White-glove concierge & reception</span>
                </div>
                <div className="p-3 bg-brand-charcoal border border-brand-border-dark rounded-sm">
                  <strong className="text-brand-gold block text-sm mb-1">Portfolio Governance</strong>
                  <span>Live CAFM compliance & ESG data</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold">
                  Request Portfolio Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/facilities-management-london" className="btn-outline-white py-3 px-5 text-xs font-semibold">
                  View Technical PPM Framework →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Corporate Content Body */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="badge-technical">Prime Estate Governance</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    Protecting Asset Value & Elevating Tenant Experience in London Properties
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    Prime London commercial property requires more than basic maintenance contractor check-ins. Landlords, asset managers, and commercial managing agents require strategic operational partners who safeguard capital building values, ensure seamless tenant satisfaction, and maintain total statutory compliance.
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    EntireFM combines high-calibre engineering with front-of-house excellence, offering transparent reporting, RICS-aligned service charge accountability, and dedicated account management.
                  </p>
                </div>

                <CapabilityList
                  title="Corporate & Managing Agent Scope"
                  subtitle="Professional facilities governance designed for London commercial landlords and property directors."
                  items={corporateLondonServices}
                />

                <InlineCTA
                  title="Managing a London commercial property portfolio?"
                  description="Consult with our corporate estates team to discuss multi-site service level agreements, tenant portal integration, and service charge cost optimization."
                  buttonText="Request Managing Agent Review"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Governance Highlights</span>
                  <h3 className="text-base font-bold text-white">The EntireFM Advantage for London Landlords</h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Service Charge Transparency</strong>
                        <span>Granular, auditable cost breakdowns</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Dedicated Key Account Manager</strong>
                        <span>Monthly governance meetings & KPI reporting</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Zero-Advisory Audit Standards</strong>
                        <span>Full insurer compliance verification</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <FAQAccordion faqs={corporateLondonFaqs} />
        <RelatedLinks links={relatedLinks} title="Explore EntireFM’s Interconnected London Estate" />

        <ProposalSection
          defaultLocation="London (Corporate Portfolio)"
          defaultService="Total Facilities Management"
          headline="Request a Managing Agent or Corporate FM Review"
          subheadline="Let our corporate estates team structure a comprehensive, transparent management framework for your London commercial property portfolio."
        />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, TrendingUp, Building2, Wrench, Cpu, Users, Award, ShieldCheck } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/partner-with-entirefm', {
  title: 'Partner with EntireFM | Contractor & Supplier Opportunities | EntireFM',
  description:
    'Discover commercial opportunities for contractors, regional SMEs, OEMs, and technology providers with EntireFM. Access recurring planned maintenance and transparent digital workflows.',
});

export default function PartnerWithEntireFMPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner with EntireFM', url: '/suppliers/partner-with-entirefm' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUPPLIER RECRUITMENT // COMMERCIAL OPPORTUNITIES"
          title="Better suppliers deserve"
          subtitle="better partnerships."
          intro="EntireFM provides high-calibre contractors, regional SMEs, manufacturers, and technology innovators with consistent commercial volume, structured digital instructions, and transparent operational relationships."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM commercial directors discussing supplier partnership agreements"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Work', href: '/suppliers/how-we-work' }}
          facts={[
            { figure: 'Recurring Volume', label: 'Planned Maintenance', detail: 'SFG20 maintenance schedules' },
            { figure: 'Prompt Terms', label: 'Validated Invoicing', detail: 'Transparent electronic payment' },
            { figure: 'Preferred Tier', label: 'Strategic Progression', detail: 'Exclusivity on managed estates' },
          ]}
        />

        <TrustBar />

        {/* 1. WHY WORK WITH ENTIREFM */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">COMMERCIAL ADVANTAGES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Why High-Performing Suppliers Choose EntireFM
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We believe supply chains should be valued partners, not commoditised vendors. We eliminate administrative friction through clear digital scoping and reliable payment terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Recurring Planned Maintenance (PPM)',
                  desc: 'Predictable maintenance schedules across commercial, industrial, healthcare, and education portfolios with locked attendance dates.',
                  icon: Wrench,
                },
                {
                  title: 'Structured Reactive Work Orders',
                  desc: 'Clear work scopes, verified asset histories, precise site access requirements, and pre-authorised spending limits.',
                  icon: Building2,
                },
                {
                  title: 'Fast & Transparent Payment Cycles',
                  desc: 'Eliminate payment disputes with automated CAFM milestone approvals and pre-validated digital invoice workflows.',
                  icon: TrendingUp,
                },
                {
                  title: 'Regional SME Empowerment',
                  desc: 'We actively champion regional craft and specialist SMEs. You do not need nationwide depots to partner with us.',
                  icon: Users,
                },
                {
                  title: 'Preferred & Strategic Tiering',
                  desc: 'High-performing suppliers receive priority dispatch, increased contract volume, and regional exclusivity.',
                  icon: Award,
                },
                {
                  title: 'Innovation & OEM Integration',
                  desc: 'Direct channels for manufacturers and technology providers to deploy equipment and sensor telemetry across live estates.',
                  icon: Cpu,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-light text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. WHO WE WORK WITH */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">NETWORK ARCHITECTURE</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Who We Work With
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Our supplier ecosystem is deliberately diverse. We partner across five distinct operator categories:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  category: 'Regional Specialist SMEs',
                  role: 'Local craft, fast response, and deep geographical knowledge for HVAC, electrical, plumbing, fabric, and cleaning.',
                  tags: ['HVAC Contractors', 'M&E Specialists', 'Commercial Glaziers', 'Grounds & Landscaping'],
                },
                {
                  category: 'National Service Providers',
                  role: 'Large-scale multi-site coverage for specialised disciplines requiring unified UK management.',
                  tags: ['National Fire & Security', 'Water Treatment', 'Waste Management', 'Lifting & Cranes'],
                },
                {
                  category: 'Equipment Manufacturers & OEMs',
                  role: 'Direct OEM engineering support for chillers, boilers, switchgear, generators, and building control hardware.',
                  tags: ['Chiller Manufacturers', 'Boiler OEMs', 'BMS Control Vendors', 'Pump Manufacturers'],
                },
                {
                  category: 'Specialist Access & Inspection',
                  role: 'High-risk and complex access contractors delivering certified façade, rope access, and statutory inspections.',
                  tags: ['IRATA Rope Access', 'BMU Cradle Engineers', 'Pressure Vessel Surveyors', 'Asbestos Specialists'],
                },
                {
                  category: 'Technology & IoT Innovators',
                  role: 'Smart sensor developers, energy monitoring platforms, drone survey teams, and AI diagnostic platforms.',
                  tags: ['Vibration Sensor IoT', 'Thermal Drone Surveys', 'Energy Telemetry', 'AI CAFM Integrations'],
                },
                {
                  category: 'Sustainability & Circular Providers',
                  role: 'Renewable energy specialists, EV charge point installers, waste diversion providers, and social enterprises.',
                  tags: ['Solar PV Maintenance', 'EV Infrastructure', 'Zero-to-Landfill Waste', 'Social Value Providers'],
                },
              ].map((group, idx) => (
                <div key={idx} className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4">
                  <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-light">
                    PARTNER CATEGORY 0{idx + 1}
                  </span>
                  <h3 className="text-base font-light text-slate-900">{group.category}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{group.role}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
                    {group.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[11px] font-light bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark">
          <div className="container-custom max-w-4xl text-center space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-electric-bright">
              APPLICATION INTAKE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">
              Start Your Supplier Application Today
            </h2>
            <p className="text-sm sm:text-base text-brand-mist/80 font-light max-w-2xl mx-auto leading-relaxed">
              Complete our initial online qualification. Our supply chain governance team will review your trade scope and guide you through Stage 2 onboarding.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Apply for Approved Status <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/vetting" className="btn-ghost-light">
                Review Vetting Standards
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

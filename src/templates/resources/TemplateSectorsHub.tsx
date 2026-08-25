import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import Link from 'next/link';
import {
  Factory,
  Building2,
  Truck,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Hotel,
  Home,
  HardHat,
  Plane,
  Fuel,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  HelpCircle,
  Layers,
  Wrench,
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateSectorsHubProps {
  route: RouteRecord;
  content: ContentRecord;
}

const PRIMARY_SECTORS = [
  {
    title: 'Industrial & Manufacturing',
    path: '/industrial-facilities-management',
    icon: Factory,
    summary:
      'Continuous production uptime, heavy electrical switchgear, high-load plant reliability, and strict permit-to-work governance.',
    priorities: ['Production line continuity', 'Plant & boiler reliability', 'Permit-to-work compliance', 'Shutdown PPM cycles'],
    keyServices: ['Mechanical & Electrical', 'PPM Schedules', 'HVAC & Process Cooling', 'Industrial Cleaning'],
    badge: 'Heavy Plant & Production',
  },
  {
    title: 'Commercial Offices & Corporate',
    path: '/commercial-facilities-management',
    icon: Building2,
    summary:
      'Multi-tenant HVAC zoning, workplace presentation, front-of-house comfort, out-of-hours works, and transparent landlord-tenant reporting.',
    priorities: ['Tenant comfort & air balance', 'Workplace hygiene & presentation', 'Out-of-hours servicing', 'EICR & fire compliance'],
    keyServices: ['Commercial HVAC', 'Building Maintenance', 'Fixed Wire EICR', 'Office Cleaning'],
    badge: 'Multi-Tenant & Corporate',
  },
  {
    title: 'Logistics & Warehousing',
    path: '/logistics-facilities-management',
    icon: Truck,
    summary:
      'High-throughput distribution hubs, dock leveller servicing, roller shutter maintenance, high-bay lighting, and 24/7 yard resilience.',
    priorities: ['Dock & shutter availability', 'High-bay electrical lighting', '24/7 reactive fault cover', 'Asset condition tracking'],
    keyServices: ['Fabric & Door Maintenance', 'High-Bay Electrical', 'HVAC & Heating', 'Statutory Audits'],
    badge: '24/7 Distribution Hubs',
  },
  {
    title: 'Retail & Shopping Centres',
    path: '/retail-facilities-management',
    icon: ShoppingBag,
    summary:
      'Public realm footfall, store trading hours protection, multi-site PPM consistency, customer-facing HVAC, and rapid fault triage.',
    priorities: ['Trading hours protection', 'Customer comfort & safety', 'Multi-site PPM schedules', 'Rapid reactive attendance'],
    keyServices: ['Planned Maintenance (PPM)', 'Air Conditioning', 'Electrical Repairs', 'Building Fabric'],
    badge: 'Multi-Site Retail Estates',
  },
];

const SECONDARY_SECTORS = [
  {
    title: 'Education & Universities',
    path: '/education-facilities-management',
    icon: GraduationCap,
    desc: 'Campus estates, term-time constraints, seasonal boiler shutdowns, and strict statutory water hygiene.',
  },
  {
    title: 'Healthcare Facilities',
    path: '/healthcare-facilities-management',
    icon: HeartPulse,
    desc: 'Non-clinical commercial infrastructure, standby power distribution, medical gas plant support, and water safety.',
  },
  {
    title: 'Hotels & Hospitality',
    path: '/hotel-facilities-management',
    icon: Hotel,
    desc: '24/7 guest comfort, continuous hot water generation, kitchen extraction support, and unobtrusive maintenance.',
  },
  {
    title: 'Residential Property & PRS',
    path: '/residential-facilities-management',
    icon: Home,
    desc: 'Communal areas, central heating plant, access control, emergency lighting, and resident-safe PPM.',
  },
  {
    title: 'Warehousing & Storage',
    path: '/warehouse-facilities-management',
    icon: Truck,
    desc: 'High-level roof maintenance, LEV ventilation, distribution yards, and statutory switchgear testing.',
  },
  {
    title: 'Construction & Handover',
    path: '/construction-facilities-management',
    icon: HardHat,
    desc: 'Post-completion FM, snagging remediation, asset tagging, and O&M documentation onboarding.',
  },
  {
    title: 'Arenas & Leisure Venues',
    path: '/arena-facilities-management',
    icon: Dumbbell,
    desc: 'High-occupancy event surges, public area cleaning, rapid turnaround, and emergency plant standby.',
  },
  {
    title: 'Airport Commercial Facilities',
    path: '/airport-facilities-management',
    icon: Plane,
    desc: 'Landside commercial offices, retail logistics, passenger concourses, and specialized contractor management.',
  },
];

export function TemplateSectorsHub({ route, content }: TemplateSectorsHubProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Sectors', url: '/sectors' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        <PageHero
          eyebrow="Specialist Facilities Management by Sector"
          title="Facilities Management Engineered for Your Estate"
          intro="Different commercial environments face radically different operational, compliance, and occupant demands. EntireFM structures Hard FM, Planned Maintenance (PPM), and building support around the precise operational realities of your sector."
          path={route.path}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss your estate', href: '#enquiry' }}
          facts={[
            { figure: 'Tailored', label: 'Service frameworks aligned with site operating hours and access windows' },
            { figure: 'Governed', label: 'Mandatory statutory compliance and digital certification on every job' },
            { figure: 'Single Contract', label: 'Unified Hard & Soft FM accountability across regional and national estates' },
          ]}
        />

        <TrustBar />

        {/* Primary Focus Sectors */}
        <section className="py-16 sm:py-20 bg-brand-surface border-b border-brand-edge">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl">
              <span className="badge-technical">Core Sectors</span>
              <h2 className="text-display-sm text-brand-graphite mt-3">
                Core Commercial &amp; Industrial Sectors
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore in-depth operational blueprints, maintenance scopes, and procurement guidance for the UK’s primary commercial estate types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PRIMARY_SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <div
                    key={sector.path}
                    className="flex flex-col justify-between bg-white rounded-sm border border-brand-edge p-8 hover:border-brand-electric/50 transition-all duration-300 shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="w-12 h-12 rounded-sm bg-brand-surface flex items-center justify-center text-brand-electric group-hover:bg-brand-electric group-hover:text-white transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-silver font-light bg-brand-surface px-2.5 py-1 rounded">
                          {sector.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-light text-brand-graphite group-hover:text-brand-electric transition-colors">
                        <Link href={sector.path}>{sector.title}</Link>
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {sector.summary}
                      </p>

                      <div className="mt-6 pt-6 border-t border-brand-edge grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-silver block font-light">
                            Operational Priorities
                          </span>
                          <ul className="mt-2 space-y-1.5">
                            {sector.priorities.map((p, idx) => (
                              <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-brand-electric shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-silver block font-light">
                            Key Services
                          </span>
                          <ul className="mt-2 space-y-1.5">
                            {sector.keyServices.map((s, idx) => (
                              <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-brand-edge flex items-center justify-between">
                      <Link
                        href={sector.path}
                        className="inline-flex items-center gap-2 text-xs font-normal text-brand-electric hover:text-brand-graphite transition-colors uppercase tracking-wider"
                      >
                        Explore {sector.title} Blueprint <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wider Sectors Directory */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl">
              <span className="badge-technical">Complete Directory</span>
              <h2 className="text-display-sm text-brand-graphite mt-3">
                Specialist Estate Sectors We Support
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                From academic campuses to logistics hubs and hotel estates, EntireFM delivers disciplined facilities management tailored to your specific environment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SECONDARY_SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Link
                    key={sector.path}
                    href={sector.path}
                    className="p-6 rounded-sm border border-brand-edge bg-brand-surface hover:bg-white hover:border-brand-electric/40 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-sm bg-white border border-brand-edge flex items-center justify-center text-brand-graphite group-hover:text-brand-electric transition-colors mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-normal text-brand-graphite group-hover:text-brand-electric transition-colors">
                        {sector.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {sector.desc}
                      </p>
                    </div>
                    <span className="mt-4 pt-3 border-t border-brand-edge/60 inline-flex items-center gap-1.5 text-[11px] font-normal text-brand-silver group-hover:text-brand-electric transition-colors">
                      View Sector <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Procurement Guidance & Interactive Tools Banner */}
        <section className="py-14 bg-brand-carbon text-white border-y border-brand-edge-dark">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-light">
                  PROCUREMENT &amp; TENDER PLANNING
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-white">
                  Preparing an FM Tender or Reviewing Provision?
                </h2>
                <p className="text-sm text-brand-mist/70 leading-relaxed max-w-2xl">
                  Use EntireFM’s free procurement guides and interactive specification tools to structure estate data, define maintenance scopes, and establish realistic KPIs before issuing invitations to tender.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/resources/guides/fm-tender-guide"
                    className="inline-flex items-center gap-2 text-xs font-normal text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded border border-zinc-700 transition-colors"
                  >
                    <ClipboardList className="w-4 h-4 text-emerald-400" /> Read FM Tender Guide
                  </Link>
                  <Link
                    href="/tools/tender-brief"
                    className="inline-flex items-center gap-2 text-xs font-normal text-white bg-brand-electric hover:bg-brand-electric-bright px-4 py-2.5 rounded transition-colors"
                  >
                    <FileCheck2 className="w-4 h-4" /> Open Tender Brief Generator
                  </Link>
                </div>
              </div>

              <div className="bg-brand-graphite/60 border border-brand-edge-dark rounded p-6 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-brand-silver font-light">
                  Buyer Resources Available
                </h3>
                <ul className="space-y-2 text-xs text-brand-mist/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>SFG20-aligned PPM schedule builder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Statutory compliance calendar &amp; intervals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Asset condition register guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Mobilisation &amp; provider transition blueprint</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Accreditations */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultService="Sector Facilities Management"
          headline="Discuss Facilities Management for Your Estate"
          subheadline="Speak with our sector specialists. We develop comprehensive operational proposals and maintenance schedules tailored to your precise estate requirements."
        />
      </main>
      <Footer />
    </div>
  );
}

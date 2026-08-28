'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { SectorFinalCTA } from '@/components/sectors/SectorFinalCTA';
import Link from 'next/link';
import Image from 'next/image';
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
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  ChevronRight,
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
    image: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    summary:
      'Continuous production uptime, heavy electrical switchgear, high-load plant reliability, and strict permit-to-work governance.',
    priorities: ['Shift-pattern aligned PPM', 'Main HV/LV distribution', 'Statutory LEV compliance', 'LOTO safety governance'],
    badge: 'Heavy Plant & Production',
  },
  {
    title: 'Commercial Offices & Corporate',
    path: '/commercial-facilities-management',
    icon: Building2,
    image: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    summary:
      'Multi-tenant HVAC zoning, workplace presentation, front-of-house comfort, out-of-hours works, and transparent landlord-tenant reporting.',
    priorities: ['Zoned VRV/VRF balancing', 'Pristine common parts', 'Discreet out-of-hours works', 'RICS service charge audit'],
    badge: 'Multi-Tenant & Corporate',
  },
  {
    title: 'Logistics & Warehousing',
    path: '/logistics-facilities-management',
    icon: Truck,
    image: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    summary:
      'High-throughput distribution hubs, dock leveller servicing, roller shutter maintenance, high-bay lighting, and 24/7 yard resilience.',
    priorities: ['Dock & shutter uptime', 'High-bay lighting at 15m', '24/7 emergency response', 'Yard interceptors & gritting'],
    badge: '24/7 Distribution Hubs',
  },
  {
    title: 'Retail & Shopping Centres',
    path: '/retail-facilities-management',
    icon: ShoppingBag,
    image: '/images/editorial/entirefm-access-control-install-2000w.webp',
    summary:
      'Public realm footfall, store trading hours protection, multi-site PPM consistency, customer-facing HVAC, and rapid fault triage.',
    priorities: ['Zero trading disruption', 'Customer comfort cooling', 'Multi-site PPM schedules', 'Automatic entrance safety'],
    badge: 'Multi-Site Retail Estates',
  },
];

const SECONDARY_SECTORS = [
  {
    title: 'Education & Universities',
    path: '/education-facilities-management',
    icon: GraduationCap,
    desc: 'Campus estates, term-time quiet windows, seasonal boiler shutdowns, and strict safeguarding compliance.',
  },
  {
    title: 'Healthcare Facilities',
    path: '/healthcare-facilities-management',
    icon: HeartPulse,
    desc: 'Clinical infrastructure, HTM 03-01 specialized ventilation, standby power distribution, and HTM 04-01 water safety.',
  },
  {
    title: 'Hotels & Hospitality',
    path: '/hotel-facilities-management',
    icon: Hotel,
    desc: '24/7 guest comfort, continuous hot water generation, TR19 kitchen extraction, and unobtrusive midday maintenance.',
  },
  {
    title: 'Residential Property & PRS',
    path: '/residential-facilities-management',
    icon: Home,
    desc: 'Communal energy centres, HIUs, Building Safety Act Golden Thread records, and resident emergency helpdesk.',
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
    desc: 'Post-completion FM, sparkle cleans, barcode asset tagging, and O&M documentation onboarding.',
  },
  {
    title: 'Arenas & Leisure Venues',
    path: '/arena-facilities-management',
    icon: Dumbbell,
    desc: 'High-occupancy event surges, public area cleaning, dark-day PPM sprints, and pre-event safety sign-offs.',
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* Cinematic Hero */}
        <section className="relative min-h-[65vh] lg:min-h-[72vh] flex flex-col justify-between bg-slate-950 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-totem-headquarters-2000w.webp"
              alt="EntireFM national commercial facilities management and estates engineering"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.38] contrast-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
          </div>

          <div className="relative z-10 pt-24 sm:pt-28 pb-4">
            <div className="container-custom">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-slate-400">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-600">/</span>}
                    {idx === breadcrumbs.length - 1 ? (
                      <span className="text-slate-200 font-normal">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.url} className="hover:text-white transition-colors">
                        {crumb.name}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>

          <div className="relative z-10 py-12 sm:py-16 my-auto">
            <div className="container-custom">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-300">
                    SECTOR FACILITIES MANAGEMENT BLUEPRINTS
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
                  Facilities management engineered around how your estate operates.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                  Different commercial environments face radically different operational, compliance, and occupant demands. EntireFM structures Hard FM, Planned Preventative Maintenance (PPM), and building services around the operational reality of your sector.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#core-sectors"
                    className="inline-flex items-center gap-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-medium uppercase tracking-wider px-7 py-3.5 rounded-sm shadow-md transition-all"
                  >
                    <span>Explore Sector Blueprints</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/75 backdrop-blur-sm py-4">
            <div className="container-custom">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
                <div className="py-2 sm:py-0 sm:px-6 first:pl-0 flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-[11px] font-light uppercase tracking-wider text-slate-400">PPM Standard:</span>
                  <span className="text-xs font-normal text-white">SFG20 Aligned</span>
                </div>
                <div className="py-2 sm:py-0 sm:px-6 flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-[11px] font-light uppercase tracking-wider text-slate-400">Response SLA:</span>
                  <span className="text-xs font-normal text-white">Contracted Priority</span>
                </div>
                <div className="py-2 sm:py-0 sm:px-6 flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-[11px] font-light uppercase tracking-wider text-slate-400">Governance:</span>
                  <span className="text-xs font-normal text-white">EntireCAFM Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Primary Focus Sectors Grid */}
        <section id="core-sectors" className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-14">
            <div className="max-w-3xl space-y-3.5">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
                  CORE SECTOR BLUEPRINTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Specialist Estate Operating Models
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Explore in-depth operational blueprints, maintenance scopes, risk mitigation casebooks, and statutory guidance for the UK’s primary commercial estate types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PRIMARY_SECTORS.map((sector) => {
                return (
                  <div
                    key={sector.path}
                    className="flex flex-col justify-between bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm hover:border-brand-pink/50 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Visual Photographic Band */}
                    <div className="relative aspect-[16/8] w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={sector.image}
                        alt={sector.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-[0.85]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[10.5px] uppercase tracking-wider text-brand-pink-light font-medium bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                          {sector.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-7 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors tracking-tight">
                          <Link href={sector.path}>{sector.title}</Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                          {sector.summary}
                        </p>

                        <div className="pt-4 border-t border-slate-100 space-y-2">
                          <span className="text-[10.5px] uppercase tracking-wider text-slate-400 block font-medium">
                            Operational Priorities:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sector.priorities.map((p, idx) => (
                              <li key={idx} className="text-xs text-slate-700 font-light flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-100">
                        <Link
                          href={sector.path}
                          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-900 group-hover:text-brand-pink transition-colors"
                        >
                          <span>Explore {sector.title} Blueprint</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wider Sectors Directory */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
                  COMPLETE SECTORS DIRECTORY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900">
                Specialist Facilities Environments We Support
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                From academic campuses to logistics hubs and hotel estates, EntireFM delivers disciplined facilities management tailored to your specific building environment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SECONDARY_SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Link
                    key={sector.path}
                    href={sector.path}
                    className="p-6 rounded-sm border border-slate-200 bg-[#FAF9FB] hover:bg-white hover:border-brand-pink/50 transition-all duration-200 group flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-sm bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-brand-pink group-hover:border-brand-pink/30 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors tracking-tight">
                        {sector.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {sector.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-light text-slate-500 group-hover:text-slate-900">
                      <span>View Blueprint</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tender Planning Banner */}
        <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="bg-slate-950 text-white rounded-sm p-8 sm:p-12 border border-slate-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
                    Procurement &amp; Tender Planning
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  Preparing an FM Tender or Reviewing Provision?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Use our free procurement guides and interactive specification tools to structure estate asset registers, define maintenance scopes, and establish realistic SLAs before issuing invitations to tender.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/resources/guides/fm-tender-guide"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-sm border border-slate-700 transition-colors whitespace-nowrap"
                >
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  <span>FM Tender Guide</span>
                </Link>
                <Link
                  href="/tools/tender-brief"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 px-5 py-3 rounded-sm shadow-sm transition-all whitespace-nowrap"
                >
                  <FileCheck2 className="w-4 h-4 text-brand-pink" />
                  <span>Tender Brief Generator</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Accreditations */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <SectorFinalCTA
          serviceName="Sector Facilities Management"
          headline="Discuss Facilities Management for Your Estate"
          subline="Speak directly with EntireFM technical directors. We develop comprehensive operational proposals and maintenance schedules tailored to your precise estate requirements."
        />
      </main>

      <Footer />
    </div>
  );
}

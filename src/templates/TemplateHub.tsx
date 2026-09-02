'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { PageHero } from '@/components/hero/PageHero';
import { SectorSnapshot } from '@/components/sectors/SectorSnapshot';
import { PostcodeCoverageLookup } from '@/components/locations/PostcodeCoverageLookup';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import Link from 'next/link';
import { ArrowRight, MapPin, ChevronRight, CheckCircle2, ShieldCheck, Building, Wrench } from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { ALL_ROUTES } from '@/lib/routes/route-registry';
import { loadContentRecord } from '@/content';

interface HubItem {
  title: string;
  path: string;
  category?: string;
  description: string;
  tag?: string;
}

interface TemplateHubProps {
  route: RouteRecord;
  content: ContentRecord;
  hubType?: 'services' | 'sectors' | 'locations' | 'case-studies' | 'general';
  items?: HubItem[];
}

const REGIONS = [
  {
    name: 'Greater London & South East',
    cities: [
      {
        name: 'London',
        slug: 'london',
        desc: 'Multi-tenant commercial offices, retail campuses, prime residential and corporate estates across Greater London and the M25.',
        routes: [
          { label: 'Facilities Management London', path: '/facilities-management-london' },
          { label: 'Outsourced FM London', path: '/fm-london' },
          { label: 'Multi-Site Estate FM', path: '/london-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-london' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-london' },
        ],
      },
      {
        name: 'Oxford',
        slug: 'oxford',
        desc: 'Science parks, biotechnology cleanrooms, academic research estates and commercial headquarters.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-oxford' },
          { label: 'Planned Maintenance', path: '/facilities-management-oxford' },
          { label: 'Commercial FM', path: '/oxford-facilities-management' },
        ],
      },
    ],
  },
  {
    name: 'North West & Greater Manchester',
    cities: [
      {
        name: 'Manchester',
        slug: 'manchester',
        desc: 'Grade A commercial offices, Trafford Park manufacturing and logistics, media hubs and city-centre portfolios.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-manchester' },
          { label: 'Planned Maintenance', path: '/facilities-management-manchester' },
          { label: 'Commercial Estates', path: '/manchester-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-manchester' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-manchester' },
        ],
      },
      {
        name: 'Liverpool',
        slug: 'liverpool',
        desc: 'Waterfront commercial developments, port logistics, life-science estates and retail public realm.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-liverpool' },
          { label: 'Planned Maintenance', path: '/facilities-management-liverpool' },
          { label: 'Commercial Estates', path: '/liverpool-facilities-management' },
        ],
      },
      {
        name: 'Bolton',
        slug: 'bolton',
        desc: 'Manufacturing, logistics and retail business park facilities across the northern conurbation.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-bolton' },
          { label: 'Planned Maintenance', path: '/facilities-management-bolton' },
          { label: 'Commercial FM', path: '/bolton-facilities-management' },
        ],
      },
      {
        name: 'Bury',
        slug: 'bury',
        desc: 'Industrial manufacturing, trade estates and town-centre commercial property along the M66 corridor.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-bury' },
          { label: 'Planned Maintenance', path: '/facilities-management-bury' },
          { label: 'Commercial FM', path: '/bury-facilities-management' },
        ],
      },
      {
        name: 'Preston',
        slug: 'preston',
        desc: 'Central Lancashire aerospace, university campuses and M6 distribution networks.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-preston' },
          { label: 'Planned Maintenance', path: '/facilities-management-preston' },
          { label: 'Commercial FM', path: '/preston-facilities-management' },
        ],
      },
      {
        name: 'Wigan',
        slug: 'wigan',
        desc: 'Food processing, cold-chain distribution and industrial manufacturing along the M6/M58.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-wigan' },
          { label: 'Planned Maintenance', path: '/facilities-management-wigan' },
          { label: 'Commercial FM', path: '/wigan-facilities-management' },
        ],
      },
    ],
  },
  {
    name: 'Yorkshire & Humber',
    cities: [
      {
        name: 'Sheffield',
        slug: 'sheffield',
        desc: 'Advanced manufacturing, heavy engineering, Lower Don Valley industrial and retail campuses.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-sheffield' },
          { label: 'Planned Maintenance', path: '/facilities-management-sheffield' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-sheffield' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-sheffield' },
        ],
      },
      {
        name: 'Leeds',
        slug: 'leeds',
        desc: 'Financial and legal multi-tenant offices, Aire Valley distribution and retail complexes.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-leeds' },
          { label: 'Planned Maintenance', path: '/facilities-management-leeds' },
          { label: 'Commercial Estates', path: '/leeds-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-leeds' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-leeds' },
        ],
      },
      {
        name: 'Bradford',
        slug: 'bradford',
        desc: 'Textile mill conversions, manufacturing corridors and M606 logistics estates.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-bradford' },
          { label: 'Planned Maintenance', path: '/facilities-management-bradford' },
          { label: 'Commercial FM', path: '/bradford-facilities-management' },
        ],
      },
      {
        name: 'Doncaster',
        slug: 'doncaster',
        desc: 'iPort logistics, rail engineering and automated e-commerce distribution facilities.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-doncaster' },
          { label: 'Planned Maintenance', path: '/facilities-management-doncaster' },
          { label: 'Commercial FM', path: '/doncaster-facilities-management' },
        ],
      },
      {
        name: 'Rotherham',
        slug: 'rotherham',
        desc: 'Advanced metals, Templeborough engineering and Dearne Valley business parks.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-rotherham' },
          { label: 'Planned Maintenance', path: '/facilities-management-rotherham' },
          { label: 'Commercial FM', path: '/rotherham-facilities-management' },
        ],
      },
      {
        name: 'Grimsby',
        slug: 'grimsby',
        desc: 'Humber renewable energy hubs, port-side logistics and food-grade cold storage.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-grimsby' },
          { label: 'Planned Maintenance', path: '/facilities-management-grimsby' },
          { label: 'Commercial FM', path: '/grimsby-facilities-management' },
        ],
      },
    ],
  },
  {
    name: 'Midlands & Central Region',
    cities: [
      {
        name: 'Birmingham',
        slug: 'birmingham',
        desc: 'Colmore business district, canal-side mixed use, Digbeth creative workspace and airport engineering.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-birmingham' },
          { label: 'Planned Maintenance', path: '/facilities-management-birmingham' },
          { label: 'Commercial Estates', path: '/birmingham-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-birmingham' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-birmingham' },
        ],
      },
      {
        name: 'Nottingham',
        slug: 'nottingham',
        desc: 'Lace Market listed stock, science campuses, clinical estates and modern ring-road business parks.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-nottingham' },
          { label: 'Planned Maintenance', path: '/facilities-management-nottingham' },
          { label: 'Commercial Estates', path: '/nottingham-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-nottingham' },
        ],
      },
      {
        name: 'Derby',
        slug: 'derby',
        desc: 'Aerospace manufacturing, precision engineering, Pride Park offices and Derwent Valley estates.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-derby' },
          { label: 'Planned Maintenance', path: '/facilities-management-derby' },
          { label: 'Commercial Estates', path: '/derby-facilities-management' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-derby' },
        ],
      },
      {
        name: 'Lincoln',
        slug: 'lincoln',
        desc: 'Agriculture, food processing, Cathedral Quarter listed fabric and fringe logistics.',
        routes: [
          { label: 'Outsourced FM', path: '/facilities-management-lincoln' },
          { label: 'Commercial FM', path: '/commercial-fm-lincoln' },
          { label: 'Industrial FM', path: '/industrial-fm-lincoln' },
          { label: 'Residential FM', path: '/residential-fm-lincoln' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-lincoln' },
        ],
      },
      {
        name: 'Chesterfield',
        slug: 'chesterfield',
        desc: 'Engineering, Holmewood logistics and town-centre commercial property along the A61 corridor.',
        routes: [
          { label: 'Outsourced FM', path: '/facilities-management-chesterfield' },
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-chesterfield' },
          { label: 'Industrial Cleaning', path: '/industrial-cleaning-chesterfield' },
        ],
      },
      {
        name: 'Telford',
        slug: 'telford',
        desc: 'Automotive manufacturing, plastics, industrial parks and modern conference facilities.',
        routes: [
          { label: 'Outsourced FM', path: '/facilities-management-telford' },
          { label: 'Regional FM', path: '/facilities-management-in-telford' },
        ],
      },
      {
        name: 'Matlock',
        slug: 'matlock',
        desc: 'Peak District civic headquarters, mineral processing, tourism and heritage commercial estates.',
        routes: [
          { label: 'Outsourced FM', path: '/fm-matlock' },
        ],
      },
    ],
  },
];

export function TemplateHub({ route, content, hubType, items }: TemplateHubProps) {
  const p = route.path;
  const isLocationsHub = p === '/locations' || hubType === 'locations';
  const determinedType = hubType || (p.includes('sector') ? 'sectors' : p.includes('location') ? 'locations' : p.includes('case-study') || p.includes('portfolio') ? 'case-studies' : 'services');
  
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: p },
  ];

  // Auto-generate items for generic hubs
  const hubItems: HubItem[] = items && items.length > 0
    ? items
    : ALL_ROUTES.filter(r => {
        if (determinedType === 'services') return r.routeType === 'service';
        if (determinedType === 'sectors') return r.routeType === 'sector';
        if (determinedType === 'locations') return r.routeType === 'location';
        return r.path !== '/' && r.protected;
      }).slice(0, 30).map(r => {
        const record = loadContentRecord(r.path);
        const title = r.path === '/working-at-height-rope-access-bmu'
          ? 'Working at Height & Rope Access'
          : (record?.h1 || r.path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
        const description = r.path === '/working-at-height-rope-access-bmu'
          ? 'Rope access, BMU and specialist high-level access for inspection, maintenance, façade works, reactive repairs and cleaning across complex commercial buildings.'
          : (record?.heroIntro || record?.metaDescription || `Explore EntireFM's capabilities and service specifications for ${r.path.replace(/^\//, '').replace(/-/g, ' ')}.`);

        return {
          title,
          path: r.path,
          category: r.sitemapGroup,
          description,
        };
      });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        {isLocationsHub ? (
          <>
            {/* CINEMATIC LOCATIONS HERO */}
            <ServiceHero
              eyebrow="NATIONAL REACH · REGIONAL OPERATIONS"
              title="Facilities Management Across the United Kingdom"
              intro="EntireFM provides integrated Hard & Soft Facilities Management across major UK commercial centres. Direct mobile engineering, statutory compliance management, and single-source accountability delivered through regional operating corridors."
              imageSrc="/images/editorial/entirefm-entirefm-premises-vans-2000w.webp"
              imageAlt="EntireFM liveried mobile engineering fleet deployed across UK conurbations"
              breadcrumbs={breadcrumbs}
              primaryCta={{ label: 'Discuss Your Estate', href: '#enquiry' }}
              secondaryCta={{ label: 'Verify Site Postcode', href: '#coverage-checker' }}
              serviceFacts={[
                { label: 'UK Conurbation Coverage', value: '20+ Hubs' },
                { label: 'Mobile Engineering Units', value: 'Direct Delivery' },
                { label: 'Contracted Response SLAs', value: '24/7 Priority Desk' },
              ]}
            />

            <TrustBar />

            <SectorSnapshot
              leadText="Mobile engineering resources deployed across regional conurbations, giving commercial property owners, landlords, and managing agents consistent service standards and complete compliance transparency."
              priorities={[
                { title: 'Regional Mobile Engineers', subtitle: 'Qualified M&E, HVAC, electrical and cleaning technicians', iconName: 'nationwideCoverage' },
                { title: 'Single National Contract', subtitle: 'Unified SLAs and transparent RICS reporting across multi-site estates', iconName: 'integratedServices' },
                { title: 'Statutory Safety Vault', subtitle: 'Digital compliance certificates and asset registers accessible 24/7', iconName: 'complianceAudit' },
                { title: 'Contracted Response SLAs', subtitle: 'Emergency technical triage and rapid dispatch for critical plant', iconName: 'twentyFourSevenOps' },
              ]}
            />

            {/* INTERACTIVE POSTCODE CHECKER BANNER */}
            <section id="coverage-checker" className="py-16 bg-[#FAF9FB] border-b border-slate-200">
              <div className="container-custom max-w-4xl">
                <PostcodeCoverageLookup />
              </div>
            </section>

            {/* REGIONAL HUBS DIRECTORY */}
            <div className="bg-white py-20">
              <div className="container-custom space-y-16">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 mb-2.5">
                    <span className="h-2 w-2 rounded-full bg-brand-pink" />
                    <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                      REGIONAL OPERATING HUBS
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                    Facilities Management by Region &amp; Commercial Market
                  </h2>
                  <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                    Explore our dedicated regional landing pages and specialist local service specifications across the UK. Every location benefits from direct mobile engineering dispatch and single-contract management.
                  </p>
                </div>

                {REGIONS.map((region, rIdx) => (
                  <section key={rIdx} className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                      <MapPin className="w-5 h-5 text-brand-pink" />
                      <h3 className="text-xl sm:text-2xl font-light text-slate-900">{region.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {region.cities.map((city, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-7 bg-[#FAF9FB] border border-slate-200/90 rounded-sm shadow-sm hover:border-brand-pink hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                                {city.name}
                              </h4>
                              <span className="text-[11px] font-light uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                                Active Region
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {city.desc}
                            </p>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-200 space-y-2">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-light block">
                              Key Landing Pages:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {city.routes.map((r, routeIdx) => (
                                <Link
                                  key={routeIdx}
                                  href={r.path}
                                  className="inline-flex items-center gap-1 text-xs font-normal px-2.5 py-1 rounded-sm bg-white border border-slate-200 text-slate-800 hover:border-brand-pink hover:text-brand-pink transition-colors shadow-2xs"
                                >
                                  <span>{r.label}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <section className="py-12 bg-[#FAF9FB] border-b border-slate-200">
              <div className="container-custom">
                <AccreditationRail />
              </div>
            </section>

            <ServiceConversionSection
              serviceName="National Facilities Management"
              headline="Consolidate Your National or Regional Estate Under One Contract"
              subheadline="Consult directly with EntireFM operations directors. We provide multi-site planned preventative maintenance, Hard & Soft FM, and single-dashboard CAFM compliance reporting."
              badgeText="NATIONAL ESTATE CONSULTATION"
              ctaButtonText="Request National Proposal"
              directDeskNote="Connecting directly with our UK regional operations team."
            />
          </>
        ) : (
          /* STANDARD HUB GRID FOR SECTORS, SERVICES, RESOURCES */
          <>
            <PageHero
              eyebrow={content.eyebrow || 'Directory Hub'}
              title={content.h1}
              intro={content.heroIntro || content.metaDescription}
              path={route.path}
              breadcrumbs={breadcrumbs}
              primaryCta={{ label: 'Request a proposal', href: '#enquiry' }}
              facts={[
                { figure: 'Reach', label: 'Nationwide coverage delivered through regional operations' },
                { figure: 'Response', label: 'Agreed priority attendance targets for contracted estates' },
                { figure: 'Contract', label: 'Single point of accountability for Hard & Soft FM' },
              ]}
            />
            <TrustBar />
            <section className="section-padding bg-brand-surface">
              <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hubItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.path}
                      className="p-8 bg-white border border-brand-edge rounded-sm hover:border-brand-pink hover:shadow-elevated transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {item.category && (
                          <span className="text-[11px] uppercase tracking-wider text-brand-pink font-light block mb-2">
                            {item.category}
                          </span>
                        )}
                        <h3 className="text-xl font-light text-brand-graphite group-hover:text-brand-pink transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="pt-6 mt-6 border-t border-brand-edge/60 flex items-center justify-between text-xs font-normal text-brand-graphite group-hover:text-brand-pink">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-pink" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, ShieldCheck, Wrench, Sparkles, ChevronRight } from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { ALL_ROUTES } from '@/lib/routes/route-registry';
import locationImages from '@/config/location-images.json';

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
          { label: 'Outsourced FM', path: '/fm-london' },
          { label: 'Planned Maintenance (PPM)', path: '/facilities-management-london' },
          { label: 'Commercial Estates', path: '/london-facilities-management' },
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
          { label: 'Commercial Cleaning', path: '/commercial-cleaning-liverpool' },
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
          { label: 'Deep Cleaning', path: '/deep-cleaning-sheffield' },
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
      }).slice(0, 24).map(r => ({
        title: r.path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        path: r.path,
        category: r.sitemapGroup,
        description: `Explore EntireFM's capabilities and service specifications for ${r.path.replace(/^\//, '').replace(/-/g, ' ')}.`,
      }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        <PageHero
          eyebrow={content.eyebrow || (isLocationsHub ? 'National Reach · Regional Operations' : 'Directory Hub')}
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

        {isLocationsHub ? (
          /* DEDICATED REGIONAL LOCATIONS DISCOVERY HUB */
          <div className="bg-brand-surface py-16 sm:py-20">
            <div className="container-wide space-y-16">
              <div className="max-w-3xl">
                <span className="badge-technical">Regional Coverage Network</span>
                <h2 className="text-display-md text-brand-graphite mt-3">
                  Facilities Management by Region & Commercial Market
                </h2>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  Explore our dedicated regional landing pages and specialist local service specifications across the UK. Every location benefits from direct mobile engineering dispatch and single-contract management.
                </p>
              </div>

              {REGIONS.map((region, rIdx) => (
                <section key={rIdx} className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-brand-edge pb-4">
                    <MapPin className="w-5 h-5 text-brand-pink" />
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-graphite">{region.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {region.cities.map((city, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-7 bg-white border border-brand-edge rounded-sm shadow-sm hover:border-brand-pink hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-brand-graphite">{city.name}</h4>
                            <span className="text-[11px] font-mono font-bold uppercase text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-sm">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {city.desc}
                          </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-brand-edge/60 space-y-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                            Key Landing Pages:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {city.routes.map((r, routeIdx) => (
                              <Link
                                key={routeIdx}
                                href={r.path}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-sm bg-brand-surface text-brand-graphite hover:bg-brand-pink hover:text-white transition-colors"
                              >
                                <span>{r.label}</span>
                                <ChevronRight className="w-3 h-3 opacity-60" />
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
        ) : (
          /* STANDARD HUB GRID FOR SECTORS, SERVICES, RESOURCES */
          <section className="section-padding bg-brand-surface">
            <div className="container-wide">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hubItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.path}
                    className="p-8 bg-white border border-brand-edge rounded-sm hover:border-brand-pink hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {item.category && (
                        <span className="text-xs font-mono uppercase text-brand-pink block font-semibold">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-brand-graphite group-hover:text-brand-pink transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="pt-5 mt-5 border-t border-brand-edge flex items-center gap-1 text-xs font-bold text-brand-graphite group-hover:text-brand-pink">
                      <span>View Capability Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-pink" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 bg-white border-t border-brand-edge">
          <div className="container-wide">
            <AccreditationRail />
          </div>
        </section>

        {/* Conversion Section */}
        <ProposalSection
          headline="Looking for a Tailored Multi-Site Proposal?"
          subheadline="Speak to our facilities directors about planned maintenance, statutory compliance audits or reactive support across your UK property portfolio."
        />
      </main>
      <Footer />
    </div>
  );
}

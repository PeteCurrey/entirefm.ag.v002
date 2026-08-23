import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Wrench, Wind, ShieldAlert, Sparkles, Building, Truck } from 'lucide-react';
import { TIER1_CITY_LIST } from '@/content/locations/tier1-cities';

/**
 * CONTENT GRIDS
 * =============
 * The three main content surfaces on the site: services, sectors and
 * locations. All three share one card pattern —
 *
 *   · a hairline-divided grid rather than floating boxes, so the page reads
 *     as a specification sheet rather than a marketing deck
 *   · an edge-lit border that picks up the brand spectrum on hover
 *   · supporting detail deferred behind `.reveal-on-hover`, present in the
 *     DOM at all times so it stays crawlable and available to screen readers
 *   · staggered scroll reveals, so a row resolves left to right
 *
 * CLAIM GOVERNANCE
 * ----------------
 * Copy here previously asserted "self-delivered technical teams" (TO_VERIFY),
 * "24/7 helpdesk" without qualification (TO_VERIFY), "Regional Operating
 * Centres", "{city} FM Centre" and "Primary Operations Hub" — all of which
 * describe premises that GEO_REGIONAL_CENTRES marks DO_NOT_USE. It also
 * counted "15+ Sectors" and "22+ Locations", which are trivially checkable
 * and were wrong. None of that survives.
 */

/* ── Section heading, shared by all three grids ─────────────────────────── */

function GridHeading({
  eyebrow,
  title,
  intro,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-5 text-display-md text-brand-graphite">{title}</h2>
        <p className="prose-brand mt-4">{intro}</p>
      </div>
      <Link href={href} className="link-underline shrink-0 text-sm">
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/* ── Services ───────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    title: 'Mechanical & Electrical',
    path: '/mechanical-electrical',
    desc: 'Power distribution, lighting, switchgear and fixed-wire testing, with the statutory record kept alongside the work.',
    icon: Wrench,
    category: 'Hard FM',
    features: ['HV & LV distribution', 'Fixed wire testing (EICR)', 'Access control integration'],
  },
  {
    title: 'HVAC & Air Conditioning',
    path: '/hvac-contractor',
    desc: 'Heating, ventilation and cooling across commercial plant — from split systems to chillers and air handling units.',
    icon: Wind,
    category: 'Hard FM',
    features: ['TM44 inspections', 'F-Gas records and leak checks', 'AHU and ductwork servicing'],
  },
  {
    title: 'Planned Maintenance',
    path: '/ppm',
    desc: 'Schedules built from an actual asset survey rather than a generic template, so the plan matches what is installed.',
    icon: ShieldAlert,
    category: 'Hard FM',
    features: ['SFG20-aligned scheduling', 'Asset register and tagging', 'Statutory compliance calendar'],
  },
  {
    title: 'Industrial Cleaning',
    path: '/industrial-cleaning',
    desc: 'Factory shutdowns, high-level structural cleaning, de-greasing and process plant hygiene.',
    icon: Sparkles,
    category: 'Specialist',
    features: ['Confined space entry', 'Shutdown deep cleans', 'High-level access cleaning'],
  },
  {
    title: 'Commercial Cleaning',
    path: '/cleaning-services',
    desc: 'Daily office cleaning, floor maintenance, washroom services and scheduled sanitisation across corporate estates.',
    icon: Building,
    category: 'Soft FM',
    features: ['Daily contract cleaning', 'COSHH compliant', 'Vetted site teams'],
  },
  {
    title: 'Crane Hire & Lifting',
    path: '/mobile-crane-hire',
    desc: 'Truck-mounted cranes for rooftop plant replacement and restricted-access lifts, planned and supervised.',
    icon: Truck,
    category: 'Specialist',
    features: ['Contract lifts under BS 7121', 'Appointed person supervision', 'Restricted-access set-up'],
  },
];

export function ServiceGrid() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <GridHeading
          eyebrow="Capabilities"
          title="Everything a building needs, under one contract"
          intro="Hard and soft services coordinated by a single provider, so planned maintenance, statutory testing and reactive response are not competing for the same access window."
          href="/services"
          cta="All services"
        />

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <li
                key={service.path}
                data-reveal
                style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
              >
                <Link
                  href={service.path}
                  className="group relative flex h-full flex-col bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                  />

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className="eyebrow">{service.category}</span>
                    <Icon className="h-5 w-5 shrink-0 text-brand-silver transition-colors duration-500 group-hover:text-brand-electric" />
                  </div>

                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-brand-graphite">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-silver">
                    {service.desc}
                  </p>

                  {/* Detail is always present; only its presentation is deferred. */}
                  <div className="reveal-on-hover">
                    <ul className="space-y-1.5 pt-4">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12.5px] text-brand-silver">
                          <span
                            aria-hidden="true"
                            className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-electric"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 border-t border-brand-edge pt-4 text-[12.5px] font-semibold text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                    Explore this service
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Sectors ────────────────────────────────────────────────────────────── */

const SECTORS = [
  { title: 'Industrial & Manufacturing', path: '/industrial-facilities-management', desc: 'Process plant, LEV thorough examination, high-load electrical distribution and maintenance windows set by production rather than office hours.' },
  { title: 'Commercial Offices', path: '/commercial-facilities-management', desc: 'Multi-tenant estates where response times and common-part presentation are written into the lease, and service charge is examined line by line.' },
  { title: 'Logistics & Warehousing', path: '/logistics-facilities-management', desc: 'Dock levellers, shutters, yard lighting and three-phase power on sites where failure is measured in lost distribution hours.' },
  { title: 'Retail & Shopping Centres', path: '/retail-facilities-management', desc: 'Extensive public realm, long trading hours and presentation standards that are part of the customer experience, not back-of-house.' },
  { title: 'Education & Campuses', path: '/education-facilities-management', desc: 'Multi-building estates where a year of statutory testing and repair compresses into short vacation turnaround windows.' },
  { title: 'Healthcare & Clinical', path: '/healthcare-facilities-management', desc: 'Ventilation validation, water hygiene and infection control in buildings that never close and cannot tolerate an unplanned outage.' },
];

export function SectorGrid() {
  return (
    <section className="section border-y border-brand-edge bg-brand-surface">
      <div className="container-custom">
        <GridHeading
          eyebrow="Sectors"
          title="The trades are the same. The consequences are not."
          intro="A two-hour outage is a nuisance in a warehouse and an incident in a clinical building. Sector experience is what tells the two apart before the contract is written."
          href="/sectors"
          cta="All sectors"
        />

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge md:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector, i) => (
            <li
              key={sector.path}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
            >
              <Link
                href={sector.path}
                className="group relative flex h-full flex-col justify-between bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                />
                <div>
                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-brand-graphite">
                    {sector.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-brand-silver">{sector.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 border-t border-brand-edge pt-4 text-[12.5px] font-semibold text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                  View sector
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Locations ──────────────────────────────────────────────────────────── */

/**
 * Drawn from the Tier 1 city dataset so the cities shown, their regions and
 * their operating conditions cannot drift from the location pages themselves.
 */
export function LocationGrid() {
  const cities = TIER1_CITY_LIST.filter((c) => c.slug !== 'liverpool').slice(0, 8);

  return (
    <section className="on-dark grain relative overflow-hidden bg-brand-graphite">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-custom relative section">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-dark">Coverage</p>
            <h2 className="mt-5 text-display-md text-white">
              National coverage, run as regional operations
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-mist/60">
              EntireFM runs nationally through regional operations, with mobile engineering
              teams working to each area. What makes a city page useful is knowing how buildings
              there actually operate — not a postcode on a letterhead.
            </p>
          </div>
          <Link
            href="/locations"
            className="link-underline shrink-0 text-sm text-brand-electric-bright"
          >
            All locations
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-edge-dark sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city, i) => (
            <li
              key={city.slug}
              data-reveal
              style={{ '--reveal-delay': `${(i % 4) * 70}ms` } as React.CSSProperties}
            >
              <Link
                href={`/facilities-management-${city.slug}`}
                className="group relative flex h-full flex-col justify-between bg-brand-graphite p-6 transition-colors duration-500 ease-brand hover:bg-brand-carbon"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                />
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-white">{city.name}</h3>
                  <p className="mt-1 text-[11.5px] uppercase tracking-wider text-brand-mist/40">
                    {city.region}
                  </p>

                  {/* The one thing that makes this city different. */}
                  <div className="reveal-on-hover">
                    <p className="pt-3 text-[12px] leading-relaxed text-brand-mist/60">
                      {city.operatingConditions[0].title}
                    </p>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-electric-bright">
                  Facilities management
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

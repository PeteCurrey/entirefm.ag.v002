import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Wrench, Wind, ShieldAlert, Sparkles, Building, Truck } from 'lucide-react';
import Image from 'next/image';
import { TIER1_CITY_LIST } from '@/content/locations/tier1-cities';
import editorial from '@/config/location-images.json';

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
 * CARD BACKGROUNDS
 * ----------------
 * Service and sector cards carry photography behind them, faint at rest and
 * stronger on hover — the treatment the Wix estate used, rebuilt.
 *
 * The cards had to go dark to do it. A photograph behind dark text on white
 * either washes out to nothing or destroys the contrast; there is no setting
 * in between. On a graphite ground the image can sit at 18% and still read as
 * an image, then come up to 55% on hover without the copy ever becoming hard
 * to read.
 *
 * The images are decorative and carry `alt=""` deliberately. A photograph of
 * rooftop plant behind a card headed "Industrial Cleaning" is a background,
 * not a depiction, and giving it descriptive alt text would put a false
 * statement into the accessibility tree.
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

type EditorialManifest = { editorial: Record<string, { src: string; alt: string }> };
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/**
 * Photographic ground for a card. Decorative: no alt, aria-hidden, and it
 * renders nothing at all if the key is missing, so a card never collapses
 * because an image was renamed.
 */
function CardBackdrop({ imageKey }: { imageKey: string }) {
  const image = IMAGES[imageKey];
  if (!image) return null;
  return (
    <span aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="scale-105 object-cover opacity-[0.26] transition-all duration-[900ms] ease-brand group-hover:scale-110 group-hover:opacity-[0.62]"
      />
      <span
        className="absolute inset-0 transition-opacity duration-[900ms] ease-brand group-hover:opacity-90"
        style={{
          background:
            'linear-gradient(to top, rgba(11,18,32,.95) 12%, rgba(11,18,32,.74) 52%, rgba(11,18,32,.54) 100%)',
        }}
      />
    </span>
  );
}

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
    imageKey: 'switchgear-inspection',
    desc: 'Power distribution, lighting, switchgear and fixed-wire testing, with the statutory record kept alongside the work.',
    icon: Wrench,
    category: 'Hard FM',
    features: ['HV & LV distribution', 'Fixed wire testing (EICR)', 'Access control integration'],
  },
  {
    title: 'HVAC & Air Conditioning',
    path: '/hvac-contractor',
    imageKey: 'hvac-rooftop-condensers',
    desc: 'Heating, ventilation and cooling across commercial plant — from split systems to chillers and air handling units.',
    icon: Wind,
    category: 'Hard FM',
    features: ['TM44 inspections', 'F-Gas records and leak checks', 'AHU and ductwork servicing'],
  },
  {
    title: 'Planned Maintenance',
    path: '/ppm',
    imageKey: 'switchroom-survey',
    desc: 'Schedules built from an actual asset survey rather than a generic template, so the plan matches what is installed.',
    icon: ShieldAlert,
    category: 'Hard FM',
    features: ['SFG20-aligned scheduling', 'Asset register and tagging', 'Statutory compliance calendar'],
  },
  {
    title: 'Industrial Cleaning',
    path: '/industrial-cleaning',
    imageKey: 'hvac-plantroom-pumps',
    desc: 'Factory shutdowns, high-level structural cleaning, de-greasing and process plant hygiene.',
    icon: Sparkles,
    category: 'Specialist',
    features: ['Confined space entry', 'Shutdown deep cleans', 'High-level access cleaning'],
  },
  {
    title: 'Commercial Cleaning',
    path: '/cleaning-services',
    imageKey: 'reception',
    desc: 'Daily office cleaning, floor maintenance, washroom services and scheduled sanitisation across corporate estates.',
    icon: Building,
    category: 'Soft FM',
    features: ['Daily contract cleaning', 'COSHH compliant', 'Vetted site teams'],
  },
  {
    title: 'Crane Hire & Lifting',
    path: '/mobile-crane-hire',
    imageKey: 'external-distribution-dusk',
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

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-edge-dark md:grid-cols-2 lg:grid-cols-3">
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
                  className="on-dark group relative isolate flex h-full flex-col bg-brand-graphite p-7"
                >
                  <CardBackdrop imageKey={service.imageKey} />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                  />

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className="eyebrow eyebrow-dark">{service.category}</span>
                    <Icon className="h-5 w-5 shrink-0 text-brand-mist/50 transition-colors duration-500 group-hover:text-brand-electric-bright" />
                  </div>

                  <h3 className="text-[1.0625rem] font-light leading-snug tracking-tight text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-mist/70">
                    {service.desc}
                  </p>

                  {/* Detail is always present; only its presentation is deferred. */}
                  <div className="reveal-on-hover">
                    <ul className="space-y-1.5 pt-4">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12.5px] text-brand-mist/70">
                          <span
                            aria-hidden="true"
                            className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-electric-bright"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 border-t border-white/12 pt-4 text-[12.5px] font-normal text-white transition-colors duration-300 group-hover:text-brand-electric-bright">
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

interface SectorItem {
  title: string;
  category: string;
  path: string;
  imageKey: string;
  desc: string;
  isPrimary?: boolean;
}

const SECTORS: SectorItem[] = [
  // 4 Primary Visual Anchors
  {
    title: 'Industrial & Manufacturing',
    category: 'Process & Production',
    path: '/industrial-facilities-management',
    imageKey: 'hvac-plant-deck',
    desc: 'Process plant, heavy mechanical services, LEV examination, and maintenance windows controlled by production shifts rather than office hours.',
    isPrimary: true,
  },
  {
    title: 'Commercial Offices & Corporate',
    category: 'Workplace & Portfolios',
    path: '/commercial-facilities-management',
    imageKey: 'corporate-corridor',
    desc: 'Multi-tenant estates where response times, statutory compliance, and common-part presentation must satisfy rigorous service charge scrutiny.',
    isPrimary: true,
  },
  {
    title: 'Logistics & Distribution Centres',
    category: 'Supply Chain Hubs',
    path: '/logistics-facilities-management',
    imageKey: 'external-distribution-dusk',
    desc: 'Dock levellers, high-speed shutters, yard lighting, and high-load three-phase distribution where asset failure stops freight movement.',
    isPrimary: true,
  },
  {
    title: 'Retail & Shopping Centres',
    category: 'Public Realm & Trading',
    path: '/retail-facilities-management',
    imageKey: 'access-control-install',
    desc: 'Public realm presentation, footfall safety, HVAC comfort, and maintenance delivered around trading windows and tenant covenants.',
    isPrimary: true,
  },

  // 11 Secondary Specialist Sectors
  {
    title: 'Warehousing & Bulk Storage',
    category: 'Logistics',
    path: '/warehouse-facilities-management',
    imageKey: 'hvac-plantroom-pumps',
    desc: 'High-bay lighting, environmental control, building fabric, and statutory life safety on sites running 24/7 continuous intake.',
  },
  {
    title: 'Healthcare & Clinical Environments',
    category: 'Clinical Governance',
    path: '/healthcare-facilities-management',
    imageKey: 'plumbing-booster-set',
    desc: 'Airflow validation, water hygiene, statutory testing, and infection control across premises where unscheduled plant downtime is unacceptable.',
  },
  {
    title: 'Education & University Campuses',
    category: 'Education & Public',
    path: '/education-facilities-management',
    imageKey: 'hvac-cassette-service',
    desc: 'Multi-building academic estates where an entire year of disruptive testing, PPM, and fabric repair compresses into vacation turnaround.',
  },
  {
    title: 'Residential Blocks & Managing Agents',
    category: 'Residential Portfolios',
    path: '/residential-facilities-management',
    imageKey: 'reception',
    desc: 'Communal M&E, smoke ventilation, access control, and statutory compliance reporting directly supporting managing agent covenants.',
  },
  {
    title: 'Hotels & Hospitality',
    category: 'Guest Experience',
    path: '/hotel-facilities-management',
    imageKey: 'hero-headquarters',
    desc: 'Guest comfort, acoustic plant isolation, commercial kitchen extraction, and rapid reactive engineering executed without guest disruption.',
  },
  {
    title: 'Transport, Rail & Depots',
    category: 'Transport Infrastructure',
    path: '/transport-facilities-management',
    imageKey: 'site-arrival',
    desc: 'Safety-critical infrastructure, depot lighting, automated gates, and heavy-use passenger terminal facilities maintenance.',
  },
  {
    title: 'Aviation & Airport Facilities',
    category: 'Aviation Hubs',
    path: '/airport-facilities-management',
    imageKey: 'london-aerial-poster',
    desc: 'Airside and landside terminal services, perimeter lighting, secure access gates, and stringent statutory compliance protocols.',
  },
  {
    title: 'Construction & Site Mobilisation',
    category: 'Developments',
    path: '/construction-facilities-management',
    imageKey: 'switchroom-survey',
    desc: 'Site accommodation power, temporary utility infrastructure, perimeter security, and phased pre-handover commissioning support.',
  },
  {
    title: 'Service Stations & Forecourts',
    category: 'Forecourt & Retail',
    path: '/service-station-fm',
    imageKey: 'ev-charging',
    desc: 'Forecourt lighting, canopy maintenance, EV infrastructure, customer washrooms, and high-footfall 24/7 roadside retail support.',
  },
  {
    title: 'Stadiums, Arenas & Sports Venues',
    category: 'Event Venues',
    path: '/arena-facilities-management',
    imageKey: 'switchgear-inspection',
    desc: 'Event-day standby engineering, crowd life safety systems, turnstile access, and major plant overhauls timed between event schedules.',
  },
  {
    title: 'Restaurants & Commercial Leisure',
    category: 'Hospitality',
    path: '/restaurant-facilities-management',
    imageKey: 'plumbing-pressure-test',
    desc: 'Gas safety certification, refrigeration, grease management, drainage, and emergency response protecting kitchen trading hours.',
  },
];

export function SectorGrid() {
  const primarySectors = SECTORS.filter((s) => s.isPrimary);
  const secondarySectors = SECTORS.filter((s) => !s.isPrimary);

  return (
    <section className="section border-y border-brand-edge bg-brand-surface">
      <div className="container-custom">
        <GridHeading
          eyebrow="Sectors"
          title="The trades are the same. The consequences are not."
          intro="A two-hour plant outage is a minor inconvenience in a warehouse and a critical disruption in a manufacturing line or clinical environment. Sector experience is what tells them apart before the contract is written."
          href="/sectors"
          cta="All sectors"
        />

        {/* Primary Large Feature Grid (4 Pillars) */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {primarySectors.map((sector, i) => (
            <Link
              key={sector.path}
              href={sector.path}
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
              className="on-dark group relative isolate flex min-h-[16rem] sm:min-h-[18rem] flex-col justify-between overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-graphite p-7 transition-all duration-300 hover:border-brand-pink/50"
            >
              <CardBackdrop imageKey={sector.imageKey} />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-hero-pink-gradient transition-transform duration-500 ease-brand group-hover:scale-x-100"
              />
              <div>
                <span className="eyebrow eyebrow-dark text-brand-pink-light font-light">{sector.category}</span>
                <h3 className="mt-2 text-xl font-light tracking-tight text-white group-hover:text-brand-pink-light transition-colors">
                  {sector.title}
                </h3>
                <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-brand-mist/80">
                  {sector.desc}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 border-t border-white/12 pt-4 text-xs font-normal uppercase tracking-wider text-white transition-colors duration-300 group-hover:text-brand-pink-light">
                Explore sector capability
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Secondary Sectors Grid (11 Sectors in 3-column asymmetric layout) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondarySectors.map((sector, i) => (
            <Link
              key={sector.path}
              href={sector.path}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 60}ms` } as React.CSSProperties}
              className="on-dark group relative isolate flex flex-col justify-between overflow-hidden rounded-sm border border-brand-edge-dark/80 bg-brand-graphite/90 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-brand-carbon"
            >
              <CardBackdrop imageKey={sector.imageKey} />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
              />
              <div>
                <span className="text-[10px] font-normal uppercase tracking-widest text-brand-mist/50">
                  {sector.category}
                </span>
                <h4 className="mt-1.5 text-base font-light text-white group-hover:text-brand-electric-bright transition-colors">
                  {sector.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-brand-mist/70">
                  {sector.desc}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[11.5px] font-normal text-brand-mist/60 group-hover:text-white transition-colors">
                View scope
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
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
                  <h3 className="text-base font-light tracking-tight text-white">{city.name}</h3>
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
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-normal text-brand-electric-bright">
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

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Building2, Wrench, Clock } from 'lucide-react';
import editorial from '@/config/location-images.json';

interface EstateType {
  id: string;
  name: string;
  badge: string;
  imageKey: string;
  imageAlt: string;
  operationalReality: string;
  maintenanceReality: string;
  priorities: string[];
  serviceLink: { label: string; href: string };
}

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

const ESTATE_PROFILES: EstateType[] = [
  {
    id: 'offices',
    name: 'Commercial Offices & Corporate HQ',
    badge: 'Multi-Tenant & Occupied',
    imageKey: 'corporate-corridor',
    imageAlt: 'EntireFM commercial office facilities and corridor maintenance',
    operationalReality:
      'High occupancy density, managing agent scrutiny, tenant service level expectations, and leasehold service charge transparency.',
    maintenanceReality:
      'Disruptive plant overhauls, HVAC filter changes, and fixed-wire testing must occur outside standard 08:00–18:00 occupancy windows.',
    priorities: [
      'HVAC comfort & indoor air quality monitoring',
      'Fixed wire periodic inspection (EICR) & emergency lighting',
      'Common parts fabric maintenance & washroom services',
      'Automated access control & fire alarm interface testing',
    ],
    serviceLink: { label: 'Explore Commercial Office FM', href: '/commercial-facilities-management' },
  },
  {
    id: 'industrial',
    name: 'Industrial & Manufacturing Plants',
    badge: 'Process & Production Critical',
    imageKey: 'hvac-plant-deck',
    imageAlt: 'EntireFM heavy mechanical plant and industrial engineering',
    operationalReality:
      'Continuous production lines, high-voltage substations, process mechanical equipment, and strict statutory HSE compliance.',
    maintenanceReality:
      'Maintenance schedules are strictly dictated by factory production shifts, planned shutdowns, and changeover windows.',
    priorities: [
      'High-voltage switchgear & 3-phase distribution servicing',
      'LEV thorough examination & industrial extraction',
      'Factory shutdown deep cleaning & decontamination',
      'Process heating, boiler plant & compressed air lines',
    ],
    serviceLink: { label: 'Explore Industrial FM', href: '/industrial-facilities-management' },
  },
  {
    id: 'logistics',
    name: 'Logistics & Distribution Hubs',
    badge: 'High-Throughput Freight',
    imageKey: 'external-distribution-dusk',
    imageAlt: 'EntireFM logistics distribution centre exterior and yard maintenance',
    operationalReality:
      '24/7 vehicle movement, high-volume loading docks, multi-acre yards, and critical time-sensitive freight turnaround.',
    maintenanceReality:
      'A single dock leveller or roller shutter motor failure directly halts loading bays, creating immediate logistics bottlenecks.',
    priorities: [
      'Hydraulic dock levellers & fast-action industrial doors',
      'High-bay LED lighting & external yard floodlighting',
      'Roof rainwater drainage & perimeter security barriers',
      '3-phase EV & heavy vehicle charging maintenance',
    ],
    serviceLink: { label: 'Explore Logistics FM', href: '/logistics-facilities-management' },
  },
  {
    id: 'retail',
    name: 'Retail Parks & Shopping Centres',
    badge: 'Public Realm & High Footfall',
    imageKey: 'access-control-install',
    imageAlt: 'EntireFM retail and public realm facilities engineering',
    operationalReality:
      'Public footfall safety, high visual presentation standards, complex landlord/tenant boundaries, and extended 7-day trading.',
    maintenanceReality:
      'All heavy plant maintenance, facade washing, and noisy reactive repairs must conclude before store opening hours.',
    priorities: [
      'Public realm life safety & emergency egress testing',
      'Retail unit HVAC, chiller & climate maintenance',
      'Car park surface care, drainage & external lighting',
      'Rapid response glazing, access & shutter triage',
    ],
    serviceLink: { label: 'Explore Retail FM', href: '/retail-facilities-management' },
  },
  {
    id: 'education',
    name: 'Education & University Campuses',
    badge: 'Multi-Building Estates',
    imageKey: 'hvac-cassette-service',
    imageAlt: 'EntireFM education campus heating and ventilation engineering',
    operationalReality:
      'Dispersed multi-building estates, student safeguarding protocols, intense term-time usage, and strict statutory safety.',
    maintenanceReality:
      'A full year of invasive statutory inspections, plant overhauls, and structural repairs compresses into tight vacation turnaround windows.',
    priorities: [
      'Statutory compliance registers (Legionella, Gas, EICR, Fire)',
      'Classroom & lecture hall ventilation servicing',
      'Vacation turnaround fabric repair & deep sanitation',
      'Building management system (BMS) scheduling & energy tuning',
    ],
    serviceLink: { label: 'Explore Education FM', href: '/education-facilities-management' },
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Clinical Facilities',
    badge: 'Zero-Downtime Governance',
    imageKey: 'plumbing-booster-set',
    imageAlt: 'EntireFM clinical water hygiene and mechanical pump sets',
    operationalReality:
      'Vulnerable occupants, critical hygiene standards, non-stop 24/7 operation, and zero tolerance for unplanned utility outages.',
    maintenanceReality:
      'Redundant plant failover testing and clinical isolation procedures require specialized engineering risk assessments.',
    priorities: [
      'HTM-compliant water hygiene & Legionella control schemes',
      'Negative pressure ventilation & HEPA filtration testing',
      'Uninterruptible power supply (UPS) & backup generator testing',
      'Specialist infection control sanitisation protocols',
    ],
    serviceLink: { label: 'Explore Healthcare FM', href: '/healthcare-facilities-management' },
  },
  {
    id: 'residential',
    name: 'Residential Blocks & Portfolios',
    badge: 'Managing Agent Support',
    imageKey: 'reception',
    imageAlt: 'EntireFM residential block communal area facilities',
    operationalReality:
      'Resident safety, communal area maintenance, Section 20 consultation alignment, and managing agent governance.',
    maintenanceReality:
      'Clear communication and rapid attendance for communal heating, lift failover, and door entry preserve resident relations.',
    priorities: [
      'Communal smoke clearance & AOV ventilation testing',
      'Communal water booster pumps & central plant maintenance',
      'Gate automation, intercoms & CCTV security servicing',
      'Digital CAFM certificates for managing agent audit trails',
    ],
    serviceLink: { label: 'Explore Residential FM', href: '/residential-facilities-management' },
  },
];

export function EstateExperience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeEstate = ESTATE_PROFILES[activeIdx];
  const image = IMAGES[activeEstate.imageKey];

  return (
    <section className="section bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-pink-light">
              ESTATE DISCIPLINE
            </span>
          </div>
          <h2 className="text-display-lg text-white">
            How the estate changes the FM plan
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-mist/80 leading-relaxed max-w-2xl">
            The engineering trades remain consistent across the UK. What fundamentally shifts from one building to the next is the operating constraint: when access is permitted, what failure costs, and who scrutinises the result.
          </p>
        </div>

        {/* Interactive Split-Screen Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Panel: Estate Selector Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            <div className="space-y-2" role="tablist" aria-label="Commercial Estate Types">
              {ESTATE_PROFILES.map((estate, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={estate.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left p-4 rounded-sm transition-all duration-300 flex items-center justify-between group border ${
                      isActive
                        ? 'bg-brand-carbon border-brand-pink/60 shadow-glow-pink'
                        : 'bg-brand-graphite/60 border-brand-edge-dark/60 hover:bg-brand-graphite hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-sm text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-brand-pink text-white'
                            : 'bg-white/10 text-brand-mist/60 group-hover:text-white'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span
                          className={`text-sm font-semibold block truncate transition-colors ${
                            isActive ? 'text-white font-bold' : 'text-brand-mist/80 group-hover:text-white'
                          }`}
                        >
                          {estate.name}
                        </span>
                        <span className="text-[11px] text-brand-mist/50 block truncate mt-0.5">
                          {estate.badge}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isActive
                          ? 'text-brand-pink-light translate-x-1'
                          : 'text-brand-mist/30 group-hover:text-brand-mist/70'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Contextual Visual & Operational Insight */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 rounded-sm border border-brand-edge-dark bg-brand-carbon p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-elevated">
              {/* Context Image Plate with Soft Overlay */}
              <div className="relative h-48 sm:h-60 w-full overflow-hidden rounded-sm border border-white/10 mb-6 shrink-0">
                {image && (
                  <Image
                    src={image.src}
                    alt={activeEstate.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-all duration-700 ease-brand"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-graphite/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-sm bg-brand-graphite/80 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-brand-pink-light backdrop-blur-md">
                    {activeEstate.badge}
                  </span>
                </div>
              </div>

              {/* Operational Realities */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeEstate.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-sm bg-brand-graphite/70 border border-brand-edge-dark/80">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-pink-light mb-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      Operational Reality
                    </div>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-brand-mist/80">
                      {activeEstate.operationalReality}
                    </p>
                  </div>

                  <div className="p-4 rounded-sm bg-brand-graphite/70 border border-brand-edge-dark/80">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-electric-bright mb-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Maintenance Reality
                    </div>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-brand-mist/80">
                      {activeEstate.maintenanceReality}
                    </p>
                  </div>
                </div>

                {/* Priority Deliverables */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-brand-pink" />
                    Key Maintenance & Compliance Priorities:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeEstate.priorities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-brand-mist/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-8 pt-5 border-t border-brand-edge-dark flex items-center justify-between">
                <Link
                  href={activeEstate.serviceLink.href}
                  className="btn-hero-pink py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                >
                  <span>{activeEstate.serviceLink.label}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-brand-mist/40 hidden sm:inline">
                  PPM & Reactive Contract Framework
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

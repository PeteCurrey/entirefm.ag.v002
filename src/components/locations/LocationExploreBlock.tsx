'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Wind, 
  Sparkles, 
  Factory, 
  MapPin, 
  Layers, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export interface LocationNavGroup {
  heading: string;
  category: string;
  links: Array<{ label: string; href: string; detail?: string }>;
}

export interface LocationExploreBlockProps {
  city: string;
  groups?: LocationNavGroup[];
  allLocationsHref?: string;
}

export function LocationExploreBlock({
  city,
  groups,
  allLocationsHref = '/locations',
}: LocationExploreBlockProps) {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');

  const defaultGroups: LocationNavGroup[] = [
    {
      heading: 'Facilities Management & PPM',
      category: 'Core Operations',
      links: [
        { label: `${city} Outsourced FM`, href: `/fm-${citySlug}`, detail: 'Commercial Helpdesk & Response' },
        { label: `${city} Planned Maintenance (PPM)`, href: `/facilities-management-${citySlug}`, detail: 'SFG20 Statutory Regimes' },
        { label: `${city} Commercial Estates`, href: `/${citySlug}-facilities-management`, detail: 'Landlord & Tenant Demises' },
      ],
    },
    {
      heading: 'Mechanical & Specialist Engineering',
      category: 'Hard Services',
      links: [
        { label: 'Mechanical & Electrical (M&E)', href: '/mechanical-electrical', detail: 'Plantroom & Switchgear Care' },
        { label: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', detail: 'Chillers, AHUs & F-Gas' },
        { label: 'Building Maintenance & Fabric', href: '/building-maintenance', detail: 'Envelope, Roofing & Glazing' },
      ],
    },
    {
      heading: 'Cleaning & Hygiene Services',
      category: 'Soft Services',
      links: [
        { label: `${city} Commercial Cleaning`, href: `/commercial-cleaning-${citySlug}`, detail: 'Contract Office & Daily Hygiene' },
        { label: `${city} Industrial Cleaning`, href: `/industrial-cleaning-${citySlug}`, detail: 'High-Level, Factory & Plant' },
        { label: 'Specialist Contract Cleaning', href: '/cleaning-services', detail: 'Deep Sanitisation & Care' },
      ],
    },
    {
      heading: 'Statutory Safety & Tools',
      category: 'Compliance & Strategy',
      links: [
        { label: 'National Compliance Centre', href: '/compliance', detail: 'EICR, Gas CP12 & Water Hygiene' },
        { label: 'Interactive PPM Schedule Builder', href: '/tools/ppm-schedule-builder', detail: 'Generate Asset Matrix' },
        { label: 'Tender Brief Generator', href: '/tools/tender-brief', detail: 'Structure FM Specifications' },
      ],
    },
  ];

  const displayGroups = groups && groups.length > 0 ? groups : defaultGroups;

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-white relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-pink-light">
                STRUCTURED REGIONAL ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              Explore Facilities &amp; Engineering Services Across {city}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed font-light">
              Direct access to dedicated service disciplines, statutory compliance resources, and operational tools across the {city} network.
            </p>
          </div>

          <Link
            href={allLocationsHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-brand-pink-light bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-sm shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>All UK Regional Hubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              className="bg-slate-950/80 border border-slate-800 rounded-sm p-6 flex flex-col justify-between hover:border-brand-pink/40 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink-light font-semibold block mb-1">
                  {group.category}
                </span>
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800/80 group-hover:text-brand-pink-light transition-colors">
                  {group.heading}
                </h3>

                <ul className="space-y-3">
                  {group.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="block group/link p-2 -mx-2 rounded hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover/link:text-brand-pink-light transition-colors">
                            {link.label}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover/link:text-brand-pink-light group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                        </div>
                        {link.detail && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {link.detail}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

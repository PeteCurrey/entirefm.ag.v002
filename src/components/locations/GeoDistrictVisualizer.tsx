import React from 'react';
import { MapPin, Navigation, ShieldCheck, ArrowRight, Building2, Truck } from 'lucide-react';
import type { CityDistrict } from '@/content/locations/tier1-cities';

interface GeoDistrictVisualizerProps {
  city: string;
  region: string;
  districts?: CityDistrict[];
  travelPattern?: string;
}

export function GeoDistrictVisualizer({
  city,
  region,
  districts,
  travelPattern,
}: GeoDistrictVisualizerProps) {
  const defaultDistricts: CityDistrict[] = [
    { name: `${city} Central Commercial Zone`, note: 'High-density corporate offices, retail and multi-tenant commercial property.' },
    { name: `${city} Industrial & Logistics Corridors`, note: 'Distribution hubs, manufacturing plants and trade counters.' },
    { name: `${city} Business Parks & Out-of-Town`, note: 'Campus-style facilities, science parks and managed business estates.' },
    { name: `Surrounding ${region || 'Regional Conurbation'}`, note: 'Connecting regional towns and arterial transport links.' },
  ];

  const items = districts && districts.length > 0 ? districts : defaultDistricts;

  return (
    <section className="section-padding bg-white border-b border-brand-edge">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Operational coverage</p>
            <h2 className="text-display-md text-brand-graphite mt-3">
              Commercial Districts &amp; Corridors Across {city}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-silver leading-relaxed">
              Assigned mobile engineering teams cover all major business districts, business parks, and logistics corridors across {region || city}.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-silver font-mono bg-brand-surface px-4 py-2 rounded-sm border border-brand-edge">
            <Navigation className="h-3.5 w-3.5 text-brand-pink shrink-0" />
            <span>Regional Travel Pattern: {travelPattern || `${city} & Wider Conurbation`}</span>
          </div>
        </div>

        {/* District Grid with Subtle Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-reveal>
          {items.map((district, idx) => (
            <div
              key={district.name}
              className="group relative rounded-sm border border-brand-edge bg-brand-surface p-5 transition-all duration-300 ease-brand hover:border-brand-electric/40 hover:bg-white hover:shadow-sm flex flex-col justify-between"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-spectrum transition-transform duration-300 ease-brand group-hover:scale-x-100"
              />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-pink shrink-0" />
                    <span className="text-[11px] font-mono text-brand-silver/80">ZONE 0{idx + 1}</span>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active Engineering Coverage" />
                </div>
                <h3 className="text-sm sm:text-base font-light text-brand-graphite leading-snug group-hover:text-brand-graphite">
                  {district.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-silver">
                  {district.note}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-edge/60 flex items-center justify-between text-[11px] font-mono text-brand-silver">
                <span>Active Coverage</span>
                <span className="text-emerald-700 font-light">24/7 Response</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explanatory Coverage Note (No False Office Claims) */}
        <div className="mt-8 p-4 rounded-sm bg-brand-surface border border-brand-edge flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-silver" data-reveal>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-pink shrink-0" />
            <span>
              <strong>Note on Coverage:</strong> Listed districts represent active service territories and mobile engineering deployment, coordinated through our central operational desk.
            </span>
          </div>
          <a href="#enquiry" className="inline-flex items-center gap-1 font-light text-brand-pink hover:underline shrink-0">
            Check Your Specific Site
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { MapPin, Building, ChevronRight } from 'lucide-react';

interface RegionalHubProgramme {
  city: string;
  region: string;
  focusTheme: string;
  potentialVenues: string;
}

const REGIONAL_HUBS: RegionalHubProgramme[] = [
  {
    city: 'London',
    region: 'Greater London & South East',
    focusTheme: 'Corporate Offices, High-Rise Plant, Life Safety & ESG Decarbonisation',
    potentialVenues: 'City & West End Technical Venues · Central M25 Hubs',
  },
  {
    city: 'Manchester',
    region: 'North West & M62 Corridor',
    focusTheme: 'Manufacturing, Logistics, Industrial Chiller & Media Portfolios',
    potentialVenues: 'MediaCityUK & Trafford Park Engineering Hubs',
  },
  {
    city: 'Birmingham',
    region: 'Midlands & Central Region',
    focusTheme: 'Commercial Districts, Automotive, High-Voltage Power & M&E Engineering',
    potentialVenues: 'Colmore Commercial District & National Exhibition Centres',
  },
  {
    city: 'Leeds & Sheffield',
    region: 'Yorkshire & Humber',
    focusTheme: 'Advanced Manufacturing, Heavy Engineering, Retail Parks & Logistics',
    potentialVenues: 'Advanced Manufacturing Park (AMP) & Aire Valley Facilities',
  },
];

export function RegionalProgrammeSection() {
  return (
    <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              REGIONAL DELIVERY NETWORK
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Delivering technical sessions across major UK conurbations
          </h2>
          <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
            Our events rotate regionally to ensure local contractors, facilities managers, and engineering SMEs can attend in person without excessive travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REGIONAL_HUBS.map((hub) => (
            <div
              key={hub.city}
              className="p-6 bg-white border border-slate-200/90 rounded-sm shadow-xs space-y-4 hover:border-brand-pink transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xs bg-[#FAF9FB] text-brand-pink group-hover:bg-brand-pink/10 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-slate-900 group-hover:text-brand-pink transition-colors">
                      {hub.city}
                    </h3>
                    <span className="text-xs font-mono text-slate-400 font-light">
                      {hub.region}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 uppercase">
                  Programme Hub
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-mono uppercase text-[10px] text-slate-400 block font-light">
                    Regional Engineering Focus:
                  </span>
                  <p className="text-slate-700 font-normal mt-0.5">
                    {hub.focusTheme}
                  </p>
                </div>
                <div>
                  <span className="font-mono uppercase text-[10px] text-slate-400 block font-light">
                    Indicative Hub Locations:
                  </span>
                  <p className="text-slate-500 font-light mt-0.5">
                    {hub.potentialVenues}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

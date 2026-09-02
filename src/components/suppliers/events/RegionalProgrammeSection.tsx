'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface RegionalHubProgramme {
  city: string;
  region: string;
  focusTheme: string;
  potentialVenues: string;
}

const REGIONAL_HUBS: RegionalHubProgramme[] = [
  {
    city: 'London & South East',
    region: 'Greater London & M25 Corridor',
    focusTheme: 'Corporate Head Offices, High-Rise Plantrooms, Life Safety & ESG Decarbonisation',
    potentialVenues: 'ExCeL London · City of London Hubs · Central M25 Technical Facilities',
  },
  {
    city: 'Manchester & North West',
    region: 'North West & M62 Corridor',
    focusTheme: 'Manufacturing, Logistics Distribution, Industrial Chillers & Critical Media Portfolios',
    potentialVenues: 'Manchester Central · MediaCityUK & Trafford Park Engineering Facilities',
  },
  {
    city: 'Birmingham & Midlands',
    region: 'Midlands & Central England',
    focusTheme: 'Commercial Districts, Automotive Engineering, High-Voltage Power & M&E Retrofits',
    potentialVenues: 'National Exhibition Centre (NEC) · Colmore Commercial District',
  },
  {
    city: 'Leeds & Sheffield',
    region: 'Yorkshire & Humber',
    focusTheme: 'Advanced Manufacturing, Heavy Engineering, Retail Parks & Regional Logistics',
    potentialVenues: 'Advanced Manufacturing Park (AMP) & Leeds City Technical Venues',
  },
];

export function RegionalProgrammeSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom">
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              REGIONAL DELIVERY NETWORK
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Four regional programme hubs.
          </h2>
          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            Our events rotate regionally across four established hub zones, ensuring local specialist contractors, facilities managers, and engineering SMEs can participate in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REGIONAL_HUBS.map((hub) => (
            <div
              key={hub.city}
              className="p-6 bg-white border border-[#E8E8E5] rounded-[8px] shadow-xs space-y-4 hover:border-[#EA580C]/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] text-[#EA580C] group-hover:bg-[#EA580C]/10 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#111111] group-hover:text-[#EA580C] transition-colors">
                      {hub.city}
                    </h3>
                    <span className="text-xs text-[#9A9A95] font-light">
                      {hub.region}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-2.5 py-1 rounded-[4px] border border-[#A7F3D0] uppercase tracking-wider">
                  Programme Hub
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E8E8E5] text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#9A9A95] block mb-1">
                    Regional Engineering Focus:
                  </span>
                  <p className="text-[#2D2D2D] font-normal leading-relaxed">
                    {hub.focusTheme}
                  </p>
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#9A9A95] block mb-1">
                    Hub Locations:
                  </span>
                  <p className="text-[#6D6D68] font-light leading-relaxed">
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

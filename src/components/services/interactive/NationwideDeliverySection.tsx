'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ChevronRight, Building, Truck, ShieldCheck } from 'lucide-react';

interface RegionalHub {
  city: string;
  region: string;
  href: string;
  focus: string;
}

const HUBS: RegionalHub[] = [
  { city: 'London', region: 'Greater London & South East', href: '/facilities-management-london', focus: 'Grade A corporate offices, retail campuses & multi-tenant estates' },
  { city: 'Manchester', region: 'North West & M62 Corridor', href: '/fm-manchester', focus: 'Logistics, media city portfolios & manufacturing plants' },
  { city: 'Birmingham', region: 'Midlands & Central', href: '/fm-birmingham', focus: 'Colmore business district, industrial units & public estates' },
  { city: 'Leeds', region: 'Yorkshire & North East', href: '/fm-leeds', focus: 'Financial offices, Aire Valley distribution & mixed-use assets' },
  { city: 'Sheffield', region: 'South Yorkshire & Humber', href: '/fm-sheffield', focus: 'Advanced manufacturing, engineering clusters & retail parks' },
  { city: 'Lincoln', region: 'East Midlands & Agricultural', href: '/facilities-management-lincoln', focus: 'Food manufacturing, listed property fabric & logistics' },
];

export function NationwideDeliverySection() {
  return (
    <section id="nationwide-delivery" className="relative bg-[#FAF9FB] border-b border-slate-200 py-16 sm:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column / Context */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/20">
              <MapPin className="h-3.5 w-3.5 text-brand-pink" />
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink">
                NATIONWIDE DELIVERY NETWORK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
              Engineering delivered locally.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              We coordinate maintenance centrally through our 24/7 operations desk and dispatch qualified engineers through dedicated regional operating corridors. One national agreement; consistent local engineering standards.
            </p>

            <div className="pt-2">
              <Link
                href="/locations"
                className="btn-outline text-xs py-2.5 px-4 inline-flex items-center gap-2"
              >
                <span>View All 20+ Service Regions</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-pink" />
              </Link>
            </div>
          </div>

          {/* Right Column / City Region Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HUBS.map((hub) => (
              <Link
                key={hub.city}
                href={hub.href}
                className="p-5 bg-white border border-slate-200/90 rounded-sm hover:border-brand-pink hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-normal text-slate-900 group-hover:text-brand-pink transition-colors">
                      {hub.city}
                    </h3>
                    <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 uppercase">
                      Active Region
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-light">
                    {hub.region}
                  </span>
                  <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                    {hub.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-brand-pink transition-colors">
                  <span>Explore {hub.city} Coverage</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-pink" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

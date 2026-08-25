import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Truck, Factory, ShoppingBag, GraduationCap, Hotel } from 'lucide-react';

interface GeoSectorPanelsProps {
  city: string;
  sectors?: string[];
}

export function GeoSectorPanels({ city, sectors }: GeoSectorPanelsProps) {
  const sectorData = [
    {
      title: 'Commercial Offices & Corporate Estates',
      slug: '/sectors/commercial-offices',
      image: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
      description: `Multi-tenant towers, business parks and corporate headquarters across ${city}. Common-parts M&E, tenant compliance and concierge care.`,
      icon: Building2,
    },
    {
      title: 'Logistics, Warehousing & Freight',
      slug: '/sectors/logistics-distribution',
      image: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      description: `High-bay distribution centres, automated sortation hubs and freight yards. 24/7 dock leveller, shutter and high-level lighting maintenance.`,
      icon: Truck,
    },
    {
      title: 'Industrial & Advanced Manufacturing',
      slug: '/sectors/industrial-manufacturing',
      image: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      description: `Process plants, heavy fabrication and cleanrooms. High-load power distribution, LEV statutory testing and planned shutdown servicing.`,
      icon: Factory,
    },
    {
      title: 'Retail Parks & Shopping Centres',
      slug: '/sectors/retail-shopping-centres',
      image: '/images/editorial/entirefm-rooftop-plant-night-2000w.webp',
      description: `Managed shopping centres and retail parks with high footfall. Public realm maintenance, HVAC reliability and rapid reactive response.`,
      icon: ShoppingBag,
    },
    {
      title: 'Education & Healthcare Campuses',
      slug: '/sectors/education-public-sector',
      image: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
      description: `University estates, clinical buildings and research facilities. Strict hygiene regimes, water sampling and vacation turnaround maintenance.`,
      icon: GraduationCap,
    },
    {
      title: 'Hotels, Hospitality & Leisure',
      slug: '/sectors/hospitality-leisure',
      image: '/images/editorial/entirefm-access-control-install-2000w.webp',
      description: `Hotels, motorway services and leisure venues operating around the clock. Zero-downtime mechanical servicing and guest comfort assurance.`,
      icon: Hotel,
    },
  ];

  return (
    <section className="section-padding bg-white border-b border-brand-edge">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Sector footprint</p>
            <h2 className="text-display-md text-brand-graphite mt-3">
              Sector Expertise Across {city}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-silver leading-relaxed">
              Facilities management tailored to the operational rhythm of each building type, from corporate boardrooms to continuous industrial shifts.
            </p>
          </div>
          <Link
            href="/sectors"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-pink hover:underline shrink-0"
          >
            View all 15 sectors
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 6-Up Photographic Sector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal>
          {sectorData.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.title}
                href={sec.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-brand-edge bg-brand-surface transition-all duration-500 ease-brand hover:border-brand-electric/50 hover:shadow-lg aspect-[4/3] sm:aspect-[16/11]"
              >
                {/* Background Image with Dark Vignette */}
                <Image
                  src={sec.image}
                  alt={sec.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-brand group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-graphite/95 via-brand-graphite/60 to-brand-graphite/30 transition-opacity duration-300 group-hover:from-brand-graphite/95 group-hover:via-brand-graphite/70"
                />

                {/* Top Badge */}
                <div className="relative z-10 p-6 flex items-center justify-between">
                  <div className="w-8 h-8 rounded-sm bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
                    <Icon className="h-4 w-4 text-brand-pink-light" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/80 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {city.toUpperCase()}
                  </span>
                </div>

                {/* Bottom Content with Reveal */}
                <div className="relative z-10 p-6 text-white space-y-2">
                  <h3 className="text-lg font-light tracking-tight text-white leading-snug group-hover:text-brand-pink-light transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-brand-mist/80 line-clamp-2 leading-relaxed font-light">
                    {sec.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-normal text-brand-pink-light">
                    <span>Explore sector scope</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

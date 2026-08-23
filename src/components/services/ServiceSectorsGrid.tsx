'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Truck, Factory, ShoppingBag, GraduationCap, Building2 } from 'lucide-react';

export interface ServiceSectorItem {
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export const DEFAULT_SERVICE_SECTORS: ServiceSectorItem[] = [
  {
    name: 'Commercial Offices & Corporate Real Estate',
    category: 'COMMERCIAL',
    description: 'High-rise office buildings, business parks, and corporate headquarters requiring zero downtime and high tenant satisfaction.',
    imageSrc: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    imageAlt: 'Commercial corporate office building',
    href: '/commercial-property-facilities-management',
  },
  {
    name: 'Industrial & Heavy Manufacturing',
    category: 'MANUFACTURING',
    description: 'Engineering plants, automated assembly lines, and production facilities operating under strict health, safety, and PPM regimes.',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    imageAlt: 'Industrial manufacturing plant',
    href: '/industrial-facilities-management',
  },
  {
    name: 'Logistics Hubs & Distribution Centres',
    category: 'LOGISTICS',
    description: 'High-bay regional distribution hubs, 24/7 fulfillment warehouses, and transport depot infrastructure.',
    imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
    imageAlt: 'Logistics and distribution facility',
    href: '/logistics-facilities-management',
  },
  {
    name: 'Retail Parks & Shopping Destinations',
    category: 'RETAIL',
    description: 'High-footfall shopping centres, supermarket chains, and out-of-town retail parks needing reliable public-facing systems.',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'Retail and commercial shopping environment',
    href: '/retail-facilities-management',
  },
  {
    name: 'Education & Multi-Building Campuses',
    category: 'EDUCATION',
    description: 'Universities, colleges, and schools requiring scheduled maintenance coordinated around term times and exam periods.',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'Educational campus building',
    href: '/education-facilities-management',
  },
  {
    name: 'Multi-Site Portfolio Estates',
    category: 'PORTFOLIOS',
    description: 'Nationwide institutional property portfolios and managing agents requiring centralised account governance and CAFM reporting.',
    imageSrc: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    imageAlt: 'Commercial property portfolio estate',
    href: '/portfolio',
  },
];

export function ServiceSectorsGrid({
  eyebrow = 'SECTOR APPLICATION',
  title = 'Environments & Sectors We Support',
  subtitle = 'Tailored engineering and facilities management delivery across specialized commercial sectors nationwide.',
  sectors = DEFAULT_SERVICE_SECTORS,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  sectors?: ServiceSectorItem[];
}) {
  if (!sectors || sectors.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sec, idx) => (
            <Link
              key={idx}
              href={sec.href}
              className="bg-white border border-slate-200/90 rounded-sm overflow-hidden flex flex-col justify-between group hover:-translate-y-1 hover:shadow-elevated hover:border-brand-pink/40 transition-all duration-300"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={sec.imageSrc}
                    alt={sec.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 text-brand-pink-light border border-white/15 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-sm backdrop-blur-sm">
                    {sec.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-graphite transition-colors">
                    {sec.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink group-hover:text-brand-magenta transition-colors">
                  <span>Explore sector solutions</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

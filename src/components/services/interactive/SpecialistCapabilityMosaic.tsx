'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Shield, Wrench, Eye, Camera, HardHat } from 'lucide-react';

interface MosaicTile {
  title: string;
  discipline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  colSpan: string; // e.g. lg:col-span-8 vs lg:col-span-4
  aspectRatio: string;
}

const MOSAIC_TILES: MosaicTile[] = [
  {
    title: 'IRATA Rope Access & BMU Façade Care',
    discipline: 'SPECIALIST ACCESS',
    description: 'High-level glazing replacement, mastic seal renewals, and high-rise envelope inspection without scaffolding.',
    imageSrc: '/images/services/working-at-height/hero-rope-access.png',
    imageAlt: 'IRATA rope access technician performing high-level building maintenance on commercial façade',
    href: '/working-at-height-rope-access-bmu',
    colSpan: 'lg:col-span-7',
    aspectRatio: 'aspect-[16/10]',
  },
  {
    title: 'Contract Crane Hire & Plant Swaps',
    discipline: 'HEAVY LIFTING',
    description: 'CPA contract lifting operations, road closure permits, and precision rooftop chiller positioning.',
    imageSrc: '/images/services/working-at-height/bmu-cradle-access.png',
    imageAlt: 'Mobile crane lifting heavy commercial plant onto commercial rooftop',
    href: '/mobile-crane-hire',
    colSpan: 'lg:col-span-5',
    aspectRatio: 'aspect-[16/10]',
  },
  {
    title: 'High-Voltage Switchgear & Distribution',
    discipline: 'ELECTRICAL ENGINEERING',
    description: 'Thermal thermography, power quality analysis, busbar inspection, and periodic statutory EICR verification.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineer conducting maintenance diagnostics on commercial switchgear',
    href: '/mechanical-electrical',
    colSpan: 'lg:col-span-4',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    title: 'Commercial UAV & Thermal Asset Surveys',
    discipline: 'DRONE INTELLIGENCE',
    description: 'Sub-millimeter optical roof audits and radiometric thermal heat loss scans across commercial envelopes.',
    imageSrc: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    imageAlt: 'EntireFM commercial drone aerial building survey surveying commercial rooftop infrastructure',
    href: '/services/drone-services',
    colSpan: 'lg:col-span-4',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    title: 'Commercial Plant Room & Booster Care',
    discipline: 'MECHANICAL & WATER',
    description: 'Pressurisation sets, heating calorifiers, chilled water circuits, and statutory Legionella water testing.',
    imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
    imageAlt: 'EntireFM engineers surveying pumps and pipework in a commercial plant room',
    href: '/plumbing-gas',
    colSpan: 'lg:col-span-4',
    aspectRatio: 'aspect-[4/3]',
  },
];

export function SpecialistCapabilityMosaic() {
  return (
    <section id="specialist-mosaic" className="relative bg-[#FAF9FB] border-b border-slate-200 py-20 sm:py-28">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              DIFFERENTIATED CAPABILITY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            Engineering delivered on site.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            From difficult-access high-rise rope work to heavy plant room commissioning and aerial thermal intelligence, our specialist divisions eliminate subcontractor layers.
          </p>
        </div>

        {/* Asymmetrical Photographic Mosaic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {MOSAIC_TILES.map((tile, idx) => (
            <div
              key={idx}
              className={`${tile.colSpan} group relative rounded-sm overflow-hidden border border-slate-200 bg-slate-950 shadow-sm`}
            >
              <div className={`relative w-full ${tile.aspectRatio}`}>
                <Image
                  src={tile.imageSrc}
                  alt={tile.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                
                {/* Tile Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xs border border-white/20 text-brand-pink-light">
                      {tile.discipline}
                    </span>
                    <Link
                      href={tile.href}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-pink text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      aria-label={`Explore ${tile.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white group-hover:text-brand-pink-light transition-colors">
                      <Link href={tile.href}>
                        {tile.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-lg line-clamp-2">
                      {tile.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

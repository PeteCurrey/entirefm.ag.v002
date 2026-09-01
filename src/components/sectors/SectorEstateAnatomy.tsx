'use client';

import React from 'react';
import Image from 'next/image';

export interface SectorEstateAnatomyProps {
  eyebrow?: string;
  headline: string;
  subline: string;
  imageSrc: string;
  imageAlt: string;
  callouts: Array<{
    area: string;
    title: string;
    description: string;
  }>;
}

export function SectorEstateAnatomy({
  eyebrow = 'ESTATE ANATOMY',
  headline,
  subline,
  imageSrc,
  imageAlt,
  callouts,
}: SectorEstateAnatomyProps) {
  if (!callouts || callouts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {subline}
          </p>
        </div>

        {/* Visual Composition: Large Architectural Image + Surrounding Physical Touchpoints */}
        <div className="space-y-12">
          {/* Main Visual */}
          <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-sm overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.75] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-6 sm:left-8 text-xs font-light text-slate-300">
              <span className="text-brand-pink font-medium uppercase tracking-wider text-[11px] block">
                PHYSICAL ESTATE INFRASTRUCTURE //
              </span>
              Comprehensive building services &amp; hard FM boundary management
            </div>
          </div>

          {/* Clean Architectural Callout Grid (Subtle Hairlines, Not Bento Boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {callouts.map((item, idx) => (
              <div key={idx} className="pt-6 md:pt-0 md:px-6 first:pl-0 space-y-2">
                <span className="text-[11px] text-brand-pink uppercase tracking-wider block font-light">
                  ZONE {String(idx + 1).padStart(2, '0')} // {item.area}
                </span>
                <h3 className="text-base font-light text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

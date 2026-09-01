'use client';

import React from 'react';
import Image from 'next/image';

export interface SectorOperationalRealityProps {
  statement: string;
  leadText: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
  realities: Array<{
    number?: string;
    title: string;
    description: string;
    detail?: string;
  }>;
}

export function SectorOperationalReality({
  statement,
  leadText,
  imageSrc,
  imageAlt,
  imageCaption,
  realities,
}: SectorOperationalRealityProps) {
  if (!realities || realities.length === 0) return null;

  return (
    <section id="operational-reality" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Top Eyebrow & Statement */}
        <div className="max-w-4xl mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
              OPERATIONAL REALITY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.15]">
            {statement}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-3xl">
            {leadText}
          </p>
        </div>

        {/* 60/40 Composition: Image Left + Editorial List Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Full-Height Photographic Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full rounded-sm overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center brightness-[0.88] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              {imageCaption && (
                <div className="absolute bottom-0 left-0 right-0 p-5 text-xs font-light text-slate-300 backdrop-blur-sm bg-slate-950/40 border-t border-white/10">
                  <span className="text-brand-pink-light block text-[10.5px] uppercase tracking-wider mb-1 font-medium">
                    ESTATE CONTEXT
                  </span>
                  {imageCaption}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Realities List (Typography & Thin Rules, Zero Floating Boxes) */}
          <div className="lg:col-span-7 divide-y divide-slate-200">
            {realities.map((item, idx) => {
              const numStr = item.number || String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={idx}
                  className="py-8 first:pt-0 last:pb-0 group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                    <div className="sm:col-span-2">
                      <span className="text-sm text-slate-400 font-light block">
                        {numStr}
                      </span>
                    </div>

                    <div className="sm:col-span-10 space-y-2">
                      <h3 className="text-xl font-light text-slate-900 tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 font-light leading-relaxed">
                        {item.description}
                      </p>
                      {item.detail && (
                        <p className="text-xs text-slate-500 font-light pt-1">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

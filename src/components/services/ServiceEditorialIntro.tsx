'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export interface ServiceEditorialIntroProps {
  eyebrow: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  bullets?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  sideBadge?: { figure: string; label: string };
}

export function ServiceEditorialIntro({
  eyebrow,
  heading,
  subheading,
  paragraphs,
  bullets = [],
  imageSrc,
  imageAlt = '',
  imageCaption,
  sideBadge,
}: ServiceEditorialIntroProps) {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Core Thesis */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                  {eyebrow}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                {heading}
              </h2>
              {subheading && (
                <p className="mt-3 text-base text-slate-600 font-light leading-relaxed">
                  {subheading}
                </p>
              )}
            </div>

            {bullets.length > 0 && (
              <div className="space-y-3 pt-2">
                {bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-pink shrink-0" />
              <span>
                Single-contract operational accountability backed by certified engineering teams.
              </span>
            </div>
          </div>

          {/* Right Column: Explanatory Content & Technical Visual */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {imageSrc && (
              <div className="relative rounded-sm overflow-hidden border border-slate-200 shadow-elevated group">
                <div className="relative h-64 sm:h-80 w-full">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white flex items-end justify-between gap-4">
                  <div>
                    {imageCaption && (
                      <p className="text-xs sm:text-sm font-normal text-slate-200">
                        {imageCaption}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      EntireFM On-Site Engineering Operations
                    </span>
                  </div>

                  {sideBadge && (
                    <div className="bg-slate-900/90 border border-white/20 backdrop-blur-md px-3.5 py-2 rounded-sm text-right shrink-0">
                      <div className="text-sm font-normal text-brand-pink-light">
                        {sideBadge.figure}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {sideBadge.label}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

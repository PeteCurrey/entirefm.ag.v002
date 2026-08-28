'use client';

import React from 'react';
import Image from 'next/image';

interface EditorialImageBreakProps {
  layout?: 'full-bleed' | 'split-60-40' | 'split-40-60' | 'contained-heroic';
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  technicalCaption?: string;
  assetId?: string;
  telemetryTags?: { label: string; value: string }[];
  bulletPoints?: string[];
}

export function EditorialImageBreak({
  layout = 'split-60-40',
  imageSrc,
  imageAlt,
  eyebrow = 'Operational Context',
  title,
  description,
  technicalCaption = 'Primary commercial plant condition inspection — Real-world EntireFM engineering delivery.',
  assetId,
  telemetryTags = [],
  bulletPoints = [],
}: EditorialImageBreakProps) {
  if (layout === 'full-bleed') {
    return (
      <section className="relative my-16 py-24 overflow-hidden bg-[#060A14] border-y border-brand-edge-dark text-white font-sans">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover opacity-30 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/85 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl space-y-4">
            {eyebrow && (
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <h3 className="text-3xl sm:text-4xl font-extralight text-white leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                {description}
              </p>
            )}

            {telemetryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {telemetryTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-sm bg-black/60 border border-white/15 text-xs text-slate-200 font-light"
                  >
                    <span className="text-slate-400">{tag.label}:</span> <strong className="text-brand-pink font-medium">{tag.value}</strong>
                  </span>
                ))}
              </div>
            )}

            {technicalCaption && (
              <p className="text-xs text-slate-400 pt-3 border-t border-white/10 font-light">
                {technicalCaption}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 py-12 bg-brand-carbon/40 border-y border-brand-edge-dark font-sans">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <div className={layout === 'split-60-40' ? 'lg:col-span-7' : 'lg:col-span-5'}>
            <div className="relative rounded-sm overflow-hidden border border-brand-edge-dark shadow-elevated bg-brand-carbon group">
              <div className="aspect-[16/10] relative">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Technical Caption Strip */}
              <div className="p-3.5 bg-brand-carbon border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-300 font-light">
                <span className="truncate max-w-[75%]">{technicalCaption}</span>
                {assetId && <span className="text-brand-pink font-medium shrink-0">{assetId}</span>}
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className={layout === 'split-60-40' ? 'lg:col-span-5 space-y-4' : 'lg:col-span-7 space-y-4'}>
            {eyebrow && (
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                {description}
              </p>
            )}

            {bulletPoints.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {telemetryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {telemetryTags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-sm bg-brand-carbon border border-brand-edge-dark text-xs text-slate-200 font-light">
                    <span className="text-slate-400">{t.label}:</span> <strong className="text-brand-pink font-medium">{t.value}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
      <section className="relative my-16 py-20 overflow-hidden bg-slate-950 border-y border-slate-800 text-white">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-4">
            {eyebrow && (
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block">
                {eyebrow}
              </span>
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

            {telemetryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {telemetryTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-xs font-mono text-pink-300"
                  >
                    {tag.label}: <strong className="text-white">{tag.value}</strong>
                  </span>
                ))}
              </div>
            )}

            {technicalCaption && (
              <p className="text-xs font-mono text-slate-400 pt-2 italic border-t border-slate-800/80">
                {technicalCaption}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 py-12 bg-slate-900/50 border-y border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <div className={layout === 'split-60-40' ? 'lg:col-span-7' : 'lg:col-span-5'}>
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 group">
              <div className="aspect-[16/10] relative">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>

              {/* Technical Caption Strip */}
              <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate max-w-[75%]">{technicalCaption}</span>
                {assetId && <span className="text-pink-400 font-light shrink-0">{assetId}</span>}
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className={layout === 'split-60-40' ? 'lg:col-span-5 space-y-4' : 'lg:col-span-7 space-y-4'}>
            {eyebrow && (
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block">
                {eyebrow}
              </span>
            )}
            {title && (
              <h3 className="text-2xl font-extralight text-white leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                {description}
              </p>
            )}

            {bulletPoints.length > 0 && (
              <ul className="space-y-2 pt-2">
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {telemetryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {telemetryTags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-slate-500">{t.label}:</span> <strong className="text-pink-400">{t.value}</strong>
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

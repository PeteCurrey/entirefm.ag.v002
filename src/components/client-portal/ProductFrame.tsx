'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';

interface ProductFrameProps {
  src: string;
  alt: string;
  caption?: string;
  badge?: string;
  badgeType?: 'live' | 'audit' | 'telemetry' | 'status';
  priority?: boolean;
  aspectRatio?: '16/9' | '16/10' | '4/3' | 'auto';
  className?: string;
  allowZoom?: boolean;
}

export function ProductFrame({
  src,
  alt,
  caption,
  badge,
  badgeType = 'live',
  priority = false,
  aspectRatio = '16/10',
  className = '',
  allowZoom = true,
}: ProductFrameProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const badgeStyles = {
    live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    audit: 'bg-blue-50 text-blue-700 border-blue-200',
    telemetry: 'bg-rose-50 text-brand-pink border-rose-200',
    status: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <>
      <figure className={`group relative rounded-sm border border-slate-200 bg-white p-2.5 sm:p-3 shadow-md transition-all duration-300 hover:border-slate-300 hover:shadow-lg ${className}`}>
        {/* Browser Top Bar Header */}
        <div className="mb-2 sm:mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
            <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
            <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
            <span className="ml-2 text-[11px] font-light text-slate-500 select-none tracking-tight">
              EntireCAFM Console &bull; app.entirecafm.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-[10.5px] font-light ${badgeStyles[badgeType]}`}>
                {badgeType === 'live' && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                )}
                {badge}
              </span>
            )}

            {allowZoom && (
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-slate-200 bg-[#FAF9FB] px-2.5 py-0.5 text-[11px] font-light text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Enlarge screenshot to inspect high-resolution UI details"
                aria-label="Enlarge screenshot"
              >
                <Maximize2 className="h-3 w-3" />
                <span>Inspect Screen</span>
              </button>
            )}
          </div>
        </div>

        {/* Screenshot Container */}
        <div
          className={`relative w-full overflow-hidden rounded-xs bg-slate-900 ${
            aspectRatio === '16/10' ? 'aspect-[16/10]' : aspectRatio === '16/9' ? 'aspect-[16/9]' : aspectRatio === '4/3' ? 'aspect-[4/3]' : ''
          }`}
          onClick={() => allowZoom && setIsZoomed(true)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.008]"
          />
        </div>

        {/* Optional Caption / Telemetry Note */}
        {caption && (
          <figcaption className="mt-2.5 px-1 text-[11.5px] text-slate-500 font-light flex items-center justify-between">
            <span>{caption}</span>
            <span className="text-slate-400 text-[10.5px] hidden sm:inline">EntireCAFM Live Console</span>
          </figcaption>
        )}
      </figure>

      {/* High-Res Modal Overlay */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-[94vw] overflow-auto rounded-sm border border-white/20 bg-slate-900 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 px-2 text-white text-xs font-light">
              <span className="text-slate-300">{alt}</span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-sm bg-white/10 p-1 text-slate-300 hover:bg-white/20 hover:text-white"
                aria-label="Close zoomed view"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-[80vh] w-[90vw] max-w-[1400px]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="90vw"
                className="object-contain object-top"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

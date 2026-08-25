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
    live: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    audit: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    telemetry: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
    status: 'bg-[#F5F5F3] text-[#101010] border-[#E4E4E1]',
  };

  return (
    <>
      <figure className={`group relative rounded-[12px] border border-[#E4E4E1] bg-white p-2 sm:p-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#D1D1CD] hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] ${className}`}>
        {/* Browser Top Bar Header */}
        <div className="mb-2 sm:mb-3 flex items-center justify-between border-b border-[#F0F0EE] pb-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/60 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/60 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/60 inline-block" />
            <span className="ml-2 font-mono text-[10px] sm:text-[11px] text-[#9B9B97] select-none tracking-tight">
              app.entirecafm.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className={`inline-flex items-center gap-1 rounded-[4px] border px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-normal ${badgeStyles[badgeType]}`}>
                {badgeType === 'live' && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" />
                )}
                {badge}
              </span>
            )}

            {allowZoom && (
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-[4px] border border-[#E4E4E1] bg-[#FBFBFA] px-2 py-0.5 font-mono text-[10px] font-normal text-[#686866] hover:bg-[#F0F0EE] hover:text-[#101010] transition-colors"
                title="Enlarge screenshot to inspect high-resolution UI details"
                aria-label="Enlarge screenshot"
              >
                <Maximize2 className="h-3 w-3" />
                <span>Inspect UI</span>
              </button>
            )}
          </div>
        </div>

        {/* Screenshot Container */}
        <div
          className={`relative w-full overflow-hidden rounded-[8px] bg-[#F5F5F3] ${
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
          <figcaption className="mt-2.5 px-1 font-mono text-[11px] text-[#686866] flex items-center justify-between">
            <span>{caption}</span>
            <span className="text-[#9B9B97] text-[10px]">EntireCAFM Live Production Platform</span>
          </figcaption>
        )}
      </figure>

      {/* Lightbox / Zoom Modal for UI Inspection */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-h-[95vh] max-w-[95vw] overflow-auto rounded-[12px] border border-white/20 bg-[#101010] p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-normal text-white tracking-wider">
                  ENTIRECAFM HIGH-RESOLUTION UI INSPECTOR
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70">
                  {alt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close UI Inspector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-[8px]">
              <Image
                src={src}
                alt={alt}
                width={1920}
                height={1200}
                className="h-auto w-full object-contain"
                sizes="95vw"
              />
            </div>
            {caption && (
              <p className="mt-2 px-3 font-mono text-xs text-white/60">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

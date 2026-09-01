import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import type { UsefulThingItem } from '@/data/lobby/types';

interface UsefulThingProps {
  data: UsefulThingItem;
}

export function UsefulThing({ data }: UsefulThingProps) {
  return (
    <article className="w-full bg-[#FAF9F7] border border-neutral-200/80 rounded-sm overflow-hidden group">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-stretch min-h-[420px] lg:min-h-[460px]">
        {/* Physical Handover Context Visual */}
        <div className="relative w-full min-h-[260px] lg:min-h-full overflow-hidden bg-neutral-900">
          <Image
            src={data.imageUrl || "/images/editorial/entirefm-corporate-corridor-1200w.webp"}
            alt={data.imageAlt || data.title}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

          <div className="absolute top-6 left-6 z-10">
            <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/15">
              ONE USEFUL THING · OPERATIONAL TOOL
            </span>
          </div>

          <div className="absolute bottom-6 left-6 z-10">
            <span className="text-xs font-normal text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              Format: {data.format || 'Spreadsheet (.xlsx)'}
            </span>
          </div>
        </div>

        {/* Text Editorial Panel */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6 bg-[#FAF9F7]">
          <div className="space-y-4">
            <span className="text-[11px] font-medium uppercase tracking-widest text-brand-electric block">
              ESTATE MOBILISATION
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 leading-tight">
              {data.title}
            </h3>

            <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed pt-2">
              {data.whyItMatters}
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href={data.actionUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-brand-electric transition-colors group/link"
            >
              <span>Download Handover Matrix</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>

            <span className="text-xs text-neutral-400 font-normal">
              Direct download · No registration
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

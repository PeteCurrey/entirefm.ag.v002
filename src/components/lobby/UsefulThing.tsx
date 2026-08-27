import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { UsefulThingItem } from '@/data/lobby/types';

interface UsefulThingProps {
  data: UsefulThingItem;
}

export function UsefulThing({ data }: UsefulThingProps) {
  return (
    <section className="w-full bg-white overflow-hidden group">
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-[400px] lg:min-h-[480px]">
        {/* Image Side */}
        <div className="relative w-full h-[240px] sm:aspect-video lg:h-full lg:w-full overflow-hidden">
          <Image
            src="/images/editorial/entirefm-site-arrival-1200w.webp"
            alt="EntireFM Site Arrival"
            fill
            priority
            className="object-cover transition-all duration-500 ease-in-out brightness-[0.80] group-hover:brightness-[0.90] scale-100 group-hover:scale-[1.015] motion-reduce:transition-none"
          />
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 text-[10px] text-white tracking-wider border border-white/20 uppercase rounded-sm">
            ↓ {data.format || '.xlsx'}
          </div>
        </div>

        {/* Text Panel */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16 xl:p-20 relative bg-white z-10">
          <div className="space-y-6">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-electric font-medium mb-4">
                ONE USEFUL THING
              </span>
              <h3 className="text-3xl sm:text-4xl font-extralight text-brand-graphite leading-tight mb-6">
                {data.title}
              </h3>
              <p className="text-base font-light text-brand-slate line-clamp-2 mb-6">
                {data.whyItMatters}
              </p>
              
              <div className="inline-block bg-brand-surface px-3 py-1 text-[11px] text-brand-silver rounded-sm">
                {data.format || 'Spreadsheet (.xlsx)'}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-brand-edge/50">
              <Link
                href={data.actionUrl}
                className="inline-flex items-center gap-2 text-sm text-brand-electric hover:text-brand-electric/80 transition-colors group/link font-medium"
              >
                <span>View and download</span>
                <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

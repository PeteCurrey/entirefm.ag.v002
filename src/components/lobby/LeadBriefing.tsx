import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { LeadBriefing as LeadBriefingType } from '@/data/lobby/types';

interface LeadBriefingProps {
  data: LeadBriefingType;
}

export function LeadBriefing({ data }: LeadBriefingProps) {
  return (
    <article className="group relative w-full min-h-[480px] overflow-hidden rounded-sm flex flex-col justify-between p-6 sm:p-8 lg:p-10">
      <Image
        src="/images/editorial/entirefm-rooftop-plant-night-1200w.webp"
        alt={data.title}
        fill
        className="object-cover transition-all duration-300 ease-out brightness-75 group-hover:brightness-90 group-hover:scale-[1.025]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-opacity duration-300 group-hover:opacity-90" />
      
      {/* Top section: Franchise Label & Meta */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <span className="text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase">
          {data.franchise}
        </span>
        <div className="text-[11px] text-white/50 font-light flex items-center gap-2">
          <span>{data.publishedAt}</span>
          <span>·</span>
          <span>{data.readingTime}</span>
        </div>
      </div>

      {/* Bottom section: Content */}
      <div className="relative z-10 mt-auto space-y-6">
        <div>
          {data.keyTakeaways && data.keyTakeaways.length > 0 && (
            <span className="inline-block mb-4 text-[11px] text-white px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm">
              {data.keyTakeaways[0]}
            </span>
          )}
          
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white leading-tight">
            {data.title}
          </h3>
          
          <p className="text-base font-light text-white/80 mt-3 line-clamp-1">
            {data.standfirst}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={data.fullBriefingUrl || '/compliance'}
            className="inline-flex items-center gap-2 text-sm font-light text-white transition-colors hover:text-white/70"
          >
            Read the full briefing
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

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
    <article className="flex flex-col justify-between h-full group">
      {/* Large Architectural Photography Spread */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-sm bg-neutral-900 mb-6">
        <Image
          src={data.imageUrl || "/images/editorial/building-safety-facade-inspection.jpg"}
          alt={data.imageAlt || data.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
        {/* Subtle tonal gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Floating Category Label */}
        <div className="absolute top-6 left-6 z-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
            {data.franchise}
          </span>
        </div>

        {/* Date & Reading Time in Image Footer */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between text-xs text-white/80 font-light">
          <span>{data.publishedAt}</span>
          <span>{data.readingTime}</span>
        </div>
      </div>

      {/* Editorial Headline & Standfirst */}
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 leading-tight tracking-tight">
            <Link href={data.fullBriefingUrl || '/lobby'} className="hover:text-brand-electric transition-colors">
              {data.title}
            </Link>
          </h2>

          <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
            {data.standfirst}
          </p>
        </div>

        {/* Action Link & Editorial Developments */}
        <div className="pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href={data.fullBriefingUrl || '/lobby'}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-brand-electric transition-colors group/link"
          >
            <span>Read the full intelligence briefing</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>

          {data.author && (
            <span className="text-xs text-neutral-500 font-light">
              By {data.author.name} · {data.author.role}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

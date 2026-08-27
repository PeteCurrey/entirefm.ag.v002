import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { BriefingStripItem } from '@/data/lobby/types';

interface BriefingStripProps {
  items: BriefingStripItem[];
}

export function BriefingStrip({ items }: BriefingStripProps) {
  if (!items || items.length === 0) return null;

  const leadItem = items[0];
  const stackedItem1 = items[1];
  const stackedItem2 = items[2];

  // Image priority: topicImage (seed data) → sourceImage (feed) → per-slot editorial default
  const LEAD_DEFAULT = '/images/editorial/entirefm-hvac-refrigerant-check-1200w.webp';
  const STACK1_DEFAULT = '/images/editorial/entirefm-plumbing-booster-set-1200w.webp';
  const STACK2_DEFAULT = '/images/editorial/entirefm-switchgear-inspection-1200w.webp';

  return (
    <section className="bg-[#0a0a0a] py-12">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white/50">
            Briefing Wire
          </h3>
          <Link
            href="/fm-intelligence"
            className="group flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <span>FM Intelligence &rarr;</span>
          </Link>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          
          {/* LEAD CARD */}
          {leadItem && (
            <Link href={leadItem.url || '#'} className="group relative overflow-hidden block min-h-[360px] rounded-sm bg-black lg:col-span-1">
              <Image
                src={leadItem.topicImage || leadItem.sourceImage || LEAD_DEFAULT}
                alt={leadItem.topicImageAlt || leadItem.headline}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.025] transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
              
              {/* Top Meta */}
              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-10">
                <span className="text-xs font-medium text-white uppercase tracking-wider bg-black/50 px-2 py-1 backdrop-blur-sm rounded-sm">
                  {leadItem.category}
                </span>
                <span className="text-[10px] text-white/70 font-mono">
                  {leadItem.timestamp}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end">
                <h4 className="text-2xl sm:text-3xl font-light text-white leading-tight mb-2">
                  {leadItem.headline}
                </h4>
                {leadItem.sourcePublisher && (
                  <span className="self-end text-[10px] text-white/50 mt-4">
                    Via {leadItem.sourcePublisher}
                  </span>
                )}
              </div>
            </Link>
          )}

          {/* STACKED RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            
            {/* Stacked Card 1 */}
            {stackedItem1 && (
              <Link href={stackedItem1.url || '#'} className="group relative overflow-hidden flex min-h-[160px] rounded-sm bg-[#111] border border-white/5 hover:border-white/10 transition-colors h-full">
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image
                    src={stackedItem1.sourceImage || '/images/editorial/entirefm-plumbing-booster-set-1200w.webp'}
                    alt={stackedItem1.headline}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.025] transition-all duration-500 ease-out"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center flex-1 z-10">
                  <span className="text-[10px] font-mono text-brand-electric uppercase tracking-widest mb-2 block">
                    {stackedItem1.category}
                  </span>
                  <h4 className="text-sm font-light text-white leading-snug line-clamp-2 mb-3 group-hover:text-white/80 transition-colors">
                    {stackedItem1.headline}
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">
                      {stackedItem1.sector}
                    </span>
                    {stackedItem1.impactLevel && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/5 text-white/60 border border-white/10">
                        {stackedItem1.impactLevel}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Stacked Card 2 */}
            {stackedItem2 && (
              <Link href={stackedItem2.url || '#'} className="group relative overflow-hidden flex min-h-[160px] rounded-sm bg-[#111] border border-white/5 hover:border-white/10 transition-colors h-full">
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image
                    src={stackedItem2.sourceImage || '/images/editorial/entirefm-switchgear-inspection-1200w.webp'}
                    alt={stackedItem2.headline}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.025] transition-all duration-500 ease-out"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center flex-1 z-10">
                  <span className="text-[10px] font-mono text-brand-electric uppercase tracking-widest mb-2 block">
                    {stackedItem2.category}
                  </span>
                  <h4 className="text-sm font-light text-white leading-snug line-clamp-2 mb-3 group-hover:text-white/80 transition-colors">
                    {stackedItem2.headline}
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">
                      {stackedItem2.sector}
                    </span>
                    {stackedItem2.impactLevel && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/5 text-white/60 border border-white/10">
                        {stackedItem2.impactLevel}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

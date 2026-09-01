import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, ShieldCheck, Radio } from 'lucide-react';
import type { BriefingStripItem } from '@/data/lobby/types';
import { getLatestNewsStream } from '@/server/news/news-store';

interface BriefingStripProps {
  items: BriefingStripItem[];
}

export function BriefingStrip({ items }: BriefingStripProps) {
  if (!items || items.length === 0) return null;

  const leadItem = items[0];
  const secondaryItems = items.slice(1);
  const liveWire = getLatestNewsStream(4);

  const LEAD_DEFAULT = '/images/editorial/entirefm-hvac-refrigerant-check-1200w.webp';
  const STACK1_DEFAULT = '/images/editorial/entirefm-plumbing-booster-set-1200w.webp';
  const STACK2_DEFAULT = '/images/editorial/entirefm-switchgear-inspection-1200w.webp';

  return (
    <section className="bg-white py-14 sm:py-18 border-y border-neutral-200/80">
      <div className="container-wide space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                TODAY IN FM · INDUSTRY NEWS WIRE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
              Briefing Wire &amp; Regulatory Shifts
            </h2>
          </div>

          <Link
            href="/lobby/news"
            className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-brand-electric transition-colors uppercase tracking-wider"
          >
            <span>Visit FM News Desk</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Editorial Index Grid */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
          
          {/* LEAD STORY SPREAD */}
          {leadItem && (
            <article className="group flex flex-col justify-between">
              <Link href={leadItem.url || '/lobby/news'} className="block overflow-hidden rounded-sm relative h-[280px] sm:h-[340px] bg-neutral-100 mb-5">
                <Image
                  src={leadItem.topicImage || leadItem.sourceImage || LEAD_DEFAULT}
                  alt={leadItem.topicImageAlt || leadItem.headline}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                    {leadItem.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/80 font-light">
                  <span>{leadItem.timestamp}</span>
                  {leadItem.sourcePublisher && (
                    <span className="text-white/60 text-[11px]">Via {leadItem.sourcePublisher}</span>
                  )}
                </div>
              </Link>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                  <Link href={leadItem.url || '/lobby/news'}>
                    {leadItem.headline}
                  </Link>
                </h3>
                <p className="text-sm font-light text-neutral-600 leading-relaxed max-w-2xl">
                  {leadItem.summary}
                </p>
              </div>
            </article>
          )}

          {/* SECONDARY STORIES INDEX — Clean Editorial Dividers */}
          <div className="divide-y divide-neutral-200 flex flex-col">
            {secondaryItems.map((item, idx) => {
              const defaultImg = idx === 0 ? STACK1_DEFAULT : STACK2_DEFAULT;
              return (
                <article key={item.id || idx} className="py-6 first:pt-0 last:pb-0 group">
                  <Link href={item.url || '/lobby/news'} className="flex gap-5 items-start">
                    {/* Small Sharp Crop */}
                    <div className="relative w-24 sm:w-28 h-20 sm:h-24 shrink-0 rounded-sm overflow-hidden bg-neutral-100">
                      <Image
                        src={item.topicImage || item.sourceImage || defaultImg}
                        alt={item.headline}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-normal text-neutral-400">
                        <span className="uppercase tracking-wider text-brand-electric font-medium">
                          {item.category}
                        </span>
                        <span>{item.timestamp}</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                        {item.headline}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                        <span>{item.sector}</span>
                        {item.sourcePublisher && (
                          <span className="text-[10px] text-neutral-400">Via {item.sourcePublisher}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

        </div>

        {/* LATEST NEWS STREAM WIRE TICKER */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="bg-[#FAF9F7] border border-neutral-200/80 rounded-sm p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-widest shrink-0">
                <Radio className="w-3.5 h-3.5 text-brand-electric animate-pulse" />
                <span className="font-semibold text-neutral-900">LATEST WIRE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 text-xs divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
                {liveWire.map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={`/lobby/news/article/${item.slug}`}
                    className="group block pt-2 sm:pt-0 sm:px-3 first:pl-0 space-y-1 hover:text-brand-electric transition-colors"
                  >
                    <span className="text-[10px] font-normal text-neutral-400 block uppercase">
                      {item.category.replace('-', ' ')}
                    </span>
                    <p className="font-light text-neutral-800 line-clamp-2 leading-snug group-hover:text-brand-electric">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

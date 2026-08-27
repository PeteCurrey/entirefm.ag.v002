'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { AskEntireFMItem } from '@/data/lobby/types';

interface AskEntireFMProps {
  data: AskEntireFMItem & { fullBriefingUrl?: string };
}

function truncateToWords(str: string, maxWords: number) {
  if (!str) return '';
  const words = str.split(' ');
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + '...';
}

export function AskEntireFM({ data }: AskEntireFMProps) {
  const shortAnswer = truncateToWords(data.fullAnswerSummary || '', 25);

  return (
    <section className="w-full bg-white group overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[400px] lg:min-h-[480px]">
        
        {/* Image Section */}
        <div className="relative w-full h-[280px] lg:h-full overflow-hidden">
          <Image
            src="/images/editorial/entirefm-engineers-office-testing-1200w.webp"
            alt="EntireFM Engineers"
            fill
            className="object-cover transition-all duration-500 ease-in-out brightness-[0.80] group-hover:brightness-95 scale-100 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          {/* Editorial Bleed Gradient (lg+) */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-white pointer-events-none z-10"></div>
        </div>

        {/* Text Section */}
        <div className="p-6 sm:p-10 lg:p-16 xl:p-20 relative bg-white flex flex-col justify-center">
          <span className="block text-[9px] uppercase tracking-[0.25em] text-brand-electric mb-2 font-medium">
            ASK ENTIREFM
          </span>

          <div className="relative mt-4 mb-6">
            <span className="absolute -top-10 -left-6 text-8xl font-extralight text-brand-electric/10 leading-none select-none pointer-events-none">
              “
            </span>
            <h3 className="relative z-10 text-2xl sm:text-3xl font-extralight text-brand-graphite leading-snug italic pt-2">
              {data.question}
            </h3>
            <div className="mt-4 text-[11px] text-brand-silver font-light uppercase tracking-wider">
              {data.askerContext} <span className="mx-1.5 opacity-50">|</span> {data.estateProfile}
            </div>
          </div>

          <div className="mt-6 border-l-2 border-brand-electric/20 pl-5 py-1">
            <p className="text-sm font-light text-brand-slate leading-relaxed mb-4">
              {shortAnswer}
            </p>

            <Link
              href={data.fullBriefingUrl || '#'}
              className="inline-flex items-center gap-1.5 text-sm text-brand-electric hover:text-brand-electric/80 transition-colors group/link font-medium"
            >
              <span>Read the full response</span>
              <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-edge/50 flex flex-wrap items-center justify-between gap-4">
            {/* Responder */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-sm bg-brand-graphite text-white flex items-center justify-center text-[9px] font-mono tracking-tighter">
                EFM
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-brand-graphite font-medium">EntireFM Technical Response</span>
              </div>
            </div>

            <Link
              href="/lobby/community/ask"
              className="text-[11px] text-brand-silver hover:text-brand-electric transition-colors"
            >
              Submit your own question →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

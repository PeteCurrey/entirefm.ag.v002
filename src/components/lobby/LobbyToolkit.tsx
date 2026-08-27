import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wrench, Shield, Calculator } from 'lucide-react';
import type { CuratedResourceItem } from '@/data/lobby/types';

interface LobbyToolkitProps {
  items: CuratedResourceItem[];
}

export function LobbyToolkit({ items }: LobbyToolkitProps) {
  const mainTool = items[0];
  const secondaryTools = items.slice(1);

  return (
    <section className="bg-[#F8F8F6] py-16 sm:py-20 border-y border-neutral-200/80">
      <div className="container-wide">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 block mb-1">
              FM CALCULATORS &amp; MATRICES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
              Operational Toolkit
            </h2>
          </div>

          <Link
            href="/contractor/tools"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>All FM Calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetric Editorial Toolkit Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-stretch">
          
          {/* FEATURED MAIN TOOL */}
          {mainTool && (
            <article className="group bg-white border border-neutral-200/80 rounded-sm overflow-hidden flex flex-col justify-between">
              <div className="relative w-full h-[260px] sm:h-[300px] overflow-hidden bg-neutral-900">
                <Image 
                  src="/images/editorial/entirefm-access-control-install-1200w.webp"
                  alt={mainTool.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                    {mainTool.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={mainTool.url}>
                      {mainTool.title}
                    </Link>
                  </h3>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {mainTool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={mainTool.url}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-electric hover:text-neutral-900 transition-colors uppercase tracking-wider"
                  >
                    <span>Launch Interactive Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <span className="text-xs text-neutral-400 font-mono">
                    Free for FM Teams
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* COMPANION TOOLS LIST */}
          <div className="flex flex-col justify-between gap-4">
            {secondaryTools.map((tool, idx) => {
              const toolImg = idx === 0
                ? '/images/editorial/entirefm-hvac-thermal-survey-1200w.webp'
                : '/images/editorial/entirefm-plumbing-pressure-test-1200w.webp';

              return (
                <article
                  key={tool.id || idx}
                  className="group bg-white border border-neutral-200/80 rounded-sm p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-3 hover:border-neutral-400 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-neutral-100">
                      <Image
                        src={toolImg}
                        alt={tool.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono text-brand-electric uppercase tracking-wider block">
                        {tool.category}
                      </span>
                      <h4 className="text-base font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                        <Link href={tool.url}>
                          {tool.title}
                        </Link>
                      </h4>
                      <p className="text-xs font-light text-neutral-500 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Online Calculator
                    </span>
                    <Link
                      href={tool.url}
                      className="text-xs font-medium text-neutral-900 group-hover:text-brand-electric transition-colors flex items-center gap-1"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

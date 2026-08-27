import React from 'react';
import Link from 'next/link';
import { Download, FileSpreadsheet, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { UsefulThingItem } from '@/data/lobby/types';

interface UsefulThingProps {
  data: UsefulThingItem;
}

export function UsefulThing({ data }: UsefulThingProps) {
  return (
    <div className="border border-brand-edge bg-brand-surface rounded-sm p-6 sm:p-8 lg:p-10 shadow-subtle hover:border-brand-electric/50 transition-all duration-300">
      <div className="grid lg:grid-cols-[1.4fr_1fr] items-center gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-600/10 text-emerald-700 text-[11px] font-medium tracking-wide uppercase">
              ONE USEFUL THING
            </span>
            <span className="text-xs text-brand-silver font-light">· {data.format}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extralight text-brand-graphite leading-tight tracking-tight">
            {data.title}
          </h3>

          <p className="text-sm sm:text-base font-light text-brand-slate leading-relaxed text-pretty">
            {data.description}
          </p>

          <div className="pt-2">
            <p className="text-xs font-light text-brand-silver">
              <strong className="font-normal text-brand-graphite">Why it matters: </strong>
              {data.whyItMatters}
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white border border-brand-edge rounded-sm p-6 space-y-5 text-center sm:text-left flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-brand-edge pb-3 mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand-silver">
                Asset Specifications
              </span>
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-normal border border-emerald-200">
                100% Free &amp; Ungated
              </span>
            </div>

            <ul className="space-y-2 text-xs font-light text-brand-slate mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>120-point verified handover criteria</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Standard UK statutory certificate mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant download in Excel (.xlsx) format</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link
              href={data.actionUrl}
              className="btn-primary w-full justify-center text-xs sm:text-sm py-3"
            >
              <Download className="w-4 h-4" />
              <span>{data.actionLabel}</span>
            </Link>

            <Link
              href="/resources/document-vault"
              className="block text-center text-[11.5px] font-light text-brand-silver hover:text-brand-electric transition-colors"
            >
              Explore all templates in Document Vault →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

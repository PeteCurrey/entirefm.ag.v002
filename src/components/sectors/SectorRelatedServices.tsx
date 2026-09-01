'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export interface SectorRelatedServicesProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  services: Array<{ name: string; href: string; tag: string }>;
  allSectorsHref?: string;
}

export function SectorRelatedServices({
  eyebrow = 'RECOMMENDED CORE DISCIPLINES',
  headline = 'Related Engineering & Facilities Solutions',
  subheadline = 'Directly self-delivered engineering disciplines and specialized services aligned with this operating environment:',
  services,
  allSectorsHref = '/sectors',
}: SectorRelatedServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Header with All Sectors Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
              <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900">
              {headline}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {subheadline}
            </p>
          </div>

          <Link
            href={allSectorsHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-900 hover:text-brand-pink bg-white border border-slate-200 px-4 py-2.5 rounded-sm shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>All 11 Sector Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Grid (Clean Hairlines, Subtle Hover) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {services.map((svc, idx) => (
            <Link
              key={idx}
              href={svc.href}
              className="bg-white border border-slate-200 p-5 rounded-sm flex flex-col justify-between group hover:border-brand-pink/60 hover:shadow-sm transition-all duration-200"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-brand-pink font-light block mb-2">
                  {svc.tag}
                </span>
                <h3 className="text-sm font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors leading-snug">
                  {svc.name}
                </h3>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-light text-slate-500 group-hover:text-slate-900">
                <span>View Discipline</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

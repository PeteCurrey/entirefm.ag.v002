import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Building2, ShieldCheck } from 'lucide-react';
import { listPublishedCaseStudies, type CaseStudy } from '@/server/trust/case-studies';

interface GeoCaseStudiesProps {
  city: string;
}

export function GeoCaseStudies({ city }: GeoCaseStudiesProps) {
  const caseStudies = listPublishedCaseStudies();
  const displayStudies = caseStudies.slice(0, 3);

  if (displayStudies.length === 0) return null;

  return (
    <section className="section-padding bg-brand-surface border-b border-brand-edge">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Operational proof</p>
            <h2 className="text-display-md text-brand-graphite mt-3">
              Case Studies &amp; Verified Delivery
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-silver leading-relaxed">
              Demonstrated engineering execution, statutory risk elimination, and asset lifecycle optimization across UK commercial facilities.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:underline shrink-0"
          >
            View all project case studies
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3-Up Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal>
          {displayStudies.map((cs, i) => (
            <div
              key={cs.id}
              className="group flex flex-col justify-between rounded-sm border border-brand-edge bg-white overflow-hidden shadow-sm hover:border-brand-electric/40 hover:shadow-md transition-all duration-300"
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <div>
                {/* Sector / Feature Banner */}
                <div className="p-6 pb-4 border-b border-brand-edge bg-brand-surface">
                  <div className="flex items-center justify-between text-[11px] font-mono text-brand-silver uppercase tracking-wider mb-1">
                    <span>{cs.sector}</span>
                    <span className="text-emerald-700 font-semibold">{cs.services[0] || 'Integrated FM'}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-graphite leading-snug group-hover:text-brand-graphite">
                    {cs.title}
                  </h3>
                </div>

                {/* Challenge, Approach, Outcome Narrative */}
                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-brand-graphite block uppercase text-[10px] tracking-wider text-rose-700 mb-1">
                      The Operational Challenge:
                    </span>
                    <p className="text-brand-silver leading-relaxed line-clamp-3">
                      {cs.challenge}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-graphite block uppercase text-[10px] tracking-wider text-brand-electric mb-1">
                      EntireFM Intervention:
                    </span>
                    <p className="text-brand-silver leading-relaxed line-clamp-3">
                      {cs.approach}
                    </p>
                  </div>

                  <div className="rounded-sm bg-emerald-50/70 p-3.5 border border-emerald-200/60">
                    <span className="font-bold text-emerald-900 block uppercase text-[10px] tracking-wider mb-1">
                      Contract Outcome:
                    </span>
                    <p className="text-emerald-800 leading-relaxed font-medium">
                      {cs.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-brand-edge text-xs font-semibold text-brand-graphite group-hover:text-brand-pink transition-colors"
                >
                  <span>Review full delivery scope</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

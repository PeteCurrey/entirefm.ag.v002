import React from 'react';
import { ShieldCheck, Cpu, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface GeoDifferentiatorsProps {
  city: string;
}

export function GeoDifferentiators({ city }: GeoDifferentiatorsProps) {
  const pillars = [
    {
      num: '01',
      title: 'Single Accountable Partner',
      subtitle: 'Zero contractor finger-pointing',
      description: `We hold the entire building services scope — Hard FM, planned maintenance, commercial cleaning, and reactive emergency cover — under one contract. When an issue arises in your ${city} building, one team owns the resolution.`,
    },
    {
      num: '02',
      title: 'Direct Engineering Delivery',
      subtitle: 'Qualified technical trades',
      description: `Our work is delivered by qualified M&E, Gas Safe, NICEIC, and F-Gas engineers working to defined SFG20 task specifications, rather than layers of unchecked subcontracts.`,
    },
    {
      num: '03',
      title: 'Digital Compliance Vault',
      subtitle: 'Instant audit readiness',
      description: `Every certificate, gas CP12, EICR, water test, and photographic job sheet is recorded live against the physical asset in EntireCAFM, available 24/7 for landlord, auditor, or insurer review.`,
    },
    {
      num: '04',
      title: 'Contracted Response SLAs',
      subtitle: 'Priority bands agreed per site',
      description: `Emergency out-of-hours response times are agreed based on your building’s occupancy and asset criticality, backed by assigned regional mobile engineers covering ${city}.`,
    },
  ];

  return (
    <section className="section-padding bg-white border-b border-brand-edge">
      <div className="container-wide">
        <div className="max-w-3xl mb-16" data-reveal>
          <p className="eyebrow">The EntireFM difference</p>
          <h2 className="text-display-md text-brand-graphite mt-3">
            Why Property Leaders Choose EntireFM in {city}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-brand-silver leading-relaxed">
            Four operational principles that eliminate facilities friction, protect building compliance, and give property managers complete transparency.
          </p>
        </div>

        {/* 4-Up Asymmetrical Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-reveal>
          {pillars.map((p, idx) => (
            <div
              key={p.num}
              className="group relative flex flex-col justify-between rounded-sm border border-brand-edge bg-brand-surface p-7 transition-all duration-300 ease-brand hover:border-brand-electric/40 hover:bg-white hover:shadow-md"
              style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-spectrum transition-transform duration-300 ease-brand group-hover:scale-x-100"
              />
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-extralight text-brand-silver group-hover:text-brand-pink transition-colors">
                    {p.num}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-brand-pink/60" />
                </div>
                <h3 className="text-lg font-light text-brand-graphite leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs font-normal text-brand-electric uppercase tracking-wider mt-1 mb-3">
                  {p.subtitle}
                </p>
                <p className="text-xs sm:text-[13px] leading-relaxed text-brand-silver">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-edge/60 flex items-center gap-1.5 text-xs text-brand-silver font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Verified Operational Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

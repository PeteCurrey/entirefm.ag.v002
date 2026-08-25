import React from 'react';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Building, CheckCircle2, MapPin, Wrench } from 'lucide-react';
import type { OperatingCondition } from '@/content/locations/tier1-cities';

interface GeoEditorialStoryProps {
  city: string;
  region: string;
  positioning: string;
  operatingConditions?: OperatingCondition[];
  propertyStock?: string[];
  imageSrc?: string;
  imageAlt?: string;
}

export function GeoEditorialStory({
  city,
  region,
  positioning,
  operatingConditions,
  propertyStock,
  imageSrc = '/images/editorial/entirefm-switchroom-survey-2000w.webp',
  imageAlt,
}: GeoEditorialStoryProps) {
  const defaultConditions: OperatingCondition[] = [
    {
      title: 'Access is negotiated, not assumed',
      detail: `Commercial multi-tenant estates across ${city} require permits-to-work, loading-bay scheduling, and out-of-hours arrangements for any intrusive engineering.`,
    },
    {
      title: 'SFG20 maintenance protects asset lifespan',
      detail: `Asset registers built from physical on-site condition audits ensure every chiller, boiler, AHU, and distribution board is serviced to manufacturer task specifications.`,
    },
    {
      title: 'Statutory compliance is legally unalterable',
      detail: 'Fixed-wire EICR testing, gas safety, emergency lighting, and water hygiene sampling are archived with photo evidence and certificates for landlord and insurer scrutiny.',
    },
    {
      title: 'Service charge transparency for managing agents',
      detail: 'Itemised job sheets, digital proof packs, and real-time SLA reporting provide clear evidence for service charge reconciliation and tenant meetings.',
    },
  ];

  const conditions = operatingConditions && operatingConditions.length > 0 ? operatingConditions : defaultConditions;

  return (
    <section className="section-padding bg-white border-b border-brand-edge overflow-hidden">
      <div className="container-wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-16" data-reveal>
          <p className="eyebrow">Local estate realities</p>
          <h2 className="text-display-md text-brand-graphite mt-3">
            What makes maintaining commercial property in {city} different?
          </h2>
          <p className="mt-4 text-base text-brand-silver leading-relaxed">
            {positioning ||
              `Every UK city has distinct building stock, transport constraints, and regulatory pressures. EntireFM engineers navigate the physical and commercial realities of ${city}'s estates:`}
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Full-Height Photographic Anchor */}
          <div className="lg:col-span-5 relative" data-reveal>
            <div className="group relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-sm border border-brand-edge bg-brand-surface shadow-sm">
              <Image
                src={imageSrc}
                alt={imageAlt || `EntireFM facilities management operations across ${city}`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-graphite/90 via-brand-graphite/30 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="eyebrow eyebrow-dark mb-2 block text-brand-pink-light">
                  {city.toUpperCase()} // REGIONAL COVERAGE
                </span>
                <p className="text-lg font-light leading-snug tracking-tight text-white">
                  Engineering-led facilities delivery across {region || `${city} and conurbation`}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-brand-mist/80 font-mono">
                  <ShieldCheck className="h-4 w-4 text-brand-pink" />
                  <span>Direct Mobile Engineering Network</span>
                </div>
              </div>
            </div>

            {/* Local Property Stock Mini-Pills */}
            {propertyStock && propertyStock.length > 0 && (
              <div className="mt-6 p-6 rounded-sm bg-brand-surface border border-brand-edge space-y-3" data-reveal>
                <p className="text-xs font-normal uppercase tracking-wider text-brand-graphite">
                  Common Property Types Maintained in {city}:
                </p>
                <ul className="space-y-2 text-xs text-brand-silver">
                  {propertyStock.slice(0, 4).map((stock, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-pink shrink-0 mt-1.5" />
                      <span>{stock}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Numbered Narrative & Operational Conditions */}
          <div className="lg:col-span-7 space-y-4" data-reveal>
            {conditions.map((item, idx) => (
              <div
                key={item.title}
                className="group relative rounded-sm border border-brand-edge bg-brand-surface p-6 sm:p-7 transition-all duration-300 ease-brand hover:border-brand-electric/40 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-brand-edge bg-white font-mono text-xs font-normal text-brand-graphite transition-colors duration-300 group-hover:border-brand-pink/40 group-hover:bg-brand-pink/10 group-hover:text-brand-pink">
                    0{idx + 1}
                  </span>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-base sm:text-lg font-light text-brand-graphite transition-colors group-hover:text-brand-graphite">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13.5px] leading-relaxed text-brand-silver">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-brand-edge/60 flex items-center justify-between text-[11px] text-brand-silver font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    EntireFM Protocol Active
                  </span>
                  <span className="text-brand-silver/70">Verified Local Standard</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

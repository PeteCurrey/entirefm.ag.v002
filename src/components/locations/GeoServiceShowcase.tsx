import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Cpu, Wind, ShieldCheck, Sparkles, Factory, Building2, Wrench, Flame } from 'lucide-react';

interface GeoServiceShowcaseProps {
  city: string;
}

export function GeoServiceShowcase({ city }: GeoServiceShowcaseProps) {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');

  const services = [
    {
      title: 'Mechanical & Electrical (M&E)',
      category: 'Hard FM',
      description: `Qualified M&E engineers delivering power distribution, switchgear maintenance, lighting, pumps and plant room servicing across ${city}.`,
      href: '/mechanical-electrical',
      icon: Cpu,
      tag: 'Core Engineering',
    },
    {
      title: 'Commercial HVAC & Air Conditioning',
      category: 'Thermal Comfort',
      description: `Chillers, air handling units, VRF systems, F-Gas log compliance and emergency breakdown attendance across ${city} offices.`,
      href: '/hvac-contractor',
      icon: Wind,
      tag: 'F-Gas Certified',
    },
    {
      title: 'Planned Preventative Maintenance (PPM)',
      category: 'SFG20 Compliance',
      description: `Asset condition surveys, 52-week compliance calendars and statutory testing (EICR, Gas CP12, Fire) on a single unified schedule.`,
      href: '/ppm',
      icon: ShieldCheck,
      tag: 'Statutory Safety',
    },
    {
      title: 'Commercial & Office Cleaning',
      category: 'Soft FM',
      description: `Daily contract office cleaning, daytime janitorial cover, waste management and specialist hygiene for ${city} workplaces.`,
      href: `/commercial-cleaning-${citySlug}`.match(/london|manchester|birmingham|sheffield|leeds|lincoln/)
        ? `/commercial-cleaning-${citySlug}`
        : '/commercial-cleaning',
      icon: Sparkles,
      tag: 'Workplace Hygiene',
    },
    {
      title: 'Industrial & Specialist Decontamination',
      category: 'High-Risk Services',
      description: `Factory floor scrubbing, high-level structural cleaning, silo washes and builders cleans for ${city} industrial estates.`,
      href: `/industrial-cleaning-${citySlug}`.match(/london|manchester|birmingham|sheffield|leeds|lincoln/)
        ? `/industrial-cleaning-${citySlug}`
        : '/industrial-cleaning',
      icon: Factory,
      tag: 'Heavy Industrial',
    },
    {
      title: 'Building Fabric & Reactive Repairs',
      category: 'Fabric Maintenance',
      description: `Glazing, roofing, commercial door entry, carpentry, flooring and 24/7 reactive attendance maintaining tenant safety and building value.`,
      href: '/building-maintenance',
      icon: Building2,
      tag: '24/7 Cover',
    },
  ];

  return (
    <section className="section-padding bg-brand-surface border-b border-brand-edge">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Integrated delivery</p>
            <h2 className="text-display-md text-brand-graphite mt-3">
              Services We Provide in {city}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-silver leading-relaxed">
              Every discipline delivered under a single accountable contract, with all certificates and job records archived digitally in our CAFM system.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-pink hover:underline shrink-0"
          >
            Explore all capabilities
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 6-Up Rich Service Capability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal>
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.title}
                href={svc.href}
                className="group relative flex flex-col justify-between rounded-sm border border-brand-edge bg-white p-7 transition-all duration-300 ease-brand hover:border-brand-electric/40 hover:shadow-md"
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-spectrum transition-transform duration-300 ease-brand group-hover:scale-x-100"
                />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="eyebrow">{svc.category}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-surface border border-brand-edge text-brand-silver group-hover:border-brand-pink/30 group-hover:text-brand-pink">
                      {svc.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-10 h-10 rounded-sm bg-brand-surface border border-brand-edge flex items-center justify-center shrink-0 group-hover:border-brand-pink/40 group-hover:bg-brand-pink/10 transition-colors">
                      <Icon className="h-5 w-5 text-brand-silver group-hover:text-brand-pink transition-colors" />
                    </div>
                    <h3 className="text-base sm:text-lg font-light text-brand-graphite leading-snug group-hover:text-brand-graphite">
                      {svc.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-brand-silver">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-edge flex items-center justify-between text-xs font-normal text-brand-graphite group-hover:text-brand-pink transition-colors">
                  <span>View service specification</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

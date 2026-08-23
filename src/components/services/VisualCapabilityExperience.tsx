'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface VisualCapabilityItem {
  name: string;
  description: string;
  tag?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  keyPoints?: string[];
  isFeatured?: boolean;
}

export interface VisualCapabilityExperienceProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  capabilities: VisualCapabilityItem[];
}

export function VisualCapabilityExperience({
  eyebrow = 'SPECIALIST SCOPE & DELIVERY',
  title,
  subtitle,
  capabilities,
}: VisualCapabilityExperienceProps) {
  if (!capabilities || capabilities.length === 0) return null;

  // Split into featured item (if any) and regular items
  const featured = capabilities.find(c => c.isFeatured) || capabilities[0];
  const remaining = capabilities.filter(c => c !== featured);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Featured Big Card + Grid */}
        <div className="space-y-8">
          {featured && featured.imageSrc && (
            <div className="bg-white border border-slate-200/90 rounded-sm overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12 group">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[18rem] overflow-hidden">
                <Image
                  src={featured.imageSrc}
                  alt={featured.imageAlt || featured.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/20" />
                {featured.tag && (
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-brand-pink-light border border-white/15 px-3 py-1 text-xs font-mono font-bold rounded-sm backdrop-blur-md">
                    {featured.tag}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block mb-1">
                    PRIMARY CAPABILITY
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {featured.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {featured.description}
                  </p>

                  {featured.keyPoints && featured.keyPoints.length > 0 && (
                    <div className="space-y-2 mb-6 pt-2 border-t border-slate-100">
                      {featured.keyPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {featured.href ? (
                  <Link
                    href={featured.href}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-pink hover:text-brand-magenta transition-colors pt-4 border-t border-slate-100"
                  >
                    <span>Learn More About {featured.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="text-xs text-slate-400 font-mono pt-4 border-t border-slate-100">
                    Standardised SFG20 & Statutory Delivery
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remaining Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((cap, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-sm overflow-hidden flex flex-col justify-between group hover:-translate-y-1 hover:shadow-elevated hover:border-brand-pink/40 transition-all duration-300"
              >
                <div>
                  {cap.imageSrc ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={cap.imageSrc}
                        alt={cap.imageAlt || cap.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      {cap.tag && (
                        <div className="absolute bottom-3 left-3 bg-slate-900/90 text-brand-pink-light border border-white/15 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-sm backdrop-blur-sm">
                          {cap.tag}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-2 bg-gradient-to-r from-brand-pink-light to-brand-magenta" />
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-graphite transition-colors">
                      {cap.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cap.description}
                    </p>

                    {cap.keyPoints && cap.keyPoints.length > 0 && (
                      <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                        {cap.keyPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {cap.href ? (
                    <Link
                      href={cap.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:text-brand-magenta transition-colors"
                    >
                      <span>Explore service</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400">
                      EntireFM Certified Delivery
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

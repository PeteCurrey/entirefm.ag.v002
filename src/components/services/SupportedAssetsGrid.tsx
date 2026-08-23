'use client';

import React from 'react';
import { BrandIcon, BrandIconKey } from '@/components/ui/BrandIcon';
import { CheckCircle2, Wrench } from 'lucide-react';

export interface AssetCategory {
  title: string;
  subtitle?: string;
  iconName?: BrandIconKey;
  assets: string[];
}

export interface SupportedAssetsGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categories: AssetCategory[];
}

export function SupportedAssetsGrid({
  eyebrow = 'PLANT & INFRASTRUCTURE COVERAGE',
  title,
  subtitle,
  categories,
}: SupportedAssetsGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-brand-graphite text-white relative overflow-hidden border-y border-brand-edge-dark">
      {/* Blueprint grid / facet rule background */}
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 opacity-25"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-light">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-7 flex flex-col justify-between group hover:border-brand-pink/50 hover:shadow-glow transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  {cat.iconName ? (
                    <div className="w-12 h-12 rounded-sm bg-brand-graphite border border-brand-edge-dark p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BrandIcon name={cat.iconName} size={32} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-sm bg-brand-pink/10 border border-brand-pink/30 flex items-center justify-center shrink-0 text-brand-pink">
                      <Wrench className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-pink-light transition-colors">
                      {cat.title}
                    </h3>
                    {cat.subtitle && (
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {cat.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-brand-edge-dark/60">
                  {cat.assets.map((asset, aIdx) => (
                    <li
                      key={aIdx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                      <span>{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-brand-edge-dark/40 text-[11px] font-mono text-slate-400">
                Statutory & SFG20 Aligned
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

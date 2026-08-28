'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Clock, ShieldCheck, ArrowRight, Layers, FileText, CheckCircle2 } from 'lucide-react';

interface ResourceHeroProps {
  breadcrumbs: { name: string; url: string }[];
  category: string;
  categoryHref?: string;
  title: string;
  intro: string;
  readingTime?: string;
  technicalTier?: string;
  audience?: string;
  standard?: string;
  visualType?: 'telemetry' | 'cafm-radar' | 'chiller-condition' | 'thermal-scan' | 'spatial-hierarchy' | 'image';
  imageSrc?: string;
  imageAlt?: string;
  systemMetrics?: { label: string; value: string; status?: 'normal' | 'active' | 'warning' }[];
  className?: string;
}

export function ResourceHero({
  breadcrumbs,
  category,
  categoryHref = '/resources',
  title,
  intro,
  readingTime = '12 min read',
  technicalTier = 'Strategic & Operational Intelligence',
  audience = 'Estates Directors, FM Leads & Operations Teams',
  standard = 'UK Statutory & SFG20 Standards',
  imageSrc = '/images/editorial/entirefm-client-review-2000w.webp',
  imageAlt,
  systemMetrics = [
    { label: 'Asset Integration', value: 'BMS Telemetry & CAFM Bus' },
    { label: 'Maintenance Standard', value: 'SFG20 & Statutory Mandates' },
    { label: 'Safety Governance', value: 'Certified Human Verification' },
  ],
  className = '',
}: ResourceHeroProps) {
  return (
    <section className={`relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] text-white overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark font-sans ${className}`}>
      {/* Background Architectural Canvas with Subtle Contrast Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="max-w-4xl space-y-6">
          
          {/* Breadcrumb Strip */}
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
          </div>

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            <Link href={categoryHref} className="text-xs uppercase tracking-widest text-white/90 font-medium hover:text-white transition-colors">
              {category}
            </Link>
          </div>

          {/* Headline — Work Sans Extra Light */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
            {title}
          </h1>

          {/* Intro Narrative */}
          <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
            {intro}
          </p>

          {/* Structural Metadata Strip — Pure Work Sans, No Monospace */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
            <div className="p-4 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                Reading Duration
              </span>
              <span className="text-sm font-normal text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-pink" />
                {readingTime}
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                Target Audience
              </span>
              <span className="text-sm font-normal text-slate-200 truncate block">
                {audience}
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                Compliance Standard
              </span>
              <span className="text-sm font-normal text-brand-pink truncate block">
                {standard}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, PhoneCall, ShieldCheck, MapPin, Layers, Flame, Construction, Box } from 'lucide-react';

export function DroneFinalHeroCta() {
  return (
    <section 
      aria-label="Plan Commercial Aerial Asset Inspection"
      className="relative min-h-[560px] lg:min-h-[640px] flex items-center justify-center bg-brand-void text-white overflow-hidden py-24 border-t border-brand-edge-dark"
    >
      {/* Cinematic Full-Width Dusk Aerial Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
          alt="EntireFM commercial drone aerial inspection pulling away from major commercial logistics estate at dusk"
          fill
          className="object-cover object-center filter brightness-[0.45] contrast-[1.15] scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/70 to-brand-void/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(6,10,20,0.85)_100%)]" />
      </div>

      {/* Subtle Technical Grid Lines */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="container-custom relative z-10 w-full text-center space-y-10 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15">
          <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white font-medium">
            COMMERCIAL FLIGHT PLANNING
          </span>
        </div>

        {/* Minimal High-Impact Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extralight tracking-[-0.04em] text-white leading-[1.05]">
            PUT YOUR ESTATE <br />
            <span className="bg-gradient-to-r from-white via-brand-mist to-hero-pink bg-clip-text text-transparent font-light">
              ON THE MAP.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Plan an aerial inspection programme around your buildings, maintenance priorities, and statutory asset compliance strategy.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/tools/drone-inspection-planner"
            className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-4 text-sm font-medium text-white shadow-elevated hover:shadow-glow-pink hover:scale-[1.02] transition-all duration-300 group"
          >
            <span>PLAN A DRONE INSPECTION</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.06] backdrop-blur-md px-7 py-4 text-sm font-normal text-white hover:bg-white/[0.12] hover:border-white/35 transition-all duration-200"
          >
            <PhoneCall className="h-4 w-4 text-brand-electric-bright" />
            <span>DISCUSS A MULTI-SITE PROGRAMME</span>
          </Link>
        </div>

        {/* Supporting Routes Shortcuts */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-400">
          <span className="text-slate-500 uppercase tracking-widest text-[10px] block w-full sm:w-auto">
            Quick Route Navigation:
          </span>
          <Link href="/services/drone-services/roof-inspections" className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
            <Layers className="h-3.5 w-3.5 text-brand-pink" />
            <span>Roof Condition</span>
          </Link>
          <Link href="/services/drone-services/thermal-imaging" className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
            <Flame className="h-3.5 w-3.5 text-brand-electric-bright" />
            <span>Thermal Survey</span>
          </Link>
          <Link href="/services/drone-services/construction-monitoring" className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
            <Construction className="h-3.5 w-3.5 text-amber-400" />
            <span>Construction Monitoring</span>
          </Link>
          <Link href="/services/drone-services/digital-twin-3d-capture" className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
            <Box className="h-3.5 w-3.5 text-brand-pink-light" />
            <span>Digital Twin 3D</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

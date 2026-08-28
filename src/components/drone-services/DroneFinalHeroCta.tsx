'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, PhoneCall, Layers, Flame, Construction, Box } from 'lucide-react';

export function DroneFinalHeroCta() {
  return (
    <section 
      aria-label="Plan Commercial Aerial Asset Inspection"
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center bg-brand-void text-white overflow-hidden py-24 border-t border-brand-edge-dark"
    >
      {/* Full-Bleed Dusk Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/drone/contact_poster.png"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15] scale-105"
        >
          <source src="/video/drone/contact.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/60 to-brand-void/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(6,10,20,0.85)_100%)]" />
      </div>

      <div className="container-custom relative z-10 w-full text-center space-y-10 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15">
          <span className="h-2 w-2 rounded-full bg-brand-pink" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-white font-medium">
            COMMERCIAL FLIGHT PLANNING
          </span>
        </div>

        {/* Minimal High-Impact Editorial Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extralight tracking-[-0.04em] text-white leading-[1.08]">
            See more. Know more. <br />
            <span className="bg-gradient-to-r from-white via-brand-mist to-hero-pink bg-clip-text text-transparent font-light">
              Fix it earlier.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Plan a bespoke aerial inspection programme around your commercial portfolio, maintenance priorities, and statutory asset compliance strategy.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/tools/drone-inspection-planner"
            className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-4 text-sm font-medium text-white shadow-elevated hover:shadow-glow-pink hover:scale-[1.02] transition-all duration-300 group"
          >
            <span>Plan a Drone Inspection</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.06] backdrop-blur-md px-7 py-4 text-sm font-normal text-white hover:bg-white/[0.12] hover:border-white/35 transition-all duration-200"
          >
            <PhoneCall className="h-4 w-4 text-brand-electric-bright" />
            <span>Discuss a Multi-Site Programme</span>
          </Link>
        </div>

        {/* Supporting Routes Shortcuts */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-light">
          <span className="text-slate-500 uppercase tracking-widest text-[10px] block w-full sm:w-auto">
            Direct Service Pages:
          </span>
          <Link href="/services/drone-services/roof-inspections" className="hover:text-brand-pink transition-colors">
            Roof Condition
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/services/drone-services/thermal-imaging" className="hover:text-brand-pink transition-colors">
            Thermal Survey
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/services/drone-services/construction-monitoring" className="hover:text-brand-pink transition-colors">
            Construction Monitoring
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/services/drone-services/digital-twin-3d-capture" className="hover:text-brand-pink transition-colors">
            Digital Twin 3D
          </Link>
        </div>
      </div>
    </section>
  );
}

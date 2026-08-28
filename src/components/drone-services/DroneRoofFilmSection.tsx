'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';

export function DroneRoofFilmSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<'membrane' | 'drainage' | 'plant'>('membrane');

  return (
    <section 
      aria-label="High-Resolution Roof Inspection Film"
      className="relative min-h-[85vh] lg:min-h-screen flex items-center justify-center bg-brand-void text-white overflow-hidden py-20"
    >
      {/* Full-Bleed Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/drone/inspection_poster.png"
          className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1] scale-105"
        >
          <source src="/video/drone/inspection.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/30 to-brand-void/60" />
      </div>

      {/* Subtle Structural Building Annotations on the Video */}
      <div className="absolute inset-0 z-10 pointer-events-none max-w-7xl mx-auto px-6 hidden sm:block">
        {/* Annotation 1: Roof Membrane */}
        <div 
          className="absolute top-[28%] left-[22%] pointer-events-auto cursor-pointer transition-all duration-300"
          onClick={() => setActiveAnnotation('membrane')}
        >
          <div className="flex items-center gap-3 bg-brand-void/80 backdrop-blur-md px-3.5 py-2 rounded-sm border border-white/15 text-xs text-white hover:border-brand-pink transition-colors">
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="font-medium tracking-wide">ROOF MEMBRANE &amp; SEAMS</span>
          </div>
        </div>

        {/* Annotation 2: Drainage & Valley Gutters */}
        <div 
          className="absolute top-[48%] right-[24%] pointer-events-auto cursor-pointer transition-all duration-300"
          onClick={() => setActiveAnnotation('drainage')}
        >
          <div className="flex items-center gap-3 bg-brand-void/80 backdrop-blur-md px-3.5 py-2 rounded-sm border border-white/15 text-xs text-white hover:border-brand-pink transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-medium tracking-wide">VALLEY GUTTER DRAINAGE</span>
          </div>
        </div>

        {/* Annotation 3: Rooftop HVAC Plant Deck */}
        <div 
          className="absolute bottom-[24%] left-[34%] pointer-events-auto cursor-pointer transition-all duration-300"
          onClick={() => setActiveAnnotation('plant')}
        >
          <div className="flex items-center gap-3 bg-brand-void/80 backdrop-blur-md px-3.5 py-2 rounded-sm border border-white/15 text-xs text-white hover:border-brand-pink transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-medium tracking-wide">ROOFTOP HVAC PLANT DECK</span>
          </div>
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="container-custom relative z-20 w-full">
        <div className="max-w-2xl bg-brand-carbon/80 backdrop-blur-xl p-8 sm:p-12 rounded-sm border border-white/10 space-y-6 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-medium">
            <span>AERIAL FABRIC EVALUATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            See the whole roof <br />
            <span className="font-light text-hero-pink">
              without putting people on it.
            </span>
          </h2>

          <p className="text-base text-slate-300 font-light leading-relaxed">
            High-resolution aerial inspection allows inaccessible building fabric, single-ply membranes, parapets, and complex drainage valleys to be assessed rapidly before costly scaffolding, cherry pickers, or rope access teams are commissioned.
          </p>

          <div className="pt-2">
            <Link
              href="/services/drone-services/roof-inspections"
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-pink transition-colors group"
            >
              <span>Explore Roof &amp; Gutter Inspections</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-brand-pink" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

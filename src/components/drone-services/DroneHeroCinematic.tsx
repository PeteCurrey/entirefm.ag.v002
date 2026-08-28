'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export function DroneHeroCinematic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section 
      aria-label="Drone Services Cinematic Hero"
      className="relative min-h-[calc(100svh-80px)] lg:min-h-[calc(100dvh-80px)] flex items-center justify-center bg-brand-void text-white overflow-hidden"
    >
      {/* Full-Bleed Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="/images/drone/hero_poster.jpg"
            className="w-full h-full object-cover object-center filter brightness-[0.60] contrast-[1.1] scale-105 transition-transform duration-1000"
          >
            <source src="/video/drone/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/drone/hero_poster.jpg"
            alt="Commercial building aerial survey"
            fill
            priority
            className="object-cover object-center filter brightness-[0.60] contrast-[1.1]"
            sizes="100vw"
          />
        )}

        {/* Elegant Architectural Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/40 to-brand-void/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(6,10,20,0.6)_100%)] pointer-events-none" />
      </div>

      {/* Video Control Bar */}
      <div className="absolute top-24 right-6 sm:right-12 z-20 hidden sm:flex items-center gap-2 bg-brand-void/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
        <button
          onClick={togglePlay}
          className="hover:text-white transition-colors p-1"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <div className="w-px h-3 bg-white/20" />
        <button
          onClick={toggleMute}
          className="hover:text-white transition-colors p-1"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Main Hero Content */}
      <div className="container-custom relative z-10 w-full pt-28 pb-20 sm:py-32 flex flex-col justify-center min-h-[85vh]">
        <div className="max-w-4xl space-y-8">
          
          {/* Refined Eyebrow */}
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-slate-300">
              AERIAL ASSET INTELLIGENCE
            </span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] text-white leading-[1.08]">
            Drone Inspection, <br />
            Surveying &amp; <br />
            <span className="font-light text-hero-pink">
              Asset Intelligence.
            </span>
          </h1>

          {/* Body Narrative */}
          <p className="text-lg sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
            Commercial aerial inspection connected directly to the engineers, surveyors, and trade specialists who maintain, repair, and manage the building.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/tools/drone-inspection-planner"
              className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-4 text-sm font-medium text-white shadow-elevated hover:shadow-glow-pink hover:scale-[1.02] transition-all duration-300 group"
            >
              <span>Plan a Drone Inspection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#capabilities"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 bg-white/10 backdrop-blur-md px-7 py-4 text-sm font-normal text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200"
            >
              <span>Explore Capabilities</span>
            </Link>
          </div>

          {/* Understated Proof Points */}
          <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs tracking-wider text-slate-300 font-light">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Roof &amp; Façade Inspections
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Radiometric Thermal Surveys
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Orthomosaic GIS &amp; Topography
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Construction Milestones
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Photogrammetry &amp; Digital Twins
            </span>
          </div>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Scroll</span>
        <ChevronDown className="h-4 w-4 text-slate-300 animate-bounce" />
      </div>
    </section>
  );
}

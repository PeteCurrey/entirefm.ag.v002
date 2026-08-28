'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Radio, 
  Compass, 
  Crosshair, 
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';

export function DroneHeroCinematic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      aria-label="Commercial Drone Aerial Asset Intelligence"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center bg-brand-void text-white overflow-hidden pt-24 pb-16"
    >
      {/* Background Cinematic Video / Photographic Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {!reducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
            className="w-full h-full object-cover object-center scale-[1.03] opacity-60 transition-opacity duration-1000"
          >
            <source src="/video/entirefm-facilities-management.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
            alt="EntireFM commercial drone aerial inspection operating over commercial building roofscape at blue hour"
            fill
            priority
            className="object-cover object-center opacity-55"
            sizes="100vw"
          />
        )}

        {/* Sophisticated Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/65 to-brand-void/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-void/90 via-brand-void/50 to-brand-void/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(6,10,20,0.85)_100%)]" />
      </div>

      {/* Subtle Technical Architectural Grid & HUD Lines */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Corner Telemetry Bracket Markers */}
      <div aria-hidden="true" className="hidden lg:block pointer-events-none absolute inset-x-8 inset-y-24 z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
      </div>

      {/* Main Content & Mission Telemetry */}
      <div className="container-custom relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-7">
            {/* Eyebrow / Flight Status Chip */}
            <div className="inline-flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white font-medium">
                  AERIAL ASSET INTELLIGENCE
                </span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-brand-carbon/80 border border-brand-edge-dark font-mono text-[10px] text-brand-electric-bright">
                <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
                <span>RTK DUAL-BAND · ACTIVE</span>
              </div>
            </div>

            {/* Main H1 Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[4.2rem] font-extralight tracking-[-0.04em] text-white leading-[1.06]">
                Drone Inspection, <br />
                <span className="bg-gradient-to-r from-white via-brand-mist to-brand-pink-light bg-clip-text text-transparent font-light">
                  Surveying &amp; Asset Intelligence
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-light max-w-2xl">
                Commercial drone surveys for buildings, estates, and critical infrastructure — engineered to isolate defects, scope repairs, and directly deliver self-executed hard FM remediation.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/tools/drone-inspection-planner"
                className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-4 text-sm font-medium text-white shadow-elevated hover:shadow-glow-pink hover:scale-[1.02] transition-all duration-300 group"
              >
                <span>PLAN A DRONE INSPECTION</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#aerial-to-repair"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.06] backdrop-blur-md px-6 py-4 text-sm font-normal text-white hover:bg-white/[0.12] hover:border-white/35 transition-all duration-200"
              >
                <Layers className="h-4 w-4 text-brand-electric-bright" />
                <span>EXPLORE CAPABILITIES</span>
              </a>
            </div>

            {/* Proposition Reassurance Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-300">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Access Risk</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Zero Initial Scaffolding
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Spatial Accuracy</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Crosshair className="h-3.5 w-3.5 text-brand-electric-bright" />
                  RTK Sub-Centimetre
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Output Bridge</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-brand-pink" />
                  Direct CAFM Work Orders
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Execution</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-emerald-400" />
                  Self-Delivered Trades
                </span>
              </div>
            </div>
          </div>

          {/* Right Live Telemetry Card (Desktop Authentic HUD) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="rounded-sm bg-brand-carbon/90 border border-brand-edge-dark p-6 backdrop-blur-xl space-y-5 shadow-elevated relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-electric/10 rounded-full blur-2xl pointer-events-none" />

              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-brand-mist">
                  <Crosshair className="h-3.5 w-3.5 text-brand-pink" />
                  <span className="uppercase tracking-widest text-white text-[11px] font-medium">MISSION TELEMETRY</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE LINK
                </span>
              </div>

              {/* Live Mission Readouts */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">TARGET SITE</span>
                  <span className="text-white font-medium">LOGISTICS ESTATE / UK</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">AIRSPACE / CAA</span>
                  <span className="text-emerald-400 font-medium">OPERATIONAL AUTHORISATION</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">COORDINATES</span>
                  <span className="text-slate-200">53.3811° N · 1.4701° W</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">SURVEY SENSOR</span>
                  <span className="text-brand-electric-bright">48MP RGB + FLIR 640T</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">ALTITUDE / GSD</span>
                  <span className="text-white">42M AGL · 0.42 CM/PX</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">CAFM DISPATCH</span>
                  <span className="text-brand-pink">READY (ENTIRECAFM SYNC)</span>
                </div>
              </div>

              {/* Media Controls */}
              {!reducedMotion && (
                <div className="pt-3 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[10px] text-slate-500">AERIAL FEED CONTROLS</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause background aerial video' : 'Play background aerial video'}
                      className="p-1.5 rounded-sm bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="p-1.5 rounded-sm bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <a 
        href="#aerial-to-repair"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-300 group"
        aria-label="Scroll to Aerial-to-Repair Lifecycle"
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-slate-400 group-hover:text-brand-pink transition-colors">
          DISCOVER LIFECYCLE
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-brand-pink" />
      </a>
    </section>
  );
}

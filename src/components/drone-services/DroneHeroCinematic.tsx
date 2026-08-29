'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Drone Services', url: '/services/drone-services' },
  ];

  return (
    <section 
      aria-label="Drone Services Cinematic Hero"
      className="on-dark relative isolate flex min-h-[100svh] min-h-[36rem] sm:min-h-[42rem] lg:min-h-screen w-full flex-col justify-between overflow-hidden bg-brand-void lg:[height:100svh]"
    >
      {/* Full-Bleed Background Video */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="/images/drone/hero_poster.jpg"
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] scale-105 transition-transform duration-1000"
          >
            <source src="/video/drone/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/drone/hero_poster.jpg"
            alt="Commercial building aerial survey"
            fill
            priority
            className="object-cover object-center filter brightness-[0.78] contrast-[1.08]"
            sizes="100vw"
          />
        )}
      </div>

      {/* Uniform overlay matching digital-twin lightness */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(96deg, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.55) 45%, rgba(6,10,20,0.30) 78%, rgba(6,10,20,0.15) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-36"
        style={{ background: 'linear-gradient(to top, rgba(6,10,20,0.9), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30"
      />

      {/* Video Control Bar */}
      <div className="absolute top-[calc(var(--header-h)+0.5rem)] right-4 sm:right-8 lg:right-12 z-20 hidden sm:flex items-center gap-2 bg-brand-void/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
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

      {/* Breadcrumbs offset past header — Exactly matching M&E page */}
      <div className="relative pt-[calc(var(--header-h)+0.25rem)]">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Main Hero Content — Aligned to container-wide grid */}
      <div className="container-wide relative flex flex-1 flex-col justify-center py-6 sm:py-8 pb-10 sm:pb-14">
        <div className="max-w-3xl">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              AERIAL ASSET INTELLIGENCE
            </span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-display-xl text-white">
            Drone Inspection, Surveying &amp;{' '}
            <span className="text-hero-pink">
              Asset Intelligence.
            </span>
          </h1>

          {/* Body Narrative */}
          <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-[1.0625rem] leading-relaxed text-brand-mist/85 font-light">
            Commercial aerial inspection connected directly to the engineers, surveyors, and trade specialists who maintain, repair, and manage the building.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/tools/drone-inspection-planner"
              className="btn-hero-pink w-full sm:w-auto text-center justify-center"
            >
              <span>Plan a Drone Inspection</span>
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>

            <a
              href="#capabilities"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#capabilities')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost-light w-full sm:w-auto text-center justify-center"
            >
              <span>Explore Capabilities</span>
            </a>
          </div>
        </div>

        {/* Proof / Service Facts Row (Glass Cards matching M&E page design) */}
        <dl className="mt-8 grid max-w-5xl grid-cols-1 gap-2.5 sm:grid-cols-3 lg:gap-3.5">
          <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
            <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
              CAA Certified Pilots
            </dt>
            <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
              Approved Commercial Flight Operations
            </dd>
          </div>

          <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
            <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
              Direct Trade Remediation
            </dt>
            <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
              Integrated M&amp;E &amp; Roofing Teams
            </dd>
          </div>

          <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
            <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
              Nationwide Deployment
            </dt>
            <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
              Rapid UK Multi-Site Coverage
            </dd>
          </div>
        </dl>
      </div>

      <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />
    </section>
  );
}

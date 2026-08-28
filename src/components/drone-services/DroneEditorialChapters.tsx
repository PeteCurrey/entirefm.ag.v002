'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Chapter {
  number: string;
  category: string;
  title: string;
  narrative: string;
  mediaType: 'video' | 'image';
  videoSrc?: string;
  imageSrc: string;
  links: { label: string; href: string }[];
}

const CHAPTERS: Chapter[] = [
  {
    number: '01',
    category: 'BUILDING & ENVELOPE INSPECTION',
    title: 'Inaccessible Fabric Surveyed Safely at Scale',
    narrative: 'High-resolution optical inspection of commercial roofs, parapet copings, rain-screen cladding, and vertical glazing gaskets. Eliminate high-risk working-at-height operations during routine asset condition reviews.',
    mediaType: 'video',
    videoSrc: '/video/drone/inspection.mp4',
    imageSrc: '/images/drone/inspection_poster.png',
    links: [
      { label: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections' },
      { label: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections' },
      { label: 'Façade & Building Envelope', href: '/services/drone-services/facade-inspections' },
    ],
  },
  {
    number: '02',
    category: 'THERMAL & ENERGY INTELLIGENCE',
    title: 'Sub-Surface Moisture & Energy Loss Exposed',
    narrative: 'Radiometric FLIR infrared thermography conducted during optimal delta-T windows. Detect water entrapped beneath flat roof membranes, missing insulation cavity sections, and defective solar photovoltaic strings.',
    mediaType: 'video',
    videoSrc: '/video/drone/thermal.mp4',
    imageSrc: '/images/drone/thermal_poster.jpg',
    links: [
      { label: 'Thermal Imaging Surveys', href: '/services/drone-services/thermal-imaging' },
      { label: 'Solar PV Farm & Roof Surveys', href: '/services/drone-services/solar-panel-surveys' },
    ],
  },
  {
    number: '03',
    category: 'SURVEYING, GIS & TOPOGRAPHY',
    title: 'Survey-Grade Orthomosaics & Volumetrics',
    narrative: 'RTK-corrected geospatial mapping generating sub-centimetre 2D orthomosaics and digital elevation models. Formatted for direct import into AutoCAD, GIS platforms, and estate masterplanning suites.',
    mediaType: 'video',
    videoSrc: '/video/drone/surveying.mp4',
    imageSrc: '/images/drone/surveying_poster.png',
    links: [
      { label: 'Surveying & Geospatial Mapping', href: '/services/drone-services/surveying-and-mapping' },
      { label: 'Volumetric & Earthworks Surveys', href: '/services/drone-services/volumetric-surveys' },
    ],
  },
  {
    number: '04',
    category: 'CONSTRUCTION & DEVELOPMENT',
    title: 'Repeat Waypoint Milestone Documentation',
    narrative: 'Autonomous GPS-locked repeat flights recording construction progress, earthworks cut/fill volumetrics, and structural envelope completion across multi-phase development sites.',
    mediaType: 'video',
    videoSrc: '/video/drone/construction.mp4',
    imageSrc: '/images/drone/construction_poster.png',
    links: [
      { label: 'Construction Progress Monitoring', href: '/services/drone-services/construction-monitoring' },
    ],
  },
  {
    number: '05',
    category: 'INCIDENT & INSURANCE EVIDENCE',
    title: 'Rapid Post-Storm Damage Assessment',
    narrative: 'Rapid deployment following severe weather, structural impact, or tenant claims. Produce comprehensive, timestamped photographic dossiers for loss adjusters and insurance underwriters.',
    mediaType: 'image',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    links: [
      { label: 'Emergency & Insurance Claim Surveys', href: '/services/drone-services/insurance-claim-surveys' },
    ],
  },
  {
    number: '06',
    category: 'REALITY CAPTURE & DIGITAL TWINS',
    title: 'Navigable 3D Models & High-Level Media',
    narrative: 'Immersive Gaussian Splats, dense point clouds, and broadcast-quality 6K architectural media for remote asset walkthroughs, stakeholder presentations, and long-term BIM archives.',
    mediaType: 'video',
    videoSrc: '/video/drone/photography.mp4',
    imageSrc: '/images/drone/photography_poster.png',
    links: [
      { label: 'Digital Twin & 3D Spatial Capture', href: '/services/drone-services/digital-twin-3d-capture' },
      { label: 'High-Level Aerial Photography & Video', href: '/services/drone-services/aerial-photography' },
    ],
  },
];

function ChapterVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      poster={poster}
      className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function DroneEditorialChapters() {
  return (
    <section 
      id="capabilities"
      aria-label="Commercial Drone Capabilities"
      className="py-24 sm:py-32 bg-brand-void text-white overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom space-y-24">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
              CORE CAPABILITY CHAPTERS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
            Specialist Aerial Disciplines: <br />
            <span className="text-hero-pink font-light">
              Engineered for Real Property.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Explore our six core operational disciplines, each configured for commercial property managers, industrial estates, institutional landlords, and construction developers.
          </p>
        </div>

        {/* 6 Cinematic Editorial Chapters */}
        <div className="space-y-28 sm:space-y-36">
          {CHAPTERS.map((chapter, idx) => {
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={chapter.number}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Media Column */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative rounded-sm overflow-hidden bg-brand-carbon aspect-[16/10] shadow-2xl border border-white/10 group">
                    {chapter.mediaType === 'video' && chapter.videoSrc ? (
                      <ChapterVideo src={chapter.videoSrc} poster={chapter.imageSrc} />
                    ) : (
                      <Image
                        src={chapter.imageSrc}
                        alt={chapter.title}
                        fill
                        className="object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-void/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-sm bg-brand-void/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-300">
                      CHAPTER {chapter.number}
                    </div>
                  </div>
                </div>

                {/* Narrative & Routes Column */}
                <div className={`lg:col-span-5 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block font-medium">
                      {chapter.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-white leading-tight">
                      {chapter.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    {chapter.narrative}
                  </p>

                  {/* Child Service Route Links */}
                  <div className="pt-4 border-t border-brand-edge-dark space-y-2.5">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                      Dedicated Service Pages:
                    </span>
                    <div className="flex flex-col gap-2">
                      {chapter.links.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          href={link.href}
                          className="inline-flex items-center justify-between p-3 rounded-sm bg-brand-carbon/60 border border-brand-edge-dark hover:border-brand-pink hover:bg-brand-carbon transition-all text-xs font-normal text-slate-200 hover:text-white group/link"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-brand-pink transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

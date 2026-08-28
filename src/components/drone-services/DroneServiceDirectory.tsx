'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  href: string;
  summary: string;
  previewImage: string;
  previewVideo?: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'drone-inspections',
    name: 'COMMERCIAL DRONE INSPECTIONS',
    category: 'Asset Inspection',
    href: '/services/drone-services/drone-inspections',
    summary: 'High-resolution condition assessments for commercial buildings, industrial roofs, and critical infrastructure.',
    previewImage: '/images/drone/inspection_poster.png',
    previewVideo: '/video/drone/inspection.mp4',
  },
  {
    id: 'roof-inspections',
    name: 'ROOF & GUTTER INSPECTIONS',
    category: 'Waterproofing & Drainage',
    href: '/services/drone-services/roof-inspections',
    summary: 'Sub-centimetre optical mapping of single-ply membranes, standing water, flashing splits, and valley gutter silt.',
    previewImage: '/images/drone/nav/inspection.png',
  },
  {
    id: 'building-envelope-inspections',
    name: 'FAÇADE & BUILDING ENVELOPE',
    category: 'Vertical Fabric',
    href: '/services/drone-services/building-envelope-inspections',
    summary: 'Multi-storey elevation inspections evaluating curtain wall glazing gaskets, rain-screen panels, and vertical mastic expansion joints.',
    previewImage: '/images/editorial/building-safety-facade-inspection.jpg',
  },
  {
    id: 'thermal-imaging',
    name: 'RADIOMETRIC THERMAL SURVEYS',
    category: 'Energy & Insulation',
    href: '/services/drone-services/thermal-imaging',
    summary: 'Calibrated infrared thermography exposing trapped moisture, thermal bridging, and HVAC mechanical head pressure.',
    previewImage: '/images/drone/thermal_poster.jpg',
    previewVideo: '/video/drone/thermal.mp4',
  },
  {
    id: 'solar-pv-inspections',
    name: 'SOLAR PV FARM & ROOFTOP SURVEYS',
    category: 'Renewable Assets',
    href: '/services/drone-services/solar-pv-inspections',
    summary: 'String-level radiometric scans detecting micro-cracks, bypass diode failures, and hotspot cell degradation.',
    previewImage: '/images/drone/nav/thermal.png',
  },
  {
    id: 'surveying-mapping',
    name: 'SURVEYING & GEOSPATIAL MAPPING',
    category: 'Topography & GIS',
    href: '/services/drone-services/surveying-mapping',
    summary: 'Survey-grade RTK photogrammetry producing georeferenced 2D orthomosaics and digital elevation contours.',
    previewImage: '/images/drone/surveying_poster.png',
    previewVideo: '/video/drone/surveying.mp4',
  },
  {
    id: 'construction-monitoring',
    name: 'CONSTRUCTION PROGRESS MONITORING',
    category: 'Development Intelligence',
    href: '/services/drone-services/construction-monitoring',
    summary: 'GPS-locked monthly waypoint flights recording groundworks cut/fill volumetrics and envelope milestone progress.',
    previewImage: '/images/drone/construction_poster.png',
    previewVideo: '/video/drone/construction.mp4',
  },
  {
    id: 'digital-twin-3d-capture',
    name: 'DIGITAL TWIN & 3D REALITY CAPTURE',
    category: 'Spatial BIM',
    href: '/services/drone-services/digital-twin-3d-capture',
    summary: 'Photorealistic EntireFM 3D digital twins and dense point clouds for remote stakeholder inspection and BIM verification.',
    previewImage: '/images/drone/gaussian-splat/casa-hotel.jpg',
  },
  {
    id: 'volumetric-surveys',
    name: 'VOLUMETRIC & EARTHWORKS SURVEYS',
    category: 'Civil & Groundworks',
    href: '/services/drone-services/volumetric-surveys',
    summary: 'Accurate 3D stockpile calculations, quarry assessments, and digital terrain modeling.',
    previewImage: '/images/drone/nav/surveying.png',
  },
  {
    id: 'aerial-photography-video',
    name: 'HIGH-LEVEL PHOTOGRAPHY & 6K FILM',
    category: 'Architectural Media',
    href: '/services/drone-services/aerial-photography-video',
    summary: 'Ultra-high-definition architectural photography and cinematic broadcast-quality video for portfolio marketing.',
    previewImage: '/images/drone/photography_poster.png',
    previewVideo: '/video/drone/photography.mp4',
  },
  {
    id: 'emergency-insurance-surveys',
    name: 'EMERGENCY & INSURANCE SURVEYS',
    category: 'Storm & Incident Response',
    href: '/services/drone-services/emergency-insurance-surveys',
    summary: 'Rapid post-storm deployment providing timestamped photographic evidence packs for loss adjusters.',
    previewImage: '/images/drone/sectors/infrastructure.png',
  },
];

export function DroneServiceDirectory() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeService = SERVICES[activeIdx];

  return (
    <section 
      aria-label="Commercial Drone Services Directory"
      className="py-24 sm:py-32 bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-16">
        
        {/* Editorial Narrative Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
            <span className="w-6 h-px bg-brand-pink" />
            <span>SPECIALIST SERVICE DIRECTORY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
            Comprehensive Aerial Capabilities: <br />
            <span className="font-normal text-slate-950">
              Browse by Discipline
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Hover over any discipline to preview capture outputs. Every service connects seamlessly with our self-delivered engineering trades.
          </p>
        </div>

        {/* 2-Column Split: Editorial List on Left, Dynamic Preview Media on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Large Typeset Service List */}
          <div className="lg:col-span-7 divide-y divide-slate-200 border-y border-slate-200">
            {SERVICES.map((svc, idx) => {
              const isHovered = activeIdx === idx;
              return (
                <div
                  key={svc.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className="py-4 sm:py-5 group cursor-pointer"
                >
                  <Link
                    href={svc.href}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 uppercase tracking-widest block font-medium">
                        {svc.category}
                      </span>
                      <h3 className={`text-base sm:text-lg font-light tracking-wide transition-colors ${
                        isHovered ? 'text-brand-pink font-normal' : 'text-slate-900 group-hover:text-slate-950'
                      }`}>
                        {svc.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed max-w-xl hidden sm:block">
                        {svc.summary}
                      </p>
                    </div>

                    <div className="shrink-0 p-2 rounded-full border border-slate-200 group-hover:border-brand-pink group-hover:bg-brand-pink group-hover:text-white text-slate-400 transition-all">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic High-Resolution Preview Media (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 hidden lg:block">
            <div className="rounded-sm overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 relative aspect-[4/3]">
              {activeService.previewVideo ? (
                <video
                  key={activeService.previewVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={activeService.previewImage}
                  className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05]"
                >
                  <source src={activeService.previewVideo} type="video/mp4" />
                </video>
              ) : (
                <Image
                  key={activeService.previewImage}
                  src={activeService.previewImage}
                  alt={activeService.name}
                  fill
                  className="object-cover object-center filter brightness-[0.80] contrast-[1.05]"
                  sizes="40vw"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-6 inset-x-6 z-10 text-white space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-brand-pink font-medium block">
                  {activeService.category}
                </span>
                <div className="text-lg font-light leading-tight">
                  {activeService.name}
                </div>
                <p className="text-xs text-slate-300 font-light line-clamp-2">
                  {activeService.summary}
                </p>
                <div className="pt-2">
                  <Link
                    href={activeService.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-brand-pink transition-colors"
                  >
                    <span>View Full Service Specification</span>
                    <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

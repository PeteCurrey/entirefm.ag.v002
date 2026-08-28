'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Box, 
  ArrowRight,
  Layers,
  FileCode2,
  Compass,
  Building2,
  CheckCircle2
} from 'lucide-react';

const REALITY_FORMATS = [
  { format: '3D Gaussian Splat (.splat / .spz)', desc: 'Radiance field rendering preserving photorealistic lighting and complex geometry for real-time web walkthroughs.' },
  { format: 'Dense Point Cloud (.LAS / .LAZ)', desc: 'Georeferenced spatial point coordinate cloud with sub-centimetre accuracy for CAD and topography.' },
  { format: 'Textured 3D Mesh (.OBJ / .FBX)', desc: 'Surface mesh models formatted for AutoCAD, Revit, ArchiCAD, and Rhino BIM workflows.' },
  { format: '2D Orthomosaic TIFF / DXF', desc: 'Distortion-free, millimeter-accurate 2D aerial map georeferenced to OS National Grid.' },
];

export function DroneGaussianSplatExperience() {
  const [activeModel, setActiveModel] = useState<'casa' | 'heritage'>('casa');

  return (
    <section 
      aria-label="3D Gaussian Splatting & Spatial Reality Capture"
      className="py-24 sm:py-32 bg-[#060A14] text-white overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <Box className="h-4 w-4" />
              <span>SPATIAL REALITY CAPTURE &amp; 3DGS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
              3D Gaussian Splatting: <br />
              <span className="font-light text-hero-pink">
                Your Building in Navigable 3D Space.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              Photorealistic 3D scene reconstruction generated from thousands of high-overlap aerial photographs, preserving real-world architectural geometry and lighting for remote asset inspection.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveModel('casa')}
              className={`px-4 py-2.5 rounded-sm text-xs font-mono transition-all border ${
                activeModel === 'casa'
                  ? 'bg-brand-carbon border-brand-pink text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              CASA HOTEL ESTATE
            </button>
            <button
              onClick={() => setActiveModel('heritage')}
              className={`px-4 py-2.5 rounded-sm text-xs font-mono transition-all border ${
                activeModel === 'heritage'
                  ? 'bg-brand-carbon border-brand-pink text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              HERITAGE HOUSE COMPLEX
            </button>
          </div>
        </div>

        {/* Large High-Fidelity Reality Capture Showcase Visual */}
        <div className="relative rounded-sm overflow-hidden bg-brand-carbon border border-white/15 aspect-[16/9] shadow-2xl group">
          <Image
            src={activeModel === 'casa' ? '/images/drone/gaussian-splat/casa-hotel.jpg' : '/images/drone/gaussian-splat/heritage-house.jpg'}
            alt="Photorealistic 3D Gaussian Splat spatial capture of commercial property"
            fill
            priority
            className="object-cover object-center filter brightness-[0.9] contrast-[1.05] transition-all duration-700"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Metadata Badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-brand-void/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/15 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <span>DATASET: {activeModel === 'casa' ? 'CASA HOTEL COMMERCIAL ESTATE' : 'HERITAGE HOUSE COMPLEX'}</span>
          </div>

          {/* Bottom Overlay Summary */}
          <div className="absolute bottom-6 inset-x-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="max-w-xl space-y-1">
              <span className="text-[11px] font-mono text-brand-pink uppercase tracking-widest block">
                IMMERSIVE SPATIAL DOCUMENTATION
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-light">
                {activeModel === 'casa' 
                  ? 'Complete commercial hotel estate reconstructed in 3D for exterior envelope auditing, roof asset inspection, and stakeholder review.'
                  : 'Multi-angle photogrammetry reconstruction capturing intricate masonry, parapets, and complex elevations on historical property.'}
              </p>
            </div>

            <Link
              href="/services/drone-services/digital-twin-3d-capture"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-colors shrink-0"
            >
              <span>Digital Twin Specifications</span>
              <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
            </Link>
          </div>
        </div>

        {/* Deliverable Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-brand-edge-dark">
          {REALITY_FORMATS.map((item, idx) => (
            <div key={idx} className="p-6 rounded-sm bg-brand-carbon/60 border border-brand-edge-dark space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-pink">
                <FileCode2 className="h-3.5 w-3.5" />
                <span className="font-semibold">{item.format}</span>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

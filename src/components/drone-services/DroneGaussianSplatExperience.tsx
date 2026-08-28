'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  ArrowRight,
  Layers,
  FileCode2,
  Compass,
  Building2,
  CheckCircle2,
  Eye,
  Sparkles
} from 'lucide-react';
import { GaussianSplatViewer } from './GaussianSplatViewer';

const REALITY_FORMATS = [
  { format: 'EntireFM 3D Digital Twin (.ksplat / .splat)', desc: 'Radiance field rendering preserving photorealistic lighting and complex geometry for real-time web walkthroughs.' },
  { format: 'Dense Point Cloud (.LAS / .LAZ)', desc: 'Georeferenced spatial point coordinate cloud with sub-centimetre accuracy for CAD and topography.' },
  { format: 'Textured 3D Mesh (.OBJ / .FBX)', desc: 'Surface mesh models formatted for AutoCAD, Revit, ArchiCAD, and Rhino BIM workflows.' },
  { format: '2D Orthomosaic TIFF / DXF', desc: 'Distortion-free, millimeter-accurate 2D aerial map georeferenced to OS National Grid.' },
];

export function DroneGaussianSplatExperience() {
  return (
    <section 
      aria-label="EntireFM 3D Spatial Reality Capture & Digital Twin"
      className="py-24 sm:py-32 bg-[#060A14] text-white overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <Box className="h-4 w-4" />
              <span>ENTIREFM 3D · SPATIAL REALITY CAPTURE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
              EntireFM 3D: <br />
              <span className="font-light text-hero-pink">
                A Site You Can Revisit From Anywhere.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              EntireFM 3D capture transforms thousands of aerial images into an immersive spatial model, allowing teams to inspect context, understand assets, and revisit captured conditions long after the drone has landed.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/services/drone-services/digital-twin-3d-capture"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-medium transition-all shadow-elevated"
            >
              <span>EntireFM 3D Specs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Live Interactive 3D Gaussian Splat Viewer */}
        <div className="w-full">
          <GaussianSplatViewer
            splatUrl="/assets/gaussian-splats/04_05_2026.ksplat"
            splatCount={540274}
            title="LIVE 3D SURVEY · ENTIREFM 3D"
            subtitle="Captured by EntireFM Drone Services · Interactive 3D Model"
            initialCameraPosition={[0, 3.5, 6.5]}
            initialCameraLookAt={[0, 0.8, 0]}
          />
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

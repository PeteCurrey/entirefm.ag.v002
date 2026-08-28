'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Box, Layers, HardHat } from 'lucide-react';

export function DroneDigitalTwinSection() {
  return (
    <section 
      aria-label="Commercial Digital Twin Reality Capture"
      className="py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-16">
        
        {/* Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <span className="w-6 h-px bg-brand-pink" />
              <span>SPATIAL REALITY CAPTURE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              A building you can <br />
              <span className="font-normal text-slate-950">
                return to any time.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4 text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            <p>
              Reality capture preserves a navigable, millimeter-accurate 3D visual record of an asset for remote stakeholder inspections, project comparison, dimensional verification, and long-term condition monitoring.
            </p>
          </div>
        </div>

        {/* 2-Column Large Visual Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Visual 1: Heritage & Commercial BIM */}
          <div className="relative rounded-sm overflow-hidden bg-slate-950 min-h-[400px] flex flex-col justify-end p-8 sm:p-10 shadow-md group">
            <Image
              src="/images/editorial/entirefm-london-aerial-poster-2560w.webp"
              alt="High-altitude aerial capture of commercial city assets"
              fill
              className="object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="relative z-10 space-y-2 text-white">
              <span className="text-xs uppercase tracking-widest text-brand-pink font-mono">
                HERITAGE &amp; COMMERCIAL ASSETS
              </span>
              <h3 className="text-xl sm:text-2xl font-light">
                Immutable Dimensional &amp; Visual Archives
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Reconstruct historical facades, complex roof trusses, and architectural stonework without invasive physical scaffolding surveys.
              </p>
            </div>
          </div>

          {/* Visual 2: EntireCAFM 3D Site Workspace */}
          <div className="relative rounded-sm overflow-hidden bg-slate-950 min-h-[400px] flex flex-col justify-end p-8 sm:p-10 shadow-md group">
            <Image
              src="/images/client-portal/entirecafm-site-360-workspace.png"
              alt="EntireCAFM Site 360 3D spatial workspace"
              fill
              className="object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="relative z-10 space-y-2 text-white">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
                ENTIRECAFM SITE 360 WORKSPACE
              </span>
              <h3 className="text-xl sm:text-2xl font-light">
                Connected Directly to Maintenance Work Orders
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Pin maintenance issues directly onto the 3D model, dispatch engineers to exact spatial points, and track remediation over time.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

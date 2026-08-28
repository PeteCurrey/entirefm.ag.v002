'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MoveHorizontal, Flame, Sparkles } from 'lucide-react';

export function DroneThermalReveal() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <section 
      aria-label="Multi-Spectrum Thermal Inspection"
      className="py-24 sm:py-32 bg-[#060A14] text-white overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom space-y-16">
        
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
            <Flame className="h-4 w-4 text-brand-pink" />
            <span>INFRARED RADIOMETRIC THERMOGRAPHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
            What looks dry <br />
            <span className="font-light text-hero-pink">
              isn&apos;t always dry.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Radiometric thermal capture exposes hidden sub-surface moisture entrapment, insulation degradation, thermal bridging, and abnormal electrical head pressures invisible to the naked eye.
          </p>
        </div>

        {/* Large Visual Draggable Reveal Canvas */}
        <div className="space-y-6">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            className="relative h-[450px] sm:h-[600px] lg:h-[680px] w-full rounded-sm overflow-hidden bg-brand-carbon cursor-ew-resize select-none border border-white/10 shadow-2xl"
          >
            {/* Background: Visible RGB Spectrum Layer */}
            <div className="absolute inset-0">
              <Image
                src="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
                alt="Visible RGB high-resolution commercial rooftop and HVAC condenser plant deck"
                fill
                className="object-cover object-center filter brightness-[0.9] contrast-[1.05]"
                sizes="100vw"
              />
              <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-sm bg-brand-void/80 backdrop-blur-md border border-white/15 font-mono text-xs text-white">
                VISIBLE SPECTRUM (OPTICAL RGB)
              </div>
            </div>

            {/* Foreground: FLIR Radiometric Thermal Layer (Clipped via Slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <Image
                src="/images/editorial/entirefm-hvac-thermal-survey-2000w.webp"
                alt="Radiometric FLIR thermal heatmap of roof and HVAC plant deck"
                fill
                className="object-cover object-center filter brightness-[1.0] contrast-[1.15]"
                sizes="100vw"
              />
              {/* Thermal color map shader */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#020024] via-[#5c0e8a] to-[#ff7b00] mix-blend-color opacity-85 pointer-events-none" />

              <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-sm bg-brand-void/90 backdrop-blur-md border border-brand-pink/40 font-mono text-xs text-brand-pink">
                FLIR RADIOMETRIC THERMAL (DELTA-T)
              </div>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="h-10 w-10 -ml-5 rounded-full bg-white text-brand-void flex items-center justify-center shadow-2xl border-2 border-brand-pink">
                <MoveHorizontal className="h-5 w-5 text-brand-void" />
              </div>
            </div>

            {/* Bottom Helper Indicator */}
            <div className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between pointer-events-none text-xs text-slate-300 font-mono">
              <span className="bg-brand-void/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                DRAG SLIDER TO REVEAL THERMAL MOISTURE
              </span>
              <span className="bg-brand-void/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10 hidden sm:inline-block">
                BS EN 13187 STANDARDS COMPLIANT
              </span>
            </div>
          </div>

          {/* Minimal Editorial Caption & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl">
              Thermal surveys are flown during specific temperature differentials (delta-T) after sunset or before dawn when trapped water retains heat longer than dry insulation.
            </p>

            <Link
              href="/services/drone-services/thermal-imaging"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-brand-pink hover:text-white font-medium transition-colors shrink-0"
            >
              <span>Explore Thermal Surveys</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Hotspot {
  id: string;
  top: string; // e.g. '35%'
  left: string; // e.g. '45%'
  label: string;
  telemetryType: string;
  description: string;
  value: string;
}

interface AnnotatedTechnicalImageProps {
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  hotspots?: Hotspot[];
}

export function AnnotatedTechnicalImage({
  imageSrc,
  imageAlt,
  caption = 'Commercial Mechanical Plant Inspection — Asset Diagnostics and Condition Monitoring Overlay',
  hotspots = [
    {
      id: 'h1',
      top: '32%',
      left: '28%',
      label: 'Compressor Bearing Assembly',
      telemetryType: 'Piezoelectric Vibration Sensor',
      description: 'Monitors tri-axial velocity (RMS) against ISO 10816-3 threshold limits.',
      value: '1.2 mm/s · Nominal',
    },
    {
      id: 'h2',
      top: '55%',
      left: '68%',
      label: 'Chilled Water Return Header',
      telemetryType: 'BMS Immersion Temperature Sensor',
      description: 'Measures delta-T (ΔT) to verify chiller thermodynamic efficiency.',
      value: '11.8°C (Target: 12.0°C)',
    },
    {
      id: 'h3',
      top: '72%',
      left: '42%',
      label: 'Modulating 24V Control Valve',
      telemetryType: 'BACnet Modulating Actuator',
      description: 'Tracks valve stroke percentage against actual cooling load demand.',
      value: '42% Modulating Flow',
    },
  ],
}: AnnotatedTechnicalImageProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(hotspots[0] || null);

  return (
    <div className="my-14 rounded-sm bg-brand-carbon/60 border border-brand-edge-dark p-6 sm:p-8 shadow-elevated font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-brand-edge-dark text-xs">
        <span className="text-slate-300 uppercase tracking-wider font-medium">Interactive Asset Telemetry Map</span>
        <span className="text-brand-pink font-medium">Select Nodes to Inspect Condition</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Image with Hotspots */}
        <div className="lg:col-span-8 relative aspect-[16/10] rounded-sm overflow-hidden border border-brand-edge-dark bg-brand-carbon">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Render Hotspot Pins */}
          {hotspots.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => setActiveHotspot(spot)}
                style={{ top: spot.top, left: spot.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
                aria-label={`Inspect ${spot.label}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? 'bg-brand-pink border-white text-white shadow-lg shadow-brand-pink/50 scale-110'
                    : 'bg-brand-carbon/90 border-brand-pink text-white hover:scale-110'
                }`}>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="hidden sm:block absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-white/15 px-2 py-0.5 rounded-sm text-[11px] text-white whitespace-nowrap shadow-md pointer-events-none font-medium">
                  {spot.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hotspot Data Card */}
        <div className="lg:col-span-4 p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-4">
          {activeHotspot ? (
            <>
              <div className="space-y-1.5">
                <span className="text-[11px] text-brand-pink uppercase tracking-wider block font-medium">
                  {activeHotspot.telemetryType}
                </span>
                <h4 className="text-lg font-light text-white leading-snug">
                  {activeHotspot.label}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pt-1">
                  {activeHotspot.description}
                </p>
              </div>

              <div className="p-4 rounded-sm bg-black/40 border border-brand-edge-dark space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-medium">Telemetry Status</span>
                <span className="text-sm font-medium text-emerald-400">{activeHotspot.value}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 font-light">Select an asset node on the image to view real-time telemetry parameters.</p>
          )}

          <div className="pt-3 text-[11px] text-slate-400 border-t border-brand-edge-dark font-light">
            Protocol: BACnet IP Gateway via EntireCAFM Connector
          </div>
        </div>
      </div>

      {caption && (
        <p className="text-xs text-slate-400 mt-6 text-center font-light">
          {caption}
        </p>
      )}
    </div>
  );
}

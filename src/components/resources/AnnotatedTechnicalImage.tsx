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
  caption = 'Commercial Mechanical Plant Inspection — Live Telemetry and Condition Monitoring Overlay',
  hotspots = [
    {
      id: 'h1',
      top: '32%',
      left: '28%',
      label: 'Compressor Bearing',
      telemetryType: 'Piezoelectric Vibration Sensor',
      description: 'Monitors tri-axial velocity (RMS) against ISO 10816-3 threshold limits.',
      value: '1.2 mm/s · Nominal',
    },
    {
      id: 'h2',
      top: '55%',
      left: '68%',
      label: 'Chilled Water Return',
      telemetryType: 'BMS Immersion Temperature Sensor',
      description: 'Measures delta-T (ΔT) to verify chiller thermodynamic efficiency.',
      value: '11.8°C (Target: 12.0°C)',
    },
    {
      id: 'h3',
      top: '72%',
      left: '42%',
      label: 'Modulating Actuator',
      telemetryType: '24V BACnet Control Valve',
      description: 'Tracks valve stroke percentage against actual cooling load demand.',
      value: '42% Modulating Flow',
    },
  ],
}: AnnotatedTechnicalImageProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(hotspots[0] || null);

  return (
    <div className="my-14 rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800 text-xs font-mono">
        <span className="text-slate-400">INTERACTIVE ASSET TELEMETRY MAP</span>
        <span className="text-pink-400 font-light">CLICK NODES TO INSPECT</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Main Image with Hotspots */}
        <div className="lg:col-span-8 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/30 pointer-events-none" />

          {/* Render Hotspot Pins */}
          {hotspots.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => setActiveHotspot(spot)}
                style={{ top: spot.top, left: spot.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none`}
                aria-label={`Inspect ${spot.label}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? 'bg-pink-500 border-white text-white shadow-lg shadow-pink-500/50 scale-125'
                    : 'bg-slate-950/90 border-pink-400 text-pink-300 hover:scale-110'
                }`}>
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
                <span className="hidden sm:block absolute top-7 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-md pointer-events-none">
                  {spot.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hotspot Data Card */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 font-mono">
          {activeHotspot ? (
            <>
              <div>
                <span className="text-[10px] text-pink-400 uppercase tracking-wider block mb-1">
                  {activeHotspot.telemetryType}
                </span>
                <h4 className="text-base font-light text-white mb-2">
                  {activeHotspot.label}
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800/90">
                <span className="text-[10px] text-slate-500 block uppercase">Telemetry Status</span>
                <span className="text-xs font-normal text-emerald-400">{activeHotspot.value}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Select an asset node on the image to view real-time telemetry parameters.</p>
          )}

          <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
            Protocol: BACnet IP Gateway via EntireCAFM Connector
          </div>
        </div>
      </div>

      {caption && (
        <p className="text-xs font-mono text-slate-400 mt-4 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
}

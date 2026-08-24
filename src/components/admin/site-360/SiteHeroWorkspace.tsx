'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Site } from '@/server/estate';
import { Badge } from '../ui/Badge';
import { VisualModeSelector, SiteVisualMode } from './VisualModeSelector';
import {
  MapPin,
  Building2,
  Wrench,
  ShieldCheck,
  Users,
  AlertTriangle,
  Layers,
  Sparkles,
  Maximize2,
  Upload,
  Radio,
} from 'lucide-react';

interface SiteHeroWorkspaceProps {
  site: Site & {
    heroImageUrl?: string;
    openJobsCount?: number;
    criticalJobsCount?: number;
    compliancePercent?: number;
    engineersPresent?: number;
    grossAreaSqm?: number;
    occupancyPercent?: number;
  };
  mode: SiteVisualMode;
  onModeChange: (mode: SiteVisualMode) => void;
  onMarkerClick?: (markerType: string) => void;
}

export function SiteHeroWorkspace({
  site,
  mode,
  onModeChange,
  onMarkerClick,
}: SiteHeroWorkspaceProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const heroImage = site.heroImageUrl || '/images/EntireFM 01.png';

  const operationalMarkers = [
    {
      id: 'm-boiler',
      type: 'critical_wo',
      label: 'Boiler Plant Trip (P1)',
      location: 'Level -1 Plant Room',
      top: '68%',
      left: '32%',
      color: 'bg-[#DC2626]',
      pulse: true,
    },
    {
      id: 'm-lift',
      type: 'loler_inspection',
      label: 'Passenger Lift A (LOLER Due)',
      location: 'Central Core Elevator Bank',
      top: '42%',
      left: '52%',
      color: 'bg-[#D97706]',
      pulse: false,
    },
    {
      id: 'm-engineer',
      type: 'engineer_active',
      label: 'Marcus Vance on site',
      location: 'Reception & Access Gate',
      top: '78%',
      left: '72%',
      color: 'bg-[#FF6B24]',
      pulse: true,
    },
  ];

  return (
    <div className="rounded-[18px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-6 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              SITE 360 · PHYSICAL ASSET CANVAS
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#686866] bg-[#FFFFFF] border border-[#E4E4E1] px-2 py-0.5 rounded-[4px]">
            {site.site_code}
          </span>
        </div>

        {/* Mode Selector */}
        <VisualModeSelector mode={mode} onChange={onModeChange} />
      </div>

      {/* Main Workspace Body */}
      {mode === 'PHOTO' ? (
        <div className="relative h-[480px] w-full bg-[#101010] overflow-hidden group">
          {/* Real Site Photography */}
          <Image
            src={heroImage}
            alt={site.name}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            sizes="(max-width: 1200px) 100vw, 80vw"
          />

          {/* Precision Vignette & Gradient for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* Interactive Spatial Operational Markers */}
          {operationalMarkers.map((marker) => (
            <div
              key={marker.id}
              style={{ top: marker.top, left: marker.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMarker(marker.id);
                  onMarkerClick && onMarkerClick(marker.type);
                }}
                className="group/marker relative flex items-center"
              >
                {/* Ping dot */}
                <span className="relative flex h-5 w-5 items-center justify-center">
                  {marker.pulse && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${marker.color}`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white shadow-lg ${marker.color}`}
                  />
                </span>

                {/* Marker Tooltip / Label */}
                <div className="ml-2 hidden sm:flex flex-col rounded-[6px] border border-white/20 bg-black/85 backdrop-blur-md px-2.5 py-1 text-left text-white shadow-xl transition-all group-hover/marker:scale-105">
                  <span className="font-medium text-[11.5px] leading-tight whitespace-nowrap">
                    {marker.label}
                  </span>
                  <span className="font-mono text-[9.5px] text-white/70">
                    {marker.location}
                  </span>
                </div>
              </button>
            </div>
          ))}

          {/* Overlay Top Right: Live Telemetry HUD */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="rounded-[8px] bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1.5 font-mono text-[11px] text-white flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-[#16A34A] animate-pulse" />
              <span>LIVE SENSORS: 48 ONLINE</span>
            </div>
          </div>

          {/* Overlay Bottom Details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="orange" size="xs">
                  {site.site_type.replace(/_/g, ' ')}
                </Badge>
                <span className="font-mono text-[11px] text-white/80">
                  {site.postcode}
                </span>
              </div>
              <h1 className="mt-1 text-2xl md:text-3xl font-light tracking-tight text-white drop-shadow-md">
                {site.name}
              </h1>
              <p className="mt-0.5 text-[13px] text-white/80 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-white/70" />
                <span>
                  {site.address_line1}, {site.city} {site.postcode}
                </span>
              </p>
            </div>

            {/* Quick Metrics Overlay Badge Bar */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-[10px] p-2 font-mono text-[11px]">
              <div className="px-3 py-1 text-center">
                <div className="text-[9px] uppercase text-white/60">GIA Area</div>
                <div className="font-semibold text-white">
                  {site.grossAreaSqm ? `${site.grossAreaSqm.toLocaleString()} m²` : '8,450 m²'}
                </div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="px-3 py-1 text-center">
                <div className="text-[9px] uppercase text-white/60">Occupancy</div>
                <div className="font-semibold text-[#16A34A]">94% Full</div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="px-3 py-1 text-center">
                <div className="text-[9px] uppercase text-white/60">Compliance</div>
                <div className="font-semibold text-white">
                  {site.compliancePercent?.toFixed(1) || '98.4'}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : mode === 'PLAN' ? (
        /* Floor Plan Architectural CAD Mode */
        <div className="relative h-[480px] w-full bg-[#F5F5F3] p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
            <div className="font-mono text-[11px] text-[#101010] font-semibold">
              SCHEMATIC FLOOR LAYOUT · LEVEL 0 (GROUND FLOOR)
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-medium text-[#101010]">
                Level -1 Plant
              </button>
              <button className="rounded-[6px] bg-[#101010] px-2.5 py-1 text-[11px] font-medium text-white">
                Level 0 Ground
              </button>
              <button className="rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-medium text-[#101010]">
                Level 1-4 Offices
              </button>
            </div>
          </div>

          {/* Simulated Architectural Floor Plan Blueprint */}
          <div className="relative flex-1 my-4 border-2 border-dashed border-[#D1D1CD] rounded-[12px] bg-[#FFFFFF] p-8 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full h-full max-w-2xl font-mono text-[11px]">
              <div className="border border-[#E4E4E1] bg-[#F9F9F8] rounded-[8px] p-4 flex flex-col justify-between">
                <span className="font-semibold text-[#101010]">ZONE A · RECEPTION</span>
                <span className="text-[10px] text-[#15803D]">12 Assets · Nominal</span>
              </div>
              <div className="border border-[#FECACA] bg-[#FEF2F2] rounded-[8px] p-4 flex flex-col justify-between ring-1 ring-[#FECACA]">
                <span className="font-semibold text-[#B91C1C]">PLANT ROOM 01</span>
                <span className="text-[10px] text-[#B91C1C] font-bold">1 Active P1 Fault</span>
              </div>
              <div className="border border-[#E4E4E1] bg-[#F9F9F8] rounded-[8px] p-4 flex flex-col justify-between">
                <span className="font-semibold text-[#101010]">ZONE B · ATRIUM</span>
                <span className="text-[10px] text-[#686866]">8 Assets</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-[#686866] pt-2 border-t border-[#E4E4E1]">
            <span>Click any space zone to inspect linked mechanical & electrical equipment</span>
            <span>SCALE 1:200 · DWG COMPLIANT</span>
          </div>
        </div>
      ) : mode === 'ASSETS' ? (
        /* Asset Hierarchy Explorer */
        <div className="h-[480px] w-full bg-[#FFFFFF] p-6 overflow-y-auto cafm-scroll">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#686866] mb-3">
            EXPLORE PHYSICAL ASSET HIERARCHY (148 REGISTERED ASSETS)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { code: 'HVAC-AHU-01', name: 'Air Handling Unit 1', cat: 'HVAC', cond: 'GOOD', crit: 'HIGH' },
              { code: 'BLR-01', name: 'Primary Condensing Gas Boiler', cat: 'HEATING', cond: 'FAIR', crit: 'CRITICAL' },
              { code: 'CHL-02', name: 'Water-Cooled Chiller Unit', cat: 'COOLING', cond: 'EXCELLENT', crit: 'HIGH' },
              { code: 'ELEC-MDB-G', name: 'Main Distribution Board G', cat: 'ELECTRICAL', cond: 'GOOD', crit: 'CRITICAL' },
              { code: 'LIFT-P01', name: 'Passenger Elevator 1', cat: 'VERTICAL_TRANSPORT', cond: 'GOOD', crit: 'HIGH' },
              { code: 'FIRE-PMP-01', name: 'Fire Sprinkler Booster Pump', cat: 'FIRE_PROTECTION', cond: 'EXCELLENT', crit: 'CRITICAL' },
            ].map((a) => (
              <div
                key={a.code}
                className="rounded-[10px] border border-[#E4E4E1] p-3.5 hover:border-[#FF6B24] transition-all cursor-pointer bg-[#F9F9F8] hover:bg-[#FFFFFF]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#FF6B24] font-semibold">{a.code}</span>
                  <Badge variant={a.crit === 'CRITICAL' ? 'red' : 'blue'} size="xs">{a.crit}</Badge>
                </div>
                <div className="font-medium text-[13px] text-[#101010] mt-1 truncate">{a.name}</div>
                <div className="mt-2 text-[11px] text-[#686866] flex items-center justify-between">
                  <span>{a.cat}</span>
                  <span className="font-mono text-[#15803D] font-medium">{a.cond}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Map / Geographical Access Context */
        <div className="h-[480px] w-full bg-[#E4E4E1] p-8 flex items-center justify-center">
          <div className="rounded-[14px] border border-[#D1D1CD] bg-[#FFFFFF] p-6 max-w-lg w-full text-center space-y-3">
            <MapPin className="h-8 w-8 text-[#FF6B24] mx-auto" />
            <h3 className="text-[16px] font-medium text-[#101010]">Site Geographic Context</h3>
            <p className="text-[13px] text-[#686866]">
              Coordinates: 53.4808° N, 2.2426° W · Postcode {site.postcode}
            </p>
            <div className="pt-2 text-[12px] font-mono text-[#15803D]">
              Vehicle loading bay access via rear service yard (Keyfob clearance required)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

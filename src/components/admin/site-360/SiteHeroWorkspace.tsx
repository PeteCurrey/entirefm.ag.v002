'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Site, Asset, Space, Building } from '@/server/estate';
import { WorkOrder } from '@/server/work';
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
  Radio,
} from 'lucide-react';

interface SiteHeroWorkspaceProps {
  site: Site;
  buildings?: Building[];
  spaces?: Space[];
  assets?: Asset[];
  workOrders?: WorkOrder[];
  compliancePercent?: number;
  mode: SiteVisualMode;
  onModeChange: (mode: SiteVisualMode) => void;
  onSelectAsset?: (asset: Asset) => void;
  onSelectWorkOrder?: (wo: WorkOrder) => void;
}

export function SiteHeroWorkspace({
  site,
  buildings = [],
  spaces = [],
  assets = [],
  workOrders = [],
  compliancePercent = 100,
  mode,
  onModeChange,
  onSelectAsset,
  onSelectWorkOrder,
}: SiteHeroWorkspaceProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const heroImage = '/images/EntireFM 01.png';

  // Compute real metrics from live records
  const totalGia = buildings.reduce((acc, b) => acc + (b.gross_internal_area_sqm || 0), 0);
  const activeWorkOrders = workOrders.filter(
    (w) => w.status !== 'COMPLETED' && w.status !== 'CLOSED' && w.status !== 'CANCELLED'
  );
  const criticalWorkOrders = activeWorkOrders.filter((w) => w.priority === 'P1_CRITICAL');

  // Derive spatial markers from actual active work orders
  const spatialMarkers = activeWorkOrders.slice(0, 4).map((wo, idx) => {
    const positions = [
      { top: '65%', left: '30%' },
      { top: '40%', left: '55%' },
      { top: '75%', left: '70%' },
      { top: '35%', left: '25%' },
    ];
    const pos = positions[idx] || { top: '50%', left: '50%' };
    return {
      id: wo.id,
      label: `${wo.work_order_number || 'WO'} · ${wo.title}`,
      location: site.name,
      top: pos.top,
      left: pos.left,
      isCritical: wo.priority === 'P1_CRITICAL',
      wo,
    };
  });

  return (
    <div className="rounded-[18px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-6 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                criticalWorkOrders.length > 0
                  ? 'bg-[#DC2626] animate-pulse'
                  : 'bg-[#16A34A]'
              }`}
            />
            <span className="font-mono text-[11px] font-normal uppercase tracking-wider text-[#101010]">
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

          {/* Interactive Spatial Operational Markers from Live Tickets */}
          {spatialMarkers.map((marker) => (
            <div
              key={marker.id}
              style={{ top: marker.top, left: marker.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMarker(marker.id);
                  onSelectWorkOrder && onSelectWorkOrder(marker.wo);
                }}
                className="group/marker relative flex items-center"
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  {marker.isCritical && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-[#DC2626]" />
                  )}
                  <span
                    className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white shadow-lg ${
                      marker.isCritical ? 'bg-[#DC2626]' : 'bg-[#FF6B24]'
                    }`}
                  />
                </span>

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
              <Radio
                className={`h-3.5 w-3.5 ${
                  site.status === 'ACTIVE' ? 'text-[#16A34A] animate-pulse' : 'text-[#9B9B97]'
                }`}
              />
              <span>ESTATE STATUS: {site.status}</span>
            </div>
          </div>

          {/* Overlay Bottom Details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="orange" size="xs">
                  {site.site_type?.replace(/_/g, ' ') || 'FACILITY'}
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
                <div className="font-light text-white">
                  {totalGia > 0 ? `${totalGia.toLocaleString()} m²` : '—'}
                </div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="px-3 py-1 text-center">
                <div className="text-[9px] uppercase text-white/60">Open Jobs</div>
                <div
                  className={`font-light ${
                    activeWorkOrders.length > 0 ? 'text-[#FF6B24]' : 'text-[#16A34A]'
                  }`}
                >
                  {activeWorkOrders.length}
                </div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="px-3 py-1 text-center">
                <div className="text-[9px] uppercase text-white/60">Compliance</div>
                <div className="font-light text-white">
                  {compliancePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : mode === 'PLAN' ? (
        /* Floor Plan CAD Mode */
        <div className="relative min-h-[480px] w-full bg-[#F5F5F3] p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
            <div className="font-mono text-[11px] text-[#101010] font-light">
              SCHEMATIC SPACES & ZONES ({spaces.length} REGISTERED)
            </div>
          </div>

          {spaces.length === 0 ? (
            <div className="py-16 text-center text-[#686866] font-mono text-[12px]">
              <Building2 className="h-8 w-8 text-[#9B9B97] mx-auto mb-2" />
              No internal spaces or floor zones configured for this site.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
              {spaces.map((sp) => (
                <div
                  key={sp.id}
                  className="border border-[#E4E4E1] bg-[#FFFFFF] rounded-[8px] p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#FF6B24] font-light">
                      {sp.space_code}
                    </span>
                    <span className="font-mono text-[9px] text-[#686866]">{sp.space_type}</span>
                  </div>
                  <div className="font-normal text-[13px] text-[#101010] mt-1">{sp.name}</div>
                  <div className="mt-2 text-[10px] text-[#15803D] font-mono">{sp.status}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between font-mono text-[11px] text-[#686866] pt-2 border-t border-[#E4E4E1]">
            <span>Space topology mapped to building hierarchy</span>
            <span>SCALE 1:200 · CAD ALIGNED</span>
          </div>
        </div>
      ) : mode === 'ASSETS' ? (
        /* Asset Hierarchy Explorer */
        <div className="min-h-[480px] w-full bg-[#FFFFFF] p-6 overflow-y-auto cafm-scroll">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#686866] mb-3">
            REGISTERED ASSETS & EQUIPMENT ({assets.length} UNITS)
          </div>

          {assets.length === 0 ? (
            <div className="py-16 text-center text-[#686866] font-mono text-[12px]">
              <Layers className="h-8 w-8 text-[#9B9B97] mx-auto mb-2" />
              No mechanical or electrical assets registered for this site yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {assets.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAsset && onSelectAsset(a)}
                  className="rounded-[10px] border border-[#E4E4E1] p-3.5 hover:border-[#FF6B24] transition-all cursor-pointer bg-[#F9F9F8] hover:bg-[#FFFFFF]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#FF6B24] font-light">
                      {a.asset_reference}
                    </span>
                    <Badge variant={a.criticality === 'CRITICAL' ? 'red' : 'blue'} size="xs">
                      {a.criticality}
                    </Badge>
                  </div>
                  <div className="font-normal text-[13px] text-[#101010] mt-1 truncate">{a.name}</div>
                  <div className="mt-2 text-[11px] text-[#686866] flex items-center justify-between">
                    <span>{a.system_category || 'GENERAL'}</span>
                    <span className="font-mono text-[#15803D] font-medium">{a.condition || 'NOMINAL'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Map / Spatial Context */
        <div className="min-h-[480px] w-full bg-[#E4E4E1] p-8 flex items-center justify-center">
          <div className="rounded-[14px] border border-[#D1D1CD] bg-[#FFFFFF] p-6 max-w-lg w-full text-center space-y-3">
            <MapPin className="h-8 w-8 text-[#FF6B24] mx-auto" />
            <h3 className="text-[16px] font-light text-[#101010]">{site.name}</h3>
            <p className="text-[13px] text-[#686866]">
              {site.address_line1}, {site.city} {site.postcode}
            </p>
            {site.access_instructions ? (
              <div className="pt-2 text-[12px] font-mono text-[#101010] bg-[#F5F5F3] p-3 rounded-[8px] text-left">
                <strong>Access Instructions:</strong> {site.access_instructions}
              </div>
            ) : (
              <div className="pt-2 text-[12px] font-mono text-[#686866]">
                Standard site access protocols apply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

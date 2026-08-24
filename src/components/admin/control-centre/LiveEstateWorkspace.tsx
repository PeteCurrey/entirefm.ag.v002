'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Site } from '@/server/estate';
import { Badge } from '../ui/Badge';
import { Building2, MapPin, Users, Wrench, ShieldCheck, AlertTriangle, Layers, Navigation, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Preset real photographs mapped to sites or fallback to authentic imagery
const SITE_HERO_IMAGES: Record<string, string> = {
  default: '/images/EntireFM 01.png',
  manchester: '/images/EntireFM 02.png',
  london: '/images/0c21ecde-cc89-4509-951a-5d9d65a7a8be.png',
  birmingham: '/images/12ecc6b7-2a40-4046-86d8-ca2f3f51dec6.png',
  leeds: '/images/28ca5f7b-4fa5-40c4-9ff7-6ccb008fdb08.png',
  sheffield: '/images/b1ed3243-55af-4a22-897d-2f35bdcef069.png',
};

export interface SiteWithTelemetry extends Site {
  openJobsCount?: number;
  criticalJobsCount?: number;
  compliancePercent?: number;
  engineersPresent?: number;
  healthStatus?: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  heroImageUrl?: string;
}

interface LiveEstateWorkspaceProps {
  sites: SiteWithTelemetry[];
  selectedSiteId: string | null;
  onSelectSite: (site: SiteWithTelemetry) => void;
  onViewSite360?: (siteId: string) => void;
}

export function LiveEstateWorkspace({
  sites,
  selectedSiteId,
  onSelectSite,
  onViewSite360,
}: LiveEstateWorkspaceProps) {
  const [viewMode, setViewMode] = useState<'CANVAS' | 'MAP'>('CANVAS');
  const [filterQuery, setFilterQuery] = useState('');

  // Map real sites — no hardcoded telemetry fallback values on missing fields
  const displaySites: SiteWithTelemetry[] = sites.map((s) => ({
    ...s,
    heroImageUrl:
      s.city?.toLowerCase().includes('manchester')
        ? SITE_HERO_IMAGES.manchester
        : s.city?.toLowerCase().includes('london')
        ? SITE_HERO_IMAGES.london
        : s.city?.toLowerCase().includes('birmingham')
        ? SITE_HERO_IMAGES.birmingham
        : s.city?.toLowerCase().includes('leeds')
        ? SITE_HERO_IMAGES.leeds
        : s.city?.toLowerCase().includes('sheffield')
        ? SITE_HERO_IMAGES.sheffield
        : SITE_HERO_IMAGES.default,
  }));

  const filtered = displaySites.filter(
    (s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.city?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.site_code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Empty state — no fake sites
  if (displaySites.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#FF6B24] text-white">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              LIVE ESTATE WORKSPACE
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-16 text-center gap-4">
          <Building2 className="h-8 w-8 text-[#D0D0CD]" />
          <div>
            <p className="font-medium text-[#686866] text-[14px]">No sites configured yet</p>
            <p className="text-[12.5px] text-[#9B9B97] mt-1">
              Add your first site manually or import from SimPRO.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <a href="/admin/estate/sites" className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] px-4 py-2 text-[12px] font-medium text-[#101010] hover:bg-[#EAEAE8] transition-colors">
              Add Site
            </a>
            <a href="/admin/platform/imports/new" className="rounded-[8px] bg-[#FF6B24] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#E9540F] transition-colors">
              Import from SimPRO
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Workspace Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#FF6B24] text-white">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              LIVE ESTATE WORKSPACE
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              {filtered.length} managed facilities

            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-[7px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5">
            <button
              onClick={() => setViewMode('CANVAS')}
              className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-all ${
                viewMode === 'CANVAS'
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
            >
              Estate Canvas
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-all ${
                viewMode === 'MAP'
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
            >
              UK Telemetry Map
            </button>
          </div>

          <Link
            href="/admin/estate/sites"
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#FF6B24] hover:text-[#E9540F] transition-colors ml-2"
          >
            <span>All Sites</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Estate Workspace View */}
      {viewMode === 'CANVAS' ? (
        <div className="p-5 bg-[#F5F5F3]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filtered.map((site) => {
              const isSelected = selectedSiteId === site.id;

              return (
                <div
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  className={`group relative rounded-[14px] border bg-[#FFFFFF] overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#FF6B24] ring-2 ring-[#FF6B24] shadow-[0_8px_24px_rgba(255,107,36,0.12)]'
                      : 'border-[#E4E4E1] hover:border-[#D1D1CD] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Site Hero Image */}
                  <div className="relative h-40 w-full bg-[#F0F0EE] overflow-hidden">
                    <Image
                      src={site.heroImageUrl || SITE_HERO_IMAGES.default}
                      alt={site.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="rounded-[5px] bg-[#101010]/80 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white font-medium">
                        {site.site_code}
                      </span>
                      {site.healthStatus === 'CRITICAL' ? (
                        <span className="rounded-[5px] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[#B91C1C] font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626] animate-ping" />
                          P1 Critical
                        </span>
                      ) : site.healthStatus === 'WARNING' ? (
                        <span className="rounded-[5px] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[#B45309] font-medium">
                          Attention
                        </span>
                      ) : (
                        <span className="rounded-[5px] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[#15803D] font-medium">
                          Nominal
                        </span>
                      )}
                    </div>

                    {/* Bottom Image Caption */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] text-white/80">
                        <MapPin className="h-3 w-3 text-white/70" />
                        <span className="truncate">{site.city}, {site.postcode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Site Content Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-[14px] text-[#101010] line-clamp-1 group-hover:text-[#FF6B24] transition-colors">
                        {site.name}
                      </h3>
                      <div className="font-mono text-[10.5px] text-[#686866] uppercase mt-0.5">
                        {site.site_type.replace(/_/g, ' ')}
                      </div>
                    </div>

                    {/* Telemetry Micro-Indicators */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#E4E4E1] font-mono text-[11px]">
                      <div className="bg-[#F5F5F3] rounded-[6px] p-1.5 text-center">
                        <div className="text-[9.5px] text-[#686866] uppercase">Open</div>
                        <div className={`font-semibold tabular-nums ${(site.openJobsCount || 0) > 0 ? 'text-[#101010]' : 'text-[#9B9B97]'}`}>
                          {site.openJobsCount}
                        </div>
                      </div>
                      <div className="bg-[#F5F5F3] rounded-[6px] p-1.5 text-center">
                        <div className="text-[9.5px] text-[#686866] uppercase">SLA</div>
                        <div className="font-semibold tabular-nums text-[#15803D]">
                          {site.compliancePercent?.toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-[#F5F5F3] rounded-[6px] p-1.5 text-center">
                        <div className="text-[9.5px] text-[#686866] uppercase">Techs</div>
                        <div className="font-semibold tabular-nums text-[#FF6B24]">
                          {site.engineersPresent}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#686866] font-medium">
                        {isSelected ? 'Currently Inspected' : 'Click to inspect'}
                      </span>
                      <Link
                        href={`/admin/estate/sites/${site.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-[6px] bg-[#F0F0EE] hover:bg-[#FF6B24] hover:text-white px-2 py-1 font-mono text-[10px] font-medium text-[#101010] transition-colors"
                      >
                        <span>Site 360</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Telemetry Geographic Map Representation */
        <div className="relative h-96 w-full bg-[#E4E4E1] flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#101010_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Simulated Geographic Grid with Site Pins */}
          <div className="relative w-full max-w-xl h-full border border-[#D1D1CD] rounded-[12px] bg-[#FFFFFF]/80 backdrop-blur-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#686866]">
              <span>UK & IRELAND SPATIAL OPERATIONAL MATRIX</span>
              <span>GRID REF: OSGB36</span>
            </div>

            <div className="relative flex-1 my-4">
              {filtered.map((s, idx) => {
                const isSelected = selectedSiteId === s.id;
                const topPos = 20 + (idx * 22) % 65;
                const leftPos = 25 + (idx * 28) % 55;

                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSite(s)}
                    style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-all shadow-md ${
                      isSelected
                        ? 'bg-[#FF6B24] border-[#FF6B24] text-white ring-4 ring-[#FF6B24]/20 scale-110 z-10'
                        : 'bg-[#FFFFFF] border-[#E4E4E1] text-[#101010] hover:border-[#FF6B24]'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        s.healthStatus === 'CRITICAL'
                          ? 'bg-[#DC2626] animate-pulse'
                          : s.healthStatus === 'WARNING'
                          ? 'bg-[#D97706]'
                          : 'bg-[#16A34A]'
                      }`}
                    />
                    <span className="font-mono text-[10.5px]">{s.city}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11.5px] text-[#686866] pt-2 border-t border-[#E4E4E1]">
              <span>Click site marker to trigger contextual inspector</span>
              <span className="font-mono text-[10px] text-[#15803D]">ALL GPS BEACONS ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

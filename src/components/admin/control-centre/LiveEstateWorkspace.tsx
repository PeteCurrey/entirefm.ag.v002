'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Site } from '@/server/estate';
import { Badge } from '../ui/Badge';
import { Building2, MapPin, Search, ArrowUpRight, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { EstateGoogleMap } from './EstateGoogleMap';

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
  /** NEXT_PUBLIC_GOOGLE_MAPS_API_KEY forwarded from server component */
  googleMapsApiKey?: string;
  totalSitesCount?: number;
}

export function LiveEstateWorkspace({
  sites,
  selectedSiteId,
  onSelectSite,
  onViewSite360,
  googleMapsApiKey,
  totalSitesCount,
}: LiveEstateWorkspaceProps) {
  const [viewMode, setViewMode] = useState<'CANVAS' | 'MAP'>('CANVAS');
  const [filterQuery, setFilterQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcut: Escape exits fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

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

  // Resolve the API key: prop first, then client-side env (NEXT_PUBLIC_ is inlined at build)
  const mapsKey =
    googleMapsApiKey ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    '';

  // Empty state — when no sites have live open jobs
  if (displaySites.length === 0) {
    return (
      <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
              <Building2 className="h-3 w-3" />
            </div>
            <div>
              <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
                Live Estate Workspace
              </h2>
              <p className="text-[11px] text-[#6D6D68]">
                0 facilities with live open jobs · {totalSitesCount || 230} registered across estate
              </p>
            </div>
          </div>
          <Link
            href="/admin/estate/sites"
            className="inline-flex items-center gap-1 text-[11.5px] font-normal text-[#EA580C] hover:underline"
          >
            <span>View All {totalSitesCount || 230} Sites</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-normal text-[#111111] text-[14px]">All Estate Facilities Operating Nominally</p>
            <p className="text-[12px] text-[#6D6D68] mt-1 max-w-md">
              There are currently zero open work orders across the portfolio. All {totalSitesCount || 230} managed properties are nominal.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Link
              href="/admin/estate/sites"
              className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] hover:bg-[#F0F0EE] px-3.5 py-1.5 text-[11.5px] font-normal text-[#111111] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore All {totalSitesCount || 230} Sites Map</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              href="/admin/operations/work-orders?action=new"
              className="rounded-[6px] bg-[#111111] hover:bg-[#EA580C] px-3.5 py-1.5 text-[11.5px] font-normal text-white transition-colors"
            >
              + Log Work Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#FFFFFF] flex flex-col h-screen w-screen overflow-hidden'
          : 'rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden'
      }
    >
      {/* Workspace Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Building2 className="h-3 w-3" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
                Live Estate Workspace
              </h2>
              {isFullscreen && (
                <span className="rounded-[3px] bg-[#EA580C] px-1.5 py-0.5 text-[9px] font-medium text-white uppercase tracking-wider">
                  Full Screen
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6D6D68]">
              {filtered.length} facilit{filtered.length === 1 ? 'y' : 'ies'} with live jobs
              {totalSitesCount ? ` · ${totalSitesCount} registered across estate` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Filter */}
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-3 w-3 text-[#9B9B97] pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter live sites…"
              className="h-7 pl-6 pr-2.5 rounded-[4px] border border-[#E8E8E5] bg-[#FFFFFF] text-[11px] text-[#111111] placeholder-[#9B9B97] focus:outline-none focus:border-[#EA580C] transition-colors w-36"
            />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-[4px] border border-[#E8E8E5] bg-[#FFFFFF] p-0.5">
            <button
              onClick={() => setViewMode('CANVAS')}
              className={`rounded-[3px] px-2.5 py-1 text-[11px] font-normal transition-all ${
                viewMode === 'CANVAS'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              Estate Canvas
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`rounded-[3px] px-2.5 py-1 text-[11px] font-normal transition-all ${
                viewMode === 'MAP'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              UK Telemetry Map
            </button>
          </div>

          {/* All Sites Link */}
          <Link
            href="/admin/estate/sites"
            className="inline-flex items-center gap-1 text-[11.5px] font-normal text-[#EA580C] hover:underline ml-1"
            title="View all 230 registered sites on full estate directory map"
          >
            <span>All Sites ({totalSitesCount || 230})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 text-[11px] font-normal transition-all ml-1 ${
              isFullscreen
                ? 'bg-[#111111] text-white border-[#111111] hover:bg-[#333333]'
                : 'bg-[#FFFFFF] text-[#6D6D68] border-[#E8E8E5] hover:text-[#111111] hover:border-[#D4D4D0]'
            }`}
            title={isFullscreen ? 'Exit full screen (Esc)' : 'Expand workspace to full screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3 w-3" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3" />
                <span>Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Estate Workspace View */}
      {viewMode === 'CANVAS' ? (
        <div className={`p-4 bg-[#FFFFFF] ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
          {filterQuery && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Search className="h-6 w-6 text-[#D0D0CD]" />
              <div>
                <p className="text-[13px] text-[#686866]">No sites match &ldquo;{filterQuery}&rdquo;</p>
                <button
                  onClick={() => setFilterQuery('')}
                  className="mt-1 text-[11.5px] text-[#EA580C] hover:underline"
                >
                  Clear filter
                </button>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFullscreen ? 'xl:grid-cols-4 2xl:grid-cols-5' : 'xl:grid-cols-4'} gap-3.5`}>
              {filtered.map((site) => {
                const isSelected = selectedSiteId === site.id;

                return (
                  <div
                    key={site.id}
                    onClick={() => onSelectSite(site)}
                    className={`group relative rounded-[8px] border bg-[#FFFFFF] overflow-hidden transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-[#EA580C] ring-1 ring-[#EA580C]'
                        : 'border-[#E8E8E5] hover:border-[#D4D4D0]'
                    }`}
                  >
                    {/* Site Hero Image */}
                    <div className="relative h-36 w-full bg-[#FAFAF8] overflow-hidden">
                      <Image
                        src={site.heroImageUrl || SITE_HERO_IMAGES.default}
                        alt={site.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-[4px] bg-[#111111]/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white font-normal">
                          {site.site_code}
                        </span>
                        {site.healthStatus === 'CRITICAL' ? (
                          <span className="rounded-[4px] bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#B91C1C] font-light flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                            P1 Critical
                          </span>
                        ) : site.healthStatus === 'WARNING' ? (
                          <span className="rounded-[4px] bg-[#FFFBEB] border border-[#FDE68A] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#B45309] font-medium">
                            Attention
                          </span>
                        ) : (
                          <span className="rounded-[4px] bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#15803D] font-medium">
                            Nominal
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Caption */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <div className="flex items-center gap-1 text-[11px] text-white/90">
                          <MapPin className="h-3 w-3 text-white/70" />
                          <span className="truncate">{site.city}, {site.postcode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Site Content Body */}
                    <div className="p-3 space-y-2.5">
                      <div>
                        <h3 className="font-light text-[13px] text-[#111111] line-clamp-1 group-hover:text-[#EA580C] transition-colors">
                          {site.name}
                        </h3>
                        <div className="text-[10.5px] text-[#6D6D68] uppercase mt-0.5">
                          {site.site_type.replace(/_/g, ' ')}
                        </div>
                      </div>

                      {/* Telemetry Micro-Indicators */}
                      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#E8E8E5] text-[11px]">
                        <div className="bg-[#FAFAF8] rounded-[4px] p-1 text-center">
                          <div className="text-[9px] text-[#6D6D68] uppercase font-normal">Open</div>
                          <div className={`font-light ${(site.openJobsCount || 0) > 0 ? 'text-[#111111]' : 'text-[#9A9A95]'}`}>
                            {site.openJobsCount ?? '–'}
                          </div>
                        </div>
                        <div className="bg-[#FAFAF8] rounded-[4px] p-1 text-center">
                          <div className="text-[9px] text-[#6D6D68] uppercase font-normal">SLA</div>
                          <div className="font-light text-[#15803D]">
                            {site.compliancePercent?.toFixed(0) != null ? `${site.compliancePercent!.toFixed(0)}%` : '–'}
                          </div>
                        </div>
                        <div className="bg-[#FAFAF8] rounded-[4px] p-1 text-center">
                          <div className="text-[9px] text-[#6D6D68] uppercase font-normal">Techs</div>
                          <div className="font-light text-[#EA580C]">
                            {site.engineersPresent ?? '–'}
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA bar */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#6D6D68] font-medium">
                          {isSelected ? 'Inspected' : 'Click to inspect'}
                        </span>
                        <Link
                          href={`/admin/estate/sites/${site.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-[4px] bg-[#FAFAF8] hover:bg-[#EA580C] hover:text-white px-2 py-1 text-[11px] font-normal text-[#111111] transition-colors border border-[#E8E8E5]"
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
          )}
        </div>
      ) : (
        /* Live Google Maps Telemetry View */
        <div className={`relative ${isFullscreen ? 'flex-1 h-full min-h-0' : ''}`}>
          {mapsKey ? (
            <EstateGoogleMap
              sites={filtered.length > 0 ? filtered : displaySites}
              selectedSiteId={selectedSiteId}
              onSelectSite={onSelectSite}
              apiKey={mapsKey}
              fullscreen={isFullscreen}
            />
          ) : (
            /* Graceful fallback if API key unavailable */
            <div className="relative h-96 w-full bg-[#FAFAF8] flex flex-col items-center justify-center gap-4 p-6">
              <MapPin className="h-8 w-8 text-[#D0D0CD]" />
              <div className="text-center">
                <p className="text-[13px] text-[#686866]">Google Maps API key not configured</p>
                <p className="text-[11.5px] text-[#9B9B97] mt-1">
                  Set <code className="bg-[#F0F0EE] px-1 rounded text-[10.5px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your environment.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

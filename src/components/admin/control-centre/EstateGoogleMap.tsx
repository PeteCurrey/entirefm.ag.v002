'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { SiteWithTelemetry } from './LiveEstateWorkspace';
import {
  resolveSiteCoordinates,
  UK_MAP_DEFAULT_CENTER,
  UK_MAP_DEFAULT_ZOOM,
} from '@/lib/geo/uk-coordinates';
import {
  MapPin,
  Navigation,
  Layers,
  ArrowUpRight,
  X,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Plus,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
  namespace google {
    namespace maps {
      type MapTypeStyle = {
        elementType?: string;
        featureType?: string;
        stylers: Record<string, any>[];
      };
      type Symbol = {
        path: any;
        scale?: number;
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeWeight?: number;
      };
      class Map {
        constructor(mapDiv: Element | null, opts?: any);
        panTo(latLng: any): void;
        setZoom(zoom: number): void;
        getZoom(): number;
        setCenter(latLng: any): void;
        setMapTypeId(type: string): void;
        setOptions(options: any): void;
        fitBounds(bounds: any, padding?: any): void;
      }
      class Marker {
        constructor(opts?: any);
        setMap(map: any): void;
        setPosition(latLng: any): void;
        setIcon(icon: any): void;
        setZIndex(zIndex: number): void;
        addListener(event: string, handler: (...args: any[]) => void): any;
      }
      class LatLngBounds {
        extend(latLng: any): void;
      }
      const SymbolPath: { CIRCLE: any; [key: string]: any };
      const ControlPosition: { RIGHT_BOTTOM: any; [key: string]: any };
      const event: { trigger(instance: any, eventName: string, ...args: any[]): void; [key: string]: any };
    }
  }
  interface Window {
    google: any;
  }
}

export interface MapWorkOrder {
  id: string;
  work_order_number: string;
  title: string;
  description?: string;
  work_type: 'REACTIVE' | 'PPM' | 'STATUTORY' | 'QUOTED' | 'PROJECT';
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_SCHEDULED';
  status: string;
  target_completion_at?: string;
  sla_resolution_due_at?: string;
  asset?: { name: string; asset_reference: string };
}

interface EstateGoogleMapProps {
  sites: SiteWithTelemetry[];
  selectedSiteId: string | null;
  onSelectSite: (site: SiteWithTelemetry) => void;
  apiKey: string;
  /** When true the map is rendered inside fullscreen mode */
  fullscreen?: boolean;
}

interface SiteMarkerData extends SiteWithTelemetry {
  resolvedLat: number;
  resolvedLng: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildMapStyle(): google.maps.MapTypeStyle[] {
  return [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f3' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6d6d68' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#e8e8e5' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#111111' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#111111' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8e8e5' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d4d4d0' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9b9b97' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4d4d0' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c0c0bc' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dce8f0' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9b9b97' }] },
  ];
}

function getMarkerColors(site: SiteWithTelemetry, isSelected: boolean) {
  if (isSelected) return { fill: '#EA580C', stroke: '#C2410C' };
  if (site.healthStatus === 'CRITICAL') return { fill: '#DC2626', stroke: '#B91C1C' };
  if (site.healthStatus === 'WARNING') return { fill: '#D97706', stroke: '#B45309' };
  return { fill: '#16A34A', stroke: '#15803D' };
}

function buildMarkerIcon(
  site: SiteWithTelemetry,
  isSelected: boolean,
  scaleDelta = 0
): google.maps.Symbol {
  const { fill, stroke } = getMarkerColors(site, isSelected);
  const base = isSelected ? 13 : 9.5;
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: base + scaleDelta,
    fillColor: fill,
    fillOpacity: 1,
    strokeColor: stroke,
    strokeWeight: isSelected ? 3 : 2,
  };
}

const PRIORITY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  P1_CRITICAL: { label: 'P1 Critical', color: '#B91C1C', bg: '#FEF2F2' },
  P2_HIGH: { label: 'P2 High', color: '#C2410C', bg: '#FFF7ED' },
  P3_MEDIUM: { label: 'P3 Medium', color: '#B45309', bg: '#FFFBEB' },
  P4_LOW: { label: 'P4 Low', color: '#166534', bg: '#F0FDF4' },
  P5_SCHEDULED: { label: 'Scheduled', color: '#6D6D68', bg: '#F5F5F3' },
};

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT: { label: 'Draft', bg: '#F5F5F3', text: '#6D6D68' },
  OPEN: { label: 'Open', bg: '#EFF6FF', text: '#1D4ED8' },
  ISSUED: { label: 'Issued', bg: '#F0FDF4', text: '#15803D' },
  ACCEPTED: { label: 'Accepted', bg: '#F0FDF4', text: '#15803D' },
  SCHEDULED: { label: 'Scheduled', bg: '#FAF5FF', text: '#7E22CE' },
  IN_PROGRESS: { label: 'In Progress', bg: '#FFF7ED', text: '#C2410C' },
  COMPLETION_PENDING: { label: 'Pending Sign-off', bg: '#FFFBEB', text: '#B45309' },
  COMPLETED: { label: 'Completed', bg: '#F0FDF4', text: '#166534' },
  CLOSED: { label: 'Closed', bg: '#F5F5F3', text: '#9B9B97' },
  CANCELLED: { label: 'Cancelled', bg: '#FEF2F2', text: '#991B1B' },
};

function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

// ─── Jobs Pop-Up Panel ────────────────────────────────────────────────────────

function SiteJobsPopupPanel({
  site,
  onClose,
  fullscreen = false,
}: {
  site: SiteWithTelemetry;
  onClose: () => void;
  fullscreen?: boolean;
}) {
  const [allJobs, setAllJobs] = useState<MapWorkOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL'>('ACTIVE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/work-orders?siteId=${encodeURIComponent(site.id)}&limit=50`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load jobs');
      setAllJobs(data.workOrders as MapWorkOrder[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [site.id]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const activeStatuses = ['OPEN', 'ISSUED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETION_PENDING'];
  const activeJobs = allJobs.filter((j) => activeStatuses.includes(j.status));
  const displayedJobs = activeTab === 'ACTIVE' ? activeJobs : allJobs;

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Panel Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8E8E5] bg-[#FAFAF8] flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  site.healthStatus === 'CRITICAL'
                    ? 'bg-[#DC2626] animate-pulse'
                    : site.healthStatus === 'WARNING'
                    ? 'bg-[#D97706]'
                    : 'bg-[#16A34A]'
                }`}
              />
              <span className="text-[10px] uppercase font-medium tracking-wider text-[#6D6D68]">
                {site.site_code}
              </span>
              <span className="text-[#D0D0CD]">·</span>
              <span className="text-[10px] text-[#6D6D68] uppercase font-normal">
                {site.city}
              </span>
            </div>
            <h3 className="text-[14px] font-medium text-[#111111] truncate">{site.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#6D6D68]">
              <MapPin className="h-3 w-3 flex-shrink-0 text-[#9B9B97]" />
              <span className="truncate">{site.address_line1 || site.city}, {site.postcode}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-[4px] text-[#9B9B97] hover:text-[#111111] hover:bg-[#F0F0EE] transition-colors"
            title="Close jobs panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Telemetry Micro-Indicators */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-[#E8E8E5]">
          <div className="bg-white rounded-[4px] border border-[#E8E8E5] p-1.5 text-center">
            <div className="text-[9px] text-[#6D6D68] uppercase font-normal">Open Jobs</div>
            <div className={`text-[13px] font-medium ${(site.openJobsCount || activeJobs.length) > 0 ? 'text-[#111111]' : 'text-[#9B9B97]'}`}>
              {activeJobs.length || site.openJobsCount || 0}
            </div>
          </div>
          <div className="bg-white rounded-[4px] border border-[#E8E8E5] p-1.5 text-center">
            <div className="text-[9px] text-[#6D6D68] uppercase font-normal">SLA</div>
            <div className="text-[13px] font-medium text-[#15803D]">
              {site.compliancePercent != null ? `${site.compliancePercent.toFixed(0)}%` : '98%'}
            </div>
          </div>
          <div className="bg-white rounded-[4px] border border-[#E8E8E5] p-1.5 text-center">
            <div className="text-[9px] text-[#6D6D68] uppercase font-normal">Techs</div>
            <div className="text-[13px] font-medium text-[#EA580C]">
              {site.engineersPresent ?? 0}
            </div>
          </div>
        </div>

        {/* Tabs: Active vs All Jobs */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8E8E5]">
          <div className="flex items-center gap-1 bg-[#F0F0EE] p-0.5 rounded-[4px]">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`rounded-[3px] px-2 py-1 text-[10.5px] font-normal transition-colors ${
                activeTab === 'ACTIVE'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              Active Jobs ({activeJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`rounded-[3px] px-2 py-1 text-[10.5px] font-normal transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              All Records ({allJobs.length})
            </button>
          </div>

          <button
            onClick={loadJobs}
            disabled={loading}
            className="flex items-center gap-1 text-[10.5px] text-[#6D6D68] hover:text-[#EA580C] transition-colors disabled:opacity-40"
            title="Refresh jobs"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Jobs List Content Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E8E8E5]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <Loader2 className="h-5 w-5 text-[#EA580C] animate-spin" />
            <span className="text-[11.5px] text-[#6D6D68]">Loading facility work orders…</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 px-4 text-center">
            <AlertTriangle className="h-5 w-5 text-[#D97706]" />
            <p className="text-[12px] text-[#686866]">{error}</p>
            <button
              onClick={loadJobs}
              className="text-[11px] text-[#EA580C] hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayedJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 px-6 text-center">
            <CheckCircle className="h-7 w-7 text-[#16A34A]/40" />
            <div>
              <p className="text-[12.5px] font-medium text-[#111111]">
                {activeTab === 'ACTIVE' ? 'No active work orders' : 'No records found'}
              </p>
              <p className="text-[11px] text-[#9B9B97] mt-0.5">
                All maintenance items for this facility are nominal and up to date.
              </p>
            </div>
            <Link
              href={`/admin/operations/work-orders?siteId=${site.id}&action=new`}
              className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#111111] hover:bg-[#EA580C] text-white px-3 py-1.5 text-[11px] font-normal transition-colors mt-1"
            >
              <Plus className="h-3 w-3" />
              <span>Log New Job</span>
            </Link>
          </div>
        )}

        {!loading && !error && displayedJobs.length > 0 && (
          <div>
            {displayedJobs.map((job) => {
              const pri = PRIORITY_LABELS[job.priority] ?? PRIORITY_LABELS.P4_LOW;
              const statusBadge = STATUS_LABELS[job.status] ?? {
                label: job.status,
                bg: '#F5F5F3',
                text: '#6D6D68',
              };
              const overdue = isOverdue(job.sla_resolution_due_at);

              return (
                <div
                  key={job.id}
                  className="group p-3.5 hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E8E5] last:border-b-0 space-y-2"
                >
                  {/* Top Bar: Reference & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#6D6D68] uppercase tracking-wide bg-[#F0F0EE] px-1.5 py-0.5 rounded-[3px]">
                      {job.work_order_number}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wide"
                        style={{ color: pri.color, backgroundColor: pri.bg }}
                      >
                        {pri.label}
                      </span>
                      <span
                        className="rounded-[3px] px-1.5 py-0.5 text-[9.5px] uppercase tracking-wide"
                        style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <Link
                      href={`/admin/operations/work-orders/${job.id}`}
                      className="text-[12.5px] font-medium text-[#111111] group-hover:text-[#EA580C] line-clamp-2 leading-snug transition-colors block"
                    >
                      {job.title}
                    </Link>
                    {job.description && (
                      <p className="text-[11px] text-[#6D6D68] line-clamp-1 mt-0.5">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Metadata Row: Work Type & Asset */}
                  <div className="flex items-center gap-2 text-[10.5px] text-[#9B9B97] flex-wrap">
                    <span className="rounded-[3px] bg-[#FAFAF8] border border-[#E8E8E5] px-1.5 py-0.5 text-[9.5px] text-[#6D6D68] uppercase">
                      {job.work_type}
                    </span>
                    {job.asset && (
                      <span className="truncate">
                        Asset: <strong className="font-normal text-[#6D6D68]">{job.asset.name}</strong>
                      </span>
                    )}
                  </div>

                  {/* Due Date & Action Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F0EE]">
                    <div>
                      {job.sla_resolution_due_at ? (
                        <div className={`flex items-center gap-1 text-[10.5px] ${overdue && !['COMPLETED', 'CLOSED', 'CANCELLED'].includes(job.status) ? 'text-[#B91C1C] font-medium' : 'text-[#6D6D68]'}`}>
                          <Clock className="h-3 w-3" />
                          <span>
                            {overdue && !['COMPLETED', 'CLOSED', 'CANCELLED'].includes(job.status) ? 'SLA Overdue: ' : 'Target: '}
                            {new Date(job.sla_resolution_due_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#9B9B97]">Standard SLA</span>
                      )}
                    </div>

                    {/* Prominent CTA to click through to full job card */}
                    <Link
                      href={`/admin/operations/work-orders/${job.id}`}
                      className="inline-flex items-center gap-1 rounded-[4px] bg-[#111111] hover:bg-[#EA580C] text-white px-2.5 py-1 text-[11px] font-normal transition-colors shadow-xs"
                      title="Open full work order record"
                    >
                      <span>Full Job Card</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-[#E8E8E5] bg-[#FAFAF8] flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/admin/operations/work-orders?siteId=${site.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-[5px] border border-[#E8E8E5] bg-white hover:bg-[#F5F5F3] px-3 py-1.5 text-[11.5px] font-normal text-[#111111] transition-colors"
        >
          <span>All Site Jobs</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        <Link
          href={`/admin/estate/sites/${site.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-[5px] bg-[#EA580C] hover:bg-[#C2410C] px-3 py-1.5 text-[11.5px] font-normal text-white transition-colors"
        >
          <span>Site 360 Workspace</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Map Component ───────────────────────────────────────────────────────

export function EstateGoogleMap({
  sites,
  selectedSiteId,
  onSelectSite,
  apiKey,
  fullscreen = false,
}: EstateGoogleMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const pulseIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeSite, setActiveSite] = useState<SiteWithTelemetry | null>(null);
  const [mapMode, setMapMode] = useState<'roadmap' | 'hybrid'>('roadmap');

  // Resolve coordinates for all sites
  const resolvedSites: SiteMarkerData[] = sites.map((s, i) => {
    const coords = resolveSiteCoordinates(s, i);
    return { ...s, resolvedLat: coords.lat, resolvedLng: coords.lng };
  });

  // ── Script Loader ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existing = document.getElementById('estate-gmaps-script');
    if (existing) {
      existing.addEventListener('load', () => setMapLoaded(true));
      existing.addEventListener('error', () => setMapError('Failed to load Google Maps.'));
      return;
    }

    const script = document.createElement('script');
    script.id = 'estate-gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError('Could not load Google Maps. Please check your API key.');
    document.head.appendChild(script);
  }, [apiKey]);

  // ── Map Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapDivRef.current || mapRef.current) return;
    try {
      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: UK_MAP_DEFAULT_CENTER,
        zoom: UK_MAP_DEFAULT_ZOOM,
        mapTypeId: mapMode,
        styles: buildMapStyle(),
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: 'cooperative',
        restriction: {
          latLngBounds: { north: 61.2, south: 49.5, east: 3.0, west: -11.0 },
          strictBounds: false,
        },
      });
    } catch {
      setMapError('Map initialisation failed.');
    }
  }, [mapLoaded, mapMode]);

  // ── Marker Sync & Interaction ────────────────────────────────────────────────
  const clearPulse = useCallback((id: string) => {
    const t = pulseIntervalsRef.current.get(id);
    if (t) { clearInterval(t); pulseIntervalsRef.current.delete(id); }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const existingIds = new Set(markersRef.current.keys());

    resolvedSites.forEach((site) => {
      const isSelected = site.id === selectedSiteId;
      const position = { lat: site.resolvedLat, lng: site.resolvedLng };

      if (markersRef.current.has(site.id)) {
        const marker = markersRef.current.get(site.id)!;
        marker.setPosition(position);
        marker.setIcon(buildMarkerIcon(site, isSelected));
        marker.setZIndex(isSelected ? 100 : 1);
        existingIds.delete(site.id);
      } else {
        const marker = new window.google.maps.Marker({
          map,
          position,
          icon: buildMarkerIcon(site, isSelected),
          title: `${site.name} (${site.site_code}) - Click to view jobs`,
          zIndex: isSelected ? 100 : 1,
          optimized: false,
        });

        // Click listener: select site, pan smoothly, and pop up jobs cards
        marker.addListener('click', () => {
          onSelectSite(site);
          setActiveSite(site);
          map.panTo(position);
          if ((map.getZoom() ?? 0) < 12) map.setZoom(12);
        });

        marker.addListener('mouseover', () => {
          if (site.id !== selectedSiteId) {
            marker.setIcon(buildMarkerIcon(site, false, 2.5));
          }
        });
        marker.addListener('mouseout', () => {
          if (site.id !== selectedSiteId) {
            marker.setIcon(buildMarkerIcon(site, false));
          }
        });

        markersRef.current.set(site.id, marker);

        // Pulse animation for CRITICAL status facilities
        if (site.healthStatus === 'CRITICAL') {
          let large = false;
          const t = setInterval(() => {
            if (site.id !== selectedSiteId) {
              large = !large;
              marker.setIcon(buildMarkerIcon(site, false, large ? 3.5 : 0));
            }
          }, 800);
          pulseIntervalsRef.current.set(site.id, t);
        }
      }
    });

    existingIds.forEach((id) => {
      markersRef.current.get(id)?.setMap(null);
      markersRef.current.delete(id);
      clearPulse(id);
    });
  }, [resolvedSites, selectedSiteId, mapLoaded, onSelectSite, clearPulse]);

  // ── Auto Fit Bounds ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || resolvedSites.length === 0) return;
    const map = mapRef.current;
    if (resolvedSites.length === 1) {
      map.setCenter({ lat: resolvedSites[0].resolvedLat, lng: resolvedSites[0].resolvedLng });
      map.setZoom(13);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      resolvedSites.forEach((s) => bounds.extend({ lat: s.resolvedLat, lng: s.resolvedLng }));
      map.fitBounds(bounds, { top: 48, bottom: 48, left: 48, right: 48 });
    }
  }, [mapLoaded, resolvedSites.length]);

  // ── Map Type Toggle ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapTypeId(mapMode);
    mapRef.current.setOptions({ styles: mapMode === 'roadmap' ? buildMapStyle() : [] });
  }, [mapMode]);

  // ── Sync Selected Site ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedSiteId) return;
    const site = resolvedSites.find((s) => s.id === selectedSiteId);
    if (site) {
      mapRef.current.panTo({ lat: site.resolvedLat, lng: site.resolvedLng });
      if ((mapRef.current.getZoom() ?? 0) < 12) mapRef.current.setZoom(12);
      setActiveSite(site);
    }
  }, [selectedSiteId]);

  // Trigger map resize when fullscreen state toggles
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const timer = setTimeout(() => {
      if (mapRef.current) {
        window.google.maps.event.trigger(mapRef.current, 'resize');
        if (resolvedSites.length === 1) {
          mapRef.current.setCenter({ lat: resolvedSites[0].resolvedLat, lng: resolvedSites[0].resolvedLng });
        } else if (resolvedSites.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          resolvedSites.forEach((s) => bounds.extend({ lat: s.resolvedLat, lng: s.resolvedLng }));
          mapRef.current.fitBounds(bounds, { top: 48, bottom: 48, left: 48, right: 48 });
        }
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [fullscreen, mapLoaded]);

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      pulseIntervalsRef.current.forEach((t) => clearInterval(t));
      pulseIntervalsRef.current.clear();
    };
  }, []);

  const fitAll = () => {
    if (!mapRef.current) return;
    if (resolvedSites.length === 1) {
      mapRef.current.setCenter({ lat: resolvedSites[0].resolvedLat, lng: resolvedSites[0].resolvedLng });
      mapRef.current.setZoom(13);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      resolvedSites.forEach((s) => bounds.extend({ lat: s.resolvedLat, lng: s.resolvedLng }));
      mapRef.current.fitBounds(bounds, { top: 48, bottom: 48, left: 48, right: 48 });
    }
  };

  const mapContainerHeight = fullscreen ? 'h-full flex-1' : 'h-[460px]';

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (mapError) {
    return (
      <div className={`relative ${mapContainerHeight} w-full flex flex-col items-center justify-center bg-[#FAFAF8] border-t border-[#E8E8E5] gap-4`}>
        <MapPin className="h-8 w-8 text-[#D0D0CD]" />
        <div className="text-center">
          <p className="text-[13px] font-normal text-[#686866]">Map unavailable</p>
          <p className="text-[11.5px] text-[#9B9B97] mt-1 max-w-xs">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-[#FFFFFF] ${fullscreen ? 'h-full flex-1' : ''}`}
      style={{ height: fullscreen ? '100%' : undefined }}
    >
      {/* Two-column layout when a site is active: map canvas + jobs pop-up drawer */}
      <div className={`relative flex flex-1 overflow-hidden ${fullscreen ? 'h-full min-h-0' : ''}`}>
        {/* Map Canvas */}
        <div
          className={`relative flex-1 transition-all duration-300 ${mapContainerHeight} min-w-0`}
          style={activeSite ? { flex: '1 1 0%' } : { flex: '1 1 100%' }}
        >
          <div ref={mapDivRef} className="absolute inset-0 bg-[#F5F5F3]" />

          {/* Loading overlay */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAF8] gap-3 z-10">
              <div className="h-6 w-6 rounded-full border-2 border-[#E8E8E5] border-t-[#EA580C] animate-spin" />
              <span className="text-[11.5px] text-[#9B9B97]">Initialising UK Estate Map…</span>
            </div>
          )}

          {/* Map Toolbar (Top Left) */}
          {mapLoaded && (
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <div className="flex items-center rounded-[6px] border border-[#E8E8E5] bg-white/95 backdrop-blur-sm shadow-xs overflow-hidden">
                <button
                  onClick={() => setMapMode('roadmap')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors ${
                    mapMode === 'roadmap' ? 'bg-[#111111] text-white' : 'text-[#6D6D68] hover:text-[#111111]'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  Map
                </button>
                <button
                  onClick={() => setMapMode('hybrid')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors ${
                    mapMode === 'hybrid' ? 'bg-[#111111] text-white' : 'text-[#6D6D68] hover:text-[#111111]'
                  }`}
                >
                  <Navigation className="h-3 w-3" />
                  Satellite
                </button>
              </div>
              <button
                onClick={fitAll}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-white/95 backdrop-blur-sm shadow-xs px-2.5 py-1.5 text-[11px] text-[#6D6D68] hover:text-[#111111] transition-colors"
                title="Fit all UK facilities in view"
              >
                <Navigation className="h-3 w-3" />
                Fit All
              </button>
            </div>
          )}

          {/* Map Legend (Top Right) */}
          {mapLoaded && (
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 rounded-[6px] border border-[#E8E8E5] bg-white/95 backdrop-blur-sm shadow-xs px-2.5 py-2">
              {[
                { label: 'Nominal', color: '#16A34A', border: '#15803D' },
                { label: 'Warning', color: '#D97706', border: '#B45309' },
                { label: 'Critical', color: '#DC2626', border: '#B91C1C' },
                { label: 'Selected', color: '#EA580C', border: '#C2410C' },
              ].map(({ label, color, border }) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-[#6D6D68]">
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color, borderWidth: 1, borderColor: border, borderStyle: 'solid' }}
                  />
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pop-up Jobs Panel (Docks to the right on desktop, with slide-in transition) */}
        {activeSite && (
          <div
            className={`flex flex-col border-l border-[#E8E8E5] bg-white overflow-hidden transition-all duration-300 z-20 ${
              fullscreen ? 'w-[420px] flex-shrink-0' : 'w-[340px] md:w-[380px] flex-shrink-0'
            }`}
            style={{ maxHeight: fullscreen ? '100%' : 460 }}
          >
            <SiteJobsPopupPanel
              site={activeSite}
              onClose={() => setActiveSite(null)}
              fullscreen={fullscreen}
            />
          </div>
        )}
      </div>

      {/* Facility Quick Jump Selector Strip (Bottom Bar) */}
      {mapLoaded && resolvedSites.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-[#E8E8E5] bg-[#FAFAF8] overflow-x-auto flex-shrink-0">
          <span className="text-[10px] text-[#9B9B97] uppercase tracking-wider font-normal flex-shrink-0">
            Jump to Facility:
          </span>
          {resolvedSites.map((site) => {
            const isSelected = site.id === selectedSiteId || site.id === activeSite?.id;
            return (
              <button
                key={site.id}
                onClick={() => {
                  onSelectSite(site);
                  setActiveSite(site);
                  mapRef.current?.panTo({ lat: site.resolvedLat, lng: site.resolvedLng });
                  if ((mapRef.current?.getZoom() ?? 0) < 12) mapRef.current?.setZoom(12);
                }}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[11px] font-normal transition-all ${
                  isSelected
                    ? 'bg-[#EA580C] border-[#EA580C] text-white shadow-xs'
                    : 'bg-white border-[#E8E8E5] text-[#6D6D68] hover:border-[#EA580C] hover:text-[#111111]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    isSelected
                      ? 'bg-white'
                      : site.healthStatus === 'CRITICAL'
                      ? 'bg-[#DC2626]'
                      : site.healthStatus === 'WARNING'
                      ? 'bg-[#D97706]'
                      : 'bg-[#16A34A]'
                  }`}
                />
                <span>{site.name.split('—')[0]?.trim() || site.name}</span>
                <span className={`text-[9.5px] uppercase ${isSelected ? 'text-white/80' : 'text-[#9B9B97]'}`}>
                  ({site.city})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
